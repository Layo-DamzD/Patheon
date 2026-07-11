'use client';

import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';

/**
 * New York City — built from uploaded assets + procedural code
 *
 * Assets used:
 * - AvengersTower.glb — landmark building (Stark Tower)
 * - DowntownBuildings.glb — city block buildings
 * - NYHighway.glb — highway/interstate road system
 *
 * Procedural additions (code):
 * - Street grid with lane markings
 * - Street lamps (gold glow)
 * - Water feature (for water-run testing)
 * - Ground plane (asphalt)
 * - Surrounding skyline (low-poly building silhouettes)
 */

function LoadedModel({ url, position, rotation, scale }: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

export function NYC() {
  const blockSize = TUNING.midtown.blockSize;

  return (
    <group>
      {/* ═══════════════════════════════════════════
          GROUND — dark asphalt base
          ═══════════════════════════════════════════ */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[blockSize * 2, blockSize * 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* ═══════════════════════════════════════════
          HIGHWAY — skipped (46MB too heavy for WebGL)
          Using procedural road grid instead (code below)
          ═══════════════════════════════════════════ */}

      {/* Procedural road grid — replaces NYHighway.glb for performance */}
      {generateRoadGrid(blockSize)}

      {/* ═══════════════════════════════════════════
          DOWNTOWN BUILDINGS — skipped (16MB too heavy for now)
          Using procedural buildings instead (below)
          ═══════════════════════════════════════════ */}

      {/* ═══════════════════════════════════════════
          AVENGERS TOWER — Stark Tower landmark
          ═══════════════════════════════════════════ */}
      <LoadedModel
        url="/models/AvengersTower.glb"
        position={[0, 0, -80]}
        scale={1}
      />

      {/* ═══════════════════════════════════════════
          PROCEDURAL BUILDINGS — fill gaps with code-generated
          low-poly buildings to create dense NYC feel
          ═══════════════════════════════════════════ */}
      {generateProceduralBuildings()}

      {/* ═══════════════════════════════════════════
          STREET LAMPS — gold glow, atmospheric lighting
          ═══════════════════════════════════════════ */}
      {generateStreetLamps(blockSize)}

      {/* ═══════════════════════════════════════════
          WATER FEATURE — for water-run testing
          ═══════════════════════════════════════════ */}
      <mesh
        position={[blockSize / 2 - 20, 0.02, blockSize / 2 - 20]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#1e4d6b"
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────
// Procedural road grid (replaces heavy highway model)
// ──────────────────────────────────────
function generateRoadGrid(blockSize: number) {
  const roads: JSX.Element[] = [];
  const roadWidth = 12;
  const roadColor = '#2a2a2a';
  const laneColor = '#debf63';

  // Horizontal roads
  for (let i = -2; i <= 2; i++) {
    const z = i * (blockSize / 5);
    roads.push(
      <mesh key={`road-h-${i}`} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[blockSize * 1.5, roadWidth]} />
        <meshStandardMaterial color={roadColor} roughness={1} />
      </mesh>
    );
    // Lane markings
    for (let j = -8; j <= 8; j++) {
      roads.push(
        <mesh key={`lane-h-${i}-${j}`} position={[j * 12, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 0.3]} />
          <meshStandardMaterial color={laneColor} emissive={laneColor} emissiveIntensity={0.2} />
        </mesh>
      );
    }
  }

  // Vertical roads
  for (let i = -2; i <= 2; i++) {
    const x = i * (blockSize / 5);
    roads.push(
      <mesh key={`road-v-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth, blockSize * 1.5]} />
        <meshStandardMaterial color={roadColor} roughness={1} />
      </mesh>
    );
    // Lane markings
    for (let j = -8; j <= 8; j++) {
      roads.push(
        <mesh key={`lane-v-${i}-${j}`} position={[x, 0.02, j * 12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 4]} />
          <meshStandardMaterial color={laneColor} emissive={laneColor} emissiveIntensity={0.2} />
        </mesh>
      );
    }
  }

  return roads;
}

// ──────────────────────────────────────
// Procedural building generation
// ──────────────────────────────────────
function generateProceduralBuildings() {
  const buildings: JSX.Element[] = [];
  const palette = ['#3a4a5c', '#4a5568', '#2d3748', '#5a6b7c', '#3d4759'];

  // Generate buildings in a grid pattern, leaving gaps for the highway
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 60 + Math.random() * 40;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Skip if too close to highway (center)
    if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;

    const height = 15 + Math.sin(i * 3.7) * 20 + 15;
    const width = 6 + Math.random() * 4;
    const color = palette[i % palette.length];

    buildings.push(
      <mesh
        key={`proc-${i}`}
        position={[x, height / 2, z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.3}
          emissive="#debf63"
          emissiveIntensity={0.05}
        />
      </mesh>
    );

    // Add window glow (small emissive planes on the building face)
    if (i % 3 === 0) {
      buildings.push(
        <mesh
          key={`window-${i}`}
          position={[x, height / 2, z + width / 2 + 0.01]}
        >
          <planeGeometry args={[width * 0.6, height * 0.7]} />
          <meshStandardMaterial
            color="#1a2030"
            emissive="#ffd700"
            emissiveIntensity={0.15}
            transparent
            opacity={0.6}
          />
        </mesh>
      );
    }
  }

  return buildings;
}

// ──────────────────────────────────────
// Street lamp generation
// ──────────────────────────────────────
function generateStreetLamps(blockSize: number) {
  const lamps: JSX.Element[] = [];

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const r = blockSize * 0.35;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    lamps.push(
      <group key={`lamp-${i}`} position={[x, 0, z]}>
        {/* Pole */}
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Lamp head */}
        <mesh position={[0, 6.2, 0]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={1.5}
          />
        </mesh>
        <pointLight
          position={[0, 6, 0]}
          intensity={20}
          distance={25}
          color="#ffd700"
        />
      </group>
    );
  }

  return lamps;
}

// Preload models
useGLTF.preload('/models/AvengersTower.glb');
