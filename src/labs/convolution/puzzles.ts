/**
 * The three challenges, and how each is judged.
 *
 * There is no answer key. Every verdict runs the visitor's kernel through
 * `correlate` on fixed test pictures and checks a property of the output,
 * so any kernel with the property passes — and the tests below the lab hold
 * a known solution to passing and a near miss to failing for each.
 */

import { createRng } from "@/lib/random";
import {
  correlate,
  extent,
  flip,
  fromPicture,
  grid,
  maxDifference,
  shift,
  type Grid,
} from "./engine";

export type PuzzleId = "shift" | "flat" | "vertical";
export const PUZZLES: readonly PuzzleId[] = ["shift", "flat", "vertical"];

const EPS = 1e-9;

// ---------------------------------------------------------------- shift --

/** A seeded scatter of pixels, so no shape could pass by coincidence. */
export const SHIFT_PICTURE: Grid = (() => {
  const rng = createRng(11);
  const g = grid(8, 8);
  for (let k = 0; k < g.data.length; k++) g.data[k] = rng() < 0.4 ? 1 : 0;
  return g;
})();

export const SHIFT_GOAL = shift(SHIFT_PICTURE, 1, 0);

export interface ShiftVerdict {
  readonly output: Grid;
  readonly solved: boolean;
  /** Moved the picture left: the right answer, flipped. */
  readonly mirrored: boolean;
}

export function judgeShift(kernel: Grid): ShiftVerdict {
  const output = correlate(SHIFT_PICTURE, kernel, { padding: 1 });
  const solved = maxDifference(output, SHIFT_GOAL) < EPS;
  const mirrored =
    !solved &&
    maxDifference(correlate(SHIFT_PICTURE, flip(kernel), { padding: 1 }), SHIFT_GOAL) < EPS;
  return { output, solved, mirrored };
}

// ----------------------------------------------------------------- flat --

/** A bright square on a dark ground: two flat regions and the edge between. */
export const FLAT_PICTURE = fromPicture([
  "..........",
  "..........",
  "..........",
  "...####...",
  "...####...",
  "...####...",
  "...####...",
  "..........",
  "..........",
  "..........",
]);

/** True for output cells whose 3×3 window lies entirely in one flat region. */
const flatWindow = (x: number, y: number): boolean => {
  let first: number | null = null;
  for (let v = 0; v < 3; v++) {
    for (let u = 0; u < 3; u++) {
      const p = FLAT_PICTURE.data[(y + v) * FLAT_PICTURE.width + x + u] ?? 0;
      if (first === null) first = p;
      else if (p !== first) return false;
    }
  }
  return true;
};

export interface FlatVerdict {
  readonly output: Grid;
  readonly rules: { readonly flatZero: boolean; readonly edgeSeen: boolean };
  readonly solved: boolean;
}

export function judgeFlat(kernel: Grid): FlatVerdict {
  const output = correlate(FLAT_PICTURE, kernel);
  let flatZero = true;
  let edgeSeen = false;
  for (let y = 0; y < output.height; y++) {
    for (let x = 0; x < output.width; x++) {
      const v = output.data[y * output.width + x] ?? 0;
      if (flatWindow(x, y)) {
        if (Math.abs(v) > EPS) flatZero = false;
      } else if (Math.abs(v) > EPS) {
        edgeSeen = true;
      }
    }
  }
  return { output, rules: { flatZero, edgeSeen }, solved: flatZero && edgeSeen };
}

// ------------------------------------------------------------- vertical --

/** Lines that run the full height or width, so neither has an end to catch. */
export const VERTICAL_LINE = fromPicture(Array.from({ length: 7 }, () => "...#..."));
export const HORIZONTAL_LINE = fromPicture(
  Array.from({ length: 7 }, (_, y) => (y === 3 ? "#######" : ".......")),
);

export interface VerticalVerdict {
  readonly vertical: Grid;
  readonly horizontal: Grid;
  readonly rules: { readonly fires: boolean; readonly silent: boolean };
  readonly solved: boolean;
}

export function judgeVertical(kernel: Grid): VerticalVerdict {
  const vertical = correlate(VERTICAL_LINE, kernel);
  const horizontal = correlate(HORIZONTAL_LINE, kernel);
  const fires = extent(vertical).max > EPS;
  const silent = extent(horizontal).max <= EPS;
  return { vertical, horizontal, rules: { fires, silent }, solved: fires && silent };
}
