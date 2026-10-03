import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  argmax,
  asKernel,
  centred,
  convolve,
  correlate,
  dependencies,
  descend,
  extent,
  flip,
  fromPicture,
  fromRows,
  grid,
  layerSizes,
  leftover,
  loss,
  maxDifference,
  outputSize,
  prepareFit,
  receptiveField,
  respond,
  shift,
  stamp,
  sum,
  terms,
  toRows,
  weightCounts,
  type Grid,
  type Layer,
} from "./engine";
import {
  BOX_BLUR,
  DISTRACTORS,
  LAPLACIAN,
  LETTER_T,
  PLUS,
  PLUS_DETECTOR,
  PREWITT,
  SOBEL_X,
  texturedScene,
} from "./pictures";

const random = (width: number, height: number, seed: number, whole = false): Grid => {
  const rng = createRng(seed);
  const g = grid(width, height);
  for (let k = 0; k < g.data.length; k++) {
    g.data[k] = whole ? Math.floor(rng() * 7) - 3 : rng() * 2 - 1;
  }
  return g;
};

/**
 * The definition, written out with no shared code: pad the image into a
 * bigger array, then visit every window position one stride at a time.
 */
function bruteForce(image: Grid, kernel: Grid, padding: number, stride: number): number[][] {
  const pw = image.width + 2 * padding;
  const ph = image.height + 2 * padding;
  const padded: number[][] = Array.from({ length: ph }, () => new Array<number>(pw).fill(0));
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const row = padded[y + padding];
      if (row) row[x + padding] = image.data[y * image.width + x] ?? 0;
    }
  }
  const rows: number[][] = [];
  for (let top = 0; top + kernel.height <= ph; top += stride) {
    const row: number[] = [];
    for (let left = 0; left + kernel.width <= pw; left += stride) {
      let s = 0;
      for (let u = 0; u < kernel.height; u++) {
        for (let v = 0; v < kernel.width; v++) {
          s += (kernel.data[u * kernel.width + v] ?? 0) * (padded[top + u]?.[left + v] ?? 0);
        }
      }
      row.push(s);
    }
    rows.push(row);
  }
  return rows;
}

describe("output size", () => {
  it("is ⌊(n + 2p − k)/s⌋ + 1, counted position by position", () => {
    for (let n = 1; n <= 12; n++) {
      for (let k = 1; k <= 7; k++) {
        for (let p = 0; p <= 3; p++) {
          for (let s = 1; s <= 4; s++) {
            let count = 0;
            for (let start = 0; start + k <= n + 2 * p; start += s) count++;
            expect({ n, k, p, s, size: outputSize(n, k, p, s) }).toEqual({
              n,
              k,
              p,
              s,
              size: count,
            });
          }
        }
      }
    }
  });

  it("matches the worked cases in Dumoulin & Visin", () => {
    // No padding, unit stride: 4 → 2 with a 3×3 kernel.
    expect(outputSize(4, 3)).toBe(2);
    // Half ("same") padding keeps the size.
    expect(outputSize(5, 3, 1, 1)).toBe(5);
    // Full padding grows it: n + k − 1.
    expect(outputSize(5, 3, 2, 1)).toBe(7);
    // Stride 2 with padding 1 on 5 → 3, and on 6 → 3 with one cell left over.
    expect(outputSize(5, 3, 1, 2)).toBe(3);
    expect(outputSize(6, 3, 1, 2)).toBe(3);
    expect(leftover(6, 3, 1, 2)).toBe(1);
    expect(leftover(5, 3, 1, 2)).toBe(0);
  });

  it("is zero when the kernel does not fit", () => {
    expect(outputSize(2, 3)).toBe(0);
    expect(correlate(grid(2, 2, 1), PREWITT).data.length).toBe(0);
  });
});

