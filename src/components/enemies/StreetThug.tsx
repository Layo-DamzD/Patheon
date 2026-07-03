'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';

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
      }
    } else {
      if (enemy.state !== 'idle') updateEnemy(id, { state: 'idle' });
      lastAttackTime.current = 0;
      vel.current.x = 0;
      vel.current.z = 0;
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
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow visible={!isDead}>
          <capsuleGeometry args={[0.35, 1, 4, 12]} />
          <meshStandardMaterial color={isStunned ? '#5a5a5a' : '#2a1a1a'} roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.05, 0]} castShadow visible={!isDead}>
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshStandardMaterial color="#8b6f47" roughness={0.7} />
        </mesh>
        {/* Beanie */}
        <mesh position={[0, 1.2, 0]} castShadow visible={!isDead}>
          <sphereGeometry args={[0.3, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>

        {/* Health bar */}
        {!isDead && enemy.health < enemy.maxHealth && (
          <group position={[0, 2, 0]}>
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
          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#debf63" emissive="#debf63" emissiveIntensity={2} />
          </mesh>
        )}
      </group>
    </group>
  );
}
