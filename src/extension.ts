'use strict';

import * as vscode from 'vscode';
import * as piff from 'piff'
import * as fs from 'fs'

function compilePiff(document) {
    const piffCode = document.getText()
    const phpCode = piff.transpile(piffCode)
    const phpPath = document.uri.fsPath.replace(/[.]piff$/, '.php')

    fs.writeFile(phpPath, phpCode, {
        encoding: 'utf-8'
    }, err => {
        if (err)
            console.error(err)
    })

    return phpPath
}


export function activate(context: vscode.ExtensionContext) {
    let diagnosticCollection = vscode.languages.createDiagnosticCollection('piff');
    context.subscriptions.push(diagnosticCollection);

    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === 'piff') {
            diagnosticCollection.clear();
            try {
                compilePiff(document)
            } catch (err) {
                let diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();
                let canonicalFile = vscode.Uri.file(document.uri.fsPath).toString();
                let range = new vscode.Range(
                    err.location.start.line - 1,
                    err.location.start.column,
                    err.location.end.line - 1,
                    err.location.end.column);
                diagnosticCollection.set(document.uri, [new vscode.Diagnostic(range, err.message, vscode.DiagnosticSeverity.Error)])
            }
        }
    })

    vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file', language: 'piff' },
        {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                const piffCode = document.getText()
                const firstLine = document.lineAt(0);
                const lastLine = document.lineAt(document.lineCount - 1);

                const fullRange = new vscode.Range(0,
                    firstLine.range.start.character,
                    document.lineCount - 1,
                    lastLine.range.end.character);

                const formatted = piff.format(piffCode);

                return [vscode.TextEdit.replace(fullRange, formatted)];
            }
        });



}

