/**
 * Builds the Embedding Universe dataset from published GloVe vectors.
 *
 *   node tools/embedding-universe/build-dataset.mjs
 *
 * Needs only Node and network access — no Python, no ML runtime. It reads the
 * frozen word list out of `src/labs/embedding-universe/vocabulary.ts`, pulls
 * exactly those rows out of the published safetensors matrix using HTTP range
 * requests (about 0.4 MB instead of the full 480 MB), L2-normalises them, and
 * writes the two binaries plus their metadata.
 *
 * Everything about the run is pinned: the model revision is a commit hash, the
 * row order comes from the vocabulary file, and the outputs are checksummed.
 * Re-running it on the same vocabulary must reproduce identical files, and
 * `engine.test.ts` checks the checksums it recorded.
 *
 * WHY THIS MODEL. Measured against sentence-transformers/paraphrase-
 * multilingual-MiniLM-L12-v2 on 42 hand-written probes over this same word
 * list, GloVe scored 97.6% hit@5 versus 88.1%, with far less hubness. The
 * multilingual model was rejected: on Turkish it scored 64.3%, and its English
 * and Turkish spaces disagreed badly (top-8 Jaccard 0.20). GloVe's pretrained
 * vectors are also public domain (PDDL v1.0), which the alternatives are not.
 */

/*
 * Declared rather than switched off: this is a Node script and the lint config
 * assumes browser globals outside `src`. Naming the three it uses keeps
 * `no-undef` live for everything else, and leaves the shared config alone.
 */
/* global fetch, Buffer, console */

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const MODEL = "sentence-transformers/average_word_embeddings_glove.6B.300d";
const REVISION = "e5e8fec6971be8960cfaa853a77a6ddc62a265d7";
const BASE = `https://huggingface.co/${MODEL}/resolve/${REVISION}/`;
const TENSOR = BASE + "0_WordEmbeddings/model.safetensors";
const VOCAB_TS = "src/labs/embedding-universe/vocabulary.ts";
/** Runtime asset directory — everything here is deployed and fetchable. */
const OUT = "public/labs/embedding-universe/";
/**
 * The float32 reference lives outside `public/` on purpose.
 *
 * It exists so the tests can prove the shipped int16 file is lossless, and it
 * is never fetched by the lab. Left in `public/` it would have been copied into
 * `dist/` and served — 373 KB of dead weight, twice the size of the file that
 * actually does the work.
 */
const REFERENCE_OUT = "src/labs/embedding-universe/fixtures/";

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

