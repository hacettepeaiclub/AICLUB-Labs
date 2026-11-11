import { createRng } from "@/lib/random";

/**
 * A joint-embedding predictive architecture (JEPA), small enough to train in
 * the browser while you watch.
 *
 * Pure TypeScript — no React, no DOM, no library. Every number the lab draws
 * comes out of this file.
 *
 * ## What the lab is trying to show
 *
 * **Learn by predicting what is hidden, in the space of meanings rather than
 * of pixels.** Hide part of a picture; from the part you can see, predict a
 * *summary* of the hidden part — the vector a network gives it — and learn by
 * making those predictions right. Nobody labels anything: the picture is its
 * own teacher.
 *
 * The toy world is built so that this is visibly the right thing to predict.
 * Every picture is two regions, each covered in one texture (flat, horizontal
 * stripes, vertical stripes, dots), and the stripes and dots sit at a random
 * offset. So a hidden patch's *pixels* cannot be predicted from its
 * neighbours — the offset is a coin toss — but its *kind* can: next to a
 * stripe there is, most likely, more stripe. A model that predicts pixels has
 * to hedge between offsets and paints grey; a model that predicts a summary
 * can leave the offset out of the summary and get the kind right.
 *
 * ## The architecture, as in I-JEPA (Assran et al., CVPR 2023)
 *
 * - a **context encoder** E turns each visible patch into a vector;
 * - a **predictor** P turns the vectors next to a hidden patch into a guess at
 *   that patch's vector;
 * - a **target encoder** Ē, a slow copy of E, gives the vector to aim for;
 * - the loss is the squared distance between the guess and Ē's vector.
 *
 * Gradients train E and P only. Ē is never trained: after every step it moves
 * a little toward E (an exponential moving average). That asymmetry is not a
 * detail. With gradients through both the online target and prediction, the
 * cheapest way to make every guess right would be to give every patch the
 * same vector — the loss goes to zero and nothing is learned. The lab lets
 * the visitor compare EMA targets, detached online targets and joint gradients.
 *
 * ## Honesty about scale
 *
 * I-JEPA uses Vision Transformers with hundreds of millions of parameters,
 * ImageNet's photographs, several large target blocks and a predictor that
 * sees every visible patch with its position. Here: 16×16 synthetic pictures,
 * about five hundred learned numbers, one 2×2 block hidden per picture, and a
 * predictor that sees the average of the hidden patch's visible neighbours.
 * Vectors have four numbers and are compared as directions (unit length), as
 * BYOL compares its outputs; I-JEPA normalises its targets in a similar
 * spirit. The map on screen is a flat view of that four-number space. The
 * mechanism — what is predicted, what is trained, what is copied — is the
 * paper's.
 */

// ------------------------------------------------------------- the world --

export const SIZE = 16;
export const PATCH = 4;
export const GRID = SIZE / PATCH;
export const PATCHES = GRID * GRID;
export const PATCH_PIXELS = PATCH * PATCH;
const HIDDEN = 16;

export const TEXTURES = ["flat", "horizontal", "vertical", "dots"] as const;
export type Texture = (typeof TEXTURES)[number];

export interface Picture {
  /** Row by row, 0 (black) to 1 (white). */
  readonly pixels: Float64Array;
  /** The texture under each patch, row by row: the answer nothing is told. */
  readonly textures: readonly Texture[];
  /** Where each patch's pattern starts: the detail no neighbour can tell. */
  readonly offsets: readonly number[];
}

type Rng = () => number;

const NOISE = 0.04;

/** A texture's brightness at a pixel, given where its pattern starts. */
function shade(texture: Texture, x: number, y: number, phase: number): number {
  switch (texture) {
    case "flat":
      return 0.5;
    case "horizontal":
      return (y + phase) % 4 < 2 ? 0.9 : 0.1;
    case "vertical":
      return (x + phase) % 4 < 2 ? 0.9 : 0.1;
    case "dots":
      return (x + phase) % 2 === 0 && (y + phase) % 2 === 0 ? 0.95 : 0.25;
  }
}

