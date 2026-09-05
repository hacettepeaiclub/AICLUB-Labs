/**
 * Canvas drawing for the grid.
 *
 * Everything on screen is read straight out of the engine's arrays — the
 * renderer keeps no state of its own, so it cannot drift from the search it
 * claims to be showing.
 *
 * Nothing is distinguished by colour alone. Walls are solid blocks with a lip,
 * mud is hatched, the frontier is an open ring, settled cells are filled, the
 * path carries a bead down its middle, and start and goal are lettered.
 * Colours come from `design/tokens`.
 */

import { color, paletteVersion } from "@/design/tokens";
import { CLOSED, FRONTIER, MUD, PATH, WALL, type Grid, type Search } from "./engine";

interface Ink {
  surface: string;
  gridLine: string;
  wallFill: string;
  wallTint: string;
  wallEdge: string;
  wallLip: string;
  mudFill: string;
  mudHatch: string;
  frontierRing: string;
  closedFill: string;
  pathFill: string;
  pathBead: string;
  currentRing: string;
  marker: string;
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
    surface: color("ink800"),
    gridLine: color("ink950", 0.55),
    wallFill: color("ink700"),
    wallTint: color("fgMuted", 0.4),
    wallEdge: color("fgMuted", 0.55),
    wallLip: color("fgMuted", 0.5),
    mudFill: color("signalAmber", 0.16),
    mudHatch: color("signalAmber", 0.55),
    frontierRing: color("signalCyan", 0.95),
    closedFill: color("signalCyan", 0.2),
    pathFill: color("accent", 0.85),
    pathBead: color("fg"),
    currentRing: color("fg", 0.9),
    marker: color("fg"),
    cursor: color("fg", 0.95),
  };
  return ink;
}

// A wall is terrain, so it has to sit above the search's "visited" shading and
// well below its answer. Measured against the ink-800 ground: settled cells are
// 1.52:1, the path is 3.38:1, and this tint lands the wall at 2.34:1 — clearly
// a block, never competing with the result. It was 1.39:1, which read as a
// smudge on a grid nobody had run yet.

export interface DrawOptions {
  /** Keyboard cursor, or −1 when the visitor is using a pointer. */
  cursor: number;
  /** Dim everything slightly while the grid is locked during a run. */
  locked: boolean;
}

/** Cell geometry for the current canvas size. Recomputed per draw; no state. */
export interface Layout {
  cell: number;
  offsetX: number;
  offsetY: number;
}

export function layoutFor(grid: Grid, width: number, height: number): Layout {
  const cell = Math.floor(Math.min(width / grid.cols, height / grid.rows));
  return {
    cell,
    offsetX: Math.floor((width - cell * grid.cols) / 2),
    offsetY: Math.floor((height - cell * grid.rows) / 2),
  };
}

/** Canvas point → cell index, or −1 outside the grid. */
export function cellAt(grid: Grid, layout: Layout, x: number, y: number): number {
  if (layout.cell <= 0) return -1;
  const col = Math.floor((x - layout.offsetX) / layout.cell);
  const row = Math.floor((y - layout.offsetY) / layout.cell);
  if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return -1;
  return row * grid.cols + col;
}

function hatch(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const C = inks();
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.clip();
  ctx.strokeStyle = C.mudHatch;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let d = -size; d < size * 2; d += 5) {
    ctx.moveTo(x + d, y);
    ctx.lineTo(x + d + size, y + size);
  }
  ctx.stroke();
  ctx.restore();
}

function glyph(
  ctx: CanvasRenderingContext2D,
  letter: string,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = inks().marker;
  ctx.font = `700 ${Math.round(size * 0.62)}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x + size / 2, y + size / 2 + 0.5);
}

/**
 * Paint the whole grid. Called once per frame while a search runs, and once
 * per edit otherwise — never on a timer when nothing has changed.
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  grid: Grid,
  search: Search | null,
  options: DrawOptions,
): void {
  const C = inks();
  const { cell, offsetX, offsetY } = layoutFor(grid, width, height);
  ctx.clearRect(0, 0, width, height);
  if (cell <= 0) return;

  ctx.globalAlpha = options.locked ? 0.92 : 1;
  const inset = cell > 20 ? 1 : 0.5;

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const index = row * grid.cols + col;
      const x = offsetX + col * cell;
      const y = offsetY + row * cell;
      const cost = grid.cost[index] ?? WALL;
      const state = search ? (search.state[index] ?? 0) : 0;

      // Ground first, then whatever the search has made of it.
      if (cost === WALL) {
        // A wall has to read as a solid block on ground the search has not
        // touched yet — that is the moment the visitor has just drawn it.
        // Fill, tint, lip and edge together give it shape as well as tone.
        ctx.fillStyle = C.wallFill;
        ctx.fillRect(x, y, cell, cell);
        ctx.fillStyle = C.wallTint;
        ctx.fillRect(x, y, cell, cell);
        ctx.fillStyle = C.wallLip;
        ctx.fillRect(x, y, cell, Math.max(1, cell * 0.16));
        ctx.strokeStyle = C.wallEdge;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
      } else {
        ctx.fillStyle = C.surface;
        ctx.fillRect(x, y, cell, cell);

        if (state === CLOSED || state === PATH) {
          ctx.fillStyle = C.closedFill;
          ctx.fillRect(x, y, cell, cell);
        }
        if (cost === MUD) {
          ctx.fillStyle = C.mudFill;
          ctx.fillRect(x, y, cell, cell);
          hatch(ctx, x, y, cell);
        }
        if (state === FRONTIER) {
          ctx.strokeStyle = C.frontierRing;
          ctx.lineWidth = Math.max(1.5, cell * 0.1);
          ctx.strokeRect(x + inset + 1, y + inset + 1, cell - 2 * inset - 2, cell - 2 * inset - 2);
        }
        if (state === PATH) {
          ctx.fillStyle = C.pathFill;
          ctx.fillRect(x + inset, y + inset, cell - 2 * inset, cell - 2 * inset);
          ctx.beginPath();
          ctx.arc(x + cell / 2, y + cell / 2, Math.max(1.5, cell * 0.13), 0, Math.PI * 2);
          ctx.fillStyle = C.pathBead;
          ctx.fill();
        }
      }

      ctx.strokeStyle = C.gridLine;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
    }
  }

  ctx.globalAlpha = 1;

  // The cell being expanded right now.
  if (search && search.current >= 0 && search.status === "running") {
    const row = (search.current / grid.cols) | 0;
    const col = search.current % grid.cols;
    ctx.strokeStyle = C.currentRing;
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX + col * cell + 1, offsetY + row * cell + 1, cell - 2, cell - 2);
  }

  for (const [index, letter] of [
    [grid.start, "S"],
    [grid.goal, "G"],
  ] as const) {
    const row = (index / grid.cols) | 0;
    const col = index % grid.cols;
    glyph(ctx, letter, offsetX + col * cell, offsetY + row * cell, cell);
  }

  if (options.cursor >= 0) {
    const row = (options.cursor / grid.cols) | 0;
    const col = options.cursor % grid.cols;
    ctx.strokeStyle = C.cursor;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(offsetX + col * cell + 1, offsetY + row * cell + 1, cell - 2, cell - 2);
    ctx.setLineDash([]);
  }
}
