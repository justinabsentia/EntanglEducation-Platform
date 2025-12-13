import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';

const ChaosLessonEnhanced = ({ onPass, isCompleted, targetRho = 28 }) => {
  const [rho, setRho] = useState(1);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isCompleted && Math.abs(rho - targetRho) <= 2) onPass();
  }, [rho, isCompleted, onPass, targetRho]);

  const points = useMemo(() => {
    let pts = [];
    let x = 0.1, y = 0, z = 0;
    const dt = 0.006, sigma = 10, beta = 8/3;
    for (let i = 0; i < 3000; i++) {
      let dx = sigma * (y - x);
      let dy = x * (rho - z) - y;
      let dz = x * y - beta * z;
      x += dx * dt; y += dy * dt; z += dz * dt;
      pts.push({ x, y, z });
    }
    return pts;
  }, [rho]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let animId, rotation = 0;

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
      rotation += 0.003;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 8;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const isClose = Math.abs(rho - 28) < 5;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, isClose ? '#eab308' : '#475569');
      gradient.addColorStop(1, isClose ? '#a855f7' : '#94a3b8');

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = isClose ? 10 : 0;
      ctx.shadowColor = isClose ? '#eab308' : 'transparent';

      points.forEach((p, index) => {
        const rx = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const rz = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
        const px = cx + rx * scale;
        const py = cy + (p.y * scale) + (rz * 0.5);
        index === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [points, rho]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-[#020617]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-6 right-6 md:w-80 bg-slate-900/90 border border-slate-700 p-5 rounded-xl backdrop-blur-md">
        <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
          <RotateCcw size={16} /> Chaos Tuner
        </h3>
        <div className="flex justify-between text-xs font-mono text-slate-300">
          <span>Rayleigh (ρ)</span>
          <span className={Math.abs(rho - 28) <= 2 ? "text-yellow-400" : "text-slate-400"}>
            {rho}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="0.1"
          value={rho}
          onChange={(e) => setRho(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
      </div>
    </div>
  );
};

export default ChaosLessonEnhanced;
