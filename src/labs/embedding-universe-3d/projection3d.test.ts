import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { decodeInt16, type DatasetMeta } from "../embedding-universe/dataset";
import { VOCABULARY } from "../embedding-universe/vocabulary";
import { nearestNeighbours, pca } from "../embedding-universe/engine";
import { toViewport } from "../embedding-universe/view";
import {
  CAMERA_DISTANCE,
  SPACE_RADIUS,
  depthOrder,
  orbit,
  perspective,
  project3d,
} from "./projection3d";
import reference from "../embedding-universe/fixtures/pca-reference.json";

/**
 * Gates for the 3-D prototype.
 *
 * Its whole claim is that it shows the *same* thing from another angle, so the
 * checks are mostly about sameness: same words, same vectors, same PCA, the
 * third axis validated against scikit-learn exactly as the first two are, and
 * no mutation of anything the 2-D lesson depends on.
 */

const DATA = "public/labs/embedding-universe/";
const meta = JSON.parse(readFileSync(DATA + "dataset.json", "utf8")) as DatasetMeta;
const raw = readFileSync(DATA + meta.int16.file);
const set = decodeInt16(
  raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
  meta.wordCount,
  meta.dimensions,
);
const space = project3d(set.vectors, set.count, set.dimensions);

describe("PCA3 is the same machinery, asked for one more axis", () => {
  it("recovers scikit-learn's three components on the shared fixture", () => {
    const { rows, dimensions, data, componentVectors, eigenvalues } = reference;
    const got = pca(Float64Array.from(data), rows, dimensions, 3);
    expect(got.components).toHaveLength(3);
    got.components.forEach((mine, c) => {
      const theirs = componentVectors[c] as number[];
      let dot = 0;
      for (let d = 0; d < dimensions; d++) dot += (mine[d] as number) * (theirs[d] as number);
      expect(Math.abs(dot)).toBeCloseTo(1, 8);
    });
    got.eigenvalues.forEach((v, c) => expect(v).toBeCloseTo(eigenvalues[c] as number, 8));
  });

  it("keeps the sign convention, so the cloud cannot flip between loads", () => {
    for (const component of space.projection.components) {
      let peak = 0;
      for (let d = 0; d < component.length; d++) {
        if (Math.abs(component[d] as number) > Math.abs(component[peak] as number)) peak = d;
      }
      expect(component[peak] as number).toBeGreaterThan(0);
    }
  });

  it("is deterministic to the bit", () => {
    const again = project3d(set.vectors, set.count, set.dimensions);
    expect(again.points).toEqual(space.points);
    expect(again.variance).toEqual(space.variance);
  });

  it("produces three orthonormal axes in descending order", () => {
    const c = space.projection.components;
    for (const axis of c) {
      let norm = 0;
      for (const v of axis) norm += v * v;
      expect(Math.sqrt(norm)).toBeCloseTo(1, 10);
    }
    for (let a = 0; a < 3; a++) {
      for (let b = a + 1; b < 3; b++) {
        let dot = 0;
        const x = c[a] as Float64Array;
        const y = c[b] as Float64Array;
        for (let d = 0; d < set.dimensions; d++) dot += (x[d] as number) * (y[d] as number);
        expect(Math.abs(dot)).toBeLessThan(1e-7);
      }
    }
    for (let i = 1; i < 3; i++) {
      expect(space.projection.eigenvalues[i] as number).toBeLessThanOrEqual(
        space.projection.eigenvalues[i - 1] as number,
      );
    }
  });
});