/** Two regions split along a patch boundary, each one texture at its own offset. */
export function makePicture(rng: Rng): Picture {
  const vertical = rng() < 0.5;
  const at = 1 + Math.floor(rng() * (GRID - 1));
  const first = TEXTURES[Math.floor(rng() * TEXTURES.length)]!;
  let second = TEXTURES[Math.floor(rng() * TEXTURES.length)]!;
  while (second === first) second = TEXTURES[Math.floor(rng() * TEXTURES.length)]!;
  // Every patch has its own offset, so a neighbour says what kind of patch
  // comes next but not exactly which pixels.
  const phases = Array.from({ length: PATCHES }, () => Math.floor(rng() * 4));
  const regionOf = (px: number, py: number) => ((vertical ? px : py) < at ? 0 : 1);

  const pixels = new Float64Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const region = regionOf(Math.floor(x / PATCH), Math.floor(y / PATCH));
      const texture = region === 0 ? first : second;
      const patch = Math.floor(y / PATCH) * GRID + Math.floor(x / PATCH);
      const value = shade(texture, x, y, phases[patch]!) + (rng() * 2 - 1) * NOISE;
      pixels[y * SIZE + x] = Math.min(1, Math.max(0, value));
    }
  }
  const textures = Array.from({ length: PATCHES }, (_, i) =>
    regionOf(i % GRID, Math.floor(i / GRID)) === 0 ? first : second,
  );
  const offsets = phases.map((p, i) =>
    textures[i] === "dots" ? p % 2 : textures[i] === "flat" ? 0 : p,
  );
  return { pixels, textures, offsets };
}

/** The 16 numbers of one patch, row by row. */
export function patchOf(picture: Picture, index: number): Float64Array {
  const px = (index % GRID) * PATCH;
  const py = Math.floor(index / GRID) * PATCH;
  const out = new Float64Array(PATCH_PIXELS);
  for (let y = 0; y < PATCH; y++) {
    for (let x = 0; x < PATCH; x++) out[y * PATCH + x] = picture.pixels[(py + y) * SIZE + px + x]!;
  }
  return out;
}

/** The patches above, below, left and right of one, inside the picture. */
export function neighboursOf(index: number): number[] {
  const x = index % GRID;
  const y = Math.floor(index / GRID);
  const out: number[] = [];
  if (y > 0) out.push(index - GRID);
  if (y < GRID - 1) out.push(index + GRID);
  if (x > 0) out.push(index - 1);
  if (x < GRID - 1) out.push(index + 1);
  return out;
}

/** The 2×2 block of patches with this top-left patch. */
export function blockAt(x: number, y: number): number[] {
  const top = y * GRID + x;
  return [top, top + 1, top + GRID, top + GRID + 1];
}

// ----------------------------------------------------------- a network ----

/** Two layers: input → tanh(16) → output. */
export interface Net {
  readonly inputs: number;
  readonly outputs: number;
  readonly w1: Float64Array;
  readonly b1: Float64Array;
  readonly w2: Float64Array;
  readonly b2: Float64Array;
}

function makeNet(rng: Rng, inputs: number, outputs: number): Net {
  const uniform = (n: number, scale: number) =>
    Float64Array.from({ length: n }, () => (rng() * 2 - 1) * scale);
  return {
    inputs,
    outputs,
    w1: uniform(HIDDEN * inputs, Math.sqrt(3 / inputs)),
    b1: new Float64Array(HIDDEN),
    w2: uniform(outputs * HIDDEN, Math.sqrt(3 / HIDDEN)),
    b2: new Float64Array(outputs),
  };
}

const copyNet = (net: Net): Net => ({
  inputs: net.inputs,
  outputs: net.outputs,
  w1: net.w1.slice(),
  b1: net.b1.slice(),
  w2: net.w2.slice(),
  b2: net.b2.slice(),
});

const zerosLike = (net: Net): Net => ({
  inputs: net.inputs,
  outputs: net.outputs,
  w1: new Float64Array(net.w1.length),
  b1: new Float64Array(net.b1.length),
  w2: new Float64Array(net.w2.length),
  b2: new Float64Array(net.b2.length),
});

