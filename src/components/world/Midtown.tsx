'use client';

import { useMemo } from 'react';
import { TUNING } from '@/config/tuning';

/**
 * Midtown City Block — Phase 0 prototype.
 * Procedurally places 10 buildings in a grid with streets between them,
 * plus a water feature (small pond) for water-run testing.
 *
 * No textures — Phase 0 uses solid colors with PBR-like material props
 * for fast iteration. Visuals will improve in Phase 1.
 */

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

function Building({ position, size, color }: BuildingProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.3}
      />
    </mesh>
  );
}

export function Midtown() {
  const { blockSize, buildingCount, buildingMinHeight, buildingMaxHeight, streetWidth, waterFeatureSize } = TUNING.midtown;

  // Generate buildings in a grid
  const buildings = useMemo<BuildingProps[]>(() => {
    const result: BuildingProps[] = [];
    const cols = 5;
    const rows = 2;
    const buildingFootprint = (blockSize - streetWidth * (cols - 1)) / cols;

    // Palette of building colors (cool corporate Midtown)
    const palette = ['#3a4a5c', '#4a5568', '#2d3748', '#5a6b7c', '#3d4759'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Random-ish but deterministic height
        const seed = r * cols + c;
        const heightVar = (Math.sin(seed * 7.3) * 0.5 + 0.5);
        const height = buildingMinHeight + heightVar * (buildingMaxHeight - buildingMinHeight);
        const colorIdx = seed % palette.length;

        const x = -blockSize / 2 + buildingFootprint / 2 + c * (buildingFootprint + streetWidth);
        const z = -blockSize / 4 + r * (buildingFootprint + streetWidth * 1.5);

        result.push({
          position: [x, height / 2, z],
          size: [buildingFootprint * 0.9, height, buildingFootprint * 0.9],
          color: palette[colorIdx],
        });
      }
    }
    return result;
  }, [blockSize, buildingCount, buildingMinHeight, buildingMaxHeight, streetWidth]);

  return (
    <group>
      {/* Ground — asphalt */}
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

      {/* Water feature — small pond in corner for water-run testing */}
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

      {/* Bank — special building at center for bank robbery mission */}
      <mesh position={[0, 5, -blockSize / 4]} castShadow receiveShadow>
        <boxGeometry args={[15, 10, 15]} />
        <meshStandardMaterial color="#5d4e37" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Bank roof sign */}
      <mesh position={[0, 11, -blockSize / 4]}>
        <boxGeometry args={[8, 2, 0.5]} />
        <meshStandardMaterial color="#debf63" emissive="#debf63" emissiveIntensity={0.3} />
      </mesh>

      {/* All other buildings */}
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      {/* Street lamps — for atmosphere, helps see at night */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = blockSize * 0.3;
        return (
          <group key={`lamp-${i}`} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            {/* Pole */}
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 6]} />
              <meshStandardMaterial color="#1a1a1a" />
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
              intensity={15}
              distance={20}
              color="#ffd700"
            />
          </group>
        );
      })}
    </group>
  );
}
