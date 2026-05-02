import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';

const quizOptions = [
  'The system becomes fully periodic, so all paths collapse into one orbit.',
  'The state stays random with no underlying structure or sensitivity to initial conditions.',
  'Convective flow becomes unstable enough to split trajectories across two lobes, creating the butterfly attractor.',
  'The attractor appears only because the simulation increases line thickness near ρ = 28.'
];

const ChaosLessonEnhanced = ({ onPass, isCompleted, modeLabel = 'Spatial XR', targetRho = 28 }) => {
  const [rho, setRho] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('Dial the system near the butterfly threshold, then answer the checkpoint.');
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const isCalibrated = Math.abs(rho - targetRho) <= 2;

  const points = useMemo(() => {
    const pts = [];
    let x = 0.1;
    let y = 0;
    let z = 0;
    const dt = 0.006;
    const sigma = 10;
    const beta = 8 / 3;

    for (let i = 0; i < 3000; i++) {
      const dx = sigma * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
      pts.push({ x, y, z });
    }

    return pts;
  }, [rho]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let rotation = 0;

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
      rotation += 0.003;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 8;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, isCalibrated ? '#eab308' : '#475569');
      gradient.addColorStop(1, isCalibrated ? '#a855f7' : '#94a3b8');

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = isCalibrated ? 10 : 0;
      ctx.shadowColor = isCalibrated ? '#eab308' : 'transparent';

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
  }, [points, isCalibrated]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);

    if (isCompleted) {
      return;
    }

    if (!isCalibrated) {
      setFeedback('Move ρ into the highlighted butterfly zone before submitting proof.');
      return;
    }

    if (index === 2) {
      setFeedback('Correct. Around ρ ≈ 28 the flow becomes unstable enough to oscillate between two sensitive lobes.');
      onPass();
      return;
    }

    setFeedback('Try again. The butterfly shape marks unstable convection and sensitivity to initial conditions, not pure randomness.');
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-[#020617]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-6 right-6 max-w-md rounded-xl border border-slate-700 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">{modeLabel}</div>
        <h3 className="mt-2 mb-3 flex items-center gap-2 font-bold text-yellow-400">
          <RotateCcw size={16} /> Chaos Tuner + Quiz Gate
        </h3>
        <div className="mb-3 flex justify-between text-xs font-mono text-slate-300">
          <span>Rayleigh (ρ)</span>
          <span className={isCalibrated ? 'text-yellow-300' : 'text-slate-400'}>{rho.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="0.1"
          value={rho}
          onChange={(e) => setRho(parseFloat(e.target.value))}
          className="mb-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-yellow-500"
        />

        <p className="mb-3 text-xs text-slate-300">
          Why does the Lorenz system form the recognizable butterfly-shaped attractor near ρ ≈ 28?
        </p>
        <div className="grid gap-2">
          {quizOptions.map((option, index) => (
            <button
              key={option}
              disabled={isCompleted}
              onClick={() => handleAnswer(index)}
              className={`rounded border p-3 text-left text-[11px] ${
                isCompleted && index === 2
                  ? 'border-green-500 bg-green-500/20 text-green-300'
                  : selectedAnswer === index && index === 2 && isCalibrated
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : selectedAnswer === index
                      ? 'border-red-500 bg-red-500/20 text-red-300'
                      : 'border-slate-700 text-slate-300 hover:border-yellow-400'
              }`}
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

export default ChaosLessonEnhanced;
