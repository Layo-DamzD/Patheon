'use client';

import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';

/**
 * Touch Controls for Pantheon
 * Left joystick = move (nipplejs)
 * Right joystick = camera (nipplejs)
 * 5 action buttons (Velora's layout):
 *   - Jog (walking figure)
 *   - Sprint (running figure)
 *   - Slow Time (clock)
 *   - Lightning (bolt)
 *   - Phase (ghost)
 *
 * All buttons have custom SVG icons + text labels.
 * Each button has a cooldown indicator overlay.
 */

interface ActionButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: (active: boolean) => void;
  cooldown?: number;     // 0 = ready, >0 = on cooldown
  active?: boolean;      // Currently held/toggled
  color?: string;
}

function ActionButton({ id, label, icon, onPress, cooldown = 0, active = false, color = '#debf63' }: ActionButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      onPress(true);
    };
    const handleEnd = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      onPress(false);
    };

    btn.addEventListener('touchstart', handleStart, { passive: false });
    btn.addEventListener('touchend', handleEnd, { passive: false });
    btn.addEventListener('touchcancel', handleEnd, { passive: false });
    btn.addEventListener('mousedown', handleStart);
    btn.addEventListener('mouseup', handleEnd);
    btn.addEventListener('mouseleave', handleEnd);

    return () => {
      btn.removeEventListener('touchstart', handleStart);
      btn.removeEventListener('touchend', handleEnd);
      btn.removeEventListener('touchcancel', handleEnd);
      btn.removeEventListener('mousedown', handleStart);
      btn.removeEventListener('mouseup', handleEnd);
      btn.removeEventListener('mouseleave', handleEnd);
    };
  }, [onPress]);

  const cooldownPct = cooldown > 0 ? 1 : 0; // visual fill

  return (
    <button
      ref={btnRef}
      className="relative select-none touch-none"
      style={{
        width: TUNING.controls.buttonSize,
        height: TUNING.controls.buttonSize,
        background: active ? color : 'rgba(20, 20, 30, 0.85)',
        border: `2px solid ${active ? '#ffffff' : color}`,
        borderRadius: '50%',
        color: active ? '#1a1a1a' : color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        boxShadow: active ? `0 0 20px ${color}` : '0 4px 12px rgba(0,0,0,0.5)',
        transition: 'transform 0.05s, background 0.15s',
        transform: active ? 'scale(0.92)' : 'scale(1)',
      }}
      aria-label={label}
    >
      {/* Icon */}
      <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      {/* Label */}
      <span style={{ fontSize: 8, fontWeight: 700, marginTop: 2, letterSpacing: 0.5 }}>
        {label}
      </span>
      {/* Cooldown overlay */}
      {cooldown > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {cooldown.toFixed(1)}
        </div>
      )}
    </button>
  );
}

// ──────────────────────────────────────
// ICONS (custom SVG, no emoji)
// ──────────────────────────────────────
const JogIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <circle cx="13" cy="4" r="2" />
    <path d="M13 8l-3 2-2 3 1 1 2-1v3l-2 4h2l2-3 2 3v2h2v-3l-2-4v-4l3-2-1-3z" />
  </svg>
);
const SprintIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <circle cx="14" cy="4" r="2" />
    <path d="M14 7l-4 1-3 3 1 2 3-2v4l-3 5h3l2-4 2 3v3h2v-5l-2-3v-5l4-2-1-3z" />
    {/* Motion lines */}
    <line x1="2" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="13" x2="5" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const SlowTimeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);
const LightningIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M13 2L4 14h6l-2 8 9-12h-6z" />
  </svg>
);
const PhaseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v6m-3-3h6" />
    <ellipse cx="12" cy="18" rx="6" ry="3" strokeDasharray="2,2" />
  </svg>
);

