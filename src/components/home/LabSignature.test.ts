import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The signatures are drawn entirely in Tailwind colour utilities, and a colour
 * utility Tailwind does not recognise emits nothing at all. On an SVG that is
 * not a missing colour, it is a *black* one: `fill` falls back to the SVG
 * default. So the failure is silent in the compiler, silent in the linter, and
 * on a dark card almost silent to the eye.
 *
 * It happened here. `fill-accent/22` was written for the explored region of the
 * pathfinding search; 22 is not on Tailwind's opacity scale, so a third of that
 * grid painted solid black — invisible against dark ink, and unmistakable on
 * the light theme, where the "search wavefront" showed up as a scatter of black
 * squares.
 *
 * This scans the source instead of the DOM, because the DOM cannot see it: the
 * class is on the element, it simply does nothing.
 */

const source = readFileSync("src/components/home/LabSignature.tsx", "utf8");

/** Tailwind's default opacity scale: 0-100 in fives. */
const OPACITY = new Set(Array.from({ length: 21 }, (_, i) => String(i * 5)));

/** Colour groups declared in the Tailwind theme, plus the keywords. */
const config = readFileSync("tailwind.config.ts", "utf8");
const known = new Set([
  ...[...config.matchAll(/^\s{8}([a-z][a-zA-Z0-9]*): \{/gm)].map((m) => m[1] as string),
  "data",
  "none",
  "current",
  "transparent",
  "white",
  "black",
]);

describe("every colour utility in the signatures resolves", () => {
  const used = [
    ...source.matchAll(/\b(?:fill|stroke)-([a-z][a-zA-Z0-9]*)(?:-\d+)?(?:\/(\d+))?/g),
  ];

  it("names a colour token that exists", () => {
    expect(used.length).toBeGreaterThan(10);
    for (const match of used) {
      expect({ utility: match[0], resolves: known.has(match[1] as string) }).toMatchObject({
        resolves: true,
      });
    }
  });

  it("uses only opacity steps Tailwind actually generates", () => {
    for (const match of used) {
      if (match[2] === undefined) continue;
      expect({ utility: match[0], onScale: OPACITY.has(match[2]) }).toMatchObject({
        onScale: true,
      });
    }
  });
});

describe("the drawings say what their labs say", () => {
  const shape = (slug: string) => {
    const start = source.indexOf(`case "${slug}":`);
    expect(start, `no case for ${slug}`).toBeGreaterThan(-1);
    return source.slice(start, source.indexOf('    case "', start + 10));
  };

  it("hash: the output cells are all one size", () => {
    /*
     * The lesson is "fixed-size output regardless of input", and the previous
     * drawing contradicted it — bars of varying height, which read as a
     * waveform and implied the digest grows with the message. Whatever varies
     * on the output side may vary in fill; it may not vary in geometry.
     */
    const hash = shape("hash-playground");
    expect(hash).toMatch(/const CELL_W = [\d.]+;/);
    expect(hash).toMatch(/width=\{CELL_W\}/);
    expect(hash).toMatch(/height=\{9\}/);
    // No dimension anywhere in this shape is computed from the generator.
    expect(hash).not.toMatch(/(?:width|height)=\{[^}]*rng\(\)/);
    // Two inputs of different length, so the sameness on the right has
    // something to be the same *despite*.
    const [first, second] = [/\[3, 6\]/, /\[16, 5\]/];
    expect(source).toMatch(first);
    expect(source).toMatch(second);
  });

  it("pathfinding: shows a frontier, and does not repeat gradient descent", () => {
    const pathfinding = shape("pathfinding");
    // The search is shaded by depth from the start, with a distinct ring at
    // the edge — that ring is the whole point.
    expect(pathfinding).toMatch(/const FRONTIER = \d+;/);
    expect(pathfinding).toMatch(/depth === FRONTIER/);
    expect(pathfinding).toMatch(/depth < FRONTIER/);
    // Right angles only: every path vertex shares an x or a y with the last.
    const points = /points=\{`([^`]+)`\}/.exec(pathfinding)?.[1];
    expect(points, "no path polyline").toBeDefined();
    const steps = points!.split(" ").map((p) => p.split(","));
    for (let i = 1; i < steps.length; i++) {
      const [px, py] = steps[i - 1]!;
      const [qx, qy] = steps[i]!;
      expect({ from: steps[i - 1], to: steps[i], orthogonal: px === qx || py === qy }).toMatchObject(
        { orthogonal: true },
      );
    }
    // Gradient descent owns the contour-and-descent picture. Nothing here.
    expect(pathfinding).not.toMatch(/ellipse|Q /);
    expect(shape("gradient-descent")).toMatch(/<ellipse/);
  });
});
