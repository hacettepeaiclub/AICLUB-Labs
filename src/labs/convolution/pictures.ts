/**
 * The images and kernels the lab ships with.
 *
 * Small pictures are drawn as text so they read as what they are; the larger
 * scene is generated, with each pixel's brightness set by how much of it the
 * shape covers, so edges have the soft grey a photograph would.
 */

import { createRng } from "@/lib/random";
import { fromPicture, fromRows, grid, type Grid } from "./engine";

// ------------------------------------------------------------- the hero --

/** Nine by nine, so a 3×3 window has 7×7 places to go. */
export const LETTER_T = fromPicture([
  ".........",
  ".#######.",
  ".#######.",
  "...##....",
  "...##....",
  "...##....",
  "...##....",
  "...##....",
  ".........",
]);

// --------------------------------------------------------------- kernels --

export type PresetId = "identity" | "blur" | "sharpen" | "vertical" | "horizontal" | "outline";

/**
 * Every preset as the text a visitor would type into the nine cells, so the
 * editor shows `1/9` rather than 0.1111111111111111.
 */
export const PRESETS: Record<PresetId, readonly (readonly string[])[]> = {
  identity: [
    ["0", "0", "0"],
    ["0", "1", "0"],
    ["0", "0", "0"],
  ],
  blur: [
    ["1/9", "1/9", "1/9"],
    ["1/9", "1/9", "1/9"],
    ["1/9", "1/9", "1/9"],
  ],
  sharpen: [
    ["0", "-1", "0"],
    ["-1", "5", "-1"],
    ["0", "-1", "0"],
  ],
  // Sobel: positive where brightness rises to the right (or downwards).
  vertical: [
    ["-1", "0", "1"],
    ["-2", "0", "2"],
    ["-1", "0", "1"],
  ],
  horizontal: [
    ["-1", "-2", "-1"],
    ["0", "0", "0"],
    ["1", "2", "1"],
  ],
  outline: [
    ["-1", "-1", "-1"],
    ["-1", "8", "-1"],
    ["-1", "-1", "-1"],
  ],
};

export const PRESET_ORDER: readonly PresetId[] = [
  "identity",
  "blur",
  "sharpen",
  "vertical",
  "horizontal",
  "outline",
];

/** The hero's kernel: Prewitt, whole numbers, so every sum on screen is exact. */
export const PREWITT = fromRows([
  [-1, 0, 1],
  [-1, 0, 1],
  [-1, 0, 1],
]);

export const SOBEL_X = fromRows([
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
]);

export const BOX_BLUR = fromRows([
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
]);

export const LAPLACIAN = fromRows([
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
]);

// ----------------------------------------------------------------- scene --

/** How finely each pixel is sampled to decide how much of it a shape covers. */
const SUPERSAMPLE = 4;

type Shape = (x: number, y: number) => number;

function render(size: number, shapes: readonly Shape[]): Grid {
  const out = grid(size, size);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let total = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const x = (px + (sx + 0.5) / SUPERSAMPLE) / size;
          const y = (py + (sy + 0.5) / SUPERSAMPLE) / size;
          let v = 0;
          for (const shape of shapes) v = Math.max(v, shape(x, y));
          total += v;
        }
      }
      out.data[py * size + px] = total / SUPERSAMPLE ** 2;
    }
  }
  return out;
}

/**
 * A disc, a square, a bar on a slant and a ring: curves, straight edges in
 * both directions, and a diagonal, so that every preset has something to
 * find and something to ignore. Coordinates are in [0, 1]².
 */
const SCENE_SHAPES: readonly Shape[] = [
  (x, y) => (Math.hypot(x - 0.3, y - 0.3) < 0.17 ? 1 : 0),
  (x, y) => (x > 0.56 && x < 0.86 && y > 0.14 && y < 0.44 ? 0.7 : 0),
  (x, y) => {
    // A bar from lower left to upper right.
    const along = (x - 0.15) * 0.7071 - (y - 0.85) * 0.7071;
    const across = (x - 0.15) * 0.7071 + (y - 0.85) * 0.7071;
    return along > 0 && along < 0.42 && Math.abs(across) < 0.05 ? 0.85 : 0;
  },
  (x, y) => {
    const r = Math.hypot(x - 0.72, y - 0.72);
    return r > 0.1 && r < 0.17 ? 0.55 : 0;
  },
];

export const scene = (size: number): Grid => render(size, SCENE_SHAPES);

/**
 * The scene with a fine seeded grain added.
 *
 * Fitting a kernel needs patches that point in every one of its nine
 * directions; a picture of flat shapes has long runs of identical patches
 * and leaves some directions almost unseen, which makes descent crawl. A
 * little texture is what a photograph has anyway.
 */
export function texturedScene(size: number, seed = 7): Grid {
  const base = scene(size);
  const rng = createRng(seed);
  const out = grid(size, size);
  base.data.forEach((v, k) => (out.data[k] = 0.15 + 0.6 * v + 0.25 * rng()));
  return out;
}

// --------------------------------------------------------------- template --

/** The pattern the shift section searches for, and the kernel that finds it. */
export const PLUS = fromPicture(["..#..", "..#..", "#####", "..#..", "..#.."]);

/**
 * +1 where the plus is, −1 everywhere else in its square. A window holding
 * exactly the plus scores 9, the most any window of 0…1 pixels can; anything
 * else, including a solid block that contains the plus, scores less.
 */
export const PLUS_DETECTOR: Grid = {
  width: PLUS.width,
  height: PLUS.height,
  data: PLUS.data.map((v) => (v === 1 ? 1 : -1)),
};

/** Other marks on the field, so the detector has something to reject. */
export const DISTRACTORS = {
  x: fromPicture(["#...#", ".#.#.", "..#..", ".#.#.", "#...#"]),
  block: fromPicture(["###", "###", "###"]),
  bar: fromPicture(["#####"]),
} as const;
