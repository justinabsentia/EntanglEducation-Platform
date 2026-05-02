import React, { useState, useEffect, useMemo } from 'react';
import {
    Wallet,
    BrainCircuit,
    ChevronLeft,
    Lock,
    Unlock,
    CheckCircle,
    Plus
} from 'lucide-react';

import HolographicLessonEnhanced from './components/HolographicLessonEnhanced.jsx';
import QuantumLessonEnhanced from './components/QuantumLessonEnhanced.jsx';
import ChaosLessonEnhanced from './components/ChaosLessonEnhanced.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';

const spatialModes = [
    {
        id: 'ar',
        label: 'Handheld AR',
        hardware: 'Phones + tablets',
        summary: 'Anchored overlays and tap-based concept probes for mobile learners.'
    },
    {
        id: 'xr',
        label: 'Classroom XR',
        hardware: 'Shared mixed reality',
        summary: 'Collaborative concept walls with quick group assessments and oracle verification.'
    },
    {
        id: 'quest',
        label: 'Meta Quest VR',
        hardware: 'Quest 3 / Quest Pro',
        summary: 'Room-scale labs designed for gaze prompts, controller-free exploration, and fusion previews.'
    }
];

const lessons = [
    {
        id: 1,
        title: 'Holographic Principle',
        type: 'Boundary Encoding',
        comp: HolographicLessonEnhanced,
        color: 'text-cyan-400',
        gradient: 'from-cyan-500 to-blue-600',
        spatialUse: 'Black-hole archive scan',
        fusionVisual: 'event-horizon light lattice'
    },
    {
        id: 2,
        title: 'Quantum Tunneling',
        type: 'Wave Escape',
        comp: QuantumLessonEnhanced,
        color: 'text-purple-400',
        gradient: 'from-purple-500 to-pink-600',
        spatialUse: 'Barrier-crossing lab',
        fusionVisual: 'probability ribbon burst'
    },
    {
        id: 3,
        title: 'Lorenz Attractor',
        type: 'Chaos Flight',
        comp: ChaosLessonEnhanced,
        color: 'text-yellow-400',
        gradient: 'from-yellow-500 to-orange-600',
        spatialUse: 'Butterfly-field simulator',
        fusionVisual: 'twin-wing turbulence bloom'
    }
];

