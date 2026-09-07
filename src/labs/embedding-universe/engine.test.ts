import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  VOCABULARY,
  VOCABULARY_CHECKSUM,
  VOCABULARY_VERSION,
  WORD_COUNT,
  type WordCategory,
} from "./vocabulary";
import {
  decodeFloat32,
  decodeInt16,
  readInt16Scales,
  type DatasetMeta,
  type EmbeddingSet,
} from "./dataset";
import {
  PCA_MAX_ITERATIONS,
  cosine,
  distortion,
  nearestNeighbours,
  pca,
  similarityRanks,
  totalVarianceExplained,
  varianceExplained,
} from "./engine";
import reference from "./fixtures/pca-reference.json";
import datasetReference from "./fixtures/pca-dataset-reference.json";

/**
 * Gates for the Embedding Universe engine.
 *
 * The failure this lab is most exposed to is a number that looks right without
 * being computed — a neighbour list someone liked, a coordinate pasted in, an
 * example pair chosen because it made the point. So the important checks below
 * do not ask the engine to agree with itself. They re-derive the answer a
 * second, deliberately naive way (G2, G3, G9), compare against scikit-learn
 * (G4), compare the shipped bytes against the untouched reference (G11), and
 * read the source to prove no word is special-cased (G6).
 */

/** Runtime asset directory: everything here is deployed and fetchable. */
const DATA = "public/labs/embedding-universe/";
/**
 * The float32 reference deliberately lives outside `public/`. It is a test
 * artifact — the thing int16 is proved lossless against — and shipping it
 * would have served 373 KB nobody downloads. `lab.test.ts` asserts it stays out
 * of the build.
 */
const REFERENCE = "src/labs/embedding-universe/fixtures/";
const bytes = (path: string): ArrayBuffer => {
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};

const meta = JSON.parse(readFileSync(DATA + "dataset.json", "utf8")) as DatasetMeta;
const rawF32 = bytes(REFERENCE + meta.float32.file);
const rawI16 = bytes(DATA + meta.int16.file);
const f32: EmbeddingSet = decodeFloat32(rawF32, meta.wordCount, meta.dimensions);
const i16: EmbeddingSet = decodeInt16(rawI16, meta.wordCount, meta.dimensions);
const N = meta.wordCount;
const D = meta.dimensions;

/** Independent, deliberately slow re-implementations. Never call the engine. */
const naive = {
  /** Dot product accumulated in reverse, so the rounding order differs from the engine's. */
  dot(set: EmbeddingSet, i: number, j: number): number {
    let sum = 0;
    for (let d = set.dimensions - 1; d >= 0; d--) {
      sum += (set.vectors[i * set.dimensions + d] as number) * (set.vectors[j * set.dimensions + d] as number);
    }
    return sum;
  },
  /** Textbook cosine, dividing by the norms actually present rather than assuming 1. */
  cosine(set: EmbeddingSet, i: number, j: number): number {
    const a: number[] = [];
    const b: number[] = [];
    for (let d = 0; d < set.dimensions; d++) {
      a.push(set.vectors[i * set.dimensions + d] as number);
      b.push(set.vectors[j * set.dimensions + d] as number);
    }
    const dot = a.reduce((s, v, k) => s + v * (b[k] as number), 0);
    const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (na * nb);
  },
  topK(set: EmbeddingSet, i: number, k: number): number[] {
    const scored: Array<[number, number]> = [];
    for (let j = 0; j < set.count; j++) {
      if (j !== i) scored.push([j, naive.cosine(set, i, j)]);
    }
    scored.sort((x, y) => y[1] - x[1] || x[0] - y[0]);
    return scored.slice(0, k).map(([j]) => j);
  },
};

// ------------------------------------------------- G1  data integrity ------