const parts = (net: Net) => [net.w1, net.b1, net.w2, net.b2] as const;

/** Every number a network learns. */
export const parameterCount = (net: Net): number => parts(net).reduce((n, p) => n + p.length, 0);

export interface NetworkTrace {
  readonly input: Float64Array;
  readonly hidden: Float64Array;
  readonly output: Float64Array;
}
type Pass = NetworkTrace;

function forward(net: Net, input: Float64Array): Pass {
  const hidden = new Float64Array(HIDDEN);
  for (let j = 0; j < HIDDEN; j++) {
    let a = net.b1[j]!;
    for (let i = 0; i < net.inputs; i++) a += net.w1[j * net.inputs + i]! * input[i]!;
    hidden[j] = Math.tanh(a);
  }
  const output = new Float64Array(net.outputs);
  for (let k = 0; k < net.outputs; k++) {
    let a = net.b2[k]!;
    for (let j = 0; j < HIDDEN; j++) a += net.w2[k * HIDDEN + j]! * hidden[j]!;
    output[k] = a;
  }
  return { input, hidden, output };
}

/** Adds this pass's share of the gradient to `grad`; returns ∂loss/∂input. */
function backward(net: Net, pass: Pass, dOutput: Float64Array, grad: Net): Float64Array {
  const dHidden = new Float64Array(HIDDEN);
  for (let k = 0; k < net.outputs; k++) {
    const d = dOutput[k]!;
    grad.b2[k] = grad.b2[k]! + d;
    for (let j = 0; j < HIDDEN; j++) {
      grad.w2[k * HIDDEN + j] = grad.w2[k * HIDDEN + j]! + d * pass.hidden[j]!;
      dHidden[j] = dHidden[j]! + d * net.w2[k * HIDDEN + j]!;
    }
  }
  const dInput = new Float64Array(net.inputs);
  for (let j = 0; j < HIDDEN; j++) {
    const h = pass.hidden[j]!;
    const d = dHidden[j]! * (1 - h * h);
    grad.b1[j] = grad.b1[j]! + d;
    for (let i = 0; i < net.inputs; i++) {
      grad.w1[j * net.inputs + i] = grad.w1[j * net.inputs + i]! + d * pass.input[i]!;
      dInput[i] = dInput[i]! + d * net.w1[j * net.inputs + i]!;
    }
  }
  return dInput;
}

// -------------------------------------------------------------- a JEPA ----

export interface Jepa {
  /** E: what the visible patches are turned into. Trained. */
  readonly encoder: Net;
  /** P: from the vectors around a hidden patch, a guess at its vector. Trained. */
  readonly predictor: Net;
  /** Ē: the vector each guess aims for. Never trained; a slow copy of E. */
  readonly target: Net;
  /** Adam's running averages, one pair per trained network. */
  readonly moments: { m: [Net, Net]; v: [Net, Net] };
  readonly settings: Settings;
  steps: number;
}

export interface Settings {
  /** Numbers per vector. */
  readonly dim: number;
  /** Compare directions only (unit vectors), as BYOL does with its outputs. */
  readonly normalize: boolean;
  /** How much of itself Ē keeps each step. */
  readonly momentum: number;
  readonly learningRate: number;
  /** Pictures averaged into one step's gradient. */
  readonly batch: number;
}

export const SETTINGS: Settings = {
  dim: 4,
  normalize: true,
  momentum: 0.99,
  learningRate: 0.005,
  batch: 16,
};

export interface TrainOptions {
  /** Use an EMA target. Its parameters are updated by copying, not gradients. */
  slowCopy: boolean;
  /** Detach the online target when EMA is off. Defaults to slowCopy for compatibility. */
  stopGradient?: boolean;
}

const BETA1 = 0.9;
const BETA2 = 0.999;
const EPSILON = 1e-8;

