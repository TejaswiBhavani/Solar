import React, { useState, useEffect } from 'react';
import AdvancedScene from './components/AdvancedScene';
import ScrollSections from './components/ScrollSections';
import AIPanel from './components/AIPanel';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [showPanelButton, setShowPanelButton] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [currentPlanet, setCurrentPlanet] = useState({
    name: 'Sun',
    description: 'The star at the center of our solar system.'
  });

  const handlePlanetFocus = (planetName: string, description: string) => {
    setCurrentPlanet({ name: planetName, description });
    setShowPanelButton(true);
  };

  const handleToggleFreeRoam = () => {
    // Free roam logic is handled in AdvancedScene
  };

  const handleOpenPanel = () => {
    setIsPanelVisible(true);
  };

  const handleClosePanel = () => {
    setIsPanelVisible(false);
  };

  // Add body class for free roam cursor
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body.free-roam-active {
        cursor: grab;
      }
      .intro-title .letter {
        display: inline-block;
        opacity: 0;
        transform: translateY(50px);
      }
      .gemini-btn {
        background-color: #4f46e5;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-weight: 600;
        margin-top: 1rem;
        transition: background-color 0.3s, transform 0.3s;
        font-size: 0.875rem;
        border: none;
        cursor: pointer;
      }
      .gemini-btn:hover {
        background-color: #6366f1;
        transform: scale(1.05);
      }
      .gemini-btn:disabled {
        background-color: #a5b4fc;
        cursor: not-allowed;
      }
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4f46e5;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
        margin: 1rem auto 0;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-transparent min-h-screen text-white overflow-x-hidden relative">
      {/* Advanced 3D Scene */}
      <AdvancedScene onPlanetFocus={handlePlanetFocus} />
      
      {/* Scroll Sections */}
      <ScrollSections />
      
      {/* Controls */}
      <Controls
        onToggleFreeRoam={handleToggleFreeRoam}
        onOpenPanel={handleOpenPanel}
        showPanelButton={showPanelButton}
      />
      
      {/* AI Panel */}
      <AIPanel
        isVisible={isPanelVisible}
        onClose={handleClosePanel}
        planetName={currentPlanet.name}
        planetDescription={currentPlanet.description}
      />
    </div>
  );
};

export default App;