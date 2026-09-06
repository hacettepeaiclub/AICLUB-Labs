/**
 * Presentation logic for the room and the value map — pure, and deliberately
 * outside the components.
 *
 * Every number the lab shows is derived here from what the engine produced.
 * No component computes a value, a step count or an arrow, and no component
 * contains one: `lab.test.ts` reads the component sources and fails if a
 * measured result ever appears as a literal. That is the structural guard
 * against the failure this lab is most exposed to — a developer pasting in the
 * behaviour that looked good instead of rendering the behaviour that happened.
 */

import {
  ACTIONS,
  COLS,
  DOWN,
  GOAL,
  LEFT,
  RIGHT,
  ROWS,
  START,
  TILE,
  TILE_REWARD_MAX,
  TILE_REWARD_MIN,
  UP,
  colOf,
  isWall,
  rowOf,
  type Action,
} from "./world";
import { bestValue, greedyAction, qAt, rolloutGreedy, type Rollout, type Snapshot } from "./engine";

// ----------------------------------------------------------------- slider ---

/**
 * The reward slider is an integer track mapped to tenths.
 *
 * A native range input with a 0.1 step accumulates floating-point noise as it
 * moves; stepping in whole numbers and dividing keeps every position exact, so
 * the same slider position always retrains to the same table.
 */
export const REWARD_SCALE = 10;
export const SLIDER_MIN = TILE_REWARD_MIN * REWARD_SCALE;
export const SLIDER_MAX = TILE_REWARD_MAX * REWARD_SCALE;

/** Where the lab opens: the robot walks around the tile to get to the door. */
export const DEFAULT_SLIDER = -30;

export const sliderToReward = (value: number): number => value / REWARD_SCALE;
export const rewardToSlider = (reward: number): number => Math.round(reward * REWARD_SCALE);

// ------------------------------------------------------------------- room ---

export type CellKind = "wall" | "floor" | "tile" | "goal" | "start";

export interface RoomCell {
  readonly index: number;
  readonly row: number;
  readonly col: number;
  readonly kind: CellKind;
  /** How many times the walked route entered this cell. */
  readonly visits: number;
}

export function cellKind(index: number): CellKind {
  if (isWall(index)) return "wall";
  if (index === GOAL) return "goal";
  if (index === TILE) return "tile";
  if (index === START) return "start";
  return "floor";
}

