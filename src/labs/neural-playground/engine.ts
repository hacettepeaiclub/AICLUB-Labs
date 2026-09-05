/**
 * A small multi-layer perceptron, written from scratch.
 *
 * Pure TypeScript — no React, no DOM. Everything the lab shows (the decision
 * field, the live weights, the loss curve) is read out of this file, so the
 * visualization can never drift from the maths it claims to explain.
 *
 * Storage: the weights of layer `l` live in `weights[l]` as a flat
 * Float64Array indexed `out * fanIn + in`. Every buffer is allocated once in
 * `createMlp` and reused, so a training frame allocates nothing.
 *
 * Note on `!`: each index below is derived from `sizes`, which also determines
 * every buffer's length, so all of them are provably in range. The assertions
 * keep the inner loops free of redundant undefined checks.
 */

import { createRng } from "@/lib/random";
import type { Label, Point } from "./datasets";

export type Activation = "tanh" | "relu" | "sigmoid";

export interface ActivationInfo {
  kind: Activation;
  label: string;
  /** Plain-language description of the squash. */
  note: string;
}

export const ACTIVATIONS: readonly ActivationInfo[] = [
  { kind: "tanh", label: "tanh", note: "Squashes to −1…1. Smooth, symmetric, a safe default." },
  { kind: "relu", label: "ReLU", note: "Passes positives, zeroes negatives. Fast, but can die." },
  { kind: "sigmoid", label: "sigmoid", note: "Squashes to 0…1. Gentle, and slower to learn." },
];

const activate = (kind: Activation, z: number): number => {
  switch (kind) {
    case "tanh":
      return Math.tanh(z);
    case "relu":
      return z > 0 ? z : 0;
    case "sigmoid":
      return 1 / (1 + Math.exp(-z));
  }
};

/** Derivative, expressed in terms of the pre-activation z and the output a. */
const activateGradient = (kind: Activation, z: number, a: number): number => {
  switch (kind) {
    case "tanh":
      return 1 - a * a;
    case "relu":
      return z > 0 ? 1 : 0;
    case "sigmoid":
      return a * (1 - a);
  }
};

export interface Mlp {
  /** Neurons per layer, input first: [2, ...hidden, 1]. */
  readonly sizes: readonly number[];
  activation: Activation;
  readonly weights: Float64Array[];
  readonly biases: Float64Array[];
  /** Per-layer outputs of the last forward pass; acts[0] holds the input. */
  readonly acts: Float64Array[];
  readonly zs: Float64Array[];
  readonly deltas: Float64Array[];
  readonly gradW: Float64Array[];
  readonly gradB: Float64Array[];
  /** Shuffle order, sized on demand so an epoch allocates nothing. */
  order: Int32Array;
  readonly rng: () => number;
  epoch: number;
}

/** Hidden layers plus the output layer — i.e. the number of weight matrices. */
const layerCount = (net: Mlp): number => net.sizes.length - 1;

export function createMlp(sizes: readonly number[], activation: Activation, seed: number): Mlp {
  const rng = createRng(seed);
  const weights: Float64Array[] = [];
  const biases: Float64Array[] = [];
  const gradW: Float64Array[] = [];
  const gradB: Float64Array[] = [];
  const acts: Float64Array[] = [];
  const zs: Float64Array[] = [];
  const deltas: Float64Array[] = [];

  for (let l = 0; l < sizes.length; l++) {
    const size = sizes[l]!;
    acts.push(new Float64Array(size));
    zs.push(new Float64Array(size));
    deltas.push(new Float64Array(size));
    if (l === 0) continue;

    const fanIn = sizes[l - 1]!;
    const w = new Float64Array(size * fanIn);
    // Scaled uniform init: keeps the signal's variance roughly constant as it
    // travels through the layers, so deeper nets still start out learnable.
    const scale = Math.sqrt((activation === "relu" ? 2 : 1) / fanIn);
    for (let i = 0; i < w.length; i++) w[i] = (rng() * 2 - 1) * scale;
    weights.push(w);
    biases.push(new Float64Array(size));
    gradW.push(new Float64Array(size * fanIn));
    gradB.push(new Float64Array(size));
  }

  return {
    sizes: [...sizes],
    activation,
    weights,
    biases,
    acts,
    zs,
    deltas,
    gradW,
    gradB,
    order: new Int32Array(0),
    rng,
    epoch: 0,
  };
}

/**
 * Run one input through the network. Writes every intermediate activation into
 * the net (that is what the diagram reads) and returns the output in −1…1.
 */
