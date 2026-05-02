import React, { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';
import { getQuizOptionClass } from './getQuizOptionClass.js';

const quizOptions = [
  'The particle slows because the barrier adds friction.',
  'The wavefunction amplitude decays inside the barrier but still has a non-zero transmission chance.',
  'Tunneling only works when energy is higher than the barrier.',
  'The particle vanishes and reappears without any probability distribution.'
];

const QuantumLessonEnhanced = ({ onPass, isCompleted, modeLabel = 'Spatial XR', targetEnergy = 45, barrierHeight = 50 }) => {
  const [energy, setEnergy] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('Tune the wave into the green tunneling band, then answer the checkpoint.');
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const isCalibrated = energy < barrierHeight && Math.abs(energy - targetEnergy) <= 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let time = 0;
    let animId;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.05;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const cy = height / 2;
      const bx = width / 2 - 50;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fillRect(bx, cy - 50, 100, 100);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, cy - 50, 100, 100);

      ctx.beginPath();
      if (energy > barrierHeight) ctx.strokeStyle = '#ef4444';
      else if (isCalibrated) ctx.strokeStyle = '#22c55e';
      else ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;

      for (let x = 0; x < width; x += 4) {
        let amp = 40;
        if (x < bx) amp = 30;
        else if (x >= bx && x <= bx + 100) {
          const decay = (barrierHeight - energy) * 0.15;
          const dist = (x - bx) / 100;
          amp = energy >= barrierHeight ? 30 : 30 * Math.exp(-dist * decay);
        } else {
          const decay = (barrierHeight - energy) * 0.15;
          amp = energy >= barrierHeight ? 30 : 30 * Math.exp(-1 * decay);
        }
        const y = cy + amp * Math.sin((x * 0.08) - time * (energy * 0.1));
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [energy, barrierHeight, isCalibrated]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);

    if (isCompleted) {
      return;
    }

    if (!isCalibrated) {
      setFeedback('Stabilize the wave in the green tunneling band before submitting proof.');
      return;
    }

    if (index === 1) {
      setFeedback('Correct. A non-zero transmitted amplitude is exactly why tunneling is possible.');
      onPass();
      return;
    }

    setFeedback('Not yet. Tunneling happens even below the barrier because the wave retains a finite transmitted amplitude.');
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-6 right-6 max-w-md rounded-xl border border-slate-700 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">{modeLabel}</div>
        <h3 className="mt-2 mb-3 flex items-center gap-2 font-bold text-purple-400">
          <Zap size={16} /> Wave Tuner + Quiz Gate
        </h3>
        <div className="mb-3 flex justify-between text-xs font-mono text-slate-300">
          <span>Energy calibration</span>
          <span className={isCalibrated ? 'text-green-400' : 'text-slate-400'}>{energy}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={energy}
          onChange={(e) => setEnergy(parseInt(e.target.value))}
          className="mb-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-purple-500"
        />

        <p className="mb-3 text-xs text-slate-300">
          Why can the particle still appear beyond the barrier when its energy is below the barrier height?
        </p>
        <div className="grid gap-2">
          {quizOptions.map((option, index) => (
            <button
              key={option}
              disabled={isCompleted}
              onClick={() => handleAnswer(index)}
              className={`rounded border p-3 text-left text-[11px] ${getQuizOptionClass({
                isCompleted,
                isSelected: selectedAnswer === index,
                isCorrect: index === 1,
                isReady: isCalibrated,
                idleClass: 'border-slate-700 text-slate-300 hover:border-purple-400'
              })}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-slate-400">{feedback}</div>
      </div>
    </div>
  );
};

export default QuantumLessonEnhanced;
