'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimationClip, findClip, AnimationClip as AnimClip } from './animationLibrary';
import { HeroConfig } from '@/config/heroes';

/**
 * Animation State Machine
 *
 * Manages which animation is playing on a character based on game state.
 * States:
 * - idle (standing)
 * - walk (slow movement)
 * - run (fast movement / sprint)
 * - jump (in air from jump)
 * - punch (melee attack)
 * - throw (side throw — lightning, hammer, web, repulsor)
 * - castSpell (raise hand, magic)
 * - powerUp (transformation)
 * - hit (stagger from damage)
 * - knockdown (defeated)
 * - dodge (dodge roll)
 * - hover (flying idle)
 * - fly (horizontal flight)
 * - takeoff (launching into air)
 * - landing (touching down)
 *
 * Transitions are smooth (fade between animations over 0.2s).
 */

export type AnimState =
  | 'idle' | 'walk' | 'run' | 'jog'
  | 'jump_start' | 'jump_loop' | 'jump_land'
  | 'punch' | 'throw' | 'castSpell' | 'powerUp'
  | 'hit' | 'knockdown' | 'dodge'
  | 'hover' | 'fly' | 'takeoff' | 'landing';

interface StateMachineProps {
  mixer: THREE.AnimationMixer | null;
  clips: AnimClip[];
  heroConfig: HeroConfig;
  // Game state refs (read each frame)
  speedRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  isSprintingRef: React.MutableRefObject<boolean>;
  isJumpingRef: React.MutableRefObject<boolean>;
  isFlyingRef: React.MutableRefObject<boolean>;
  isHoveringRef: React.MutableRefObject<boolean>;
  combatStateRef: React.MutableRefObject<AnimState | null>;  // punch, throw, etc.
  hitStateRef: React.MutableRefObject<boolean>;
}

export function useAnimationStateMachine({
  mixer,
  clips,
  heroConfig,
  speedRef,
  isMovingRef,
  isSprintingRef,
  isJumpingRef,
  isFlyingRef,
  isHoveringRef,
  combatStateRef,
  hitStateRef,
}: StateMachineProps) {
  const currentStateRef = useRef<AnimState>('idle');
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const stateTimerRef = useRef(0);

  // Helper: play a new animation with fade
  const playAnimation = (state: AnimState, fadeTime = 0.2, loop = THREE.LoopRepeat) => {
    if (!mixer) return;

    const clip = findClip(clips, state);
    if (!clip) {
      console.warn(`Animation not found: ${state}`);
      return;
    }

    // If same animation already playing, don't restart
    if (currentStateRef.current === state && currentActionRef.current) return;

    const newAction = mixer.clipAction(clip);
    newAction.setLoop(loop, Infinity);
    newAction.clampWhenFinished = loop === THREE.LoopOnce;

    // Fade from current to new
    if (currentActionRef.current && currentActionRef.current !== newAction) {
      currentActionRef.current.fadeOut(fadeTime);
    }
    newAction.reset().fadeIn(fadeTime).play();

    currentActionRef.current = newAction;
    currentStateRef.current = state;
    stateTimerRef.current = 0;
  };

  // Per-frame: determine which state should be active
  useFrame((_, delta) => {
    if (!mixer) return;

    stateTimerRef.current += delta;
    const state = currentStateRef.current;

    // Priority 1: Hit reaction (highest priority)
    if (hitStateRef.current) {
      if (state !== 'hit') playAnimation('hit', 0.1, THREE.LoopOnce);
      return;
    }

    // Priority 2: Combat actions (punch, throw, cast, powerUp)
    const combatState = combatStateRef.current;
    if (combatState) {
      if (state !== combatState) playAnimation(combatState, 0.1, THREE.LoopOnce);
      // Combat animations are one-shot — clear after duration
      // (the combat system resets combatStateRef when done)
      return;
    }

    // Priority 3: Flying states
    if (isFlyingRef.current) {
      if (isHoveringRef.current) {
        if (state !== 'hover') playAnimation('hover', 0.3);
      } else {
        const flyAlias = heroConfig.flightAnimationAlias || 'fly';
        if (state !== flyAlias) playAnimation(flyAlias as AnimState, 0.3);
      }
      return;
    }

    // Priority 4: Jumping
    if (isJumpingRef.current) {
      if (state !== 'jump_loop') playAnimation('jump_loop', 0.1);
      return;
    }

    // Priority 5: Movement
    const speed = speedRef.current;
    const isMoving = isMovingRef.current;
    const isSprinting = isSprintingRef.current;

    if (isMoving && speed > 1) {
      if (isSprinting) {
        if (state !== 'run') playAnimation('run', 0.15);
      } else if (speed > 5) {
        if (state !== 'jog') playAnimation('jog', 0.15);
      } else {
        if (state !== 'walk') playAnimation('walk', 0.15);
      }
      return;
    }

    // Default: idle
    if (state !== 'idle') {
      playAnimation('idle', 0.3);
    }
  });

  // Expose playAnimation for external triggers (combat, etc.)
  return { playAnimation, currentState: currentStateRef };
}

/**
 * Trigger a one-shot combat animation (punch, throw, etc.)
 * Returns duration of the animation so combat system knows when it's done.
 */
export function getAnimationDuration(clips: AnimClip[], state: AnimState): number {
  const clip = findClip(clips, state);
  return clip?.duration || 0.5;
}
