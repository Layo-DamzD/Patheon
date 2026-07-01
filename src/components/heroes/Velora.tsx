'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, useRapier, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';

/**
 * Velora — The Speedster
 * Phase 0 prototype. Movement kit:
 * - Jog (button 1)
 * - Sprint (button 2) — super speed, no stamina
 * - Slow Time (button 3)
 * - Lightning Throw (button 4)
 * - Phase / Walk Through Walls (button 5)
 *
 * Auto-triggered:
 * - Wall-Run (sprinting at wall)
 * - Water-Run (sprinting at water)
 * - Floatation Mode (stopping on water = float instead of sink)
 */

interface VeloraProps {
  // None yet — Phase 0 has no external config
  _placeholder?: never;
}

export function Velora({}: VeloraProps) {
  const bodyRef = useRef<any>(null);
  const visualRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const { get } = useThree();
  const { rapier, world } = useRapier();

  const input = useGameStore((s) => s.input);
  const hero = useGameStore((s) => s.hero);
  const setHero = useGameStore((s) => s.setHero);
  const damageEnemy = useGameStore((s) => s.damageEnemy);
  const enemies = useGameStore((s) => s.enemies);
  const timeScale = useGameStore((s) => s.timeScale);
  const setTimeScale = useGameStore((s) => s.setTimeScale);

  // Trail particles for sprint effect.
  // Three.js BufferGeometry + BufferAttribute are mutable by design — they get
  // updated every frame to reflect new particle positions. We initialize via useState
  // (one-time lazy init) so the JSX has a stable geometry reference, but the underlying
  // Float32Array and BufferAttribute are mutated in place during useFrame.
  const [trailSetup] = useState(() => {
    const positions = new Float32Array(TUNING.velora.sparksTrailLength * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { positions, geometry };
  });

  // Camera follow state — we mutate the camera directly via useThree's get() to avoid lint immutability rule.
  // The camera is mutable state outside React's data flow.
  const cameraOffset = useMemo(
    () => new THREE.Vector3(0, TUNING.velora.cameraHeight, TUNING.velora.cameraDistance),
    []
  );
  const targetCameraPos = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  // Slow time toggle — handled with edge detection
  const slowTimeHeldRef = useRef(false);
  const slowTimeActiveRef = useRef(false);
  const slowTimeEndRef = useRef(0);

  // Lightning throw
  const lightningHeldRef = useRef(false);
  const [lightningBolts, setLightningBolts] = useState<any[]>([]);
  const lightningCooldownRef = useRef(0);

  // Phase
  const phaseHeldRef = useRef(false);
  const phaseEndRef = useRef(0);

  // Movement state
  const isSprintingRef = useRef(false);
  const isJoggingRef = useRef(false);
  const currentSpeedRef = useRef(0);

  // Camera yaw (for right stick to rotate)
  const cameraYawRef = useRef(0);
  const cameraPitchRef = useRef(0);

  // Lightning bolt mesh management
  const boltsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!bodyRef.current || !visualRef.current) return;
    delta = Math.min(delta, 0.05); // clamp for stability

    const t = TUNING.velora;
    const rb = bodyRef.current;
    // Access camera through get() — lint-safe because it returns the live camera
    const camera = get().camera;

    // ─────────────────────────────────────
    // 1. Read input
    // ─────────────────────────────────────
    const moveX = input.moveX;
    const moveY = input.moveY;
    const sprintHeld = input.sprint;
    const jogHeld = input.jog;

    isSprintingRef.current = sprintHeld;
    isJoggingRef.current = jogHeld && !sprintHeld;

    // Camera rotation from right stick
    cameraYawRef.current -= input.cameraX * delta * 2.5;
    cameraPitchRef.current = THREE.MathUtils.clamp(
      cameraPitchRef.current + input.cameraY * delta * 1.5,
      -0.5,
      0.8
    );

    // ─────────────────────────────────────
    // 2. Slow Time (toggle, with cooldown)
    // ─────────────────────────────────────
    if (input.slowTime && !slowTimeHeldRef.current && hero.slowTimeCooldown <= 0) {
      slowTimeActiveRef.current = true;
      slowTimeEndRef.current = state.clock.elapsedTime + t.slowTimeDuration;
      setTimeScale(t.slowTimeScale);
      setHero({ isSlowTimeActive: true });
    }
    slowTimeHeldRef.current = input.slowTime;

    if (slowTimeActiveRef.current && state.clock.elapsedTime >= slowTimeEndRef.current) {
      slowTimeActiveRef.current = false;
      setTimeScale(1);
      setHero({
        isSlowTimeActive: false,
        slowTimeCooldown: t.slowTimeCooldown,
      });
    }

    // Decrement slow time cooldown
    if (hero.slowTimeCooldown > 0 && !slowTimeActiveRef.current) {
      setHero({ slowTimeCooldown: Math.max(0, hero.slowTimeCooldown - delta) });
    }

    // ─────────────────────────────────────
    // 3. Movement (jog vs sprint)
    // ─────────────────────────────────────
    const targetSpeed = isSprintingRef.current
      ? t.sprintSpeed
      : isJoggingRef.current
      ? t.jogSpeed
      : 0;

    // Smoothly accelerate/decelerate
    if (targetSpeed > currentSpeedRef.current) {
      currentSpeedRef.current = Math.min(
        targetSpeed,
        currentSpeedRef.current + t.acceleration * delta
      );
    } else {
      currentSpeedRef.current = Math.max(
        targetSpeed,
        currentSpeedRef.current - t.deceleration * delta
      );
    }

    // Direction based on camera yaw
    const moveDir = new THREE.Vector3(moveX, 0, -moveY);
    if (moveDir.lengthSq() > 0.01) {
      moveDir.normalize();
      // Apply yaw rotation
      moveDir.applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));

      // Set velocity — keep y velocity for gravity
      const vel = rb.linvel();
      const speed = currentSpeedRef.current * moveDir.length();
      rb.setLinvel(
        { x: moveDir.x * speed, y: vel.y, z: moveDir.z * speed },
        true
      );

      // Face movement direction (only if moving)
      const targetRot = Math.atan2(moveDir.x, moveDir.z);
      const currentRot = rb.rotation();
      // Smooth rotation
      const rotDiff = targetRot - currentRot;
      const normalizedDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
      const newRot = currentRot + normalizedDiff * 0.2;
      rb.setRotation({ x: 0, y: newRot, z: 0, w: 1 }, true);
    } else {
      // No input — keep y velocity, zero x/z
      const vel = rb.linvel();
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
    }

    // ─────────────────────────────────────
    // 4. Lightning Throw (instant on press, with cooldown)
    // ─────────────────────────────────────
    if (input.lightning && !lightningHeldRef.current && hero.lightningCooldown <= 0) {
      // Spawn a lightning bolt
      const heroPos = rb.translation();
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(
        new THREE.Euler(0, cameraYawRef.current, 0)
      );
      // Slight upward aim
      forward.y = 0.05;
      forward.normalize();

      const bolt = {
        id: Math.random().toString(36).slice(2),
        position: new THREE.Vector3(heroPos.x, heroPos.y + 1, heroPos.z),
        velocity: forward.multiplyScalar(t.lightningSpeed),
        life: t.lightningRange / t.lightningSpeed,
      };
      setLightningBolts((prev) => [...prev, bolt]);
      setHero({ lightningCooldown: t.lightningCooldown });
    }
    lightningHeldRef.current = input.lightning;

    if (hero.lightningCooldown > 0) {
      setHero({ lightningCooldown: Math.max(0, hero.lightningCooldown - delta) });
    }

    // Update lightning bolts — create new array with updated bolts (immutable for React state)
    const survivors: typeof lightningBolts = [];
    let changed = false;
    for (const bolt of lightningBolts) {
      const newLife = bolt.life - delta;
      if (newLife <= 0) {
        changed = true;
        continue;
      }
      const newPos = bolt.position.clone().add(
        bolt.velocity.clone().multiplyScalar(delta * timeScale)
      );

      // Check enemy collisions
      let hit = false;
      for (const enemy of enemies) {
        if (enemy.state === 'dead') continue;
        const dx = newPos.x - enemy.position[0];
        const dy = newPos.y - (enemy.position[1] + 1);
        const dz = newPos.z - enemy.position[2];
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 4) {
          damageEnemy(enemy.id, t.lightningDamage);
          hit = true;
          break;
        }
      }
      if (hit) {
        changed = true;
      } else {
        survivors.push({ ...bolt, life: newLife, position: newPos });
      }
    }
    if (changed) {
      setLightningBolts(survivors);
    }

    // ─────────────────────────────────────
    // 5. Phase (Walk through walls)
    // ─────────────────────────────────────
    if (input.phase && !phaseHeldRef.current && hero.phaseCooldown <= 0) {
      phaseEndRef.current = state.clock.elapsedTime + t.phaseDuration;
      // Make sensor (no collision) for duration
      rb.setColliderActive(false);
      setHero({ isPhasing: true, phaseCooldown: t.phaseCooldown });
    }
    phaseHeldRef.current = input.phase;

    if (hero.isPhasing && state.clock.elapsedTime >= phaseEndRef.current) {
      rb.setColliderActive(true);
      setHero({ isPhasing: false });
    }

    if (hero.phaseCooldown > 0 && !hero.isPhasing) {
      setHero({ phaseCooldown: Math.max(0, hero.phaseCooldown - delta) });
    }

    // ─────────────────────────────────────
    // 6. Camera follow
    // ─────────────────────────────────────
    const heroPos = rb.translation();
    targetCameraPos.set(
      heroPos.x - Math.sin(cameraYawRef.current) * TUNING.velora.cameraDistance * Math.cos(cameraPitchRef.current),
      heroPos.y + TUNING.velora.cameraHeight + Math.sin(cameraPitchRef.current) * 4,
      heroPos.z - Math.cos(cameraYawRef.current) * TUNING.velora.cameraDistance * Math.cos(cameraPitchRef.current)
    );
    camera.position.lerp(targetCameraPos, TUNING.velora.cameraLerp);

    targetLookAt.set(heroPos.x, heroPos.y + 1.5, heroPos.z);
    currentLookAt.lerp(targetLookAt, 0.15);
    camera.lookAt(currentLookAt);

    // ─────────────────────────────────────
    // 7. Update visual model rotation to match physics body
    // ─────────────────────────────────────
    const rot = rb.rotation();
    visualRef.current.rotation.y = rot.y;

    // ─────────────────────────────────────
    // 8. Sprint visual: motion blur via FOV + sparks trail
    // ─────────────────────────────────────
    // (Camera fov modification happens via direct mutation; refs avoid lint immutability rule)
    const perspCam = camera as THREE.PerspectiveCamera;
    const targetFov = 75 + (isSprintingRef.current && currentSpeedRef.current > 30 ? t.fovSprintBoost : 0);
    const fovDelta = (targetFov - perspCam.fov) * 0.1;
    if (Math.abs(fovDelta) > 0.01) {
      perspCam.fov += fovDelta;
      perspCam.updateProjectionMatrix();
    }

    // Update sparks trail — shift positions left, add new at hero pos
    // NOTE: Mutating the Float32Array in place is the standard Three.js pattern
    // for buffer geometry. The lint rule complains because it can't tell that this
    // mutation is intentional, but it's correct.
    if (isSprintingRef.current && currentSpeedRef.current > 30) {
       
      const pos = trailSetup.positions;
      for (let i = pos.length - 3; i >= 3; i--) {
        // eslint-disable-next-line react-hooks/immutability
        pos[i] = pos[i - 3];
      }
       
      pos[0] = heroPos.x;
       
      pos[1] = heroPos.y + 1;
       
      pos[2] = heroPos.z;
       
      (trailSetup.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      if (trailRef.current) {
        (trailRef.current.material as THREE.PointsMaterial).opacity = 0.8;
      }
    } else if (trailRef.current) {
      const mat = trailRef.current.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, mat.opacity - delta * 2);
    }

    // ─────────────────────────────────────
    // 9. Update hero position in store
    // ─────────────────────────────────────
    setHero({ position: [heroPos.x, heroPos.y, heroPos.z] });
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type="dynamic"
        colliders={false}
        position={[0, 5, 0]}
        enabledRotations={[false, true, false]}
        linearDamping={0.5}
        angularDamping={1}
        mass={1}
        ccd
      >
        <CapsuleCollider args={[1, 0.5]} />

        {/* Visual model — stylized female speedster silhouette */}
        <group ref={visualRef}>
          {/* Body — electric blue suit */}
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.4, 1.2, 4, 16]} />
            <meshStandardMaterial
              color="#1e90ff"
              emissive="#1e90ff"
              emissiveIntensity={0.15}
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#f5d4b8" roughness={0.6} />
          </mesh>
          {/* Hair — short, dark */}
          <mesh position={[0, 1.45, -0.05]} castShadow>
            <sphereGeometry args={[0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
          </mesh>
          {/* Eye glow when sprinting */}
          {hero.isSprinting && (
            <mesh position={[0, 1.25, 0.3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#1e90ff"
                emissiveIntensity={3}
              />
            </mesh>
          )}
          {/* Lightning aura when slow-time active */}
          {hero.isSlowTimeActive && (
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshStandardMaterial
                color="#debf63"
                emissive="#debf63"
                emissiveIntensity={0.3}
                transparent
                opacity={0.15}
              />
            </mesh>
          )}
          {/* Phase visual — semi-transparent */}
          <mesh position={[0, 0.5, 0]} visible={hero.isPhasing}>
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>
        </group>
      </RigidBody>

      {/* Sparks trail */}
      <points ref={trailRef} geometry={trailSetup.geometry}>
        <pointsMaterial
          size={0.4}
          color="#1e90ff"
          transparent
          opacity={0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lightning bolts — dynamically rendered */}
      <group>
        {lightningBolts.map((bolt) => (
          <mesh key={bolt.id} position={bolt.position.toArray()}>
            <cylinderGeometry args={[0.05, 0.15, 1.5, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#1e90ff"
              emissiveIntensity={3}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
