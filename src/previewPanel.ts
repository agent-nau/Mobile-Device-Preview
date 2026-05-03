import * as vscode from 'vscode';
import { getNonce } from './util';

export interface DeviceSpec {
    id: string;
    name: string;
    width: number;
    height: number;
    frameColor: string;
    bezelRadius: number;
    bezelWidth: number;
    hasNotch: boolean;
    notchWidth: number;
    notchHeight: number;
    isTablet: boolean;
}

export const DEVICES: DeviceSpec[] = [
    {
        id: 'iphone17promax',
        name: 'iPhone 17 Pro Max',
        width: 430,
        height: 932,
        frameColor: '#1c1c1e',
        bezelRadius: 59,
        bezelWidth: 15,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'iphone16',
        name: 'iPhone 16',
        width: 393,
        height: 852,
        frameColor: '#1a1a1a',
        bezelRadius: 55,
        bezelWidth: 14,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'iphone16pro',
        name: 'iPhone 16 Pro',
        width: 402,
        height: 874,
        frameColor: '#1c1c1e',
        bezelRadius: 58,
        bezelWidth: 14,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'iphone15',
        name: 'iPhone 15',
        width: 393,
        height: 852,
        frameColor: '#1a1a1a',
        bezelRadius: 55,
        bezelWidth: 14,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'iphone14pro',
        name: 'iPhone 14 Pro',
        width: 393,
        height: 852,
        frameColor: '#1a1a1a',
        bezelRadius: 55,
        bezelWidth: 14,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'iphone13',
        name: 'iPhone 13',
        width: 390,
        height: 844,
        frameColor: '#1a1a1a',
        bezelRadius: 48,
        bezelWidth: 12,
        hasNotch: true,
        notchWidth: 160,
        notchHeight: 30,
        isTablet: false
    },
    {
        id: 'iphone12',
        name: 'iPhone 12',
        width: 390,
        height: 844,
        frameColor: '#1a1a1a',
        bezelRadius: 47,
        bezelWidth: 12,
        hasNotch: true,
        notchWidth: 160,
        notchHeight: 30,
        isTablet: false
    },
    {
        id: 'iphoneSE',
        name: 'iPhone SE',
        width: 375,
        height: 667,
        frameColor: '#1a1a1a',
        bezelRadius: 20,
        bezelWidth: 10,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'pixel9',
        name: 'Pixel 9',
        width: 411,
        height: 891,
        frameColor: '#111111',
        bezelRadius: 40,
        bezelWidth: 12,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'pixel8',
        name: 'Pixel 8',
        width: 412,
        height: 915,
        frameColor: '#111111',
        bezelRadius: 38,
        bezelWidth: 12,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'galaxyS24',
        name: 'Galaxy S24',
        width: 412,
        height: 915,
        frameColor: '#0a0a0a',
        bezelRadius: 30,
        bezelWidth: 10,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'galaxyS23',
        name: 'Galaxy S23',
        width: 412,
        height: 915,
        frameColor: '#0a0a0a',
        bezelRadius: 28,
        bezelWidth: 10,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: false
    },
    {
        id: 'ipadPro11',
        name: 'iPad Pro 11"',
        width: 834,
        height: 1194,
        frameColor: '#1c1c1e',
        bezelRadius: 28,
        bezelWidth: 16,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: true
    },
    {
        id: 'ipadPro13',
        name: 'iPad Pro 13"',
        width: 1024,
        height: 1366,
        frameColor: '#1c1c1e',
        bezelRadius: 30,
        bezelWidth: 16,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: true
    },
    {
        id: 'pixelTablet',
        name: 'Pixel Tablet',
        width: 800,
        height: 1280,
        frameColor: '#151515',
        bezelRadius: 24,
        bezelWidth: 14,
        hasNotch: false,
        notchWidth: 0,
        notchHeight: 0,
        isTablet: true
    }
];