describe("it is the same dataset", () => {
  it("has one point per frozen word, and no others", () => {
    expect(space.points).toHaveLength(VOCABULARY.length);
    expect(space.points).toHaveLength(meta.wordCount);
  });

  it("invents no data: every coordinate is finite and inside the cube", () => {
    for (const p of space.points) {
      for (const v of [p.x, p.y, p.z]) {
        expect(Number.isFinite(v)).toBe(true);
        expect(Math.abs(v)).toBeLessThanOrEqual(SPACE_RADIUS + 1e-9);
      }
    }
  });

  it("does not mutate the vectors the 2-D lesson reads", () => {
    const before = Float32Array.from(set.vectors);
    project3d(set.vectors, set.count, set.dimensions);
    expect(Array.from(set.vectors)).toEqual(Array.from(before));
  });

  it("leaves the 2-D projection exactly as it was", () => {
    const flatBefore = toViewport(pca(set.vectors, set.count, set.dimensions, 2), set.count);
    project3d(set.vectors, set.count, set.dimensions);
    const flatAfter = toViewport(pca(set.vectors, set.count, set.dimensions, 2), set.count);
    expect(flatAfter.points).toEqual(flatBefore.points);
    expect(flatAfter.width).toBe(flatBefore.width);
  });

  it("agrees with the 2-D view on the first two axes", () => {
    // The third component is additional, not a different fit: PC1 and PC2 must
    // be the same axes the flat map uses.
    const flat = pca(set.vectors, set.count, set.dimensions, 2);
    for (let c = 0; c < 2; c++) {
      const a = flat.components[c] as Float64Array;
      const b = space.projection.components[c] as Float64Array;
      let dot = 0;
      for (let d = 0; d < set.dimensions; d++) dot += (a[d] as number) * (b[d] as number);
      expect(Math.abs(dot)).toBeCloseTo(1, 9);
    }
  });

  it("reports how little three axes actually capture", () => {
    expect(space.variance).toHaveLength(3);
    expect(space.combined).toBeGreaterThan(0);
    // Three axes of three hundred. The number is small, and the copy says so.
    expect(space.combined).toBeLessThan(0.5);
    const flat = pca(set.vectors, set.count, set.dimensions, 2);
    const flatShare =
      flat.eigenvalues.reduce((s, v) => s + v, 0) / flat.totalVariance;
    expect(space.combined).toBeGreaterThan(flatShare);
  });
});

describe("camera", () => {
  it("orbiting is rigid: it moves the eye, never the relationships", () => {
    const turned = orbit(space.points, 0.7, -0.35);
    const d = (pts: readonly { x: number; y: number; z: number }[], i: number, j: number) =>
      Math.hypot(
        (pts[i]?.x ?? 0) - (pts[j]?.x ?? 0),
        (pts[i]?.y ?? 0) - (pts[j]?.y ?? 0),
        (pts[i]?.z ?? 0) - (pts[j]?.z ?? 0),
      );
    for (let i = 0; i < 40; i++) {
      const a = i * 7;
      const b = (i * 13 + 3) % space.points.length;
      if (a >= space.points.length || a === b) continue;
      expect(d(turned, a, b)).toBeCloseTo(d(space.points, a, b), 9);
    }
  });

  it("returns to the start after a full turn", () => {
    const full = orbit(space.points, Math.PI * 2, 0);
    full.forEach((p, i) => {
      expect(p.x).toBeCloseTo(space.points[i]?.x ?? 0, 9);
      expect(p.z).toBeCloseTo(space.points[i]?.z ?? 0, 9);
    });
  });

  it("perspective makes distant points smaller and near ones larger", () => {
    const near = perspective({ x: 10, y: 0, z: SPACE_RADIUS });
    const far = perspective({ x: 10, y: 0, z: -SPACE_RADIUS });
    expect(near.scale).toBeGreaterThan(1);
    expect(far.scale).toBeLessThan(1);
    expect(Math.abs(near.x)).toBeGreaterThan(Math.abs(far.x));
    expect(near.depth).toBeCloseTo(1, 9);
    expect(far.depth).toBeCloseTo(0, 9);
  });

  it("never divides by zero, even at the camera plane", () => {
    const at = perspective({ x: 1, y: 1, z: CAMERA_DISTANCE });
    expect(Number.isFinite(at.x)).toBe(true);
    expect(Number.isFinite(at.scale)).toBe(true);
  });

  it("draws far before near", () => {
    const order = depthOrder(space.points);
    expect(order).toHaveLength(space.points.length);
    for (let i = 1; i < order.length; i++) {
      expect(space.points[order[i]!]?.z ?? 0).toBeGreaterThanOrEqual(
        space.points[order[i - 1]!]?.z ?? 0,
      );
    }
  });
});

describe("a word is still identifiable", () => {
  it("the same index means the same word as in 2-D", () => {
    const index = VOCABULARY.findIndex((w) => w.id === "apple");
    expect(index).toBeGreaterThan(-1);
    expect(space.points[index]).toBeDefined();
    // Neighbours come from the same cosine over the same vectors — the 3-D view
    // changes nothing about who is near whom.
    const neighbours = nearestNeighbours(set.vectors, set.count, set.dimensions, index, 8);
    expect(neighbours).toHaveLength(8);
    for (const n of neighbours) expect(space.points[n.index]).toBeDefined();
  });
});
