'use client';

import { useEffect, useRef, useCallback } from 'react';
import { TUNING } from '@/config/tuning';
import { useGameStore } from '@/store/gameStore';
import { cameraInput } from '@/lib/game/cameraInput';

/**
 * Touch Controls for Pantheon (v2 — fixed layout)
 *
 * LEFT side: virtual joystick (movement) — gold nipplejs
 * RIGHT side: invisible touch-drag zone (camera rotate) — NO visible joystick
 * BOTTOM-RIGHT: all 5 action buttons in a row, together
 *
 * Buttons have custom SVG icons + text labels + cooldown indicators.
 */

interface ActionButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: (active: boolean) => void;
  cooldown?: number;
  active?: boolean;
  color?: string;
}

function ActionButton({ id, label, icon, onPress, cooldown = 0, active = false, color = '#debf63' }: ActionButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onPress(true);
    };
    const handleEnd = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
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

  return (
    <button
      ref={btnRef}
      className="relative select-none touch-none"
      style={{
        width: 56,
        height: 56,
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
        boxShadow: active ? `0 0 16px ${color}` : '0 4px 10px rgba(0,0,0,0.5)',
        transition: 'transform 0.05s, background 0.15s',
        transform: active ? 'scale(0.92)' : 'scale(1)',
      }}
      aria-label={label}
    >
      <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontSize: 7, fontWeight: 700, marginTop: 1, letterSpacing: 0.3 }}>
        {label}
      </span>
      {cooldown > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 13,
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
// ICONS (custom SVG)
// ──────────────────────────────────────
const JogIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <circle cx="13" cy="4" r="2" />
    <path d="M13 8l-3 2-2 3 1 1 2-1v3l-2 4h2l2-3 2 3v2h2v-3l-2-4v-4l3-2-1-3z" />
  </svg>
);
const SprintIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <circle cx="14" cy="4" r="2" />
    <path d="M14 7l-4 1-3 3 1 2 3-2v4l-3 5h3l2-4 2 3v3h2v-5l-2-3v-5l4-2-1-3z" />
    <line x1="2" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="13" x2="5" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const SlowTimeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);
const LightningIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M13 2L4 14h6l-2 8 9-12h-6z" />
  </svg>
);
const PhaseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v6m-3-3h6" />
    <ellipse cx="12" cy="18" rx="6" ry="3" strokeDasharray="2,2" />
  </svg>
);

