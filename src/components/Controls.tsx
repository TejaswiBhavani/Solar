import React from 'react';

interface ControlsProps {
  isFreeRoam: boolean;
  onToggleFreeRoam: () => void;
  onOpenPanel: () => void;
  showPanelButton: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isFreeRoam,
  onToggleFreeRoam,
  onOpenPanel,
  showPanelButton
}) => {
  const handleToggleFreeRoam = () => {
    onToggleFreeRoam();
  };

  return (
    <>
      {/* Free Roam Toggle */}
      <button
        onClick={handleToggleFreeRoam}
        className="fixed bottom-5 right-5 z-[101] gemini-btn"
      >
        {isFreeRoam ? '📜 Guided Tour' : '🛰️ Free-Roam'}
      </button>

      {/* Ask Me Anything Button */}
      <button
        onClick={onOpenPanel}
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[99] px-8 py-4 text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 ${
          showPanelButton 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-5 pointer-events-none'
        }`}
      >
        ✨ Ask Me Anything
      </button>
    </>
  );
};

export default Controls;