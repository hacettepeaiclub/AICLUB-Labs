/**
 * Reverse-mode differentiation over small graphs of scalar operations.
 *
 * Every number the Backpropagation lab shows comes from here: a graph is a
 * list of nodes in the order they are computed, `forward` fills in their
 * values, and `backward` walks the same list from the end, handing each node
 * the derivative of the root with respect to it — its *adjoint* — and passing
 * it on to the node's inputs multiplied by the node's local derivatives.
 * Where a value feeds two nodes, both contributions arrive and are added.
 * That is the whole of backpropagation.
 *
 * ## How it is held to the truth
 *
 * `numericGradient` differentiates the same graph a completely different
 * way, by nudging one parameter up and down and re-running the forward pass.
 * The tests require the two to agree for every parameter of every graph the
 * page builds; only the challenge's deliberately broken backward passes are
 * allowed to disagree, and they are required to.
 */

import { createRng } from "@/lib/random";

export type Op =
  "param" | "const" | "add" | "sub" | "mul" | "scale" | "square" | "tanh" | "sigmoid" | "relu";

export interface Node {
  readonly op: Op;
  /** Indices of the nodes this one reads, all earlier in the list. */
  readonly args: readonly number[];
  /** A parameter's name, or a label to show; optional otherwise. */
  readonly name?: string;
  /** A constant's value, or the factor of a `scale` node. */
  readonly value?: number;
}

export interface Graph {
  readonly nodes: readonly Node[];
}

export type Params = Readonly<Record<string, number>>;

// ---------------------------------------------------------------- building --

export interface Builder {
  param(name: string): number;
  constant(value: number, name?: string): number;
  add(a: number, b: number, name?: string): number;
  sub(a: number, b: number, name?: string): number;
  mul(a: number, b: number, name?: string): number;
  scale(a: number, factor: number, name?: string): number;
  square(a: number, name?: string): number;
  tanh(a: number, name?: string): number;
  sigmoid(a: number, name?: string): number;
  relu(a: number, name?: string): number;
  build(): Graph;
}

export function builder(): Builder {
  const nodes: Node[] = [];
  const push = (node: Node): number => {
    for (const a of node.args) {
      if (a < 0 || a >= nodes.length)
        throw new RangeError(`Node reads ${a}, which is not built yet.`);
    }
    nodes.push(node);
    return nodes.length - 1;
  };
  return {
    param: (name) => push({ op: "param", args: [], name }),
    constant: (value, name) => push({ op: "const", args: [], value, name }),
    add: (a, b, name) => push({ op: "add", args: [a, b], name }),
    sub: (a, b, name) => push({ op: "sub", args: [a, b], name }),
    mul: (a, b, name) => push({ op: "mul", args: [a, b], name }),
    scale: (a, factor, name) => push({ op: "scale", args: [a], value: factor, name }),
    square: (a, name) => push({ op: "square", args: [a], name }),
    tanh: (a, name) => push({ op: "tanh", args: [a], name }),
    sigmoid: (a, name) => push({ op: "sigmoid", args: [a], name }),
    relu: (a, name) => push({ op: "relu", args: [a], name }),
    build: () => ({ nodes: [...nodes] }),
  };
}

const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

// ----------------------------------------------------------------- forward --

/** Every node's value, in order. A parameter missing from `params` is an error. */
export function forward(graph: Graph, params: Params): Float64Array {
  const v = new Float64Array(graph.nodes.length);
  graph.nodes.forEach((node, i) => {
    const a = v[node.args[0] ?? 0] ?? 0;
    const b = v[node.args[1] ?? 0] ?? 0;
    switch (node.op) {
      case "param": {
        const value = params[node.name ?? ""];
        if (value === undefined) throw new RangeError(`No value for parameter ${node.name}.`);
        v[i] = value;
        break;
      }
      case "const":
        v[i] = node.value ?? 0;
        break;
      case "add":
        v[i] = a + b;
        break;
      case "sub":
        v[i] = a - b;
        break;
      case "mul":
        v[i] = a * b;
        break;
      case "scale":
        v[i] = a * (node.value ?? 1);
        break;
      case "square":
        v[i] = a * a;
        break;
      case "tanh":
        v[i] = Math.tanh(a);
        break;
      case "sigmoid":
        v[i] = sigmoid(a);
        break;
      case "relu":
        v[i] = a > 0 ? a : 0;
        break;
    }
  });
  return v;
}