export function TouchControls() {
  const leftZoneRef = useRef<HTMLDivElement>(null);
  const cameraZoneRef = useRef<HTMLDivElement>(null);
  const setInput = useGameStore((s) => s.setInput);
  const hero = useGameStore((s) => s.hero);
  const input = useGameStore((s) => s.input);

  // ──────────────────────────────────────
  // Left joystick (movement) — custom touch handler, no nipplejs
  // Reliable: we control every part of the touch pipeline
  // ──────────────────────────────────────
  const moveTouchId = useRef<number | null>(null);
  const moveStartX = useRef(0);
  const moveStartY = useRef(0);

  const onMoveTouchStart = useCallback((e: TouchEvent) => {
    if (moveTouchId.current !== null) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    moveTouchId.current = touch.identifier;
    moveStartX.current = touch.clientX;
    moveStartY.current = touch.clientY;
  }, []);

  const onMoveTouchMove = useCallback((e: TouchEvent) => {
    if (moveTouchId.current === null) return;
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === moveTouchId.current) {
        // Calculate delta from start position
        const dx = touch.clientX - moveStartX.current;
        const dy = touch.clientY - moveStartY.current;
        // Normalize to -1..1 range (max radius = 60px = full deflection)
        const maxRadius = 60;
        let nx = dx / maxRadius;
        let ny = dy / maxRadius;
        // Clamp magnitude to 1
        const mag = Math.sqrt(nx * nx + ny * ny);
        if (mag > 1) {
          nx /= mag;
          ny /= mag;
        }
        // Apply deadzone
        const deadzone = TUNING.controls.joystickDeadzone;
        if (Math.abs(nx) < deadzone && Math.abs(ny) < deadzone) {
          nx = 0;
          ny = 0;
        }
        setInput({ moveX: nx, moveY: ny });
        break;
      }
    }
  }, [setInput]);

  const onMoveTouchEnd = useCallback((e: TouchEvent) => {
    if (moveTouchId.current === null) return;
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === moveTouchId.current) {
        moveTouchId.current = null;
        setInput({ moveX: 0, moveY: 0 });
        break;
      }
    }
  }, [setInput]);

  // Mouse fallback for desktop
  const moveMouseDown = useRef(false);
  const onMouseMoveStart = useCallback((e: MouseEvent) => {
    if (moveMouseDown.current) return;
    e.preventDefault();
    moveMouseDown.current = true;
    moveStartX.current = e.clientX;
    moveStartY.current = e.clientY;
  }, []);
  const onMouseMoveDrag = useCallback((e: MouseEvent) => {
    if (!moveMouseDown.current) return;
    const dx = e.clientX - moveStartX.current;
    const dy = e.clientY - moveStartY.current;
    const maxRadius = 60;
    let nx = dx / maxRadius;
    let ny = dy / maxRadius;
    const mag = Math.sqrt(nx * nx + ny * ny);
    if (mag > 1) { nx /= mag; ny /= mag; }
    const deadzone = TUNING.controls.joystickDeadzone;
    if (Math.abs(nx) < deadzone && Math.abs(ny) < deadzone) { nx = 0; ny = 0; }
    setInput({ moveX: nx, moveY: ny });
  }, [setInput]);
  const onMouseMoveEnd = useCallback(() => {
    moveMouseDown.current = false;
    setInput({ moveX: 0, moveY: 0 });
  }, [setInput]);

  useEffect(() => {
    const zone = leftZoneRef.current;
    if (!zone) return;

    zone.addEventListener('touchstart', onMoveTouchStart, { passive: false });
    zone.addEventListener('touchmove', onMoveTouchMove, { passive: false });
    zone.addEventListener('touchend', onMoveTouchEnd, { passive: false });
    zone.addEventListener('touchcancel', onMoveTouchEnd, { passive: false });
    zone.addEventListener('mousedown', onMouseMoveStart);
    window.addEventListener('mousemove', onMouseMoveDrag);
    window.addEventListener('mouseup', onMouseMoveEnd);

    return () => {
      zone.removeEventListener('touchstart', onMoveTouchStart);
      zone.removeEventListener('touchmove', onMoveTouchMove);
      zone.removeEventListener('touchend', onMoveTouchEnd);
      zone.removeEventListener('touchcancel', onMoveTouchEnd);
      zone.removeEventListener('mousedown', onMouseMoveStart);
      window.removeEventListener('mousemove', onMouseMoveDrag);
      window.removeEventListener('mouseup', onMouseMoveEnd);
    };
  }, [onMoveTouchStart, onMoveTouchMove, onMoveTouchEnd, onMouseMoveStart, onMouseMoveDrag, onMouseMoveEnd]);

  // ──────────────────────────────────────
  // Right side: invisible touch-drag for camera (NO visible joystick)
  // User drags finger anywhere on right half → camera rotates
  // ──────────────────────────────────────
  const cameraTouchId = useRef<number | null>(null);
  const cameraLastX = useRef(0);
  const cameraLastY = useRef(0);
  const cameraActive = useRef(false);

  const onCameraTouchStart = useCallback((e: TouchEvent) => {
    // Only start if no camera touch is active yet
    if (cameraTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    cameraTouchId.current = touch.identifier;
    cameraLastX.current = touch.clientX;
    cameraLastY.current = touch.clientY;
    cameraActive.current = true;
  }, []);

  const onCameraTouchMove = useCallback((e: TouchEvent) => {
    if (cameraTouchId.current === null) return;
    // Find the tracked touch
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === cameraTouchId.current) {
        const dx = touch.clientX - cameraLastX.current;
        const dy = touch.clientY - cameraLastY.current;
        cameraLastX.current = touch.clientX;
        cameraLastY.current = touch.clientY;

        // Write to the camera input singleton — Velora reads this each frame
        const sensitivity = 0.008;
        cameraInput.deltaX += dx * sensitivity;
        cameraInput.deltaY += dy * sensitivity;
        break;
      }
    }
  }, []);

  const onCameraTouchEnd = useCallback((e: TouchEvent) => {
    if (cameraTouchId.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === cameraTouchId.current) {
        cameraTouchId.current = null;
        cameraActive.current = false;
        break;
      }
    }
  }, []);

  useEffect(() => {
    const zone = cameraZoneRef.current;
    if (!zone) return;

    zone.addEventListener('touchstart', onCameraTouchStart, { passive: false });
    zone.addEventListener('touchmove', onCameraTouchMove, { passive: false });
    zone.addEventListener('touchend', onCameraTouchEnd, { passive: false });
    zone.addEventListener('touchcancel', onCameraTouchEnd, { passive: false });

    return () => {
      zone.removeEventListener('touchstart', onCameraTouchStart);
      zone.removeEventListener('touchmove', onCameraTouchMove);
      zone.removeEventListener('touchend', onCameraTouchEnd);
      zone.removeEventListener('touchcancel', onCameraTouchEnd);
    };
  }, [onCameraTouchStart, onCameraTouchMove, onCameraTouchEnd]);

  // ──────────────────────────────────────
  // Mouse fallback for desktop testing
  // ──────────────────────────────────────
  const mouseDown = useRef(false);
  const onMouseDown = useCallback((e: MouseEvent) => {
    mouseDown.current = true;
    cameraLastX.current = e.clientX;
    cameraLastY.current = e.clientY;
  }, []);
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!mouseDown.current) return;
    const dx = e.clientX - cameraLastX.current;
    const dy = e.clientY - cameraLastY.current;
    cameraLastX.current = e.clientX;
    cameraLastY.current = e.clientY;
    const sensitivity = 0.008;
    cameraInput.deltaX += dx * sensitivity;
    cameraInput.deltaY += dy * sensitivity;
  }, []);
  const onMouseUp = useCallback(() => {
    mouseDown.current = false;
  }, []);

  useEffect(() => {
    const zone = cameraZoneRef.current;
    if (!zone) return;
    zone.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      zone.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseDown, onMouseMove, onMouseUp]);

  // ──────────────────────────────────────
  // Action button handlers
  // ──────────────────────────────────────
  const handleJog = useCallback((a: boolean) => setInput({ jog: a, sprint: false }), [setInput]);
  const handleSprint = useCallback((a: boolean) => setInput({ sprint: a, jog: false }), [setInput]);
  const handleSlowTime = useCallback((a: boolean) => setInput({ slowTime: a }), [setInput]);
  const handleLightning = useCallback((a: boolean) => setInput({ lightning: a }), [setInput]);
  const handlePhase = useCallback((a: boolean) => setInput({ phase: a }), [setInput]);

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
      {/* ═══════════════════════════════════════════
          LEFT: Movement joystick (custom, visible)
          Shows a base circle + moving stick indicator
          ═══════════════════════════════════════════ */}
      <div
        ref={leftZoneRef}
        style={{
          position: 'absolute',
          left: 20,
          bottom: 30,
          width: 120,
          height: 120,
          pointerEvents: 'auto',
          touchAction: 'none',
          borderRadius: '50%',
          background: 'rgba(20, 20, 30, 0.5)',
          border: '2px solid rgba(222, 191, 99, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner stick — moves based on input */}
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'rgba(222, 191, 99, 0.8)',
            border: '2px solid #ffffff',
            transform: `translate(${input.moveX * 40}px, ${input.moveY * 40}px)`,
            transition: 'transform 0.05s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT: Invisible camera-drag zone (covers
          entire right half of screen, EXCEPT where
          buttons are at the bottom)
          ═══════════════════════════════════════════ */}
      <div
        ref={cameraZoneRef}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '50%',
          pointerEvents: 'auto',
          touchAction: 'none',
          // Subtle hint that this area is interactive (very faint)
          background: 'transparent',
        }}
      />

      {/* ═══════════════════════════════════════════
          BOTTOM-RIGHT: All 5 action buttons in a row
          ═══════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
          display: 'flex',
          gap: 8,
          pointerEvents: 'auto',
          zIndex: 11,
        }}
      >
        <ActionButton
          id="btn-jog"
          label="JOG"
          icon={JogIcon}
          onPress={handleJog}
          active={hero.isSprinting ? false : undefined as any}
          color="#96938d"
        />
        <ActionButton
          id="btn-sprint"
          label="SPRINT"
          icon={SprintIcon}
          onPress={handleSprint}
          active={hero.isSprinting}
          color="#1e90ff"
        />
        <ActionButton
          id="btn-slowtime"
          label="SLOW"
          icon={SlowTimeIcon}
          onPress={handleSlowTime}
          cooldown={hero.slowTimeCooldown}
          active={hero.isSlowTimeActive}
          color="#debf63"
        />
        <ActionButton
          id="btn-lightning"
          label="BOLT"
          icon={LightningIcon}
          onPress={handleLightning}
          cooldown={hero.lightningCooldown}
          color="#1e90ff"
        />
        <ActionButton
          id="btn-phase"
          label="PHASE"
          icon={PhaseIcon}
          onPress={handlePhase}
          cooldown={hero.phaseCooldown}
          active={hero.isPhasing}
          color="#85a5c5"
        />
      </div>
    </div>
  );
}