/** Every cell of the room, with how often the current route touched it. */
export function roomCells(path: readonly number[]): RoomCell[] {
  const visits = new Map<number, number>();
  for (let i = 1; i < path.length; i++) {
    const cell = path[i]!;
    visits.set(cell, (visits.get(cell) ?? 0) + 1);
  }
  return Array.from({ length: ROWS * COLS }, (_, index) => ({
    index,
    row: rowOf(index),
    col: colOf(index),
    kind: cellKind(index),
    visits: visits.get(index) ?? 0,
  }));
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * The route as points in a 6×6 coordinate space.
 *
 * The overlay uses `viewBox="0 0 6 6"`, so a cell centre is simply
 * `(col + 0.5, row + 0.5)` and the drawing needs no measurement of the DOM at
 * all — no `ResizeObserver`, no layout read, and it stays exact at any size.
 */
export const pathPoints = (path: readonly number[]): Point[] =>
  path.map((cell) => ({ x: colOf(cell) + 0.5, y: rowOf(cell) + 0.5 }));

/** Which of the three things the robot ended up doing. Named in plain copy. */
export type Behaviour = "avoided" | "passed" | "stayed";

export function behaviourOf(rollout: Rollout): Behaviour {
  if (!rollout.reachedGoal) return "stayed";
  return rollout.tileVisits > 0 ? "passed" : "avoided";
}

// -------------------------------------------------------------- value map ---

export interface ValueCell {
  readonly index: number;
  readonly row: number;
  readonly col: number;
  readonly kind: CellKind;
  /** `max_a Q(s,a)` at the chosen checkpoint. */
  readonly value: number;
  /** The action the robot would take here, or `null` at the door. */
  readonly action: Action | null;
  /** 0…1 against the largest magnitude on the board, for tinting only. */
  readonly intensity: number;
  readonly positive: boolean;
}

/**
 * The value map for one checkpoint.
 *
 * Intensity is scaled against the largest magnitude present *at that
 * checkpoint*, so the early episodes — where every value is a small negative
 * number — still read as a picture instead of a blank board. It is a tint
 * only: the number and the arrow carry the information.
 */
export function valueCells(q: ArrayLike<number>): ValueCell[] {
  const raw = Array.from({ length: ROWS * COLS }, (_, index) =>
    isWall(index) || index === GOAL ? 0 : bestValue(q, index),
  );
  let largest = 0;
  for (const value of raw) largest = Math.max(largest, Math.abs(value));

  return raw.map((value, index) => ({
    index,
    row: rowOf(index),
    col: colOf(index),
    kind: cellKind(index),
    value,
    action: isWall(index) || index === GOAL ? null : greedyAction(q, index),
    intensity: largest > 0 ? Math.min(1, Math.abs(value) / largest) : 0,
    positive: value > 0,
  }));
}

/** The four action values of one cell, in reading order, best flagged. */
export interface ActionValue {
  readonly action: Action;
  readonly value: number;
  readonly best: boolean;
}

export function cellActions(q: ArrayLike<number>, cell: number): ActionValue[] {
  const best = greedyAction(q, cell);
  return ACTIONS.map((action) => ({ action, value: qAt(q, cell, action), best: action === best }));
}

/** Arrow glyphs, so direction never depends on colour or on reading a number. */
export const ARROWS: Readonly<Record<Action, string>> = {
  [UP]: "↑",
  [DOWN]: "↓",
  [LEFT]: "←",
  [RIGHT]: "→",
};

// ------------------------------------------------------------- checkpoints ---

/** The episode a scrubber position refers to. */
export const episodeAt = (snapshots: readonly Snapshot[], index: number): number =>
  snapshots[Math.max(0, Math.min(index, snapshots.length - 1))]?.episode ?? 0;

/**
 * Whether the checkpoints really are denser early on.
 *
 * The engine's schedule is non-linear on purpose — in this world the whole of
 * the interesting learning is over within about forty episodes — and the UI
 * depends on that being true, so it is worth being able to check rather than
 * assume.
 */
export function checkpointsAreFrontLoaded(snapshots: readonly Snapshot[]): boolean {
  if (snapshots.length < 4) return false;
  const last = snapshots[snapshots.length - 1]!.episode;
  const half = snapshots[Math.floor(snapshots.length / 2)]!.episode;
  return half < last / 2;
}

// --------------------------------------------------------------- keyboard ---

const stepCursor = (cell: number, key: string): number => {
  const row = rowOf(cell);
  const col = colOf(cell);
  switch (key) {
    case "ArrowUp":
      return row > 0 ? cell - COLS : cell;
    case "ArrowDown":
      return row < ROWS - 1 ? cell + COLS : cell;
    case "ArrowLeft":
      return col > 0 ? cell - 1 : cell;
    case "ArrowRight":
      return col < COLS - 1 ? cell + 1 : cell;
    default:
      return cell;
  }
};

/**
 * Move a 2-D cursor around the grid, keeping going past walls.
 *
 * Walls have nothing to inspect, so landing on one would be a dead end for
 * anyone navigating by keyboard. The cursor carries on in the same direction
 * and stays put only if the whole row or column beyond it is solid.
 */
export function moveCursor(cell: number, key: string): number {
  if (key === "Home" || key === "End") {
    const row = rowOf(cell);
    const order =
      key === "Home"
        ? Array.from({ length: COLS }, (_, i) => row * COLS + i)
        : Array.from({ length: COLS }, (_, i) => row * COLS + (COLS - 1 - i));
    return order.find((candidate) => !isWall(candidate)) ?? cell;
  }

  let next = cell;
  for (let guard = 0; guard < Math.max(ROWS, COLS); guard++) {
    const candidate = stepCursor(next, key);
    if (candidate === next) return cell; // ran into the edge
    next = candidate;
    if (!isWall(next)) return next;
  }
  return cell;
}

export const isGridKey = (key: string): boolean =>
  key === "ArrowUp" ||
  key === "ArrowDown" ||
  key === "ArrowLeft" ||
  key === "ArrowRight" ||
  key === "Home" ||
  key === "End";

/**
 * How many open squares the robot's own route never sets foot on.
 *
 * This is the number the honesty note is about. Q-learning improves where it
 * goes, so once a workable route exists the rest of the room stops being
 * revisited and keeps whatever the robot happened to think early on — it
 * learned a way through, not the place.
 *
 * Deliberately not "squares it never tried at all": with exploration never
 * falling below five percent, every square gets touched eventually, so that
 * count reaches zero by the end of training and would flatly contradict the
 * note sitting beside it.
 */
export function routeBlindSpots(q: ArrayLike<number>): number {
  const walked = new Set(rolloutGreedy(q).path);
  let count = 0;
  for (let index = 0; index < ROWS * COLS; index++) {
    if (isWall(index) || index === GOAL) continue;
    if (!walked.has(index)) count += 1;
  }
  return count;
}
