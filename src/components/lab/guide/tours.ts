import type { LabsCopy, LabSlug } from "@/i18n/labs";

/**
 * What each lab's guided tour does, step by step. The words for each step are
 * in the lab's own copy (`tour.steps`), keyed by the same ids, so a step
 * without a sentence, or a sentence without a step, is a type error.
 *
 * ## Where a step points
 *
 * A step names a part of a stage ("the primary control of the first stage"),
 * not a class or an element id, so restyling a lab does not break its tour.
 * `Stage` marks its parts with `data-stage-part`; a selector narrows that down
 * to one control where a part holds several.
 *
 * ## What a step does
 *
 * The ghost cursor does what a visitor would: it clicks a real button, drags a
 * real slider, types into the real field, presses the keys the stage already
 * answers to. Nothing is simulated beside the lab; the tour drives the same
 * engine the visitor will, which is why every tour starts with the lab's own
 * first experiment and leaves the visitor in the middle of it.
 */

export type StagePart = "viewport" | "readout" | "primary" | "figures" | "secondary";

export interface TourTarget {
  /** A part of the toured stage. Left out: the stage as a whole. */
  part?: StagePart;
  /** A selector inside that, to single out one control. */
  select?: string;
  /** Which of the matches, counting from 0; from the end when negative. */
  nth?: number;
  /** Look in the whole lab rather than the stage: a control the lab keeps beside it. */
  inLab?: boolean;
}

export type TourAction =
  /** Point at it and say what it is. */
  | { kind: "point" }
  | { kind: "click" }
  /** Drag a range input to this fraction of its track. */
  | { kind: "slide"; to: number }
  /** Type into a field, after what is there unless `replace`. */
  | { kind: "type"; text: string; replace?: boolean }
  /** Press keys on the target, which the stage already answers to. */
  | { kind: "keys"; keys: readonly string[] };

export interface TourStep<Id extends string = string> {
  id: Id;
  target: TourTarget;
  action?: TourAction;
}

/** The labs whose copy has a tour, and the stages and steps each one's copy names. */
type Toured = {
  [S in LabSlug]: LabsCopy[S] extends { tour: object } ? S : never;
}[LabSlug];
type Stages<S extends Toured> = LabsCopy[S] extends { tour: { stages: infer T } } ? T : never;
type Tours = {
  [S in Toured]: {
    [K in keyof Stages<S>]: readonly TourStep<Extract<keyof Stages<S>[K], string>>[];
  };
};

/**
 * Each lab's tours, one per stage, in the order the stages appear on the
 * page: a stage's tour is the one at its position. `intro` is a tour no stage
 * claims, for a lab that opens with something other than a stage.
 */