/** The root's value: the last node. */
export const evaluate = (graph: Graph, params: Params): number =>
  forward(graph, params)[graph.nodes.length - 1] ?? 0;

// ---------------------------------------------------------------- backward --

/**
 * ∂node/∂input, for each of the node's inputs, at the values given.
 *
 * ReLU's derivative at exactly 0 is taken as 0, the convention every
 * framework uses; the lab never evaluates it there.
 */
export function localGradients(node: Node, i: number, values: Float64Array): number[] {
  const a = values[node.args[0] ?? 0] ?? 0;
  const b = values[node.args[1] ?? 0] ?? 0;
  const out = values[i] ?? 0;
  switch (node.op) {
    case "param":
    case "const":
      return [];
    case "add":
      return [1, 1];
    case "sub":
      return [1, -1];
    case "mul":
      return [b, a];
    case "scale":
      return [node.value ?? 1];
    case "square":
      return [2 * a];
    case "tanh":
      return [1 - out * out];
    case "sigmoid":
      return [out * (1 - out)];
    case "relu":
      return [a > 0 ? 1 : 0];
  }
}

/**
 * A deliberately broken backward pass, for the challenge. Each is a mistake
 * people actually make when they write backprop by hand.
 *
 *   `tanh-as-value`  uses tanh(z) where 1 − tanh²(z) belongs
 *   `overwrite`      assigns a node's adjoint instead of adding to it, so of
 *                    two paths into a shared value only the last survives
 *   `sub-sign`       forgets the minus sign on the second input of a − b
 */
export type Bug =
  | { readonly kind: "tanh-as-value"; readonly node: number }
  | { readonly kind: "overwrite"; readonly node: number }
  | { readonly kind: "sub-sign"; readonly node: number };

/**
 * Every node's adjoint: ∂root/∂node. The root's is 1; each node, visited from
 * the end, adds adjoint × local derivative into each of its inputs.
 */
export function backward(graph: Graph, values: Float64Array, bug?: Bug): Float64Array {
  const n = graph.nodes.length;
  const adj = new Float64Array(n);
  if (n === 0) return adj;
  adj[n - 1] = 1;
  for (let i = n - 1; i >= 0; i--) {
    const node = graph.nodes[i];
    if (!node) continue;
    let local = localGradients(node, i, values);
    if (bug?.node === i && bug.kind === "tanh-as-value" && node.op === "tanh") {
      local = [values[i] ?? 0];
    }
    if (bug?.node === i && bug.kind === "sub-sign" && node.op === "sub") local = [1, 1];
    node.args.forEach((arg, k) => {
      const contribution = (adj[i] ?? 0) * (local[k] ?? 0);
      if (bug?.kind === "overwrite" && bug.node === arg) adj[arg] = contribution;
      else adj[arg] = (adj[arg] ?? 0) + contribution;
    });
  }
  return adj;
}

/** The nodes that are parameters, by name. */
export function parameterNodes(graph: Graph): Map<string, number> {
  const out = new Map<string, number>();
  graph.nodes.forEach((node, i) => {
    if (node.op === "param" && node.name) out.set(node.name, i);
  });
  return out;
}

/** ∂root/∂p for every parameter p, by backpropagation. */
export function gradient(graph: Graph, params: Params, bug?: Bug): Record<string, number> {
  const values = forward(graph, params);
  const adj = backward(graph, values, bug);
  const out: Record<string, number> = {};
  for (const [name, i] of parameterNodes(graph)) out[name] = adj[i] ?? 0;
  return out;
}

