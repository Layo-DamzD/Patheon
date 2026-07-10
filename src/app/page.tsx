'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LoadingScreen } from '@/components/ui-game/LoadingScreen';

// Dynamically import the game scene (no SSR — Three.js needs the browser)
const GameScene = dynamic(
  () => import('@/components/game/GameScene').then((m) => m.GameScene),
  { ssr: false }
);
const TouchControls = dynamic(
  () => import('@/components/controls/TouchControls').then((m) => m.TouchControls),
  { ssr: false }
);
const HUD = dynamic(
  () => import('@/components/ui-game/HUD').then((m) => m.HUD),
  { ssr: false }
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isMobile] = useState(() => {
    if (typeof navigator === 'undefined') return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  });

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0c0b0a',
        overflow: 'hidden',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* 3D Game */}
      <GameScene />

      {/* Touch controls overlay (joysticks + buttons) */}
      <TouchControls />

      {/* HUD overlay (health, minimap, mission tracker) */}
      <HUD />

      {/* Desktop hint */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(12, 11, 10, 0.85)',
            border: '1px solid rgba(222, 191, 99, 0.3)',
            borderRadius: 8,
            padding: '6px 12px',
            color: '#96938d',
            fontSize: 10,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          📱 Best on mobile — install as PWA on your phone for full experience. Desktop: WASD/Arrows + Mouse.
        </div>
      )}
    </main>
  );
}
