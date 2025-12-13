import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Sphere = ({ onPass, position, active, onSolve }) => {
  const [hover, setHover] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={hover ? "#00ffaa" : active ? "#00ff88" : "#444"}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh
        scale={1.1}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={onSolve}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
};
export default Sphere;
