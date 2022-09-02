# VSCode Composite Formatter

[![GitHub](https://img.shields.io/github/license/34j/vscode-composite-formatter?logo=github&logoColor=%23181717)](https://github.com/34j/vscode-composite-formatter)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/mikoz.composite-formatter?logo=visual-studio-code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=mikoz.composite-formatter)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mikoz.composite-formatter)](https://marketplace.visualstudio.com/items?itemName=mikoz.composite-formatter)

VSCode Formatter that Runs Multiple Formatters.

[![Install Now](https://img.shields.io/badge/-Install%20Now-107C10?style=for-the-badge&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=mikoz.composite-formatter)

## Features

- Runs multiple formatters.

## Extension Settings

This extension contributes the following settings:

- `composite-formatter.formatterSetting`: `FormatterSetting[]`
Example:

```json
"composite-formatter.formatterSettings": [
  {
    "name": "CompositeFormatter1",
    "selector": {
        "language": "python"
    },
    "formatters": [
        "ms-python.python"
    ]
  }
],
```

To be pricise,

```typescript
type FormatterSetting = {
    name: string;//This value will no be used, just for memo.
    selector: vscode.DocumentSelector;//Document Selector, like {'language'='python'}
    formatters: string[];//Array of formatter ids, like ['ms-python.python']
};

declare module 'vscode' {
    export type DocumentSelector = DocumentFilter | string | Array<DocumentFilter | string>;
    export interface DocumentFilter {
        language?: string;//A language id, like `typescript`.
        scheme?: string;//A Uri [scheme](#Uri.scheme), like `file` or `untitled`.
        pattern?: GlobPattern;//A glob pattern that is matched on the absolute path of the document. Use a relative pattern to filter documents to a workspace folder.
    }
}
```

It is not possible to provide more than one Composite Formatter for the same language. This is a VSCode specification.
See Also: [Support multiple formatters for a single file · Issue \#142904 · microsoft/vscode](https://github.com/microsoft/vscode/issues/142904)

<!--https://coding.tools/regex-replace Replace \n with \n and " with \" -->