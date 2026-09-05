/**
 * Canvas drawing for the bar chart.
 *
 * Everything is read out of the engine's own state, so the picture cannot
 * drift from the sort it claims to be showing.
 *
 * Nothing is distinguished by colour alone: settled bars sit on a solid rule,
 * the two bars being compared wear an outline and a caret beneath them, the
 * value currently held out of the array is drawn lifted clear of the baseline,
 * and the keyboard cursor is a dashed frame. Colours come from `design/tokens`.
 */

import { color, paletteVersion } from "@/design/tokens";
import { MAX_VALUE, MIN_VALUE } from "./arrays";
import type { Sort } from "./engine";

interface Ink {
  bar: string;
  barSettled: string;
  rule: string;
  mark: string;
  held: string;
  hole: string;
  cursor: string;
}

/**
 * Every colour this module paints with, resolved once per theme.
 *
 * These used to be module constants, evaluated at import. That was correct
 * while there was a single theme; now a theme switch has to reach the canvas,
 * and re-resolving on every draw would mean re-reading computed styles sixty
 * times a second. `paletteVersion()` changes only when the theme does.
 */
let ink: Ink | null = null;
let inkVersion = -1;

function inks(): Ink {
  if (ink !== null && inkVersion === paletteVersion()) return ink;
  inkVersion = paletteVersion();
  ink = {
    bar: color("fgFaint", 0.45),
    barSettled: color("signalCyan", 0.5),
    rule: color("signalCyan", 0.9),
    mark: color("accent"),
    held: color("accent", 0.9),
    hole: color("fgFaint", 0.16),
    cursor: color("fg", 0.9),
  };
  return ink;
}


/** Room under the bars for the settled rule and the comparison carets. */
const GUTTER = 14;

export interface Layout {
  /** Width of one bar's slot, including the gap. */
  slot: number;
  /** Painted width of a bar. */
  bar: number;
  /** Baseline the bars stand on. */
  base: number;
  /** Pixels available for the tallest bar. */
  span: number;
}

export function layoutFor(size: number, width: number, height: number): Layout {
  const slot = width / size;
  return {
    slot,
    bar: Math.max(1, slot - Math.min(3, slot * 0.22)),
    base: height - GUTTER,
    span: Math.max(1, height - GUTTER - 4),
  };
}

const barHeight = (value: number, span: number): number =>
  Math.max(2, ((value - MIN_VALUE + 1) / (MAX_VALUE - MIN_VALUE + 1)) * span);

function caret(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.beginPath();
  ctx.moveTo(x - size, y + size);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
}

export interface DrawOptions {
  /** Keyboard cursor, or −1 when the visitor is using a pointer. */
  cursor: number;
  /** Dim slightly while editing is locked during a run. */
  locked: boolean;
}

/**
 * Paint one array. Called once per frame while a sort runs, and once per edit
 * otherwise — never on a timer when nothing has changed.
 */
export function drawBars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  values: Int32Array,
  sort: Sort | null,
  options: DrawOptions,
): void {
  const C = inks();
  const size = values.length;
  ctx.clearRect(0, 0, width, height);
  if (size === 0 || width <= 0 || height <= 0) return;

  const { slot, bar, base, span } = layoutFor(size, width, height);
  const settled = sort ? sort.sortedPrefix : 0;
  const compareA = sort ? sort.a : -1;
  const compareB = sort ? sort.b : -1;
  const heldFrom = sort ? sort.heldFrom : -1;

  ctx.globalAlpha = options.locked ? 0.94 : 1;

  for (let i = 0; i < size; i++) {
    const x = i * slot + (slot - bar) / 2;
    const isHole = i === heldFrom;
    const h = barHeight(values[i]!, span);

    // The slot a value was lifted out of is drawn as an outline, so the array
    // visibly has a gap in it while insertion sort walks backwards.
    if (isHole) {
      ctx.strokeStyle = C.hole;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, base - h + 0.5, bar - 1, h - 1);
    } else {
      ctx.fillStyle = i < settled ? C.barSettled : C.bar;
      ctx.fillRect(x, base - h, bar, h);
    }

    if (i === compareA || i === compareB) {
      ctx.strokeStyle = C.mark;
      ctx.lineWidth = Math.max(1.5, bar * 0.16);
      ctx.strokeRect(x - 1, base - h - 1, bar + 2, h + 2);
      ctx.fillStyle = C.mark;
      caret(ctx, x + bar / 2, base + 3, Math.max(2.5, bar * 0.3));
    }
  }

  // The value in the air, drawn clear of the baseline.
  if (sort && heldFrom >= 0) {
    const h = barHeight(sort.held, span);
    const x = heldFrom * slot + (slot - bar) / 2;
    ctx.fillStyle = C.held;
    ctx.fillRect(x, base - h - GUTTER, bar, h);
  }

  // A solid rule under everything that is settled — the sorted region, without
  // relying on the bar colour to say so.
  if (settled > 0) {
    ctx.strokeStyle = C.rule;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, base + 1);
    ctx.lineTo(Math.min(settled * slot, width), base + 1);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  if (options.cursor >= 0 && options.cursor < size) {
    const x = options.cursor * slot;
    ctx.strokeStyle = C.cursor;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(x + 1, 1, slot - 2, height - 2);
    ctx.setLineDash([]);
  }
}