describe("G1  the dataset is what it says it is", () => {
  it("the vocabulary is frozen: the checksum matches the ids in the file", () => {
    const digest = createHash("sha256")
      .update(VOCABULARY.map((w) => w.id).join("\0"))
      .digest("hex");
    expect(digest).toBe(VOCABULARY_CHECKSUM);
  });

  it("the built dataset was built from this vocabulary, at this version", () => {
    expect(meta.vocabularyChecksum).toBe(VOCABULARY_CHECKSUM);
    expect(meta.vocabularyVersion).toBe(VOCABULARY_VERSION);
    expect(meta.wordCount).toBe(WORD_COUNT);
  });

  it("records the provenance a reader would need to reproduce it", () => {
    expect(meta.model.id).toBe("sentence-transformers/average_word_embeddings_glove.6B.300d");
    expect(meta.model.revision).toMatch(/^[0-9a-f]{40}$/);
    expect(meta.model.license).toMatch(/PDDL/);
    expect(meta.model.underlying).toMatch(/GloVe/);
    expect(meta.model.normalization).toMatch(/L2/);
    expect(meta.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(meta.dimensions).toBe(300);
  });

  it("the shipped bytes are the bytes that were checksummed", () => {
    expect(createHash("sha256").update(Buffer.from(rawF32)).digest("hex")).toBe(meta.float32.sha256);
    expect(createHash("sha256").update(Buffer.from(rawI16)).digest("hex")).toBe(meta.int16.sha256);
    expect(rawF32.byteLength).toBe(meta.float32.bytes);
    expect(rawI16.byteLength).toBe(meta.int16.bytes);
  });

  it("every vector is finite, non-zero and unit length", () => {
    for (const set of [f32, i16]) {
      expect(set.vectors.length).toBe(N * D);
      for (let i = 0; i < N; i++) {
        let sum = 0;
        for (let d = 0; d < D; d++) {
          const v = set.vectors[i * D + d] as number;
          expect(Number.isFinite(v)).toBe(true);
          sum += v * v;
        }
        expect(Math.sqrt(sum)).toBeCloseTo(1, 5);
      }
    }
  });

  it("no two words share a vector — they are 318 distinct points", () => {
    const seen = new Set<string>();
    for (let i = 0; i < N; i++) {
      seen.add(Array.from(f32.vectors.subarray(i * D, i * D + 8)).join(","));
    }
    expect(seen.size).toBe(N);
  });

  it("rejects a truncated or oversized file rather than reading garbage", () => {
    expect(() => decodeFloat32(rawF32.slice(0, rawF32.byteLength - 4), N, D)).toThrow();
    expect(() => decodeInt16(rawI16.slice(0, rawI16.byteLength - 4), N, D)).toThrow();
  });
});

// ------------------------------------------- G1b  curation invariants ------

describe("G1b  the vocabulary still obeys the rules it was written under", () => {
  it("ids are unique and match the English labels", () => {
    expect(new Set(VOCABULARY.map((w) => w.id)).size).toBe(WORD_COUNT);
    for (const w of VOCABULARY) expect(w.id).toBe(w.en);
  });

  it("every word has a Turkish gloss, and glosses are never embedded", () => {
    for (const w of VOCABULARY) expect(w.tr.trim().length).toBeGreaterThan(0);
    // Turkish is polysemous where English is not, so glosses may legitimately
    // repeat. That is only safe because no vector is built from them.
    const repeated = new Map<string, string[]>();
    for (const w of VOCABULARY) repeated.set(w.tr, [...(repeated.get(w.tr) ?? []), w.id]);
    const collisions = [...repeated.values()].filter((ids) => ids.length > 1);
    expect(collisions.length).toBeLessThanOrEqual(5);
  });

  it("categories are deliberately unbalanced, not padded to look symmetric", () => {
    const counts = new Map<WordCategory, number>();
    for (const w of VOCABULARY) counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
    const sizes = [...counts.values()];
    expect(counts.size).toBeGreaterThanOrEqual(12);
    expect(Math.max(...sizes) / Math.min(...sizes)).toBeGreaterThan(2);
  });

  it("carries enough bridge words to keep clusters from being clean", () => {
    const bridges = VOCABULARY.filter((w) => w.bridge !== null);
    expect(bridges.length / WORD_COUNT).toBeGreaterThan(0.05);
  });

  it("the array order is the sorted order the binary layout assumes", () => {
    const ids = VOCABULARY.map((w) => w.id);
    expect(ids).toEqual([...ids].sort((a, b) => a.localeCompare(b, "en")));
  });
});

// --------------------------------------------------- G2  cosine ------------

describe("G2  cosine similarity", () => {
  it("matches an independent implementation that sums the other way round", () => {
    for (let i = 0; i < N; i += 7) {
      for (let j = 0; j < N; j += 11) {
        if (i === j) continue; // the clamp deliberately differs here; asserted below
        expect(cosine(f32.vectors, D, i, j)).toBeCloseTo(naive.dot(f32, i, j), 13);
      }
    }
  });

  it("clamps, and the clamp is load-bearing rather than decorative", () => {
    // Rows are unit only to float32 precision, so an unclamped dot product of a
    // row with itself really does come out above 1. Showing "similarity 1.0000"
    // would be a small lie, so `cosine` clamps -- and this proves it has to.
    let clamped = 0;
    let overshoot = 0;
    for (let i = 0; i < N; i++) {
      const raw = naive.dot(f32, i, i);
      overshoot = Math.max(overshoot, raw - 1);
      if (raw > 1) clamped++;
      // Rounding goes both ways: rows whose stored norm lands just under 1 come
      // out just under 1, and that is honest. What must never happen is a
      // similarity above 1.
      expect(cosine(f32.vectors, D, i, i)).toBeLessThanOrEqual(1);
      expect(cosine(f32.vectors, D, i, i)).toBeCloseTo(1, 6);
    }
    expect(overshoot).toBeGreaterThan(0);
    expect(clamped).toBeGreaterThan(0);
  });

  it("matches textbook cosine to the precision float32 storage allows", () => {
    // The engine treats rows as exactly unit length and skips the division.
    // They are unit only to float32 precision — the worst row here is off by
    // 1.2e-8 — so the two definitions must agree to about that, and no closer.
    // Asserting more would be asserting that float32 is exact.
    let worstNorm = 0;
    for (let i = 0; i < N; i++) {
      let sum = 0;
      for (let d = 0; d < D; d++) sum += (f32.vectors[i * D + d] as number) ** 2;
      worstNorm = Math.max(worstNorm, Math.abs(Math.sqrt(sum) - 1));
    }
    expect(worstNorm).toBeLessThan(1e-7);

    let worst = 0;
    for (let i = 0; i < N; i += 7) {
      for (let j = 0; j < N; j += 11) {
        worst = Math.max(worst, Math.abs(cosine(f32.vectors, D, i, j) - naive.cosine(f32, i, j)));
      }
    }
    expect(worst).toBeLessThan(4 * worstNorm);
  });

  it("is 1 with itself, symmetric, and never leaves [-1, 1]", () => {
    for (let i = 0; i < N; i++) {
      expect(cosine(f32.vectors, D, i, i)).toBeCloseTo(1, 6);
      for (let j = 0; j < N; j += 13) {
        const s = cosine(f32.vectors, D, i, j);
        expect(s).toBe(cosine(f32.vectors, D, j, i));
        expect(s).toBeGreaterThanOrEqual(-1);
        expect(s).toBeLessThanOrEqual(1);
      }
    }
  });

  it("returns -1 for a vector against its own negation", () => {
    const pair = new Float32Array(2 * D);
    for (let d = 0; d < D; d++) {
      pair[d] = f32.vectors[d] as number;
      pair[D + d] = -(f32.vectors[d] as number);
    }
    expect(cosine(pair, D, 0, 1)).toBeCloseTo(-1, 6);
  });
});

// ------------------------------------------------------ G3  neighbours -----

describe("G3  nearest neighbours", () => {
  it("agrees with a brute-force sort for every word", () => {
    for (let i = 0; i < N; i++) {
      const got = nearestNeighbours(f32.vectors, N, D, i, 8).map((n) => n.index);
      expect(got).toEqual(naive.topK(f32, i, 8));
    }
  });

  it("returns k results, never itself, strictly descending, no duplicates", () => {
    for (let i = 0; i < N; i += 5) {
      const got = nearestNeighbours(f32.vectors, N, D, i, 10);
      expect(got).toHaveLength(10);
      expect(got.some((n) => n.index === i)).toBe(false);
      expect(new Set(got.map((n) => n.index)).size).toBe(10);
      for (let k = 1; k < got.length; k++) {
        expect((got[k - 1] as { similarity: number }).similarity).toBeGreaterThanOrEqual(
          (got[k] as { similarity: number }).similarity,
        );
      }
    }
  });

  it("clamps k rather than inventing neighbours", () => {
    expect(nearestNeighbours(f32.vectors, N, D, 0, 10_000)).toHaveLength(N - 1);
    expect(nearestNeighbours(f32.vectors, N, D, 0, 0)).toHaveLength(0);
  });

  it("ranks agree with the neighbour list", () => {
    const ranks = similarityRanks(f32.vectors, N, D);
    for (let i = 0; i < N; i += 9) {
      const top = nearestNeighbours(f32.vectors, N, D, i, 5);
      top.forEach((n, k) => expect(ranks[i * N + n.index]).toBe(k + 1));
    }
  });
});

// ---------------------------------------------------------- G4  PCA --------

describe("G4  PCA against an independent reference", () => {
  const { rows, dimensions, data, componentVectors, eigenvalues, totalVariance } = reference;
  const fixture = Float64Array.from(data);
  const got = pca(fixture, rows, dimensions, componentVectors.length);

  it("recovers scikit-learn's components", () => {
    got.components.forEach((mine, c) => {
      const theirs = componentVectors[c] as number[];
      let dot = 0;
      for (let d = 0; d < dimensions; d++) dot += (mine[d] as number) * (theirs[d] as number);
      expect(Math.abs(dot)).toBeCloseTo(1, 9);
      for (let d = 0; d < dimensions; d++) {
        expect(mine[d] as number).toBeCloseTo(theirs[d] as number, 8);
      }
    });
  });

  it("recovers scikit-learn's eigenvalues, total variance and ratios", () => {
    got.eigenvalues.forEach((v, c) => expect(v).toBeCloseTo(eigenvalues[c] as number, 8));
    expect(got.totalVariance).toBeCloseTo(totalVariance, 8);
    varianceExplained(got).forEach((r, c) =>
      expect(r).toBeCloseTo(reference.explainedVarianceRatio[c] as number, 9),
    );
    expect(totalVarianceExplained(got)).toBeCloseTo(
      reference.explainedVarianceRatio.reduce((s, v) => s + v, 0),
      9,
    );
  });

  it("recovers the mean it centred on", () => {
    reference.mean.forEach((m, d) => expect(got.mean[d] as number).toBeCloseTo(m, 9));
  });

  it("produces orthonormal axes in descending order", () => {
    for (const c of got.components) {
      let norm = 0;
      for (const v of c) norm += v * v;
      expect(Math.sqrt(norm)).toBeCloseTo(1, 12);
    }
    for (let a = 0; a < got.components.length; a++) {
      for (let b = a + 1; b < got.components.length; b++) {
        const x = got.components[a] as Float64Array;
        const y = got.components[b] as Float64Array;
        let dot = 0;
        for (let d = 0; d < dimensions; d++) dot += (x[d] as number) * (y[d] as number);
        expect(Math.abs(dot)).toBeLessThan(1e-8);
      }
    }
    for (let c = 1; c < got.eigenvalues.length; c++) {
      expect(got.eigenvalues[c] as number).toBeLessThanOrEqual(got.eigenvalues[c - 1] as number);
    }
  });

  it("coordinates are the centred data projected onto the axes", () => {
    const k = got.components.length;
    for (let i = 0; i < rows; i++) {
      for (let c = 0; c < k; c++) {
        const axis = got.components[c] as Float64Array;
        let dot = 0;
        for (let d = 0; d < dimensions; d++) {
          dot += ((fixture[i * dimensions + d] as number) - (got.mean[d] as number)) * (axis[d] as number);
        }
        expect(got.coordinates[i * k + c] as number).toBeCloseTo(dot, 9);
      }
    }
    // and the spread along each axis really is the eigenvalue
    for (let c = 0; c < k; c++) {
      let sum = 0;
      for (let i = 0; i < rows; i++) sum += (got.coordinates[i * k + c] as number) ** 2;
      expect(sum / (rows - 1)).toBeCloseTo(got.eigenvalues[c] as number, 9);
    }
  });

  it("converges well inside the iteration cap on well-separated axes", () => {
    for (const it of got.iterations) expect(it).toBeLessThan(PCA_MAX_ITERATIONS);
  });

  it("rejects inputs it cannot do PCA on", () => {
    expect(() => pca(fixture, 1, dimensions, 2)).toThrow();
    expect(() => pca(fixture, rows, dimensions, 0)).toThrow();
    expect(() => pca(fixture, rows, dimensions, dimensions + 1)).toThrow();
  });
});

// ------------------------ G4b  PCA of the shipped file, against sklearn ----

describe("G4b  PCA of the shipped dataset matches scikit-learn", () => {
  const ref = datasetReference;
  const got = pca(f32.vectors, N, D, 2);

  it("the reference was generated from these exact bytes", () => {
    expect(ref.vocabularyChecksum).toBe(VOCABULARY_CHECKSUM);
    expect(ref.float32Sha256).toBe(meta.float32.sha256);
    expect(ref.rows).toBe(N);
    expect(ref.dimensions).toBe(D);
  });

  it("recovers both axes from the real 318 x 300 matrix", () => {
    got.components.forEach((mine, c) => {
      const theirs = ref.componentVectors[c] as number[];
      let dot = 0;
      for (let d = 0; d < D; d++) dot += (mine[d] as number) * (theirs[d] as number);
      expect(Math.abs(dot)).toBeCloseTo(1, 12);
    });
  });

  it("recovers the eigenvalues and the explained-variance figure the lab shows", () => {
    got.eigenvalues.forEach((v, c) => expect(v).toBeCloseTo(ref.eigenvalues[c] as number, 12));
    varianceExplained(got).forEach((r, c) =>
      expect(r).toBeCloseTo(ref.explainedVarianceRatio[c] as number, 12),
    );
    expect(got.totalVariance).toBeCloseTo(ref.totalVariance, 12);
  });

  it("each axis really is an eigenvector, cap or no cap", () => {
    // The second axis exits on PCA_MAX_ITERATIONS rather than PCA_TOLERANCE:
    // the eigenvalue gap here is 0.964, so the direction converges slowly. The
    // honest check is the residual -- is C^T C v parallel to v, and is the
    // eigenvalue right -- not whether the loop happened to exit early.
    const centred = new Float64Array(N * D);
    for (let i = 0; i < N; i++) {
      for (let d = 0; d < D; d++) {
        centred[i * D + d] = (f32.vectors[i * D + d] as number) - (got.mean[d] as number);
      }
    }
    got.components.forEach((v, c) => {
      const projectedRows = new Float64Array(N);
      for (let i = 0; i < N; i++) {
        let dot = 0;
        for (let d = 0; d < D; d++) dot += (centred[i * D + d] as number) * (v[d] as number);
        projectedRows[i] = dot;
      }
      const back = new Float64Array(D);
      for (let i = 0; i < N; i++) {
        for (let d = 0; d < D; d++) {
          back[d] = (back[d] as number) + (centred[i * D + d] as number) * (projectedRows[i] as number);
        }
      }
      const lambda = (got.eigenvalues[c] as number) * (N - 1);
      let residual = 0;
      for (let d = 0; d < D; d++) {
        residual = Math.max(residual, Math.abs((back[d] as number) - lambda * (v[d] as number)));
      }
      expect(residual).toBeLessThan(1e-8);
    });
  });

  it("puts every point where scikit-learn puts it, to a millionth of the plot", () => {
    let span = 0;
    for (let c = 0; c < 2; c++) {
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < N; i++) {
        lo = Math.min(lo, got.coordinates[i * 2 + c] as number);
        hi = Math.max(hi, got.coordinates[i * 2 + c] as number);
      }
      span = Math.max(span, hi - lo);
    }
    let worst = 0;
    for (let i = 0; i < N; i++) {
      for (let c = 0; c < 2; c++) {
        const axis = ref.componentVectors[c] as number[];
        let dot = 0;
        for (let d = 0; d < D; d++) {
          dot += ((f32.vectors[i * D + d] as number) - (got.mean[d] as number)) * (axis[d] as number);
        }
        worst = Math.max(worst, Math.abs(dot - (got.coordinates[i * 2 + c] as number)));
      }
    }
    expect(worst / span).toBeLessThan(1e-6);
  });
});

