/**
 * The arrays the lab starts from.
 *
 * Every one of them is deterministic: the shuffled preset is seeded, and the
 * rest are constructed outright. Reset rebuilds the identical array, which is
 * what makes two runs of the same shape comparable — and the challenge fair.
 */

import { createRng, shuffle } from "@/lib/random";

/** Bars on screen. Fixed everywhere so counts mean the same thing on any device. */
export const SIZE = 32;
export const MIN_VALUE = 1;
export const MAX_VALUE = 32;

/** Selection sort's comparison count for this size — the constant the lab leans on. */
export const SELECTION_COMPARISONS = (SIZE * (SIZE - 1)) / 2;

export type PresetId = "sorted" | "almost" | "random" | "reversed";

export interface PresetInfo {
  id: PresetId;
  label: string;
}

export const PRESETS: readonly PresetInfo[] = [
  { id: "almost", label: "Almost sorted" },
  { id: "sorted", label: "Sorted" },
  { id: "random", label: "Shuffled" },
  { id: "reversed", label: "Reversed" },
];

const ramp = (): Int32Array => Int32Array.from({ length: SIZE }, (_, i) => i + MIN_VALUE);

/**
 * A handful of neighbours swapped in a sorted ramp. Written out rather than
 * randomised because section 1 depends on this exact shape: it is the one
 * where the adaptive algorithm visibly finishes first.
 */
const ALMOST_SWAPS: readonly number[] = [4, 11, 20, 27];

export function buildPreset(id: PresetId): Int32Array {
  const values = ramp();

  switch (id) {
    case "sorted":
      break;

    case "almost":
      for (const i of ALMOST_SWAPS) {
        const left = values[i]!;
        values[i] = values[i + 1]!;
        values[i + 1] = left;
      }
      break;

    case "reversed":
      values.reverse();
      break;

    case "random": {
      const mixed = shuffle(createRng(20260905), Array.from(values));
      for (let i = 0; i < SIZE; i++) values[i] = mixed[i]!;
      break;
    }
  }

  return values;
}

export const cloneValues = (values: Int32Array): Int32Array => values.slice();
