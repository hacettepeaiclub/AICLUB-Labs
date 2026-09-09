import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { MAX_MERGES, SEED_SENTENCE } from "../corpora";
import { tokenize } from "../engine";
import { SLIDER_STEPS, mergesAt, positionOf } from "../mergeScale";
import { useVocabulary } from "../useVocabulary";
import { TextEditor, countCharacters, countWords } from "./TextEditor";
import { TokenMetrics } from "./TokenMetrics";
import { TokenStrip } from "./TokenStrip";

/** Merges to start at — far enough in to be interesting, far from finished. */
const START_MERGES = 50;

/** Scale marks, drawn at the positions the curve actually puts them. */
const TICKS = [0, 40, 160, MAX_MERGES] as const;

/**
 * Section 3 — how much has it learned?
 *
 * The lab's main interaction. Two things are the visitor's to move: the
 * sentence, and how far the tokenizer got through training. Every drag calls
 * `tokenize(text, vocabulary, mergeCount)` for real — the same encoder, run
 * against a truncated merge list, so the strip shows a genuine intermediate
 * tokenizer rather than a recording of one.
 *
 * Measured at 27 microseconds per encode, which is why there is no debounce
 * here: the strip answers the thumb on the same frame.
 */
export function MergeStage() {
  const lab = useT().labs.tokenizer;
  const m = lab.merge;
  const reduced = useReducedMotion() ?? false;
  const { vocabulary, merges: trained, ready } = useVocabulary("turkish", reduced);

  const [text, setText] = useState(SEED_SENTENCE);
  const [position, setPosition] = useState(() => positionOf(START_MERGES));
  const [announcement, setAnnouncement] = useState("");
  const announced = useRef(false);

  const merges = mergesAt(position);
  const tokens = useMemo(
    () => (vocabulary ? tokenize(text, vocabulary, merges) : []),
    [vocabulary, text, merges],
  );

  // One announcement, when the tokenizer becomes usable. Not per slider tick.
  useEffect(() => {
    if (ready && !announced.current) {
      announced.current = true;
      setAnnouncement(m.ready);
    }
  }, [ready, m]);

  return (
    <Stage
      width="full"
      secondaryLabel={m.jumpTo}
      caption={m.explain}
      announcement={announcement}
      viewport={
        <div className="space-y-3">
          <TextEditor
            label={m.sentenceLabel}
            value={text}
            onChange={setText}
            hint={m.sentenceHint}
          />
          <TokenStrip tokens={tokens} muted={!ready} label={m.stripLabel(merges)} />
        </div>
      }
      primary={
        <div>
          <LabSlider
            label={m.mergesLearned}
            value={position}
            min={0}
            max={SLIDER_STEPS}
            onChange={setPosition}
            format={() => `${merges}`}
            valueText={(p) => m.mergesValueText(mergesAt(p), MAX_MERGES)}
            className="w-full min-w-0"
          />
          {/* The track is curved, so a tick has to be drawn where its merge
              count actually falls. Spacing these evenly would put 40 and 160
              in the wrong place — a small lie, in a lab about not telling
              them. */}
          <div aria-hidden className="relative mt-1 h-4 font-mono text-caption text-fg-faint">
            {TICKS.map((tick) => {
              const percent = (positionOf(tick) / SLIDER_STEPS) * 100;
              return (
                <span
                  key={tick}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${Math.min(Math.max(percent, 3), 97)}%` }}
                >
                  {tick}
                </span>
              );
            })}
          </div>
          {!ready && (
            <p className="mt-2 text-caption text-fg-faint" role="status">
              {m.trainingProgress(trained, MAX_MERGES)}
            </p>
          )}
        </div>
      }
      figures={
        <TokenMetrics
          tokens={tokens.length}
          characters={countCharacters(text)}
          words={countWords(text)}
          merges={merges}
          emphasis="merges"
        />
      }
      secondary={
        <div className="grid grid-cols-2 gap-2">
          {[0, 50, 100, MAX_MERGES].map((target) => (
            <Button
              key={target}
              variant={merges === target ? "primary" : "secondary"}
              onClick={() => setPosition(positionOf(target))}
              className="min-h-[44px]"
            >
              {target === 0 ? m.untrained : target === MAX_MERGES ? m.full : String(target)}
            </Button>
          ))}
        </div>
      }
    />
  );
}
