/**
 * Byte-pair encoding, trained in the browser on a small corpus.
 *
 * Pure TypeScript — no React, no DOM, no randomness. The lab drives this engine
 * by calling `trainStep()` repeatedly; nothing is precomputed and replayed.
 *
 * ## What the lab is trying to show
 *
 * Tokens are not handed down. They are *learned*, by counting: whichever pair
 * of neighbouring pieces occurs most often in the training text is fused into a
 * single piece, and the count is taken again. Repeat a few hundred times and
 * the frequent shapes of that particular language — `the`, `ing`, ` and`, or
 * `ler`, `imiz`, `den` — end up as single tokens, while everything the corpus
 * never saw stays shattered into characters.
 *
 * That is the whole lesson: **what the tokenizer was trained on decides what is
 * cheap to say.**
 *
 * ## Honesty about scope
 *
 * BPE is the algorithm family behind the tokenizers of GPT-2 and many models
 * since, so the mechanism here is real. The *vocabulary* is not: it is trained
 * on a few kilobytes of text written for this lab, not on hundreds of gigabytes
 * of web text. Token counts produced here are this tokenizer's counts and must
 * never be presented as any deployed model's counts.
 *
 * Two further simplifications, both deliberate:
 *
 * - This is **character-level**, not byte-level, BPE. Production tokenizers
 *   work on UTF-8 bytes, which shatters `ş` and `ğ` into two units before
 *   training even begins. That is realistic and, at this scale, unreadable —
 *   and it would bury the Turkish lesson under an encoding artefact.
 * - There is **no unknown token**. A character the corpus never contained is
 *   simply emitted on its own and flagged `known: false`, which keeps
 *   `detokenize(tokenize(t)) === t` true for every possible input.
 *
 * ## Note on `!`
 *
 * Indices below are bounded by the length of the array being walked, so they
 * are provably in range; the assertions keep the hot loops free of redundant
 * undefined checks, following the convention of the other lab engines.
 */

// ---------------------------------------------------------- pre-tokenizer ---

/**
 * Where merging is *not* allowed to reach across.
 *
 * BPE never fuses a pair that straddles two of these pieces, which is why no
 * token in this lab ever spans a word boundary. The alternatives, in order:
 *
 * 1. `'\p{L}+`  — an apostrophe suffix, so `don't` and `Ankara'dan` keep their
 *    ending attached rather than being cut into three.
 * 2. ` ?\p{L}+` — a word, **with its leading space folded in**. This is the
 *    rule that makes `hello` and ` hello` different pieces, and it is why
 *    spacing has a price the visitor can watch change.
 * 3. ` ?\p{N}+` — a run of digits, so `1000000` is one piece and `1,000,000`
 *    is five.
 * 4. ` ?[^\s\p{L}\p{N}]+` — punctuation and symbols.
 * 5. `\s+(?!\S)` then `\s+` — leftover whitespace. The lookahead hands the
 *    final space of a run to the word that follows, so a *doubled* space
 *    leaves a stray piece behind while a single one does not.
 *
 * Every character matches one of these, so the pieces concatenate back to the
 * original text exactly.
 */
const PRE_TOKEN = /'\p{L}+| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;

export interface Piece {
  readonly text: string;
  /** Offset into the source string, in JS string units. */
  readonly start: number;
  readonly end: number;
}

/**
 * Split text into the units BPE is allowed to work inside.
 *
 * Exhaustive by construction: any character the pattern somehow failed to
 * claim is emitted as its own piece, so the pieces always rebuild the input.
 */
export function preTokenize(text: string): Piece[] {
  const pieces: Piece[] = [];
  PRE_TOKEN.lastIndex = 0;
  let cursor = 0;

  for (let m = PRE_TOKEN.exec(text); m !== null; m = PRE_TOKEN.exec(text)) {
    if (m.index > cursor) {
      pieces.push({ text: text.slice(cursor, m.index), start: cursor, end: m.index });
    }
    pieces.push({ text: m[0], start: m.index, end: m.index + m[0].length });
    cursor = m.index + m[0].length;
    // A zero-length match would spin forever; the pattern cannot produce one,
    // but the guard costs nothing and the loop is not worth trusting blindly.
    if (m[0].length === 0) PRE_TOKEN.lastIndex++;
  }

  if (cursor < text.length) {
    pieces.push({ text: text.slice(cursor), start: cursor, end: text.length });
  }
  return pieces;
}

// --------------------------------------------------------------- training ---

export interface Merge {
  /** The left-hand piece of the fused pair. */
  readonly left: string;
  readonly right: string;
  /** `left + right` — the new vocabulary entry. */
  readonly token: string;
  /** How often the pair occurred in the corpus at the moment it was chosen. */
  readonly frequency: number;
}

