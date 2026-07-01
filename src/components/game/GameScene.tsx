'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { Midtown } from '@/components/world/Midtown';
import { Velora } from '@/components/heroes/Velora';
import { CrimeManager } from '@/components/enemies/CrimeManager';

/**
 * Game Scene — the actual 3D world.
 * Renders inside a Canvas. Houses physics, lighting, world, hero, enemies.
 */

export function GameScene() {
  return (
    <Canvas
      shadows
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 8, 12],
      }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={TUNING.render.pixelRatio}
      onCreated={({ gl }) => {
        gl.setClearColor(TUNING.render.fogColor);
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#5a6b8c" />
      <hemisphereLight
        intensity={0.5}
        color="#cbd5e0"
        groundColor="#2a1a1a"
      />
      <directionalLight
        position={[40, 60, 20]}
        intensity={2}
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

      {/* Sky / atmosphere */}
      <fog
        attach="fog"
        args={[
          TUNING.render.fogColor,
          TUNING.render.fogNear,
          TUNING.render.fogFar,
        ]}
      />
      <color attach="background" args={['#0c0b0a']} />
      <Stars
        radius={300}
        depth={60}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Physics world */}
      <Physics
        gravity={[0, TUNING.physics.gravity, 0]}
        timeStep={TUNING.physics.fixedTimeStep}
        interpolate
      >
        {/* The city */}
        <Midtown />

        {/* The hero */}
        <Velora />

        {/* Crime manager + enemies */}
        <CrimeManager />
      </Physics>
    </Canvas>
  );
}
