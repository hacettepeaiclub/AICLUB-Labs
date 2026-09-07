/**
 * The geometry of the Embedding Universe. Pure TypeScript — no React, no DOM,
 * no library, no randomness that is not seeded.
 *
 * ## What the lab is trying to show
 *
 *   **The picture on screen is a shadow of the space, not the space.**
 *
 * Section 1 earns the idea that relationships are geometric; section 2 takes it
 * back apart. Both halves need the same thing from this file: numbers that were
 * genuinely computed from the published vectors, including the unflattering
 * ones. Nothing here knows a word's spelling or its category, so no result can
 * be special-cased into looking better than it is.
 *
 * ## Why PCA and not t-SNE or UMAP
 *
 * Because PCA can be honest about what it discarded. It is a linear projection
 * with an eigenvalue per axis, so "these two axes account for X% of the
 * variance" is a real quantity the lab can put on screen and this file can
 * compute. t-SNE and UMAP have no such number — they would give a prettier
 * picture that the lab could not tell the truth about.
 *
 * ## Determinism
 *
 * `pca` uses power iteration with deflation, started from a seeded generator
 * rather than an unseeded random vector, run to a fixed tolerance, with a fixed
 * sign convention applied at the end. Same input, same bits, every time. That
 * matters beyond tidiness: without the sign convention the whole map would
 * mirror itself at random between page loads, since an eigenvector and its
 * negation are equally valid answers.
 *
 * ## Note on `!`
 *
 * Loop indices below are bounded by `count`, by `dimensions`, or by a length
 * just measured from the array being read — all provably in range. The
 * assertions keep the inner loops free of redundant undefined checks, the same
 * convention `labs/reward-playground/engine.ts` uses.
 */

import { createRng } from "@/lib/random";

/** Seed for the power-iteration start vector. Any fixed value works; this one is fixed. */
export const PCA_SEED = 0x5eed;
/** Power iteration stops when the component moves less than this. */
export const PCA_TOLERANCE = 1e-13;
/**
 * Iteration cap, and on the shipped dataset the second axis really does reach
 * it rather than meeting `PCA_TOLERANCE`.
 *
 * That is a property of the data, not a bug. Power iteration converges like
 * `(lambda[k+1] / lambda[k])^n`, and here the third and second eigenvalues sit
 * at a ratio of 0.964 — nearly degenerate — so the *direction* creeps where the
 * first axis (ratio 0.62) snaps into place in 58 steps. What arrives after 512
 * steps is still correct: measured against scikit-learn on the shipped file,
 * the second axis agrees to |cos| = 1.000000000000 and every coordinate lands
 * within 1e-8 of the plot's own span. Raising the cap to actually reach 1e-13
 * would cost roughly a second of page load to move a point by a millionth of a
 * pixel.
 *
 * `engine.test.ts` therefore checks the answer against scikit-learn and checks
 * the eigenvector residual, rather than asserting that the loop exited early.
 */
export const PCA_MAX_ITERATIONS = 512;

// ------------------------------------------------------------- similarity ---

/**
 * Cosine similarity between rows `i` and `j`.
 *
 * The vectors are unit length by construction (`dataset.ts` guarantees it), so
 * this is a plain dot product. The result is clamped because floating-point
 * accumulation can land a self-similarity at 1.0000000000000002, and a value
 * outside [-1, 1] would be a lie on screen even at the fifteenth decimal.
 */
export function cosine(
  vectors: ArrayLike<number>,
  dimensions: number,
  i: number,
  j: number,
): number {
  const a = i * dimensions;
  const b = j * dimensions;
  let sum = 0;
  for (let d = 0; d < dimensions; d++) sum += vectors[a + d]! * vectors[b + d]!;
  return sum < -1 ? -1 : sum > 1 ? 1 : sum;
}

/** Similarity of one row against every row. Self-similarity is included, at index `i`. */
export function similarityRow(
  vectors: ArrayLike<number>,
  count: number,
  dimensions: number,
  i: number,
): Float64Array {
  const out = new Float64Array(count);
  for (let j = 0; j < count; j++) out[j] = cosine(vectors, dimensions, i, j);
  return out;
}

export interface Neighbour {
  readonly index: number;
  readonly similarity: number;
}

/**
 * The `k` most similar rows to row `i`, best first, excluding `i` itself.
 *
 * A full scan: 318 words times 300 dimensions is under 100k multiplies, well
 * inside a frame, so there is no index to build and nothing to keep in sync.
 * Ties break on the lower index so the ordering is total and reproducible.
 */
