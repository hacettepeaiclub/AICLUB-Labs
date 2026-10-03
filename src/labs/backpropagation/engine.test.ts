import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  aimStep,
  backward,
  builder,
  chain,
  consumers,
  depthGradients,
  evaluate,
  forward,
  gradient,
  LEDGER_PARAMS,
  ledgerGraph,
  network,
  NETWORK_PARAMS,
  networkLoss,
  numericGradient,
  parameterNodes,
  wideNetwork,
  type Graph,
  type Params,
} from "./engine";

const randomParams = (names: readonly string[], seed: number): Record<string, number> => {
  const rng = createRng(seed);
  return Object.fromEntries(names.map((n) => [n, rng() * 2 - 1]));
};

/** Backprop and central differences, parameter by parameter. */
function expectAgreement(graph: Graph, params: Params, tolerance = 1e-7) {
  const analytic = gradient(graph, params);
  for (const name of parameterNodes(graph).keys()) {
    const numeric = numericGradient(graph, params, name);
    const scale = Math.max(1, Math.abs(numeric));
    expect({ name, off: Math.abs((analytic[name] ?? NaN) - numeric) / scale < tolerance }).toEqual({
      name,
      off: true,
    });
  }
}

describe("every operation's derivative", () => {
  it("matches central differences", () => {
    const ops = ["add", "sub", "mul", "square", "tanh", "sigmoid", "relu", "scale"] as const;
    const rng = createRng(3);
    for (const op of ops) {
      for (let t = 0; t < 50; t++) {
        const g = builder();
        const a = g.param("a");
        const b = g.param("b");
        if (op === "add") g.add(a, b);
        else if (op === "sub") g.sub(a, b);
        else if (op === "mul") g.mul(a, b);
        else if (op === "scale") g.scale(a, -2.5);
        else g[op](a);
        let pa = rng() * 4 - 2;
        // ReLU has no derivative at 0; keep the check away from the kink.
        if (op === "relu" && Math.abs(pa) < 1e-3) pa = 0.5;
        expectAgreement(g.build(), { a: pa, b: rng() * 4 - 2 });
      }
    }
  });
});

describe("the page's graphs", () => {
  it("the network, at random weights and inputs", () => {
    for (let t = 0; t < 200; t++) {
      const rng = createRng(100 + t);
      const { graph } = network(rng() * 2 - 1, rng() * 2 - 1);
      expectAgreement(graph, randomParams(NETWORK_PARAMS, t));
      expectAgreement(networkLoss(rng(), rng(), rng()), randomParams(NETWORK_PARAMS, t + 1000));
    }
  });

  it("the ledger, including the fork at w", () => {
    const graph = ledgerGraph();
    expectAgreement(graph, LEDGER_PARAMS);
    // By hand: ∂L/∂w = 2(h − y)(1 − h²)x + 0.2w.
    const { w, b } = LEDGER_PARAMS as { w: number; b: number };
    const h = Math.tanh(w * 1.5 + b);
    const byHand = 2 * (h - 0.8) * (1 - h * h) * 1.5 + 0.2 * w;
    expect(gradient(graph, LEDGER_PARAMS).w).toBeCloseTo(byHand, 14);
    // w has exactly two readers: the product and the penalty.
    const wNode = parameterNodes(graph).get("w") ?? -1;
    expect(consumers(graph)[wNode]).toHaveLength(2);
  });

  it("a wide network, and every one of its weights", () => {
    const { graph, params } = wideNetwork(6, 2);
    expect(Object.keys(params)).toHaveLength(2 * 6 * 1 + 6 * 4 + 6 * 6 + 6 + 1);
    expectAgreement(graph, params, 1e-6);
  });
});

describe("pulling the output", () => {
  it("lands on the target to first order, and closer as the pull shrinks", () => {
    const { graph } = network(0.6, -0.4);
    const params = randomParams(NETWORK_PARAMS, 7);
    const start = evaluate(graph, params);
    let previous = Infinity;
    for (const pull of [1, 0.1, 0.01, 0.001]) {
      const landed = evaluate(graph, aimStep(graph, params, start + pull));
      const miss = Math.abs(landed - (start + pull));
      // The miss is second order in the pull.
      expect(miss).toBeLessThan(previous / 5);
      expect(miss / pull ** 2).toBeLessThan(5);
      previous = miss;
    }
  });
});

describe("the chain of dials", () => {
  it("multiplies its local derivatives into the derivative of the whole", () => {
    for (const x of [-1.2, -0.3, 0, 0.4, 1.1]) {
      const { product, values } = chain(x);
      const h = 1e-6;
      const numeric = (chain(x + h).values[4] - chain(x - h).values[4]) / (2 * h);
      expect(product).toBeCloseTo(numeric, 8);
      expect(values[4]).toBeCloseTo(2 * Math.tanh(1.5 * x) ** 2 - 1, 15);
    }
  });
});

