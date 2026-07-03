'use client';

import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';
import { Midtown } from '@/components/world/Midtown';
import { Velora } from '@/components/heroes/Velora';
import { CrimeManager } from '@/components/enemies/CrimeManager';

/**
 * Game Scene — the actual 3D world.
 *
 * NOTE: @react-three/rapier Physics was removed because v2.2.0 has a
 * compatibility issue with R3F v9 that causes the entire scene to not render.
 * Physics is now handled manually in each component's useFrame (gravity,
 * ground collision, velocity). This is simpler and more reliable for Phase 0.
 * We can revisit Rapier when the compatibility issue is resolved.
 */

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
      <hemisphereLight
        intensity={0.8}
        color="#cbd5e0"
        groundColor="#3a2a1a"
      />
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

      {/* The city */}
      <Midtown />

      {/* The hero — manual physics, no RigidBody needed */}
      <Velora />

      {/* Crime manager + enemies — also manual physics */}
      <CrimeManager />
    </Canvas>
  );
}
