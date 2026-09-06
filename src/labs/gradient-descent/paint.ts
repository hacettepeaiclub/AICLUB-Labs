/**
 * Canvas drawing for the contour map and the objective chart.
 *
 * Everything painted here is read out of the engine's own state or derived
 * analytically from the landscape, so the picture cannot drift from the run it
 * claims to be showing. There is no sampled heat map, no marching squares and
 * no 3D: the level sets of ½(ax² + by²) are exact ellipses, so one
 * `ctx.ellipse` call per ring is both the cheapest and the most accurate thing
 * that could be drawn.
 *
 * Nothing is distinguished by colour alone. The minimum is a cross, the start
 * is a hollow ring, the current position is a filled dot, the descent
 * direction is a solid arrow and the direction to the minimum is a dashed one.
 * Colours come from `design/tokens`, resolved once per theme.
 */

import { color, paletteVersion } from "@/design/tokens";
import { contourSemiAxes } from "./landscape";
import type { Landscape, Point } from "./engine";

interface Ink {
  contour: string;
  contourStrong: string;
  axis: string;
  path: string;
  pathNode: string;
  current: string;
  start: string;
  minimum: string;
  gradient: string;
  target: string;
  chartLine: string;
  chartTolerance: string;
  chartCursor: string;
  warn: string;
}

let ink: Ink | null = null;
let inkVersion = -1;

/**
 * Every colour this module paints with, resolved once per theme.
 *
 * Re-reading computed styles on every draw would mean re-resolving fourteen
 * custom properties sixty times a second; `paletteVersion()` changes only when
 * the theme does.
 */
function inks(): Ink {
  if (ink !== null && inkVersion === paletteVersion()) return ink;
  inkVersion = paletteVersion();
  ink = {
    contour: color("fgFaint", 0.28),
    contourStrong: color("fgFaint", 0.5),
    axis: color("fgFaint", 0.18),
    path: color("accent", 0.85),
    pathNode: color("accent", 0.55),
    current: color("accent"),
    start: color("fgMuted"),
    minimum: color("fg"),
    gradient: color("signalCyan"),
    target: color("signalAmber"),
    chartLine: color("accent"),
    chartTolerance: color("signalGreen", 0.7),
    chartCursor: color("fg", 0.35),
    warn: color("signalRose"),
  };
  return ink;
}

// ------------------------------------------------------------------ view ---

export interface View {
  cx: number;
  cy: number;
  /** Screen pixels per world unit. */
  scale: number;
  extent: number;
}

/**
 * A square window on the plane, centred on the minimum.
 *
 * Deliberately the *same* number of world units on both axes. Fitting the view
 * to the landscape's own aspect ratio would rescale the anisotropy away, and
 * the anisotropy is the entire subject of the lab.
 */
export function computeView(width: number, height: number, extent: number): View {
  const size = Math.min(width, height);
  return { cx: width / 2, cy: height / 2, scale: size / (2 * extent), extent };
}

export const toScreenX = (v: View, x: number): number => v.cx + x * v.scale;
/** Screen y grows downward; the plane's does not. */
export const toScreenY = (v: View, y: number): number => v.cy - y * v.scale;

export const fromScreen = (v: View, px: number, py: number): Point => ({
  x: (px - v.cx) / v.scale,
  y: (v.cy - py) / v.scale,
});

/** Keeps a wildly diverged point from reaching the canvas as a huge number. */
const CLAMP = 1e5;
const guard = (n: number): number => (Number.isFinite(n) ? Math.max(-CLAMP, Math.min(CLAMP, n)) : 0);

// -------------------------------------------------------------- contours ---

const RINGS = 8;

/**
 * Ring levels, spaced evenly along the *steeper* axis.
 *
 * Picking the steep axis means every ring crosses the visible window, and the
 * flat direction is the one that runs off the edge — which is what a narrow
 * valley genuinely looks like from above.
 */
function ringLevels(l: Landscape, extent: number): number[] {
  const steep = Math.max(l.a, l.b);
  const levels: number[] = [];
  for (let k = 1; k <= RINGS; k++) {
    const r = (extent * k) / RINGS;
    levels.push(0.5 * steep * r * r);
  }
  return levels;
}