// ------------------------------------------- G5  the projection is real ----

describe("G5  the projection is computed, not looked up", () => {
  const base = pca(f32.vectors, N, D, 2);

  it("moving one vector moves its own point", () => {
    const moved = Float32Array.from(f32.vectors);
    for (let d = 0; d < D; d++) moved[d] = (moved[d] as number) + 0.35;
    const after = pca(moved, N, D, 2);
    const before = Math.hypot(base.coordinates[0] as number, base.coordinates[1] as number);
    const now = Math.hypot(after.coordinates[0] as number, after.coordinates[1] as number);
    expect(Math.abs(now - before)).toBeGreaterThan(1e-6);
  });

  it("and moves every other point too, because the axes are fitted to all of them", () => {
    const moved = Float32Array.from(f32.vectors);
    for (let d = 0; d < D; d++) moved[d] = (moved[d] as number) + 0.35;
    const after = pca(moved, N, D, 2);
    let shifted = 0;
    for (let i = 1; i < N; i++) {
      const dx = (after.coordinates[i * 2] as number) - (base.coordinates[i * 2] as number);
      const dy = (after.coordinates[i * 2 + 1] as number) - (base.coordinates[i * 2 + 1] as number);
      if (Math.hypot(dx, dy) > 1e-9) shifted++;
    }
    // A lookup table would have moved exactly one point. A projection moves all of them.
    expect(shifted).toBeGreaterThan(N * 0.9);
  });

  it("the coordinates are centred on the origin, as centring implies", () => {
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < N; i++) {
      sx += base.coordinates[i * 2] as number;
      sy += base.coordinates[i * 2 + 1] as number;
    }
    expect(Math.abs(sx / N)).toBeLessThan(1e-9);
    expect(Math.abs(sy / N)).toBeLessThan(1e-9);
  });
});

