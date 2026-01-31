import { useLexicalComposerContext } from "lexical-solid/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  NodeKey,
} from "lexical";
import { onCleanup, onMount, JSX } from "solid-js";
import { mergeRegister } from "@lexical/utils";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createCollapsibleContainerNode,
  $createCollapsibleContentNode,
  $createCollapsibleTitleNode,
  $isCollapsibleContainerNode,
  $isCollapsibleContentNode,
  $isCollapsibleTitleNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  INSERT_COLLAPSIBLE_COMMAND,
  TOGGLE_COLLAPSIBLE_COMMAND,
} from "../nodes/CollapsibleNodes";

export default function CollapsiblePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  onMount(() => {
    if (
      !editor.hasNodes([
        CollapsibleContainerNode,
        CollapsibleTitleNode,
        CollapsibleContentNode,
      ])
    ) {
      throw new Error(
        "CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, or CollapsibleContentNode not registered on editor"
      );
    }

    onCleanup(
      mergeRegister(
        // Handle insert collapsible command
        editor.registerCommand(
          INSERT_COLLAPSIBLE_COMMAND,
          () => {
            editor.update(() => {
              const selection = $getSelection();

              if (!$isRangeSelection(selection)) {
                return;
              }

              const title = $createCollapsibleTitleNode();
              const paragraph = $createParagraphNode();
              title.append(paragraph);

              const content = $createCollapsibleContentNode();
              const contentParagraph = $createParagraphNode();
              content.append(contentParagraph);

              const container = $createCollapsibleContainerNode(true);
              container.append(title);
              container.append(content);

              selection.insertNodes([container]);
              paragraph.select();
            });

            return true;
          },
          COMMAND_PRIORITY_EDITOR
        ),

        // Handle toggle collapsible command
        editor.registerCommand(
          TOGGLE_COLLAPSIBLE_COMMAND,
          (key: NodeKey) => {
            editor.update(() => {
              const node = $getNodeByKey(key);
              if ($isCollapsibleContainerNode(node)) {
                node.toggleOpen();
              }
            });

            return true;
          },
          COMMAND_PRIORITY_EDITOR
        ),

        // Handle arrow navigation
        editor.registerCommand(
          KEY_ARROW_DOWN_COMMAND,
          (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
              return false;
            }

            const node = selection.anchor.getNode();
            const container = $findMatchingParent(node, $isCollapsibleContainerNode);

            if (container && !container.getOpen()) {
              const sibling = container.getNextSibling();
              if (sibling) {
                sibling.selectStart();
                event?.preventDefault();
                return true;
              }
            }

            return false;
          },
          COMMAND_PRIORITY_LOW
        ),

        editor.registerCommand(
          KEY_ARROW_UP_COMMAND,
          (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
              return false;
            }

            const node = selection.anchor.getNode();
            const container = $findMatchingParent(node, $isCollapsibleContainerNode);

            if (container && !container.getOpen()) {
              const sibling = container.getPreviousSibling();
              if (sibling) {
                sibling.selectEnd();
                event?.preventDefault();
                return true;
              }
            }

            return false;
          },
          COMMAND_PRIORITY_LOW
        ),

        editor.registerCommand(
          KEY_ARROW_LEFT_COMMAND,
          (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
              return false;
            }

            const node = selection.anchor.getNode();
            const title = $findMatchingParent(node, $isCollapsibleTitleNode);

            if (title && selection.anchor.offset === 0) {
              const container = title.getParent();
              if ($isCollapsibleContainerNode(container)) {
                container.setOpen(false);
                event?.preventDefault();
                return true;
              }
            }

            return false;
          },
          COMMAND_PRIORITY_LOW
        ),

        editor.registerCommand(
          KEY_ARROW_RIGHT_COMMAND,
          (event) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
              return false;
            }

            const node = selection.anchor.getNode();
            const title = $findMatchingParent(node, $isCollapsibleTitleNode);

            if (title) {
              const container = title.getParent();
              if ($isCollapsibleContainerNode(container) && !container.getOpen()) {
                container.setOpen(true);
                event?.preventDefault();
                return true;
              }
            }

            return false;
          },
          COMMAND_PRIORITY_LOW
        )
      )
    );
  });

  return null;
}
