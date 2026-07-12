/**
 * Keyboard Input — desktop keyboard support.
 *
 * Why a module singleton (like cameraInput)?
 * Keyboard events fire at OS rate, not frame rate. Using React state would
 * cause unnecessary re-renders. A plain mutable object lets the keydown/keyup
 * handlers write state and Velora read it each frame without re-renders.
 *
 * Controls:
 * - WASD / Arrow Keys = movement
 * - Shift = sprint (hold)
 * - Space = slow time (toggle)
 * - Q = lightning bolt (press)
 * - E = phase (press)
 *
 * Mouse:
 * - Drag anywhere on right half = camera (already handled in TouchControls)
 */

export const keyboardInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  slowTimePressed: false,
  lightningPressed: false,
  phasePressed: false,
  blowPressed: false,
  flightPressed: false,
  jumpPressed: false,
};

// Track which keys are held (for continuous movement + sprint)
const heldKeys = new Set<string>();

// Helper to consume an edge-triggered press (resets after read)
export function consumeSlowTimePress(): boolean {
  const v = keyboardInput.slowTimePressed;
  keyboardInput.slowTimePressed = false;
  return v;
}
export function consumeLightningPress(): boolean {
  const v = keyboardInput.lightningPressed;
  keyboardInput.lightningPressed = false;
  return v;
}
export function consumePhasePress(): boolean {
  const v = keyboardInput.phasePressed;
  keyboardInput.phasePressed = false;
  return v;
}
export function consumeBlowPress(): boolean {
  const v = keyboardInput.blowPressed;
  keyboardInput.blowPressed = false;
  return v;
}
export function consumeFlightPress(): boolean {
  const v = keyboardInput.flightPressed;
  keyboardInput.flightPressed = false;
  return v;
}
export function consumeJumpPress(): boolean {
  const v = keyboardInput.jumpPressed;
  keyboardInput.jumpPressed = false;
  return v;
}

function updateMovement() {
  // Compute combined X/Y from held keys
  let mx = 0;
  let my = 0;
  if (heldKeys.has('KeyW') || heldKeys.has('ArrowUp')) my -= 1;
  if (heldKeys.has('KeyS') || heldKeys.has('ArrowDown')) my += 1;
  if (heldKeys.has('KeyA') || heldKeys.has('ArrowLeft')) mx -= 1;
  if (heldKeys.has('KeyD') || heldKeys.has('ArrowRight')) mx += 1;
  keyboardInput.forward = my < 0;
  keyboardInput.backward = my > 0;
  keyboardInput.left = mx < 0;
  keyboardInput.right = mx > 0;
  keyboardInput.sprint = heldKeys.has('ShiftLeft') || heldKeys.has('ShiftRight');

  // Return the X/Y for the store
  return { mx, my };
}

let storeSetInput: ((partial: any) => void) | null = null;

export function initKeyboard(setInput: (partial: any) => void) {
  storeSetInput = setInput;

  const onKeyDown = (e: KeyboardEvent) => {
    // Prevent default for game keys (so Space doesn't scroll page, etc.)
    const gameKeys = [
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'ShiftLeft', 'ShiftRight',
      'Space', 'KeyQ', 'KeyE', 'KeyF', 'KeyR',
    ];
    if (gameKeys.includes(e.code)) {
      e.preventDefault();
    }

    // Edge-triggered actions (only fire on initial press, not repeat)
    if (!e.repeat) {
      if (e.code === 'Space') { keyboardInput.slowTimePressed = true; keyboardInput.jumpPressed = true; }
      if (e.code === 'KeyQ') keyboardInput.lightningPressed = true;
      if (e.code === 'KeyE') keyboardInput.phasePressed = true;
      if (e.code === 'KeyF') keyboardInput.blowPressed = true;
      if (e.code === 'KeyR') keyboardInput.flightPressed = true;
    }

    heldKeys.add(e.code);
    const { mx, my } = updateMovement();
    if (storeSetInput) {
      storeSetInput({
        moveX: mx,
        moveY: my,
        sprint: keyboardInput.sprint,
      });
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    heldKeys.delete(e.code);
    const { mx, my } = updateMovement();
    if (storeSetInput) {
      storeSetInput({
        moveX: mx,
        moveY: my,
        sprint: keyboardInput.sprint,
      });
    }
  };

  // Clear keys when window loses focus (prevents stuck keys)
  const onBlur = () => {
    heldKeys.clear();
    updateMovement();
    if (storeSetInput) {
      storeSetInput({ moveX: 0, moveY: 0, sprint: false });
    }
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
  };
}