// ------------------------------------------------- G6  no special cases ----

describe("G6  no word is special-cased anywhere in the engine", () => {
  const sources = ["engine.ts", "dataset.ts"].map((f) => ({
    file: f,
    text: readFileSync(`src/labs/embedding-universe/${f}`, "utf8"),
  }));

  /** Strip comments, then collect every string literal. Prose is not code. */
  const literals = (text: string): string[] => {
    const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    return [...code.matchAll(/"([^"\\]*)"|'([^'\\]*)'|`([^`\\$]*)`/g)].map(
      (m) => m[1] ?? m[2] ?? m[3] ?? "",
    );
  };

  it("contains no string literal equal to a vocabulary word", () => {
    const words = new Set(VOCABULARY.map((w) => w.id.toLowerCase()));
    for (const { file, text } of sources) {
      for (const lit of literals(text)) {
        expect({ file, lit, isWord: words.has(lit.trim().toLowerCase()) }).toMatchObject({
          isWord: false,
        });
      }
    }
  });

  it("never imports the vocabulary, so it cannot branch on a label at all", () => {
    for (const { file, text } of sources) {
      expect({ file, imports: /from "\.\/vocabulary"/.test(text) }).toMatchObject({
        imports: false,
      });
    }
  });

  it("contains no hardcoded similarity, coordinate or rank result", () => {
    for (const { file, text } of sources) {
      const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
      // 0.xy style constants would be a pasted similarity; the engine has none.
      expect({ file, found: code.match(/\b0\.\d{2,}\b/g) ?? [] }).toMatchObject({ found: [] });
    }
  });
});

