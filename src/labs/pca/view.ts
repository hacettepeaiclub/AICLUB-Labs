import { labColor } from "@/design/tokens";
import { mean, type Point } from "./engine";

/**
 * The lab's colours, read through `labColor` so both themes work and nothing
 * is added to the shared stylesheet: your direction in blue, where the matrix
 * sends it in amber, a direction that stays in the accent.
 */
export const COLOR = {
  v: () => labColor("data"),
  av: () => labColor("signalAmber"),
  stays: () => labColor("accent"),
  across: () => labColor("signalRose"),
  dot: () => labColor("fgMuted", 0.7),
  grid: () => labColor("fgFaint", 0.35),
  axis: () => labColor("fgFaint", 0.6),
  text: () => labColor("fgMuted"),
};

/** The viewBox every plot here draws into: 100 × 100 units. */
export const S = 100;

export interface Frame {
  readonly x: (value: number) => number;
  readonly y: (value: number) => number;
  /** Data units per plot unit, the same on both axes. */
  readonly scale: number;
}

/**
 * A square frame round the cloud with one scale for both axes, so an angle
 * on screen is the angle in the data and a perpendicular looks perpendicular.
 */
export function frameFor(points: readonly Point[]): Frame {
  const m = mean(points);
  const reach = Math.max(
    1e-9,
    ...points.map((p) => Math.max(Math.abs(p.x - m.x), Math.abs(p.y - m.y))),
  );
  const half = reach * 1.12;
  return {
    x: (value) => ((value - m.x + half) / (2 * half)) * S,
    y: (value) => S - ((value - m.y + half) / (2 * half)) * S,
    scale: (2 * half) / S,
  };
}