/** A trained tokenizer: the characters it started from, and what it learned. */
export interface Vocabulary {
  readonly id: string;
  /** Distinct characters of the corpus, in the order they were first met. */
  readonly base: readonly string[];
  /** Learned merges, in the order they were learned. Order is the model. */
  readonly merges: readonly Merge[];
}

/** Everything one `trainStep()` produced, including a worked example. */
export interface MergeEvent {
  /** 0-based position in the merge list. */
  readonly index: number;
  readonly left: string;
  readonly right: string;
  readonly token: string;
  readonly frequency: number;
  /** Vocabulary size after this merge: base characters plus merges so far. */
  readonly vocabularySize: number;
  /** Total tokens the corpus costs after this merge. Falls by `frequency`. */
  readonly corpusTokens: number;
  /** A word from the corpus that contained the pair, for a before/after view. */
  readonly example: string;
  readonly exampleBefore: readonly string[];
  readonly exampleAfter: readonly string[];
}

export type TrainerStatus = "training" | "done";

export interface Trainer {
  readonly id: string;
  readonly base: readonly string[];
  readonly merges: Merge[];
  status: TrainerStatus;
  /** Distinct pre-tokens in the corpus. */
  readonly words: number;
  /** Pre-tokens in the corpus, counted with repeats — the starting size. */
  readonly corpusPieces: number;
  /** Characters in the corpus, counted by code point. */
  readonly corpusCharacters: number;
  /** What the corpus currently costs in tokens. Starts at `corpusCharacters`. */
  corpusTokens: number;

  // --- internal; not part of the public contract ---
  /** One entry per distinct pre-token: its symbols, as vocabulary ids. */
  readonly sequences: number[][];
  /** How often each distinct pre-token occurs. */
  readonly weights: number[];
  /** The source text of each distinct pre-token, for worked examples. */
  readonly sources: string[];
  /** id -> text, for every vocabulary entry. Base characters occupy `0..b`. */
  readonly symbols: string[];
  /** A pair seen fewer times than this is not worth fusing. */
  readonly minFrequency: number;
}

/**
 * Ids are packed two-per-number to key the pair table. The vocabularies this
 * lab trains hold a few hundred entries, so a 2^20 stride is not close to
 * being tight, and the product stays exactly representable.
 */
const PAIR_STRIDE = 1 << 20;

/**
 * Read a corpus and prepare it for training.
 *
 * The corpus is reduced to *distinct* pre-tokens with counts, which is what
 * makes a few hundred merges cheap: a merge rewrites one entry per distinct
 * word, not one per occurrence.
 */
export function createTrainer(corpus: string, id = "custom", minFrequency = 2): Trainer {
  const base: string[] = [];
  const charId = new Map<string, number>();

  const sequences: number[][] = [];
  const weights: number[] = [];
  const sources: string[] = [];
  const seen = new Map<string, number>();

  let corpusPieces = 0;
  let corpusCharacters = 0;

  for (const piece of preTokenize(corpus)) {
    corpusPieces++;
    const at = seen.get(piece.text);
    if (at !== undefined) {
      weights[at]!++;
      corpusCharacters += sequences[at]!.length;
      continue;
    }

    const ids: number[] = [];
    for (const character of piece.text) {
      let cid = charId.get(character);
      if (cid === undefined) {
        cid = base.length;
        charId.set(character, cid);
        base.push(character);
      }
      ids.push(cid);
    }

    seen.set(piece.text, sequences.length);
    sequences.push(ids);
    weights.push(1);
    sources.push(piece.text);
    corpusCharacters += ids.length;
  }

  return {
    id,
    base,
    merges: [],
    status: "training",
    words: sequences.length,
    corpusPieces,
    corpusCharacters,
    corpusTokens: corpusCharacters,
    sequences,
    weights,
    sources,
    symbols: base.slice(),
    minFrequency,
  };
}

interface Candidate {
  left: number;
  right: number;
  frequency: number;
  /** Index of the first distinct pre-token containing the pair. */
  example: number;
}

/**
 * Count every adjacent pair and return the winner.
 *
 * The tie-break is explicit rather than incidental: among pairs of equal
 * frequency the one whose *first occurrence* comes earliest in the corpus
 * wins. That is a total order over a fixed corpus, so training is reproducible
 * without depending on the iteration order of a Map.
 */
