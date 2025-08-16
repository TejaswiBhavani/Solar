import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';

interface AIPanelProps {
  isVisible: boolean;
  onClose: () => void;
  planetName: string;
  planetDescription: string;
}

const AIPanel: React.FC<AIPanelProps> = ({ 
  isVisible, 
  onClose, 
  planetName, 
  planetDescription 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [askInput, setAskInput] = useState('');
  const [lastGeneratedLog, setLastGeneratedLog] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // API key - users need to add their own
  const apiKey = "";

  useEffect(() => {
    if (isVisible && panelRef.current) {
      // Panel entrance animation
      anime.set('.panel-child', { opacity: 0, translateY: 10 });
      anime({ 
        targets: '.panel-child', 
        opacity: [0, 1], 
        translateY: [10, 0], 
        delay: anime.stagger(100, { start: 200 }) 
      });
    }
  }, [isVisible]);

  const callApi = async (apiUrl: string, payload: any, buttonElement?: HTMLButtonElement) => {
    setIsLoading(true);
    setResults('');
    setStats(null);
    
    if (buttonElement) {
      buttonElement.disabled = true;
      const originalText = buttonElement.innerHTML;
      buttonElement.innerHTML = '⏳';
      
      setTimeout(() => {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
      }, 3000);
    }

    try {
      if (!apiKey) {
        throw new Error('API key not configured. Please add your Gemini API key to enable this feature.');
      }
      
      const response = await fetch(apiUrl, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setResults(`<div style="color: #ef4444;">${(error as Error).message}</div>`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetFacts = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const prompt = `Tell me three interesting and little-known fun facts about ${planetName}.`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const result = await callApi(apiUrl, payload, e.currentTarget);
    
    if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
      setLastGeneratedLog(result.candidates[0].content.parts[0].text);
      setResults(result.candidates[0].content.parts[0].text.replace(/\n/g, '<br>'));
    }
  };

  const handleGetLog = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const prompt = `Write a creative, fictional captain's log entry from a spaceship that has just arrived at ${planetName}. Make it atmospheric and brief (around 100 words).`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const result = await callApi(apiUrl, payload, e.currentTarget);
    
    if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
      const logText = result.candidates[0].content.parts[0].text;
      setLastGeneratedLog(logText);
      setResults(`${logText.replace(/\n/g, '<br>')} <button id="read-aloud-btn" class="gemini-btn mt-4">🔊 Read Aloud</button>`);
    }
  };

  const handleGetImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const prompt = `A stunning, photorealistic artistic impression of the surface of the planet ${planetName}, cinematic lighting, 8k, detailed.`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
    const result = await callApi(apiUrl, payload, e.currentTarget);
    
    if (result && result.predictions?.[0]?.bytesBase64Encoded) {
      const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      setResults(`<img src="${imageUrl}" alt="Generated image of ${planetName}" style="width: 100%; border-radius: 0.5rem;">`);
    }
  };

  const handleGetStats = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const prompt = `Generate key statistics for the planet ${planetName}.`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "diameter_km": { "type": "NUMBER" },
            "mass_10e24_kg": { "type": "NUMBER" },
            "avg_temp_celsius": { "type": "NUMBER" }
          }
        }
      }
    };
    const result = await callApi(apiUrl, payload, e.currentTarget);
    
    if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
      const statsData = JSON.parse(result.candidates[0].content.parts[0].text);
      setStats(statsData);
    }
  };

  const handleAsk = async () => {
    if (askInput.trim() === '') return;
    
    const prompt = `In the context of the planet ${planetName}, answer this question: "${askInput}"`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const result = await callApi(apiUrl, payload);
    
    if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
      setLastGeneratedLog(result.candidates[0].content.parts[0].text);
      setResults(result.candidates[0].content.parts[0].text.replace(/\n/g, '<br>'));
    }
    setAskInput('');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-[99]"
        onClick={onClose}
        style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' }}
      />
      
      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 left-0 h-full z-[100] bg-gray-900/90 p-6 border-r border-gray-600 w-96 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl bg-none border-none cursor-pointer transition-colors"
        >
          ×
        </button>
        
        <h2 className="text-3xl font-bold panel-child mb-2">{planetName}</h2>
        <p className="text-gray-400 mt-2 panel-child mb-4">{planetDescription}</p>
        
        <div className="flex flex-wrap gap-2 mt-4 panel-child mb-4">
          <button 
            className="gemini-btn"
            onClick={handleGetFacts}
            disabled={isLoading}
          >
            ✨ Facts
          </button>
          <button 
            className="gemini-btn"
            onClick={handleGetLog}
            disabled={isLoading}
          >
            📜 Log
          </button>
          <button 
            className="gemini-btn"
            onClick={handleGetImage}
            disabled={isLoading}
          >
            🎨 Image
          </button>
          <button 
            className="gemini-btn"
            onClick={handleGetStats}
            disabled={isLoading}
          >
            📊 Stats
          </button>
        </div>
        
        <div className="flex mt-4 panel-child">
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder={`Ask anything about ${planetName}...`}
            className="flex-grow bg-gray-800 border border-gray-600 text-white p-2 rounded-l-full text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            className="gemini-btn rounded-l-none rounded-r-full mt-0"
            onClick={handleAsk}
            disabled={isLoading}
          >
            Ask
          </button>
        </div>
        
        {isLoading && (
          <div className="loader panel-child mt-4 mx-auto"></div>
        )}
        
        {stats && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg max-h-48 overflow-y-auto panel-child">
            <table className="w-full text-left">
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-1 pr-2">Diameter:</td>
                  <td>{stats.diameter_km.toLocaleString()} km</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-1 pr-2">Mass:</td>
                  <td>{stats.mass_10e24_kg} x 10²⁴ kg</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2">Avg. Temp:</td>
                  <td>{stats.avg_temp_celsius}°C</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {results && (
          <div 
            className="mt-4 p-4 bg-gray-800 rounded-lg max-h-48 overflow-y-auto panel-child"
            dangerouslySetInnerHTML={{ __html: results }}
          />
        )}
      </div>
    </>
  );
};

export default AIPanel;