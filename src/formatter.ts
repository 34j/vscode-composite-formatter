// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * Settings for each composite formatter
 */
type FormatterSetting = {
    selector: vscode.DocumentSelector;
    formatters: string[];
};

function isNullOrWhitespace(str: string | undefined | null): boolean {
    return !str || !str.trim();
}

export class CompositeFormatter {
    /**
     * Disposables that should be disposed when the extension is deactivated.
     */
    private disposables: { dispose(): any }[] = [];

    /**
     * Refresh composite formatters.
     * @returns Disposables that should be disposed when the extension is deactivated.
     */
    public async refreshFormatters(): Promise<{ dispose(): any }[]> {
        this.disposables.forEach(s => s.dispose());
        this.disposables = [];

        // Set all formatter settings.
        const config = vscode.workspace.getConfiguration('composite-formatter', vscode.window.activeTextEditor?.document.uri);
        const formatterSetting: FormatterSetting = {
            selector: {
                language: CompositeFormatter.verifyString(config.get('language')),
                scheme: CompositeFormatter.verifyString(config.get('scheme')),
                pattern: CompositeFormatter.verifyString(config.get('pattern'))
            },
            formatters: config.get('formatters') ?? []
        };
        console.info('Refreshing Composite Formatter.');
        console.log(formatterSetting);

        let disposable = vscode.languages.registerDocumentFormattingEditProvider(formatterSetting.selector, {
            async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
                //const config = vscode.workspace.getConfiguration('composite-formatter', vscode.window.activeTextEditor?.document.uri);
                //await CompositeFormatter.runMultipleFormatters(config.get('formatters') ?? []);
                await CompositeFormatter.runMultipleFormatters(formatterSetting.formatters);
                return [];
            }
        });
        this.disposables.push(disposable);

        return this.disposables.map(s => s);
    }

    private static verifyString(str: string | undefined | null): string | undefined {
        if (!str || !str.trim()) {
            return undefined;
        }
        return str;
    }

    /**
    * Run multiple formatters at once, modifying the configuration.
    * @param formatters Formatter ids.
    * @param verbose Show more information in the console. (very slight performance change)
    */
    private static async runMultipleFormatters(formatters: string[], verbose: boolean = false) {
        if (!vscode.window.activeTextEditor){
            return;
        }
        const editorConfig = vscode.workspace.getConfiguration('editor', vscode.window.activeTextEditor?.document);
        const initialFormatter = await editorConfig.get('defaultFormatter');
        for (const formatter of formatters) {
            // This won't work: await vscode.commands.executeCommand('editor.action.formatDocument.multiple', formatter)
            // Just shows window.
            // setting to vscode.ConfigurationTarget.WorkspaceFolder will not work.
            await editorConfig.update('defaultFormatter', formatter, vscode.ConfigurationTarget.Workspace);
            if (verbose) {
                const debugEditorConfig = vscode.workspace.getConfiguration('editor', vscode.window.activeTextEditor?.document.uri);
                const configFormatter = await debugEditorConfig.get('defaultFormatter');
                if (formatter !== configFormatter) {
                    console.error(`${formatter} != ${configFormatter} ERROR`);
                }
                else {
                    console.log(`${formatter} = ${configFormatter}`);
                }
            }
            await vscode.commands.executeCommand('editor.action.formatDocument');
        }
        await editorConfig.update('defaultFormatter', initialFormatter, vscode.ConfigurationTarget.Workspace);
    }
}