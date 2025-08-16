# Interactive Solar System Documentation

## Overview

The Interactive Solar System is a standalone Three.js + GSAP experience that provides an immersive journey through our solar system. It features scroll-triggered guided tours, free-roam exploration, and AI-powered interactions through Google's Gemini API.

## Features

### 3D Solar System Visualization
- **Sun**: Central star with emissive material and solar rotation
- **Planets**: Mercury, Venus, Earth (with Moon), Mars, Jupiter, Saturn (with rings)
- **Asteroid Belt**: Procedurally generated asteroid field between Mars and Jupiter
- **Starfield**: Dynamic background stars with pulse effects
- **Realistic Orbital Motion**: Planets orbit at different speeds based on real astronomical data

### Navigation Modes

#### Guided Tour Mode (Default)
- **Scroll-triggered Navigation**: Scroll through sections to automatically focus on each celestial body
- **Smooth Camera Transitions**: GSAP-powered camera movements with 2-second duration
- **Progressive Reveal**: Each planet section becomes visible after the intro sequence

#### Free-Roam Mode
- **Toggle Button**: Click "🛰️ Free-Roam" to switch modes
- **Mouse Controls**: Move mouse to orbit around the currently focused planet
- **Orbit Radius**: 50 units from target with vertical mouse movement
- **Disable Scroll**: Body overflow hidden during free-roam to prevent conflicts

### Ask Me Anything Panel

The left-side panel provides AI-powered interactions when a valid Gemini API key is configured.

#### Panel Features
- **Facts Button (✨)**: Get three interesting facts about the current planet
- **Log Button (📜)**: Generate a fictional captain's log entry with read-aloud capability
- **Image Button (🎨)**: Create artistic impressions using Imagen AI
- **Stats Button (📊)**: Display structured planetary statistics in table format
- **Ask Field**: Free-form questions about the current planet
- **Text-to-Speech**: Read generated captain's logs aloud

#### API Integration
The panel integrates with multiple Google AI services:
- **Gemini 2.5 Flash**: Text generation for facts, logs, and Q&A
- **Imagen 3.0**: Image generation for planetary surfaces
- **Text-to-Speech**: Audio synthesis for captain's logs

## Setup Instructions

### 1. Access the Interactive Solar System

Start the Vite development server:
```bash
npm run dev
```

Navigate to: `http://localhost:3000/interactive-solar.html`

### 2. API Key Configuration (Optional)

To enable AI features, you need a Google Cloud API key with access to:
- Generative Language API (Gemini)
- Imagen API
- Text-to-Speech API

#### Obtaining API Keys
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Generative Language API
   - Imagen API
   - Text-to-Speech API
4. Generate an API key in the Credentials section
5. Restrict the key to the specific APIs for security

#### Adding Your API Key
Edit `/public/interactive-solar.html` and replace the empty string:
```javascript
// Line ~366
const apiKey = "YOUR_API_KEY_HERE";
```

**⚠️ Security Warning**: Never commit API keys to public repositories. For production use, implement proper server-side proxy endpoints.

### 3. Without API Key
The solar system works perfectly without an API key. The AI panel will show error messages but all 3D navigation and visualization features remain fully functional.

## Usage Guide

### Basic Navigation
1. **Initial Experience**: Watch the animated title sequence
2. **Scroll Navigation**: Scroll down to visit each planet in order
3. **Free-Roam Toggle**: Click the bottom-right button to switch modes
4. **Panel Access**: Click "✨ Ask Me Anything" when it appears

### Keyboard Shortcuts
- **Mouse Movement** (Free-Roam): Orbit around current planet
- **Scroll Wheel**: Navigate between planets (Guided Tour mode)

### Panel Interactions
1. **Open Panel**: Click the "✨ Ask Me Anything" button
2. **Close Panel**: Click the × button or click outside the panel
3. **Try Features**: Test each button to see AI capabilities
4. **Ask Questions**: Use the input field for custom queries

## Technical Details

### Dependencies
- **Three.js r128**: 3D rendering and scene management
- **GSAP 3.12.2**: Animation timeline and ScrollTrigger
- **Anime.js 3.2.1**: UI micro-animations and starfield effects
- **Tailwind CSS**: Utility-first styling via CDN

### Performance Considerations
- **Instanced Rendering**: Asteroids use InstancedMesh for performance
- **LOD Management**: Planet detail varies by distance
- **Frame Rate**: Optimized for 60fps on modern devices
- **Memory Usage**: ~50MB for full scene including textures

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **WebGL Requirement**: WebGL 1.0 minimum

## File Structure

```
public/
└── interactive-solar.html    # Complete standalone application

docs/
└── interactive-solar.md     # This documentation file
```

## Troubleshooting

### Common Issues

**Black Screen on Load**
- Check browser console for WebGL errors
- Ensure hardware acceleration is enabled
- Try refreshing the page

**API Features Not Working**
- Verify API key is correctly configured
- Check browser console for API errors
- Ensure APIs are enabled in Google Cloud Console

**Scroll Not Working**
- Exit Free-Roam mode if active
- Check if page height allows scrolling
- Refresh page if ScrollTrigger conflicts occur

**Performance Issues**
- Reduce browser zoom level
- Close other GPU-intensive tabs
- Lower browser resolution if necessary

### Error Messages

| Error | Solution |
|-------|----------|
| "API key not configured" | Add your Gemini API key to the HTML file |
| "WebGL not supported" | Update browser or enable hardware acceleration |
| "Network error" | Check internet connection and API quotas |

## Development Notes

### Customization Options
- **Planet Data**: Modify `planetsData` array for custom celestial bodies
- **Camera Behavior**: Adjust GSAP animation parameters
- **Visual Style**: Edit CSS custom properties and Three.js materials
- **API Endpoints**: Update URLs for different AI service versions

### Extension Ideas
- Add more celestial bodies (Pluto, moons of gas giants)
- Implement VR support using WebXR
- Add educational overlays with orbital mechanics
- Include real-time astronomical data feeds
- Support for multiple language interfaces

For support or feature requests, please refer to the project repository.