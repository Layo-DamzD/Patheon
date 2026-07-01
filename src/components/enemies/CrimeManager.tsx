'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';
import { StreetThug } from './StreetThug';

/**
 * Crime Manager — Bank Robbery
 *
 * Spawns a bank robbery mission every spawnInterval seconds.
 * Each robbery spawns enemyCount thugs near the bank.
 * Mission completes when all thugs are defeated OR timer runs out.
 */

export function CrimeManager() {
  const mission = useGameStore((s) => s.mission);
  const setMission = useGameStore((s) => s.setMission);
  const updateMission = useGameStore((s) => s.updateMission);
  const enemies = useGameStore((s) => s.enemies);
  const setEnemies = useGameStore((s) => s.setEnemies);
  const removeEnemy = useGameStore((s) => s.removeEnemy);
  const hero = useGameStore((s) => s.hero);
  const timeScale = useGameStore((s) => s.timeScale);

  const nextSpawnTime = useRef(performance.now() / 1000 + 8); // First mission 8s after start

  // Auto-remove dead enemies after 3s
  useEffect(() => {
    const interval = setInterval(() => {
      const deadEnemies = useGameStore.getState().enemies.filter((e) => e.state === 'dead');
      deadEnemies.forEach((e) => {
        setTimeout(() => removeEnemy(e.id), 3000);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [removeEnemy]);

  useFrame((state) => {
    const now = state.clock.elapsedTime;

    // Spawn new bank robbery if no active mission and timer is up
    if (!mission && now >= nextSpawnTime.current) {
      const bankPos: [number, number, number] = [0, 1, -TUNING.midtown.blockSize / 4];

      // Spawn thugs around the bank
      const newEnemies = Array.from({ length: TUNING.bankRobbery.enemyCount }).map((_, i) => {
        const angle = (i / TUNING.bankRobbery.enemyCount) * Math.PI * 2;
        const radius = 8;
        return {
          id: `thug-${Date.now()}-${i}`,
          position: [
            bankPos[0] + Math.cos(angle) * radius,
            1,
            bankPos[2] + Math.sin(angle) * radius,
          ] as [number, number, number],
          health: TUNING.streetThug.health,
          maxHealth: TUNING.streetThug.health,
          state: 'idle' as const,
          lastAttackTime: 0,
        };
      });
      setEnemies(newEnemies);

      setMission({
        id: `bank-robbery-${Date.now()}`,
        type: 'bank_robbery',
        active: true,
        timeLeft: TUNING.bankRobbery.missionTimerSeconds,
        enemiesRemaining: newEnemies.length,
        bankPosition: bankPos,
        completed: false,
      });

      nextSpawnTime.current = now + 9999; // don't spawn while one is active
    }

    // Tick active mission
    if (mission && !mission.completed) {
      const newTimeLeft = mission.timeLeft - 0.016 * timeScale;
      const aliveEnemies = enemies.filter((e) => e.state !== 'dead');

      updateMission({
        timeLeft: newTimeLeft,
        enemiesRemaining: aliveEnemies.length,
      });

      // Complete: all enemies dead
      if (aliveEnemies.length === 0) {
        updateMission({ completed: true });
        nextSpawnTime.current = now + TUNING.bankRobbery.spawnInterval;
        // Clear completed mission after 5s
        setTimeout(() => {
          setMission(null);
        }, 5000);
      }
      // Fail: timer ran out
      else if (newTimeLeft <= 0) {
        updateMission({ completed: true });
        nextSpawnTime.current = now + TUNING.bankRobbery.spawnInterval;
        // Clear all enemies
        setEnemies([]);
        setTimeout(() => {
          setMission(null);
        }, 3000);
      }
    }
  });

  return (
    <>
      {enemies.map((e) => (
        <StreetThug key={e.id} id={e.id} position={e.position} />
      ))}
    </>
  );
}
