import { useLexicalComposerContext } from "lexical-solid/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { onCleanup, onMount, JSX } from "solid-js";
import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
  INSERT_LAYOUT_COMMAND,
  LayoutContainerNode,
  LayoutItemNode,
  LAYOUT_TEMPLATES,
  LayoutTemplate,
} from "../nodes/LayoutNodes";

export default function LayoutPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  onMount(() => {
    if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
      throw new Error(
        "LayoutPlugin: LayoutContainerNode or LayoutItemNode not registered on editor"
      );
    }

    onCleanup(
      editor.registerCommand(
        INSERT_LAYOUT_COMMAND,
        (template: LayoutTemplate) => {
          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              return;
            }

            const templateColumns = LAYOUT_TEMPLATES[template];
            const columnCount = templateColumns.split(" ").length;

            const container = $createLayoutContainerNode(templateColumns);

            for (let i = 0; i < columnCount; i++) {
              const item = $createLayoutItemNode();
              const paragraph = $createParagraphNode();
              item.append(paragraph);
              container.append(item);
            }

            selection.insertNodes([container]);

            // Select the first paragraph in the first item
            const firstItem = container.getFirstChild();
            if (firstItem && $isElementNode(firstItem)) {
              const firstParagraph = firstItem.getFirstChild();
              if (firstParagraph && $isElementNode(firstParagraph)) {
                firstParagraph.select();
              }
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  });

  return null;
}