export function createJepa(seed: number, changes: Partial<Settings> = {}): Jepa {
  const settings = { ...SETTINGS, ...changes };
  const rng = createRng(seed);
  const encoder = makeNet(rng, PATCH_PIXELS, settings.dim);
  const predictor = makeNet(rng, settings.dim, settings.dim);
  return {
    encoder,
    predictor,
    // The slow copy starts as an exact copy, as in the paper.
    target: copyNet(encoder),
    moments: {
      m: [zerosLike(encoder), zerosLike(predictor)],
      v: [zerosLike(encoder), zerosLike(predictor)],
    },
    settings,
    steps: 0,
  };
}

/** A patch's vector, from the network given (E or Ē). */
export const embed = (net: Net, patch: Float64Array): Float64Array => forward(net, patch).output;

const average = (vectors: Float64Array[]): Float64Array => {
  const out = new Float64Array(vectors[0]?.length ?? 0);
  for (const v of vectors)
    for (let d = 0; d < out.length; d++) out[d] = out[d]! + v[d]! / vectors.length;
  return out;
};

/** v / |v|: only the direction counts, so a guess cannot win by shrinking. */
const unit = (v: Float64Array): Float64Array => {
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n);
};

/** ∂(v/|v|)/∂v applied to an upstream gradient g: (g − u(u·g)) / |v|. */
const unitBackward = (v: Float64Array, g: Float64Array): Float64Array => {
  const n = Math.hypot(...v) || 1;
  const u = v.map((x) => x / n);
  let dot = 0;
  for (let d = 0; d < v.length; d++) dot += u[d]! * g[d]!;
  return g.map((x, d) => (x - u[d]! * dot) / n);
};

export interface Guess {
  readonly hidden: number;
  /** The visible neighbours the guess was made from. */
  readonly from: readonly number[];
  readonly guess: Float64Array;
  readonly goal: Float64Array;
  readonly error: number;
  readonly layers: { encoder: NetworkTrace; predictor: NetworkTrace; target: NetworkTrace };
}

/**
 * P's guesses for every hidden patch that has a visible neighbour, and the
 * vectors Ē gives those patches. Nothing is trained.
 */
export function guesses(model: Jepa, picture: Picture, hidden: readonly number[]): Guess[] {
  const out: Guess[] = [];
  for (const h of hidden) {
    const from = neighboursOf(h).filter((n) => !hidden.includes(n));
    if (!from.length) continue;
    const contextPasses = from.map((n) => forward(model.encoder, patchOf(picture, n)));
    const context = average(contextPasses.map((p) => p.output));
    const predicted = forward(model.predictor, context);
    const target = forward(model.target, patchOf(picture, h));
    const raw = predicted.output;
    const rawGoal = target.output;
    const guess = model.settings.normalize ? unit(raw) : raw;
    const goal = model.settings.normalize ? unit(rawGoal) : rawGoal;
    let error = 0;
    for (let d = 0; d < guess.length; d++) error += (guess[d]! - goal[d]!) ** 2;
    out.push({
      hidden: h,
      from,
      guess,
      goal,
      error,
      layers: { encoder: contextPasses[0]!, predictor: predicted, target },
    });
  }
  return out;
}

/** The loss of one hidden block: the mean squared distance of guess to goal. */
export const lossOf = (all: readonly Guess[]): number =>
  all.length ? all.reduce((n, g) => n + g.error, 0) / all.length : 0;

function adam(net: Net, grad: Net, m: Net, v: Net, step: number, rate: number) {
  const nets = [parts(net), parts(grad), parts(m), parts(v)] as const;
  const correction1 = 1 - BETA1 ** step;
  const correction2 = 1 - BETA2 ** step;
  for (let p = 0; p < 4; p++) {
    const w = nets[0][p]!;
    const g = nets[1][p]!;
    const mp = nets[2][p]!;
    const vp = nets[3][p]!;
    for (let i = 0; i < w.length; i++) {
      mp[i] = BETA1 * mp[i]! + (1 - BETA1) * g[i]!;
      vp[i] = BETA2 * vp[i]! + (1 - BETA2) * g[i]! ** 2;
      w[i] = w[i]! - (rate * (mp[i]! / correction1)) / (Math.sqrt(vp[i]! / correction2) + EPSILON);
    }
  }
}

