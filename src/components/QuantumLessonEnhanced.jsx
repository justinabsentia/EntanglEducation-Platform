import React, { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

const QuantumLessonEnhanced = ({ onPass, isCompleted, targetEnergy = 45, barrierHeight = 50 }) => {
  const [energy, setEnergy] = useState(20);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isCompleted && energy < barrierHeight && energy >= targetEnergy - 5) onPass();
  }, [energy, isCompleted, onPass, barrierHeight, targetEnergy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let time = 0, animId;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      ctx.scale(dpr, dpr);
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

      // Barrier
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fillRect(bx, cy - 50, 100, 100);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, cy - 50, 100, 100);

      // Wave
      ctx.beginPath();
      if (energy > barrierHeight) ctx.strokeStyle = '#ef4444';
      else if (Math.abs(energy - targetEnergy) <= 5) ctx.strokeStyle = '#22c55e';
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
  }, [energy, barrierHeight, targetEnergy]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-6 right-6 md:w-80 bg-slate-900/90 border border-slate-700 p-5 rounded-xl backdrop-blur-md">
        <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
          <Zap size={16} /> Wave Tuner
        </h3>
        <input
          type="range"
          min="0"
          max="100"
          value={energy}
          onChange={(e) => setEnergy(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
    </div>
  );
};

export default QuantumLessonEnhanced;