export function nearestNeighbours(
  vectors: ArrayLike<number>,
  count: number,
  dimensions: number,
  i: number,
  k: number,
): Neighbour[] {
  const sims = similarityRow(vectors, count, dimensions, i);
  const order: number[] = [];
  for (let j = 0; j < count; j++) if (j !== i) order.push(j);
  order.sort((a, b) => sims[b]! - sims[a]! || a - b);
  return order.slice(0, Math.max(0, Math.min(k, order.length))).map((index) => ({
    index,
    similarity: sims[index]!,
  }));
}

/**
 * For every row, the rank of every other row by similarity: 1 is the nearest
 * neighbour. A row's rank to itself stays 0.
 */
export function similarityRanks(
  vectors: ArrayLike<number>,
  count: number,
  dimensions: number,
): Int32Array {
  const ranks = new Int32Array(count * count);
  const order: number[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const sims = similarityRow(vectors, count, dimensions, i);
    for (let j = 0; j < count; j++) order[j] = j;
    order.sort((a, b) => sims[b]! - sims[a]! || a - b);
    let rank = 0;
    for (const j of order) {
      if (j === i) continue;
      ranks[i * count + j] = ++rank;
    }
  }
  return ranks;
}

// -------------------------------------------------------------------- PCA ---

export interface Projection {
  /** Unit-length principal axes in the original space, longest first. */
  readonly components: readonly Float64Array[];
  /** Variance along each axis (the eigenvalues of the covariance). */
  readonly eigenvalues: readonly number[];
  /** Total variance in the data, so a share can be computed honestly. */
  readonly totalVariance: number;
  /** Column means subtracted before projecting. */
  readonly mean: Float64Array;
  /** `count` rows of `components.length` coordinates. */
  readonly coordinates: Float64Array;
  /** Iterations each component needed. Diagnostic; asserted in tests. */
  readonly iterations: readonly number[];
}

/**
 * Principal component analysis by power iteration with deflation.
 *
 * The data is centred first — PCA on uncentred data finds the direction of the
 * mean, not the direction of the variation. `totalVariance` is measured on the
 * centred matrix before any deflation, because deflation destroys exactly the
 * variance we are trying to express a share of.
 *
 * Each axis is found by repeatedly applying `Cᵀ C` to a vector, which pulls it
 * towards the dominant eigenvector, then subtracting that axis out of the data
 * so the next round finds the next one down.
 */