export function TouchControls() {
  const leftZoneRef = useRef<HTMLDivElement>(null);
  const rightZoneRef = useRef<HTMLDivElement>(null);
  const setInput = useGameStore((s) => s.setInput);
  const hero = useGameStore((s) => s.hero);

  // Setup left joystick (movement)
  useEffect(() => {
    if (!leftZoneRef.current) return;
    const joystick = nipplejs.create({
      zone: leftZoneRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      size: TUNING.controls.joystickSize,
      color: '#debf63',
      restOpacity: 0.6,
    });

    joystick.on('move', (evt, data) => {
      if (data.vector) {
        const deadzone = TUNING.controls.joystickDeadzone;
        let x = data.vector.x;
        let y = data.vector.y;
        const mag = Math.sqrt(x * x + y * y);
        if (mag < deadzone) {
          x = 0;
          y = 0;
        }
        setInput({ moveX: x, moveY: y });
      }
    });
    joystick.on('end', () => {
      setInput({ moveX: 0, moveY: 0 });
    });

    return () => joystick.destroy();
  }, [setInput]);

  // Setup right joystick (camera)
  useEffect(() => {
    if (!rightZoneRef.current) return;
    const joystick = nipplejs.create({
      zone: rightZoneRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      size: TUNING.controls.joystickSize,
      color: '#1e90ff',
      restOpacity: 0.6,
    });

    joystick.on('move', (evt, data) => {
      if (data.vector) {
        const deadzone = TUNING.controls.joystickDeadzone;
        let x = data.vector.x;
        let y = data.vector.y;
        const mag = Math.sqrt(x * x + y * y);
        if (mag < deadzone) {
          x = 0;
          y = 0;
        }
        setInput({ cameraX: x, cameraY: y });
      }
    });
    joystick.on('end', () => {
      setInput({ cameraX: 0, cameraY: 0 });
    });

    return () => joystick.destroy();
  }, [setInput]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Left joystick zone (movement) */}
      <div
        ref={leftZoneRef}
        style={{
          position: 'absolute',
          left: TUNING.controls.buttonSize,
          bottom: TUNING.controls.buttonSize,
          width: TUNING.controls.joystickSize,
          height: TUNING.controls.joystickSize,
          pointerEvents: 'auto',
          touchAction: 'none',
          borderRadius: '50%',
          background: 'rgba(20, 20, 30, 0.3)',
          border: '1px solid rgba(222, 191, 99, 0.3)',
        }}
      />

      {/* Right joystick zone (camera) */}
      <div
        ref={rightZoneRef}
        style={{
          position: 'absolute',
          right: TUNING.controls.buttonSize,
          bottom: TUNING.controls.buttonSize + TUNING.controls.buttonSize + 80,
          width: TUNING.controls.joystickSize,
          height: TUNING.controls.joystickSize,
          pointerEvents: 'auto',
          touchAction: 'none',
          borderRadius: '50%',
          background: 'rgba(20, 20, 30, 0.3)',
          border: '1px solid rgba(30, 144, 255, 0.3)',
        }}
      />

      {/* Action buttons — semicircle arc above the right joystick */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          display: 'grid',
          gridTemplateColumns: '64px 64px 64px',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        {/* Top row: Phase, Slow Time */}
        <ActionButton
          id="btn-phase"
          label="PHASE"
          icon={PhaseIcon}
          onPress={(a) => setInput({ phase: a })}
          cooldown={hero.phaseCooldown}
          active={hero.isPhasing}
          color="#85a5c5"
        />
        <ActionButton
          id="btn-slowtime"
          label="SLOW"
          icon={SlowTimeIcon}
          onPress={(a) => setInput({ slowTime: a })}
          cooldown={hero.slowTimeCooldown}
          active={hero.isSlowTimeActive}
          color="#debf63"
        />
        {/* Place lightning on top right alone */}
        <ActionButton
          id="btn-lightning"
          label="BOLT"
          icon={LightningIcon}
          onPress={(a) => setInput({ lightning: a })}
          cooldown={hero.lightningCooldown}
          color="#1e90ff"
        />
      </div>

      {/* Bottom-right below joystick: Jog and Sprint */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16 + TUNING.controls.buttonSize + 80 + TUNING.controls.joystickSize + 16,
          display: 'flex',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <ActionButton
          id="btn-jog"
          label="JOG"
          icon={JogIcon}
          onPress={(a) => setInput({ jog: a, sprint: false })}
          active={hero.isSprinting ? false : undefined as any}
          color="#96938d"
        />
        <ActionButton
          id="btn-sprint"
          label="SPRINT"
          icon={SprintIcon}
          onPress={(a) => setInput({ sprint: a, jog: false })}
          active={hero.isSprinting}
          color="#1e90ff"
        />
      </div>
    </div>
  );
}
