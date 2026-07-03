'use client';

import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';

/**
 * HUD — Heads-up display
 * Top-left: Hero portrait + health bar
 * Top-right: Mini-map with crime hotspots
 * Below mini-map: Mission tracker
 */

export function HUD() {
  const hero = useGameStore((s) => s.hero);
  const mission = useGameStore((s) => s.mission);
  const enemies = useGameStore((s) => s.enemies);

  const healthPct = (hero.health / hero.maxHealth) * 100;
  const healthColor = healthPct > 60 ? '#7db48f' : healthPct > 30 ? '#c8af7e' : '#c88079';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        color: '#e5e4e2',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top-left: Hero portrait + health */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: 'rgba(12, 11, 10, 0.85)',
          border: '1px solid rgba(222, 191, 99, 0.4)',
          borderRadius: 8,
          padding: 10,
          minWidth: 220,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Hero icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e90ff, #0c4a8c)',
              border: '2px solid #debf63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 900,
              color: '#ffffff',
            }}
          >
            V
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#debf63' }}>VELORA</div>
            <div style={{ fontSize: 9, color: '#96938d' }}>Speedster · Phase 0</div>
          </div>
        </div>

        {/* Health bar */}
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 9,
              color: '#96938d',
              marginBottom: 2,
            }}
          >
            <span>HEALTH</span>
            <span>{Math.round(hero.health)} / {hero.maxHealth}</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${healthPct}%`,
                height: '100%',
                background: healthColor,
                transition: 'width 0.2s, background 0.3s',
              }}
            />
          </div>
        </div>

        {/* Status indicators */}
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {hero.isSprinting && (
            <StatusChip label="SPRINT" color="#1e90ff" />
          )}
          {hero.isSlowTimeActive && (
            <StatusChip label="SLOW TIME" color="#debf63" />
          )}
          {hero.isPhasing && (
            <StatusChip label="PHASING" color="#85a5c5" />
          )}
        </div>
      </div>

      {/* Top-right: Mini-map */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 140,
          height: 140,
          background: 'rgba(12, 11, 10, 0.85)',
          border: '1px solid rgba(222, 191, 99, 0.4)',
          borderRadius: 8,
          padding: 4,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        <MiniMap
          heroPos={hero.position}
          enemies={enemies}
          missionPos={mission?.bankPosition}
          blockSize={TUNING.midtown.blockSize}
        />
      </div>

      {/* Below mini-map: Mission tracker */}
      {mission && (
        <div
          style={{
            position: 'absolute',
            top: 168,
            right: 12,
            width: 220,
            background: 'rgba(12, 11, 10, 0.85)',
            border: `1px solid ${mission.completed ? 'rgba(125, 180, 143, 0.5)' : 'rgba(200, 175, 126, 0.5)'}`,
            borderRadius: 8,
            padding: 10,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            fontSize: 11,
          }}
        >
          <div style={{ fontWeight: 700, color: mission.completed ? '#7db48f' : '#c8af7e', marginBottom: 4 }}>
            {mission.completed ? '✓ MISSION COMPLETE' : '⚠ BANK ROBBERY'}
          </div>
          {!mission.completed && (
            <>
              <div style={{ color: '#96938d', marginBottom: 4 }}>
                Stop the robbery at the bank
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#96938d' }}>
                <span>Thugs: {mission.enemiesRemaining}</span>
                <span>{Math.ceil(mission.timeLeft)}s</span>
              </div>
              {/* Timer bar */}
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  marginTop: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(mission.timeLeft / TUNING.bankRobbery.missionTimerSeconds) * 100}%`,
                    height: '100%',
                    background: mission.timeLeft < 30 ? '#c88079' : '#debf63',
                    transition: 'width 0.2s',
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom-center: hint text */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(12, 11, 10, 0.85)',
          border: '1px solid rgba(222, 191, 99, 0.3)',
          borderRadius: 16,
          padding: '8px 16px',
          fontSize: 11,
          color: '#96938d',
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        <span style={{ color: '#debf63', fontWeight: 700 }}>Mobile:</span> Left stick move · Drag right = camera · SPRINT = super speed<br/>
        <span style={{ color: '#debf63', fontWeight: 700 }}>Desktop:</span> WASD = move · Mouse drag = camera · Shift = sprint · Space = slow · Q = bolt · F = blow · E = phase
      </div>

      {/* Pause button (top-right corner) */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            background: 'rgba(12, 11, 10, 0.85)',
            border: '1px solid rgba(222, 191, 99, 0.4)',
            borderRadius: 20,
            padding: '4px 12px',
            color: '#debf63',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          PANTHEON · PHASE 0
        </div>
      </div>
    </div>
  );
}

function StatusChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        background: `${color}30`,
        border: `1px solid ${color}`,
        color: color,
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
  );
}

function MiniMap({
  heroPos,
  enemies,
  missionPos,
  blockSize,
}: {
  heroPos: [number, number, number];
  enemies: any[];
  missionPos?: [number, number, number];
  blockSize: number;
}) {
  // Map world coords to minimap coords (-blockSize/2 to blockSize/2 → 0 to 132)
  const toMap = (world: number) => ((world + blockSize / 2) / blockSize) * 132;

  return (
    <svg width="132" height="132" viewBox="0 0 132 132" style={{ display: 'block' }}>
      {/* Background */}
      <rect width="132" height="132" fill="#1a1a1a" rx="4" />

      {/* Streets grid */}
      <line x1="26" y1="0" x2="26" y2="132" stroke="#2a2a2a" strokeWidth="1" />
      <line x1="66" y1="0" x2="66" y2="132" stroke="#2a2a2a" strokeWidth="1" />
      <line x1="106" y1="0" x2="106" y2="132" stroke="#2a2a2a" strokeWidth="1" />
      <line x1="0" y1="44" x2="132" y2="44" stroke="#2a2a2a" strokeWidth="1" />
      <line x1="0" y1="88" x2="132" y2="88" stroke="#2a2a2a" strokeWidth="1" />

      {/* Bank (mission location) */}
      {missionPos && (
        <rect
          x={toMap(missionPos[0]) - 4}
          y={toMap(missionPos[2]) - 4}
          width="8"
          height="8"
          fill="#debf63"
        />
      )}

      {/* Enemies (red dots) */}
      {enemies.map((e) =>
        e.state === 'dead' ? null : (
          <circle
            key={e.id}
            cx={toMap(e.position[0])}
            cy={toMap(e.position[2])}
            r="2"
            fill="#c88079"
          />
        )
      )}

      {/* Hero (blue triangle pointing up) */}
      <circle
        cx={toMap(heroPos[0])}
        cy={toMap(heroPos[2])}
        r="3"
        fill="#1e90ff"
        stroke="#ffffff"
        strokeWidth="1"
      />

      {/* Border */}
      <rect
        x="0.5"
        y="0.5"
        width="131"
        height="131"
        fill="none"
        stroke="rgba(222,191,99,0.3)"
        strokeWidth="1"
        rx="4"
      />
    </svg>
  );
}
