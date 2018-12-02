// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let activeTerminals = {};

function getOrCreateTerminal(prefix) {
    let terminalName = prefix + ' ' +
      vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).name;

    if (activeTerminals[terminalName]) {
        return activeTerminals[terminalName];
    } else {
        const terminal = vscode.window.createTerminal(terminalName);
        activeTerminals[terminalName] = terminal;
        return terminal;
    }
}

vscode.window.onDidCloseTerminal((terminal) => {
    if (activeTerminals[terminal.name]) {
        delete activeTerminals[terminal.name];
    }
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-quick-rspec" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.toggleSpec', async function() {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;
        let fileName = editor.document.fileName;

        const doc = await vscode.workspace.openTextDocument(convertPath(fileName));
        vscode.window.showTextDocument(doc, -1);
    });

    context.subscriptions.push(disposable);

    let disposable2 = vscode.commands.registerCommand('extension.runSpec', function() {
        let terminal = getOrCreateTerminal("rspec");
        terminal.show(true);
        let path = vscode.window.activeTextEditor.document.fileName.replace(vscode.workspace.rootPath + '/', '');
        let line = vscode.window.activeTextEditor.selection.active.line + 1;
        terminal.sendText("bundle exec rspec " + path + ":" + line);
    });

    context.subscriptions.push(disposable2);

    function convertPath(path) {
        // FIXME more correct
        if (path.indexOf("spec/") >= 0) {
            return path.replace(/_spec\.rb$/, ".rb").replace("spec/", "app/");
        }
        return path.replace(/\.rb$/, "_spec.rb").replace("app/", "spec/");
    }

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
