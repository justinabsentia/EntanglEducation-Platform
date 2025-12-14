import React, { useState } from 'react';
import PhysicsSandbox from './PhysicsSandbox.jsx';
import curriculumData from '../../data/curriculum.json';

/**
 * Example usage of PhysicsSandbox demonstrating the "Roblox Model" architecture
 * This is the "Script" layer - lightweight code that just passes parameters to the Engine
 */
const PhysicsSandboxExample = () => {
  const [showForces, setShowForces] = useState(false);
  const [gravityY, setGravityY] = useState(-9.8);
  const [timeScale, setTimeScale] = useState(1.0);
  const [debugMode, setDebugMode] = useState(false);

  // Load NGSS metadata from curriculum.json
  const lessonMetadata = curriculumData.lessons.find(
    lesson => lesson.lessonId === 'gravity-001'
  );

  const handleSuccess = () => {
    console.log('✅ Lesson completed! Proof-of-Knowledge trigger fired.');
    alert('🎉 Congratulations! You have mastered this physics concept!');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-950 p-4">
      <div className="mb-4 bg-slate-900 border border-slate-700 p-4 rounded-xl">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">
          🎮 PhysicsSandbox SDK Demo
        </h1>
        <p className="text-slate-300 text-sm mb-4">
          Example of the "Roblox Model" architecture: Instantiate a scene without writing Three.js boilerplate
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Gravity (Y-axis): {gravityY}
            </label>
            <input
              type="range"
              min="-20"
              max="0"
              step="0.1"
              value={gravityY}
              onChange={(e) => setGravityY(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Time Scale: {timeScale}x
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={timeScale}
              onChange={(e) => setTimeScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setShowForces(!showForces)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              showForces 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            ⚡ Force Lines: {showForces ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              debugMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            🔧 Debug: {debugMode ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleSuccess}
            className="px-4 py-2 rounded-lg font-semibold bg-yellow-600 text-white hover:bg-yellow-700 transition"
          >
            ✅ Complete Lesson
          </button>
        </div>

        {lessonMetadata && (
          <div className="mt-4 p-3 bg-slate-800 border border-cyan-500 rounded-lg">
            <div className="text-cyan-400 font-mono text-xs">
              <div className="font-bold mb-1">📚 NGSS Metadata:</div>
              <div>Standard: {lessonMetadata.standardID}</div>
              <div>Concept: {lessonMetadata.conceptTag}</div>
              <div>Level: {lessonMetadata.difficulty}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <PhysicsSandbox
          config={{
            gravity: [0, gravityY, 0],
            timeScale: timeScale,
            debug: debugMode
          }}
          showForceLines={showForces}
          onSuccess={handleSuccess}
          metadata={lessonMetadata}
        >
          {/* Custom lesson content can be added here as children */}
          <div className="absolute bottom-6 left-6 bg-slate-900/90 border border-slate-700 p-4 rounded-xl backdrop-blur-md">
            <h3 className="text-yellow-400 font-bold mb-2">
              {lessonMetadata?.title || 'Physics Sandbox'}
            </h3>
            <p className="text-slate-300 text-sm">
              {lessonMetadata?.description || 'Interactive physics simulation'}
            </p>
          </div>
        </PhysicsSandbox>
      </div>
    </div>
  );
};

export default PhysicsSandboxExample;
