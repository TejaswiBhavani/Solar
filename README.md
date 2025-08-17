# Interactive 3D Solar System

A modern, interactive 3D solar system built with React, Three.js, and Framer Motion. Explore the wonders of our solar system through an immersive 3D experience with smooth animations and intuitive controls.

## ✨ Features

- **Interactive 3D Solar System**: Explore planets in stunning 3D with realistic orbits and rotations
- **Free Roam Mode**: Navigate freely through space with intuitive orbit controls
- **Rich Animations**: Smooth transitions and micro-interactions powered by Framer Motion
- **SVG-Only Icons**: Clean, scalable icon system with no emojis
- **Responsive Design**: Works beautifully on all device sizes
- **Modern Tech Stack**: Built with React 19, TypeScript, Vite, and Three.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TejaswiBhavani/Solar.git
cd Solar
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
pnpm build
```

Preview the production build:
```bash
npm run preview
# or
pnpm preview

### Optional: Gemini API setup for AI panel

Create a `.env.local` in the project root:

```
VITE_GEMINI_API_KEY=your_key_here
```

Restart the dev server after adding the key. Without a key, AI buttons will be disabled and show a tooltip explaining how to enable.

```

## 🎮 Controls

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Animations**: Framer Motion, Anime.js
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Icons**: Custom SVG components

## 🔧 Troubleshooting

### 3D Scene Not Appearing

If you only see the text overlay but no 3D solar system:

- **Check WebGL support**: Ensure hardware acceleration is enabled in your browser
- **Console errors**: Open browser DevTools (F12) and check for any error messages
- **Browser compatibility**: Try a different browser (Chrome, Firefox, Safari, Edge)
- **Graphics drivers**: Update your graphics card drivers

### Performance Issues

- Reduce browser zoom level to 100%
- Close other GPU-intensive browser tabs
- Try lowering your screen resolution temporarily
- Check if hardware acceleration is enabled

### Controls Not Working

- Exit Free-Roam mode if active (bottom-right button)
- Ensure the 3D canvas is receiving mouse events
- Try refreshing the page if scroll interactions aren't working

### WebGL Errors

If you see a "WebGL Not Supported" message:
- **Chrome**: Go to `chrome://settings/system` → Enable "Use hardware acceleration when available"
- **Firefox**: Go to `about:config` → Set `webgl.force-enabled` to `true`
- **Safari**: Enable "WebGL" in Develop menu
- Update your browser to the latest version

## 📁 Project Structure

```
src/
├── components/
│   ├── Scene.tsx          # 3D solar system scene
│   └── icons.tsx          # SVG icon components
├── App.tsx                # Main application component
├── main.tsx               # React entry point
└── index.css              # Global styles and Tailwind
```

## 🎨 Design System

The project uses a carefully crafted design system with:
- **Colors**: ink, mist, iris, neon, sun
- **Typography**: Inter font family
- **Effects**: Glass morphism, glows, and gradients
- **Icons**: SVG-only system for scalability

## 🌟 Legacy

This project is a modernized version of a previous Three.js solar system. The original code has been preserved in the `/legacy/` directory while the new version provides:

- Modern React architecture
- TypeScript for better development experience
- Component-based structure
- Improved performance and accessibility
- SVG-only icon system

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with React, Three.js, Framer Motion, and Anime.js
- Original inspiration from interactive space visualizations
- Modern web development best practices