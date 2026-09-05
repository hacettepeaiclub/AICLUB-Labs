/** Math helpers shared by simulations and visualizations. Pure, no side effects. */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const inverseLerp = (a: number, b: number, value: number): number =>
  a === b ? 0 : (value - a) / (b - a);

/** Map a value from one range to another, clamped to the output range. */
export const remap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => lerp(outMin, outMax, clamp(inverseLerp(inMin, inMax, value), 0, 1));

/** Framerate-independent exponential smoothing (use inside rAF loops). */
export const damp = (current: number, target: number, lambda: number, dtSec: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dtSec));

export const TAU = Math.PI * 2;

export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
