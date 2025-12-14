import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { OrbitControls, Stars } from '@react-three/drei';

export default function PhysicsSandbox({ config, showForceLines, onSuccess, lessonMeta }) {
  const mergedConfig = useMemo(() => {
    return {
      gravity: [0, -9.81, 0],
      initialCamera: [0, 5, 10],
      debug: false,
      ...(config || {}),
    };
  }, [config]);

  const debugEnabled = showForceLines ?? mergedConfig.debug;
  const [objectives, setObjectives] = useState(() => lessonMeta?.objectives || []);

  useEffect(() => {
    // Acceptance criteria: log which standard is active on mount (if present)
    const standardID = lessonMeta?.standardID || lessonMeta?.ngss?.standardID;
    if (standardID) console.log(`[NGSS] Active standard: ${standardID}`);
    else if (lessonMeta?.id) console.log(`[Lesson] Active module: ${lessonMeta.id}`);
  }, [lessonMeta]);

  const handleBoxClick = () => {
    setObjectives((prev) => prev.map((o) => (o.id === 'obj-1' ? { ...o, completed: true } : o)));
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <Canvas shadows camera={{ position: mergedConfig.initialCamera, fov: 50 }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

        <Physics gravity={mergedConfig.gravity} debug={!!debugEnabled}>
          {/* FLOOR */}
          <RigidBody type="fixed" friction={1}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          </RigidBody>

          {/* INTERACTIVE BOX */}
          <RigidBody position={[0, 5, 0]} colliders="cuboid" restitution={0.7}>
            <mesh castShadow onClick={handleBoxClick}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#6366f1" />
            </mesh>
          </RigidBody>
        </Physics>

        <OrbitControls makeDefault />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 p-4 text-white w-full pointer-events-none flex justify-between items-start gap-4">
        <div className="bg-black/40 p-3 rounded backdrop-blur-sm max-w-[70%]">
          <div className="text-xs font-mono text-slate-300">
            {lessonMeta?.title || 'Physics Sandbox'}
          </div>
          <h3 className="font-bold text-indigo-300 text-sm uppercase mt-1">Mission Objectives</h3>
          <ul className="mt-2 space-y-1">
            {objectives.length === 0 && (
              <li className="text-xs text-slate-400">No objectives loaded.</li>
            )}
            {objectives.map((obj) => (
              <li key={obj.id} className="flex items-center text-xs">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${obj.completed ? 'bg-green-500' : 'bg-gray-600'}`}
                />
                {obj.text}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onSuccess && onSuccess({ completed: true, score: 100, moduleId: lessonMeta?.id })}
          className="pointer-events-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded shadow-lg"
        >
          Complete Module
        </button>
      </div>
    </div>
  );
}
