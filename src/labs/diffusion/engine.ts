import { createRng } from "@/lib/random";

export const SIZE = 16;
export const STEPS = 60;
export const SHAPES = ["ring", "cross", "diamond", "bars"] as const;
export function template(shape: number): Float64Array {
  return Float64Array.from({ length: SIZE * SIZE }, (_, i) => {
    const x = (i % SIZE) - 7.5,
      y = Math.floor(i / SIZE) - 7.5;
    const r = Math.hypot(x, y);
    const on =
      shape === 0
        ? r > 3 && r < 5
        : shape === 1
          ? Math.abs(x) < 1.5 || Math.abs(y) < 1.5
          : shape === 2
            ? Math.abs(x) + Math.abs(y) < 6
            : Math.abs(x) > 2 && Math.abs(x) < 5;
    return on ? 1 : -1;
  });
}
export const TEMPLATES = SHAPES.map((_, i) => template(i));
/** Cumulative signal fraction; starts clean, ends near (not exactly at) zero. */
export const alpha = (t: number): number =>
  Math.cos((t / STEPS) * Math.acos(Math.sqrt(0.0001))) ** 2;
export function noise(seed: number): Float64Array {
  const rng = createRng(seed);
  return Float64Array.from(
    { length: SIZE * SIZE },
    () => Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-12))) * Math.cos(2 * Math.PI * rng()),
  );
}
export function corrupt(clean: ArrayLike<number>, t: number, seed: number): Float64Array {
  const a = alpha(t),
    z = noise(seed);
  return Float64Array.from(clean, (v, i) => Math.sqrt(a) * v + Math.sqrt(1 - a) * z[i]!);
}
/** Exact Bayes posterior under a uniform, four-template prior and Gaussian noise.
 * This is an analytical teaching oracle, not a trained neural network. */
export function estimate(sample: Float64Array, t: number, allowed = [0, 1, 2, 3]) {
  if (!allowed.length) throw new Error("At least one template is required");
  const a = alpha(t),
    variance = Math.max(1 - a, 1e-10);
  const logits = allowed.map(
    (id) =>
      -sample.reduce((sum, v, i) => sum + (v - Math.sqrt(a) * TEMPLATES[id]![i]!) ** 2, 0) /
      (2 * variance),
  );
  const max = Math.max(...logits),
    exp = logits.map((v) => Math.exp(v - max)),
    total = exp.reduce((x, y) => x + y, 0);
  const weights = exp.map((v) => v / total);
  const clean = Float64Array.from(sample, (_, i) =>
    allowed.reduce((sum, id, j) => sum + weights[j]! * TEMPLATES[id]![i]!, 0),
  );
  return { clean, weights, allowed };
}
/** Deterministic DDIM update (eta=0), using the posterior mean as x0 estimate.
 * The reverse step receives no original template and no original noise seed. */
export function reverse(sample: Float64Array, t: number, allowed?: number[]): Float64Array {
  if (t <= 0) return sample.slice();
  const current = alpha(t),
    previous = alpha(t - 1),
    prediction = estimate(sample, t, allowed).clean;
  return Float64Array.from(sample, (v, i) => {
    const epsilon = (v - Math.sqrt(current) * prediction[i]!) / Math.sqrt(1 - current);
    return Math.sqrt(previous) * prediction[i]! + Math.sqrt(1 - previous) * epsilon;
  });
}
