import { useEffect, useSyncExternalStore } from "react";
import { MAX_MERGES, corpusById, type CorpusId } from "./corpora";
import { createTrainer, runToEnd, trainStep, vocabularyOf, type Trainer, type Vocabulary } from "./engine";

/**
 * Trains the lab's two tokenizers once, and shares them.
 *
 * ## Why this is not a `useMemo`
 *
 * Training a corpus to 360 merges was measured at 47–63 ms. That is four
 * frames — small enough to be tempting and large enough to be felt as a stall
 * halfway down a scrolling page, and sections 3, 4 and 5 want both corpora, so
 * a naive version would stall for twice that.
 *
 * So training runs in slices of a few milliseconds per frame. Sections mount
 * showing real progress instead of a frozen page, and by the time anyone has
 * finished guessing in section 1 the work is long done. The result is cached
 * at module scope: a second visit to the section, or a second component asking
 * for the same corpus, is free.
 *
 * The frame loop exists **only while something is still training**. Once both
 * vocabularies are built nothing is scheduled, which is the rule the other
 * labs in this collection follow too.
 */

interface Slot {
  trainer: Trainer;
  /** Set once, when training reaches the budget. Stable identity afterwards. */
  vocabulary: Vocabulary | null;
}

const slots = new Map<CorpusId, Slot>();
const listeners = new Set<() => void>();
let frame = 0;

/** Milliseconds of training per frame. Leaves the rest of the budget alone. */
const SLICE_MS = 6;

const emit = () => {
  for (const listener of listeners) listener();
};

const slotFor = (id: CorpusId): Slot => {
  let slot = slots.get(id);
  if (!slot) {
    slot = { trainer: createTrainer(corpusById(id).text, id), vocabulary: null };
    slots.set(id, slot);
  }
  return slot;
};

const settle = (slot: Slot): void => {
  if (slot.vocabulary) return;
  if (slot.trainer.merges.length >= MAX_MERGES || slot.trainer.status === "done") {
    slot.vocabulary = vocabularyOf(slot.trainer);
  }
};

const pending = (): Slot | undefined => {
  for (const slot of slots.values()) if (!slot.vocabulary) return slot;
  return undefined;
};

function pump(): void {
  frame = 0;
  const slot = pending();
  if (!slot) return;

  const deadline = performance.now() + SLICE_MS;
  while (slot.trainer.merges.length < MAX_MERGES && slot.trainer.status === "training") {
    trainStep(slot.trainer);
    if (performance.now() >= deadline) break;
  }
  settle(slot);
  emit();

  if (pending()) frame = requestAnimationFrame(pump);
}

/**
 * Train a corpus immediately and completely, blocking until it is done.
 *
 * Used under reduced motion — where a progress bar creeping up the screen is
 * exactly the thing being asked for less of — and by the tests.
 */
export function trainNow(id: CorpusId): Vocabulary {
  const slot = slotFor(id);
  if (!slot.vocabulary) {
    runToEnd(slot.trainer, MAX_MERGES);
    settle(slot);
  }
  return slot.vocabulary!;
}

/** Ask for a corpus. Starts the sliced training if it is not already running. */
export function requestVocabulary(id: CorpusId, immediate = false): void {
  const slot = slotFor(id);
  if (slot.vocabulary) return;

  if (immediate || typeof requestAnimationFrame !== "function") {
    trainNow(id);
    emit();
    return;
  }
  if (frame === 0) frame = requestAnimationFrame(pump);
}

const getVocabulary = (id: CorpusId): Vocabulary | null => slots.get(id)?.vocabulary ?? null;
const getMerges = (id: CorpusId): number => slots.get(id)?.trainer.merges.length ?? 0;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export interface VocabularyState {
  /** Null until training finishes. */
  readonly vocabulary: Vocabulary | null;
  /** Merges learned so far, for a progress readout. */
  readonly merges: number;
  readonly ready: boolean;
}

/**
 * Subscribe to one of the lab's tokenizers.
 *
 * Two snapshots rather than one object, because `useSyncExternalStore` needs a
 * stable value between changes and a freshly built object is never stable.
 */
export function useVocabulary(id: CorpusId, immediate = false): VocabularyState {
  // Kicking training off in an effect rather than during render: it is
  // idempotent either way, but scheduling work from render is the kind of
  // thing that only misbehaves later.
  // Block body on purpose: a concise arrow hands its return value back to
  // React as a cleanup function, which is a trap this codebase has been
  // caught by before.
  useEffect(() => {
    requestVocabulary(id, immediate);
  }, [id, immediate]);

  const vocabulary = useSyncExternalStore(
    subscribe,
    () => getVocabulary(id),
    () => getVocabulary(id),
  );
  const merges = useSyncExternalStore(
    subscribe,
    () => getMerges(id),
    () => getMerges(id),
  );
  return { vocabulary, merges, ready: vocabulary !== null };
}
