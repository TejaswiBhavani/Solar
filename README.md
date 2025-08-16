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