// ------------------------------------- G7  the map is not a category chart --

describe("G7  the projection does not just separate the curated categories", () => {
  /** Independent silhouette score: how cleanly labels separate, -1..1. */
  const silhouette = (coords: Float64Array, labels: string[], axes: number): number => {
    const groups = new Map<string, number[]>();
    labels.forEach((l, i) => groups.set(l, [...(groups.get(l) ?? []), i]));
    const dist = (i: number, j: number): number => {
      let s = 0;
      for (let c = 0; c < axes; c++) {
        const d = (coords[i * axes + c] as number) - (coords[j * axes + c] as number);
        s += d * d;
      }
      return Math.sqrt(s);
    };
    let total = 0;
    for (let i = 0; i < labels.length; i++) {
      const own = groups.get(labels[i] as string) as number[];
      if (own.length < 2) continue;
      const a = own.filter((j) => j !== i).reduce((s, j) => s + dist(i, j), 0) / (own.length - 1);
      let b = Infinity;
      for (const [label, members] of groups) {
        if (label === labels[i]) continue;
        b = Math.min(b, members.reduce((s, j) => s + dist(i, j), 0) / members.length);
      }
      total += (b - a) / Math.max(a, b);
    }
    return total / labels.length;
  };

  it("category silhouette in the 2-D view stays well below a clean split", () => {
    const projection = pca(f32.vectors, N, D, 2);
    const labels = VOCABULARY.map((w) => w.category);
    const score = silhouette(projection.coordinates, labels, 2);
    // A tidy eight-blob picture would score high. If this ever rises, the
    // vocabulary has been over-curated and the lab is teaching the word list.
    expect(score).toBeLessThan(0.35);
  });
});

