/**
 * Grid pathfinding: BFS, Dijkstra and A*, written as one steppable execution.
 *
 * Pure TypeScript — no React, no DOM. The lab animates this engine by calling
 * `step()` repeatedly; there is no precomputed result being replayed. Every
 * frame the visitor watches is the algorithm actually running.
 *
 * ## Edge cost convention
 *
 * Moving into a cell costs that cell's `cost`. The starting cell's own cost is
 * never paid, so a path's cost is the sum of the cells it enters. Dijkstra,
 * A*, the heuristic and `pathCost` all use this one rule.
 *
 * ## What each algorithm minimises
 *
 * - **BFS** minimises the number of moves. It counts steps, not cost, so it
 *   will happily take a short route through expensive ground.
 * - **Dijkstra** minimises accumulated cost.
 * - **A\*** minimises accumulated cost too, but expands in order of
 *   `g + w·h` so it looks toward the goal first.
 *
 * ## Note on `!`
 *
 * Every index below is derived from `cols`/`rows` or from a cursor that is
 * bounded by construction, so all of them are provably in range. The
 * assertions keep the inner loops free of redundant undefined checks — the
 * same convention `labs/neural-playground/engine.ts` uses.
 */

/** Cost to enter a cell. */
export const WALL = 0;
export const NORMAL = 1;
export const MUD = 5;

/** Cell state, for rendering. */
export const UNSEEN = 0;
export const FRONTIER = 1;
export const CLOSED = 2;
export const PATH = 3;

export interface Grid {
  readonly cols: number;
  readonly rows: number;
  /** Cost to ENTER each cell; `WALL` (0) means impassable. Never written by the engine. */
  cost: Uint8Array;
  start: number;
  goal: number;
}

export type Algorithm = "bfs" | "dijkstra" | "astar";

/**
 * How far to trust the heuristic. Only A* uses it.
 *
 * - `0` — the guess is ignored, so `f = g`. This is exactly Dijkstra.
 * - `1` — standard A*. Manhattan is admissible here, so the path is optimal.
 * - `2` — weighted A*. Expands far fewer cells, but **the optimality
 *   guarantee is gone**: the path it returns can cost up to twice the optimal
 *   cost. It is a different trade-off, not a better A*.
 */
export type HeuristicWeight = 0 | 1 | 2;

export type SearchStatus = "running" | "solved" | "unreachable";

/** One observable move of the algorithm. Exactly one is produced per `step()`. */
export type StepKind = "dequeue" | "discover" | "relax" | "solved" | "unreachable";

const PHASE_EXPAND = 0;
const PHASE_SCAN = 1;

export interface Search {
  readonly grid: Grid;
  readonly algorithm: Algorithm;
  /** Forced to 0 for BFS and Dijkstra. */
  readonly weight: HeuristicWeight;

  /** Per-cell state for rendering: UNSEEN / FRONTIER / CLOSED / PATH. */
  readonly state: Uint8Array;
  /** g — moves from start for BFS, accumulated cost otherwise. −1 = not reached. */
  readonly dist: Int32Array;
  /** Who reached this cell first (or most cheaply). −1 = no parent. */
  readonly parent: Int32Array;

  status: SearchStatus;
  /** The cell the last event was about; −1 for "unreachable". */
  node: number;
  /** For discover/relax, the cell it was reached from; −1 otherwise. */
  from: number;
  /** The cell currently being expanded; −1 before the first dequeue. */
  current: number;

  /** Cells taken off the frontier and settled. The honest measure of work. */
  explored: number;
  /** Cells on the frontier right now. */
  frontierSize: number;
  /** `step()` calls so far. */
  steps: number;

  /** start → goal, valid for indices 0…pathLength once solved. */
  readonly path: Int32Array;
  /** Number of moves. 0 when start === goal. */
  pathLength: number;
  /** Sum of the cost of every cell entered. */
  pathCost: number;

  // --- internal execution state; not part of the public contract ---
  phase: number;
  cursor: number;
  queue: Int32Array;
  head: number;
  tail: number;
  heapNode: Int32Array;
  heapKey: Int32Array;
  heapH: Int32Array;
  heapSize: number;
}

