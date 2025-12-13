import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Book, Cpu, ChevronLeft, Unlock, Lock, 
  Info, CheckCircle, Plus, Zap, Wallet, RotateCcw, BrainCircuit 
} from 'lucide-react';

// ===== IMPORTS =====
// Adjust the path below if your folders are structured differently
import { useLocalStorage } from './hooks/useLocalStorage';

// ===== PHYSICS CONSTANTS & "PROOF OF KNOWLEDGE" ANSWERS =====
const SOLUTIONS = {
  1: { // Holographic Principle
     correctIndex: 1,
     explanation: "Entropy is proportional to Surface Area (A), not Volume (V)."
  },
  2: { // Quantum Tunneling
     targetEnergy: 45, 
     barrierHeight: 50,
     tolerance: 5,
     hint: "Keep energy just below the barrier height to maximize transmission probability."
  },
  3: { // Lorenz Attractor
     targetRho: 28, 
     targetSigma: 10,
     tolerance: 2,
     hint: "Search for the standard Lorenz value for Rayleigh number (ρ)."
  }
};

// ===== COMPONENT LOGIC =====

const HolographicLesson = ({ onPass, isCompleted }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    let time = 0;
    let animId;

    const animate = () => {
      time += 0.01;
      const w = canvas.width; const h = canvas.height;
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
      const cx = w/2; const cy = h/2; const r = 100;
      
      // Bulk (Volume)
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1;
      for(let i=0; i<8; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r*Math.sin(time + i), 0, 0, Math.PI*2);
        ctx.stroke();
      }
      // Boundary (Surface)
      ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, r+10, 0, Math.PI*2); ctx.stroke();
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const checkAnswer = (idx) => {
    setSelectedOpt(idx);
    if (idx === SOLUTIONS[1].correctIndex) onPass();
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-8 left-8 bg-slate-900/90 border border-slate-700 p-6 rounded-xl w-80 backdrop-blur-md">
        <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2"><Info size={16}/> Knowledge Check</h3>
        <p className="text-xs text-slate-300 mb-4">According to the Bekenstein bound, entropy scales with:</p>
        <div className="grid grid-cols-2 gap-2">
          {['Volume (V)', 'Surface Area (A)', 'Mass (M)', 'Temperature (T)'].map((opt, i) => (
            <button key={i} disabled={isCompleted} onClick={() => checkAnswer(i)}
              className={`p-2 text-xs rounded border transition-all ${
                isCompleted && i === 1 ? 'bg-green-500/20 border-green-500 text-green-400' :
                selectedOpt === i ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-slate-600 hover:border-cyan-400 text-slate-300'
              }`}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuantumLesson = ({ onPass, isCompleted }) => {
  const [energy, setEnergy] = useState(20);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!isCompleted && Math.abs(energy - SOLUTIONS[2].targetEnergy) <= SOLUTIONS[2].tolerance) {
      onPass();
    }
  }, [energy, isCompleted, onPass]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    let time = 0;
    let animId;

    const animate = () => {
      time += 0.05;
      const w = canvas.width; const h = canvas.height;
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
      const bx = w/2 - 50;
      
      // Barrier
      ctx.strokeStyle = '#ef4444'; ctx.strokeRect(bx, h/2 - 50, 100, 100);
      
      // Wave
      ctx.beginPath();
      ctx.strokeStyle = Math.abs(energy - 45) < 5 ? '#22c55e' : '#eab308';
      ctx.lineWidth = 2;
      for(let x=0; x<w; x+=2) {
        let amp = 30;
        if (x > bx && x < bx+100) { 
            const decay = Math.max(0.01, (50 - energy) / 500);
            amp = 30 * Math.exp(-(x-bx) * decay);
        } else if (x >= bx+100) { 
            const decayTotal = Math.max(0.01, (50 - energy) / 500);
            amp = 30 * Math.exp(-100 * decayTotal);
        }
        const y = h/2 + amp * Math.sin((x * 0.1) - time);
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.stroke();
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [energy]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-8 left-8 bg-slate-900/90 border border-slate-700 p-6 rounded-xl w-80 backdrop-blur-md">
        <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><Zap size={16}/> Tuner</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-slate-400"><span>Energy (E)</span><span>{energy} eV</span></div>
          <input type="range" min="0" max="100" value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))} className="w-full accent-purple-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
        </div>
      </div>
    </div>
  );
};

