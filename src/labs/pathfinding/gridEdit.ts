/**
 * The rules for editing a grid by hand.
 *
 * Kept out of the components because they are the part that can be got wrong
 * silently — burying the goal under a wall, or painting off the edge of the
 * map — and because they are the part worth testing.
 */

import { MUD, NORMAL, WALL, type Grid } from "./engine";

export type Tool = "wall" | "mud" | "erase";

export const TOOL_COST: Record<Tool, number> = {
  wall: WALL,
  mud: MUD,
  erase: NORMAL,
};

export const inBounds = (grid: Grid, index: number): boolean =>
  Number.isInteger(index) && index >= 0 && index < grid.cols * grid.rows;

/** Start and goal are markers, not terrain — nothing may be painted over them. */
export const isMarker = (grid: Grid, index: number): boolean =>
  index === grid.start || index === grid.goal;

/**
 * Apply a tool to one cell. Returns whether anything actually changed, so a
 * drag across unchanged cells costs nothing.
 */
export function paintCell(grid: Grid, index: number, tool: Tool): boolean {
  if (!inBounds(grid, index) || isMarker(grid, index)) return false;
  const next = TOOL_COST[tool];
  if (grid.cost[index] === next) return false;
  grid.cost[index] = next;
  return true;
}

/**
 * Which tool a drag should apply, decided by the cell it started on: dragging
 * from a wall erases, dragging from open ground draws. One gesture, no modes,
 * and no way to wipe a maze by accident.
 */
export function dragTool(grid: Grid, index: number, selected: Tool): Tool {
  if (!inBounds(grid, index)) return selected;
  return grid.cost[index] === TOOL_COST[selected] ? "erase" : selected;
}

export type Marker = "start" | "goal";

/**
 * Move the start or the goal. The marker wins over a wall — dropping it on one
 * clears the wall rather than refusing the move — but the two markers can
 * never share a cell.
 */
export function moveMarker(grid: Grid, marker: Marker, index: number): boolean {
  if (!inBounds(grid, index)) return false;
  const other = marker === "start" ? grid.goal : grid.start;
  if (index === other) return false;
  if (grid.cost[index] === WALL) grid.cost[index] = NORMAL;
  if (marker === "start") {
    if (grid.start === index) return false;
    grid.start = index;
  } else {
    if (grid.goal === index) return false;
    grid.goal = index;
  }
  return true;
}

/** Which marker, if any, sits on a cell — for picking one up with a drag. */
export function markerAt(grid: Grid, index: number): Marker | null {
  if (index === grid.start) return "start";
  if (index === grid.goal) return "goal";
  return null;
}

/** Wipe everything the visitor drew, leaving the markers where they are. */
export function clearTerrain(grid: Grid): void {
  grid.cost.fill(NORMAL);
}

export interface GridSummary {
  walls: number;
  mud: number;
}

export function summarise(grid: Grid): GridSummary {
  let walls = 0;
  let mud = 0;
  for (let i = 0; i < grid.cost.length; i++) {
    if (grid.cost[i] === WALL) walls++;
    else if (grid.cost[i] === MUD) mud++;
  }
  return { walls, mud };
}

/** Keys the grid cursor understands. */
export type CursorKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Home" | "End";

export const isCursorKey = (key: string): key is CursorKey =>
  key === "ArrowUp" ||
  key === "ArrowDown" ||
  key === "ArrowLeft" ||
  key === "ArrowRight" ||
  key === "Home" ||
  key === "End";

/**
 * Where the keyboard cursor lands. Stops at the edges rather than wrapping —
 * wrapping across a maze loses your place — and lives here rather than in the
 * component so the movement rules can be tested without a DOM.
 */
export function moveCursor(grid: Grid, from: number, key: CursorKey): number {
  if (!inBounds(grid, from)) return grid.start;
  const cols = grid.cols;
  const row = (from / cols) | 0;
  const col = from % cols;
  switch (key) {
    case "ArrowUp":
      return row > 0 ? from - cols : from;
    case "ArrowDown":
      return row < grid.rows - 1 ? from + cols : from;
    case "ArrowLeft":
      return col > 0 ? from - 1 : from;
    case "ArrowRight":
      return col < cols - 1 ? from + 1 : from;
    case "Home":
      return row * cols;
    case "End":
      return row * cols + cols - 1;
  }
}