describe("correlate", () => {
  it("agrees with the definition for every padding and stride", () => {
    let seed = 1;
    for (const [w, h] of [
      [5, 5],
      [7, 4],
      [9, 9],
    ] as const) {
      for (const [kw, kh] of [
        [3, 3],
        [2, 3],
        [5, 5],
        [1, 1],
      ] as const) {
        for (let p = 0; p <= 2; p++) {
          for (let s = 1; s <= 3; s++) {
            const image = random(w, h, seed++);
            const kernel = random(kw, kh, seed++);
            const ours = toRows(correlate(image, kernel, { padding: p, stride: s }));
            const theirs = bruteForce(image, kernel, p, s);
            expect(ours.length).toBe(theirs.length);
            ours.forEach((row, i) =>
              row.forEach((v, j) => expect(v).toBeCloseTo(theirs[i]?.[j] ?? NaN, 12)),
            );
          }
        }
      }
    }
  });

  it("explains each cell as the sum of its terms", () => {
    const image = random(8, 8, 99, true);
    const kernel = random(3, 3, 100, true);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const parts = terms(image, kernel, j, i, { padding: 1, stride: 2 });
        expect(parts).toHaveLength(9);
        const total = parts.reduce((s, t) => s + t.weight * t.pixel, 0);
        expect(total).toBe(respond(image, kernel, j, i, { padding: 1, stride: 2 }));
      }
    }
  });

  it("is not convolution: the two differ by exactly a flip of the kernel", () => {
    const image = random(8, 8, 3);
    const kernel = random(3, 3, 4);
    expect(maxDifference(convolve(image, kernel), correlate(image, flip(kernel)))).toBe(0);
    expect(maxDifference(convolve(image, kernel), correlate(image, kernel))).toBeGreaterThan(0.1);
    // A symmetric kernel cannot tell them apart.
    expect(maxDifference(convolve(image, LAPLACIAN), correlate(image, LAPLACIAN))).toBe(0);
  });

  it("shifts an image right with a single 1 on the kernel's left", () => {
    const image = random(8, 8, 5);
    const left = fromRows([
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]);
    expect(maxDifference(correlate(image, left, { padding: 1 }), shift(image, 1, 0))).toBe(0);
    // The textbook operation needs it on the right.
    expect(maxDifference(convolve(image, flip(left), { padding: 1 }), shift(image, 1, 0))).toBe(0);
    expect(maxDifference(correlate(image, flip(left), { padding: 1 }), shift(image, -1, 0))).toBe(
      0,
    );
  });
});

describe("the hero", () => {
  const out = correlate(LETTER_T, PREWITT);

  it("has a 7×7 output of whole numbers", () => {
    expect([out.width, out.height]).toEqual([7, 7]);
    for (const v of out.data) expect(Number.isInteger(v)).toBe(true);
  });

  it("lights the stem's two sides with opposite signs and ignores the flat top", () => {
    const rows = toRows(out);
    // Row 4 of the output sits on the stem only (input rows 4–6).
    expect(rows[4]).toEqual([0, 3, 3, -3, -3, 0, 0]);
    // Inside the bar the window is uniform, so the weights cancel.
    expect(rows[0]?.[3]).toBe(0);
    expect(extent(out)).toEqual({ min: -3, max: 3 });
  });
});

describe("kernels on a flat image", () => {
  const flat = grid(6, 6, 0.4);
  it("multiply the brightness by the sum of the weights", () => {
    for (const kernel of [PREWITT, SOBEL_X, BOX_BLUR, LAPLACIAN]) {
      const out = correlate(flat, kernel);
      for (const v of out.data) expect(v).toBeCloseTo(0.4 * sum(kernel), 12);
    }
    expect(sum(BOX_BLUR)).toBeCloseTo(1, 15);
    expect(sum(SOBEL_X)).toBe(0);
  });
});

describe("the same weights everywhere", () => {
  it("move the output exactly as far as the input moved", () => {
    const field = stamp(grid(16, 16), PLUS, 4, 5);
    const before = correlate(field, PLUS_DETECTOR, { padding: 2 });
    for (const [dx, dy] of [
      [1, 0],
      [3, 2],
      [-2, 4],
    ] as const) {
      const moved = correlate(shift(field, dx, dy), PLUS_DETECTOR, { padding: 2 });
      expect(maxDifference(moved, shift(before, dx, dy))).toBe(0);
    }
  });

  it("score a plus 9, the most a window can, and reject the decoys", () => {
    let field = grid(16, 16);
    field = stamp(field, DISTRACTORS.x, 1, 1);
    field = stamp(field, DISTRACTORS.block, 11, 2);
    field = stamp(field, DISTRACTORS.bar, 2, 12);
    field = stamp(field, PLUS, 9, 9);
    const out = correlate(field, PLUS_DETECTOR, { padding: 2 });
    expect(argmax(out)).toEqual({ x: 11, y: 11, value: 9 });
    // Only one cell reaches 9.
    expect([...out.data].filter((v) => v === 9)).toHaveLength(1);
    // A solid 5×5 block contains the plus and still scores 9 − 16.
    expect(respond(grid(5, 5, 1), PLUS_DETECTOR, 0, 0)).toBe(-7);
    // The X shares only its centre with the plus.
    expect(respond(DISTRACTORS.x, PLUS_DETECTOR, 0, 0)).toBe(1 - 8);
  });

  it("need k² weights where a dense layer needs n² × n²", () => {
    expect(weightCounts(16, 5, 2)).toEqual({ convolution: 25, dense: 65536 });
    expect(weightCounts(28, 3)).toEqual({ convolution: 9, dense: 784 * 676 });
  });
});

