import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { LabSlider } from "@/components/lab";
import { Badge, Button, Segmented } from "@/components/ui";
import { useLocalControls } from "@/hooks";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { MAX_MERGES, type CorpusId } from "../corpora";
import { tokenize } from "../engine";
import { SLIDER_STEPS, mergesAt, positionOf } from "../mergeScale";
import {
  CHALLENGES,
  beatenCount,
  isBeaten,
  judge,
  missingWords,
  type ChallengeProgress,
  type ChallengeSpec,
  type Verdict as VerdictResult,
} from "../challenge";
import { useVocabulary } from "../useVocabulary";
import { TextEditor } from "./TextEditor";
import { TokenStrip } from "./TokenStrip";

const STORAGE_KEY = "acl:tokenizer:challenge";

const VERDICT_STYLE = {
  passed: "border-signal-green/40 text-signal-green",
  "over-budget": "border-line/15 text-fg-muted",
  "missing-words": "border-signal-amber/40 text-signal-amber",
  untouched: "border-line/10 text-fg-faint",
} as const;

/**
 * Section 5 — two puzzles, two different levers.
 *
 * The first fixes the tokenizer and lets you rewrite the sentence; the second
 * fixes the sentence and lets you choose the tokenizer. Both budgets live in
 * `challenge.ts`, where they were measured against this engine, and both are
 * judged by tokenizing what the visitor actually produced — never by
 * string-matching an expected answer.
 */
export function TokenChallenge() {
  const reduced = useReducedMotion() ?? false;
  const t = useT();
  const c = t.labs.tokenizer.challenge;
  const [progress, setProgress] = useLocalControls<ChallengeProgress>(STORAGE_KEY, {});
  const [index, setIndex] = useState(0);

  const spec = CHALLENGES[index] ?? CHALLENGES[0]!;
  const beaten = beatenCount(
    progress,
    CHALLENGES.map((c) => c.id),
  );
  const solve = (solved: ChallengeSpec) => setProgress({ [solved.id]: true });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {CHALLENGES.map((candidate, i) => (
          <Button
            key={candidate.id}
            size="sm"
            variant={i === index ? "primary" : "secondary"}
            onClick={() => setIndex(i)}
          >
            {isBeaten(progress, candidate.id) ? "✓ " : ""}
            {c.puzzles[candidate.id].title}
          </Button>
        ))}
        <Badge className="ml-auto">{t.common.solved(beaten, CHALLENGES.length)}</Badge>
      </div>

      {spec.lever === "text" ? (
        <TextPuzzle key={spec.id} spec={spec} reduced={reduced} onSolved={() => solve(spec)} />
      ) : (
        <TokenizerPuzzle key={spec.id} spec={spec} reduced={reduced} onSolved={() => solve(spec)} />
      )}
    </div>
  );
}

interface PuzzleProps {
  spec: ChallengeSpec;
  reduced: boolean;
  onSolved: () => void;
}

/**
 * Record the win and say what happened, once per transition.
 *
 * Both jobs belong in an effect: writing to storage and to a live region are
 * side effects, and a component that called them while rendering would be
 * updating state during another component's render.
 */
function useVerdictEffects(verdict: VerdictResult, onSolved: () => void): string {
  const v = useT().labs.tokenizer.challenge.verdict;
  const message = useVerdictMessage(verdict);
  const [announcement, setAnnouncement] = useState("");
  const previous = useRef<VerdictResult["kind"] | null>(null);
  const solvedRef = useRef(onSolved);
  solvedRef.current = onSolved;

  useEffect(() => {
    if (previous.current === verdict.kind) return;
    previous.current = verdict.kind;
    if (verdict.kind === "passed") {
      solvedRef.current();
      setAnnouncement(v.solvedAnnounce(message));
    } else if (verdict.kind !== "untouched") {
      setAnnouncement(message);
    }
  }, [verdict.kind, message, v]);

  return announcement;
}

/** The verdict's facts, put into words in the active language. */
function useVerdictMessage(verdict: VerdictResult): string {
  const v = useT().labs.tokenizer.challenge.verdict;
  switch (verdict.kind) {
    case "untouched":
      return v.untouched(verdict.tokens, verdict.budget);
    case "missing-words":
      return v.missingWords(verdict.missing);
    case "over-budget":
      return v.overBudget(verdict.tokens, verdict.budget);
    case "passed":
      return v.passed(verdict.tokens, verdict.budget);
  }
}

function VerdictCard({ verdict, lesson }: { verdict: VerdictResult; lesson: string }) {
  const message = useVerdictMessage(verdict);
  return (
    <div className={cn("rounded-card border px-4 py-3", VERDICT_STYLE[verdict.kind])}>
      <p className="text-body-sm">
        {verdict.kind === "passed" && (
          <span aria-hidden className="mr-1.5">
            ✓
          </span>
        )}
        {message}
      </p>
      {verdict.kind === "passed" && <p className="mt-2 text-caption text-fg-muted">{lesson}</p>}
    </div>
  );
}

