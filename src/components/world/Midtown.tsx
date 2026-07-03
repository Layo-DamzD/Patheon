'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { TUNING } from '@/config/tuning';

/**
 * Midtown City Block — Phase 1 visual upgrade.
 * Buildings now have window textures (canvas-generated), giving them
 * a realistic urban look instead of flat colored boxes.
 *
 * Window texture: grid of lit/unlit windows on each building face.
 * Some windows glow warm yellow (lit), most are dark blue (unlit).
 */

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  windowTexture: THREE.Texture;
}

function Building({ position, size, color, windowTexture }: BuildingProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        map={windowTexture}
        color={color}
        roughness={0.6}
        metalness={0.3}
        emissive="#debf63"
        emissiveMap={windowTexture}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

// Generate a window grid texture for building faces
function makeWindowTexture(buildingColor: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Fill with building base color
  ctx.fillStyle = buildingColor;
  ctx.fillRect(0, 0, 256, 256);

  // Draw window grid: 8x8 windows
  const gridSize = 8;
  const cellSize = 256 / gridSize;
  const windowMargin = cellSize * 0.15;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * cellSize + windowMargin;
      const y = row * cellSize + windowMargin;
      const w = cellSize - windowMargin * 2;
      const h = cellSize - windowMargin * 2;

      // 30% chance window is lit (warm yellow), 70% dark
      const isLit = Math.random() < 0.3;
      if (isLit) {
        // Lit window — warm yellow with slight variation
        const warmth = 0.8 + Math.random() * 0.2;
        ctx.fillStyle = `rgba(255, ${Math.floor(220 * warmth)}, ${Math.floor(150 * warmth)}, 1)`;
      } else {
        // Dark window — dark blue-gray
        ctx.fillStyle = '#1a2030';
      }
      ctx.fillRect(x, y, w, h);

      // Window frame — slightly darker border
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Repeat texture based on building size (handled per-building via repeat)
  return texture;
}

export function Midtown() {
  const { blockSize, buildingCount, buildingMinHeight, buildingMaxHeight, streetWidth, waterFeatureSize } = TUNING.midtown;

  // Generate buildings + their window textures
  const buildings = useMemo(() => {
    const result: BuildingProps[] = [];
    const cols = 5;
    const rows = 2;
    const buildingFootprint = (blockSize - streetWidth * (cols - 1)) / cols;

    const palette = ['#3a4a5c', '#4a5568', '#2d3748', '#5a6b7c', '#3d4759'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = r * cols + c;
        const heightVar = (Math.sin(seed * 7.3) * 0.5 + 0.5);
        const height = buildingMinHeight + heightVar * (buildingMaxHeight - buildingMinHeight);
        const colorIdx = seed % palette.length;
        const color = palette[colorIdx];

        const x = -blockSize / 2 + buildingFootprint / 2 + c * (buildingFootprint + streetWidth);
        const z = -blockSize / 4 + r * (buildingFootprint + streetWidth * 1.5);

        // Generate window texture for this building
        const tex = makeWindowTexture(color);
        // Scale texture repeats based on building proportions
        const repeatX = Math.max(1, Math.round(buildingFootprint / 5));
        const repeatY = Math.max(1, Math.round(height / 5));
        tex.repeat.set(repeatX, repeatY);

        result.push({
          position: [x, height / 2, z],
          size: [buildingFootprint * 0.9, height, buildingFootprint * 0.9],
          color,
          windowTexture: tex,
        });
      }
    }
    return result;
  }, [blockSize, buildingCount, buildingMinHeight, buildingMaxHeight, streetWidth]);

  return (
    <group>
      {/* Ground — asphalt with subtle texture */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[blockSize, blockSize]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Streets — lighter gray strips */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`street-h-${i}`}
          position={[
            -blockSize / 2 + (i + 0.5) * (blockSize / 5),
            0.01,
            0,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[streetWidth, blockSize]} />
          <meshStandardMaterial color="#2a2a2a" roughness={1} />
        </mesh>
      ))}

      {/* Street lane markings — yellow dashed lines */}
      {Array.from({ length: 5 }).map((_, i) =>
        Array.from({ length: 20 }).map((_, j) => (
          <mesh
            key={`lane-${i}-${j}`}
            position={[
              -blockSize / 2 + (i + 0.5) * (blockSize / 5),
              0.02,
              -blockSize / 2 + j * (blockSize / 20) + blockSize / 40,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.3, 4]} />
            <meshStandardMaterial color="#debf63" emissive="#debf63" emissiveIntensity={0.2} />
          </mesh>
        ))
      )}

      {/* Water feature — small pond for water-run testing */}
      <mesh
        position={[blockSize / 2 - waterFeatureSize / 2 - 5, 0.02, blockSize / 2 - waterFeatureSize / 2 - 5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[waterFeatureSize, waterFeatureSize]} />
        <meshStandardMaterial
          color="#1e4d6b"
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Bank — special building with gold sign */}
      <mesh position={[0, 5, -blockSize / 4]} castShadow receiveShadow>
        <boxGeometry args={[15, 10, 15]} />
        <meshStandardMaterial color="#5d4e37" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Bank roof sign — glowing gold */}
      <mesh position={[0, 11, -blockSize / 4]}>
        <boxGeometry args={[8, 2, 0.5]} />
        <meshStandardMaterial color="#debf63" emissive="#debf63" emissiveIntensity={0.5} />
      </mesh>
      {/* Bank columns at entrance */}
      {[-5, -2.5, 2.5, 5].map((xOff) => (
        <mesh key={`col-${xOff}`} position={[xOff, 2.5, -blockSize / 4 + 7.8]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 5, 8]} />
          <meshStandardMaterial color="#d4c4a8" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* All other buildings with window textures */}
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      {/* Street lamps */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = blockSize * 0.3;
        return (
          <group key={`lamp-${i}`} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 6]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </mesh>
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
      })}
    </group>
  );
}
