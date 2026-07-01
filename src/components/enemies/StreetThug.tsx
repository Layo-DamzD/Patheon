'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';

/**
 * Street Thug — Phase 0 enemy
 * AI states: idle → chase → attack → stunned → dead
 * Simple AI: if hero within chaseRange, move toward hero. If within attackRange, attack.
 */

interface StreetThugProps {
  id: string;
  position: [number, number, number];
}

export function StreetThug({ id, position }: StreetThugProps) {
  const bodyRef = useRef<any>(null);
  const visualRef = useRef<THREE.Group>(null);

  const enemy = useGameStore((s) => s.enemies.find((e) => e.id === id));
  const hero = useGameStore((s) => s.hero);
  const updateEnemy = useGameStore((s) => s.updateEnemy);
  const damageHero = useGameStore((s) => s.damageHero);
  const timeScale = useGameStore((s) => s.timeScale);

  const lastAttackTime = useRef(0);
  const attackWindupEnd = useRef(0);

  useFrame((state, delta) => {
    if (!bodyRef.current || !visualRef.current) return;
    if (!enemy || enemy.state === 'dead') return;

    delta = delta * timeScale; // affected by slow time

    const rb = bodyRef.current;
    const heroPos = hero.position;
    const thugPos = rb.translation();

    const dx = heroPos[0] - thugPos.x;
    const dz = heroPos[2] - thugPos.z;
    const distSq = dx * dx + dz * dz;
    const dist = Math.sqrt(distSq);

    const t = TUNING.streetThug;

    // AI state machine
    if (enemy.state === 'stunned') {
      // Just stand still, wait for stun to end (handled by store via damage)
      return;
    }

    if (dist < t.chaseRange) {
      if (dist < t.attackRange) {
        // Attack
        if (enemy.state !== 'attack') {
          updateEnemy(id, { state: 'attack' });
        }

        // Windup then damage
        const now = state.clock.elapsedTime;
        if (lastAttackTime.current === 0) {
          lastAttackTime.current = now;
          attackWindupEnd.current = now + t.attackWindup;
        }
        if (now >= attackWindupEnd.current && now - lastAttackTime.current >= t.attackCooldown) {
          // Apply damage
          damageHero(t.attackDamage);
          lastAttackTime.current = now;
          attackWindupEnd.current = now + t.attackWindup;
        }

        // Face hero
        const targetRot = Math.atan2(dx, dz);
        visualRef.current.rotation.y = targetRot;
      } else {
        // Chase
        if (enemy.state !== 'chase') {
          updateEnemy(id, { state: 'chase' });
        }
        lastAttackTime.current = 0;

        // Move toward hero
        const dirX = dx / dist;
        const dirZ = dz / dist;
        const vel = rb.linvel();
        rb.setLinvel({ x: dirX * t.moveSpeed, y: vel.y, z: dirZ * t.moveSpeed }, true);

        // Face hero
        const targetRot = Math.atan2(dirX, dirZ);
        visualRef.current.rotation.y = targetRot;
      }
    } else {
      // Idle
      if (enemy.state !== 'idle') {
        updateEnemy(id, { state: 'idle' });
      }
      lastAttackTime.current = 0;
      const vel = rb.linvel();
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
    }

    // Update enemy position in store
    updateEnemy(id, { position: [thugPos.x, thugPos.y, thugPos.z] });
  });

  if (!enemy) return null;

  const isDead = enemy.state === 'dead';
  const isStunned = enemy.state === 'stunned';

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders={false}
      position={position}
      enabledRotations={[false, false, false]}
      linearDamping={0.8}
      angularDamping={1}
      mass={1}
    >
      <CapsuleCollider args={[0.8, 0.4]} />

      <group ref={visualRef}>
        {/* Body — dark clothes */}
        <mesh position={[0, 0, 0]} castShadow visible={!isDead}>
          <capsuleGeometry args={[0.35, 1, 4, 12]} />
          <meshStandardMaterial
            color={isStunned ? '#5a5a5a' : '#2a1a1a'}
            roughness={0.8}
            metalness={0.1}
          />
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

        {/* Health bar above head */}
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
            <meshStandardMaterial
              color="#debf63"
              emissive="#debf63"
              emissiveIntensity={2}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}
