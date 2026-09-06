/**
 * The room the robot lives in.
 *
 * Pure data and pure functions — no React, no DOM, no randomness, no library.
 * This file is the *environment*: it says what the world is and what happens
 * when you move in it. It knows nothing about learning.
 *
 * ## The one property the whole lab rests on
 *
 * The marked tile `TILE` sits on the shortest route from `START` to `GOAL`,
 * and there is a bypass around it that is **exactly two steps longer**. Those
 * two facts are what make three distinct behaviours possible from a single
 * number:
 *
 *   - a large enough penalty on the tile makes the long way around worth it;
 *   - a small reward or penalty is not worth a detour either way;
 *   - a large enough reward makes standing on it forever beat leaving at all.
 *
 * Two steps, not one, because a 4-connected grid flips the parity of
 * `row + col` on every move: any two routes between the same pair of cells
 * differ by an *even* number of steps. A bypass costing one extra step cannot
 * exist here, and a bypass costing zero would make the tile free to visit,
 * which would erase the middle behaviour entirely. The layout below was chosen
 * by measuring `d(START→GOAL)` against `d(START→GOAL)` with the tile removed
 * until the gap came out at exactly 2; `engine.test.ts` re-checks it.
 *
 * ## Markov
 *
 * The state is the robot's position and nothing else. That is not a
 * simplification we are getting away with — it is exact. The reward of a move
 * is `R(s, a, s')`, a function of the transition alone: the tile pays out every
 * single time it is entered, so nothing about the past can change what a move
 * is worth. Had the tile paid only once, "have I collected it yet" would have
 * had to become part of the state, and the farming behaviour would have been
 * impossible.
 */

export const ROWS = 6;
export const COLS = 6;
export const CELL_COUNT = ROWS * COLS;

export const rowOf = (index: number): number => Math.floor(index / COLS);
export const colOf = (index: number): number => index % COLS;
export const indexOf = (row: number, col: number): number => row * COLS + col;

/** Top-right. */
export const START = indexOf(0, 5);
/** Bottom-left. Terminal: an episode ends the moment it is entered. */
export const GOAL = indexOf(5, 0);
/** The marked tile, on the shortest route. Renewable — it pays on every entry. */
export const TILE = indexOf(4, 2);

/**
 * Impassable cells.
 *
 *     . . . . . S
 *     . . . . . .
 *     . . . # . .
 *     # # . . # #
 *     # # T . # #
 *     G . . . . .
 *
 * Nine of them, leaving 27 reachable cells. The pocket at (3,3) and (4,3) is
 * the bypass: reaching (5,3) from (3,2) through it costs two steps more than
 * going straight down through the tile.
 */
export const WALLS: readonly number[] = [
  indexOf(2, 3),
  indexOf(3, 0),
  indexOf(3, 1),
  indexOf(3, 4),
  indexOf(3, 5),
  indexOf(4, 0),
  indexOf(4, 1),
  indexOf(4, 4),
  indexOf(4, 5),
];

const WALL_SET = new Set(WALLS);
export const isWall = (index: number): boolean => WALL_SET.has(index);

/** Every cell a robot can stand in, ascending. */
export const FREE_CELLS: readonly number[] = Array.from(
  { length: CELL_COUNT },
  (_, i) => i,
).filter((i) => !isWall(i));

// ---------------------------------------------------------------- actions ---

export const UP = 0;
export const DOWN = 1;
export const LEFT = 2;
export const RIGHT = 3;
export const ACTION_COUNT = 4;

export type Action = 0 | 1 | 2 | 3;
export const ACTIONS: readonly Action[] = [UP, DOWN, LEFT, RIGHT];

/** Row/column offset per action, indexed by the action itself. */
const DELTA: readonly (readonly [number, number])[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/**
 * Where a move lands.
 *
 * Walking into a wall or off the edge leaves the robot where it was — and it
 * still pays for the move, because a wasted step is a wasted step. There is no
 * extra penalty for bumping: adding one would be a second lever on behaviour
 * that nobody asked for.
 */
export function nextState(state: number, action: Action): number {
  // DELTA is indexed by an Action, which is 0..3 by its type, so this is
  // provably in range.
  const [dr, dc] = DELTA[action]!;
  const row = rowOf(state) + dr;
  const col = colOf(state) + dc;
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return state;
  const target = indexOf(row, col);
  return isWall(target) ? state : target;
}

// ---------------------------------------------------------------- rewards ---

/** Paid on every move, including one that bumps a wall. */
export const STEP_REWARD = -0.5;
/** Paid once, on entering the goal, which also ends the episode. */
export const GOAL_REWARD = 20;

/** The range the tile's value is allowed to take. The lab's only lever. */
export const TILE_REWARD_MIN = -5;
export const TILE_REWARD_MAX = 5;

/**
 * `R(s, a, s')` — the reward for one transition, and nothing else.
 *
 * Nothing here depends on how the robot got to `from` or on what it did
 * earlier, which is precisely the property that keeps position a sufficient
 * state.
 *
 * The tile pays for **arriving**, so a robot already standing on it that walks
 * into a wall collects nothing — it just loses the step. Without that clause
 * the tile would pay for every bump, and a robot could farm it by vibrating on
 * the spot: a one-step cycle rather than the two-step one the design is built
 * on. It was measured doing exactly that before this was fixed. Requiring a
 * real move keeps "entering" meaning what the word says, and makes farming
 * look like pacing rather than a stuck animation.
 */
export function reward(from: number, next: number, tileReward: number): number {
  let total = STEP_REWARD;
  if (next === TILE && next !== from) total += tileReward;
  if (next === GOAL) total += GOAL_REWARD;
  return total;
}

export const isTerminal = (state: number): boolean => state === GOAL;

/**
 * How long an episode may run before it is cut off.
 *
 * Truncation is **not** termination: a run that is still going when the limit
 * arrives has not reached anything, so its last update must still bootstrap
 * from the next state. Treating the cut-off as terminal would teach the robot
 * that the world ends after sixty steps, which it does not.
 */
export const MAX_EPISODE_STEPS = 60;

// --------------------------------------------------------------- geometry ---

/**
 * Breadth-first step count from `origin` to every cell, ignoring rewards.
 *
 * `blocked` optionally removes one cell from the world, which is how the
 * two-step bypass property is checked. Unreachable cells come back as -1.
 */
export function distancesFrom(origin: number, blocked = -1): Int32Array {
  const dist = new Int32Array(CELL_COUNT).fill(-1);
  if (isWall(origin) || origin === blocked) return dist;
  dist[origin] = 0;
  const queue: number[] = [origin];
  for (let head = 0; head < queue.length; head++) {
    // `head` is bounded by `queue.length`, so this is provably in range.
    const cell = queue[head]!;
    for (const action of ACTIONS) {
      const next = nextState(cell, action);
      if (next === cell || next === blocked) continue;
      if (dist[next] === -1) {
        dist[next] = dist[cell]! + 1;
        queue.push(next);
      }
    }
  }
  return dist;
}
