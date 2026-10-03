/**
 * The three challenges, and how each is judged.
 *
 * No answer key: each verdict runs the same functions the rest of the page
 * uses, so anything that has the property passes. The tests beside this
 * file hold a known solution to passing and a near miss to failing.
 */

import { bucketOf, floorMod, javaHash } from "./engine";

export type PuzzleId = "collide" | "size" | "perfect";
export const PUZZLES: readonly PuzzleId[] = ["collide", "size", "perfect"];

// --------------------------------------------------------------- collide --

export function judgeCollide(a: string, b: string) {
  const ha = javaHash(a);
  const hb = javaHash(b);
  const different = a !== b && a.length > 0 && b.length > 0;
  return { ha, hb, different, same: ha === hb, solved: different && ha === hb };
}

// ------------------------------------------------------------------ size --

/** IDs 0, 10, 20, …, 150: sixteen keys that share a step of 10. */
export const SIZE_KEYS = Array.from({ length: 16 }, (_, i) => i * 10);
export const SIZE_MIN = 16;
export const SIZE_MAX = 32;

export function judgeSize(text: string) {
  const m = /^\d+$/.test(text.trim()) ? Number(text.trim()) : NaN;
  const inRange = Number.isInteger(m) && m >= SIZE_MIN && m <= SIZE_MAX;
  const buckets = inRange ? SIZE_KEYS.map((k) => floorMod(k, m)) : [];
  const distinct = new Set(buckets).size;
  return {
    m: inRange ? m : null,
    buckets,
    distinct,
    solved: inRange && distinct === SIZE_KEYS.length,
  };
}

// --------------------------------------------------------------- perfect --

export const PERFECT_M = 8;

export function judgePerfect(words: readonly string[]) {
  const cleaned = words.map((w) => w.trim());
  const buckets = cleaned.map((w) => (w ? bucketOf(w, PERFECT_M) : null));
  const filled = cleaned.every(Boolean);
  const unique = new Set(cleaned).size === cleaned.length;
  const counts = new Array<number>(PERFECT_M).fill(0);
  for (const b of buckets) if (b !== null) counts[b] = (counts[b] ?? 0) + 1;
  const clash = buckets.map((b) => b !== null && (counts[b] ?? 0) > 1);
  const spread = counts.every((c) => c === 1);
  return {
    buckets,
    clash,
    rules: { filled, unique, spread },
    solved: filled && unique && spread,
  };
}
