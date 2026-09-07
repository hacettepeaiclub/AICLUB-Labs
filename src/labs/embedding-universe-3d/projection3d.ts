/**
 * A three-component view of the same vectors. Pure, and a prototype.
 *
 * ## What this is for
 *
 * To answer one question — would a spatial version of Embedding Universe teach
 * better than the flat one? — and nothing else. It is not part of the lesson,
 * it introduces no second data model, and it does not touch the 2-D path.
 *
 * ## What it reuses
 *
 * Everything that matters. The words are the same frozen 318, the vectors are
 * the same shipped int16 file, and the projection is the same `pca` from
 * `engine.ts` asked for three components instead of two — which it has always
 * supported, and which `engine.test.ts` already checks against scikit-learn on
 * a three-component fixture. Nothing here re-implements the mathematics; it
 * consumes it.
 *
 * ## What it must not imply
 *
 * That the embedding *is* three-dimensional. It is 300-dimensional, and three
 * axes explain a little more of it than two do — not much more. The copy says
 * the number out loud for exactly that reason. A convincing spatial picture is
 * a better-looking lie than a flat one if the caption does not correct it.
 */

import { pca, type Projection } from "../embedding-universe/engine";

export interface Point3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Space3 {
  readonly points: readonly Point3[];
  /** Share of total variance per axis, in 0..1. */
  readonly variance: readonly number[];
  /** Share the three axes account for together. */
  readonly combined: number;
  readonly projection: Projection;
}

/** Half-width of the cube the cloud is normalised into. */
export const SPACE_RADIUS = 50;

/**
 * Project into three components and normalise into a centred cube.
 *
 * One scale factor across all three axes, taken from the widest — the same rule
 * the 2-D view follows, and for the same reason: scaling axes independently
 * would stretch the cloud into a shape the data does not have.
 */
export function project3d(
  vectors: ArrayLike<number>,
  count: number,
  dimensions: number,
): Space3 {
  const projection = pca(vectors, count, dimensions, 3);
  const coords = projection.coordinates;

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < count; i++) {
    for (let axis = 0; axis < 3; axis++) {
      const value = coords[i * 3 + axis]!;
      if (value < min[axis]!) min[axis] = value;
      if (value > max[axis]!) max[axis] = value;
    }
  }
  const span = Math.max(max[0]! - min[0]!, max[1]! - min[1]!, max[2]! - min[2]!);
  const scale = span > 0 ? (SPACE_RADIUS * 2) / span : 0;
  const centre = [
    (max[0]! + min[0]!) / 2,
    (max[1]! + min[1]!) / 2,
    (max[2]! + min[2]!) / 2,
  ];

  const points: Point3[] = [];
  for (let i = 0; i < count; i++) {
    points.push({
      x: (coords[i * 3]! - centre[0]!) * scale,
      y: (coords[i * 3 + 1]! - centre[1]!) * scale,
      z: (coords[i * 3 + 2]! - centre[2]!) * scale,
    });
  }

  const total = projection.totalVariance;
  const variance = projection.eigenvalues.map((value) => value / total);
  return {
    points,
    variance,
    combined: variance.reduce((sum, value) => sum + value, 0),
    projection,
  };
}

/**
 * Rotate the cloud. A rigid motion: it turns the camera, not the data.
 *
 * Pairwise distances are preserved exactly, which is the property that makes
 * this honest — orbiting changes the view and never the relationships.
 */
export function orbit(points: readonly Point3[], yaw: number, pitch: number): Point3[] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return points.map((p) => {
    const x = p.x * cy - p.z * sy;
    const z = p.x * sy + p.z * cy;
    return { x, y: p.y * cp - z * sp, z: p.y * sp + z * cp };
  });
}

export interface Screen3 {
  readonly x: number;
  readonly y: number;
  /** 0 = furthest, 1 = nearest. Drives size and brightness. */
  readonly depth: number;
  /** Perspective factor: >1 nearer than the focal plane, <1 further. */
  readonly scale: number;
}

/** How far the eye sits from the centre of the cube, in the same units. */
export const CAMERA_DISTANCE = 260;

/**
 * Perspective projection onto the screen.
 *
 * A single pinhole division. Distant points come out smaller and, in the
 * renderer, dimmer — which is the entire reason for doing this in three
 * dimensions rather than drawing an isometric box.
 */
export function perspective(point: Point3, distance = CAMERA_DISTANCE): Screen3 {
  const denominator = Math.max(1e-6, distance - point.z);
  const scale = distance / denominator;
  return {
    x: point.x * scale,
    y: point.y * scale,
    depth: (point.z + SPACE_RADIUS) / (SPACE_RADIUS * 2),
    scale,
  };
}

/** Painter's algorithm: furthest first, so nearer stars overlap them. */
export const depthOrder = (points: readonly Point3[]): number[] =>
  Array.from({ length: points.length }, (_, i) => i).sort(
    (a, b) => (points[a]?.z ?? 0) - (points[b]?.z ?? 0),
  );