export function pca(
  vectors: ArrayLike<number>,
  count: number,
  dimensions: number,
  componentCount = 2,
): Projection {
  if (count < 2) throw new Error("pca: needs at least two rows");
  if (componentCount < 1 || componentCount > dimensions) {
    throw new Error(`pca: componentCount must be 1..${dimensions}`);
  }

  const mean = new Float64Array(dimensions);
  for (let i = 0; i < count; i++) {
    for (let d = 0; d < dimensions; d++) mean[d] = mean[d]! + vectors[i * dimensions + d]!;
  }
  for (let d = 0; d < dimensions; d++) mean[d] = mean[d]! / count;

  const centred = new Float64Array(count * dimensions);
  let totalVariance = 0;
  for (let i = 0; i < count; i++) {
    for (let d = 0; d < dimensions; d++) {
      const v = vectors[i * dimensions + d]! - mean[d]!;
      centred[i * dimensions + d] = v;
      totalVariance += v * v;
    }
  }
  totalVariance /= count - 1;

  const rng = createRng(PCA_SEED);
  const components: Float64Array[] = [];
  const eigenvalues: number[] = [];
  const iterations: number[] = [];
  const projected = new Float64Array(count);
  const next = new Float64Array(dimensions);

  for (let c = 0; c < componentCount; c++) {
    // A seeded start rather than a constant one: a constant vector can be
    // orthogonal to the axis being sought, which stalls the iteration.
    let v = new Float64Array(dimensions);
    let seedNorm = 0;
    for (let d = 0; d < dimensions; d++) {
      const x = rng() * 2 - 1;
      v[d] = x;
      seedNorm += x * x;
    }
    for (let d = 0; d < dimensions; d++) v[d] = v[d]! / Math.sqrt(seedNorm);

    let used = PCA_MAX_ITERATIONS;
    for (let it = 0; it < PCA_MAX_ITERATIONS; it++) {
      // next = Cᵀ (C v)
      for (let i = 0; i < count; i++) {
        let dot = 0;
        for (let d = 0; d < dimensions; d++) dot += centred[i * dimensions + d]! * v[d]!;
        projected[i] = dot;
      }
      next.fill(0);
      for (let i = 0; i < count; i++) {
        const p = projected[i]!;
        if (p === 0) continue;
        for (let d = 0; d < dimensions; d++) {
          next[d] = next[d]! + centred[i * dimensions + d]! * p;
        }
      }
      let norm = 0;
      for (let d = 0; d < dimensions; d++) norm += next[d]! * next[d]!;
      norm = Math.sqrt(norm);
      if (!(norm > 0)) break; // nothing left after deflation
      let delta = 0;
      for (let d = 0; d < dimensions; d++) {
        const x = next[d]! / norm;
        delta += (x - v[d]!) * (x - v[d]!);
        next[d] = x;
      }
      v = Float64Array.from(next);
      if (Math.sqrt(delta) < PCA_TOLERANCE) {
        used = it + 1;
        break;
      }
    }

    // Sign convention: the largest-magnitude loading is positive. Without it an
    // eigenvector and its negation are both correct, and the map would mirror
    // itself at random from one load to the next.
    let peak = 0;
    for (let d = 0; d < dimensions; d++) if (Math.abs(v[d]!) > Math.abs(v[peak]!)) peak = d;
    if (v[peak]! < 0) for (let d = 0; d < dimensions; d++) v[d] = -v[d]!;

    let variance = 0;
    for (let i = 0; i < count; i++) {
      let dot = 0;
      for (let d = 0; d < dimensions; d++) dot += centred[i * dimensions + d]! * v[d]!;
      projected[i] = dot;
      variance += dot * dot;
    }
    components.push(v);
    eigenvalues.push(variance / (count - 1));
    iterations.push(used);

    // Deflate: strip this axis out so the next pass finds the next one down.
    for (let i = 0; i < count; i++) {
      const p = projected[i]!;
      for (let d = 0; d < dimensions; d++) {
        centred[i * dimensions + d] = centred[i * dimensions + d]! - p * v[d]!;
      }
    }
  }

  // Coordinates come from the original centred data, not the deflated remainder.
  const coordinates = new Float64Array(count * componentCount);
  for (let i = 0; i < count; i++) {
    for (let c = 0; c < componentCount; c++) {
      const axis = components[c]!;
      let dot = 0;
      for (let d = 0; d < dimensions; d++) {
        dot += (vectors[i * dimensions + d]! - mean[d]!) * axis[d]!;
      }
      coordinates[i * componentCount + c] = dot;
    }
  }

  return { components, eigenvalues, totalVariance, mean, coordinates, iterations };
}

/** Share of total variance along each axis, as a fraction in 0..1. */
export const varianceExplained = (projection: Projection): number[] =>
  projection.eigenvalues.map((value) => value / projection.totalVariance);

/** Share of total variance the whole projection accounts for, as a fraction in 0..1. */
export const totalVarianceExplained = (projection: Projection): number =>
  projection.eigenvalues.reduce((sum, value) => sum + value, 0) / projection.totalVariance;

// ------------------------------------------------------------- distortion ---

export interface DistortionPair {
  readonly a: number;
  readonly b: number;
  /** Cosine similarity in the full space. */
  readonly similarity: number;
  /** Rank of `b` among `a`'s neighbours in the full space; 1 is nearest. */
  readonly trueRank: number;
  /** Rank of `b` among `a`'s neighbours on screen; 1 is nearest. */
  readonly screenRank: number;
  /** Distance on screen, as a fraction of the plot's diagonal. */
  readonly screenDistance: number;
}

export interface Distortion {
  /** Close in the full space, pushed apart by the projection. */
  readonly hiddenNeighbour: DistortionPair;
  /** Adjacent on screen, unrelated in the full space. */
  readonly falseNeighbour: DistortionPair;
  /**
   * Spearman correlation between true similarity and on-screen distance.
   * A projection that lost nothing would score -1.
   */
  readonly rankCorrelation: number;
}

