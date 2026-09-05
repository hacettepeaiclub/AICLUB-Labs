import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { DEMO_CORPUS } from "../corpora";
import { corpusView, createTrainer, trainStep, type CorpusWord, type MergeEvent } from "../engine";

/** Frames between merges while auto-training. Slow enough to follow. */
const FRAMES_PER_MERGE = 8;

/** A space, drawn. Same convention as the token strip. */
const shown = (text: string): string => text.replace(/ /g, "·");

function Word({ word, fused }: { word: CorpusWord; fused: string | null }) {
  return (
    <div className="flex items-center gap-1.5 rounded border border-line/10 bg-ink-900 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-0.5">
        {word.symbols.map((symbol, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex items-center rounded border px-1 py-0.5 font-mono text-caption",
              symbol === fused
                ? "border-accent bg-accent/15 text-fg"
                : symbol.length > 1
                  ? "border-line/10 bg-ink-700/70 text-fg"
                  : "border-line/5 bg-ink-800 text-fg-muted",
            )}
          >
            {shown(symbol)}
          </span>
        ))}
      </div>
      {word.weight > 1 && (
        <span className="shrink-0 font-mono text-caption text-fg-faint">×{word.weight}</span>
      )}
    </div>
  );
}

/**
 * Section 2 — the merges are made in front of you.
 *
 * Every press of **Merge next pair** calls `trainStep()` on a real trainer.
 * Nothing is scripted: the pair that fuses is whichever one is commonest in
 * this corpus right now, and the corpus above visibly loses a piece everywhere
 * that pair occurred.
 *
 * The corpus is the small one from `corpora.ts` rather than the four-kilobyte
 * text the rest of the lab uses, for the obvious reason: you cannot watch four
 * thousand characters fuse. Ten distinct pieces fit on a screen.
 */
export function TrainPanel() {
  const tr = useT().labs.tokenizer.train;
  const reduced = useReducedMotion() ?? false;
  const trainerRef = useRef(createTrainer(DEMO_CORPUS, "demo"));

  const [view, setView] = useState<CorpusWord[]>(() => corpusView(trainerRef.current));
  const [event, setEvent] = useState<MergeEvent | null>(null);
  const [exhausted, setExhausted] = useState(false);
  const [running, setRunning] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const trainer = trainerRef.current;

  const merge = useCallback((): boolean => {
    const next = trainStep(trainerRef.current);
    setView(corpusView(trainerRef.current));
    setEvent(next);
    if (next === null) {
      setExhausted(true);
      setRunning(false);
      setAnnouncement(tr.announceFinished);
      return false;
    }
    return true;
  }, [tr]);

  // The only frame loop in the lab, and it exists only while auto-training.
  useEffect(() => {
    if (!running) return;
    let ticks = 0;
    let frame = requestAnimationFrame(function tick() {
      ticks++;
      if (ticks >= FRAMES_PER_MERGE) {
        ticks = 0;
        if (!merge()) return;
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [running, merge]);

  const trainAll = () => {
    if (reduced) {
      // Asked for less motion: go straight to the finished vocabulary.
      let steps = 0;
      while (trainStep(trainerRef.current) !== null && steps < 500) steps++;
      setView(corpusView(trainerRef.current));
      setEvent(null);
      setExhausted(true);
      setAnnouncement(tr.announceFinishedAfter(trainerRef.current.merges.length));
      return;
    }
    setRunning(true);
  };

  const reset = () => {
    trainerRef.current = createTrainer(DEMO_CORPUS, "demo");
    setView(corpusView(trainerRef.current));
    setEvent(null);
    setExhausted(false);
    setRunning(false);
    setAnnouncement(tr.announceReset);
  };

  const vocabularySize = trainer.base.length + trainer.merges.length;

  return (
    <div className="space-y-5">
      <div className="card-surface p-4 sm:p-6">
        <p className="text-overline uppercase text-fg-faint">{tr.corpusLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {view.map((word, i) => (
            <Word key={i} word={word} fused={event?.token ?? null} />
          ))}
        </div>
      </div>

      {/* The readout, as a sentence rather than a wall of counters. */}
      <div
        className="min-h-[3.5rem] rounded-card border border-line/10 bg-ink-900 px-4 py-3"
        aria-live="off"
      >
        {event ? (
          <p className="text-body-sm text-fg-muted">
            {tr.merged(
              event.index + 1,
              shown(event.left),
              shown(event.right),
              event.frequency,
              shown(event.token),
              event.vocabularySize,
              event.corpusTokens,
            )}
          </p>
        ) : exhausted ? (
          <p className="text-body-sm text-fg-muted">
            {tr.exhausted(trainer.merges.length, vocabularySize)}
          </p>
        ) : (
          <p className="text-body-sm text-fg-muted">
            {tr.untouched(trainer.base.length, trainer.corpusTokens)}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={merge} disabled={exhausted || running}>
          {tr.mergeNext}
        </Button>
        <Button variant="secondary" onClick={trainAll} disabled={exhausted || running}>
          {running ? tr.training : tr.trainAll}
        </Button>
        {running && (
          <Button variant="ghost" onClick={() => setRunning(false)}>
            Pause
          </Button>
        )}
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>

      <p className="max-w-prose text-body-sm text-fg-muted">{tr.explain}</p>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