/**
 * ∂root/∂p by central differences: (f(p + h) − f(p − h)) / 2h. Two forward
 * passes per parameter, error of order h², and no knowledge of the graph's
 * structure at all — which is why it is the check.
 */
export function numericGradient(graph: Graph, params: Params, name: string, h = 1e-6): number {
  const at = (delta: number) => evaluate(graph, { ...params, [name]: (params[name] ?? 0) + delta });
  return (at(h) - at(-h)) / (2 * h);
}

/** Inputs of each node turned around: who reads node i. */
export function consumers(graph: Graph): number[][] {
  const out: number[][] = graph.nodes.map(() => []);
  graph.nodes.forEach((node, i) => node.args.forEach((a) => out[a]?.push(i)));
  return out;
}

// ------------------------------------------------------------ the networks --

/**
 * The page's small network: two inputs, two tanh neurons, one linear output.
 * Linear at the end so the visitor can pull it anywhere, not only within ±1.
 */
export const NETWORK_PARAMS = ["w11", "w12", "b1", "w21", "w22", "b2", "v1", "v2", "c"] as const;
export type NetworkParam = (typeof NETWORK_PARAMS)[number];

export interface Network {
  readonly graph: Graph;
  /** Indices of the nodes the diagram draws. */
  readonly at: {
    readonly x1: number;
    readonly x2: number;
    readonly h1: number;
    readonly h2: number;
    readonly out: number;
  };
}

export function network(x1: number, x2: number): Network {
  const g = builder();
  const ix1 = g.constant(x1, "x₁");
  const ix2 = g.constant(x2, "x₂");
  const hidden = (j: 1 | 2) => {
    const z = g.add(
      g.add(g.mul(g.param(`w${j}1`), ix1), g.mul(g.param(`w${j}2`), ix2)),
      g.param(`b${j}`),
      `z${j === 1 ? "₁" : "₂"}`,
    );
    return g.tanh(z, `h${j === 1 ? "₁" : "₂"}`);
  };
  const h1 = hidden(1);
  const h2 = hidden(2);
  const out = g.add(g.add(g.mul(g.param("v1"), h1), g.mul(g.param("v2"), h2)), g.param("c"), "ŷ");
  return { graph: g.build(), at: { x1: ix1, x2: ix2, h1, h2, out } };
}

/** The same network with a squared error on the end: (ŷ − y)². */
export function networkLoss(x1: number, x2: number, y: number): Graph {
  const nodes = [...network(x1, x2).graph.nodes];
  const out = nodes.length - 1;
  nodes.push({ op: "const", args: [], value: y, name: "y" });
  nodes.push({ op: "sub", args: [out, out + 1], name: "ŷ − y" });
  nodes.push({ op: "square", args: [out + 2], name: "L" });
  return { nodes };
}

/**
 * The step that moves the output to `target`, as far as a straight line can
 * tell: Δθ = (target − ŷ) · g / ‖g‖², with g = ∂ŷ/∂θ. It is the smallest
 * change of the weights whose first-order prediction lands exactly on the
 * target; the output's real new value differs by the curvature the line
 * ignored, and the page shows both.
 */
export function aimStep(graph: Graph, params: Params, target: number): Record<string, number> {
  const grad = gradient(graph, params);
  const out = evaluate(graph, params);
  const norm = Object.values(grad).reduce((s, g) => s + g * g, 0);
  const next: Record<string, number> = { ...params };
  if (norm === 0) return next;
  const k = (target - out) / norm;
  for (const [name, g] of Object.entries(grad)) next[name] = (params[name] ?? 0) + k * g;
  return next;
}

// ----------------------------------------------------------- the ledger --

/**
 * The graph the visitor runs backward by hand: one neuron, a squared error,
 * and weight decay. `w` is used twice — once in the neuron, once in the
 * penalty — so its gradient is the sum of two paths.
 *
 *   L = (tanh(w·x + b) − y)² + 0.1·w²
 */