/** One picture with one hidden block: what a training step learns from. */
export interface Sample {
  readonly picture: Picture;
  readonly hidden: readonly number[];
}

/** A random picture with a random 2×2 block hidden. */
export function drawSample(rng: Rng): Sample {
  const picture = makePicture(rng);
  return {
    picture,
    hidden: blockAt(Math.floor(rng() * (GRID - 1)), Math.floor(rng() * (GRID - 1))),
  };
}

export interface Gradients {
  /** The mean squared distance from guess to goal over every hidden patch. */
  readonly loss: number;
  readonly encoder: Net;
  readonly predictor: Net;
}

/**
 * The loss on these samples and its gradient for E and P, by backpropagation.
 *
 * With the slow copy the goal comes from Ē and is a constant: no gradient
 * reaches it. Without EMA, the goal is E's own output. Unless stopGradient is set, gradients flow
 * into E from both sides — which can let it make every guess right by
 * making every vector the same.
 */
export function gradients(
  model: Jepa,
  samples: readonly Sample[],
  options: TrainOptions,
): Gradients {
  const gradE = zerosLike(model.encoder);
  const gradP = zerosLike(model.predictor);
  let total = 0;
  let count = 0;
  const normalize = model.settings.normalize;

  for (const { picture, hidden } of samples) {
    for (const h of hidden) {
      const from = neighboursOf(h).filter((n) => !hidden.includes(n));
      if (!from.length) continue;
      const contextPasses = from.map((n) => forward(model.encoder, patchOf(picture, n)));
      const predicted = forward(model.predictor, average(contextPasses.map((p) => p.output)));
      const goalPass = forward(
        options.slowCopy ? model.target : model.encoder,
        patchOf(picture, h),
      );
      const guess = normalize ? unit(predicted.output) : predicted.output;
      const goal = normalize ? unit(goalPass.output) : goalPass.output;
      const diff = guess.map((g, d) => g - goal[d]!);
      for (const x of diff) total += x * x;
      count++;
      // d(Σ diff²)/d guess = 2·diff.
      const dGuessOut = diff.map((x) => 2 * x);
      const dGuess = normalize ? unitBackward(predicted.output, dGuessOut) : dGuessOut;
      const dContext = backward(model.predictor, predicted, dGuess, gradP);
      for (const pass of contextPasses) {
        backward(
          model.encoder,
          pass,
          dContext.map((x) => x / from.length),
          gradE,
        );
      }
      if (!options.slowCopy && !options.stopGradient) {
        const dGoalOut = dGuessOut.map((x) => -x);
        backward(
          model.encoder,
          goalPass,
          normalize ? unitBackward(goalPass.output, dGoalOut) : dGoalOut,
          gradE,
        );
      }
    }
  }
  if (count) {
    for (const grad of [gradE, gradP]) {
      for (const p of parts(grad)) for (let i = 0; i < p.length; i++) p[i] = p[i]! / count;
    }
  }
  return { loss: count ? total / count : 0, encoder: gradE, predictor: gradP };
}

/**
 * One step of training on a batch of random pictures, each with a random 2×2
 * block hidden: Adam on E and P, then Ē moves toward E. Returns the loss
 * before the step.
 */
export function trainStep(model: Jepa, rng: Rng, options: TrainOptions): number {
  const samples = Array.from({ length: model.settings.batch }, () => drawSample(rng));
  const { loss, encoder: gradE, predictor: gradP } = gradients(model, samples, options);
  model.steps++;
  const rate = model.settings.learningRate;
  adam(model.encoder, gradE, model.moments.m[0], model.moments.v[0], model.steps, rate);
  adam(model.predictor, gradP, model.moments.m[1], model.moments.v[1], model.steps, rate);

  // Ē follows E slowly; without the slow copy it simply is E.
  const tau = options.slowCopy ? model.settings.momentum : 0;
  const target = parts(model.target);
  const live = parts(model.encoder);
  for (let p = 0; p < 4; p++) {
    const t = target[p]!;
    const e = live[p]!;
    for (let i = 0; i < t.length; i++) t[i] = tau * t[i]! + (1 - tau) * e[i]!;
  }
  return loss;
}

