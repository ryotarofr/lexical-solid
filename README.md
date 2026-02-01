# @ryotarofr/lexical-solid

SolidJS port of `@lexical/react` - A powerful rich text editor framework for SolidJS.

This is a fork of [lexical-solid](https://github.com/mosheduminer/lexical-solid) by Moshe David Uminer, with updates and improvements.

## Example

[view demo](https://lexical-solid-example.vercel.app/)

## Installation

```bash
npm install @ryotarofr/lexical-solid
```

or using your preferred package manager:

```bash
pnpm add @ryotarofr/lexical-solid
yarn add @ryotarofr/lexical-solid
```

## Lexical Dependencies

Currently using lexical packages version `0.39.0`, ported from [@lexical/react](https://www.npmjs.com/package/@lexical/react) of the same version.

This package pins `lexical` and the `@lexical/*` packages to specific minor versions.

## Basic Usage

```tsx
import { LexicalComposer } from "@ryotarofr/lexical-solid/LexicalComposer";
import { RichTextPlugin } from "@ryotarofr/lexical-solid/LexicalRichTextPlugin";
import { ContentEditable } from "@ryotarofr/lexical-solid/LexicalContentEditable";
import { HistoryPlugin } from "@ryotarofr/lexical-solid/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@ryotarofr/lexical-solid/LexicalErrorBoundary";

const initialConfig = {
  namespace: "MyEditor",
  theme: {},
  onError: (error: Error) => console.error(error),
};

function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        errorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
```

## Available Plugins

- `LexicalComposer` - Core composer component
- `RichTextPlugin` / `PlainTextPlugin` - Text editing plugins
- `HistoryPlugin` - Undo/redo support
- `LinkPlugin` - Link handling
- `ListPlugin` - Ordered/unordered lists
- `CheckListPlugin` - Checkbox lists
- `TablePlugin` - Table support
- `MarkdownShortcutPlugin` - Markdown shortcuts
- `AutoFocusPlugin` - Auto focus on mount
- `OnChangePlugin` - Editor state change listener
- And more...

## License

MIT License - See [LICENSE](./LICENSE) for details.

This project is based on [@lexical/react](https://github.com/facebook/lexical) by Meta Platforms, Inc. (MIT License).
