// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CompositeFormatter } from './formatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Composite Formatter: activated.');

	// Model class
	const compositeFormatter = new CompositeFormatter();

	// Initialize formatters
	const disposables = await compositeFormatter.refreshFormatters();
	// Add to subscriptions
	disposables.forEach(d => context.subscriptions.push(d));

	// Refresh formatters when command is called
	let disposable = vscode.commands.registerCommand('composite-formatter.refresh', async () => {
		const disposables = await compositeFormatter.refreshFormatters();
		disposables.forEach(d => context.subscriptions.push(d));
        vscode.window.showInformationMessage('Composite Formatter: refreshed.');
	});
	// Add to subscriptions
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log("Composite Formatter: deactivated.");
}

