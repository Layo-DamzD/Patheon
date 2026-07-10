'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Iron Man Landing Pose — code-driven bone manipulation
 *
 * Recreates the pose from the Mark 85 reference model:
 * - Both feet on ground (NOT one-hand-kneel)
 * - Crouched low (knees bent)
 * - Torso leaning forward 15°
 * - Right arm forward (guard position)
 * - Left arm at side (fist near hip)
 * - Head tilted slightly down
 *
 * This is applied to the rigged Mark 85 model via bone rotation.
 * Pose activates when Iron Man lands, holds for 1 second, then
 * transitions back to idle.
 */

interface LandingPoseProps {
  /** Trigger the landing pose (true = pose, false = idle) */
  active: boolean;
  /** The GLTF scene from useGLTF — we traverse it to find bones */
  scene: THREE.Group;
  /** Intensity 0-1, used for blending in/out */
  intensity?: number;
}

export function useLandingPose({ active, scene, intensity = 1 }: LandingPoseProps) {
  const currentIntensity = useRef(0);
  const bonesRef = useRef<Record<string, THREE.Bone>>({});

  // Find all bones in the skeleton
  useEffect(() => {
    const bones: Record<string, THREE.Bone> = {};
    scene.traverse((child) => {
      if ((child as any).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name.toLowerCase();
        bones[name] = bone;
      }
    });
    bonesRef.current = bones;
  }, [scene]);

  useFrame((_, delta) => {
    // Smoothly blend intensity toward target
    const target = active ? intensity : 0;
    currentIntensity.current += (target - currentIntensity.current) * Math.min(delta * 8, 1);
    const t = currentIntensity.current;
    if (t < 0.01) return;

    const bones = bonesRef.current;

    // Helper to rotate a bone by name (with multiple name variations)
    const rotateBone = (names: string[], rot: { x?: number; y?: number; z?: number }) => {
      for (const n of names) {
        const bone = bones[n];
        if (bone) {
          if (rot.x !== undefined) bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, rot.x, t);
          if (rot.y !== undefined) bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, rot.y, t);
          if (rot.z !== undefined) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, rot.z, t);
          return;
        }
      }
    };

    // ─── TORSO: lean forward 15° ───
    rotateBone(['spine', 'spine01', 'spine02', 'chest', 'upperchest'], { x: 0.26 }); // ~15° in radians

    // ─── HEAD: tilt down 10° ───
    rotateBone(['head', 'neck'], { x: 0.17 });

    // ─── LEFT ARM: guard position (fist near hip) ───
    // Shoulder: 30° forward, 10° up
    rotateBone(['leftarm', 'leftshoulder', 'left_upper_arm', 'upperarm_l', 'arm_l'], {
      x: 0.52,  // ~30° forward
      y: -0.17, // ~10° up
    });
    // Elbow: 90° bent
    rotateBone(['leftforearm', 'left_elbow', 'forearm_l', 'lowerarm_l'], {
      x: -1.57, // ~90° bent
    });

    // ─── RIGHT ARM: forward guard/punch position ───
    // Shoulder: 45° forward, 15° up
    rotateBone(['rightarm', 'rightshoulder', 'right_upper_arm', 'upperarm_r', 'arm_r'], {
      x: 0.78,  // ~45° forward
      y: 0.26,  // ~15° up
    });
    // Elbow: 120° bent (slightly less than right angle)
    rotateBone(['rightforearm', 'right_elbow', 'forearm_r', 'lowerarm_r'], {
      x: -2.09, // ~120° bent
    });

    // ─── LEFT LEG: deep crouch (knee 110°) ───
    // Hip: 20° forward
    rotateBone(['leftupleg', 'left_thigh', 'leftleg', 'thigh_l', 'upperleg_l'], {
      x: 0.35,  // ~20° forward
    });
    // Knee: 110° bent
    rotateBone(['leftleg', 'left_knee', 'left_shin', 'knee_l', 'lowerleg_l'], {
      x: -1.92, // ~110° bent
    });

    // ─── RIGHT LEG: 90° bent, thigh up 30° ───
    // Hip: 30° forward
    rotateBone(['rightupleg', 'right_thigh', 'rightleg', 'thigh_r', 'upperleg_r'], {
      x: 0.52,  // ~30° forward
    });
    // Knee: 90° bent
    rotateBone(['rightleg', 'right_knee', 'right_shin', 'knee_r', 'lowerleg_r'], {
      x: -1.57, // ~90° bent
    });
  });
}