// ---------------------------------------------------------------- grid ----

export function createGrid(cols: number, rows: number, start: number, goal: number): Grid {
  const cost = new Uint8Array(cols * rows);
  cost.fill(NORMAL);
  return { cols, rows, cost, start, goal };
}

const CHAR_COST: Record<string, number> = {
  "#": WALL,
  ".": NORMAL,
  "~": MUD,
  S: NORMAL,
  G: NORMAL,
};

/**
 * Build a grid from an ASCII drawing — `#` wall, `.` open, `~` mud, `S` start,
 * `G` goal. Used by tests and by the lab's fixture mazes, so a maze can be
 * read in the source exactly as it appears on screen.
 */
export function parseGrid(rows: readonly string[]): Grid {
  const height = rows.length;
  if (height === 0) throw new Error("parseGrid: no rows");
  const width = rows[0]!.length;
  if (width === 0) throw new Error("parseGrid: empty row");

  const cost = new Uint8Array(width * height);
  let start = -1;
  let goal = -1;

  for (let r = 0; r < height; r++) {
    const line = rows[r]!;
    if (line.length !== width) throw new Error(`parseGrid: row ${r} is ragged`);
    for (let c = 0; c < width; c++) {
      const ch = line[c]!;
      const value = CHAR_COST[ch];
      if (value === undefined) throw new Error(`parseGrid: unknown character "${ch}"`);
      const i = r * width + c;
      cost[i] = value;
      if (ch === "S") start = i;
      if (ch === "G") goal = i;
    }
  }

  if (start < 0) throw new Error("parseGrid: no start (S)");
  if (goal < 0) throw new Error("parseGrid: no goal (G)");
  return { cols: width, rows: height, cost, start, goal };
}

export const rowOf = (grid: Grid, index: number): number => (index / grid.cols) | 0;
export const colOf = (grid: Grid, index: number): number => index % grid.cols;

/**
 * Manhattan distance to the goal.
 *
 * On a 4-connected grid every move changes this by exactly 1 and costs at
 * least 1, so it never overestimates the true remaining cost: it is
 * admissible, and also consistent. Both properties would be lost if diagonal
 * movement were allowed, which is why it is not.
 */
export function heuristic(grid: Grid, index: number): number {
  const dr = rowOf(grid, index) - rowOf(grid, grid.goal);
  const dc = colOf(grid, index) - colOf(grid, grid.goal);
  return Math.abs(dr) + Math.abs(dc);
}

// ---------------------------------------------------------------- heap ----

/**
 * Binary min-heap over cell indices. The order is total and therefore fully
 * determined: key first, then the heuristic, then the cell index.
 *
 * The middle term matters more than it looks. Whole regions of a grid share
 * the same `f`, and breaking those ties toward the goal is what makes A* walk
 * a corridor instead of filling the room. Dijkstra keys on `g` alone, so its
 * cost contours are unchanged — only the order it settles cells *within* one
 * contour, which is exactly where a tie-break belongs.
 *
 * Stale entries are left in place and skipped when popped (lazy deletion)
 * rather than using decrease-key.
 */
function heapLess(s: Search, a: number, b: number): boolean {
  const ka = s.heapKey[a]!;
  const kb = s.heapKey[b]!;
  if (ka !== kb) return ka < kb;
  const ha = s.heapH[a]!;
  const hb = s.heapH[b]!;
  if (ha !== hb) return ha < hb;
  return s.heapNode[a]! < s.heapNode[b]!;
}

function heapSwap(s: Search, a: number, b: number): void {
  const node = s.heapNode[a]!;
  const key = s.heapKey[a]!;
  const h = s.heapH[a]!;
  s.heapNode[a] = s.heapNode[b]!;
  s.heapKey[a] = s.heapKey[b]!;
  s.heapH[a] = s.heapH[b]!;
  s.heapNode[b] = node;
  s.heapKey[b] = key;
  s.heapH[b] = h;
}

function heapPush(s: Search, node: number, key: number, h: number): void {
  let i = s.heapSize++;
  s.heapNode[i] = node;
  s.heapKey[i] = key;
  s.heapH[i] = h;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (!heapLess(s, i, parent)) break;
    heapSwap(s, i, parent);
    i = parent;
  }
}

