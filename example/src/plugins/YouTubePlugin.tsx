import { useLexicalComposerContext } from "lexical-solid/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { onCleanup, onMount, JSX } from "solid-js";
import {
  $createYouTubeNode,
  INSERT_YOUTUBE_COMMAND,
  YouTubeNode,
} from "../nodes/YouTubeNode";

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  onMount(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }

    onCleanup(
      editor.registerCommand<string>(
        INSERT_YOUTUBE_COMMAND,
        (payload) => {
          const youTubeNode = $createYouTubeNode(payload);
          $insertNodes([youTubeNode]);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  });

  return null;
}
