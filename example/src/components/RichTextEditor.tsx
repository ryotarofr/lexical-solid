import {
  $getRoot,
  $getSelection,
  EditorState,
  Klass,
  LexicalEditor,
  LexicalNode,
  LexicalNodeReplacement,
} from "lexical";
import { LinkNode } from "@lexical/link";
import { AutoLinkNode } from "@lexical/link";
import "./RichTextEditor.css";
import { LinkPlugin } from "lexical-solid/LexicalLinkPlugin";
import { ListPlugin } from "lexical-solid/LexicalListPlugin";
import { CheckListPlugin } from "lexical-solid/LexicalCheckListPlugin";
import { HorizontalRulePlugin } from "lexical-solid/LexicalHorizontalRulePlugin";
import { HorizontalRuleNode } from "lexical-solid/LexicalHorizontalRuleNode";
import { LexicalMarkdownShortcutPlugin } from "lexical-solid/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { OnChangePlugin } from "lexical-solid/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "lexical-solid/LexicalAutoFocusPlugin";
import { LexicalComposer } from "lexical-solid/LexicalComposer";
import { RichTextPlugin } from "lexical-solid/LexicalRichTextPlugin";
import { ContentEditable } from "lexical-solid/LexicalContentEditable";
import { HistoryPlugin } from "lexical-solid/LexicalHistoryPlugin";
import TreeViewPlugin from "../plugins/TreeViewPlugin";
import CodeHighlightPlugin from "~/plugins/CodeHighlightPlugin";
import ToolbarPlugin from "~/plugins/ToolbarPlugin";
import RichTextTheme from "./RichTextTheme";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { TablePlugin } from "lexical-solid/LexicalTablePlugin";
import { LexicalErrorBoundary } from "lexical-solid/LexicalErrorBoundary";
import { TRANSFORMERS } from "@lexical/markdown";
import { ImageNode } from "../nodes/ImageNode";
import ImagesPlugin from "../plugins/ImagesPlugin";
import FloatingTextFormatToolbarPlugin from "../plugins/FloatingTextFormatToolbarPlugin";
import ComponentPickerPlugin from "../plugins/ComponentPickerPlugin";
import EmojiPickerPlugin from "../plugins/EmojiPickerPlugin";
import MentionsPlugin from "../plugins/MentionsPlugin";
import { MentionNode } from "../nodes/MentionNode";
import YouTubePlugin from "../plugins/YouTubePlugin";
import { YouTubeNode } from "../nodes/YouTubeNode";
import TwitterPlugin from "../plugins/TwitterPlugin";
import { TweetNode } from "../nodes/TweetNode";
import AutoEmbedPlugin from "../plugins/AutoEmbedPlugin";
import FigmaPlugin from "../plugins/FigmaPlugin";
import { FigmaNode } from "../nodes/FigmaNode";
import CollapsiblePlugin from "../plugins/CollapsiblePlugin";
import {
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
} from "../nodes/CollapsibleNodes";
import LayoutPlugin from "../plugins/LayoutPlugin";
import { LayoutContainerNode, LayoutItemNode } from "../nodes/LayoutNodes";
import PageBreakPlugin from "../plugins/PageBreakPlugin";
import { PageBreakNode } from "../nodes/PageBreakNode";
//import { EmojiNode } from "./nodes/EmojiNode";
//import EmoticonPlugin from "./plugins/EmoticonPlugin";

function Placeholder() {
  return <div class="editor-placeholder">Enter some plain text...</div>;
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(
  editorState: EditorState,
  tags: Set<string>,
  editor: LexicalEditor
) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

const editorConfig = {
  // The editor theme
  theme: RichTextTheme,
  namespace: "",
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HorizontalRuleNode,
    ImageNode,
    MentionNode,
    YouTubeNode,
    TweetNode,
    FigmaNode,
    CollapsibleContainerNode,
    CollapsibleTitleNode,
    CollapsibleContentNode,
    LayoutContainerNode,
    LayoutItemNode,
    PageBreakNode,
  ] as ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>,
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div class="editor-container">
        <ToolbarPlugin />
        <div class="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable class="editor-input" />}
            placeholder={<Placeholder />}
            errorBoundary={LexicalErrorBoundary}
          />
          <LinkPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <ImagesPlugin />
          <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
          <LexicalMarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <TreeViewPlugin />
          <CodeHighlightPlugin />
          <FloatingTextFormatToolbarPlugin />
          <ComponentPickerPlugin />
          <EmojiPickerPlugin />
          <MentionsPlugin />
          <YouTubePlugin />
          <TwitterPlugin />
          <AutoEmbedPlugin />
          <FigmaPlugin />
          <CollapsiblePlugin />
          <LayoutPlugin />
          <PageBreakPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
