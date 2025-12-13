import React, { useState } from 'react';
import { 
    Wallet, BrainCircuit, ChevronLeft, 
    Lock, Unlock, CheckCircle, Plus 
} from 'lucide-react';

// --- IMPORTS ---
// Ensure these files exist in your 'components' and 'hooks' folders
import HolographicLessonEnhanced from '../components/HolographicLessonEnhanced.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

// Placeholder components for missing lessons
const QuantumLessonEnhanced = ({ isCompleted, onPass }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-4xl font-bold text-purple-400 mb-4">Quantum Tunneling Lab</h2>
      <p className="text-slate-400 mb-8">Coming soon...</p>
      {!isCompleted && (
        <button onClick={onPass} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700">
          Complete Lesson
        </button>
      )}
    </div>
  </div>
);

const ChaosLessonEnhanced = ({ isCompleted, onPass }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-4xl font-bold text-yellow-400 mb-4">Lorenz Attractor Lab</h2>
      <p className="text-slate-400 mb-8">Coming soon...</p>
      {!isCompleted && (
        <button onClick={onPass} className="px-6 py-3 bg-yellow-600 rounded-lg hover:bg-yellow-700">
          Complete Lesson
        </button>
      )}
    </div>
  </div>
);

const EntangleduMain = () => {
    const [view, setView] = useState('menu');
    const [activeLessonId, setActiveLessonId] = useState(null);
    
    // PERSISTENCE: State survives refresh using our custom hook
    const [tokens, setTokens] = useLocalStorage('entangledu_tokens', []);
    const [wallet, setWallet] = useLocalStorage('entangledu_wallet', null);
    
    const [fusionSelected, setFusionSelected] = useState([]);

    // Module Configuration
    const lessons = [
        { 
            id: 1, 
            title: "Holographic Principle", 
            type: "AdS/CFT", 
            comp: HolographicLessonEnhanced, 
            color: "text-cyan-400",
            gradient: "from-cyan-500 to-blue-600"
        },
        { 
            id: 2, 
            title: "Quantum Tunneling", 
            type: "QM", 
            comp: QuantumLessonEnhanced, 
            color: "text-purple-400",
            gradient: "from-purple-500 to-pink-600"
        },
        { 
            id: 3, 
            title: "Lorenz Attractor", 
            type: "Chaos", 
            comp: ChaosLessonEnhanced, 
            color: "text-yellow-400",
            gradient: "from-yellow-500 to-orange-600"
        }
    ];

    const activeLessonConfig = lessons.find(l => l.id === activeLessonId);

    // --- Actions ---

    const handleConnect = () => {
        // Simulates connecting a wallet
        setTimeout(() => {
            setWallet("0x71...8A");
        }, 500);
    };

    const handlePass = (lessonId, title, type) => {
        // Mints a "Knowledge" token if not already owned
        if (!tokens.find(t => t.id === lessonId)) {
            const newToken = { 
                id: lessonId, 
                title, 
                type, 
                timestamp: Date.now(), 
                kind: "KNOWLEDGE" 
            };
            setTokens([...tokens, newToken]);
        }
    };

    const toggleFusion = (id) => {
        // Toggles selection for the fusion engine
        if (fusionSelected.includes(id)) {
            setFusionSelected(fusionSelected.filter(i => i !== id));
        } else if (fusionSelected.length < 2) {
            setFusionSelected([...fusionSelected, id]);
        }
    };

    const fuseTokens = () => {
        // Combines two tokens into a new "Fusion" token
        if (fusionSelected.length !== 2) return;
        
        const parent1 = lessons.find(l => l.id === fusionSelected[0]);
        const parent2 = lessons.find(l => l.id === fusionSelected[1]);
        
        const fusedToken = { 
            id: `f-${Date.now()}`, 
            title: `Synthesis: ${parent1.type} + ${parent2.type}`, 
            timestamp: Date.now(), 
            kind: "FUSION" 
        };
        
        setTokens([...tokens, fusedToken]);
        setFusionSelected([]);
    };

    // --- Render Helpers ---

    const renderMenu = () => (
        <div className="max-w-5xl mx-auto p-8 pt-24 animate-fade-in">
            <header className="mb-12">
                <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent mb-2 tracking-tight">
                    ENTANGLEDU
                </h1>
                <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
                    Decentralized Knowledge Protocol // v2.0
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Module Grid */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Available Modules
                        </h2>
                        {fusionSelected.length > 0 && (
                            <span className="text-xs font-mono text-purple-400">
                                FUSION ENGINE: {fusionSelected.length}/2 LOADED
                            </span>
                        )}
                    </div>

                    {lessons.map(l => {
                        const isUnlocked = tokens.find(t => t.id === l.id);
                        const isSelected = fusionSelected.includes(l.id);

                        return (
                            <div 
                                key={l.id} 
                                onClick={() => { 
                                    if (isUnlocked) toggleFusion(l.id); 
                                    else { setActiveLessonId(l.id); setView('lesson'); }
                                }}
                                className={`
                                    relative p-6 rounded-xl border transition-all cursor-pointer overflow-hidden group
                                    ${isSelected 
                                        ? 'border-purple-500 bg-purple-500/10' 
                                        : isUnlocked 
                                            ? 'border-slate-800 bg-slate-900/40 opacity-60 hover:opacity-100' 
                                            : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <h3 className={`font-bold text-xl ${l.color} mb-1`}>{l.title}</h3>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                            {l.type}
                                        </span>
                                    </div>
                                    {isUnlocked 
                                        ? <Unlock className="text-green-500" size={24}/> 
                                        : <Lock className="text-slate-600 group-hover:text-slate-400 transition-colors" size={24}/>
                                    }
                                </div>

                                {/* Fusion Selection Overlay */}
                                {isUnlocked && (
                                    <div className={`
                                        absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px] 
                                        transition-opacity duration-300
                                        ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                                    `}>
                                        <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                                            {isSelected ? <CheckCircle className="text-purple-400"/> : <Plus/>} 
                                            {isSelected ? "READY FOR SYNTHESIS" : "SELECT FOR FUSION"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Fusion Button */}
                    {fusionSelected.length === 2 && (
                        <button 
                            onClick={fuseTokens} 
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                        >
                            <BrainCircuit /> SYNTHESIZE NEW KNOWLEDGE TOKEN
                        </button>
                    )}
                </div>

                {/* Inventory / Wallet Side Panel */}
                <div className="h-fit">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sticky top-24">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                            Cryptographic Proofs
                        </h2>
                        <div className="space-y-3">
                            {tokens.length === 0 && (
                                <div className="text-center py-8 text-slate-600 text-xs italic">
                                    No proofs found on chain. <br/> Complete a module to mint.
                                </div>
                            )}
                            {tokens.map(t => (
                                <div key={t.id} className="bg-black/40 p-3 rounded border border-slate-800 flex items-center gap-3 animate-slide-in">
                                    <div className={`w-1.5 h-8 rounded-full ${t.kind === 'FUSION' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-cyan-500'}`}/>
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">{t.title}</div>
                                        <div className="text-[10px] text-slate-500 font-mono flex gap-2">
                                            <span>{t.kind}</span>
                                            <span>•</span>
                                            <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
            {/* Navbar */}
            <nav className="absolute top-0 left-0 right-0 p-6 flex justify-end z-50">
                <button 
                    onClick={handleConnect} 
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono backdrop-blur-md transition-all
                        ${wallet 
                            ? "bg-green-500/10 border-green-500/50 text-green-400" 
                            : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                        }
                    `}
                >
                    <Wallet size={14} /> 
                    {wallet ? wallet : "Connect Wallet"}
                </button>
            </nav>

            {/* View Router */}
            {view === 'menu' && renderMenu()}

            {view === 'lesson' && activeLessonConfig && (
                <div className="fixed inset-0 bg-[#020617] z-40 animate-fade-in">
                    {/* Lesson Header */}
                    <div className="absolute top-6 left-6 z-50 flex gap-4 items-center">
                        <button 
                            onClick={() => setView('menu')} 
                            className="p-2 bg-slate-800/50 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        <div>
                            <h2 className={`text-2xl font-bold ${activeLessonConfig.color}`}>
                                {activeLessonConfig.title}
                            </h2>
                            <p className="text-xs text-slate-500 font-mono">Interactive Lab</p>
                        </div>
                    </div>

                    {/* Render the Active Lesson Component */}
                    <activeLessonConfig.comp 
                        isCompleted={!!tokens.find(t => t.id === activeLessonConfig.id)}
                        onPass={() => handlePass(activeLessonConfig.id, activeLessonConfig.title, activeLessonConfig.type)}
                    />
                </div>
            )}
        </div>
    );
};

export default EntangleduMain;
