import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/random";
import {
  blockAt,
  createJepa,
  drawSample,
  evaluateKinds,
  fitPixelGuesser,
  gradients,
  guesses,
  guessPixels,
  kindAccuracy,
  makePicture,
  neighboursOf,
  parameterCount,
  patchOf,
  pictures,
  project,
  separation,
  spread,
  trainStep,
  vectorsOf,
  GRID,
  PATCHES,
  PATCH_PIXELS,
  type Jepa,
  type Net,
  type TrainOptions,
} from "./engine";

const SLOW: TrainOptions = { slowCopy: true };
const NONE: TrainOptions = { slowCopy: false };

function trained(seed: number, steps: number, options: TrainOptions): Jepa {
  const model = createJepa(seed);
  const rng = createRng(seed * 77);
  for (let i = 0; i < steps; i++) trainStep(model, rng, options);
  return model;
}

describe("the pictures", () => {
  it("are two regions of two different textures, in pixels between 0 and 1", () => {
    const rng = createRng(5);
    for (let n = 0; n < 50; n++) {
      const p = makePicture(rng);
      expect(new Set(p.textures).size).toBe(2);
      expect(p.textures).toHaveLength(PATCHES);
      for (const v of p.pixels) expect(v >= 0 && v <= 1).toBe(true);
    }
  });

  it("give each patch its own offset, so neighbours of one kind differ pixel by pixel", () => {
    const all = pictures(9, 40);
    let differing = 0;
    let pairs = 0;
    for (const p of all) {
      for (let i = 0; i < PATCHES; i++) {
        for (const n of neighboursOf(i)) {
          if (p.textures[n] !== p.textures[i] || p.textures[i] === "flat") continue;
          pairs++;
          const a = patchOf(p, i);
          const b = patchOf(p, n);
          if (a.some((x, k) => Math.abs(x - b[k]!) > 0.3)) differing++;
        }
      }
    }
    // Copying a neighbour's pixels is usually wrong; its kind is usually right.
    expect(differing / pairs).toBeGreaterThan(0.5);
  });

  it("are cut into 16 patches of 16 numbers, with neighbours and 2×2 blocks", () => {
    expect(patchOf(makePicture(createRng(1)), 0)).toHaveLength(PATCH_PIXELS);
    expect(neighboursOf(0).sort()).toEqual([1, GRID]);
    expect(neighboursOf(5).sort((a, b) => a - b)).toEqual([1, 4, 6, 9]);
    expect(blockAt(1, 2)).toEqual([9, 10, 13, 14]);
  });
});

describe("backpropagation", () => {
  /** Every learned number of a network, one after another, as references. */
  const slots = (net: Net) => [net.w1, net.b1, net.w2, net.b2];

  for (const [name, options] of [
    ["with the slow copy", SLOW],
    ["without it", NONE],
  ] as const) {
    it(`agrees with finite differences ${name}`, () => {
      const model = createJepa(3);
      // Make the slow copy differ from E, so the two cases really differ.
      const rng = createRng(4);
      for (let i = 0; i < 5; i++) trainStep(model, rng, SLOW);
      const samples = Array.from({ length: 3 }, () => drawSample(createRng(11)));
      const grad = gradients(model, samples, options);
      const h = 1e-6;
      for (const [net, g] of [
        [model.encoder, grad.encoder],
        [model.predictor, grad.predictor],
      ] as const) {
        const params = slots(net);
        const derivs = slots(g);
        for (let p = 0; p < params.length; p++) {
          const w = params[p]!;
          for (const i of [0, Math.floor(w.length / 2), w.length - 1]) {
            const keep = w[i]!;
            w[i] = keep + h;
            const up = gradients(model, samples, options).loss;
            w[i] = keep - h;
            const down = gradients(model, samples, options).loss;
            w[i] = keep;
            const numeric = (up - down) / (2 * h);
            expect(derivs[p]![i]!).toBeCloseTo(numeric, 6);
          }
        }
      }
    });
  }
});

describe("the slow copy", () => {
  it("detaches the online target independently of EMA", () => {
    const model = createJepa(7);
    const rng = createRng(8);
    const batch = Array.from({ length: 4 }, () => drawSample(rng));
    // At initialization EMA and online encoders are identical. Detaching either
    // must give the same gradient, while differentiating the target must not.
    const detached = gradients(model, batch, { slowCopy: false, stopGradient: true });
    const ema = gradients(model, batch, SLOW);
    const joint = gradients(model, batch, { slowCopy: false, stopGradient: false });
    expect(Array.from(detached.encoder.w1)).toEqual(Array.from(ema.encoder.w1));
    expect(Array.from(detached.predictor.w1)).toEqual(Array.from(joint.predictor.w1));
    expect(Array.from(detached.encoder.w1)).not.toEqual(Array.from(joint.encoder.w1));
    trainStep(model, rng, { slowCopy: false, stopGradient: true });
    expect(Array.from(model.target.w1)).toEqual(Array.from(model.encoder.w1));
  });
  it("is never trained: after a step it is exactly 99% itself and 1% the new E", () => {
    const model = createJepa(2);
    const before = model.target.w1.slice();
    trainStep(model, createRng(3), SLOW);
    for (let i = 0; i < before.length; i++) {
      expect(model.target.w1[i]!).toBeCloseTo(0.99 * before[i]! + 0.01 * model.encoder.w1[i]!, 12);
    }
  });

  it("is simply E when switched off", () => {
    const model = createJepa(2);
    trainStep(model, createRng(3), NONE);
    expect(Array.from(model.target.w1)).toEqual(Array.from(model.encoder.w1));
  });

  it("starts as an exact copy of E, and the model learns about five hundred numbers", () => {
    const model = createJepa(1);
    expect(Array.from(model.target.w1)).toEqual(Array.from(model.encoder.w1));
    const learned = parameterCount(model.encoder) + parameterCount(model.predictor);
    expect(learned).toBeGreaterThan(450);
    expect(learned).toBeLessThan(550);
  });
});