/** The ids, read from the frozen vocabulary. One `w("id", …)` per line by construction. */
function readVocabulary() {
  const src = readFileSync(VOCAB_TS, "utf8");
  const ids = [...src.matchAll(/^ {2}w\("([^"]+)",/gm)].map((m) => m[1]);
  const checksum = /VOCABULARY_CHECKSUM =\s*\n?\s*"([0-9a-f]{64})"/.exec(src)?.[1];
  const version = Number(/VOCABULARY_VERSION = (\d+)/.exec(src)?.[1]);
  const own = sha256(ids.join("\0"));
  if (own !== checksum) {
    throw new Error(`vocabulary checksum mismatch\n  file says ${checksum}\n  ids give ${own}`);
  }
  if (new Set(ids).size !== ids.length) throw new Error("duplicate ids in vocabulary");
  return { ids, checksum, version };
}

async function main() {
  const { ids, checksum, version } = readVocabulary();
  console.log(`vocabulary v${version}: ${ids.length} words, checksum ok`);

  // safetensors: u64 header length, then a JSON header, then raw tensor bytes.
  const lenBuf = await (await fetch(TENSOR, { headers: { Range: "bytes=0-7" } })).arrayBuffer();
  const headerLen = Number(new DataView(lenBuf).getBigUint64(0, true));
  const headerRaw = await (
    await fetch(TENSOR, { headers: { Range: `bytes=8-${7 + headerLen}` } })
  ).arrayBuffer();
  const header = JSON.parse(Buffer.from(headerRaw).toString("utf8"));
  const key = Object.keys(header).find((k) => k !== "__metadata__");
  const tensor = header[key];
  if (tensor.dtype !== "F32") throw new Error(`expected F32 tensor, got ${tensor.dtype}`);
  const [rows, DIM] = tensor.shape;
  const dataStart = 8 + headerLen;
  console.log(`tensor ${key} ${tensor.dtype} [${rows}, ${DIM}]`);

  const cfg = await (await fetch(BASE + "0_WordEmbeddings/whitespacetokenizer_config.json")).json();
  const raw = cfg.vocab ?? cfg.word2idx ?? cfg;
  const index = Array.isArray(raw) ? Object.fromEntries(raw.map((wd, i) => [wd, i])) : raw;

  const missing = ids.filter((w) => index[w] === undefined);
  if (missing.length) throw new Error(`not in GloVe: ${missing.join(", ")}`);

  // One range request per word, in vocabulary order.
  const f32 = new Float32Array(ids.length * DIM);
  let fetched = 0;
  for (let i = 0; i < ids.length; i++) {
    const off = dataStart + index[ids[i]] * DIM * 4;
    const res = await fetch(TENSOR, { headers: { Range: `bytes=${off}-${off + DIM * 4 - 1}` } });
    const ab = await res.arrayBuffer();
    if (ab.byteLength !== DIM * 4) throw new Error(`short read for ${ids[i]}`);
    const view = new DataView(ab);
    let sum = 0;
    for (let d = 0; d < DIM; d++) {
      const v = view.getFloat32(d * 4, true);
      f32[i * DIM + d] = v;
      sum += v * v;
    }
    const norm = Math.sqrt(sum);
    if (!(norm > 0) || !Number.isFinite(norm)) throw new Error(`bad vector for ${ids[i]}`);
    for (let d = 0; d < DIM; d++) f32[i * DIM + d] /= norm; // L2 — this is the only transform
    fetched += ab.byteLength;
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${ids.length}`);
  }
  console.log(`fetched ${(fetched / 1024).toFixed(0)} KB of ${((rows * DIM * 4) / 1e6).toFixed(0)} MB`);

  // int16, per-vector symmetric scale. Measured lossless on every quantity the
  // lab displays: 100% top-5 order and top-8 set agreement against float32.
  const Q = 32767;
  const i16 = new Int16Array(ids.length * DIM);
  const scales = new Float32Array(ids.length);
  for (let i = 0; i < ids.length; i++) {
    let peak = 0;
    for (let d = 0; d < DIM; d++) peak = Math.max(peak, Math.abs(f32[i * DIM + d]));
    const s = peak / Q;
    scales[i] = s;
    for (let d = 0; d < DIM; d++) {
      i16[i * DIM + d] = Math.max(-Q, Math.min(Q, Math.round(f32[i * DIM + d] / s)));
    }
  }

  // Explicit little-endian writes so the files do not depend on the build host.
  const fBuf = Buffer.alloc(f32.length * 4);
  for (let i = 0; i < f32.length; i++) fBuf.writeFloatLE(f32[i], i * 4);
  const qBuf = Buffer.alloc(i16.length * 2 + scales.length * 4);
  for (let i = 0; i < i16.length; i++) qBuf.writeInt16LE(i16[i], i * 2);
  for (let i = 0; i < scales.length; i++) qBuf.writeFloatLE(scales[i], i16.length * 2 + i * 4);

  writeFileSync(REFERENCE_OUT + "vectors.f32.bin", fBuf);
  writeFileSync(OUT + "vectors.i16.bin", qBuf);

  const meta = {
    datasetVersion: 1,
    generatedAt: new Date().toISOString().slice(0, 10),
    vocabularyVersion: version,
    vocabularyChecksum: checksum,
    wordCount: ids.length,
    dimensions: DIM,
    model: {
      id: MODEL,
      revision: REVISION,
      tensor: key,
      underlying: "GloVe 6B 300d (Stanford NLP), trained on Wikipedia 2014 + Gigaword 5",
      license: "PDDL v1.0 (public domain) for the pretrained vectors",
      method: "word-level lookup — no tokenisation, no pooling, no inference",
      normalization: "L2 to unit length, applied by this script; GloVe ships un-normalised",
    },
    float32: {
      file: "vectors.f32.bin",
      location: "src/labs/embedding-universe/fixtures/ — test reference, never shipped or fetched",
      bytes: fBuf.length,
      layout: "wordCount x dimensions, little-endian f32, vocabulary order",
      sha256: sha256(fBuf),
    },
    int16: {
      file: "vectors.i16.bin",
      location: "public/labs/embedding-universe/ — the only vector asset the browser fetches",
      bytes: qBuf.length,
      layout: "wordCount x dimensions little-endian i16, then wordCount little-endian f32 scales",
      scheme: `symmetric per-vector: q = round(v / s) clamped to +/-${Q}, s = max|v| / ${Q}`,
      note: "scales are stored for completeness but are not needed to decode: the decoder re-normalises, and L2(s*q) === L2(q) for s > 0",
      sha256: sha256(qBuf),
    },
  };
  writeFileSync(OUT + "dataset.json", JSON.stringify(meta, null, 2) + "\n");
  console.log(`\nwrote ${REFERENCE_OUT}vectors.f32.bin  ${(fBuf.length / 1024).toFixed(0)} KB  ${meta.float32.sha256.slice(0, 16)}  (reference, not shipped)`);
  console.log(`wrote ${OUT}vectors.i16.bin  ${(qBuf.length / 1024).toFixed(0)} KB  ${meta.int16.sha256.slice(0, 16)}`);
  console.log(`wrote ${OUT}dataset.json`);
}

await main();