// ---------------------------------------------------- did it learn? ----

/** One patch's vector, as a direction, with what the picture knows about it. */
export interface Vector {
  readonly v: Float64Array;
  readonly texture: Texture;
  readonly offset: number;
}

/** Every patch of these pictures as a direction, by the network given (E or Ē). */
export function vectorsOf(net: Net, all: readonly Picture[]): Vector[] {
  const out: Vector[] = [];
  for (const picture of all) {
    for (let i = 0; i < PATCHES; i++) {
      out.push({
        v: unit(embed(net, patchOf(picture, i))),
        texture: picture.textures[i]!,
        offset: picture.offsets[i]!,
      });
    }
  }
  return out;
}

const distance = (a: Float64Array, b: Float64Array): number => {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += (a[i]! - b[i]!) ** 2;
  return Math.sqrt(d);
};

/** How far the vectors are, on average, from their middle: 0 is total collapse. */
export function spread(vectors: readonly Vector[]): number {
  if (!vectors.length) return 0;
  const mean = average(vectors.map((x) => x.v));
  return vectors.reduce((n, x) => n + distance(x.v, mean), 0) / vectors.length;
}

/**
 * How much farther apart two patches of *different* kinds are than two of the
 * *same* kind at different offsets: mean distance between kinds over mean
 * distance within a kind.
 *
 * This, not "can the kind be read off at all", is what training changes.
 * Even an untrained network keeps the kinds apart — they differ pixel by
 * pixel — but it also keeps each offset apart, so one kind is several
 * clumps. A JEPA cannot predict the offset, so it learns to leave it out of
 * the vector, and the clumps of a kind merge: the ratio climbs. A collapsed
 * network has nothing apart at all, and the ratio sinks to 1.
 */
export function separation(vectors: readonly Vector[]): number {
  let within = 0;
  let nWithin = 0;
  let between = 0;
  let nBetween = 0;
  // A fixed sample of pairs, the same every time, is plenty and stays cheap
  // enough to recompute every frame.
  for (let i = 0; i < vectors.length; i += 3) {
    for (let j = i + 1; j < vectors.length; j += 7) {
      const a = vectors[i]!;
      const b = vectors[j]!;
      const d = distance(a.v, b.v);
      if (a.texture === b.texture) {
        within += d;
        nWithin++;
      } else {
        between += d;
        nBetween++;
      }
    }
  }
  if (!nWithin || !nBetween || within === 0) return 1;
  return between / nBetween / (within / nWithin);
}

// -------------------------------------------------------------- the map ----

export interface MapPoint {
  readonly x: number;
  readonly y: number;
  readonly texture: Texture;
  readonly offset: number;
}

/** Two directions to flatten the space onto, kept from frame to frame. */
export type Axes = readonly [Float64Array, Float64Array];

/**
 * The vectors laid flat: the two directions in which they vary most
 * (principal components), found by power iteration on their covariance.
 *
 * Given the previous frame's axes, each new axis is turned to point the same
 * way, so training moves the points rather than flipping the whole picture.
 */
