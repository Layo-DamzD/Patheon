'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * HumanoidCharacter v3 — real human proportions, not mannequin.
 *
 * Key improvements over v2:
 * - Hourglass female body (chest + hips wider than waist)
 * - Rounded limbs (not stick-straight capsules)
 * - Color blocking: primary suit + accent color (belt, gauntlets, boots, side lines)
 * - Visible face with features (jawline, eyes, lips)
 * - Ponytail that trails behind when sprinting
 * - Forward lean when moving at speed
 *
 * Body shape can be: 'female-hourglass' | 'male-athletic'
 */

interface HumanoidCharacterProps {
  primaryColor?: string;        // main suit color
  accentColor?: string;         // belt/gauntlet/emblem color
  skinColor?: string;
  hairColor?: string;
  bodyShape?: 'female-hourglass' | 'male-athletic';
  height?: number;
  hasCape?: boolean;
  capeColor?: string;
  hasPonytail?: boolean;
  speedRef?: React.MutableRefObject<number>;
  isMovingRef?: React.MutableRefObject<boolean>;
}

export function HumanoidCharacter({
  primaryColor = '#1e90ff',
  accentColor = '#debf63',
  skinColor = '#f5d4b8',
  hairColor = '#1a1a2e',
  bodyShape = 'female-hourglass',
  height = 1,
  hasCape = false,
  capeColor,
  hasPonytail = true,
  speedRef,
  isMovingRef,
}: HumanoidCharacterProps) {
  const rootRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const ponytailRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Body proportions based on shape
  const dims = useMemo(() => {
    if (bodyShape === 'female-hourglass') {
      return {
        chestWidth: 0.6,
        waistWidth: 0.36,   // very narrow — strong hourglass
        hipWidth: 0.68,     // much wider than chest
        torsoDepth: 0.34,
        torsoHeight: 0.85,
        shoulderWidth: 0.5,
        armRadius: 0.11,
        armLength: 0.32,
        forearmLength: 0.28,
        legRadius: 0.14,
        thighLength: 0.42,
        shinLength: 0.42,
        headRadius: 0.26,
        bustSize: 0.22,     // bigger bust
        buttSize: 0.2,      // bigger butt
      };
    } else {
      // male-athletic
      return {
        chestWidth: 0.62,
        waistWidth: 0.5,
        hipWidth: 0.55,
        torsoDepth: 0.36,
        torsoHeight: 0.85,
        shoulderWidth: 0.7,  // wider shoulders
        armRadius: 0.15,
        armLength: 0.34,
        forearmLength: 0.3,
        legRadius: 0.16,
        thighLength: 0.4,
        shinLength: 0.4,
        headRadius: 0.26,
        bustSize: 0,
        buttSize: 0.05,
      };
    }
  }, [bodyShape]);

  // Materials
  const suitMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.15,
      roughness: 0.4,
      metalness: 0.4,
    }),
    [primaryColor]
  );

  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.6,
    }),
    [accentColor]
  );

  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.6,
      metalness: 0,
    }),
    [skinColor]
  );

  const hairMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.7,
      metalness: 0.2,
    }),
    [hairColor]
  );

  const capeMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: capeColor ?? primaryColor,
      emissive: capeColor ?? primaryColor,
      emissiveIntensity: 0.2,
      roughness: 0.7,
      metalness: 0.3,
      side: THREE.DoubleSide,
    }),
    [capeColor, primaryColor]
  );

  const legBaseY = dims.thighLength + dims.shinLength;

  // Animation
  useFrame((state, delta) => {
    timeRef.current += delta;
    const speed = speedRef?.current ?? 0;
    const isMoving = isMovingRef?.current ?? false;

    if (isMoving && speed > 1) {
      const swingFreq = Math.min(speed * 0.15, 8);
      const swingAmp = Math.min(speed * 0.025, 0.9);
      const swing = Math.sin(timeRef.current * swingFreq) * swingAmp;

      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.7;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.7;

      // Forward lean when moving fast
      const leanAmount = Math.min(speed * 0.005, 0.25);
      if (torsoRef.current) torsoRef.current.rotation.x = leanAmount;

      // Ponytail whips with motion
      if (ponytailRef.current) {
        const whip = Math.sin(timeRef.current * swingFreq * 0.6) * 0.15;
        ponytailRef.current.rotation.x = -0.3 - leanAmount + whip;
        ponytailRef.current.rotation.z = Math.sin(timeRef.current * swingFreq * 0.4) * 0.1;
      }

      // Cape billows
      if (capeRef.current) {
        const billow = Math.sin(timeRef.current * swingFreq * 0.5) * 0.1;
        capeRef.current.rotation.x = 0.15 + billow + Math.min(speed * 0.012, 0.5);
      }
    } else {
      // Idle — ease back to neutral
      const ease = 0.1;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= (1 - ease);
      if (rightArmRef.current) rightArmRef.current.rotation.x *= (1 - ease);
      if (leftLegRef.current) leftLegRef.current.rotation.x *= (1 - ease);
      if (rightLegRef.current) rightLegRef.current.rotation.x *= (1 - ease);
      if (torsoRef.current) torsoRef.current.rotation.x *= (1 - ease);
      if (ponytailRef.current) {
        ponytailRef.current.rotation.x *= (1 - ease);
        ponytailRef.current.rotation.z *= (1 - ease);
      }
      if (capeRef.current) {
        capeRef.current.rotation.x *= (1 - ease);
      }
    }
  });

  return (
    <group ref={rootRef} scale={[height, height, height]}>
      {/* ═══ ROOT: lean forward when moving ═══ */}
      <group ref={torsoRef}>

        {/* ─── Hips (widest part for female) ─── */}
        <mesh position={[0, legBaseY + 0.05, 0]} castShadow material={suitMat}>
          <boxGeometry args={[dims.hipWidth, 0.25, dims.torsoDepth]} />
        </mesh>

        {/* Butt protrusion (back) */}
        {dims.buttSize > 0 && (
          <mesh position={[0, legBaseY + 0.05, -dims.torsoDepth / 2 - dims.buttSize * 0.3]} castShadow material={suitMat}>
            <sphereGeometry args={[dims.buttSize, 12, 12]} />
          </mesh>
        )}

        {/* ─── Waist (narrowest part) ─── */}
        <mesh position={[0, legBaseY + 0.35, 0]} castShadow material={suitMat}>
          <boxGeometry args={[dims.waistWidth, 0.3, dims.torsoDepth * 0.9]} />
        </mesh>

        {/* Gold belt at waist */}
        <mesh position={[0, legBaseY + 0.3, 0]} castShadow material={accentMat}>
          <boxGeometry args={[dims.waistWidth + 0.04, 0.08, dims.torsoDepth * 0.95]} />
        </mesh>

        {/* ─── Chest (wider than waist, for female = with bust) ─── */}
        <mesh position={[0, legBaseY + 0.75, 0]} castShadow material={suitMat}>
          <boxGeometry args={[dims.chestWidth, 0.4, dims.torsoDepth]} />
        </mesh>

        {/* Bust protrusion (female only) */}
        {dims.bustSize > 0 && (
          <>
            <mesh position={[-0.13, legBaseY + 0.78, dims.torsoDepth / 2 - 0.02]} castShadow material={suitMat}>
              <sphereGeometry args={[dims.bustSize, 12, 12]} />
            </mesh>
            <mesh position={[0.13, legBaseY + 0.78, dims.torsoDepth / 2 - 0.02]} castShadow material={suitMat}>
              <sphereGeometry args={[dims.bustSize, 12, 12]} />
            </mesh>
          </>
        )}

        {/* Lightning emblem on chest (gold, bigger) */}
        <mesh position={[0, legBaseY + 0.78, dims.torsoDepth / 2 + 0.02]}>
          <planeGeometry args={[0.25, 0.35]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Gold lightning side lines (running down torso sides) — signature accent */}
        <mesh position={[-dims.chestWidth / 2 - 0.01, legBaseY + 0.6, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.04]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        <mesh position={[dims.chestWidth / 2 + 0.01, legBaseY + 0.6, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.04]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>

        {/* Shoulder accents (gold) */}
        <mesh position={[-dims.chestWidth / 2, legBaseY + 0.95, 0]} castShadow material={accentMat}>
          <sphereGeometry args={[0.13, 12, 12]} />
        </mesh>
        <mesh position={[dims.chestWidth / 2, legBaseY + 0.95, 0]} castShadow material={accentMat}>
          <sphereGeometry args={[0.13, 12, 12]} />
        </mesh>

        {/* ─── Neck ─── */}
        <mesh position={[0, legBaseY + 1.05, 0]} castShadow material={skinMat}>
          <cylinderGeometry args={[0.1, 0.12, 0.15, 8]} />
        </mesh>

        {/* ─── Head (visible face, NOT a mask) ─── */}
        <group position={[0, legBaseY + 1.35, 0]}>
          {/* Head sphere — skin tone */}
          <mesh castShadow material={skinMat}>
            <sphereGeometry args={[dims.headRadius, 16, 16]} />
          </mesh>

          {/* Hair — covers back and top ONLY (face stays visible) */}
          <mesh position={[0, 0.05, -0.04]} castShadow material={hairMat}>
            <sphereGeometry args={[dims.headRadius * 1.02, 16, 16, Math.PI * 0.2, Math.PI * 1.6, 0, Math.PI * 0.65]} />
          </mesh>

          {/* Eyes — BIG, white, almond-shaped (visible at game distance) */}
          <mesh position={[-0.09, 0.03, dims.headRadius * 0.75]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.09, 0.03, dims.headRadius * 0.75]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} roughness={0.2} />
          </mesh>

          {/* Pupils — colored, glowing */}
          <mesh position={[-0.09, 0.03, dims.headRadius * 0.82]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
          <mesh position={[0.09, 0.03, dims.headRadius * 0.82]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>

          {/* Lips — bigger, accent-colored */}
          <mesh position={[0, -0.12, dims.headRadius * 0.78]}>
            <boxGeometry args={[0.14, 0.035, 0.03]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} roughness={0.4} />
          </mesh>

          {/* Eyebrows — bigger */}
          <mesh position={[-0.09, 0.13, dims.headRadius * 0.75]}>
            <boxGeometry args={[0.1, 0.025, 0.025]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} />
          </mesh>
          <mesh position={[0.09, 0.13, dims.headRadius * 0.75]}>
            <boxGeometry args={[0.1, 0.025, 0.025]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} />
          </mesh>
        </group>

        {/* ─── Ponytail (trails behind, whips when running) ─── */}
        {hasPonytail && (
          <group ref={ponytailRef} position={[0, legBaseY + 1.4, -dims.headRadius * 0.6]}>
            {/* Hair tie (gold) */}
            <mesh material={accentMat}>
              <sphereGeometry args={[0.07, 10, 10]} />
            </mesh>
            {/* Ponytail — segmented for natural flow */}
            <mesh position={[0, 0.05, -0.2]} castShadow material={hairMat}>
              <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
            </mesh>
            <mesh position={[0, 0.1, -0.45]} castShadow material={hairMat}>
              <capsuleGeometry args={[0.055, 0.3, 4, 8]} />
            </mesh>
            <mesh position={[0, 0.12, -0.7]} castShadow material={hairMat}>
              <capsuleGeometry args={[0.045, 0.25, 4, 8]} />
            </mesh>
            <mesh position={[0, 0.1, -0.95]} castShadow material={hairMat}>
              <sphereGeometry args={[0.05, 8, 8]} />
            </mesh>
          </group>
        )}

        {/* ─── Left Arm (upper + forearm + gauntlet) ─── */}
        <group
          ref={leftArmRef}
          position={[-dims.chestWidth / 2 - 0.05, legBaseY + 0.92, 0]}
        >
          {/* Upper arm — slightly rounded */}
          <mesh position={[0, -dims.armLength / 2, 0]} castShadow material={suitMat}>
            <capsuleGeometry args={[dims.armRadius, dims.armLength * 0.65, 6, 12]} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -dims.armLength - dims.forearmLength / 2, 0]} castShadow material={suitMat}>
            <capsuleGeometry args={[dims.armRadius * 0.92, dims.forearmLength * 0.65, 6, 12]} />
          </mesh>
          {/* Gold gauntlet (wrist) */}
          <mesh position={[0, -dims.armLength - dims.forearmLength + 0.05, 0]} castShadow material={accentMat}>
            <cylinderGeometry args={[dims.armRadius * 0.95, dims.armRadius * 1.05, 0.12, 10]} />
          </mesh>
          {/* Hand — skin */}
          <mesh position={[0, -dims.armLength - dims.forearmLength - 0.08, 0]} castShadow material={skinMat}>
            <sphereGeometry args={[dims.armRadius * 0.9, 10, 10]} />
          </mesh>
        </group>

        {/* ─── Right Arm ─── */}
        <group
          ref={rightArmRef}
          position={[dims.chestWidth / 2 + 0.05, legBaseY + 0.92, 0]}
        >
          <mesh position={[0, -dims.armLength / 2, 0]} castShadow material={suitMat}>
            <capsuleGeometry args={[dims.armRadius, dims.armLength * 0.65, 6, 12]} />
          </mesh>
          <mesh position={[0, -dims.armLength - dims.forearmLength / 2, 0]} castShadow material={suitMat}>
            <capsuleGeometry args={[dims.armRadius * 0.92, dims.forearmLength * 0.65, 6, 12]} />
          </mesh>
          <mesh position={[0, -dims.armLength - dims.forearmLength + 0.05, 0]} castShadow material={accentMat}>
            <cylinderGeometry args={[dims.armRadius * 0.95, dims.armRadius * 1.05, 0.12, 10]} />
          </mesh>
          <mesh position={[0, -dims.armLength - dims.forearmLength - 0.08, 0]} castShadow material={skinMat}>
            <sphereGeometry args={[dims.armRadius * 0.9, 10, 10]} />
          </mesh>
        </group>
      </group>

      {/* ─── Left Leg (thigh + shin + boot) ─── */}
      <group
        ref={leftLegRef}
        position={[-dims.hipWidth * 0.32, legBaseY, 0]}
      >
        {/* Thigh — slight curve (wider at top) */}
        <mesh position={[0, -dims.thighLength / 2, 0]} castShadow material={suitMat}>
          <capsuleGeometry args={[dims.legRadius, dims.thighLength * 0.65, 6, 12]} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -dims.thighLength - dims.shinLength / 2, 0]} castShadow material={suitMat}>
          <capsuleGeometry args={[dims.legRadius * 0.85, dims.shinLength * 0.65, 6, 12]} />
        </mesh>
        {/* Gold boot cuff */}
        <mesh position={[0, -dims.thighLength - dims.shinLength + 0.1, 0]} castShadow material={accentMat}>
          <cylinderGeometry args={[dims.legRadius * 0.95, dims.legRadius * 1.1, 0.15, 10]} />
        </mesh>
        {/* Foot (gold boot) */}
        <mesh position={[0, -dims.thighLength - dims.shinLength - 0.05, dims.legRadius * 0.6]} castShadow material={accentMat}>
          <boxGeometry args={[dims.legRadius * 1.4, 0.12, dims.legRadius * 2.2]} />
        </mesh>
      </group>

      {/* ─── Right Leg ─── */}
      <group
        ref={rightLegRef}
        position={[dims.hipWidth * 0.32, legBaseY, 0]}
      >
        <mesh position={[0, -dims.thighLength / 2, 0]} castShadow material={suitMat}>
          <capsuleGeometry args={[dims.legRadius, dims.thighLength * 0.65, 6, 12]} />
        </mesh>
        <mesh position={[0, -dims.thighLength - dims.shinLength / 2, 0]} castShadow material={suitMat}>
          <capsuleGeometry args={[dims.legRadius * 0.85, dims.shinLength * 0.65, 6, 12]} />
        </mesh>
        <mesh position={[0, -dims.thighLength - dims.shinLength + 0.1, 0]} castShadow material={accentMat}>
          <cylinderGeometry args={[dims.legRadius * 0.95, dims.legRadius * 1.1, 0.15, 10]} />
        </mesh>
        <mesh position={[0, -dims.thighLength - dims.shinLength - 0.05, dims.legRadius * 0.6]} castShadow material={accentMat}>
          <boxGeometry args={[dims.legRadius * 1.4, 0.12, dims.legRadius * 2.2]} />
        </mesh>
      </group>

      {/* ─── Cape (optional) ─── */}
      {hasCape && (
        <mesh
          ref={capeRef}
          position={[0, legBaseY + 0.9, -dims.torsoDepth * 0.5]}
          castShadow
          material={capeMat}
        >
          <planeGeometry args={[dims.hipWidth * 1.6, 1.2, 6, 8]} />
        </mesh>
      )}
    </group>
  );
}