function heapPop(s: Search): number {
  const top = s.heapNode[0]!;
  const last = --s.heapSize;
  s.heapNode[0] = s.heapNode[last]!;
  s.heapKey[0] = s.heapKey[last]!;
  s.heapH[0] = s.heapH[last]!;
  let i = 0;
  for (;;) {
    const left = i * 2 + 1;
    const right = left + 1;
    let smallest = i;
    if (left < s.heapSize && heapLess(s, left, smallest)) smallest = left;
    if (right < s.heapSize && heapLess(s, right, smallest)) smallest = right;
    if (smallest === i) break;
    heapSwap(s, i, smallest);
    i = smallest;
  }
  return top;
}

// ------------------------------------------------------------- frontier ----

/** BFS uses a real FIFO queue — its guarantee comes from that, not from a heap. */
const frontierEmpty = (s: Search): boolean =>
  s.algorithm === "bfs" ? s.head === s.tail : s.heapSize === 0;

function frontierPush(s: Search, node: number, g: number): void {
  if (s.algorithm === "bfs") {
    s.queue[s.tail++] = node;
    return;
  }
  const h = heuristic(s.grid, node);
  heapPush(s, node, g + s.weight * h, h);
}

const frontierPop = (s: Search): number =>
  s.algorithm === "bfs" ? s.queue[s.head++]! : heapPop(s);

// -------------------------------------------------------------- search ----

export function createSearch(
  grid: Grid,
  algorithm: Algorithm,
  weight: HeuristicWeight = 1,
): Search {
  const cells = grid.cols * grid.rows;
  const search: Search = {
    grid,
    algorithm,
    weight: algorithm === "astar" ? weight : 0,

    state: new Uint8Array(cells),
    dist: new Int32Array(cells).fill(-1),
    parent: new Int32Array(cells).fill(-1),

    status: "running",
    node: -1,
    from: -1,
    current: -1,

    explored: 0,
    frontierSize: 0,
    steps: 0,

    path: new Int32Array(cells),
    pathLength: 0,
    pathCost: 0,

    phase: PHASE_EXPAND,
    cursor: 0,
    // Each cell is queued at most once in BFS. The heap can hold one entry per
    // relaxation, and a cell is relaxed at most once per incoming edge.
    queue: new Int32Array(algorithm === "bfs" ? cells : 0),
    head: 0,
    tail: 0,
    heapNode: new Int32Array(algorithm === "bfs" ? 0 : cells * 4 + 2),
    heapKey: new Int32Array(algorithm === "bfs" ? 0 : cells * 4 + 2),
    heapH: new Int32Array(algorithm === "bfs" ? 0 : cells * 4 + 2),
    heapSize: 0,
  };

  search.dist[grid.start] = 0;
  search.state[grid.start] = FRONTIER;
  search.frontierSize = 1;
  frontierPush(search, grid.start, 0);
  return search;
}

/**
 * Scan the neighbours of the cell being expanded, in a fixed order — up,
 * right, down, left — stopping at the first one that produces an observable
 * event. Returns null once the cell has no neighbours left to look at.
 */
function scanNext(s: Search): StepKind | null {
  const grid = s.grid;
  const cur = s.current;
  const r = rowOf(grid, cur);
  const c = colOf(grid, cur);
  const gCur = s.dist[cur]!;

  while (s.cursor < 4) {
    const direction = s.cursor++;
    let nr = r;
    let nc = c;
    switch (direction) {
      case 0:
        nr = r - 1; // up
        break;
      case 1:
        nc = c + 1; // right
        break;
      case 2:
        nr = r + 1; // down
        break;
      default:
        nc = c - 1; // left
        break;
    }
    if (nr < 0 || nr >= grid.rows || nc < 0 || nc >= grid.cols) continue;

    const next = nr * grid.cols + nc;
    const enter = grid.cost[next]!;
    if (enter === WALL) continue;
    // A settled cell is never reopened. With a consistent heuristic that costs
    // nothing; with w = 2 it is part of why the answer may be suboptimal.
    if (s.state[next] === CLOSED) continue;

    // BFS counts moves; the others accumulate the cost of entering.
    const g = gCur + (s.algorithm === "bfs" ? 1 : enter);
    const known = s.dist[next]!;

    if (known === -1) {
      s.dist[next] = g;
      s.parent[next] = cur;
      s.state[next] = FRONTIER;
      s.frontierSize++;
      frontierPush(s, next, g);
      s.node = next;
      s.from = cur;
      return "discover";
    }

    if (g < known) {
      // A cheaper way in.
      //
      // Neither BFS nor Dijkstra ever reaches this branch. BFS settles cells
      // in move order and Dijkstra in cost order, and because every edge into
      // a cell costs the same — the cell's own cost — whichever settled
      // neighbour finds it first has already found it most cheaply.
      //
      // A* does reach it: it settles in f order, not g order, so a cell can be
      // found by a neighbour with a small f but a large g and improved later.
      s.dist[next] = g;
      s.parent[next] = cur;
      frontierPush(s, next, g);
      s.node = next;
      s.from = cur;
      return "relax";
    }
  }
  return null;
}