function screenRanks(coordinates: Float64Array, count: number, axes: number): Int32Array {
  const ranks = new Int32Array(count * count);
  const order: number[] = new Array(count);
  const dist = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      let sum = 0;
      for (let c = 0; c < axes; c++) {
        const delta = coordinates[i * axes + c]! - coordinates[j * axes + c]!;
        sum += delta * delta;
      }
      dist[j] = Math.sqrt(sum);
      order[j] = j;
    }
    order.sort((a, b) => dist[a]! - dist[b]! || a - b);
    let rank = 0;
    for (const j of order) {
      if (j === i) continue;
      ranks[i * count + j] = ++rank;
    }
  }
  return ranks;
}

/** Spearman correlation of two equal-length samples, average ranks on ties. */
function spearman(x: Float64Array, y: Float64Array): number {
  const ranked = (values: Float64Array): Float64Array => {
    const idx = Array.from({ length: values.length }, (_, i) => i);
    idx.sort((a, b) => values[a]! - values[b]! || a - b);
    const out = new Float64Array(values.length);
    let i = 0;
    while (i < idx.length) {
      let j = i;
      while (j + 1 < idx.length && values[idx[j + 1]!]! === values[idx[i]!]!) j++;
      const shared = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) out[idx[k]!] = shared;
      i = j + 1;
    }
    return out;
  };
  const rx = ranked(x);
  const ry = ranked(y);
  const n = x.length;
  let mx = 0;
  let my = 0;
  for (let i = 0; i < n; i++) {
    mx += rx[i]!;
    my += ry[i]!;
  }
  mx /= n;
  my /= n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = rx[i]! - mx;
    const b = ry[i]! - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return dx === 0 || dy === 0 ? 0 : num / Math.sqrt(dx * dy);
}

/**
 * Find the two pairs section 2 is about, from the data.
 *
 * Neither pair is chosen by a person. `hiddenNeighbour` maximises how far the
 * projection pushed a genuinely close pair apart; `falseNeighbour` maximises
 * the opposite. Whatever words come out are the words the lab shows — if the
 * vocabulary is ever re-frozen these change, and that is the point: the example
 * is a measurement, not an illustration.
 */
export function distortion(
  vectors: ArrayLike<number>,
  count: number,
  dimensions: number,
  projection: Projection,
): Distortion {
  const axes = projection.components.length;
  const coordinates = projection.coordinates;
  const trueRanks = similarityRanks(vectors, count, dimensions);
  const viewRanks = screenRanks(coordinates, count, axes);

  const min = new Float64Array(axes).fill(Infinity);
  const max = new Float64Array(axes).fill(-Infinity);
  for (let i = 0; i < count; i++) {
    for (let c = 0; c < axes; c++) {
      const v = coordinates[i * axes + c]!;
      if (v < min[c]!) min[c] = v;
      if (v > max[c]!) max[c] = v;
    }
  }
  let diagonal = 0;
  for (let c = 0; c < axes; c++) diagonal += (max[c]! - min[c]!) ** 2;
  diagonal = Math.sqrt(diagonal);

  const pairDistance = (i: number, j: number): number => {
    let sum = 0;
    for (let c = 0; c < axes; c++) {
      const delta = coordinates[i * axes + c]! - coordinates[j * axes + c]!;
      sum += delta * delta;
    }
    return Math.sqrt(sum);
  };

  let hidden = { a: 0, b: 1, gap: -Infinity };
  let spurious = { a: 0, b: 1, gap: -Infinity };
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const t = trueRanks[i * count + j]!;
      const s = viewRanks[i * count + j]!;
      if (s - t > hidden.gap) hidden = { a: i, b: j, gap: s - t };
      if (t - s > spurious.gap) spurious = { a: i, b: j, gap: t - s };
    }
  }

  const build = (a: number, b: number): DistortionPair => ({
    a,
    b,
    similarity: cosine(vectors, dimensions, a, b),
    trueRank: trueRanks[a * count + b]!,
    screenRank: viewRanks[a * count + b]!,
    screenDistance: diagonal > 0 ? pairDistance(a, b) / diagonal : 0,
  });

  const pairs = (count * (count - 1)) / 2;
  const sims = new Float64Array(pairs);
  const dists = new Float64Array(pairs);
  let at = 0;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      sims[at] = cosine(vectors, dimensions, i, j);
      dists[at] = pairDistance(i, j);
      at++;
    }
  }

  return {
    hiddenNeighbour: build(hidden.a, hidden.b),
    falseNeighbour: build(spurious.a, spurious.b),
    rankCorrelation: spearman(sims, dists),
  };
}
