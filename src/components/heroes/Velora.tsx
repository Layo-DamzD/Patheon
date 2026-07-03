'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';
import { cameraInput } from '@/lib/game/cameraInput';

/**
 * Velora — The Speedster (Manual Physics Version)
 *
 * Uses manual physics instead of @react-three/rapier because Rapier v2.2.0
 * has a rendering compatibility issue with R3F v9. Manual physics for Phase 0
 * is simpler and more reliable:
 * - Gravity: y velocity decreases each frame
 * - Ground collision: y clamped to minimum
 * - Movement: velocity from input
 */

const GRAVITY = -30;
const GROUND_Y = 1.7; // hero capsule half-height

export function Velora() {
  const groupRef = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const { get } = useThree();

  // Physics state — stored in refs (not React state) for performance
  const position = useRef(new THREE.Vector3(0, 5, -80));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotationY = useRef(0);

  const input = useGameStore((s) => s.input);
  const hero = useGameStore((s) => s.hero);
  const setHero = useGameStore((s) => s.setHero);
  const damageEnemy = useGameStore((s) => s.damageEnemy);
  const enemies = useGameStore((s) => s.enemies);
  const timeScale = useGameStore((s) => s.timeScale);
  const setTimeScale = useGameStore((s) => s.setTimeScale);

  // Trail particles
  const [trailSetup] = useState(() => {
    const positions = new Float32Array(TUNING.velora.sparksTrailLength * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { positions, geometry };
  });

  // Camera follow vectors
  const targetCameraPos = useState(() => new THREE.Vector3())[0];
  const currentLookAt = useState(() => new THREE.Vector3())[0];
  const targetLookAt = useState(() => new THREE.Vector3())[0];

  // Input edge detection refs
  const slowTimeHeldRef = useRef(false);
  const slowTimeActiveRef = useRef(false);
  const slowTimeEndRef = useRef(0);
  const lightningHeldRef = useRef(false);
  const phaseHeldRef = useRef(false);
  const phaseEndRef = useRef(0);

  // Movement state
  const isSprintingRef = useRef(false);
  const isJoggingRef = useRef(false);
  const currentSpeedRef = useRef(0);

  // Camera yaw/pitch
  const cameraYawRef = useRef(0);
  const cameraPitchRef = useRef(0);

  // Lightning bolts
  const [lightningBolts, setLightningBolts] = useState<any[]>([]);

  useFrame((state, delta) => {
    if (!groupRef.current || !visualRef.current) return;
    delta = Math.min(delta, 0.05);

    const t = TUNING.velora;
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

    // Camera rotation from right-side drag
    cameraYawRef.current -= cameraInput.deltaX;
    cameraPitchRef.current = THREE.MathUtils.clamp(
      cameraPitchRef.current + cameraInput.deltaY,
      -0.5,
      0.8
    );
    cameraInput.deltaX = 0;
    cameraInput.deltaY = 0;

    // ─────────────────────────────────────
    // 2. Slow Time
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
      setHero({ isSlowTimeActive: false, slowTimeCooldown: t.slowTimeCooldown });
    }
    if (hero.slowTimeCooldown > 0 && !slowTimeActiveRef.current) {
      setHero({ slowTimeCooldown: Math.max(0, hero.slowTimeCooldown - delta) });
    }

    // ─────────────────────────────────────
    // 3. Movement (manual physics)
    // ─────────────────────────────────────
    const targetSpeed = isSprintingRef.current
      ? t.sprintSpeed
      : isJoggingRef.current
      ? t.jogSpeed
      : 0;

    if (targetSpeed > currentSpeedRef.current) {
      currentSpeedRef.current = Math.min(targetSpeed, currentSpeedRef.current + t.acceleration * delta);
    } else {
      currentSpeedRef.current = Math.max(targetSpeed, currentSpeedRef.current - t.deceleration * delta);
    }

    const moveDir = new THREE.Vector3(moveX, 0, -moveY);
    if (moveDir.lengthSq() > 0.01) {
      moveDir.normalize();
      moveDir.applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));

      const speed = currentSpeedRef.current * moveDir.length();
      velocity.current.x = moveDir.x * speed;
      velocity.current.z = moveDir.z * speed;

      // Face movement direction
      const targetRot = Math.atan2(moveDir.x, moveDir.z);
      const rotDiff = targetRot - rotationY.current;
      const normalizedDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
      rotationY.current += normalizedDiff * 0.2;
    } else {
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    // Apply gravity
    velocity.current.y += GRAVITY * delta * timeScale;

    // Apply velocity to position
    position.current.x += velocity.current.x * delta * timeScale;
    position.current.y += velocity.current.y * delta * timeScale;
    position.current.z += velocity.current.z * delta * timeScale;

    // Ground collision
    if (position.current.y < GROUND_Y) {
      position.current.y = GROUND_Y;
      velocity.current.y = 0;
    }

    // Keep hero within the city bounds
    const halfBlock = TUNING.midtown.blockSize / 2;
    position.current.x = THREE.MathUtils.clamp(position.current.x, -halfBlock, halfBlock);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -halfBlock, halfBlock);

    // Apply to visual group
    groupRef.current.position.copy(position.current);
    visualRef.current.rotation.y = rotationY.current;

    // ─────────────────────────────────────
    // 4. Lightning Throw
    // ─────────────────────────────────────
    if (input.lightning && !lightningHeldRef.current && hero.lightningCooldown <= 0) {
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));
      forward.y = 0.05;
      forward.normalize();

      const bolt = {
        id: Math.random().toString(36).slice(2),
        position: new THREE.Vector3(position.current.x, position.current.y + 1, position.current.z),
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

    // Update lightning bolts
    const survivors: typeof lightningBolts = [];
    let changed = false;
    for (const bolt of lightningBolts) {
      const newLife = bolt.life - delta;
      if (newLife <= 0) { changed = true; continue; }
      const newPos = bolt.position.clone().add(bolt.velocity.clone().multiplyScalar(delta * timeScale));

      let hit = false;
      for (const enemy of enemies) {
        if (enemy.state === 'dead') continue;
        const dx = newPos.x - enemy.position[0];
        const dy = newPos.y - (enemy.position[1] + 1);
        const dz = newPos.z - enemy.position[2];
        if (dx * dx + dy * dy + dz * dz < 4) {
          damageEnemy(enemy.id, t.lightningDamage);
          hit = true;
          break;
        }
      }
      if (hit) { changed = true; } else { survivors.push({ ...bolt, life: newLife, position: newPos }); }
    }
    if (changed) setLightningBolts(survivors);

    // ─────────────────────────────────────
    // 5. Phase (Walk through walls)
    // ─────────────────────────────────────
    if (input.phase && !phaseHeldRef.current && hero.phaseCooldown <= 0) {
      phaseEndRef.current = state.clock.elapsedTime + t.phaseDuration;
      setHero({ isPhasing: true, phaseCooldown: t.phaseCooldown });
    }
    phaseHeldRef.current = input.phase;

    if (hero.isPhasing && state.clock.elapsedTime >= phaseEndRef.current) {
      setHero({ isPhasing: false });
    }
    if (hero.phaseCooldown > 0 && !hero.isPhasing) {
      setHero({ phaseCooldown: Math.max(0, hero.phaseCooldown - delta) });
    }

    // ─────────────────────────────────────
    // 6. Camera follow
    // ─────────────────────────────────────
    targetCameraPos.set(
      position.current.x - Math.sin(cameraYawRef.current) * t.cameraDistance * Math.cos(cameraPitchRef.current),
      position.current.y + t.cameraHeight + Math.sin(cameraPitchRef.current) * 4,
      position.current.z - Math.cos(cameraYawRef.current) * t.cameraDistance * Math.cos(cameraPitchRef.current)
    );
    camera.position.lerp(targetCameraPos, t.cameraLerp);

    targetLookAt.set(position.current.x, position.current.y + 1.5, position.current.z);
    currentLookAt.lerp(targetLookAt, 0.15);
    camera.lookAt(currentLookAt);

    // ─────────────────────────────────────
    // 7. Sprint FOV boost
    // ─────────────────────────────────────
    const perspCam = camera as THREE.PerspectiveCamera;
    const targetFov = 75 + (isSprintingRef.current && currentSpeedRef.current > 30 ? t.fovSprintBoost : 0);
    const fovDelta = (targetFov - perspCam.fov) * 0.1;
    if (Math.abs(fovDelta) > 0.01) {
      perspCam.fov += fovDelta;
      perspCam.updateProjectionMatrix();
    }

    // ─────────────────────────────────────
    // 8. Sparks trail
    // ─────────────────────────────────────
    if (isSprintingRef.current && currentSpeedRef.current > 30) {
       
      const pos = trailSetup.positions;
      for (let i = pos.length - 3; i >= 3; i--) {
        // eslint-disable-next-line react-hooks/immutability
        pos[i] = pos[i - 3];
      }
       
      pos[0] = position.current.x;
       
      pos[1] = position.current.y + 1;
       
      pos[2] = position.current.z;
       
      (trailSetup.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      if (trailRef.current) {
        (trailRef.current.material as THREE.PointsMaterial).opacity = 0.8;
      }
    } else if (trailRef.current) {
      const mat = trailRef.current.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, mat.opacity - delta * 2);
    }

    // ─────────────────────────────────────
    // 9. Update store
    // ─────────────────────────────────────
    setHero({
      position: [position.current.x, position.current.y, position.current.z],
      isSprinting: isSprintingRef.current && currentSpeedRef.current > 5,
    });
  });

  return (
    <>
      <group ref={groupRef} position={[0, 5, -80]}>
        <group ref={visualRef}>
          {/* Body — electric blue suit */}
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.4, 1.2, 4, 16]} />
            <meshStandardMaterial
              color="#1e90ff"
              emissive="#1e90ff"
              emissiveIntensity={0.3}
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#f5d4b8" roughness={0.6} />
          </mesh>
          {/* Hair */}
          <mesh position={[0, 1.45, -0.05]} castShadow>
            <sphereGeometry args={[0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
          </mesh>
          {/* Eye glow when sprinting */}
          {hero.isSprinting && (
            <mesh position={[0, 1.25, 0.3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#1e90ff" emissiveIntensity={3} />
            </mesh>
          )}
          {/* Lightning aura when slow-time active */}
          {hero.isSlowTimeActive && (
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshStandardMaterial color="#debf63" emissive="#debf63" emissiveIntensity={0.3} transparent opacity={0.15} />
            </mesh>
          )}
          {/* Phase visual */}
          <mesh position={[0, 0.5, 0]} visible={hero.isPhasing}>
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.2} wireframe />
          </mesh>
        </group>
      </group>

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

      {/* Lightning bolts */}
      <group>
        {lightningBolts.map((bolt) => (
          <mesh key={bolt.id} position={bolt.position.toArray()}>
            <cylinderGeometry args={[0.05, 0.15, 1.5, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#1e90ff" emissiveIntensity={3} />
          </mesh>
        ))}
      </group>
    </>
  );
}
