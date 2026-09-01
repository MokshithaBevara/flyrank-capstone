"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

export const COLORS = [
  { name: "Ember", hex: "#f97316" },
  { name: "Ocean", hex: "#0ea5e9" },
  { name: "Mint", hex: "#10b981" },
  { name: "Violet", hex: "#8b5cf6" },
];

function Orb({
  color,
  wireframe,
  celebrateSignal,
}: {
  color: string;
  wireframe: boolean;
  celebrateSignal: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleTarget = useRef(1);
  const { pointer, viewport } = useThree();

  const lastSignal = useRef(celebrateSignal);
  if (celebrateSignal !== lastSignal.current) {
    lastSignal.current = celebrateSignal;
    scaleTarget.current = 1.35;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Gently follow the cursor — the interaction beyond plain orbiting
    const targetX = (pointer.y * viewport.height) / 8;
    const targetY = (pointer.x * viewport.width) / 8;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y +=
      0.003 + (targetY - meshRef.current.rotation.y) * 0.02;

    // Ease the celebrate pulse back down to normal size
    scaleTarget.current += (1 - scaleTarget.current) * Math.min(delta * 4, 1);
    meshRef.current.scale.setScalar(scaleTarget.current);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 4]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.25}
        metalness={0.4}
      />
    </mesh>
  );
}

export default function StreakOrb({
  color,
  wireframe,
  celebrateSignal,
}: {
  color: string;
  wireframe: boolean;
  celebrateSignal: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <Orb color={color} wireframe={wireframe} celebrateSignal={celebrateSignal} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
    </Canvas>
  );
}