// ---------------------------------------------- G8  distortion is found ----

describe("G8  the section-2 examples are measured, not chosen", () => {
  const projection = pca(f32.vectors, N, D, 2);
  const found = distortion(f32.vectors, N, D, projection);
  const trueRanks = similarityRanks(f32.vectors, N, D);

  it("the hidden-neighbour pair really is close in 300-D and far on screen", () => {
    const p = found.hiddenNeighbour;
    expect(p.a).not.toBe(p.b);
    expect(p.trueRank).toBeLessThan(N * 0.1);
    expect(p.screenRank).toBeGreaterThan(N * 0.5);
    expect(p.similarity).toBeCloseTo(cosine(f32.vectors, D, p.a, p.b), 12);
    expect(p.trueRank).toBe(trueRanks[p.a * N + p.b]);
  });

  it("the false-neighbour pair really is adjacent on screen and unrelated in 300-D", () => {
    const p = found.falseNeighbour;
    expect(p.a).not.toBe(p.b);
    expect(p.screenRank).toBeLessThan(N * 0.05);
    expect(p.trueRank).toBeGreaterThan(N * 0.5);
    expect(p.similarity).toBeLessThan(found.hiddenNeighbour.similarity);
  });

  it("both are the extreme pairs, so no nicer example was passed over", () => {
    // Independently rebuild the on-screen rank matrix, then scan every ordered
    // pair. If the engine had preferred a more flattering example over the true
    // extreme, these maxima would not match what it returned.
    const d = (i: number, j: number): number =>
      Math.hypot(
        (projection.coordinates[i * 2] as number) - (projection.coordinates[j * 2] as number),
        (projection.coordinates[i * 2 + 1] as number) - (projection.coordinates[j * 2 + 1] as number),
      );
    const screen = new Int32Array(N * N);
    for (let i = 0; i < N; i++) {
      const others = [...Array(N).keys()].filter((j) => j !== i);
      others.sort((x, y) => d(i, x) - d(i, y) || x - y);
      others.forEach((j, k) => (screen[i * N + j] = k + 1));
    }
    let bestHidden = -Infinity;
    let bestFalse = -Infinity;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const gap = (screen[i * N + j] as number) - (trueRanks[i * N + j] as number);
        bestHidden = Math.max(bestHidden, gap);
        bestFalse = Math.max(bestFalse, -gap);
      }
    }
    const h = found.hiddenNeighbour;
    const f = found.falseNeighbour;
    expect(h.screenRank).toBe(screen[h.a * N + h.b]);
    expect(h.screenRank - h.trueRank).toBe(bestHidden);
    expect(f.trueRank - f.screenRank).toBe(bestFalse);
  });

  it("scores the projection honestly: it loses a lot, and says so", () => {
    expect(found.rankCorrelation).toBeLessThan(0);
    expect(found.rankCorrelation).toBeGreaterThan(-1);
  });
});