describe("receptive field", () => {
  const same = (stride: number): Layer => ({ kernel: 3, stride, padding: 1 });

  it("grows by k − 1 per layer at stride 1", () => {
    expect(receptiveField([same(1)]).size).toBe(3);
    expect(receptiveField([same(1), same(1)]).size).toBe(5);
    expect(receptiveField([same(1), same(1), same(1)]).size).toBe(7);
  });

  it("grows faster after a stride, by the product of the strides below", () => {
    expect(receptiveField([same(2), same(1)]).size).toBe(7);
    expect(receptiveField([same(2), same(2), same(1)]).size).toBe(15);
    expect(receptiveField([same(1), same(2)])).toEqual({ size: 5, jump: 2 });
  });

  it("is exactly the set of inputs that change the output, found by perturbing them", () => {
    const stacks: Layer[][] = [
      [same(1), same(1)],
      [same(2), same(1), same(2)],
      [same(1), same(2), same(2), same(1)],
      [{ kernel: 5, stride: 2, padding: 2 }, same(1)],
    ];
    let seed = 40;
    for (const layers of stacks) {
      const n = 32;
      const kernels = layers.map((l) => random(l.kernel, 1, seed++));
      const run = (input: Grid): Grid =>
        layers.reduce((x, l, i) => rowPass(x, l, kernels[i]), input);
      // One row, so the convolution is one-dimensional along x.
      const base = random(n, 1, seed++);
      const out = run(base);
      const index = Math.floor(out.width / 2);
      const touched: number[] = [];
      for (let x = 0; x < n; x++) {
        const nudged = base.data.slice();
        nudged[x] = (nudged[x] ?? 0) + 1;
        const changed = run({ width: n, height: 1, data: nudged });
        if (Math.abs((changed.data[index] ?? 0) - (out.data[index] ?? 0)) > 1e-12) touched.push(x);
      }
      const range = dependencies(layers, index).at(-1);
      expect(touched[0]).toBe(range?.from);
      expect(touched.at(-1)).toBe(range?.to);
      expect(touched.length).toBe(receptiveField(layers).size);
    }

    function rowPass(x: Grid, layer: Layer, kernel: Grid | undefined): Grid {
      // Pad along x only: a 1-row image must not pick up vertical padding.
      const k = kernel ?? grid(1, 1);
      const padded = grid(x.width + 2 * layer.padding, 1);
      padded.data.set(x.data, layer.padding);
      return correlate(padded, k, { padding: 0, stride: layer.stride });
    }
  });

  it("gives every layer's size", () => {
    expect(layerSizes(16, [same(1), same(2), same(2)])).toEqual([16, 16, 8, 4]);
  });
});

describe("learning a kernel", () => {
  const image = centred(texturedScene(24));
  const fit = (target: Grid) => prepareFit(image, correlate(image, target), 3);

  it("finds the hidden kernel from zero, every time", () => {
    for (const hidden of [SOBEL_X, BOX_BLUR, LAPLACIAN]) {
      const problem = fit(hidden);
      let w = new Float64Array(9);
      let previous = loss(problem, w);
      for (let step = 0; step < 800; step++) {
        w = descend(problem, w);
        const now = loss(problem, w);
        // The safe step never makes things worse.
        expect(now).toBeLessThanOrEqual(previous + 1e-15);
        previous = now;
      }
      expect(maxDifference(asKernel(w, 3), hidden)).toBeLessThan(1e-3);
      expect(previous).toBeLessThan(1e-8);
    }
  });

  it("overshoots when the step is more than twice the safe one", () => {
    const problem = fit(SOBEL_X);
    let w = new Float64Array(9);
    const start = loss(problem, w);
    for (let step = 0; step < 60; step++) w = descend(problem, w, 2.2);
    expect(loss(problem, w)).toBeGreaterThan(start);
  });

  it("crawls on the raw image, which is why it is centred first", () => {
    const raw = texturedScene(24);
    const slow = prepareFit(raw, correlate(raw, LAPLACIAN), 3);
    const fast = fit(LAPLACIAN);
    let a = new Float64Array(9);
    let b = new Float64Array(9);
    for (let step = 0; step < 400; step++) {
      a = descend(slow, a);
      b = descend(fast, b);
    }
    expect(maxDifference(asKernel(a, 3), LAPLACIAN)).toBeGreaterThan(0.5);
    expect(maxDifference(asKernel(b, 3), LAPLACIAN)).toBeLessThan(0.01);
  });

  it("starts from a target that is the hidden kernel's own output", () => {
    const problem = fit(SOBEL_X);
    expect(loss(problem, SOBEL_X.data)).toBeLessThan(1e-24);
  });
});

describe("grids", () => {
  it("reads pictures, rows and stamps", () => {
    expect(toRows(fromPicture(["#.", ".#"]))).toEqual([
      [1, 0],
      [0, 1],
    ]);
    expect(() => fromRows([[1, 2], [3]])).toThrow(RangeError);
    const s = stamp(grid(3, 3), fromPicture(["##"]), 2, 1);
    expect(toRows(s)).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0],
    ]);
  });

  it("finds the first maximum in reading order", () => {
    expect(
      argmax(
        fromRows([
          [0, 2],
          [2, 1],
        ]),
      ),
    ).toEqual({ x: 1, y: 0, value: 2 });
  });
});