const ChaosLesson = ({ onPass, isCompleted }) => {
  const [rho, setRho] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isCompleted && Math.abs(rho - SOLUTIONS[3].targetRho) <= SOLUTIONS[3].tolerance) {
      onPass();
    }
  }, [rho, isCompleted, onPass]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    let animId;
    let pts = [];
    let x=0.1, y=0, z=0;
    const dt = 0.01; const sigma = 10; const beta = 8/3;
    
    for(let i=0; i<800; i++) {
        let dx = sigma * (y-x);
        let dy = x * (rho - z) - y;
        let dz = x*y - beta*z;
        x+=dx*dt; y+=dy*dt; z+=dz*dt;
        pts.push({x,y,z});
    }

    let rot = 0;
    const animate = () => {
      rot += 0.005;
      const w = canvas.width; const h = canvas.height;
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
      const scale = 5; const cx = w/2; const cy = h/2;
      ctx.fillStyle = Math.abs(rho - 28) < 2 ? '#eab308' : '#64748b';
      pts.forEach(p => {
          const rx = p.x * Math.cos(rot) - p.z * Math.sin(rot);
          ctx.fillRect(cx + rx * scale, cy + p.y * scale, 2, 2);
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [rho]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-8 left-8 bg-slate-900/90 border border-slate-700 p-6 rounded-xl w-80 backdrop-blur-md">
        <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2"><RotateCcw size={16}/> Chaos Tuner</h3>
        <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Rayleigh (ρ)</span><span>{rho}</span></div>
        <input type="range" min="0" max="50" step="0.5" value={rho} onChange={(e) => setRho(parseFloat(e.target.value))} className="w-full accent-yellow-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
      </div>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====

const Entangledu = () => {
  const [view, setView] = useState('menu');
  const [activeLesson, setActiveLesson] = useState(null);
  
  // UPDATED: Using the imported hook
  const [tokens, setTokens] = useLocalStorage('entangledu-tokens', []);
  const [wallet, setWallet] = useLocalStorage('entangledu-wallet', null);
  
  const [fusionSelected, setFusionSelected] = useState([]);
  
  const GEM_URL = "https://gemini.google.com/app"; 

  const lessons = [
    { id: 1, title: "Holographic Principle", type: "AdS/CFT", comp: HolographicLesson, color: "text-cyan-400" },
    { id: 2, title: "Quantum Tunneling", type: "QM", comp: QuantumLesson, color: "text-purple-400" },
    { id: 3, title: "Lorenz Attractor", type: "Chaos", comp: ChaosLesson, color: "text-yellow-400" }
  ];

  const handleConnect = () => setTimeout(() => setWallet("0x71...8A"), 500);

  const handlePass = (lesson) => {
    if (!tokens.find(t => t.id === lesson.id)) {
      setTokens([...tokens, { id: lesson.id, title: lesson.title, timestamp: Date.now(), type: "KNOWLEDGE" }]);
    }
  };

  const toggleFusion = (id) => {
    if (fusionSelected.includes(id)) setFusionSelected(fusionSelected.filter(i => i !== id));
    else if (fusionSelected.length < 2) setFusionSelected([...fusionSelected, id]);
  };

  const fuseTokens = () => {
    const parent1 = lessons.find(l => l.id === fusionSelected[0]);
    const parent2 = lessons.find(l => l.id === fusionSelected[1]);
    setTokens([...tokens, { id: `f-${Date.now()}`, title: `Fused: ${parent1.type} + ${parent2.type}`, timestamp: Date.now(), type: "FUSION" }]);
    setFusionSelected([]);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden relative selection:bg-cyan-500/30">
      <button onClick={handleConnect} className={`absolute top-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono backdrop-blur-md ${wallet ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-slate-800/50 border-slate-700 text-slate-400"}`}>
        <Wallet size={12} /> {wallet ? wallet : "Connect Wallet"}
      </button>

      {view === 'menu' && (
        <div className="max-w-5xl mx-auto p-8 pt-20">
          <header className="mb-12">
             <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent mb-2">ENTANGLEDU</h1>
             <p className="text-slate-500 font-mono text-sm">Decentralized Knowledge Protocol</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Modules</h2>
              {lessons.map(l => {
                const completed = tokens.find(t => t.id === l.id);
                const selected = fusionSelected.includes(l.id);
                return (
                  <div key={l.id} onClick={() => { if(completed) toggleFusion(l.id); else { setActiveLesson(l); setView('lesson'); }}}
                    className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${selected ? 'border-white bg-white/5' : completed ? 'border-slate-800 bg-slate-900/50 opacity-75' : 'border-slate-800 bg-slate-900'}`}>
                    <div className="flex justify-between items-center">
                       <div><h3 className={`font-bold text-lg ${l.color}`}>{l.title}</h3><span className="text-xs text-slate-500">{l.type}</span></div>
                       {completed ? <Unlock className="text-green-500" size={20}/> : <Lock className="text-slate-600" size={20}/>} 
                    </div>
                    {completed && (<div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity ${selected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}><div className="flex items-center gap-2 text-white font-bold">{selected ? <CheckCircle className="text-green-400"/> : <Plus/>} {selected ? "Selected for Fusion" : "Select for Fusion"}</div></div>)}
                  </div>
                )
              })}
              {fusionSelected.length === 2 && (
                 <button onClick={fuseTokens} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"><BrainCircuit /> Synthesize New Token</button>
              )}
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-fit">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Inventory</h2>
               <div className="space-y-2">
                 {tokens.map(t => (<div key={t.id} className="bg-black/40 p-3 rounded border border-slate-800 flex items-center gap-3"><div className={`w-1 h-8 rounded-full ${t.type === 'FUSION' ? 'bg-white' : 'bg-cyan-500'}`}/><div><div className="text-xs font-bold text-slate-200">{t.title}</div><div className="text-[10px] text-slate-500 font-mono">{t.type}</div></div></div>))}
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'lesson' && activeLesson && (
        <div className="w-full h-full absolute inset-0 bg-[#020617]">
           <div className="absolute top-6 left-6 z-20 flex gap-4">
              <button onClick={() => setView('menu')} className="p-2 bg-slate-800/50 rounded-full border border-slate-700 text-slate-300 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
              <div><h2 className={`font-bold ${activeLesson.color}`}>{activeLesson.title}</h2><p className="text-xs text-slate-500">Interactive Lab</p></div>
           </div>
           
           {/* Link to Gemini Gem */}
           <a href={GEM_URL} target="_blank" rel="noreferrer" className="absolute top-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-xs text-slate-300 hover:bg-slate-700 transition-colors">
             <BrainCircuit size={14} /> Open Gemini Tutor
           </a>

           {/* Render Active Lesson */}
           <activeLesson.comp 
             onPass={() => handlePass(activeLesson)} 
             isCompleted={!!tokens.find(t => t.id === activeLesson.id)} 
           />
        </div>
      )}
    </div>
  );
};

export default Entangledu;
