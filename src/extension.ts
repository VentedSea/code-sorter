import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.sortLines', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            if (selection && !selection.isEmpty) {
                const range = new vscode.Range(selection.start, selection.end);
                const text = document.getText(range);
                const lines = text.split('\n');

                const config = vscode.workspace.getConfiguration('lineSorter');
                const sortMethod = config.get<string>('sortMethod', 'length');

                let sortedLines: string[];
                if (sortMethod === 'length') {
                    sortedLines = lines.sort((a, b) => a.length - b.length);
                } else {
                    sortedLines = lines.sort((a, b) => a.localeCompare(b));
                }

                const sortedText = sortedLines.join('\n');

                editor.edit(editBuilder => {
                    editBuilder.replace(range, sortedText);
                });
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}