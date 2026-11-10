import { createRng } from "@/lib/random";

export interface Point {
  x: number;
  y: number;
  label: 0 | 1;
}

/** Three independent, deterministic streams. Dataset parameters never depend on k. */
export function dataset(seed: number, count: number, noise: number): Point[] {
  const random = createRng(seed);
  return Array.from({ length: count }, () => {
    const x = random() * 2 - 1;
    const y = random() * 2 - 1;
    const truth = x * x + y * y < 0.48 ? 1 : 0;
    const label = random() < noise ? 1 - truth : truth;
    return { x, y, label: label as 0 | 1 };
  });
}

/** Odd k prevents vote ties. Exact distance ties retain original input order. */
export function predict(training: readonly Point[], x: number, y: number, k: number): 0 | 1 {
  if (!training.length) throw new Error("Training data is required");
  const neighbours = training
    .map((p, index) => ({ p, index, d: (x - p.x) ** 2 + (y - p.y) ** 2 }))
    .sort((a, b) => a.d - b.d || a.index - b.index)
    .slice(0, Math.min(training.length, Math.max(1, Math.floor(k))));
  return neighbours.reduce((sum, n) => sum + n.p.label, 0) > neighbours.length / 2 ? 1 : 0;
}

export function accuracy(
  training: readonly Point[],
  evaluation: readonly Point[],
  k: number,
): number {
  if (!evaluation.length) throw new Error("Evaluation data is required");
  return (
    evaluation.filter((p) => predict(training, p.x, p.y, k) === p.label).length / evaluation.length
  );
}
