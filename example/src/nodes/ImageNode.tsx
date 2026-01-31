import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { createEffect, createMemo, createSignal, JSX, onCleanup, Show } from "solid-js";
import { useLexicalComposerContext } from "lexical-solid/LexicalComposerContext";
import { useLexicalNodeSelection } from "lexical-solid/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import ImageResizer from "../components/ImageResizer";

export interface ImagePayload {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  maxWidth?: number;
  key?: NodeKey;
}

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width: number;
    height: number;
    maxWidth: number;
  },
  SerializedLexicalNode
>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = $createImageNode({ src, altText, width, height });
    return { node };
  }
  return null;
}

export class ImageNode extends DecoratorNode<() => JSX.Element> {
  __src: string;
  __altText: string;
  __width: number;
  __height: number;
  __maxWidth: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__maxWidth,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, width, height, maxWidth } = serializedNode;
    const node = $createImageNode({
      src,
      altText,
      width,
      height,
      maxWidth,
    });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    width?: number,
    height?: number,
    maxWidth?: number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 0;
    this.__height = height || 0;
    this.__maxWidth = maxWidth || 500;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    if (this.__width) {
      element.setAttribute("width", this.__width.toString());
    }
    if (this.__height) {
      element.setAttribute("height", this.__height.toString());
    }
    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      maxWidth: this.__maxWidth,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  getWidth(): number {
    return this.__width;
  }

  getHeight(): number {
    return this.__height;
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  decorate(): () => JSX.Element {
    const src = this.__src;
    const altText = this.__altText;
    const width = this.__width;
    const height = this.__height;
    const maxWidth = this.__maxWidth;
    const nodeKey = this.__key;
    return () => (
      <ImageComponent
        src={src}
        altText={altText}
        width={width}
        height={height}
        maxWidth={maxWidth}
        nodeKey={nodeKey}
      />
    );
  }
}

interface ImageComponentProps {
  src: string;
  altText: string;
  width: number;
  height: number;
  maxWidth: number;
  nodeKey: NodeKey;
}

function ImageComponent(props: ImageComponentProps) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(
    props.nodeKey
  );
  const [isResizing, setIsResizing] = createSignal(false);
  let imageRef: HTMLImageElement | undefined;

  const onDelete = (payload: KeyboardEvent) => {
    if (isSelected() && $isNodeSelection($getSelection())) {
      const event = payload;
      event.preventDefault();
      const node = $getNodeByKey(props.nodeKey);
      if ($isImageNode(node)) {
        node.remove();
        return true;
      }
    }
    return false;
  };

  const onEnter = (event: KeyboardEvent) => {
    const latestSelection = $getSelection();
    if (
      isSelected() &&
      $isNodeSelection(latestSelection) &&
      latestSelection.getNodes().length === 1
    ) {
      event.preventDefault();
      return true;
    }
    return false;
  };

  const onEscape = (event: KeyboardEvent) => {
    if (isSelected()) {
      event.preventDefault();
      clearSelection();
      return true;
    }
    return false;
  };

  createEffect(() => {
    onCleanup(
      mergeRegister(
        editor.registerCommand<MouseEvent>(
          CLICK_COMMAND,
          (payload) => {
            const event = payload;
            if (isResizing()) {
              return true;
            }
            if (event.target === imageRef) {
              if (event.shiftKey) {
                setSelected(!isSelected());
              } else {
                clearSelection();
                setSelected(true);
              }
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_DELETE_COMMAND,
          onDelete,
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_BACKSPACE_COMMAND,
          onDelete,
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
        editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
      )
    );
  });

  const onResizeEnd = (nextWidth: number, nextHeight: number) => {
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(props.nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const draggable = createMemo(() => {
    return editor.getEditorState().read(() => {
      return isSelected() && $isNodeSelection($getSelection());
    });
  });

  return (
    <div draggable={draggable()}>
      <div classList={{ "image-wrapper": true, "focused": isSelected() }}>
        <img
          ref={imageRef}
          src={props.src}
          alt={props.altText}
          style={{
            width: props.width ? `${props.width}px` : "inherit",
            height: props.height ? `${props.height}px` : "inherit",
            "max-width": `${props.maxWidth}px`,
          }}
          draggable="false"
        />
        <Show when={isSelected()}>
          <ImageResizer
            imageRef={imageRef!}
            maxWidth={props.maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        </Show>
      </div>
    </div>
  );
}

export function $createImageNode({
  src,
  altText,
  width,
  height,
  maxWidth,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, width, height, maxWidth, key)
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
