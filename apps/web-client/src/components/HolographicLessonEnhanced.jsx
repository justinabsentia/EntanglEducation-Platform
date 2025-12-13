import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Info, ScanFace } from 'lucide-react';

const HolographicLessonEnhanced = ({ onPass, isCompleted }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const spherePoints = useMemo(() => {
    const points = [];
    const count = 800;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
    }
    return points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let animId, time = 0;

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
      time += 0.02;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.35;

      ctx.clearRect(0, 0, width, height);

      // Bulk Glow
      const gradient = ctx.createRadialGradient(cx, cy, scale * 0.2, cx, cy, scale * 1.2);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, scale, 0, Math.PI * 2);
      ctx.fill();

      // Boundary Points
      spherePoints.forEach((p, i) => {
        const autoRotY = time * 0.3;
        const autoRotX = time * 0.2;

        let x1 = p.x * Math.cos(autoRotY) - p.z * Math.sin(autoRotY);
        let z1 = p.x * Math.sin(autoRotY) + p.z * Math.cos(autoRotY);
        let y1 = p.y * Math.cos(autoRotX) - z1 * Math.sin(autoRotX);
        let z2 = p.y * Math.sin(autoRotX) + z1 * Math.cos(autoRotX);

        const zScale = 2 / (2 + z2);
        const px = cx + x1 * scale * zScale;
        const py = cy + y1 * scale * zScale;
        const size = zScale * 1.5;
        const alpha = ((z2 + 1) / 2) * 0.8 + 0.2;

        if (isCompleted) {
          ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
        } else {
          const shimmer = Math.sin(time * 2 + i) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha * shimmer})`;
        }
        ctx.fillRect(px, py, size, size);
      });

      // Boundary Ring
      ctx.strokeStyle = isCompleted ? '#4ade80' : 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, scale, 0, Math.PI * 2);
      ctx.stroke();
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [spherePoints, isCompleted]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-[#020617]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-6 bg-slate-900/90 border border-slate-700 p-6 rounded-xl w-80 backdrop-blur-md">
        <h3 className={`font-bold mb-2 flex items-center gap-2 ${isCompleted ? 'text-green-400' : 'text-cyan-400'}`}>
          <ScanFace size={16} /> {isCompleted ? "Access Granted" : "Security Challenge"}
        </h3>
        <p className="text-xs text-slate-300 mb-4">The Bekenstein Bound: Entropy scales with...</p>
        <div className="grid grid-cols-2 gap-2">
          {['Volume (V)', 'Surface Area (A)', 'Mass (M)', 'Temperature (T)'].map((opt, i) => (
            <button
              key={i}
              disabled={isCompleted}
              onClick={() => {
                setSelectedOpt(i);
                if (i === 1) onPass();
              }}
              className={`p-2 text-[10px] font-mono uppercase rounded border ${
                isCompleted && i === 1
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : selectedOpt === i
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : 'border-slate-700 hover:border-cyan-400 text-slate-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolographicLessonEnhanced;
