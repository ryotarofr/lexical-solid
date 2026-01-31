import { useLexicalComposerContext } from "lexical-solid/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { onCleanup, onMount, JSX } from "solid-js";
import {
  $createFigmaNode,
  INSERT_FIGMA_COMMAND,
  FigmaNode,
} from "../nodes/FigmaNode";

export default function FigmaPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  onMount(() => {
    if (!editor.hasNodes([FigmaNode])) {
      throw new Error("FigmaPlugin: FigmaNode not registered on editor");
    }

    onCleanup(
      editor.registerCommand<string>(
        INSERT_FIGMA_COMMAND,
        (payload) => {
          const figmaNode = $createFigmaNode(payload);
          $insertNodes([figmaNode]);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  });

  return null;
}
