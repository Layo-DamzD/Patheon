'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

/**
 * ModelCharacter — loads a real 3D character model from a GLB file.
 *
 * This is the PROPER way to get human-looking characters — use pre-made
 * rigged 3D models with animations, not primitives built from boxes.
 *
 * Uses @react-three/drei's useGLTF + useAnimations hooks.
 *
 * Animations: switches between 'idle' and 'run' based on movement state.
 * Speed-based blending: faster movement = faster animation playback.
 */

interface ModelCharacterProps {
  url: string;
  speedRef?: React.MutableRefObject<number>;
  isMovingRef?: React.MutableRefObject<boolean>;
  scale?: number;
  rotationOffset?: number;  // radians, for models that face wrong direction
  positionOffset?: [number, number, number];  // for models with wrong origin
}

export function ModelCharacter({
  url,
  speedRef,
  isMovingRef,
  scale = 1,
  rotationOffset = 0,
  positionOffset = [0, 0, 0],
}: ModelCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the GLB file
  const { scene, animations } = useGLTF(url);

  // Clone the scene using SkeletonUtils (proper deep clone for skinned meshes)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Setup animations
  const { actions, names } = useAnimations(animations, groupRef);

  // Track current animation
  const currentAnimRef = useRef<string | null>(null);
  const fadeTimerRef = useRef(0);

  // Find idle and run animations (case-insensitive partial match)
  const idleName = useMemo(
    () => names.find((n) => n.toLowerCase().includes('idle')) || names[0],
    [names]
  );
  const runName = useMemo(
    () =>
      names.find((n) => n.toLowerCase().includes('run')) ||
      names.find((n) => n.toLowerCase().includes('sprint')) ||
      names.find((n) => n.toLowerCase().includes('walk')) ||
      idleName,
    [names, idleName]
  );

  // Initial animation — play idle on mount
  useEffect(() => {
    if (idleName) {
      const actionsObj = actions as unknown as Record<string, THREE.AnimationAction | null>;
      actionsObj[idleName]?.reset().fadeIn(0.3).play();
      currentAnimRef.current = idleName;
    }
    return () => {
      // Cleanup all actions on unmount
      const actionsObj = actions as unknown as Record<string, THREE.AnimationAction | null>;
      names.forEach((n) => actionsObj[n]?.stop());
    };
  }, [actions, names, idleName]);

  // Per-frame: switch animations based on movement state
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const speed = speedRef?.current ?? 0;
    const isMoving = isMovingRef?.current ?? false;

    // Determine which animation should be playing
    const targetAnim = isMoving && speed > 2 ? runName : idleName;

    // Switch animation if needed (with fade)
    if (targetAnim && targetAnim !== currentAnimRef.current) {
      const actionsObj = actions as unknown as Record<string, THREE.AnimationAction | null>;
      const oldAction = currentAnimRef.current ? actionsObj[currentAnimRef.current] : null;
      const newAction = actionsObj[targetAnim];

      if (newAction) {
        oldAction?.fadeOut(0.2);
        newAction.reset().fadeIn(0.2).play();
        currentAnimRef.current = targetAnim;
      }
    }

    // Scale animation playback speed based on movement speed
    // NOTE: AnimationAction.timeScale is meant to be mutated per-frame
    // (it's the standard Three.js animation pattern). The lint rule
    // flags actions[] as immutable because it comes from a hook, but
    // AnimationAction objects are mutable state by design.
    /* eslint-disable react-hooks/immutability */
    const animName = currentAnimRef.current;
    if (animName) {
      const action = actions[animName];
      if (action) {
        if (isMoving && speed > 2) {
          action.timeScale = Math.min(speed * 0.04, 2);
        } else {
          action.timeScale = 1;
        }
      }
    }
    /* eslint-enable react-hooks/immutability */

    // Slight forward lean when moving fast (visual feedback)
    if (isMoving && speed > 5) {
      const targetLean = Math.min(speed * 0.005, 0.2);
      groupRef.current.rotation.x += (targetLean - groupRef.current.rotation.x) * 0.1;
    } else {
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.1;
    }
  });

  // Process the cloned scene: enable shadows, ensure materials are visible
  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.transparent = false;
          child.material.opacity = 1;
          child.material.depthWrite = true;
        }
      }
    });
  }, [clonedScene]);

  return (
    <group ref={groupRef} position={positionOffset} rotation={[0, rotationOffset, 0]} scale={scale} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the model (optional but improves load time)
useGLTF.preload('/models/Soldier.glb');
