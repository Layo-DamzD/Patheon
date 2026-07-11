'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Loading Screen — Pantheon-branded splash while assets load
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          if (!completedRef.current) {
            completedRef.current = true;
            setTimeout(() => {
              setDone(true);
              setTimeout(onComplete, 400);
            }, 200);
          }
          return 100;
        }
        return p + Math.random() * 10 + 5;  // Fast loading
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0c0b0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        opacity: done ? 0 : 1,
        transition: 'opacity 0.4s',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Gold accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: '#debf63',
        }}
      />

      {/* Logo */}
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div
          style={{
            fontSize: 14,
            color: '#96938d',
            letterSpacing: 4,
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          AEGIS DIRECTIVE PRESENTS
        </div>
        <div
          style={{
            fontSize: 'clamp(48px, 12vw, 96px)',
            fontWeight: 900,
            color: '#debf63',
            letterSpacing: -2,
            lineHeight: 1,
            textShadow: '0 0 40px rgba(222, 191, 99, 0.4)',
          }}
        >
          PANTHEON
        </div>
        <div
          style={{
            fontSize: 16,
            color: '#e5e4e2',
            marginTop: 12,
            fontStyle: 'italic',
            letterSpacing: 2,
          }}
        >
          Assemble. Rise. Endure.
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#96938d',
            marginTop: 8,
            letterSpacing: 1,
          }}
        >
          Phase 0 Prototype · Velora in Midtown
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 'clamp(200px, 60vw, 400px)',
            height: 3,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            marginTop: 40,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #debf63, #1e90ff)',
              transition: 'width 0.15s',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 10,
            color: '#96938d',
            marginTop: 8,
            fontFamily: 'monospace',
          }}
        >
          INITIALIZING THE CITADEL · {Math.min(Math.round(progress), 100)}%
        </div>
      </div>

      {/* Bottom corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          fontSize: 9,
          color: '#96938d',
          letterSpacing: 1,
        }}
      >
        v0.1.0 · PERSONAL PROJECT
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          fontSize: 9,
          color: '#96938d',
          letterSpacing: 1,
        }}
      >
        Z.AI · SUPER Z
      </div>
    </div>
  );
}