function drawContours(ctx: CanvasRenderingContext2D, v: View, l: Landscape): void {
  const c = inks();
  ctx.save();
  ctx.lineWidth = 1;
  const levels = ringLevels(l, v.extent);
  for (let i = 0; i < levels.length; i++) {
    const { rx, ry } = contourSemiAxes(l, levels[i]!);
    ctx.beginPath();
    ctx.ellipse(v.cx, v.cy, rx * v.scale, ry * v.scale, 0, 0, Math.PI * 2);
    // Every other ring a touch stronger, so density reads as steepness even
    // where the rings crowd together.
    ctx.strokeStyle = i % 2 === 1 ? c.contourStrong : c.contour;
    ctx.stroke();
  }
  ctx.restore();
}

function drawAxes(ctx: CanvasRenderingContext2D, v: View, width: number, height: number): void {
  const c = inks();
  ctx.save();
  ctx.strokeStyle = c.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, v.cy);
  ctx.lineTo(width, v.cy);
  ctx.moveTo(v.cx, 0);
  ctx.lineTo(v.cx, height);
  ctx.stroke();
  ctx.restore();
}

// --------------------------------------------------------------- markers ---

function drawMinimum(ctx: CanvasRenderingContext2D, v: View): void {
  const c = inks();
  const r = 7;
  ctx.save();
  ctx.strokeStyle = c.minimum;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(v.cx - r, v.cy - r);
  ctx.lineTo(v.cx + r, v.cy + r);
  ctx.moveTo(v.cx + r, v.cy - r);
  ctx.lineTo(v.cx - r, v.cy + r);
  ctx.stroke();
  ctx.restore();
}

