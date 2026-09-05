/**
 * Turning a gesture into data.
 *
 * Drawing the array is the whole lab, so the mapping from a pointer position
 * to an index and a value lives here rather than inside a component — it is
 * the part that can be got wrong quietly, and the part worth testing.
 */

import { MAX_VALUE, MIN_VALUE, SIZE } from "./arrays";

/**
 * Bring any number into the drawable range. Non-finite input falls back to the
 * floor rather than propagating: an `Int32Array` turns NaN into 0, which is
 * below the range and would quietly corrupt the chart and the inversion count.
 */
export const clampValue = (value: number): number =>
  Number.isFinite(value) ? Math.min(MAX_VALUE, Math.max(MIN_VALUE, Math.round(value))) : MIN_VALUE;

export const inBounds = (values: ArrayLike<number>, index: number): boolean =>
  Number.isInteger(index) && index >= 0 && index < values.length;

/** Canvas x → bar index, or −1 outside the chart. */
export function indexAt(x: number, width: number, size = SIZE): number {
  if (width <= 0 || x < 0 || x >= width) return -1;
  const index = Math.floor((x / width) * size);
  return index < 0 || index >= size ? -1 : index;
}

/**
 * Canvas y → value. The top of the chart is the largest value, and anything
 * off either end clamps rather than refusing, so a sweep that strays above or
 * below the chart still draws a sensible line.
 */
export function valueAt(y: number, height: number): number {
  if (height <= 0) return MIN_VALUE;
  const fraction = 1 - y / height;
  return clampValue(MIN_VALUE + fraction * (MAX_VALUE - MIN_VALUE));
}

/** Set one bar. Returns whether anything changed, so a drag stays cheap. */
export function setValue(values: Int32Array, index: number, value: number): boolean {
  if (!inBounds(values, index)) return false;
  const next = clampValue(value);
  if (values[index] === next) return false;
  values[index] = next;
  return true;
}

/** Nudge one bar up or down, for the keyboard path. */
export function adjustValue(values: Int32Array, index: number, delta: number): boolean {
  if (!inBounds(values, index)) return false;
  return setValue(values, index, values[index]! + delta);
}

export type CursorKey = "ArrowLeft" | "ArrowRight" | "Home" | "End";

export const isCursorKey = (key: string): key is CursorKey =>
  key === "ArrowLeft" || key === "ArrowRight" || key === "Home" || key === "End";

/** Where the keyboard cursor lands. Stops at the ends rather than wrapping. */
export function moveCursor(values: ArrayLike<number>, from: number, key: CursorKey): number {
  const last = values.length - 1;
  if (last < 0) return -1;
  const at = inBounds(values, from) ? from : 0;
  switch (key) {
    case "ArrowLeft":
      return at > 0 ? at - 1 : at;
    case "ArrowRight":
      return at < last ? at + 1 : at;
    case "Home":
      return 0;
    case "End":
      return last;
  }
}

/** How many bars differ from a reference array — the edit budget in challenge 3. */
export function editCount(values: ArrayLike<number>, reference: ArrayLike<number>): number {
  let edits = 0;
  const length = Math.max(values.length, reference.length);
  for (let i = 0; i < length; i++) {
    if (values[i] !== reference[i]) edits++;
  }
  return edits;
}

export interface StrokePoint {
  index: number;
  value: number;
}

/**
 * Draw a straight line of values from one point to another.
 *
 * Pointer events do not fire for every pixel, so a quick sweep across the
 * chart reports a handful of positions with gaps between them. Without filling
 * those gaps the old shape survives in stripes and a clean ramp is impossible
 * to draw — which would break the one interaction the lab is built on.
 */
export function strokeTo(values: Int32Array, from: StrokePoint | null, to: StrokePoint): boolean {
  if (!inBounds(values, to.index)) return false;
  if (from === null || !inBounds(values, from.index) || from.index === to.index) {
    return setValue(values, to.index, to.value);
  }

  const span = to.index - from.index;
  const stride = span > 0 ? 1 : -1;
  let changed = false;
  // Skip `from` itself — it was written when that point arrived.
  for (let i = from.index + stride; ; i += stride) {
    const t = (i - from.index) / span;
    if (setValue(values, i, from.value + (to.value - from.value) * t)) changed = true;
    if (i === to.index) break;
  }
  return changed;
}
