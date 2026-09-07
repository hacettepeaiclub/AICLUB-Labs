/**
 * The dataset: what the vectors are, and how the bytes become numbers.
 *
 * There are two binaries for the same 318 words, and only one of them ships.
 * `vectors.i16.bin` lives in `public/` and is the single vector asset a browser
 * ever downloads. `vectors.f32.bin` is the reference — exactly the published
 * GloVe rows, L2-normalised, nothing else done to them — and it sits in
 * `fixtures/`, outside the served tree, because its only job is to be the thing
 * int16 is proved lossless against. Serving it would have doubled the lab's
 * asset weight for a file nobody fetches.
 *
 * ## Why quantising is allowed here
 *
 * Because it was measured rather than assumed. Against the float32 reference,
 * over all 318 words, int16 reproduces the top-5 neighbours in the same order
 * 100% of the time, the top-8 sets 100% of the time, with a worst-case cosine
 * error of 1.5e-5 and a worst-case shift of 2.2e-5 in a projection whose plot
 * spans 1.0. int8 was tried first and rejected: it changed top-8 membership for
 * 4.3% of the words, and this lab puts exact rankings on screen.
 * `engine.test.ts` re-checks the int16 claim on every run.
 *
 * ## Why the stored scales are not used to decode
 *
 * Quantisation is symmetric and per-vector: `q = round(v / s)`. Decoding
 * re-normalises to unit length, and `L2(s * q) === L2(q)` for any `s > 0`, so
 * the scale cancels exactly. The generator stores the scales anyway, because a
 * file that cannot reconstruct its own input is a worse record.
 */

/** Provenance for the shipped vectors — mirrors `dataset.json`. */
export interface DatasetMeta {
  readonly datasetVersion: number;
  readonly generatedAt: string;
  readonly vocabularyVersion: number;
  readonly vocabularyChecksum: string;
  readonly wordCount: number;
  readonly dimensions: number;
  readonly model: {
    readonly id: string;
    readonly revision: string;
    readonly tensor: string;
    readonly underlying: string;
    readonly license: string;
    readonly method: string;
    readonly normalization: string;
  };
  readonly float32: BinaryMeta & { readonly location: string };
  readonly int16: BinaryMeta & { readonly location: string; readonly scheme: string; readonly note: string };
}

export interface BinaryMeta {
  readonly file: string;
  readonly bytes: number;
  readonly layout: string;
  readonly sha256: string;
}

/** Unit-length row vectors, laid out `count` rows of `dimensions`. */
export interface EmbeddingSet {
  readonly vectors: Float32Array;
  readonly count: number;
  readonly dimensions: number;
}

export const BASE_PATH = "/labs/embedding-universe/";

/**
 * L2-normalise one row in place.
 *
 * A zero row would be a corrupt file rather than a degenerate word, so it
 * throws instead of quietly producing NaNs that would surface later as an
 * empty neighbour list.
 */
function normalizeRow(target: Float32Array, offset: number, dimensions: number, label: string): void {
  let sum = 0;
  for (let d = 0; d < dimensions; d++) {
    const v = target[offset + d]!;
    if (!Number.isFinite(v)) throw new Error(`${label}: non-finite component at ${offset + d}`);
    sum += v * v;
  }
  const norm = Math.sqrt(sum);
  if (!(norm > 0)) throw new Error(`${label}: zero-length vector at row ${offset / dimensions}`);
  for (let d = 0; d < dimensions; d++) target[offset + d] = target[offset + d]! / norm;
}

/**
 * Read the float32 reference.
 *
 * The rows are already unit length on disk, so this reads them and checks
 * rather than renormalising — the point of the reference is to be untouched.
 * Reads go through `DataView` with an explicit little-endian flag so the file
 * means the same thing regardless of the host that reads it.
 */
export function decodeFloat32(bytes: ArrayBuffer, count: number, dimensions: number): EmbeddingSet {
  const expected = count * dimensions * 4;
  if (bytes.byteLength !== expected) {
    throw new Error(`vectors.f32.bin: expected ${expected} bytes, got ${bytes.byteLength}`);
  }
  const view = new DataView(bytes);
  const vectors = new Float32Array(count * dimensions);
  for (let i = 0; i < vectors.length; i++) {
    const v = view.getFloat32(i * 4, true);
    if (!Number.isFinite(v)) throw new Error(`vectors.f32.bin: non-finite component at ${i}`);
    vectors[i] = v;
  }
  return { vectors, count, dimensions };
}

/**
 * Read the shipped int16 file and rebuild unit vectors.
 *
 * Trailing per-vector scales are present in the file and deliberately skipped:
 * see the note at the top. Decoding is therefore `Int16 -> Float32 -> L2`.
 */
export function decodeInt16(bytes: ArrayBuffer, count: number, dimensions: number): EmbeddingSet {
  const quantised = count * dimensions * 2;
  const expected = quantised + count * 4;
  if (bytes.byteLength !== expected) {
    throw new Error(`vectors.i16.bin: expected ${expected} bytes, got ${bytes.byteLength}`);
  }
  const view = new DataView(bytes);
  const vectors = new Float32Array(count * dimensions);
  for (let i = 0; i < vectors.length; i++) vectors[i] = view.getInt16(i * 2, true);
  for (let row = 0; row < count; row++) {
    normalizeRow(vectors, row * dimensions, dimensions, "vectors.i16.bin");
  }
  return { vectors, count, dimensions };
}

/** The per-vector scales the generator recorded. Not needed to decode. */
export function readInt16Scales(bytes: ArrayBuffer, count: number, dimensions: number): Float32Array {
  const view = new DataView(bytes);
  const base = count * dimensions * 2;
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) scales[i] = view.getFloat32(base + i * 4, true);
  return scales;
}
