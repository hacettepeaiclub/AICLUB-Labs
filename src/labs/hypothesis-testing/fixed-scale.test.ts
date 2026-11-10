import { expect, it } from "vitest";
import { evaluate, type Params } from "./engine";
import { domainOf, scaleOf } from "./view";

it("shows narrowing with more samples without moving the horizontal reference", () => {
  const params: Params = { mu0: 0, mu1: 2, sigma: 1, alpha: 0.1, n: 2, testType: "right" };
  const small = evaluate(params);
  const large = evaluate({ ...params, n: 100 });
  const domain = domainOf(small);
  const before = scaleOf(small, domain);
  const after = scaleOf(large, domain);
  expect(after.x(params.mu0)).toBe(before.x(params.mu0));
  expect(after.x(params.mu1)).toBe(before.x(params.mu1));
  expect(after.x(large.se) - after.x(0)).toBeLessThan(before.x(small.se) - before.x(0));
  expect(scaleOf(large).domain).not.toEqual(domain);
});
