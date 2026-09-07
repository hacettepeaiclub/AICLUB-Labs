# Embedding Universe — dataset generation

The lab ships real, published word vectors. This directory holds the one script
that produces them, so the dataset can be rebuilt from scratch rather than
trusted.

```bash
node tools/embedding-universe/build-dataset.mjs
```

Node and a network connection are all it needs — no Python, no ML runtime. It
takes about a minute, almost all of it network round-trips.

## What it does

1. Reads the frozen word list out of `src/labs/embedding-universe/vocabulary.ts`
   and refuses to run if `VOCABULARY_CHECKSUM` does not match the ids it found.
2. Pulls exactly those rows out of the published safetensors matrix with HTTP
   range requests — about 0.4 MB instead of the full 480 MB — at a pinned commit.
3. L2-normalises each row. That is the only transform applied; GloVe ships the
   vectors un-normalised.
4. Writes `public/labs/embedding-universe/`:
   - `vectors.f32.bin` — the reference. Untouched values, little-endian float32.
   - `vectors.i16.bin` — what the browser downloads. int16 plus trailing scales.
   - `dataset.json` — provenance, layout and sha256 of both binaries.

Re-running it on the same vocabulary reproduces identical files.
`src/labs/embedding-universe/engine.test.ts` re-checks the checksums, so a
dataset that drifts from its metadata fails the suite.

## Source

| | |
| --- | --- |
| Repository | `sentence-transformers/average_word_embeddings_glove.6B.300d` |
| Revision | `e5e8fec6971be8960cfaa853a77a6ddc62a265d7` |
| Underlying vectors | GloVe 6B 300d (Stanford NLP), Wikipedia 2014 + Gigaword 5 |
| Licence | **PDDL v1.0 — public domain**, for the pretrained vectors |
| Dimensions | 300 |
| Method | word-level lookup: no tokenisation, no pooling, no inference |

## Why GloVe, and not a sentence-transformer

This was measured before it was decided, over the same 318-word list and the
same 42 hand-written probes (written before any vector was computed):

| | English hit@5 | Turkish hit@5 | mean pairwise cosine | worst hub |
| --- | --- | --- | --- | --- |
| GloVe 6B 300d | **97.6 %** | — (English only) | 0.120 | 31 |
| paraphrase-multilingual-MiniLM-L12-v2 | 88.1 % | 64.3 % | 0.239 / 0.422 | 105 / 141 |

The multilingual model was the original choice, for Turkish. It was rejected on
its own terms: Turkish scored 64.3 %, its Turkish space was badly collapsed
(words like `tazı` and `cep` turned up in more than a hundred different top-10
lists), and its English and Turkish spaces did not agree with each other —
top-8 neighbour Jaccard 0.20, Spearman 0.36 between the two similarity
matrices. Two disagreeing spaces is two different labs, not one lab in two
languages.

Mean-centring, the standard fix for that kind of collapse, was tried and
measured: it repaired the geometry (mean pairwise cosine 0.42 → 0.00) and lifted
Turkish to 73.8 %, still short, while *lowering* English. It is not applied.

So the embedding space is English-only, and the lab has to say so. Turkish
labels in `vocabulary.ts` are glosses for the interface; no vector is ever built
from them.

GloVe also has the cleanest licence of any candidate — its pretrained vectors
are public domain, where fastText (CC BY-SA 3.0) and ConceptNet Numberbatch
(CC BY-SA 4.0) both carry share-alike obligations.

## Quantisation

int16, symmetric, per-vector scale: `q = round(v / s)`, `s = max|v| / 32767`.

Chosen by measurement against the float32 reference across all 318 words:

| | size | top-5 order | top-8 set | worst cosine error | worst map shift |
| --- | --- | --- | --- | --- | --- |
| float32 | 373 KB | 100 % | 100 % | 0 | 0 |
| **int16** | **188 KB** | **100 %** | **100 %** | 1.5e-5 | 2.2e-5 |
| int8 | 94 KB | 95.4 % | 95.7 % | 3.8e-3 | 7.2e-3 |

int8 was rejected: it changes top-8 membership for 4.3 % of words, and this lab
puts exact rankings on screen. The map shift is quoted against a plot spanning
1.0, so int16's is roughly one part in fifty thousand.

The scales are stored but not needed to decode — the decoder re-normalises, and
`L2(s·q) === L2(q)` for `s > 0`. They are kept because a file that cannot
reconstruct its own input is a worse record.