function Brief({ spec }: { spec: ChallengeSpec }) {
  const c = useT().labs.tokenizer.challenge;
  const copy = c.puzzles[spec.id];
  return (
    <div className="max-w-prose">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-title text-fg">{copy.title}</h3>
        <Badge>{c.budgetBadge(spec.budget)}</Badge>
      </div>
      <p className="mt-2 text-body-sm text-fg-muted">{copy.brief}</p>
    </div>
  );
}

/** C1 — the tokenizer is fixed; the sentence is yours. */
function TextPuzzle({ spec, reduced, onSolved }: PuzzleProps) {
  const t = useT();
  const lab = t.labs.tokenizer;
  const c = lab.challenge;
  const { vocabulary, ready } = useVocabulary(spec.corpus ?? "english", reduced);
  const [text, setText] = useState(spec.start);

  const tokens = useMemo(() => (vocabulary ? tokenize(text, vocabulary) : []), [vocabulary, text]);
  const verdict = judge(spec, {
    text,
    tokens: tokens.length,
    touched: text !== spec.start,
  });
  const missing = missingWords(text, spec.requires);
  const unknown = tokens.filter((token) => !token.known).length;
  const announcement = useVerdictEffects(verdict, onSolved);

  return (
    <div className="space-y-4">
      <Brief spec={spec} />

      <TextEditor
        label={c.rewriteLabel}
        value={text}
        onChange={setText}
        rows={3}
        hint={c.rewriteHint}
      />

      <div className="flex flex-wrap gap-1.5">
        {spec.requires.map((word) => {
          const present = !missing.includes(word);
          return (
            <span
              key={word}
              className={cn(
                "inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 font-mono text-caption",
                present
                  ? "border-line/10 bg-ink-700/60 text-fg-muted"
                  : "border-dashed border-signal-amber/50 text-signal-amber",
              )}
            >
              <span aria-hidden>{present ? "✓" : "○"}</span>
              {word}
            </span>
          );
        })}
      </div>

      <TokenStrip tokens={tokens} muted={!ready} label={c.rewriteStrip} size="sm" />

      {unknown > 0 && (
        // Without this the opening state — almost every capital dashed and
        // flagged — reads as something being broken. It is not: those really
        // are characters the corpus never contained, and saying so turns the
        // alarming part of the screen into the clue.
        <p className="max-w-prose text-caption text-fg-faint">{c.unknownNote(unknown)}</p>
      )}

      <VerdictCard verdict={verdict} lesson={c.puzzles[spec.id].lesson} />

      <Button variant="ghost" size="sm" onClick={() => setText(spec.start)}>
        {t.common.startOver}
      </Button>
      <p className="text-caption text-fg-faint">{lab.honesty}</p>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

/** C2 — the sentence is fixed; the tokenizer is yours. */
function TokenizerPuzzle({ spec, reduced, onSolved }: PuzzleProps) {
  const lab = useT().labs.tokenizer;
  const c = lab.challenge;
  const [corpus, setCorpus] = useState<CorpusId>("english");
  const [position, setPosition] = useState(() => positionOf(MAX_MERGES));

  const { vocabulary, ready } = useVocabulary(corpus, reduced);
  const merges = mergesAt(position);

  const tokens = useMemo(
    () => (vocabulary ? tokenize(spec.start, vocabulary, merges) : []),
    [vocabulary, spec.start, merges],
  );
  const verdict = judge(spec, { text: spec.start, tokens: tokens.length, touched: true });
  const announcement = useVerdictEffects(verdict, onSolved);

  return (
    <div className="space-y-4">
      <Brief spec={spec} />

      <TextEditor
        label={c.fixedLabel}
        value={spec.start}
        onChange={() => undefined}
        readOnly
        rows={2}
      />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <Segmented
          label={c.trainedOn}
          value={corpus}
          options={[
            { value: "english" as const, label: c.english },
            { value: "turkish" as const, label: c.turkish },
          ]}
          onChange={setCorpus}
        />
        <div className="card-surface p-5">
          <LabSlider
            label={c.mergesLearned}
            value={position}
            min={0}
            max={SLIDER_STEPS}
            onChange={setPosition}
            format={() => `${merges}`}
            valueText={(p) => lab.merge.mergesValueText(mergesAt(p), MAX_MERGES)}
            className="w-full min-w-0"
          />
        </div>
      </div>

      <TokenStrip tokens={tokens} muted={!ready} label={c.fixedStrip} size="sm" />
      <VerdictCard verdict={verdict} lesson={c.puzzles[spec.id].lesson} />

      {corpus === "english" && verdict.kind === "over-budget" && merges === MAX_MERGES && (
        <p className="max-w-prose text-body-sm text-fg-muted">{c.englishCeiling}</p>
      )}

      <p className="text-caption text-fg-faint">{lab.honesty}</p>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