describe("what training does", () => {
  const sample = pictures(2000, 30);

  it("pulls each kind together and leaves the offset out, with the slow copy", () => {
    for (const seed of [1, 2, 3, 4]) {
      const start = separation(vectorsOf(createJepa(seed).encoder, sample));
      const model = trained(seed, 2000, SLOW);
      const after = vectorsOf(model.encoder, sample);
      expect(start, `seed ${seed} before`).toBeLessThan(2);
      expect(separation(after), `seed ${seed} after`).toBeGreaterThan(4);
      expect(spread(after), `seed ${seed} spread`).toBeGreaterThan(0.1);
    }
  });

  it("collapses without it: every vector the same, the loss gone, nothing learned", () => {
    for (const seed of [1, 2, 3]) {
      const model = trained(seed, 1500, NONE);
      const after = vectorsOf(model.encoder, sample);
      expect(spread(after), `seed ${seed} spread`).toBeLessThan(0.03);
      expect(separation(after), `seed ${seed} separation`).toBeLessThan(1.5);
      const loss = gradients(
        model,
        Array.from({ length: 20 }, () => drawSample(createRng(seed))),
        NONE,
      ).loss;
      expect(loss, `seed ${seed} loss`).toBeLessThan(0.001);
    }
  });
});

describe("meaning, not pixels", () => {
  const samples = (seed: number) => {
    const rng = createRng(seed);
    return Array.from({ length: 80 }, () => drawSample(rng));
  };

  it("reports difficult boundary cases instead of dropping them from overall accuracy", () => {
    const model = createJepa(2);
    const probe = samples(17);
    const reference = vectorsOf(model.target, pictures(3, 12));
    const score = evaluateKinds(model, probe, reference);
    const predicted = probe.reduce((n, s) => n + guesses(model, s.picture, s.hidden).length, 0);
    expect(score.all.total).toBe(predicted);
    expect(score.interior.total).toBeGreaterThan(0);
    expect(score.boundary.total).toBeGreaterThan(0);
    expect(score.all.total).toBe(score.interior.total + score.boundary.total);
    expect(score.all.right).toBe(score.interior.right + score.boundary.right);
    expect(score.all.accuracy).toBe(score.all.right / score.all.total);
    expect(score.unavailable + score.all.total).toBe(probe.length * 4);
  });

  it("reports an empty probe with zero counts instead of NaN", () => {
    const score = evaluateKinds(createJepa(1), [], []);
    expect(score.all).toEqual({ right: 0, total: 0, accuracy: 0 });
    expect(score.boundary).toEqual(score.all);
    expect(score.unavailable).toBe(0);
  });

  it("guesses the kind of a hidden patch from its neighbours, from the lab's start", () => {
    // Seed 1 is where the lab starts; it keeps all four kinds apart.
    const model = trained(1, 3000, SLOW);
    const reference = vectorsOf(model.target, pictures(3000, 30));
    expect(kindAccuracy(model, samples(17), reference)).toBeGreaterThan(0.95);
    // Untrained, the guess is no better than a few lucky kinds.
    const raw = createJepa(1);
    expect(kindAccuracy(raw, samples(17), vectorsOf(raw.target, pictures(3000, 30)))).toBeLessThan(
      0.7,
    );
  });

  it("can merge two kinds on another start, and the guess shows it where the loss does not", () => {
    const model = trained(4, 3000, SLOW);
    const reference = vectorsOf(model.target, pictures(3000, 30));
    expect(kindAccuracy(model, samples(17), reference)).toBeLessThan(0.85);
    expect(separation(vectorsOf(model.encoder, pictures(2000, 30)))).toBeGreaterThan(4);
  });

  it("while predicting pixels paints a stripe grey", () => {
    const guesser = fitPixelGuesser(5);
    const rng = createRng(23);
    const contrast = (v: Float64Array) => Math.max(...v) - Math.min(...v);
    let checked = 0;
    while (checked < 40) {
      const { picture, hidden } = drawSample(rng);
      for (const h of hidden) {
        const kind = picture.textures[h];
        if (kind !== "horizontal" && kind !== "vertical") continue;
        const guess = guessPixels(guesser, picture, hidden, h);
        if (!guess) continue;
        checked++;
        expect(contrast(patchOf(picture, h))).toBeGreaterThan(0.6);
        // A real stripe spans about 0.8; the guess hedges between offsets.
        expect(contrast(guess)).toBeLessThan(0.45);
      }
    }
  });
});

describe("the map", () => {
  it("lays the vectors on two perpendicular directions, and keeps them facing the same way", () => {
    const vectors = vectorsOf(trained(1, 300, SLOW).encoder, pictures(1, 10));
    const { axes } = project(vectors);
    const [a, b] = axes;
    const dot = (x: Float64Array, y: Float64Array) => x.reduce((n, v, i) => n + v * y[i]!, 0);
    expect(dot(a, a)).toBeCloseTo(1, 9);
    expect(dot(b, b)).toBeCloseTo(1, 9);
    expect(dot(a, b)).toBeCloseTo(0, 6);
    const flipped = project(vectors, [a.map((x) => -x), b.map((x) => -x)]);
    expect(dot(flipped.axes[0], a)).toBeLessThan(0);
    expect(dot(flipped.axes[1], b)).toBeLessThan(0);
  });
});
