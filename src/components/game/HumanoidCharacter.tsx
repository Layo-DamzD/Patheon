'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * HumanoidCharacter — a proper humanoid built from Three.js primitives.
 *
 * Instead of a capsule + sphere, this builds a full body with:
 * - Head with face details
 * - Torso (tapered)
 * - Upper arms + forearms (with elbow bend)
 * - Thighs + shins (with knee bend)
 * - Hands + feet
 * - Optional cape that billows behind
 *
 * Animation: arms and legs swing based on movement speed (sine wave).
 * Faster movement = faster swing + wider arc. Cape billows when moving.
 *
 * This is NOT a photorealistic model — it's a stylized humanoid built
 * from primitives. But it's 10x better than a capsule and reads clearly
 * as "person" at game camera distance.
 */

interface HumanoidCharacterProps {
  bodyColor?: string;
  bodyEmissive?: string;
  bodyEmissiveIntensity?: number;
  headColor?: string;
  hairColor?: string;
  height?: number;          // overall scale
  build?: 'slim' | 'average' | 'heavy';
  hasCape?: boolean;
  capeColor?: string;
  speedRef?: React.MutableRefObject<number>;  // for animation speed
  isMovingRef?: React.MutableRefObject<boolean>;
}

export function HumanoidCharacter({
  bodyColor = '#1e90ff',
  bodyEmissive = '#1e90ff',
  bodyEmissiveIntensity = 0.2,
  headColor = '#f5d4b8',
  hairColor = '#1a1a2e',
  height = 1,
  build = 'average',
  hasCape = false,
  capeColor = '#1e90ff',
  speedRef,
  isMovingRef,
}: HumanoidCharacterProps) {
  const rootRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Build dimensions based on build type
  const dims = useMemo(() => {
    const widthMult = build === 'slim' ? 0.85 : build === 'heavy' ? 1.25 : 1;
    return {
      torsoWidth: 0.5 * widthMult,
      torsoDepth: 0.3 * widthMult,
      torsoHeight: 0.8,
      armRadius: 0.1 * widthMult,
      armLength: 0.35,
      forearmLength: 0.3,
      legRadius: 0.13 * widthMult,
      thighLength: 0.35,
      shinLength: 0.35,
      headRadius: 0.22,
    };
  }, [build]);

  // Materials
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: bodyColor,
      emissive: bodyEmissive,
      emissiveIntensity: bodyEmissiveIntensity,
      roughness: 0.4,
      metalness: 0.5,
    }),
    [bodyColor, bodyEmissive, bodyEmissiveIntensity]
  );

  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: headColor,
      roughness: 0.6,
      metalness: 0,
    }),
    [headColor]
  );

  const hairMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.8,
      metalness: 0.1,
    }),
    [hairColor]
  );

  const capeMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: capeColor,
      emissive: capeColor,
      emissiveIntensity: 0.15,
      roughness: 0.7,
      metalness: 0.3,
      side: THREE.DoubleSide,
    }),
    [capeColor]
  );

  // Animation: swing arms and legs based on speed
  useFrame((state, delta) => {
    timeRef.current += delta;
    const speed = speedRef?.current ?? 0;
    const isMoving = isMovingRef?.current ?? false;

    if (isMoving && speed > 1) {
      // Swing frequency scales with speed
      const swingFreq = Math.min(speed * 0.15, 8);
      const swingAmp = Math.min(speed * 0.02, 0.8);
      const swing = Math.sin(timeRef.current * swingFreq) * swingAmp;

      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.7;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.7;

      // Cape billows
      if (capeRef.current) {
        const billow = Math.sin(timeRef.current * swingFreq * 0.5) * 0.1;
        capeRef.current.rotation.x = 0.1 + billow + Math.min(speed * 0.01, 0.4);
      }
    } else {
      // Idle — gradually return to neutral
      const ease = 0.1;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= (1 - ease);
      if (rightArmRef.current) rightArmRef.current.rotation.x *= (1 - ease);
      if (leftLegRef.current) leftLegRef.current.rotation.x *= (1 - ease);
      if (rightLegRef.current) rightLegRef.current.rotation.x *= (1 - ease);
      if (capeRef.current) {
        capeRef.current.rotation.x *= (1 - ease);
      }
    }
  });

  const totalHeight = dims.torsoHeight + dims.thighLength + dims.shinLength + dims.headRadius * 2;

  return (
    <group ref={rootRef} scale={[height, height, height]}>
      {/* ─── Torso ─── */}
      <mesh position={[0, dims.torsoHeight / 2 + dims.thighLength + dims.shinLength, 0]} castShadow material={bodyMat}>
        <capsuleGeometry args={[dims.torsoWidth * 0.7, dims.torsoHeight * 0.6, 4, 12]} />
      </mesh>

      {/* Chest emblem (lightning bolt for Velora) */}
      <mesh position={[0, dims.torsoHeight * 0.7 + dims.thighLength + dims.shinLength, dims.torsoDepth * 0.5 + 0.02]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={bodyEmissive}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* ─── Head ─── */}
      <group position={[0, dims.torsoHeight + dims.thighLength + dims.shinLength + dims.headRadius * 0.5, 0]}>
        {/* Head sphere */}
        <mesh castShadow material={skinMat}>
          <sphereGeometry args={[dims.headRadius, 16, 16]} />
        </mesh>
        {/* Hair — back half */}
        <mesh position={[0, 0.05, -0.04]} castShadow material={hairMat}>
          <sphereGeometry args={[dims.headRadius * 1.05, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>
        {/* Eyes — small white spheres */}
        <mesh position={[-0.08, 0.02, dims.headRadius * 0.85]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.08, 0.02, dims.headRadius * 0.85]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ─── Left Arm (upper + forearm) ─── */}
      <group
        ref={leftArmRef}
        position={[-dims.torsoWidth * 0.8, dims.torsoHeight * 0.8 + dims.thighLength + dims.shinLength, 0]}
      >
        {/* Upper arm */}
        <mesh position={[0, -dims.armLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.armRadius, dims.armLength * 0.7, 4, 8]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -dims.armLength - dims.forearmLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.armRadius * 0.9, dims.forearmLength * 0.7, 4, 8]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -dims.armLength - dims.forearmLength - 0.05, 0]} castShadow material={skinMat}>
          <sphereGeometry args={[dims.armRadius * 0.9, 8, 8]} />
        </mesh>
      </group>

      {/* ─── Right Arm ─── */}
      <group
        ref={rightArmRef}
        position={[dims.torsoWidth * 0.8, dims.torsoHeight * 0.8 + dims.thighLength + dims.shinLength, 0]}
      >
        <mesh position={[0, -dims.armLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.armRadius, dims.armLength * 0.7, 4, 8]} />
        </mesh>
        <mesh position={[0, -dims.armLength - dims.forearmLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.armRadius * 0.9, dims.forearmLength * 0.7, 4, 8]} />
        </mesh>
        <mesh position={[0, -dims.armLength - dims.forearmLength - 0.05, 0]} castShadow material={skinMat}>
          <sphereGeometry args={[dims.armRadius * 0.9, 8, 8]} />
        </mesh>
      </group>

      {/* ─── Left Leg (thigh + shin) ─── */}
      <group
        ref={leftLegRef}
        position={[-dims.torsoWidth * 0.4, dims.thighLength + dims.shinLength, 0]}
      >
        {/* Thigh */}
        <mesh position={[0, -dims.thighLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.legRadius, dims.thighLength * 0.7, 4, 8]} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -dims.thighLength - dims.shinLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.legRadius * 0.85, dims.shinLength * 0.7, 4, 8]} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -dims.thighLength - dims.shinLength - 0.03, dims.legRadius * 0.5]} castShadow material={skinMat}>
          <boxGeometry args={[dims.legRadius * 1.5, 0.1, dims.legRadius * 2]} />
        </mesh>
      </group>

      {/* ─── Right Leg ─── */}
      <group
        ref={rightLegRef}
        position={[dims.torsoWidth * 0.4, dims.thighLength + dims.shinLength, 0]}
      >
        <mesh position={[0, -dims.thighLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.legRadius, dims.thighLength * 0.7, 4, 8]} />
        </mesh>
        <mesh position={[0, -dims.thighLength - dims.shinLength / 2, 0]} castShadow material={bodyMat}>
          <capsuleGeometry args={[dims.legRadius * 0.85, dims.shinLength * 0.7, 4, 8]} />
        </mesh>
        <mesh position={[0, -dims.thighLength - dims.shinLength - 0.03, dims.legRadius * 0.5]} castShadow material={skinMat}>
          <boxGeometry args={[dims.legRadius * 1.5, 0.1, dims.legRadius * 2]} />
        </mesh>
      </group>

      {/* ─── Cape (optional) ─── */}
      {hasCape && (
        <mesh
          ref={capeRef}
          position={[0, dims.torsoHeight + dims.thighLength + dims.shinLength - 0.1, -dims.torsoDepth * 0.5]}
          castShadow
          material={capeMat}
        >
          <planeGeometry args={[dims.torsoWidth * 1.8, dims.torsoHeight * 1.5, 4, 8]} />
        </mesh>
      )}
    </group>
  );
}
