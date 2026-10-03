import { describe, expect, it } from "vitest";
import { generateDataset, type Point } from "./datasets";
import { createMlp, evaluate, forward, maxAbsWeight, trainEpoch, type Mlp } from "./engine";

/** Every learnable parameter, flattened — the thing "same seed" has to reproduce. */
const parameters = (net: Mlp): number[] => [
  ...net.weights.flatMap((w) => Array.from(w)),
  ...net.biases.flatMap((b) => Array.from(b)),
];

const allFinite = (values: readonly number[]): boolean => values.every(Number.isFinite);

const train = (net: Mlp, points: readonly Point[], epochs: number, lr = 0.1): void => {
  for (let i = 0; i < epochs; i++) trainEpoch(net, points, lr, 10, 0);
};

const GAUSS = generateDataset("gauss", 120, 0.1, 42);
const XOR = generateDataset("xor", 160, 0.06, 3);

describe("initialization", () => {
  it("is identical for the same seed and architecture", () => {
    const a = createMlp([2, 5, 3, 1], "tanh", 7);
    const b = createMlp([2, 5, 3, 1], "tanh", 7);
    expect(parameters(a)).toEqual(parameters(b));
  });

  it("differs for a different seed", () => {
    const a = createMlp([2, 5, 1], "tanh", 7);
    const b = createMlp([2, 5, 1], "tanh", 8);
    expect(parameters(a)).not.toEqual(parameters(b));
  });

  it("starts with finite, non-degenerate weights and zero biases", () => {
    const net = createMlp([2, 6, 1], "tanh", 3);
    expect(allFinite(parameters(net))).toBe(true);
    expect(maxAbsWeight(net)).toBeGreaterThan(0);
    expect(net.biases.every((b) => b.every((v) => v === 0))).toBe(true);
    expect(net.epoch).toBe(0);
  });
});

describe("shape", () => {
  it("allocates one weight matrix per connection layer, sized fanOut × fanIn", () => {
    const sizes = [2, 5, 3, 1];
    const net = createMlp(sizes, "tanh", 1);
    expect(net.weights).toHaveLength(sizes.length - 1);
    net.weights.forEach((w, l) => {
      expect(w.length).toBe((sizes[l + 1] ?? 0) * (sizes[l] ?? 0));
    });
    net.biases.forEach((b, l) => expect(b.length).toBe(sizes[l + 1] ?? 0));
    net.acts.forEach((a, l) => expect(a.length).toBe(sizes[l] ?? 0));
  });

  it("returns a single output and records the input it was given", () => {
    const net = createMlp([2, 4, 1], "tanh", 1);
    const out = forward(net, 0.3, -0.7);
    expect(typeof out).toBe("number");
    expect(net.acts[0]?.[0]).toBe(0.3);
    expect(net.acts[0]?.[1]).toBe(-0.7);
    expect(net.acts[net.sizes.length - 1]?.[0]).toBe(out);
  });
});