export class PreviewPanel {
    public static currentPanel: PreviewPanel | undefined;
    private static readonly viewType = 'deviceFramePreview';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(() => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.ViewColumn.Beside;

        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            PreviewPanel.viewType,
            'Device Preview',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri);
    }

    public static reload() {
        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.webview.postMessage({ command: 'reload' });
        }
    }

    public static rotate() {
        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.webview.postMessage({ command: 'rotate' });
        }
    }

    public dispose() {
        PreviewPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const config = vscode.workspace.getConfiguration('deviceFramePreview');
        const defaultUrl = config.get<string>('defaultUrl', 'http://localhost:3000');
        const defaultDevice = config.get<string>('defaultDevice', 'iphone17promax');

        const nonce = getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src *; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:;">
    <title>Device Preview</title>
    <style nonce="${nonce}">
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg: #0d0d0d;
            --surface: #1a1a1a;
            --surface-hover: #252525;
            --border: #2a2a2a;
            --text: #e0e0e0;
            --text-muted: #888;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --danger: #ef4444;
            --success: #22c55e;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Toolbar */
        .toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
            min-height: 52px;
        }

        .toolbar-group {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .toolbar-group.divider {
            padding-left: 12px;
            border-left: 1px solid var(--border);
        }

        .url-bar {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 6px 12px;
            transition: border-color 0.2s;
        }

        .url-bar:focus-within {
            border-color: var(--accent);
        }

        .url-bar input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--text);
            font-size: 13px;
            outline: none;
            font-family: inherit;
        }

        .url-bar input::placeholder {
            color: var(--text-muted);
        }

        .url-bar .protocol {
            color: var(--success);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 7px 12px;
            border: none;
            border-radius: 6px;
            background: var(--surface-hover);
            color: var(--text);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
            white-space: nowrap;
        }

        .btn:hover {
            background: #333;
        }

        .btn:active {
            transform: scale(0.97);
        }

        .btn.primary {
            background: var(--accent);
            color: white;
        }

        .btn.primary:hover {
            background: var(--accent-hover);
        }

        .btn.icon-only {
            padding: 7px;
            width: 32px;
            height: 32px;
        }

        .btn svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        select {
            appearance: none;
            background: var(--surface-hover);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 7px 28px 7px 10px;
            font-size: 12px;
            font-family: inherit;
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 8px center;
        }

        select:focus {
            outline: none;
            border-color: var(--accent);
        }

        /* Main preview area */
        .preview-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            overflow: auto;
            position: relative;
        }

        .device-wrapper {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            transform-origin: center center;
        }

        .device-frame {
            background: var(--frame-color, #1a1a1a);
            border-radius: var(--bezel-radius, 55px);
            padding: var(--bezel-width, 14px);
            box-shadow: 
                0 0 0 1px rgba(255,255,255,0.05),
                0 25px 50px -12px rgba(0,0,0,0.8),
                0 0 0 0.5px rgba(255,255,255,0.02) inset;
            position: relative;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .device-frame::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -2px;
            width: 3px;
            height: 40px;
            background: linear-gradient(180deg, #333, #222);
            border-radius: 2px 0 0 2px;
            transform: translateY(-50%);
            opacity: 0.6;
        }

        .device-frame::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -2px;
            width: 3px;
            height: 60px;
            background: linear-gradient(180deg, #333, #222);
            border-radius: 0 2px 2px 0;
            transform: translateY(-50%);
            opacity: 0.6;
        }

        .device-screen {
            background: #000;
            border-radius: calc(var(--bezel-radius, 55px) - var(--bezel-width, 14px));
            overflow: hidden;
            position: relative;
            width: var(--width, 393px);
            height: var(--height, 852px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .device-screen iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        }

        /* Dynamic Island / Notch */
        .notch {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: var(--frame-color, #1a1a1a);
            border-radius: 0 0 18px 18px;
            z-index: 10;
            transition: all 0.4s ease;
        }

        .notch.dynamic-island {
            width: 100px;
            height: 28px;
            border-radius: 20px;
            top: 10px;
        }

        .notch.classic {
            width: 160px;
            height: 30px;
            border-radius: 0 0 16px 16px;
        }

        /* Home indicator */
        .home-indicator {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            z-index: 10;
        }

        /* Status bar */
        .status-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            font-size: 14px;
            font-weight: 600;
            color: white;
            z-index: 5;
            pointer-events: none;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .status-bar .time {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }

        .status-bar .icons {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        .status-bar .icons.right {
            margin-left: auto;
        }

        /* Zoom controls */
        .zoom-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 4px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 4px;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .zoom-controls .btn {
            padding: 6px 10px;
            font-size: 13px;
            font-weight: 600;
        }

        .zoom-value {
            display: flex;
            align-items: center;
            padding: 0 8px;
            font-size: 12px;
            color: var(--text-muted);
            min-width: 40px;
            justify-content: center;
        }

        /* Scale wrapper for zoom */
        .scale-wrapper {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            transform-origin: center center;
        }

        /* Loading overlay */
        .loading-overlay {
            position: absolute;
            inset: 0;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            z-index: 20;
            transition: opacity 0.3s;
        }

        .loading-overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .spinner {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(255,255,255,0.1);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loading-text {
            font-size: 13px;
            color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 500px) {
            .toolbar {
                flex-wrap: wrap;
                gap: 6px;
                padding: 8px;
            }
            .url-bar {
                order: -1;
                width: 100%;
                flex: none;
            }
        }

        /* Tablet specific */
        .device-frame.tablet .device-screen {
            border-radius: calc(var(--bezel-radius, 28px) - var(--bezel-width, 16px));
        }

        .device-frame.tablet::before,
        .device-frame.tablet::after {
            display: none;
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-group">
            <button class="btn icon-only" id="btnBack" title="Back">
                <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="btn icon-only" id="btnForward" title="Forward">
                <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <button class="btn icon-only" id="btnReload" title="Reload (Ctrl+R)">
                <svg viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>
        </div>

        <div class="url-bar">
            <span class="protocol" id="protocolBadge">HTTPS</span>
            <input type="text" id="urlInput" placeholder="Enter URL (e.g. http://localhost:3000)" value="${defaultUrl}">
        </div>

        <div class="toolbar-group divider">
            <select id="deviceSelect">
                ${DEVICES.map(d => `<option value="${d.id}" ${d.id === defaultDevice ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
            <button class="btn icon-only" id="btnRotate" title="Rotate">
                <svg viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>
        </div>
    </div>

    <div class="preview-container" id="previewContainer">
        <div class="scale-wrapper" id="scaleWrapper">
            <div class="device-wrapper" id="deviceWrapper">
                <div class="device-frame" id="deviceFrame">
                    <div class="device-screen" id="deviceScreen">
                        <div class="loading-overlay" id="loadingOverlay">
                            <div class="spinner"></div>
                            <div class="loading-text">Loading preview...</div>
                        </div>
                        <div class="status-bar" id="statusBar">
                            <div class="icons">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>
                            </div>
                            <span class="time" id="clock">12:00</span>
                            <div class="icons right">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 18h2v-6H1v6zm4 0h2V8H5v10zm4 0h2v-4H9v4zm4 0h2v-7h-2v7zm4 0h2v-10h-2v10z"/></svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 4h-3V2h-4v2H7v18h10V4zm-4 16h-2v-2h2v2zm0-4h-2V8h2v8z"/></svg>
                            </div>
                        </div>
                        <div class="notch" id="notch"></div>
                        <iframe id="previewFrame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"></iframe>
                        <div class="home-indicator" id="homeIndicator"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="zoom-controls">
        <button class="btn" id="btnZoomOut">−</button>
        <div class="zoom-value" id="zoomValue">100%</div>
        <button class="btn" id="btnZoomIn">+</button>
        <button class="btn" id="btnFit">Fit</button>
    </div>

    <script nonce="${nonce}">
        const devices = ${JSON.stringify(DEVICES)};
        let currentDevice = devices.find(d => d.id === '${defaultDevice}') || devices[0];
        let isLandscape = false;
        let currentZoom = 1;
        let historyStack = [];
        let historyIndex = -1;

        const els = {
            urlInput: document.getElementById('urlInput'),
            deviceSelect: document.getElementById('deviceSelect'),
            deviceFrame: document.getElementById('deviceFrame'),
            deviceScreen: document.getElementById('deviceScreen'),
            previewFrame: document.getElementById('previewFrame'),
            notch: document.getElementById('notch'),
            homeIndicator: document.getElementById('homeIndicator'),
            statusBar: document.getElementById('statusBar'),
            scaleWrapper: document.getElementById('scaleWrapper'),
            zoomValue: document.getElementById('zoomValue'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            protocolBadge: document.getElementById('protocolBadge'),
            clock: document.getElementById('clock')
        };

        function updateClock() {
            const now = new Date();
            els.clock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        setInterval(updateClock, 1000);
        updateClock();

        function applyDevice(device) {
            currentDevice = device;
            const w = isLandscape ? device.height : device.width;
            const h = isLandscape ? device.width : device.height;

            els.deviceFrame.style.setProperty('--frame-color', device.frameColor);
            els.deviceFrame.style.setProperty('--bezel-radius', device.bezelRadius + 'px');
            els.deviceFrame.style.setProperty('--bezel-width', device.bezelWidth + 'px');
            els.deviceScreen.style.setProperty('--width', w + 'px');
            els.deviceScreen.style.setProperty('--height', h + 'px');
            els.deviceScreen.style.width = w + 'px';
            els.deviceScreen.style.height = h + 'px';

            els.deviceFrame.classList.toggle('tablet', device.isTablet);

            // Notch handling
            if (device.hasNotch) {
                els.notch.className = 'notch classic';
                els.notch.style.width = device.notchWidth + 'px';
                els.notch.style.height = device.notchHeight + 'px';
                els.notch.style.display = 'block';
            } else if (device.id.includes('iphone') && !device.id.includes('SE')) {
                els.notch.className = 'notch dynamic-island';
                els.notch.style.display = 'block';
            } else {
                els.notch.style.display = 'none';
            }

            // Home indicator
            els.homeIndicator.style.display = device.isTablet ? 'none' : 'block';

            // Status bar
            els.statusBar.style.display = device.id.includes('iphone') || device.id.includes('ipad') ? 'flex' : 'none';

            autoFit();
        }

        function loadUrl(url) {
            if (!url) return;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            els.loadingOverlay.classList.remove('hidden');
            els.previewFrame.src = url;
            els.urlInput.value = url;
            updateProtocolBadge(url);

            if (historyIndex < historyStack.length - 1) {
                historyStack = historyStack.slice(0, historyIndex + 1);
            }
            historyStack.push(url);
            historyIndex++;
        }

        function updateProtocolBadge(url) {
            const isSecure = url.startsWith('https://');
            els.protocolBadge.textContent = isSecure ? 'HTTPS' : 'HTTP';
            els.protocolBadge.style.color = isSecure ? 'var(--success)' : 'var(--danger)';
        }

        els.previewFrame.onload = () => {
            els.loadingOverlay.classList.add('hidden');
        };

        els.previewFrame.onerror = () => {
            els.loadingOverlay.classList.add('hidden');
        };

        els.urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                loadUrl(els.urlInput.value.trim());
            }
        });

        els.deviceSelect.addEventListener('change', () => {
            const device = devices.find(d => d.id === els.deviceSelect.value);
            if (device) applyDevice(device);
        });

        document.getElementById('btnReload').addEventListener('click', () => {
            els.previewFrame.src = els.previewFrame.src;
            els.loadingOverlay.classList.remove('hidden');
        });

        document.getElementById('btnBack').addEventListener('click', () => {
            if (historyIndex > 0) {
                historyIndex--;
                els.previewFrame.src = historyStack[historyIndex];
                els.urlInput.value = historyStack[historyIndex];
                updateProtocolBadge(historyStack[historyIndex]);
            }
        });

        document.getElementById('btnForward').addEventListener('click', () => {
            if (historyIndex < historyStack.length - 1) {
                historyIndex++;
                els.previewFrame.src = historyStack[historyIndex];
                els.urlInput.value = historyStack[historyIndex];
                updateProtocolBadge(historyStack[historyIndex]);
            }
        });

        document.getElementById('btnRotate').addEventListener('click', () => {
            isLandscape = !isLandscape;
            applyDevice(currentDevice);
        });

        // Zoom controls
        document.getElementById('btnZoomIn').addEventListener('click', () => {
            currentZoom = Math.min(currentZoom + 0.1, 2);
            applyZoom();
        });

        document.getElementById('btnZoomOut').addEventListener('click', () => {
            currentZoom = Math.max(currentZoom - 0.1, 0.3);
            applyZoom();
        });

        document.getElementById('btnFit').addEventListener('click', autoFit);

        function applyZoom() {
            els.scaleWrapper.style.transform = 'scale(' + currentZoom + ')';
            els.zoomValue.textContent = Math.round(currentZoom * 100) + '%';
        }

        function autoFit() {
            const container = document.getElementById('previewContainer');
            const frame = els.deviceFrame;
            const padding = 48;
            const availW = container.clientWidth - padding;
            const availH = container.clientHeight - padding;
            const frameW = currentDevice.width + currentDevice.bezelWidth * 2;
            const frameH = currentDevice.height + currentDevice.bezelWidth * 2;

            const scaleW = availW / frameW;
            const scaleH = availH / frameH;
            currentZoom = Math.min(scaleW, scaleH, 1);
            applyZoom();
        }

        // VS Code message handling
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'reload':
                    els.previewFrame.src = els.previewFrame.src;
                    els.loadingOverlay.classList.remove('hidden');
                    break;
                case 'rotate':
                    isLandscape = !isLandscape;
                    applyDevice(currentDevice);
                    break;
            }
        });

        // Initialize
        applyDevice(currentDevice);
        loadUrl('${defaultUrl}');

        window.addEventListener('resize', () => {
            if (currentZoom !== 1) autoFit();
        });
    </script>
</body>
</html>`;
    }
}