const EntangleduMain = () => {
    const [view, setView] = useState('menu');
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [spatialMode, setSpatialMode] = useState('quest');

    const [tokens, setTokens] = useLocalStorage('entangledu_tokens', []);
    const [wallet, setWallet] = useLocalStorage('entangledu_wallet', null);

    const [fusionSelected, setFusionSelected] = useState([]);
    const [minting, setMinting] = useState(false);
    const [oracleLastResponse, setOracleLastResponse] = useState(null);

    const ORACLE_BASE = useMemo(() => {
        return (
            (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ORACLE_URL) ||
            (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ORACLE_URL) ||
            'http://localhost:4000'
        );
    }, []);

    const currentMode = spatialModes.find((mode) => mode.id === spatialMode) || spatialModes[2];
    const verifiedProofIds = new Set(
        tokens.filter((token) => token.kind === 'SOULBOUND_PROOF').map((token) => token.id)
    );
    const verifiedProofCount = tokens.filter((token) => token.kind === 'SOULBOUND_PROOF').length;
    const fusionCount = tokens.filter((token) => token.kind === 'FUSION_NFT').length;

    useEffect(() => {
        const handleTouchStart = (e) => {
            if (view === 'lesson' && e.touches[0].clientX < 20) {
                e.preventDefault();
            }
        };
        const handlePopState = () => {
            if (view === 'lesson') {
                setView('menu');
                setActiveLessonId(null);
            }
        };

        if (view === 'lesson') {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('touchstart', handleTouchStart, { passive: false });
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [view]);

    const activeLessonConfig = lessons.find((lesson) => lesson.id === activeLessonId);

    const handleConnect = () => {
        setTimeout(() => {
            setWallet('0x71...8A');
        }, 500);
    };

    const replaceLessonCredential = (lessonId, credential) => {
        setTokens((prev) => [...prev.filter((token) => token.id !== lessonId), credential]);
    };

    const handlePass = async (lessonId, title, type) => {
        if (tokens.find((token) => token.id === lessonId && token.kind === 'SOULBOUND_PROOF')) {
            return;
        }

        setMinting(true);
        setOracleLastResponse(null);

        try {
            const res = await fetch(`${ORACLE_BASE.replace(/\/+$/, '')}/api/mint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: wallet || '0x_ANON_USER',
                    lessonId,
                    lessonTitle: title
                })
            });

            const data = await res.json();
            setOracleLastResponse(data || { status: res.status });

            if (res.ok && data && data.success && data.certificate) {
                replaceLessonCredential(lessonId, {
                    id: lessonId,
                    title,
                    type,
                    kind: 'SOULBOUND_PROOF',
                    hash: data.certificate.hash,
                    signature: data.certificate.signature,
                    timestamp: data.certificate.timestamp || Date.now(),
                    deviceMode: currentMode.label,
                    credentialType: 'SBT'
                });
            } else {
                alert('Oracle denied minting request. You may retry later.');
            }
        } catch (err) {
            replaceLessonCredential(lessonId, {
                id: lessonId,
                title,
                type,
                timestamp: Date.now(),
                kind: 'LOCAL_PROOF',
                deviceMode: currentMode.label,
                error: String(err)
            });
            setOracleLastResponse({ error: String(err) });
        } finally {
            setMinting(false);
        }
    };

    const toggleFusion = (id) => {
        if (!verifiedProofIds.has(id)) {
            return;
        }

        setFusionSelected((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }

            if (prev.length < 2) {
                return [...prev, id];
            }

            return prev;
        });
    };

    const fuseTokens = () => {
        if (fusionSelected.length !== 2) {
            return;
        }

        const parent1 = lessons.find((lesson) => lesson.id === fusionSelected[0]);
        const parent2 = lessons.find((lesson) => lesson.id === fusionSelected[1]);

        if (!parent1 || !parent2 || !verifiedProofIds.has(parent1.id) || !verifiedProofIds.has(parent2.id)) {
            return;
        }

        setTokens((prev) => [
            ...prev,
            {
                id: `f-${Date.now()}`,
                title: `${parent1.type} × ${parent2.type}`,
                timestamp: Date.now(),
                kind: 'FUSION_NFT',
                parents: [parent1.title, parent2.title],
                deviceMode: currentMode.label,
                visual: `${parent1.fusionVisual} + ${parent2.fusionVisual}`,
                marketStatus: 'Tradable'
            }
        ]);
        setFusionSelected([]);
    };

    const renderMenu = () => (
        <div className="max-w-6xl mx-auto p-6 pt-20 md:p-8 md:pt-24 animate-fade-in">
            <header className="mb-10 space-y-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-300">
                        2026 spatial learning protocol
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent tracking-tight">
                        ENTANGLEDU XR
                    </h1>
                    <p className="max-w-3xl text-sm md:text-base text-slate-300 leading-relaxed">
                        Interactive AR, XR, and Meta Quest-ready concept labs where learners pass short proof-of-knowledge
                        checks, mint soulbound credentials, and unlock one-of-one fusion NFTs built from verified concepts.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {spatialModes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setSpatialMode(mode.id)}
                            className={`rounded-2xl border p-4 text-left transition-all ${
                                spatialMode === mode.id
                                    ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
                            }`}
                        >
                            <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">{mode.label}</div>
                            <div className="mt-2 text-sm font-semibold text-white">{mode.hardware}</div>
                            <div className="mt-2 text-sm text-slate-400">{mode.summary}</div>
                        </button>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">Active mode</div>
                        <div className="mt-2 text-lg font-bold text-white">{currentMode.label}</div>
                        <div className="mt-2 text-sm text-slate-400">{currentMode.summary}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">Soulbound proofs</div>
                        <div className="mt-2 text-3xl font-black text-cyan-400">{verifiedProofCount}</div>
                        <div className="mt-2 text-sm text-slate-400">Pass the lab interaction and quiz to mint oracle-backed credentials.</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">Fusion NFTs</div>
                        <div className="mt-2 text-3xl font-black text-purple-400">{fusionCount}</div>
                        <div className="mt-2 text-sm text-slate-400">Only verified proofs can be fused into tradable one-of-one visualizations.</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Spatial concept missions
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Each mission is tuned for {currentMode.label} and ends with a short proof-of-knowledge checkpoint.
                            </p>
                        </div>
                        {fusionSelected.length > 0 && (
                            <span className="text-xs font-mono text-purple-400">Fusion engine: {fusionSelected.length}/2 proofs loaded</span>
                        )}
                    </div>

                    {lessons.map((lesson) => {
                        const lessonToken = tokens.find((token) => token.id === lesson.id);
                        const isVerified = verifiedProofIds.has(lesson.id);
                        const isSelected = fusionSelected.includes(lesson.id);

                        return (
                            <div
                                key={lesson.id}
                                onClick={() => {
                                    if (isVerified) {
                                        toggleFusion(lesson.id);
                                    } else {
                                        setActiveLessonId(lesson.id);
                                        setView('lesson');
                                    }
                                }}
                                className={`relative overflow-hidden rounded-2xl border p-6 transition-all cursor-pointer group ${
                                    isSelected
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : isVerified
                                            ? 'border-slate-800 bg-slate-900/40 hover:border-purple-400'
                                            : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                                }`}
                            >
                                <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="mb-3 inline-flex rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400">
                                            {lesson.spatialUse}
                                        </div>
                                        <h3 className={`text-2xl font-bold ${lesson.color}`}>{lesson.title}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                                            <span className="rounded-full bg-slate-800 px-2 py-1">{lesson.type}</span>
                                            <span className="rounded-full bg-slate-800 px-2 py-1">{currentMode.label}</span>
                                            <span className="rounded-full bg-slate-800 px-2 py-1">Quiz gated</span>
                                        </div>
                                        <p className="mt-4 max-w-xl text-sm text-slate-400">
                                            {isVerified
                                                ? `Verified soulbound credential minted. Select this proof for ${lesson.fusionVisual}.`
                                                : lessonToken
                                                    ? 'Local completion detected. Re-enter the lab to request an oracle-verified proof.'
                                                    : 'Open the lab, finish the interaction, and answer the checkpoint correctly to unlock minting.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        {isVerified ? (
                                            <>
                                                <div className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-green-300">
                                                    soulbound proof
                                                </div>
                                                <Unlock className="text-green-400" size={24} />
                                            </>
                                        ) : lessonToken ? (
                                            <>
                                                <div className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-yellow-300">
                                                    oracle retry needed
                                                </div>
                                                <CheckCircle className="text-yellow-400" size={24} />
                                            </>
                                        ) : (
                                            <>
                                                <div className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
                                                    launch mission
                                                </div>
                                                <Lock className="text-slate-500 group-hover:text-slate-300 transition-colors" size={24} />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isVerified && (
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px] transition-opacity duration-300 ${
                                            isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 font-bold tracking-wider text-white">
                                            {isSelected ? <CheckCircle className="text-purple-400" /> : <Plus />}
                                            {isSelected ? 'Ready for fusion' : 'Select verified proof'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {fusionSelected.length === 2 && (
                        <button
                            onClick={fuseTokens}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.01]"
                        >
                            <BrainCircuit /> Mint fusion NFT visualization
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Proof wallet + fusion rail
                        </h2>
                        <div className="mt-4 rounded-2xl border border-slate-800 bg-black/20 p-4 text-sm text-slate-300">
                            <div className="font-semibold text-white">Credential rules</div>
                            <ul className="mt-3 space-y-2 text-sm text-slate-400">
                                <li>• Pass the interaction and short quiz to request a soulbound proof.</li>
                                <li>• Oracle-backed proofs stay non-transferable and represent verified knowledge.</li>
                                <li>• Two verified proofs unlock a unique fusion NFT that can be traded or listed.</li>
                            </ul>
                        </div>

                        <div className="mt-4 space-y-3">
                            {tokens.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-800 py-8 text-center text-xs italic text-slate-600">
                                    No proofs minted yet. Complete a spatial mission to start your credential stack.
                                </div>
                            )}

                            {tokens.map((token) => (
                                <div key={token.id} className="flex gap-3 rounded-2xl border border-slate-800 bg-black/40 p-4 animate-slide-in">
                                    <div
                                        className={`mt-1 h-10 w-1.5 rounded-full ${
                                            token.kind === 'FUSION_NFT'
                                                ? 'bg-white shadow-[0_0_12px_white]'
                                                : token.kind === 'SOULBOUND_PROOF'
                                                    ? 'bg-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                                                    : 'bg-yellow-400'
                                        }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-bold text-slate-200">{token.title}</div>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
                                            <span
                                                className={
                                                    token.kind === 'FUSION_NFT'
                                                        ? 'text-purple-300'
                                                        : token.kind === 'SOULBOUND_PROOF'
                                                            ? 'text-green-400'
                                                            : 'text-yellow-300'
                                                }
                                            >
                                                {token.kind}
                                            </span>
                                            <span>•</span>
                                            <span>{token.deviceMode || 'Legacy Mode'}</span>
                                            <span>•</span>
                                            <span>{new Date(token.timestamp).toLocaleString()}</span>
                                        </div>
                                        {token.parents && (
                                            <div className="mt-2 text-[11px] text-slate-400">Parents: {token.parents.join(' + ')}</div>
                                        )}
                                        {token.visual && (
                                            <div className="mt-1 text-[11px] text-slate-500">Visualization: {token.visual}</div>
                                        )}
                                        {token.signature && (
                                            <div className="mt-1 truncate text-[10px] font-mono text-slate-600">
                                                Signature: {token.signature.substring(0, 18)}...
                                            </div>
                                        )}
                                        {token.hash && (
                                            <div className="mt-1 truncate text-[10px] font-mono text-slate-600">Hash: {token.hash}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {oracleLastResponse && (
                            <div className="mt-4 rounded-xl bg-black/20 p-2 font-mono text-[10px] text-slate-400">
                                <div className="mb-1 text-xs font-bold text-slate-200">Oracle last response</div>
                                <pre className="whitespace-pre-wrap">{JSON.stringify(oracleLastResponse, null, 2)}</pre>
                            </div>
                        )}

                        {minting && <div className="mt-3 text-xs text-slate-300">Contacting oracle to mint proof-of-knowledge...</div>}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
            <nav className="absolute left-0 right-0 top-0 z-50 p-6 flex justify-end">
                <button
                    onClick={handleConnect}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono backdrop-blur-md transition-all ${
                        wallet
                            ? 'border-green-500/50 bg-green-500/10 text-green-400'
                            : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                >
                    <Wallet size={14} />
                    {wallet || 'Connect Wallet'}
                </button>
            </nav>

            {view === 'menu' && renderMenu()}

            {view === 'lesson' && activeLessonConfig && (
                <div className="fixed inset-0 z-40 bg-[#020617] animate-fade-in">
                    <div className="absolute left-6 top-6 z-50 flex items-center gap-4">
                        <button
                            onClick={() => setView('menu')}
                            className="rounded-full border border-slate-700 bg-slate-800/50 p-2 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className={`text-2xl font-bold ${activeLessonConfig.color}`}>{activeLessonConfig.title}</h2>
                            <p className="text-xs font-mono text-slate-500">
                                {currentMode.label} interactive lab // proof-of-knowledge required
                            </p>
                        </div>
                    </div>

                    <activeLessonConfig.comp
                        isCompleted={verifiedProofIds.has(activeLessonConfig.id)}
                        modeLabel={currentMode.label}
                        onPass={() => handlePass(activeLessonConfig.id, activeLessonConfig.title, activeLessonConfig.type)}
                        oracleState={{ minting, lastResponse: oracleLastResponse }}
                    />
                </div>
            )}
        </div>
    );
};

export default EntangleduMain;
