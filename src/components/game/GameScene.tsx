'use client';

import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { NYC } from '@/components/world/NYC';
import { CrimeManager } from '@/components/enemies/CrimeManager';
import { useAnimationLibrary } from '@/lib/game/animationLibrary';
import { HeroLoader } from '@/lib/game/heroLoader';
import { HEROES } from '@/config/heroes';
import { useGameStore } from '@/store/gameStore';

/**
 * Game Scene v2 — uses new universal systems
 *
 * - NYC city (uploaded assets + procedural)
 * - HeroLoader (works for any hero)
 * - Animation library (Quaternius + Rokoko + IronMan)
 * - Hero switching (Velora ↔ Iron Man)
 * - Civilian/hero mode (Tony Stark ↔ Iron Man)
 */

function ActiveHero() {
  const { clips } = useAnimationLibrary();
  const activeHeroId = useGameStore((s) => s.activeHeroId);
  const isCivilian = useGameStore((s) => s.isCivilian);
  const input = useGameStore((s) => s.input);
  const hero = useGameStore((s) => s.hero);
  const setHero = useGameStore((s) => s.setHero);
  const damageEnemy = useGameStore((s) => s.damageEnemy);
  const enemies = useGameStore((s) => s.enemies);

  const heroConfig = HEROES[activeHeroId];
  if (!heroConfig || clips.length === 0) return null;

  return (
    <HeroLoader
      key={activeHeroId + (isCivilian ? '-civilian' : '-hero')}
      heroConfig={heroConfig}
      clips={clips}
      input={input}
      hero={hero}
      setHero={setHero}
      damageEnemy={damageEnemy}
      enemies={enemies}
      isCivilian={isCivilian}
    />
  );
}

export function GameScene() {
  return (
    <Canvas
      shadows
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 10, -90],
      }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        alpha: false,
      }}
      dpr={TUNING.render.pixelRatio}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#1a2332', 1);
        scene.background = new THREE.Color('#1a2332');
        scene.fog = new THREE.Fog('#1a2332', 100, 500);
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <hemisphereLight intensity={0.8} color="#cbd5e0" groundColor="#3a2a1a" />
      <directionalLight
        position={[40, 60, 20]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[TUNING.render.shadowMapSize, TUNING.render.shadowMapSize]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={1}
        shadow-camera-far={200}
        color="#fff5e6"
      />

      {/* Stars background */}
      <Stars
        radius={300}
        depth={60}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* NYC City */}
      <NYC />

      {/* Active Hero (Velora or Iron Man) */}
      <ActiveHero />

      {/* Crime manager + enemies */}
      <CrimeManager />
    </Canvas>
  );
}