// --------------------------------------------- G9  explained variance ------

describe("G9  explained variance is derived, never asserted", () => {
  const projection = pca(f32.vectors, N, D, 2);

  it("equals eigenvalue over total variance, recomputed independently", () => {
    // Total variance from scratch: sum of per-dimension sample variances.
    let total = 0;
    for (let d = 0; d < D; d++) {
      let mean = 0;
      for (let i = 0; i < N; i++) mean += f32.vectors[i * D + d] as number;
      mean /= N;
      let ss = 0;
      for (let i = 0; i < N; i++) ss += ((f32.vectors[i * D + d] as number) - mean) ** 2;
      total += ss / (N - 1);
    }
    expect(projection.totalVariance).toBeCloseTo(total, 10);
    varianceExplained(projection).forEach((r, c) =>
      expect(r).toBeCloseTo((projection.eigenvalues[c] as number) / total, 12),
    );
  });

  it("two of three hundred axes account for only a small share", () => {
    const share = totalVarianceExplained(projection);
    expect(share).toBeGreaterThan(0);
    expect(share).toBeLessThan(0.5);
  });
});

// ------------------------------------------------- G10  determinism --------

describe("G10  the same input gives the same bits", () => {
  it("PCA repeats exactly", () => {
    const a = pca(f32.vectors, N, D, 2);
    const b = pca(f32.vectors, N, D, 2);
    expect(Array.from(a.coordinates)).toEqual(Array.from(b.coordinates));
    expect(a.eigenvalues).toEqual(b.eigenvalues);
    a.components.forEach((c, i) =>
      expect(Array.from(c)).toEqual(Array.from(b.components[i] as Float64Array)),
    );
  });

  it("the sign convention is applied, so the map cannot mirror between runs", () => {
    const p = pca(f32.vectors, N, D, 2);
    for (const c of p.components) {
      let peak = 0;
      for (let d = 0; d < c.length; d++) {
        if (Math.abs(c[d] as number) > Math.abs(c[peak] as number)) peak = d;
      }
      expect(c[peak] as number).toBeGreaterThan(0);
    }
  });

  it("neighbours and distortion repeat exactly", () => {
    expect(nearestNeighbours(f32.vectors, N, D, 3, 8)).toEqual(
      nearestNeighbours(f32.vectors, N, D, 3, 8),
    );
    const p = pca(f32.vectors, N, D, 2);
    expect(distortion(f32.vectors, N, D, p)).toEqual(distortion(f32.vectors, N, D, p));
  });
});

