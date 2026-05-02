import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ScanFace } from 'lucide-react';
import { getQuizOptionClass } from './getQuizOptionClass.js';

const HolographicLessonEnhanced = ({ onPass, isCompleted, modeLabel = 'Spatial XR' }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [scanDepth, setScanDepth] = useState(35);
  const [feedback, setFeedback] = useState('Sweep the boundary scan above 70% before answering.');
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
    let animId;
    let time = 0;

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
      time += 0.02;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.35;
      const scanIntensity = scanDepth / 100;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(cx, cy, scale * 0.2, cx, cy, scale * 1.25);
      gradient.addColorStop(0, `rgba(34, 211, 238, ${0.08 + scanIntensity * 0.18})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * (0.85 + scanIntensity * 0.2), 0, Math.PI * 2);
      ctx.fill();

      spherePoints.forEach((p, i) => {
        const autoRotY = time * (0.18 + scanIntensity * 0.25);
        const autoRotX = time * (0.12 + scanIntensity * 0.18);

        const x1 = p.x * Math.cos(autoRotY) - p.z * Math.sin(autoRotY);
        const z1 = p.x * Math.sin(autoRotY) + p.z * Math.cos(autoRotY);
        const y1 = p.y * Math.cos(autoRotX) - z1 * Math.sin(autoRotX);
        const z2 = p.y * Math.sin(autoRotX) + z1 * Math.cos(autoRotX);

        const zScale = 2 / (2 + z2);
        const px = cx + x1 * scale * zScale;
        const py = cy + y1 * scale * zScale;
        const size = zScale * (1.1 + scanIntensity);
        const alpha = ((z2 + 1) / 2) * 0.8 + 0.2;

        if (isCompleted) {
          ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
        } else {
          const shimmer = Math.sin(time * 2 + i) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha * shimmer})`;
        }
        ctx.fillRect(px, py, size, size);
      });

      ctx.strokeStyle = isCompleted ? '#4ade80' : `rgba(168, 85, 247, ${0.35 + scanIntensity * 0.45})`;
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
  }, [spherePoints, isCompleted, scanDepth]);

  const handleAnswer = (index) => {
    setSelectedOpt(index);

    if (isCompleted) {
      return;
    }

    if (scanDepth < 70) {
      setFeedback('Increase the boundary scan to at least 70% before submitting proof.');
      return;
    }

    if (index === 1) {
      setFeedback('Correct. Boundary area stores the information content, so the proof can be minted.');
      onPass();
      return;
    }

    setFeedback('Not quite. The holographic bound scales with the enclosing surface area.');
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-[#020617]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-6 right-6 max-w-sm rounded-xl border border-slate-700 bg-slate-900/90 p-6 backdrop-blur-md">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">{modeLabel}</div>
        <h3 className={`mt-2 mb-2 flex items-center gap-2 font-bold ${isCompleted ? 'text-green-400' : 'text-cyan-400'}`}>
          <ScanFace size={16} /> {isCompleted ? 'Soulbound Proof Minted' : 'Boundary Scan Challenge'}
        </h3>
        <p className="mb-4 text-xs text-slate-300">
          Sweep the holographic shell, stabilize the scan, then answer the checkpoint to prove the concept.
        </p>

        <div className="mb-4">
          <div className="mb-2 flex justify-between text-xs font-mono text-slate-300">
            <span>Boundary scan</span>
            <span className={scanDepth >= 70 ? 'text-cyan-300' : 'text-slate-400'}>{scanDepth}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scanDepth}
            onChange={(e) => setScanDepth(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-500"
          />
        </div>

        <p className="text-xs text-slate-300 mb-3">The Bekenstein bound says entropy scales with...</p>
        <div className="grid grid-cols-2 gap-2">
          {['Volume (V)', 'Surface Area (A)', 'Mass (M)', 'Temperature (T)'].map((opt, i) => (
            <button
              key={i}
              disabled={isCompleted}
              onClick={() => handleAnswer(i)}
              className={`rounded border p-2 text-[10px] font-mono uppercase ${getQuizOptionClass({
                isCompleted,
                isSelected: selectedOpt === i,
                isCorrect: i === 1,
                isReady: scanDepth >= 70,
                idleClass: 'border-slate-700 text-slate-400 hover:border-cyan-400'
              })}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-slate-400">{feedback}</div>
      </div>
    </div>
  );
};

export default HolographicLessonEnhanced;
