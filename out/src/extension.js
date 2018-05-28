'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var piff = require("piff");
var fs = require("fs");
function activate(context) {
    console.log('registering piff');
    function compilePiff(document) {
        var piffCode = document.getText();
        var phpCode = piff.transpile(piffCode);
        var phpPath = document.uri.fsPath.replace(/[.]piff$/, '.php');
        fs.writeFile(phpPath, phpCode, {
            encoding: 'utf-8'
        }, function (err) {
            console.error(err);
        });
        return phpPath;
    }
    vscode.workspace.onDidSaveTextDocument(function (document) {
        compilePiff(document);
    });
    vscode.languages.registerDocumentFormattingEditProvider('piff', {
        provideDocumentFormattingEdits: function (document) {
            var phpPath = document.uri.fsPath.replace(/[.]piff$/, '.php');
            var compiled = compilePiff(document);
            var piffCode = document.getText();
            var firstLine = document.lineAt(0);
            var lastLine = document.lineAt(document.lineCount - 1);
            var fullRange = new vscode.Range(0, firstLine.range.start.character, document.lineCount - 1, lastLine.range.end.character);
            var formatted = piff.format(piffCode);
            return [vscode.TextEdit.replace(fullRange, formatted)];
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map