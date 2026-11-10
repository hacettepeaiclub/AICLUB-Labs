import { expect, it } from "vitest";
import { alpha, corrupt, estimate, noise, reverse, STEPS, TEMPLATES } from "./engine";
it("preserves the source at zero noise and generates reproducible samples", () => {
  expect(corrupt(TEMPLATES[0]!, 0, 7)).toEqual(TEMPLATES[0]);
  expect(noise(7)).toEqual(noise(7));
  expect(noise(8)).not.toEqual(noise(7));
  expect(alpha(STEPS)).toBeCloseTo(0.0001, 10);
});
it("normalises the posterior and identifies a low-noise example", () => {
  const result = estimate(corrupt(TEMPLATES[2]!, 5, 7), 5);
  expect(result.weights.reduce((x, y) => x + y, 0)).toBeCloseTo(1, 12);
  expect(result.weights[2]).toBeGreaterThan(0.99);
});
it("cannot reconstruct an excluded source by secretly reading the original", () => {
  const sample = corrupt(TEMPLATES[0]!, 30, 7);
  const before = sample.slice();
  let current = sample;
  for (let t = 30; t > 0; t--) current = reverse(current, t, [1]);
  expect(current).toEqual(TEMPLATES[1]);
  expect(sample).toEqual(before);
});
it("produces finite reverse trajectories from Gaussian noise", () => {
  let sample = noise(27);
  for (let t = STEPS; t > 0; t--) sample = reverse(sample, t);
  expect([...sample].every(Number.isFinite)).toBe(true);
  expect(Math.max(...estimate(sample, 0).weights)).toBeGreaterThan(0.99);
});
