import * as vscode from 'vscode';
import { PreviewPanel } from './previewPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Device Frame Preview extension is now active');

    const openPreview = vscode.commands.registerCommand('deviceFramePreview.openPreview', () => {
        PreviewPanel.createOrShow(context.extensionUri);
    });

    const reloadPreview = vscode.commands.registerCommand('deviceFramePreview.reload', () => {
        PreviewPanel.reload();
    });

    const rotateDevice = vscode.commands.registerCommand('deviceFramePreview.rotate', () => {
        PreviewPanel.rotate();
    });

    context.subscriptions.push(openPreview, reloadPreview, rotateDevice);
}

export function deactivate() {}