function bestPair(t: Trainer): Candidate | null {
  const frequency = new Map<number, number>();
  const order = new Map<number, number>();
  const example = new Map<number, number>();
  let rank = 0;

  for (let w = 0; w < t.sequences.length; w++) {
    const ids = t.sequences[w]!;
    const weight = t.weights[w]!;
    for (let i = 0; i + 1 < ids.length; i++) {
      const key = ids[i]! * PAIR_STRIDE + ids[i + 1]!;
      const seen = frequency.get(key);
      if (seen === undefined) {
        frequency.set(key, weight);
        order.set(key, rank++);
        example.set(key, w);
      } else {
        frequency.set(key, seen + weight);
      }
    }
  }

  let bestKey = -1;
  let bestFreq = 0;
  let bestOrder = Infinity;
  for (const [key, freq] of frequency) {
    const seq = order.get(key)!;
    if (freq > bestFreq || (freq === bestFreq && seq < bestOrder)) {
      bestKey = key;
      bestFreq = freq;
      bestOrder = seq;
    }
  }

  if (bestKey < 0 || bestFreq < t.minFrequency) return null;
  return {
    left: Math.floor(bestKey / PAIR_STRIDE),
    right: bestKey % PAIR_STRIDE,
    frequency: bestFreq,
    example: example.get(bestKey)!,
  };
}

/** Rewrite one sequence in place, fusing every occurrence of `left, right`. */
function fuse(ids: number[], left: number, right: number, merged: number): number {
  let write = 0;
  let read = 0;
  let fused = 0;
  while (read < ids.length) {
    if (read + 1 < ids.length && ids[read] === left && ids[read + 1] === right) {
      ids[write++] = merged;
      read += 2;
      fused++;
    } else {
      ids[write++] = ids[read++]!;
    }
  }
  if (fused > 0) ids.length = write;
  return fused;
}

const spell = (t: Trainer, ids: readonly number[]): string[] => ids.map((id) => t.symbols[id]!);

/**
 * Learn exactly one merge.
 *
 * Returns `null` — and marks the trainer done — when no pair occurs often
 * enough to be worth fusing. Calling it again on a finished trainer is a
 * no-op that returns `null`.
 */
export function trainStep(t: Trainer): MergeEvent | null {
  if (t.status === "done") return null;

  const pick = bestPair(t);
  if (pick === null) {
    t.status = "done";
    return null;
  }

  const left = t.symbols[pick.left]!;
  const right = t.symbols[pick.right]!;
  const token = left + right;
  const merged = t.symbols.length;
  t.symbols.push(token);

  const exampleBefore = spell(t, t.sequences[pick.example]!);

  let fused = 0;
  for (let w = 0; w < t.sequences.length; w++) {
    fused += fuse(t.sequences[w]!, pick.left, pick.right, merged) * t.weights[w]!;
  }
  t.corpusTokens -= fused;

  const merge: Merge = { left, right, token, frequency: pick.frequency };
  t.merges.push(merge);

  return {
    index: t.merges.length - 1,
    left,
    right,
    token,
    frequency: pick.frequency,
    vocabularySize: t.symbols.length,
    corpusTokens: t.corpusTokens,
    example: t.sources[pick.example]!,
    exampleBefore,
    exampleAfter: spell(t, t.sequences[pick.example]!),
  };
}

/**
 * Train until the merge list reaches `limit` entries, or until no pair is
 * frequent enough. `limit` is a target total, not an increment, so calling it
 * twice with the same number is idempotent.
 */
export function runToEnd(t: Trainer, limit: number): Trainer {
  while (t.status === "training" && t.merges.length < limit) trainStep(t);
  return t;
}

/** One distinct pre-token of the corpus, as it currently stands. */
export interface CorpusWord {
  /** The original text of the pre-token. */
  readonly text: string;
  /** How many times it occurs in the corpus. */
  readonly weight: number;
  /** What it is currently made of — one entry per token it costs. */
  readonly symbols: readonly string[];
}

/**
 * Read the corpus in its half-trained state.
 *
 * The lab's second section shows a small corpus visibly fusing, one merge at a
 * time, which needs the working sequences spelled back out as text. This is a
 * read-only projection: it allocates a fresh array and cannot disturb training.
 */
export function corpusView(t: Trainer): CorpusWord[] {
  return t.sequences.map((ids, w) => ({
    text: t.sources[w]!,
    weight: t.weights[w]!,
    symbols: ids.map((id) => t.symbols[id]!),
  }));
}

/** The trained artefact, detached from the trainer's working state. */
export function vocabularyOf(t: Trainer): Vocabulary {
  return { id: t.id, base: t.base.slice(), merges: t.merges.slice() };
}

/** Train a corpus and keep only the result. */
export function trainVocabulary(corpus: string, limit: number, id = "custom"): Vocabulary {
  return vocabularyOf(runToEnd(createTrainer(corpus, id), limit));
}

// ------------------------------------------------------------- tokenizing ---

export interface Token {
  /** The exact source text of this token, spaces included. */
  readonly text: string;
  /** Position in the token stream. */
  readonly index: number;
  /** Offsets into the source string, in JS string units. */
  readonly start: number;
  readonly end: number;
  /** False when this is a character the training corpus never contained. */
  readonly known: boolean;
}

