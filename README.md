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

- `composite-formatter.formatters`: `string[]`
- `composite-formatter.language`: `string`
- `composite-formatter.scheme`: `string`
- `composite-formatter.pattern`: `string`

It is not possible to provide more than one Composite Formatter for the same language. This is a VSCode specification.
See Also: [Support multiple formatters for a single file · Issue \#142904 · microsoft/vscode](https://github.com/microsoft/vscode/issues/142904)

<!--https://coding.tools/regex-replace Replace \n with \n and " with \" -->