// ------------------------------------------ G11  int16 == float32 ----------

describe("G11  the shipped int16 file behaves like the float32 reference", () => {
  it("reproduces the top-8 neighbours of every word, in the same order", () => {
    for (let i = 0; i < N; i++) {
      const a = nearestNeighbours(f32.vectors, N, D, i, 8).map((n) => n.index);
      const b = nearestNeighbours(i16.vectors, N, D, i, 8).map((n) => n.index);
      expect({ word: (VOCABULARY[i] as { id: string }).id, top8: b }).toEqual({
        word: (VOCABULARY[i] as { id: string }).id,
        top8: a,
      });
    }
  });

  it("keeps every cosine within a tolerance far below anything displayed", () => {
    let worst = 0;
    for (let i = 0; i < N; i += 3) {
      for (let j = 0; j < N; j += 5) {
        worst = Math.max(
          worst,
          Math.abs(cosine(f32.vectors, D, i, j) - cosine(i16.vectors, D, i, j)),
        );
      }
    }
    expect(worst).toBeLessThan(1e-3);
  });

  it("puts every point in the same place on the map", () => {
    const a = pca(f32.vectors, N, D, 2);
    const b = pca(i16.vectors, N, D, 2);
    let span = 0;
    for (let c = 0; c < 2; c++) {
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < N; i++) {
        lo = Math.min(lo, a.coordinates[i * 2 + c] as number);
        hi = Math.max(hi, a.coordinates[i * 2 + c] as number);
      }
      span = Math.max(span, hi - lo);
    }
    let worst = 0;
    for (let i = 0; i < N; i++) {
      worst = Math.max(
        worst,
        Math.hypot(
          (a.coordinates[i * 2] as number) - (b.coordinates[i * 2] as number),
          (a.coordinates[i * 2 + 1] as number) - (b.coordinates[i * 2 + 1] as number),
        ),
      );
    }
    expect(worst / span).toBeLessThan(0.01);
  });

  it("reports the same explained variance to three decimal places", () => {
    expect(totalVarianceExplained(pca(i16.vectors, N, D, 2))).toBeCloseTo(
      totalVarianceExplained(pca(f32.vectors, N, D, 2)),
      3,
    );
  });

  it("stores scales that reconstruct the reference, even though decoding ignores them", () => {
    const scales = readInt16Scales(rawI16, N, D);
    expect(scales.length).toBe(N);
    for (const s of scales) expect(s).toBeGreaterThan(0);
    // q * s should land back on the original float32 row, up to the step size.
    const view = new DataView(rawI16);
    for (let i = 0; i < N; i += 17) {
      for (let d = 0; d < D; d += 7) {
        const q = view.getInt16((i * D + d) * 2, true);
        const rebuilt = q * (scales[i] as number);
        expect(Math.abs(rebuilt - (f32.vectors[i * D + d] as number))).toBeLessThan(
          (scales[i] as number) * 1.001,
        );
      }
    }
  });
});
