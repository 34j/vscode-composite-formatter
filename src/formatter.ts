// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * Settings for each composite formatter
 */
type FormatterSetting = {
    name: string;
    selector: vscode.DocumentSelector;
    formatters: string[];
};

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
        for (const formatterSetting of await CompositeFormatter.getFormatterSettings()) {
            // See: https://code.visualstudio.com/blogs/2016/11/15/formatters-best-practices
            let disposable = vscode.languages.registerDocumentFormattingEditProvider(formatterSetting.selector, {
                async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
                    await CompositeFormatter.runMultipleFormatters(formatterSetting.formatters);
                    return [];
                }
            });
            this.disposables.push(disposable);
        }
        
        return this.disposables.map(s => s);
    }

    /**
     * Get formatter settings.
     * @returns Formatter settings.
     */
    private static async getFormatterSettings(): Promise<FormatterSetting[]> {
        // Get Configuration
        const config = vscode.workspace.getConfiguration('composite-formatter', vscode.window.activeTextEditor?.document);
        const formatterSettings = config.get<FormatterSetting[]>('formatterSettings');

        // If json could not be parsed, show error.
        if (!formatterSettings) {
            vscode.window.showErrorMessage('composite-formatter.formatterSettings could not be parsed. See the documentation: https://github.com/34j/vscode-composite-formatter and after configuring formatters run `Composite Formatter: Refresh Composite Formatter`.');
            return [];
        }
        return formatterSettings;
    }

    /**
    * Run multiple formatters at once, modifying the configuration.
    * @param formatters Formatter ids.
    * @param verbose Show more information in the console. (very slight performance change)
    */
    private static async runMultipleFormatters(formatters: string[], verbose: boolean = false) {
        const editorConfig = vscode.workspace.getConfiguration('editor', vscode.window.activeTextEditor?.document);
        const initialFormatter = await editorConfig.get('defaultFormatter');
        for (const formatter of formatters) {
            await editorConfig.update('defaultFormatter', formatter, vscode.ConfigurationTarget.WorkspaceFolder);
            if (verbose) {
                const debugEditorConfig = vscode.workspace.getConfiguration('editor', vscode.window.activeTextEditor?.document);
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
        await editorConfig.update('defaultFormatter', initialFormatter, vscode.ConfigurationTarget.WorkspaceFolder);
    }
}