export function project(
  vectors: readonly Vector[],
  previous?: Axes,
): { points: MapPoint[]; axes: Axes; mean: Float64Array } {
  const dim = vectors[0]?.v.length ?? 2;
  const mean = average(vectors.map((x) => x.v));
  const cov = new Float64Array(dim * dim);
  for (const { v } of vectors) {
    for (let a = 0; a < dim; a++) {
      for (let b = 0; b < dim; b++) {
        cov[a * dim + b] =
          cov[a * dim + b]! + ((v[a]! - mean[a]!) * (v[b]! - mean[b]!)) / vectors.length;
      }
    }
  }
  const axes: Float64Array[] = [];
  for (let k = 0; k < 2; k++) {
    let axis =
      previous?.[k]?.slice() ?? Float64Array.from({ length: dim }, (_, i) => (i === k ? 1 : 0.1));
    for (let it = 0; it < 60; it++) {
      const next = new Float64Array(dim);
      for (let a = 0; a < dim; a++)
        for (let b = 0; b < dim; b++) next[a] = next[a]! + cov[a * dim + b]! * axis[b]!;
      // Remove what the first axis already shows.
      for (const done of axes) {
        let dot = 0;
        for (let i = 0; i < dim; i++) dot += next[i]! * done[i]!;
        for (let i = 0; i < dim; i++) next[i] = next[i]! - dot * done[i]!;
      }
      const n = Math.hypot(...next);
      if (n < 1e-12) break;
      axis = next.map((x) => x / n);
    }
    const before = previous?.[k];
    if (before) {
      let dot = 0;
      for (let i = 0; i < dim; i++) dot += axis[i]! * before[i]!;
      if (dot < 0) axis = axis.map((x) => -x);
    }
    axes.push(axis);
  }
  const [first, second] = axes as [Float64Array, Float64Array];
  const points = vectors.map(({ v, texture, offset }) => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < dim; i++) {
      x += (v[i]! - mean[i]!) * first[i]!;
      y += (v[i]! - mean[i]!) * second[i]!;
    }
    return { x, y, texture, offset };
  });
  return { points, axes: [first, second], mean };
}

/** One more direction placed on a map already laid out (a guess, say). */
export function place(v: Float64Array, axes: Axes, mean: Float64Array): { x: number; y: number } {
  const u = unit(v);
  let x = 0;
  let y = 0;
  for (let i = 0; i < u.length; i++) {
    x += (u[i]! - mean[i]!) * axes[0][i]!;
    y += (u[i]! - mean[i]!) * axes[1][i]!;
  }
  return { x, y };
}

/** The nearest kind to a direction, by the five closest of the given vectors. */
export function kindNear(v: Float64Array, reference: readonly Vector[]): Texture {
  const u = unit(v);
  const nearest = reference
    .map((r) => ({ d: distance(u, r.v), texture: r.texture }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);
  const votes = new Map<Texture, number>();
  for (const n of nearest) votes.set(n.texture, (votes.get(n.texture) ?? 0) + 1);
  let best: Texture = nearest[0]?.texture ?? "flat";
  for (const [texture, count] of votes) if (count > (votes.get(best) ?? 0)) best = texture;
  return best;
}

// --------------------------------------------- predicting pixels instead ----

/**
 * The other way to fill a hole: predict its pixels. The best a straight-line
 * guess can do from the average of the visible neighbours' pixels, fitted by
 * least squares on many pictures (ridge-regularised, solved exactly).
 *
 * This regularised linear baseline estimates an average, not a distribution, in
 * this world: the offset of a hidden stripe is a coin toss, so the guess
 * that is least wrong on average is the average of every offset — grey.
 */
export interface PixelGuesser {
  /** For each hidden pixel: a weight per input pixel, then a constant. */
  readonly weights: Float64Array;
}

const RIDGE = 1e-3;

export function fitPixelGuesser(seed: number, samples = 600): PixelGuesser {
  const rng = createRng(seed);
  const n = PATCH_PIXELS + 1;
  const xtx = new Float64Array(n * n);
  const xty = new Float64Array(n * PATCH_PIXELS);
  for (let s = 0; s < samples; s++) {
    const picture = makePicture(rng);
    const hidden = blockAt(Math.floor(rng() * (GRID - 1)), Math.floor(rng() * (GRID - 1)));
    for (const h of hidden) {
      const from = neighboursOf(h).filter((m) => !hidden.includes(m));
      if (!from.length) continue;
      const x = [...average(from.map((m) => patchOf(picture, m))), 1];
      const y = patchOf(picture, h);
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) xtx[a * n + b] = xtx[a * n + b]! + x[a]! * x[b]!;
        for (let k = 0; k < PATCH_PIXELS; k++)
          xty[a * PATCH_PIXELS + k] = xty[a * PATCH_PIXELS + k]! + x[a]! * y[k]!;
      }
    }
  }
  for (let a = 0; a < n; a++) xtx[a * n + a] = xtx[a * n + a]! + RIDGE * samples;
  return { weights: solve(xtx, xty, n, PATCH_PIXELS) };
}

