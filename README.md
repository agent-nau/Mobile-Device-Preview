# Device Frame Preview

Instantly preview your web applications inside realistic mobile and tablet device frames directly within VS Code.

## Detailed Description

Device Frame Preview eliminates the need to constantly switch between your editor and an external browser to check responsiveness. It provides a dedicated panel that renders your local development server inside high-fidelity device skins, helping you catch layout issues early.

## Key Features

- **Realistic Device Skins**: View your site inside accurate frames for popular devices (iPhone, Android, and tablets)
- **Live Sync**: Automatically refreshes the preview as you save your code—no manual reloading required
- **Side-by-Side Workflow**: Keep your code on the left and your mobile preview on the right for a seamless frontend development experience
- **Local Server Support**: Works perfectly with localhost ports from Vite, React, Vue, Next.js, and other modern frameworks
- **Customizable Viewports**: Quickly toggle between portrait and landscape orientations to test every angle of your responsive design
- **15 Modern Devices** — iPhone 17 Pro Max, iPhone 16/15/14/13/12/SE, Pixel 9/8, Galaxy S24/S23, iPad Pro 11"/13", Pixel Tablet
- **Smart Zoom** — Auto-fit to panel, or manual zoom from 30% to 200%
- **Navigation** — Back/forward history, reload, and URL bar with protocol indicator
- **Fully Local** — Renders directly in an iframe, no external proxy services
- **Dark UI** — Clean, minimal toolbar that matches VS Code's aesthetic

## How to Use

1. Start your local development server (e.g., `npm run dev`)
2. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Type "Device Preview: Open Device Preview" and enter your local URL
4. Your app appears in a realistic mobile frame immediately

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `deviceFramePreview.defaultUrl` | `http://localhost:3000` | Default URL to load |
| `deviceFramePreview.defaultDevice` | `iphone17promax` | Default device frame to use |

## Commands

| Command | Keybinding | Description |
|---------|-----------|-------------|
| Open Device Preview | — | Open the preview panel |
| Reload Preview | — | Reload the current page |
| Rotate Device | — | Toggle portrait/landscape |


## License

MIT
