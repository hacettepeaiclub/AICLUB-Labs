/** Math helpers shared by simulations and visualizations. Pure, no side effects. */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const TAU = Math.PI * 2;
