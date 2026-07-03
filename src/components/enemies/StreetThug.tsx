'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';
import { HumanoidCharacter } from '@/components/game/HumanoidCharacter';

/**
 * Street Thug — Manual Physics Version
 * No RigidBody needed. Position is managed via a group ref.
 */

const GRAVITY = -30;
const GROUND_Y = 1;

interface StreetThugProps {
  id: string;
  position: [number, number, number];
}

export function StreetThug({ id, position: initialPos }: StreetThugProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);

  // Physics state
  const pos = useRef(new THREE.Vector3(initialPos[0], initialPos[1], initialPos[2]));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const rotY = useRef(0);
  const speedRef = useRef(0);
  const isMovingRef = useRef(false);

  // Set initial position once on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(initialPos[0], initialPos[1], initialPos[2]);
    }
  }, [initialPos]);

  const enemy = useGameStore((s) => s.enemies.find((e) => e.id === id));
  const hero = useGameStore((s) => s.hero);
  const updateEnemy = useGameStore((s) => s.updateEnemy);
  const damageHero = useGameStore((s) => s.damageHero);
  const timeScale = useGameStore((s) => s.timeScale);

  const lastAttackTime = useRef(0);
  const attackWindupEnd = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !visualRef.current) return;
    if (!enemy || enemy.state === 'dead') return;

    delta = delta * timeScale;

    const heroPos = hero.position;
    const dx = heroPos[0] - pos.current.x;
    const dz = heroPos[2] - pos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const t = TUNING.streetThug;

    if (enemy.state === 'stunned') return;

    if (dist < t.chaseRange) {
      if (dist < t.attackRange) {
        if (enemy.state !== 'attack') updateEnemy(id, { state: 'attack' });
        speedRef.current = 0;
        isMovingRef.current = false;

        const now = state.clock.elapsedTime;
        if (lastAttackTime.current === 0) {
          lastAttackTime.current = now;
          attackWindupEnd.current = now + t.attackWindup;
        }
        if (now >= attackWindupEnd.current && now - lastAttackTime.current >= t.attackCooldown) {
          damageHero(t.attackDamage);
          lastAttackTime.current = now;
          attackWindupEnd.current = now + t.attackWindup;
        }

        rotY.current = Math.atan2(dx, dz);
      } else {
        if (enemy.state !== 'chase') updateEnemy(id, { state: 'chase' });
        lastAttackTime.current = 0;

        const dirX = dx / dist;
        const dirZ = dz / dist;
        vel.current.x = dirX * t.moveSpeed;
        vel.current.z = dirZ * t.moveSpeed;
        rotY.current = Math.atan2(dirX, dirZ);
        speedRef.current = t.moveSpeed;
        isMovingRef.current = true;
      }
    } else {
      if (enemy.state !== 'idle') updateEnemy(id, { state: 'idle' });
      lastAttackTime.current = 0;
      vel.current.x = 0;
      vel.current.z = 0;
      speedRef.current = 0;
      isMovingRef.current = false;
    }

    // Apply gravity
    vel.current.y += GRAVITY * delta;

    // Apply velocity
    pos.current.x += vel.current.x * delta;
    pos.current.y += vel.current.y * delta;
    pos.current.z += vel.current.z * delta;

    // Ground collision
    if (pos.current.y < GROUND_Y) {
      pos.current.y = GROUND_Y;
      vel.current.y = 0;
    }

    // Apply to visual
    groupRef.current.position.copy(pos.current);
    visualRef.current.rotation.y = rotY.current;

    // Update store
    updateEnemy(id, { position: [pos.current.x, pos.current.y, pos.current.z] });
  });

  if (!enemy) return null;

  const isDead = enemy.state === 'dead';
  const isStunned = enemy.state === 'stunned';

  return (
    <group ref={groupRef}>
      <group ref={visualRef}>
        {/* Real humanoid character — male athletic, dark clothes */}
        <HumanoidCharacter
          primaryColor={isStunned ? '#5a5a5a' : '#2a1a1a'}
          accentColor="#1a1a1a"
          skinColor="#8b6f47"
          hairColor="#1a1a1a"
          bodyShape="male-athletic"
          height={0.95}
          hasPonytail={false}
          speedRef={speedRef}
          isMovingRef={isMovingRef}
        />

        {/* Beanie hat — dark, on top of head */}
        <mesh position={[0, 1.75, 0]} castShadow visible={!isDead}>
          <sphereGeometry args={[0.26, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>

        {/* Health bar above head */}
        {!isDead && enemy.health < enemy.maxHealth && (
          <group position={[0, 2.3, 0]}>
            <mesh>
              <planeGeometry args={[1, 0.1]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[-(1 - enemy.health / enemy.maxHealth) / 2, 0, 0.01]}>
              <planeGeometry args={[enemy.health / enemy.maxHealth, 0.08]} />
              <meshBasicMaterial color="#c88079" />
            </mesh>
          </group>
        )}

        {/* Stunned indicator */}
        {isStunned && (
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#debf63" emissive="#debf63" emissiveIntensity={2} />
          </mesh>
        )}
      </group>
    </group>
  );
}