/** Solves A·X = B for X by Gauss–Jordan elimination with partial pivoting. */
function solve(a: Float64Array, b: Float64Array, n: number, columns: number): Float64Array {
  const m = a.slice();
  const x = b.slice();
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++)
      if (Math.abs(m[r * n + col]!) > Math.abs(m[pivot * n + col]!)) pivot = r;
    for (let c = 0; c < n; c++)
      [m[col * n + c], m[pivot * n + c]] = [m[pivot * n + c]!, m[col * n + c]!];
    for (let c = 0; c < columns; c++)
      [x[col * columns + c], x[pivot * columns + c]] = [
        x[pivot * columns + c]!,
        x[col * columns + c]!,
      ];
    const p = m[col * n + col]!;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = m[r * n + col]! / p;
      if (f === 0) continue;
      for (let c = 0; c < n; c++) m[r * n + c] = m[r * n + c]! - f * m[col * n + c]!;
      for (let c = 0; c < columns; c++)
        x[r * columns + c] = x[r * columns + c]! - f * x[col * columns + c]!;
    }
  }
  for (let r = 0; r < n; r++)
    for (let c = 0; c < columns; c++) x[r * columns + c] = x[r * columns + c]! / m[r * n + r]!;
  return x;
}

/** The pixel guesser's 16 pixels for one hidden patch, or null with no visible neighbour. */
export function guessPixels(
  guesser: PixelGuesser,
  picture: Picture,
  hidden: readonly number[],
  index: number,
): Float64Array | null {
  const from = neighboursOf(index).filter((m) => !hidden.includes(m));
  if (!from.length) return null;
  const x = [...average(from.map((m) => patchOf(picture, m))), 1];
  const out = new Float64Array(PATCH_PIXELS);
  for (let k = 0; k < PATCH_PIXELS; k++) {
    let v = 0;
    for (let a = 0; a < x.length; a++) v += x[a]! * guesser.weights[a * PATCH_PIXELS + k]!;
    out[k] = Math.min(1, Math.max(0, v));
  }
  return out;
}

/**
 * How often P's guess for a hidden patch lands nearest the right kind, among
 * Ē's vectors of the reference pictures, counting only hidden patches whose
 * visible neighbours are all of that kind (elsewhere the right answer is a
 * matter of luck). The model never sees a kind; this is how we look.
 *
 * It catches what `separation` can hide: two kinds pushed onto the same
 * spot ("dimensional collapse"). Their guesses still match their goals, so
 * the loss does not mind, but half of them now land on the wrong kind.
 */
export function kindAccuracy(
  model: Jepa,
  samples: readonly Sample[],
  reference: readonly Vector[],
): number {
  return evaluateKinds(model, samples, reference).interior.accuracy;
}

export interface KindScore {
  readonly right: number;
  readonly total: number;
  readonly accuracy: number;
}

/** Report the whole probe and its two disjoint subsets, including hard boundaries. */
export function evaluateKinds(
  model: Jepa,
  samples: readonly Sample[],
  reference: readonly Vector[],
) {
  const all = { right: 0, total: 0 };
  const interior = { right: 0, total: 0 };
  const boundary = { right: 0, total: 0 };
  let unavailable = 0;
  for (const { picture, hidden } of samples) {
    const predicted = guesses(model, picture, hidden);
    unavailable += hidden.length - predicted.length;
    for (const g of predicted) {
      const correct = Number(kindNear(g.guess, reference) === picture.textures[g.hidden]);
      const group = g.from.every((n) => picture.textures[n] === picture.textures[g.hidden])
        ? interior
        : boundary;
      all.total++;
      all.right += correct;
      group.total++;
      group.right += correct;
    }
  }
  const score = (s: { right: number; total: number }): KindScore => ({
    ...s,
    accuracy: s.total ? s.right / s.total : 0,
  });
  return { all: score(all), interior: score(interior), boundary: score(boundary), unavailable };
}

/** A fixed set of pictures, the same for every model, to draw and to score maps on. */
export function pictures(seed: number, count: number): Picture[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => makePicture(rng));
}
