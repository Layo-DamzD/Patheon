'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { HeroConfig } from '@/config/heroes';
import { AnimationClip, findClip } from './animationLibrary';
import { useAnimationStateMachine, AnimState } from './animationStateMachine';
import { useFlightSystem, FlightState } from './flightSystem';
import { cameraInput } from './cameraInput';
import { consumeFlightPress, consumeJumpPress } from './keyboardInput';
import { TUNING } from '@/config/tuning';

/**
 * Universal Hero Loader
 *
 * Loads ANY hero from their config, applies animations, handles movement,
 * flight, and combat. This is the ONE component that all 11 heroes use.
 *
 * Adding a new hero = adding a config entry. No code changes.
 */

const GRAVITY = -30;
const GROUND_Y = 0;

interface HeroLoaderProps {
  heroConfig: HeroConfig;
  clips: AnimationClip[];
  input: any;  // game store input
  hero: any;   // game store hero state
  setHero: (partial: any) => void;
  damageEnemy: (id: string, amount: number) => void;
  enemies: any[];
  isCivilian: boolean;     // civilian mode (Tony Stark) vs hero mode (Iron Man)
}

export function HeroLoader({
  heroConfig,
  clips,
  input,
  hero,
  setHero,
  damageEnemy,
  enemies,
  isCivilian,
}: HeroLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);
  const { get } = useThree();

  // Determine which model to load (civilian or hero)
  const modelUrl = isCivilian && heroConfig.civilianModelUrl
    ? heroConfig.civilianModelUrl
    : heroConfig.modelUrl;

  // Load the hero model
  const { scene, animations: modelAnimations } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Setup animation mixer for this character
  const mixer = useMemo(() => new THREE.AnimationMixer(clonedScene), [clonedScene]);

  // Convert model's own animations to clips (these are GUARANTEED to work — same skeleton)
  const modelClips = useMemo<AnimationClip[]>(() => {
    return modelAnimations.map((clip) => ({
      name: clip.name,
      clip,
      source: 'model',
    }));
  }, [modelAnimations]);

  // Combine: model's own clips FIRST (priority), then library clips
  const allClips = useMemo(() => [...modelClips, ...clips], [modelClips, clips]);

  // Physics state
  const position = useRef(new THREE.Vector3(0, 5, -80));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotationY = useRef(0);

  // Movement state
  const isSprintingRef = useRef(false);
  const currentSpeedRef = useRef(0);
  const isMovingRef = useRef(false);
  const isJumpingRef = useRef(false);
  const isFlyingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const flightStateRef = useRef<FlightState>('grounded');
  const combatStateRef = useRef<AnimState | null>(null);
  const hitStateRef = useRef(false);

  // Camera
  const cameraYawRef = useRef(0);
  const cameraPitchRef = useRef(0);

  // Input edge detection
  const punchHeldRef = useRef(false);
  const throwHeldRef = useRef(false);
  const flightHeldRef = useRef(false);
  const jumpHeldRef = useRef(false);
  const dodgeHeldRef = useRef(false);
  const blowCooldownRef = useRef(0);

  // Initialize position
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
    }
  }, []);

  // Process materials + shadows
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

  // Hook up animation state machine (uses model's own clips + library clips)
  const { playAnimation } = useAnimationStateMachine({
    mixer,
    clips: allClips,
    heroConfig,
    speedRef: currentSpeedRef,
    isMovingRef,
    isSprintingRef,
    isJumpingRef,
    isFlyingRef,
    isHoveringRef,
    combatStateRef,
    hitStateRef,
  });

  // Hook up flight system (only for flying heroes)
  const flightInputRef = useRef({ moveX: 0, moveY: 0, flight: false, ascend: false, descend: false });
  useFlightSystem({
    heroConfig,
    positionRef: position,
    velocityRef: velocity,
    isFlyingRef,
    isHoveringRef,
    flightStateRef,
    cameraYawRef,
    inputRef: flightInputRef,
  });

  // Main update loop
  useFrame((state, delta) => {
    if (!groupRef.current || !visualRef.current) return;
    delta = Math.min(delta, 0.05);

    const camera = get().camera;

    // ─── Update flight input ref ───
    // When flying: jump button = ascend, blow button = descend
    flightInputRef.current = {
      moveX: input.moveX,
      moveY: input.moveY,
      flight: flightInputRef.current.flight,  // preserve edge-triggered state
      ascend: input.jump || false,
      descend: input.blow || false,
    };

    // ─── Camera rotation from drag ───
    cameraYawRef.current -= cameraInput.deltaX;
    cameraPitchRef.current = THREE.MathUtils.clamp(
      cameraPitchRef.current + cameraInput.deltaY,
      -0.5, 0.8
    );
    cameraInput.deltaX = 0;
    cameraInput.deltaY = 0;

    // ─── Movement (only if not flying) ───
    if (!isFlyingRef.current) {
      const moveX = input.moveX;
      const moveY = input.moveY;
      const sprintHeld = input.sprint;

      isSprintingRef.current = sprintHeld;
      const hasInput = moveX * moveX + moveY * moveY > 0.01;
      isMovingRef.current = hasInput;

      const t = TUNING.velora;  // TODO: per-hero tuning
      const targetSpeed = !hasInput ? 0 : sprintHeld ? t.sprintSpeed : t.jogSpeed;

      if (targetSpeed > currentSpeedRef.current) {
        currentSpeedRef.current = Math.min(targetSpeed, currentSpeedRef.current + t.acceleration * delta);
      } else {
        currentSpeedRef.current = Math.max(targetSpeed, currentSpeedRef.current - t.deceleration * delta);
      }

      const moveDir = new THREE.Vector3(-moveX, 0, -moveY);
      if (moveDir.lengthSq() > 0.01) {
        moveDir.normalize();
        moveDir.applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));
        velocity.current.x = moveDir.x * currentSpeedRef.current;
        velocity.current.z = moveDir.z * currentSpeedRef.current;

        const targetRot = Math.atan2(moveDir.x, moveDir.z);
        const rotDiff = targetRot - rotationY.current;
        const normalizedDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
        rotationY.current += normalizedDiff * 0.2;
      } else {
        velocity.current.x = 0;
        velocity.current.z = 0;
      }

      // Gravity
      velocity.current.y += GRAVITY * delta;
    }

    // ─── Jump (from touch button OR keyboard Space) ───
    const jumpInput = input.jump || consumeJumpPress();
    if (heroConfig.abilities.jump && jumpInput && !jumpHeldRef.current && !isFlyingRef.current) {
      if (position.current.y <= GROUND_Y + 0.1) {
        velocity.current.y = 12;
        isJumpingRef.current = true;
      }
    }
    jumpHeldRef.current = jumpInput;

    // Reset jump state when landed
    if (isJumpingRef.current && position.current.y <= GROUND_Y + 0.1 && velocity.current.y < 0) {
      isJumpingRef.current = false;
    }

    // ─── Flight toggle (edge-triggered from touch OR keyboard R key) ───
    if (heroConfig.abilities.flight) {
      const flightInput = input.flight || consumeFlightPress();
      flightInputRef.current.flight = flightInput;
      flightHeldRef.current = flightInput;
    }

    // ─── Punch (BLOW) ───
    if (heroConfig.abilities.punch && (input.blow && !punchHeldRef.current)) {
      combatStateRef.current = 'punch';
      // Damage enemies in front
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));
      const attackPoint = position.current.clone().add(forward.multiplyScalar(2));
      for (const enemy of enemies) {
        if (enemy.state === 'dead') continue;
        const dx = attackPoint.x - enemy.position[0];
        const dy = attackPoint.y - (enemy.position[1] + 1);
        const dz = attackPoint.z - enemy.position[2];
        if (dx * dx + dy * dy + dz * dz < 9) {
          damageEnemy(enemy.id, 40);
        }
      }
      // Clear combat state after animation duration
      setTimeout(() => {
        combatStateRef.current = null;
      }, 500);
    }
    punchHeldRef.current = input.blow;

    // ─── Throw (lightning, hammer, web, repulsor, fireball) ───
    if (heroConfig.abilities.throw && input.lightning && !throwHeldRef.current) {
      combatStateRef.current = 'throw';
      setTimeout(() => {
        combatStateRef.current = null;
      }, 600);
      // TODO: spawn projectile (lightning, hammer, web, etc.)
    }
    throwHeldRef.current = input.lightning;

    // ─── Apply velocity to position ───
    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    // Ground collision
    if (!isFlyingRef.current && position.current.y < GROUND_Y) {
      position.current.y = GROUND_Y;
      velocity.current.y = 0;
    }

    // City bounds
    const halfBlock = TUNING.midtown.blockSize / 2;
    position.current.x = THREE.MathUtils.clamp(position.current.x, -halfBlock, halfBlock);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -halfBlock, halfBlock);

    // ─── Apply to visual ───
    groupRef.current.position.copy(position.current);
    visualRef.current.rotation.y = rotationY.current;

    // ─── Update mixer ───
    mixer.update(delta);

    // ─── Camera follow ───
    const t = TUNING.velora;
    const targetCameraPos = new THREE.Vector3(
      position.current.x - Math.sin(cameraYawRef.current) * t.cameraDistance * Math.cos(cameraPitchRef.current),
      position.current.y + t.cameraHeight + Math.sin(cameraPitchRef.current) * 4,
      position.current.z - Math.cos(cameraYawRef.current) * t.cameraDistance * Math.cos(cameraPitchRef.current)
    );
    camera.position.lerp(targetCameraPos, t.cameraLerp);

    const targetLookAt = new THREE.Vector3(position.current.x, position.current.y + 1.0, position.current.z);
    camera.lookAt(targetLookAt);

    // ─── Update store ───
    setHero({
      position: [position.current.x, position.current.y, position.current.z],
      isSprinting: isSprintingRef.current && currentSpeedRef.current > 5,
      isFlying: isFlyingRef.current,
      isHovering: isHoveringRef.current,
    });
  });

  return (
    <group ref={groupRef}>
      <group ref={visualRef} rotation={[0, heroConfig.rotationOffset, 0]} scale={heroConfig.scale}>
        <primitive object={clonedScene} />
      </group>

      {/* Sprint glow effect (hero-specific color) */}
      {hero.isSprinting && (
        <>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[1.4, 16, 16]} />
            <meshStandardMaterial
              color={heroConfig.glowColor}
              emissive={heroConfig.glowColor}
              emissiveIntensity={0.5}
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>
          <pointLight
            position={[0, 1.5, 0]}
            intensity={8}
            distance={6}
            color={heroConfig.glowColor}
          />
        </>
      )}

      {/* Flight aura (when flying) */}
      {hero.isFlying && (
        <pointLight
          position={[0, 1, 0]}
          intensity={5}
          distance={8}
          color={heroConfig.glowColor}
        />
      )}
    </group>
  );
}