/**
 * True when `symbol` is a single character rather than a fused pair.
 *
 * Length in JS string units will not do: an emoji is one character but two
 * units, and treating it as fused would report a character the corpus has
 * never seen as part of the vocabulary.
 */
function isSingleCharacter(symbol: string): boolean {
  const first = symbol.codePointAt(0);
  return symbol.length === (first !== undefined && first > 0xffff ? 2 : 1);
}

interface Compiled {
  /** left -> right -> position in the merge list. */
  readonly ranks: Map<string, Map<string, number>>;
  readonly base: Set<string>;
}

/**
 * Compiling a vocabulary costs one pass over its merges, and re-tokenizing a
 * short sentence costs almost nothing — so a slider that scrubs through merge
 * counts must not pay for the compile on every frame. The cache is keyed by
 * the vocabulary object and holds nothing if the vocabulary is dropped.
 */
const compiled = new WeakMap<Vocabulary, Compiled>();

function compile(vocabulary: Vocabulary): Compiled {
  const hit = compiled.get(vocabulary);
  if (hit) return hit;

  const ranks = new Map<string, Map<string, number>>();
  for (let i = 0; i < vocabulary.merges.length; i++) {
    const { left, right } = vocabulary.merges[i]!;
    let row = ranks.get(left);
    if (row === undefined) {
      row = new Map();
      ranks.set(left, row);
    }
    // A pair is learned once; if a corpus somehow offered it twice the earlier,
    // stronger merge is the one that counts.
    if (!row.has(right)) row.set(right, i);
  }

  const made: Compiled = { ranks, base: new Set(vocabulary.base) };
  compiled.set(vocabulary, made);
  return made;
}

/**
 * Apply the vocabulary's first `mergeCount` merges to one pre-token.
 *
 * Merges are applied in the order they were learned, not greedily by length:
 * at each round the lowest-ranked pair present is fused everywhere it occurs.
 * This is what makes the merge slider meaningful — the first `k` merges are
 * literally the tokenizer as it stood after `k` steps of training.
 */
function encodePiece(symbols: string[], ranks: Compiled["ranks"], mergeCount: number): void {
  if (mergeCount <= 0) return;

  for (;;) {
    let bestRank = Infinity;
    let bestLeft = "";
    let bestRight = "";

    for (let i = 0; i + 1 < symbols.length; i++) {
      const rank = ranks.get(symbols[i]!)?.get(symbols[i + 1]!);
      if (rank !== undefined && rank < mergeCount && rank < bestRank) {
        bestRank = rank;
        bestLeft = symbols[i]!;
        bestRight = symbols[i + 1]!;
      }
    }
    if (bestRank === Infinity) return;

    const token = bestLeft + bestRight;
    let write = 0;
    let read = 0;
    while (read < symbols.length) {
      if (read + 1 < symbols.length && symbols[read] === bestLeft && symbols[read + 1] === bestRight) {
        symbols[write++] = token;
        read += 2;
      } else {
        symbols[write++] = symbols[read++]!;
      }
    }
    symbols.length = write;
  }
}

/**
 * Tokenize text with a vocabulary, optionally as it stood after `mergeCount`
 * merges.
 *
 * This is a real encode every time — the merges are applied to *this* text,
 * not looked up in a stored answer. Passing a smaller `mergeCount` runs the
 * same encode against a truncated merge list, which is why dragging the merge
 * slider shows genuine intermediate tokenizers rather than a recording.
 */
export function tokenize(text: string, vocabulary: Vocabulary, mergeCount?: number): Token[] {
  const { ranks, base } = compile(vocabulary);
  const limit = Math.max(0, Math.min(mergeCount ?? vocabulary.merges.length, vocabulary.merges.length));

  const tokens: Token[] = [];
  for (const piece of preTokenize(text)) {
    const symbols = Array.from(piece.text);
    encodePiece(symbols, ranks, limit);

    let offset = piece.start;
    for (const symbol of symbols) {
      tokens.push({
        text: symbol,
        index: tokens.length,
        start: offset,
        end: offset + symbol.length,
        // A fused token is built from characters the corpus contained, so only
        // a lone character can be unknown.
        known: !isSingleCharacter(symbol) || base.has(symbol),
      });
      offset += symbol.length;
    }
  }
  return tokens;
}

/** Rebuild the source text. Always exactly the string `tokenize` was given. */
export const detokenize = (tokens: readonly Token[]): string => tokens.map((t) => t.text).join("");

/** How many tokens `text` costs under this vocabulary. */
export const countTokens = (text: string, vocabulary: Vocabulary, mergeCount?: number): number =>
  tokenize(text, vocabulary, mergeCount).length;