describe("forward pass", () => {
  it("produces finite outputs inside the tanh range across the whole input square", () => {
    for (const activation of ["tanh", "relu", "sigmoid"] as const) {
      const net = createMlp([2, 6, 6, 1], activation, 11);
      for (let x = -1; x <= 1; x += 0.25) {
        for (let y = -1; y <= 1; y += 0.25) {
          const out = forward(net, x, y);
          expect(Number.isFinite(out)).toBe(true);
          expect(Math.abs(out)).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("is a pure function of the input for fixed weights", () => {
    const net = createMlp([2, 4, 1], "tanh", 5);
    const first = forward(net, 0.5, 0.5);
    forward(net, -0.9, 0.1);
    expect(forward(net, 0.5, 0.5)).toBe(first);
  });
});

describe("training", () => {
  it("reduces loss on a linearly separable dataset", () => {
    const net = createMlp([2, 4, 1], "tanh", 13);
    const before = evaluate(net, GAUSS);
    train(net, GAUSS, 200);
    const after = evaluate(net, GAUSS);
    expect(after.loss).toBeLessThan(before.loss * 0.5);
    expect(after.accuracy).toBeGreaterThan(0.95);
  });

  it("counts one epoch per pass", () => {
    const net = createMlp([2, 4, 1], "tanh", 13);
    train(net, GAUSS, 25);
    expect(net.epoch).toBe(25);
  });

  it("keeps every parameter finite, for every activation", () => {
    // Gradients are zeroed as they are applied, so their health is only
    // observable through the weights: one NaN gradient poisons them forever.
    for (const activation of ["tanh", "relu", "sigmoid"] as const) {
      const net = createMlp([2, 6, 6, 1], activation, 17);
      train(net, XOR, 150);
      expect(allFinite(parameters(net))).toBe(true);
    }
  });

  it("clears the gradient accumulators after each epoch", () => {
    // Stale gradients leaking into the next step would corrupt training
    // silently, so the buffers must come back to zero.
    const net = createMlp([2, 5, 1], "tanh", 19);
    train(net, GAUSS, 3);
    const residual = [
      ...net.gradW.flatMap((g) => Array.from(g)),
      ...net.gradB.flatMap((g) => Array.from(g)),
    ];
    expect(residual.every((v) => v === 0)).toBe(true);
  });

  it("does not mutate the dataset it is given", () => {
    const points = generateDataset("circle", 80, 0.1, 99);
    const before = JSON.stringify(points);
    const net = createMlp([2, 5, 1], "tanh", 23);
    train(net, points, 40);
    evaluate(net, points);
    expect(points).toHaveLength(80);
    expect(JSON.stringify(points)).toBe(before);
  });

  it("is reproducible end to end from the seed", () => {
    const a = createMlp([2, 5, 1], "tanh", 29);
    const initial = parameters(a);
    train(a, GAUSS, 60);
    const trained = parameters(a);
    expect(trained).not.toEqual(initial);

    // Recreating from the same seed rewinds to the exact starting point,
    // and repeating the run lands on the exact same weights.
    const b = createMlp([2, 5, 1], "tanh", 29);
    expect(parameters(b)).toEqual(initial);
    train(b, GAUSS, 60);
    expect(parameters(b)).toEqual(trained);
  });

  it("is a no-op on an empty dataset", () => {
    const net = createMlp([2, 4, 1], "tanh", 31);
    const before = parameters(net);
    trainEpoch(net, [], 0.1, 10, 0);
    expect(parameters(net)).toEqual(before);
  });
});

describe("evaluate", () => {
  it("reports loss and accuracy in their valid ranges", () => {
    const net = createMlp([2, 5, 1], "tanh", 37);
    const score = evaluate(net, GAUSS);
    expect(score.loss).toBeGreaterThanOrEqual(0);
    expect(score.accuracy).toBeGreaterThanOrEqual(0);
    expect(score.accuracy).toBeLessThanOrEqual(1);
  });

  it("returns zeros for an empty set rather than NaN", () => {
    const net = createMlp([2, 5, 1], "tanh", 41);
    expect(evaluate(net, [])).toEqual({ loss: 0, accuracy: 0 });
  });
});

describe("the claim the lab is built on: XOR needs a hidden layer", () => {
  it("cannot be solved by a single neuron", () => {
    const flat = createMlp([2, 1], "tanh", 4);
    train(flat, XOR, 900);
    // No straight line separates opposite corners — it stalls near a coin flip.
    expect(evaluate(flat, XOR).accuracy).toBeLessThan(0.8);
  });

  it("is solved once a hidden layer is added", () => {
    const deep = createMlp([2, 4, 1], "tanh", 4);
    train(deep, XOR, 900);
    expect(evaluate(deep, XOR).accuracy).toBeGreaterThan(0.95);
  });
});