export function forward(net: Mlp, x: number, y: number): number {
  const { sizes } = net;
  const input = net.acts[0]!;
  input[0] = x;
  input[1] = y;

  const last = sizes.length - 1;
  for (let l = 1; l <= last; l++) {
    const fanIn = sizes[l - 1]!;
    const fanOut = sizes[l]!;
    const w = net.weights[l - 1]!;
    const b = net.biases[l - 1]!;
    const prev = net.acts[l - 1]!;
    const z = net.zs[l]!;
    const a = net.acts[l]!;

    for (let o = 0; o < fanOut; o++) {
      let sum = b[o]!;
      const row = o * fanIn;
      for (let i = 0; i < fanIn; i++) sum += w[row + i]! * prev[i]!;
      z[o] = sum;
      // The output neuron is always tanh, so its range matches the ±1 labels.
      a[o] = l === last ? Math.tanh(sum) : activate(net.activation, sum);
    }
  }
  return net.acts[last]![0]!;
}

/**
 * Backpropagate one sample, accumulating into gradW/gradB. Assumes `forward`
 * has just run on the same sample.
 *
 * The loss is ½(out − target)², so ∂L/∂out is simply (out − target); every
 * layer below it is the chain rule applied once more.
 */
function backward(net: Mlp, target: Label): void {
  const { sizes } = net;
  const last = sizes.length - 1;
  const out = net.acts[last]![0]!;
  net.deltas[last]![0] = (out - target) * (1 - out * out);

  for (let l = last; l >= 1; l--) {
    const fanIn = sizes[l - 1]!;
    const fanOut = sizes[l]!;
    const delta = net.deltas[l]!;
    const prev = net.acts[l - 1]!;
    const gw = net.gradW[l - 1]!;
    const gb = net.gradB[l - 1]!;

    for (let o = 0; o < fanOut; o++) {
      const d = delta[o]!;
      gb[o] = gb[o]! + d;
      const row = o * fanIn;
      for (let i = 0; i < fanIn; i++) gw[row + i] = gw[row + i]! + d * prev[i]!;
    }

    if (l === 1) break; // The input layer has no error of its own.

    const w = net.weights[l - 1]!;
    const prevDelta = net.deltas[l - 1]!;
    const prevZ = net.zs[l - 1]!;
    prevDelta.fill(0);
    for (let o = 0; o < fanOut; o++) {
      const d = delta[o]!;
      const row = o * fanIn;
      for (let i = 0; i < fanIn; i++) prevDelta[i] = prevDelta[i]! + w[row + i]! * d;
    }
    for (let i = 0; i < fanIn; i++) {
      prevDelta[i] = prevDelta[i]! * activateGradient(net.activation, prevZ[i]!, prev[i]!);
    }
  }
}

/** Take one gradient-descent step from the accumulated batch, then clear it. */
function applyGradients(net: Mlp, batchSize: number, learningRate: number, l2: number): void {
  const step = learningRate / batchSize;
  for (let l = 0; l < layerCount(net); l++) {
    const w = net.weights[l]!;
    const b = net.biases[l]!;
    const gw = net.gradW[l]!;
    const gb = net.gradB[l]!;
    for (let i = 0; i < w.length; i++) {
      w[i] = w[i]! - step * gw[i]! - learningRate * l2 * w[i]!;
      gw[i] = 0;
    }
    for (let i = 0; i < b.length; i++) {
      b[i] = b[i]! - step * gb[i]!;
      gb[i] = 0;
    }
  }
}

/**
 * One pass over the training set in shuffled mini-batches — the "epoch" that
 * the counter in the UI is counting.
 */
export function trainEpoch(
  net: Mlp,
  points: readonly Point[],
  learningRate: number,
  batchSize: number,
  l2 = 0,
): void {
  const n = points.length;
  if (n === 0) return;
  if (net.order.length !== n) {
    net.order = new Int32Array(n);
    for (let i = 0; i < n; i++) net.order[i] = i;
  }

  // Fisher–Yates in place; the seeded rng keeps the whole run reproducible.
  const order = net.order;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(net.rng() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }

  let inBatch = 0;
  for (let k = 0; k < n; k++) {
    const p = points[order[k]!]!;
    forward(net, p.x, p.y);
    backward(net, p.label);
    inBatch++;
    if (inBatch === batchSize) {
      applyGradients(net, inBatch, learningRate, l2);
      inBatch = 0;
    }
  }
  if (inBatch > 0) applyGradients(net, inBatch, learningRate, l2);
  net.epoch++;
}

export interface Score {
  /** Mean ½(out − target)² over the set. */
  loss: number;
  /** Fraction of points whose sign the net gets right. */
  accuracy: number;
}

export function evaluate(net: Mlp, points: readonly Point[]): Score {
  if (points.length === 0) return { loss: 0, accuracy: 0 };
  let loss = 0;
  let correct = 0;
  for (const p of points) {
    const out = forward(net, p.x, p.y);
    const err = out - p.label;
    loss += 0.5 * err * err;
    if (Math.sign(out) === p.label) correct++;
  }
  return { loss: loss / points.length, accuracy: correct / points.length };
}

/** Largest |weight| in the net — the scale the diagram normalizes against. */
export function maxAbsWeight(net: Mlp): number {
  let max = 0;
  for (const w of net.weights) {
    for (let i = 0; i < w.length; i++) {
      const abs = Math.abs(w[i]!);
      if (abs > max) max = abs;
    }
  }
  return max;
}