export const TOURS: Tours = {
  attention: {
    sentence: [
      { id: "sentence", target: { part: "viewport", select: "[role=listbox]" } },
      {
        id: "pick",
        target: { part: "viewport", select: "[role=option]", nth: 1 },
        action: { kind: "click" },
      },
      { id: "swap", target: { part: "primary" } },
    ],
    compare: [
      { id: "bars", target: { part: "viewport" } },
      {
        id: "pick",
        target: { part: "primary", select: "label", nth: 2 },
        action: { kind: "click" },
      },
      { id: "match", target: { part: "figures" } },
    ],
    scale: [
      { id: "shares", target: { part: "viewport" } },
      {
        id: "divisor",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.0 },
      },
      {
        id: "model",
        target: { part: "primary", select: "button", nth: 1 },
        action: { kind: "click" },
      },
    ],
    softmax: [
      { id: "rows", target: { part: "viewport" } },
      {
        id: "drag",
        target: { part: "viewport", select: "[role=slider]" },
        action: { kind: "keys", keys: ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight"] },
      },
      { id: "reset", target: { part: "primary", select: "button" } },
    ],
    mix: [
      { id: "table", target: { part: "viewport" } },
      {
        id: "pick",
        target: { part: "primary", select: "label", nth: 3 },
        action: { kind: "click" },
      },
      { id: "out", target: { part: "figures" } },
    ],
  },
  backpropagation: {
    pull: [
      {
        id: "pull",
        target: { part: "viewport", select: "[aria-valuemax]" },
        action: { kind: "keys", keys: ["ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp"] },
      },
      { id: "letGo", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "result", target: { part: "figures" } },
    ],
    zoom: [
      { id: "curve", target: { part: "viewport" } },
      {
        id: "zoom",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 1.0 },
      },
      { id: "slope", target: { part: "figures" } },
    ],
    chain: [
      {
        id: "dial",
        target: { part: "viewport", select: "[role=slider]" },
        action: { kind: "keys", keys: ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight"] },
      },
      { id: "links", target: { part: "viewport" } },
      { id: "last", target: { part: "figures" } },
    ],
    ledger: [
      { id: "graph", target: { part: "viewport" } },
      {
        id: "tap",
        target: { part: "viewport", select: "[role=button]", nth: -1 },
        action: { kind: "click" },
      },
      { id: "order", target: { part: "figures" } },
    ],
    cost: [
      { id: "columns", target: { part: "viewport" } },
      {
        id: "width",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.6 },
      },
      { id: "race", target: { part: "primary", select: "button" }, action: { kind: "click" } },
    ],
    depth: [
      { id: "chart", target: { part: "viewport" } },
      {
        id: "add",
        target: { part: "viewport", select: "[role=slider]" },
        action: { kind: "keys", keys: ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight"] },
      },
      { id: "activation", target: { part: "primary" } },
    ],
    challenge: [
      { id: "cases", target: { part: "primary" } },
      { id: "check", target: { part: "viewport", select: "button" }, action: { kind: "click" } },
      { id: "accuse", target: { part: "viewport", select: "[role=group]" } },
    ],
  },
  "cache-locality": {
    race: [
      { id: "lanes", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "ratio", target: { part: "figures" } },
    ],
    line: [
      { id: "grid", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "score", target: { part: "figures" } },
      { id: "options", target: { part: "secondary" } },
    ],
    stride: [
      { id: "chart", target: { part: "viewport" } },
      { id: "measure", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "show", target: { part: "secondary" } },
    ],
    order: [
      { id: "orders", target: { part: "viewport" } },
      { id: "time", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "all", target: { part: "primary", select: "button", nth: 1 } },
    ],
  },
  convolution: {
    slide: [
      { id: "picture", target: { part: "viewport" } },
      { id: "step", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "cell", target: { part: "figures" } },
      {
        id: "fill",
        target: { part: "primary", select: "button", nth: 1 },
        action: { kind: "click" },
      },
    ],
    kernels: [
      { id: "picture", target: { part: "viewport" } },
      {
        id: "preset",
        target: { part: "primary", select: "label", nth: 1 },
        action: { kind: "click" },
      },
      {
        id: "type",
        target: { part: "viewport", select: "input" },
        action: { kind: "type", text: "2", replace: true },
      },
      { id: "sum", target: { part: "figures" } },
    ],
    shift: [
      { id: "shapes", target: { part: "viewport" } },
      {
        id: "move",
        target: { part: "primary", select: "button", nth: 3 },
        action: { kind: "click" },
      },
      { id: "peak", target: { part: "figures" } },
    ],
    size: [
      { id: "grid", target: { part: "viewport" } },
      {
        id: "stride",
        target: { part: "primary", select: "input[type=range]", nth: 3 },
        action: { kind: "slide", to: 1.0 },
      },
      { id: "count", target: { part: "figures" } },
    ],
    depth: [
      { id: "stack", target: { part: "viewport" } },
      {
        id: "layers",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 1.0 },
      },
      { id: "field", target: { part: "figures" } },
    ],
    learn: [
      { id: "panels", target: { part: "viewport" } },
      { id: "train", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "loss", target: { part: "figures" } },
    ],
    challenge: [
      { id: "pick", target: { part: "primary" } },
      {
        id: "type",
        target: { part: "viewport", select: "input" },
        action: { kind: "type", text: "1", replace: true },
      },
      { id: "solved", target: { part: "figures" } },
    ],
  },
  "cryptographic-hashing": {
    digest: [
      {
        id: "type",
        target: { part: "viewport", select: "textarea, input" },
        action: { kind: "type", text: "!" },
      },
      { id: "digest", target: { part: "viewport" } },
      { id: "length", target: { part: "figures" } },
    ],
    determinism: [
      { id: "again", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "runs", target: { part: "viewport" } },
      { id: "distinct", target: { part: "figures" } },
    ],
    avalanche: [
      {
        id: "edit",
        target: { part: "primary", select: "textarea, input" },
        action: { kind: "type", text: "s" },
      },
      { id: "compare", target: { part: "viewport" } },
      { id: "count", target: { part: "figures" } },
    ],
    collision: [
      { id: "fields", target: { part: "viewport" } },
      {
        id: "type",
        target: { part: "viewport", select: "textarea, input", nth: 1 },
        action: { kind: "type", text: "a" },
      },
      { id: "rounds", target: { part: "figures" } },
    ],
  },
  "floating-point": {
    store: [
      {
        id: "type",
        target: { part: "viewport", select: "input" },
        action: { kind: "type", text: "0.1", replace: true },
      },
      { id: "stored", target: { part: "viewport" } },
      { id: "offBy", target: { part: "figures" } },
      { id: "another", target: { part: "primary", select: "button" } },
    ],
    sum: [
      { id: "line", target: { part: "viewport" } },
      {
        id: "type",
        target: { part: "viewport", select: "input", nth: 1 },
        action: { kind: "type", text: "0.4", replace: true },
      },
      { id: "steps", target: { part: "figures" } },
      { id: "reset", target: { part: "primary", select: "button" } },
    ],
    bits: [
      { id: "bits", target: { part: "viewport" } },
      {
        id: "flip",
        target: { part: "viewport", select: "[role=group] button", nth: 1 },
        action: { kind: "click" },
      },
      { id: "value", target: { part: "figures" } },
      { id: "set", target: { part: "primary" } },
    ],
    ruler: [
      { id: "line", target: { part: "viewport" } },
      {
        id: "pick",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.9 },
      },
      { id: "bits", target: { part: "secondary" } },
    ],
    gap: [
      { id: "chart", target: { part: "viewport" } },
      {
        id: "size",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.9 },
      },
      { id: "gap", target: { part: "figures" } },
    ],
    formats: [
      {
        id: "type",
        target: { part: "viewport", select: "input" },
        action: { kind: "type", text: "0.00000002", replace: true },
      },
      { id: "rows", target: { part: "viewport" } },
      { id: "examples", target: { part: "primary" } },
    ],
    challenge: [
      { id: "pick", target: { part: "primary" } },
      { id: "work", target: { part: "viewport" } },
      { id: "solved", target: { part: "figures" } },
    ],
  },
  "gradient-descent": {
    find: [
      { id: "map", target: { part: "viewport" } },
      {
        id: "step",
        target: { part: "secondary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.6 },
      },
      { id: "run", target: { part: "secondary", select: "button" }, action: { kind: "click" } },
      { id: "figures", target: { part: "figures" } },
    ],
    direction: [
      { id: "arrows", target: { part: "viewport" } },
      {
        id: "curvature",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.9 },
      },
      { id: "angle", target: { part: "figures" } },
    ],
    rate: [
      { id: "map", target: { part: "viewport" } },
      {
        id: "rate",
        target: { part: "secondary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.75 },
      },
      { id: "run", target: { part: "secondary", select: "button" }, action: { kind: "click" } },
      { id: "marks", target: { part: "readout" } },
    ],
    golf: [
      { id: "course", target: { part: "viewport" } },
      { id: "start", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      {
        id: "club",
        target: { part: "primary", select: "button", nth: 3 },
        action: { kind: "click" },
      },
      {
        id: "hit",
        target: { part: "primary", select: "button", nth: 6 },
        action: { kind: "click" },
      },
      { id: "score", target: { part: "figures" } },
    ],
    momentum: [
      { id: "map", target: { part: "viewport" } },
      {
        id: "beta",
        target: { part: "primary", select: "[role=slider]" },
        action: {
          kind: "keys",
          keys: ["ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp"],
        },
      },
      { id: "run", target: { part: "secondary", select: "button" }, action: { kind: "click" } },
      { id: "figures", target: { part: "readout" } },
    ],
    adam: [
      { id: "map", target: { part: "viewport" } },
      {
        id: "rate",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.7 },
      },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "steps", target: { part: "figures" } },
    ],
    challenge: [
      { id: "map", target: { part: "viewport" } },
      { id: "settings", target: { part: "secondary" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "status", target: { part: "figures" } },
    ],
  },
  "graph-search": {
    find: [
      { id: "grid", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "explored", target: { part: "figures" } },
      { id: "walls", target: { part: "viewport" } },
    ],
    bfs: [
      { id: "grid", target: { part: "viewport" } },
      {
        id: "step",
        target: { part: "primary", select: "button", nth: 1 },
        action: { kind: "click" },
      },
      { id: "layers", target: { part: "viewport" } },
    ],
    cost: [
      { id: "swamp", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "algorithm", target: { part: "secondary" } },
      { id: "compare", target: { part: "figures" } },
    ],
    astar: [
      { id: "grid", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "algorithm", target: { part: "secondary" } },
      { id: "explored", target: { part: "figures" } },
    ],
    challenge: [
      { id: "maze", target: { part: "viewport" } },
      { id: "algorithm", target: { part: "secondary" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
    ],
  },
  "hash-tables": {
    address: [
      {
        id: "type",
        target: { part: "viewport", select: "input" },
        action: { kind: "type", text: "pizza", replace: true },
      },
      { id: "bucket", target: { part: "viewport", select: "ol" } },
      { id: "put", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "looks", target: { part: "figures" } },
    ],
    birthday: [
      { id: "chart", target: { part: "viewport" } },
      {
        id: "keys",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.35 },
      },
      { id: "throw", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "chance", target: { part: "figures" } },
    ],
    probe: [
      { id: "slots", target: { part: "viewport" } },
      { id: "add", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      {
        id: "four",
        target: { part: "primary", select: "button", nth: 1 },
        action: { kind: "click" },
      },
      { id: "walks", target: { part: "figures" } },
    ],
    compare: [
      { id: "chart", target: { part: "viewport" } },
      {
        id: "load",
        target: { part: "viewport", select: "[role=slider]" },
        action: {
          kind: "keys",
          keys: [
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
          ],
        },
      },
      { id: "costs", target: { part: "figures" } },
    ],
    resize: [
      { id: "bars", target: { part: "viewport" } },
      {
        id: "add",
        target: { part: "viewport", select: "[role=slider]" },
        action: {
          kind: "keys",
          keys: [
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
            "ArrowRight",
          ],
        },
      },
      { id: "average", target: { part: "figures" } },
    ],
    modulus: [
      { id: "buckets", target: { part: "viewport" } },
      {
        id: "step",
        target: { part: "primary", select: "input[type=range]", nth: 1 },
        action: { kind: "slide", to: 0.5 },
      },
      { id: "size", target: { part: "primary", select: "input[type=range]" } },
    ],
    challenge: [
      { id: "pick", target: { part: "primary" } },
      { id: "work", target: { part: "viewport" } },
      { id: "solved", target: { part: "figures" } },
    ],
  },
  "hypothesis-testing": {
    separation: [
      { id: "curves", target: { part: "viewport" } },
      {
        id: "move",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.85 },
      },
      { id: "gap", target: { part: "figures" } },
    ],
    alpha: [
      { id: "region", target: { part: "viewport" } },
      {
        id: "alpha",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.6 },
      },
      { id: "critical", target: { part: "figures" } },
    ],
    beta: [
      { id: "curves", target: { part: "viewport" } },
      {
        id: "type",
        target: { part: "primary", select: "label", nth: 1 },
        action: { kind: "click" },
      },
      { id: "power", target: { part: "figures" } },
    ],
    sample: [
      { id: "curves", target: { part: "viewport" } },
      {
        id: "n",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.8 },
      },
      { id: "figures", target: { part: "figures" } },
    ],
    challenge: [
      { id: "task", target: { part: "viewport" } },
      { id: "controls", target: { part: "primary" } },
      { id: "power", target: { part: "figures" } },
    ],
  },
  "multilayer-perceptrons": {
    playground: [
      { id: "data", target: { part: "viewport", select: "canvas" } },
      { id: "train", target: { part: "primary", select: "button" } },
      { id: "draw", target: { part: "readout" } },
      { id: "setup", target: { part: "secondary" } },
    ],
    neuron: [
      { id: "line", target: { part: "viewport", select: "canvas" } },
      {
        id: "weight",
        target: { part: "secondary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.85 },
      },
      {
        id: "bias",
        target: { part: "secondary", select: "input[type=range]", nth: 2 },
        action: { kind: "slide", to: 0.3 },
      },
    ],
    handXor: [
      { id: "points", target: { part: "viewport", select: "canvas" } },
      {
        id: "mode",
        target: { part: "primary", select: "label", nth: 1 },
        action: { kind: "click" },
      },
      { id: "score", target: { part: "figures" } },
    ],
    layers: [
      { id: "pair", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "accuracy", target: { part: "viewport" } },
    ],
    descent: [
      { id: "slope", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "figures", target: { part: "figures" } },
      { id: "rate", target: { part: "secondary" } },
    ],
    challenge: [
      { id: "spiral", target: { part: "viewport" } },
      { id: "size", target: { part: "secondary" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "result", target: { part: "figures" } },
    ],
  },
  probability: {
    monty: [
      { id: "pick", target: { part: "viewport", select: "button" }, action: { kind: "click" } },
      { id: "choose", target: { part: "primary", select: "button" } },
      { id: "score", target: { part: "figures" } },
    ],
    birthday: [
      { id: "guess", target: { part: "primary" } },
      {
        id: "people",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.3 },
      },
      { id: "room", target: { part: "viewport" } },
      { id: "chance", target: { part: "figures" } },
    ],
    conditional: [
      { id: "families", target: { part: "viewport" } },
      {
        id: "clue",
        target: { part: "primary", select: "label", nth: 1 },
        action: { kind: "click" },
      },
      { id: "answer", target: { part: "figures" } },
    ],
    simpson: [
      { id: "table", target: { part: "viewport" } },
      { id: "large", target: { part: "viewport", select: "button" }, action: { kind: "click" } },
      { id: "choose", target: { part: "primary" } },
      { id: "rates", target: { part: "figures" } },
    ],
    pascal: [
      { id: "board", target: { part: "viewport" } },
      {
        id: "drop",
        target: { part: "primary", select: ".grid-cols-2 button" },
        action: { kind: "click" },
      },
      {
        id: "many",
        target: { part: "primary", select: ".grid-cols-2 button", nth: 3 },
        action: { kind: "click" },
      },
      { id: "rows", target: { part: "secondary" } },
    ],
    largeNumbers: [
      { id: "chart", target: { part: "viewport" } },
      {
        id: "trials",
        target: { part: "primary", select: ".grid-cols-3 button", nth: 2 },
        action: { kind: "click" },
      },
      { id: "figures", target: { part: "figures" } },
    ],
  },
  "race-condition": {
    game: [
      { id: "threads", target: { part: "viewport" } },
      {
        id: "readA",
        target: { part: "viewport", select: "button", nth: 0 },
        action: { kind: "click" },
      },
      {
        id: "readB",
        target: { part: "viewport", select: "button", nth: 1 },
        action: { kind: "click" },
      },
      { id: "goal", target: { part: "figures" } },
    ],
    orders: [
      { id: "cards", target: { part: "viewport" } },
      {
        id: "open",
        target: { part: "viewport", select: "button", nth: 5 },
        action: { kind: "click" },
      },
      { id: "count", target: { part: "figures" } },
    ],
    odds: [
      { id: "runs", target: { part: "viewport" } },
      {
        id: "slice",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.2 },
      },
      { id: "result", target: { part: "figures" } },
    ],
    fix: [
      { id: "threads", target: { part: "viewport" } },
      {
        id: "lock",
        target: { part: "secondary", select: "label", nth: 1 },
        action: { kind: "click" },
      },
      {
        id: "run",
        target: { part: "viewport", select: "button", nth: 0 },
        action: { kind: "click" },
      },
      { id: "atomic", target: { part: "secondary" } },
    ],
    atm: [
      { id: "machines", target: { part: "viewport" } },
      {
        id: "run",
        target: { part: "viewport", select: "button", nth: 0 },
        action: { kind: "click" },
      },
      { id: "options", target: { part: "secondary" } },
    ],
  },
  "reinforcement-learning": {
    world: [
      { id: "room", target: { part: "viewport" } },
      {
        id: "move",
        target: { part: "primary", select: "button", nth: 3 },
        action: { kind: "click" },
      },
      { id: "reward", target: { select: "input[type=range]", inLab: true } },
    ],
    train: [
      { id: "map", target: { part: "viewport" } },
      { id: "run", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "figures", target: { part: "figures" } },
    ],
    policy: [
      { id: "maps", target: { part: "viewport" } },
      { id: "pick", target: { part: "primary" } },
      { id: "route", target: { part: "figures" } },
    ],
    update: [
      { id: "step", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "update", target: { part: "viewport" } },
      { id: "error", target: { part: "figures" } },
    ],
    rules: [
      { id: "chart", target: { part: "viewport" } },
      {
        id: "epsilon",
        target: { part: "primary", select: "input[type=range]", nth: 2 },
        action: { kind: "slide", to: 0.8 },
      },
      { id: "restore", target: { part: "primary", select: "button" } },
      { id: "figures", target: { part: "figures" } },
    ],
    challenge: [
      { id: "map", target: { part: "viewport" } },
      {
        id: "lever",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.6 },
      },
      { id: "result", target: { part: "figures" } },
    ],
  },
  sorting: {
    race: [
      { id: "bars", target: { part: "viewport" } },
      { id: "sort", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "counters", target: { part: "viewport" } },
    ],
    watch: [
      { id: "bars", target: { part: "viewport" } },
      {
        id: "step",
        target: { part: "primary", select: "button", nth: 1 },
        action: { kind: "click" },
      },
      { id: "algorithm", target: { part: "secondary" } },
    ],
    data: [
      { id: "shape", target: { part: "secondary" } },
      { id: "sort", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "figures", target: { part: "figures" } },
    ],
    distance: [
      { id: "bars", target: { part: "viewport" } },
      { id: "sort", target: { part: "primary", select: "button" }, action: { kind: "click" } },
      { id: "figures", target: { part: "figures" } },
    ],
    challenge: [
      { id: "array", target: { part: "viewport" } },
      { id: "algorithm", target: { part: "secondary" } },
      { id: "sort", target: { part: "primary", select: "button" }, action: { kind: "click" } },
    ],
  },
  tokenization: {
    guess: [
      { id: "strip", target: { part: "viewport" } },
      {
        id: "cut",
        target: { part: "viewport", select: "[role=group] button", nth: 11 },
        action: { kind: "click" },
      },
      { id: "reveal", target: { part: "primary", select: "button" } },
    ],
    train: [
      { id: "corpus", target: { part: "viewport" } },
      {
        id: "merge",
        target: { part: "primary", select: "button", nth: 1 },
        action: { kind: "click" },
      },
      { id: "figures", target: { part: "figures" } },
      { id: "all", target: { part: "primary", select: "button" } },
    ],
    merge: [
      {
        id: "sentence",
        target: { part: "viewport", select: "textarea" },
        action: { kind: "type", text: " ve" },
      },
      {
        id: "rewind",
        target: { part: "primary", select: "input[type=range]" },
        action: { kind: "slide", to: 0.15 },
      },
      { id: "cost", target: { part: "figures" } },
    ],
    compare: [
      {
        id: "text",
        target: { part: "viewport", select: "textarea" },
        action: { kind: "type", text: " merhaba" },
      },
      {
        id: "samples",
        target: { part: "primary", select: "label", nth: 1 },
        action: { kind: "click" },
      },
      { id: "bill", target: { part: "figures" } },
    ],
    challenge: [
      { id: "puzzle", target: { part: "viewport" } },
      { id: "verdict", target: { part: "readout" } },
      { id: "figures", target: { part: "figures" } },
    ],
  },
  "word-embeddings": {
    intro: [
      { id: "guess", target: { select: "[data-tour=predict]", inLab: true } },
      { id: "choose", target: { select: "[data-tour=predict] button", inLab: true } },
    ],
    map: [
      { id: "map", target: { part: "viewport" } },
      {
        id: "search",
        target: { part: "primary", select: "input" },
        action: { kind: "type", text: "dog", replace: true },
      },
      {
        id: "enter",
        target: { part: "primary", select: "input" },
        action: { kind: "keys", keys: ["Enter"] },
      },
      { id: "compare", target: { part: "secondary" } },
    ],
  },
};

export const tourFor = (slug: string): Record<string, readonly TourStep[]> | undefined =>
  (TOURS as Record<string, Record<string, readonly TourStep[]>>)[slug];
