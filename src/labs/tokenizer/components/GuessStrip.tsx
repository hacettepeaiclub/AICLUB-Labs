import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Button, Kbd } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { GUESS_SENTENCE } from "../corpora";
import { tokenize } from "../engine";
import { scoreGuess, wordCuts } from "../guess";
import { useVocabulary } from "../useVocabulary";
import { TokenStrip } from "./TokenStrip";

/**
 * Section 1 — commit to a guess, then find out.
 *
 * The first ten seconds of the lab, and the only ten seconds where being wrong
 * is the goal. Nothing here is named: no "token", no "vocabulary", no "merge".
 * The visitor marks where they think the sentence gets cut, and the sentence
 * disagrees with them. Naming comes in section 2, once there is something to
 * name.
 *
 * A cut is stored as the index of the character it sits in front of, matching
 * `guess.ts` and the `start` offsets the engine reports.
 */
export function GuessStrip() {
  const t = useT();
  const lab = t.labs.tokenizer;
  const g = lab.guess;
  const reduced = useReducedMotion() ?? false;
  const { vocabulary, ready } = useVocabulary("english", reduced);

  const characters = useMemo(() => Array.from(GUESS_SENTENCE), []);
  const [guesses, setGuesses] = useState<readonly number[]>([]);
  const [cursor, setCursor] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tokens = useMemo(
    () => (vocabulary ? tokenize(GUESS_SENTENCE, vocabulary) : []),
    [vocabulary],
  );
  const score = useMemo(() => scoreGuess(guesses, tokens), [guesses, tokens]);

  const guessed = useMemo(() => new Set(guesses), [guesses]);
  const actual = useMemo(() => new Set(score.actual), [score.actual]);

  const toggle = useCallback((at: number) => {
    setGuesses((current) =>
      current.includes(at) ? current.filter((cut) => cut !== at) : [...current, at],
    );
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = characters.length - 1;
    let next = cursor;
    if (event.key === "ArrowRight") next = Math.min(last, cursor + 1);
    else if (event.key === "ArrowLeft") next = Math.max(1, cursor - 1);
    else if (event.key === "Home") next = 1;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    setCursor(next);
    cellRefs.current[next]?.focus();
  };

  const reveal = () => {
    setRevealed(true);
    setAnnouncement(
      g.describe(
        score.guessed,
        score.matched.length,
        score.imagined.length,
        score.missed.length,
        score.actual.length,
        tokens.length,
      ),
    );
  };

  const reset = () => {
    setGuesses([]);
    setRevealed(false);
    setAnnouncement(g.announceCleared);
  };

  const markEveryWord = () => {
    setGuesses(wordCuts(GUESS_SENTENCE));
    setAnnouncement(g.announceEveryWord);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-prose">
        <h2 className="text-display-md text-fg">{g.heading}</h2>
        <p className="mt-3 text-body text-fg-muted">{g.lede}</p>
      </div>

      {/* The strip. Character cells; a cut lives on a cell's left edge. */}
      <div className="card-surface p-4 sm:p-6">
        <div
          role="group"
          aria-label={g.stripLabel(GUESS_SENTENCE)}
          onKeyDown={handleKeyDown}
          className="flex flex-wrap gap-y-3 font-mono text-body sm:text-body-lg"
        >
          {characters.map((character, i) => {
            const isGuess = guessed.has(i);
            const isActual = revealed && actual.has(i);
            const matched = isGuess && isActual;
            const imagined = revealed && isGuess && !isActual;
            const display = character === " " ? "·" : character;

            const borderClass = isActual
              ? "border-l-accent"
              : isGuess
                ? revealed
                  ? "border-l-fg-faint border-dashed"
                  : "border-l-accent"
                : "border-l-transparent";

            const content = (
              <>
                <span className={character === " " ? "text-fg-faint" : undefined}>{display}</span>
                {(matched || imagined) && (
                  // Pinned to the top of the cell, hard against the bar it is
                  // annotating. At the bottom it drifted into the gap below and
                  // read as belonging to the next line of the wrapped strip.
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -top-0.5 left-0 -translate-x-1/2 text-[0.7rem] font-bold leading-none",
                      matched ? "text-signal-green" : "text-fg-faint",
                    )}
                  >
                    {matched ? "✓" : "✗"}
                  </span>
                )}
              </>
            );

            const shared = cn(
              "relative flex h-11 min-w-[1.15rem] items-center justify-center border-l-2 px-px",
              borderClass,
            );

            // The very front of the string is a boundary by definition, so
            // there is nothing there to guess.
            if (i === 0) {
              return (
                <span key={i} className={cn(shared, "text-fg")}>
                  {content}
                </span>
              );
            }

            return (
              <button
                key={i}
                ref={(element) => {
                  cellRefs.current[i] = element;
                }}
                type="button"
                disabled={revealed}
                tabIndex={i === cursor ? 0 : -1}
                aria-pressed={isGuess}
                aria-label={g.cellLabel(character === " " ? g.theSpace : `“${character}”`, i)}
                onClick={() => {
                  setCursor(i);
                  toggle(i);
                }}
                className={cn(
                  shared,
                  "text-fg transition-colors duration-fast",
                  !revealed && "hover:border-l-accent/40 hover:bg-line/5",
                  revealed && "cursor-default",
                )}
              >
                {content}
              </button>
            );
          })}
        </div>

        {revealed ? (
          // Three marks, three shapes. Nothing here is told apart by colour on
          // its own: a solid rule, a dashed rule, and two different glyphs.
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-caption text-fg-faint">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-4 w-0 border-l-2 border-accent" />
              {g.legendReal}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-4 w-0 border-l-2 border-dashed border-fg-faint"
              />
              {g.legendImagined}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="font-bold text-signal-green">
                ✓
              </span>
              {g.legendMatched}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-caption text-fg-faint">
            {g.hint} <Kbd>←</Kbd> <Kbd>→</Kbd> {g.hintMove} <Kbd>Space</Kbd> {g.hintPlace}{" "}
            <span className="text-fg-muted">·</span> {g.hintSpace}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!revealed ? (
          <>
            <Button onClick={reveal} disabled={!ready}>
              {ready ? g.reveal : g.preparing}
            </Button>
            <Button variant="secondary" onClick={markEveryWord}>
              {g.cutEveryWord}
            </Button>
            {guesses.length > 0 && (
              <Button variant="ghost" onClick={reset}>
                {t.common.clear}
              </Button>
            )}
          </>
        ) : (
          <Button variant="secondary" onClick={reset}>
            {t.common.tryAgain}
          </Button>
        )}
      </div>

      {revealed && (
        <div className="space-y-4">
          <div className="card-surface p-5">
            <p className="text-body text-fg">
              {score.guessed === 1
                ? g.resultOne(score.matched.length === 1)
                : g.resultMany(score.guessed, score.matched.length)}{" "}
              {g.resultTail(score.actual.length, tokens.length)}
            </p>
            <p className="mt-3 max-w-prose text-body-sm text-fg-muted">{g.explain}</p>
          </div>

          <TokenStrip
            tokens={tokens}
            label={g.actualLabel}
            className="text-fg"
          />
          <p className="text-caption text-fg-faint">{lab.honesty}</p>
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