export function ledgerGraph(x = 1.5, y = 0.8, targetFirst = false): Graph {
  const g = builder();
  const w = g.param("w");
  const ix = g.constant(x, "x");
  const b = g.param("b");
  const iy = g.constant(y, "y");
  const m = g.mul(w, ix, "w·x");
  const z = g.add(m, b, "z");
  const h = g.tanh(z, "h");
  // The same error either way round once squared; written y − h, the value
  // the network computes is the *second* input of the subtraction, which is
  // where a forgotten minus sign does its damage.
  const r = targetFirst ? g.sub(iy, h, "y − h") : g.sub(h, iy, "h − y");
  const e = g.square(r, "e");
  const s = g.square(w, "w²");
  const p = g.scale(s, 0.1, "0.1·w²");
  g.add(e, p, "L");
  return g.build();
}

export const LEDGER_PARAMS: Params = { w: 0.4, b: -0.2 };

// ------------------------------------------------------------- the chain --

/**
 * One input through four stages, for the dials: a = 1.5x, b = tanh(a),
 * c = b², d = 2c − 1. Each stage's local derivative, and their product,
 * which is d′(x).
 */
export function chain(x: number) {
  const a = 1.5 * x;
  const b = Math.tanh(a);
  const c = b * b;
  const d = 2 * c - 1;
  const locals = [1.5, 1 - b * b, 2 * b, 2] as const;
  return { values: [x, a, b, c, d] as const, locals, product: locals.reduce((p, l) => p * l, 1) };
}

// ------------------------------------------------------------- the depth --

export type Activation = "sigmoid" | "tanh" | "relu";

/**
 * A chain of `depth` one-neuron layers, h_l = act(w · h_{l−1}), from x.
 * Returns |∂h_depth/∂h_l| for every l = 0 … depth − 1: how much of a
 * change at layer l still reaches the end.
 */
export function depthGradients(
  depth: number,
  activation: Activation,
  w: number,
  x = 0.5,
): number[] {
  const g = builder();
  let h = g.constant(x, "x");
  const taps: number[] = [h];
  const wNode = g.param("w");
  for (let l = 0; l < depth; l++) {
    const z = g.mul(wNode, h);
    h = activation === "sigmoid" ? g.sigmoid(z) : activation === "tanh" ? g.tanh(z) : g.relu(z);
    taps.push(h);
  }
  const graph = g.build();
  const values = forward(graph, { w });
  const adj = backward(graph, values);
  return taps.slice(0, -1).map((i) => Math.abs(adj[i] ?? 0));
}

// ------------------------------------------------------------- the cost --

/**
 * A layered tanh network with `width` neurons in each of two hidden layers,
 * four inputs and one output, as a graph — big enough that the difference
 * between one backward pass and 2N forward passes can be timed.
 */
export function wideNetwork(
  width: number,
  seed = 1,
): { graph: Graph; params: Record<string, number> } {
  const rng = createRng(seed);
  const g = builder();
  const params: Record<string, number> = {};
  const p = (name: string) => {
    params[name] = (rng() * 2 - 1) * 0.5;
    return g.param(name);
  };
  let layer = [0.3, -0.7, 0.5, 0.1].map((v, i) => g.constant(v, `x${i}`));
  for (const [l, size] of [
    [1, width],
    [2, width],
  ] as const) {
    layer = Array.from({ length: size }, (_, j) => {
      let sum = p(`b${l}_${j}`);
      layer.forEach((inp, k) => (sum = g.add(sum, g.mul(p(`w${l}_${j}_${k}`), inp))));
      return g.tanh(sum);
    });
  }
  let out = p("c");
  layer.forEach((inp, k) => (out = g.add(out, g.mul(p(`v_${k}`), inp))));
  return { graph: g.build(), params };
}
