/**
 * Maps for the lab: procedural presets for the free-play sections, and three
 * hand-drawn mazes for the challenge.
 *
 * Presets are built from the grid size so the same idea works at either of the
 * two layouts. The challenge mazes are fixed drawings at one size, because a
 * budget is only comparable if everyone is solving the same puzzle.
 *
 * Nothing here is random. Reset rebuilds the identical map every time.
 */

import { createGrid, MUD, parseGrid, WALL, type Grid } from "./engine";

export interface GridSize {
  readonly cols: number;
  readonly rows: number;
}

/**
 * Two layouts, picked once when a section mounts and never changed by a
 * resize — reflowing the grid would throw away whatever the visitor drew.
 * Both keep cells at or above `MIN_CELL_PX` on the screens they are used on.
 */
export const WIDE: GridSize = { cols: 31, rows: 21 };
export const NARROW: GridSize = { cols: 19, rows: 13 };

/** Below this a cell is too small to aim at, especially by touch. */
export const MIN_CELL_PX = 16;

/**
 * Page padding and the canvas frame the grid never gets to use. Measured
 * against the shell's `px-6` plus the canvas border, with a little headroom.
 */
const CHROME_ALLOWANCE_PX = 64;

/** The viewport width at which the wide grid still clears `MIN_CELL_PX`. */
export const WIDE_MIN_WIDTH_PX = WIDE.cols * MIN_CELL_PX + CHROME_ALLOWANCE_PX;

export const pickSize = (availableWidth: number): GridSize =>
  availableWidth >= WIDE_MIN_WIDTH_PX ? WIDE : NARROW;

export function cloneGrid(grid: Grid): Grid {
  return {
    cols: grid.cols,
    rows: grid.rows,
    cost: grid.cost.slice(),
    start: grid.start,
    goal: grid.goal,
  };
}

// --------------------------------------------------------------- presets ----

export type PresetId = "simple" | "detour" | "swamp" | "open";

export interface PresetInfo {
  id: PresetId;
  label: string;
}

export const WALL_PRESETS: readonly PresetInfo[] = [
  { id: "simple", label: "Barrier" },
  { id: "detour", label: "Long way round" },
];

const fill = (grid: Grid, r0: number, c0: number, r1: number, c1: number, value: number): void => {
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (r < 0 || r >= grid.rows || c < 0 || c >= grid.cols) continue;
      grid.cost[r * grid.cols + c] = value;
    }
  }
};

/**
 * Every preset puts the start and the goal on the same row, a few cells in
 * from each edge, so the search always has room to spread the "wrong" way —
 * which is the thing section 1 is trying to make visible.
 */
export function buildPreset(id: PresetId, size: GridSize): Grid {
  const { cols, rows } = size;
  const mid = (rows / 2) | 0;
  const grid = createGrid(cols, rows, mid * cols + 3, mid * cols + (cols - 4));
  const midCol = (cols / 2) | 0;

  switch (id) {
    case "open":
      break;

    case "simple": {
      // A short slab straight between the two, open above and below.
      const half = Math.max(2, (rows / 4) | 0);
      fill(grid, mid - half, midCol, mid + half, midCol, WALL);
      break;
    }

    case "detour": {
      // Full height but for one gap at the bottom.
      fill(grid, 0, midCol, rows - 4, midCol, WALL);
      break;
    }

    case "swamp": {
      // A band of expensive ground across the direct route, clear above and
      // below it. Fewest moves and cheapest cost disagree here.
      const band = Math.max(1, (rows / 6) | 0);
      const from = Math.max(4, midCol - ((cols / 5) | 0));
      const to = Math.min(cols - 5, midCol + ((cols / 5) | 0));
      fill(grid, mid - band, from, mid + band, to, MUD);
      break;
    }
  }

  return grid;
}

// ------------------------------------------------------------- challenge ----

/**
 * Three fixed maps, all 19x13, each asking a different question. The budgets
 * are measured from the engine's real behaviour — `mazes.test.ts` re-derives
 * them and fails if the numbers ever drift.
 */
/** The three challenge maps. A union so translations can be keyed by it. */
export type MazeId = "swamp" | "open-ground" | "wrong-door";

export interface ChallengeMaze {
  id: MazeId;
  rows: readonly string[];
  /** Cheapest possible path cost. */
  optimalCost: number;
  /** Cells the visitor is allowed to settle. */
  budget: number;
}

export const CHALLENGES: readonly ChallengeMaze[] = [
  {
    id: "swamp",
    rows: [
      "###################",
      "#..S..............#",
      "#.................#",
      "#.................#",
      "#.................#",
      "#~~~~~~~~..~~~~~~~#",
      "#~~~~~~~~..~~~~~~~#",
      "#~~~~~~~~..~~~~~~~#",
      "#~~~~~~~~..~~~~~~~#",
      "#.................#",
      "#.................#",
      "#..G..............#",
      "###################",
    ],
    optimalCost: 22,
    budget: 70,
  },
  {
    id: "open-ground",
    rows: [
      "###################",
      "#S................#",
      "#.................#",
      "#.......###.......#",
      "#.......###.......#",
      "#.................#",
      "#.................#",
      "#.....###.........#",
      "#.....###.........#",
      "#.................#",
      "#.................#",
      "#................G#",
      "###################",
    ],
    optimalCost: 26,
    budget: 100,
  },
  {
    id: "wrong-door",
    rows: [
      "###################",
      "#S................#",
      "#.................#",
      "#........##########",
      "#........#.......G#",
      "#........#........#",
      "#........#........#",
      "#........#........#",
      "#........#........#",
      "#........#........#",
      "#.................#",
      "#.................#",
      "###################",
    ],
    optimalCost: 31,
    budget: 140,
  },
];

export const challengeGrid = (maze: ChallengeMaze): Grid => parseGrid(maze.rows);