function drawStart(ctx: CanvasRenderingContext2D, v: View, p: Point): void {
  const c = inks();
  ctx.save();
  ctx.strokeStyle = c.start;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(toScreenX(v, guard(p.x)), toScreenY(v, guard(p.y)), 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCurrent(ctx: CanvasRenderingContext2D, v: View, p: Point, warn = false): void {
  const c = inks();
  const x = toScreenX(v, guard(p.x));
  const y = toScreenY(v, guard(p.y));
  ctx.save();
  ctx.fillStyle = warn ? c.warn : c.current;
  ctx.beginPath();
  ctx.arc(x, y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  // A ring around the dot so it stays findable where the path doubles back.
  ctx.strokeStyle = c.minimum;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 8.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** An arrow of fixed pixel length, so the two arrows compare direction only. */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  dx: number,
  dy: number,
  length: number,
  stroke: string,
  dashed: boolean,
): void {
  const norm = Math.hypot(dx, dy);
  if (!Number.isFinite(norm) || norm === 0) return;
  const ux = dx / norm;
  // Screen y is inverted relative to the plane.
  const uy = -dy / norm;
  const tipX = fromX + ux * length;
  const tipY = fromY + uy * length;

  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = stroke;
  ctx.lineWidth = 2;
  ctx.setLineDash(dashed ? [5, 4] : []);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  ctx.setLineDash([]);
  const head = 8;
  const angle = Math.atan2(uy, ux);
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - head * Math.cos(angle - 0.4), tipY - head * Math.sin(angle - 0.4));
  ctx.lineTo(tipX - head * Math.cos(angle + 0.4), tipY - head * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ----------------------------------------------------------------- scene ---

export interface Scene {
  landscape: Landscape;
  extent: number;
  /** Flattened x,y pairs from the engine. */
  path?: Float64Array;
  /** How many of those points to draw — the scrubber's position. */
  pathLength?: number;
  start?: Point;
  current?: Point;
  /** Solid arrow: the descent direction, −∇f. Drawn at a fixed length. */
  descentArrow?: Point;
  /** Dashed arrow: the straight line to the minimum. Same fixed length. */
  targetArrow?: Point;
  /** Paints the current position in the warning colour. */
  diverged?: boolean;
}

export function drawLandscape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: Scene,
): void {
  ctx.clearRect(0, 0, width, height);
  if (width <= 0 || height <= 0) return;

  const v = computeView(width, height, scene.extent);
  const c = inks();

  drawAxes(ctx, v, width, height);
  drawContours(ctx, v, scene.landscape);
  drawMinimum(ctx, v);

  // --- trajectory
  const path = scene.path;
  const count = Math.max(0, Math.min(scene.pathLength ?? 0, path ? path.length / 2 : 0));
  if (path && count > 1) {
    ctx.save();
    ctx.strokeStyle = c.path;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const x = toScreenX(v, guard(path[2 * i]!));
      const y = toScreenY(v, guard(path[2 * i + 1]!));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // A dot per step: the picture stays countable, and a long straight leg is
    // visibly one step rather than an eased glide.
    if (count <= 220) {
      ctx.fillStyle = c.pathNode;
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(
          toScreenX(v, guard(path[2 * i]!)),
          toScreenY(v, guard(path[2 * i + 1]!)),
          2.2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    ctx.restore();
  }

  if (scene.start) drawStart(ctx, v, scene.start);

  if (scene.current) {
    const px = toScreenX(v, guard(scene.current.x));
    const py = toScreenY(v, guard(scene.current.y));
    const length = Math.min(width, height) * 0.22;
    if (scene.targetArrow) {
      drawArrow(ctx, px, py, scene.targetArrow.x, scene.targetArrow.y, length, c.target, true);
    }
    if (scene.descentArrow) {
      drawArrow(ctx, px, py, scene.descentArrow.x, scene.descentArrow.y, length, c.gradient, false);
    }
    drawCurrent(ctx, v, scene.current, scene.diverged);
  }
}

// ----------------------------------------------------------------- chart ---

const CHART_PAD = { top: 10, right: 10, bottom: 10, left: 10 };

/**
 * The objective against step number, on a logarithmic vertical axis.
 *
 * Log, because a converging run crosses several orders of magnitude and a
 * linear axis would show a spike followed by a flat line at zero — which is
 * exactly the part the visitor needs to read.
 */
export function drawObjectiveChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  series: Float64Array,
  count: number,
  tolerance: number,
  cursor: number,
): void {
  ctx.clearRect(0, 0, width, height);
  if (width <= 0 || height <= 0 || count < 1) return;

  const c = inks();
  const plotW = width - CHART_PAD.left - CHART_PAD.right;
  const plotH = height - CHART_PAD.top - CHART_PAD.bottom;

  const floor = Math.max(tolerance, 1e-12) / 100;
  let hi = floor;
  for (let i = 0; i < count; i++) {
    const value = series[i]!;
    if (Number.isFinite(value) && value > hi) hi = value;
  }
  const loLog = Math.log10(floor);
  const hiLog = Math.log10(Math.max(hi, floor * 10));
  const span = hiLog - loLog || 1;

  const xAt = (i: number) => CHART_PAD.left + (count <= 1 ? 0 : (i / (count - 1)) * plotW);
  const yAt = (value: number) => {
    const v = Number.isFinite(value) ? Math.max(value, floor) : hi;
    return CHART_PAD.top + plotH - ((Math.log10(v) - loLog) / span) * plotH;
  };

  // Tolerance line — the goal, drawn dashed so it is not mistaken for data.
  if (tolerance > 0 && Math.log10(tolerance) >= loLog && Math.log10(tolerance) <= hiLog) {
    ctx.save();
    ctx.strokeStyle = c.chartTolerance;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    const y = yAt(tolerance);
    ctx.beginPath();
    ctx.moveTo(CHART_PAD.left, y);
    ctx.lineTo(CHART_PAD.left + plotW, y);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.strokeStyle = c.chartLine;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const x = xAt(i);
    const y = yAt(series[i]!);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Where the scrubber is sitting.
  if (cursor >= 0 && cursor < count) {
    ctx.save();
    ctx.strokeStyle = c.chartCursor;
    ctx.lineWidth = 1;
    const x = xAt(cursor);
    ctx.beginPath();
    ctx.moveTo(x, CHART_PAD.top);
    ctx.lineTo(x, CHART_PAD.top + plotH);
    ctx.stroke();
    ctx.fillStyle = c.chartLine;
    ctx.beginPath();
    ctx.arc(x, yAt(series[cursor]!), 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
