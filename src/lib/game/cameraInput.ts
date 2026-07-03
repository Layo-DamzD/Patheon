/**
 * Camera Input — shared mutable singleton for camera drag deltas.
 *
 * Why a module singleton instead of Zustand?
 * Camera drag fires at touchmove rate (~60Hz), which is different from
 * useFrame rate (~60Hz). Using React state would cause unnecessary re-renders.
 * A plain mutable object lets TouchControls write deltas and Velora consume
 * them without triggering React updates.
 *
 * Usage:
 * - TouchControls: cameraInput.deltaX += dx (on touchmove)
 * - Velora useFrame: read deltaX/Y, apply to camera, reset to 0
 */
export const cameraInput = {
  deltaX: 0,
  deltaY: 0,
};