describe("depth", () => {
  it("shrinks sigmoid gradients by at least a factor of four per layer at w = 1", () => {
    const g = depthGradients(10, "sigmoid", 1);
    expect(g).toHaveLength(10);
    for (let l = 0; l < 9; l++) expect((g[l] ?? 0) / (g[l + 1] ?? 1)).toBeLessThanOrEqual(0.25);
  });

  it("keeps ReLU gradients exactly at w^n while the signal is positive", () => {
    const g = depthGradients(8, "relu", 1);
    for (const v of g) expect(v).toBe(1);
    const grow = depthGradients(8, "relu", 1.5);
    expect(grow[0]).toBeCloseTo(1.5 ** 8, 10);
  });

  it("agrees with central differences on the input of a deep chain", () => {
    for (const act of ["sigmoid", "tanh", "relu"] as const) {
      const depth = 6;
      const f = (x: number) => {
        let h = x;
        for (let l = 0; l < depth; l++) {
          const z = 1.3 * h;
          h =
            act === "sigmoid"
              ? 1 / (1 + Math.exp(-z))
              : act === "tanh"
                ? Math.tanh(z)
                : Math.max(z, 0);
        }
        return h;
      };
      const numeric = (f(0.5 + 1e-6) - f(0.5 - 1e-6)) / 2e-6;
      expect(depthGradients(depth, act, 1.3, 0.5)[0]).toBeCloseTo(Math.abs(numeric), 7);
    }
  });
});

describe("the broken backward passes", () => {
  it("each disagrees with the numeric gradient, and only where it should", () => {
    const net = network(0.6, -0.4);
    const params = randomParams(NETWORK_PARAMS, 11);
    const h2 = net.at.h2;
    const bad = gradient(net.graph, params, { kind: "tanh-as-value", node: h2 });
    const good = gradient(net.graph, params);
    for (const name of NETWORK_PARAMS) {
      const affected = ["w21", "w22", "b2"].includes(name);
      expect({ name, wrong: Math.abs((bad[name] ?? 0) - (good[name] ?? 0)) > 1e-9 }).toEqual({
        name,
        wrong: affected,
      });
    }

    const ledger = ledgerGraph();
    const w = parameterNodes(ledger).get("w") ?? -1;
    const lost = gradient(ledger, LEDGER_PARAMS, { kind: "overwrite", node: w });
    expect(Math.abs((lost.w ?? 0) - (gradient(ledger, LEDGER_PARAMS).w ?? 0))).toBeGreaterThan(
      1e-6,
    );
    expect(lost.b).toBeCloseTo(gradient(ledger, LEDGER_PARAMS).b ?? NaN, 14);

    // Written y − h, the network's value is what the minus sign applies to.
    const turned = ledgerGraph(1.5, 0.8, true);
    expectAgreement(turned, LEDGER_PARAMS);
    expect(evaluate(turned, LEDGER_PARAMS)).toBeCloseTo(evaluate(ledger, LEDGER_PARAMS), 15);
    const sub = turned.nodes.findIndex((n) => n.op === "sub");
    const right = gradient(turned, LEDGER_PARAMS);
    const flipped = gradient(turned, LEDGER_PARAMS, { kind: "sub-sign", node: sub });
    // b reaches the loss only through h, so its gradient comes out exactly negated…
    expect(flipped.b).toBeCloseTo(-(right.b ?? NaN), 14);
    // …while w also has the penalty path, which the bug does not touch.
    expect(flipped.w).not.toBeCloseTo(-(right.w ?? NaN), 6);
    expect(flipped.w).not.toBeCloseTo(right.w ?? NaN, 6);
  });
});

describe("the graph", () => {
  it("refuses to read a node that is not built yet", () => {
    const g = builder();
    expect(() => g.add(0, 1)).toThrow(RangeError);
  });

  it("starts the backward pass at 1 on the root", () => {
    const g = builder();
    const a = g.param("a");
    g.square(a);
    const graph = g.build();
    const adj = backward(graph, forward(graph, { a: 3 }));
    expect([...adj]).toEqual([6, 1]);
  });
});

describe("the zoom section's weight", () => {
  it("has a loss that is not a parabola, so the measured slope really converges", () => {
    const graph = networkLoss(0.8, -0.5, 1.2);
    const params = {
      w11: 0.9,
      w12: -0.6,
      b1: 0.1,
      w21: -0.4,
      w22: 0.8,
      b2: -0.2,
      v1: 0.7,
      v2: -0.5,
      c: 0.05,
    };
    const at = (w: number) => evaluate(graph, { ...params, w11: w });
    const slope = gradient(graph, params).w11 ?? 0;
    const gaps = [3, 0.3, 0.03, 0.003].map((h) =>
      Math.abs((at(0.9 + h) - at(0.9 - h)) / (2 * h) - slope),
    );
    expect(gaps[0]).toBeGreaterThan(0.01);
    for (let i = 1; i < gaps.length; i++)
      expect(gaps[i] ?? 1).toBeLessThan((gaps[i - 1] ?? 0) / 20);
  });
});