/** Settle the next cell on the frontier. */
function expandNext(s: Search): StepKind {
  for (;;) {
    if (frontierEmpty(s)) {
      s.status = "unreachable";
      s.node = -1;
      s.from = -1;
      s.current = -1;
      return "unreachable";
    }

    const next = frontierPop(s);
    // A stale heap entry, left behind by a relaxation. Dropping it is
    // bookkeeping, not a move the algorithm makes, so it produces no event.
    if (s.state[next] === CLOSED) continue;

    s.state[next] = CLOSED;
    s.frontierSize--;
    s.explored++;
    s.current = next;
    s.node = next;
    s.from = s.parent[next]!;

    if (next === s.grid.goal) {
      s.status = "solved";
      reconstructPath(s);
      return "solved";
    }

    s.cursor = 0;
    s.phase = PHASE_SCAN;
    return "dequeue";
  }
}

/**
 * Advance the search by exactly one observable move.
 *
 * A dequeue and each of the neighbours it discovers are separate steps, so the
 * caller sees the real order in which the algorithm does things rather than a
 * summary of it. Calling `step()` on a finished search is a no-op that repeats
 * the terminal event.
 */
export function step(s: Search): StepKind {
  if (s.status !== "running") return s.status;
  s.steps++;

  if (s.phase === PHASE_SCAN) {
    const event = scanNext(s);
    if (event !== null) return event;
    s.phase = PHASE_EXPAND;
  }
  return expandNext(s);
}

/**
 * Walk the parent chain back from the goal.
 *
 * Called automatically when a search solves; exported because the path is a
 * separate idea from the search and is worth being able to rebuild on its own.
 */
export function reconstructPath(s: Search): void {
  s.pathLength = 0;
  s.pathCost = 0;
  if (s.status !== "solved") return;

  let count = 0;
  for (let n = s.grid.goal; n !== -1; n = s.parent[n]!) {
    s.path[count++] = n;
  }
  for (let i = 0, j = count - 1; i < j; i++, j--) {
    const tmp = s.path[i]!;
    s.path[i] = s.path[j]!;
    s.path[j] = tmp;
  }

  let cost = 0;
  for (let i = 1; i < count; i++) {
    cost += s.grid.cost[s.path[i]!]!;
    s.state[s.path[i]!] = PATH;
  }
  s.state[s.path[0]!] = PATH;

  s.pathLength = count - 1;
  s.pathCost = cost;
}

/**
 * Run to completion. Exactly equivalent to calling `step()` until it stops
 * running — used for the reduced-motion path and for measuring fixtures.
 */
export function runToEnd(s: Search): void {
  while (s.status === "running") step(s);
}

export interface SearchResult {
  status: SearchStatus;
  explored: number;
  pathLength: number;
  pathCost: number;
  steps: number;
}

/** Run a search and report only its measurements. */
export function solve(grid: Grid, algorithm: Algorithm, weight: HeuristicWeight = 1): SearchResult {
  const s = createSearch(grid, algorithm, weight);
  runToEnd(s);
  return {
    status: s.status,
    explored: s.explored,
    pathLength: s.pathLength,
    pathCost: s.pathCost,
    steps: s.steps,
  };
}
