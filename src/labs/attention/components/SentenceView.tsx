import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import type { Attention } from "../engine";
import { arcTargets, percent, tokenViews, topTargets, isNearTie } from "../view";

export interface SentenceViewProps {
  attention: Attention;
  /** Display strings, in sentence order. */
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
  /** Index of the word the context control swaps, so it can be marked. */
  swapIndex: number;
}

interface Point {
  x: number;
  y: number;
  top: number;
}

/**
 * The sentence, re-weighting itself around whatever is selected.
 *
 * Real DOM text rather than a canvas, following `tokenizer/TokenStrip`: the
 * words stay selectable, they wrap the way text wraps, and a screen reader
 * gets a sentence instead of a description of a picture. It also means the
 * whole visualization is in the accessibility tree by construction — there is
 * no second, text-only version to keep in sync.
 *
 * Attention strength is carried by four redundant channels, none of them hue:
 * type weight, opacity, the width of an underline bar, and a printed
 * percentage on the three that matter. Arcs are a fifth, decorative channel —
 * `aria-hidden`, capped at three, and drawn only between tokens that share a
 * line, so a wrapped sentence never grows a diagonal across the page.
 */
export function SentenceView({
  attention,
  words,
  selected,
  onSelect,
  swapIndex,
}: SentenceViewProps) {
  const t = useT();
  const a = t.labs.attention;
  const reduced = useReducedMotion() ?? false;
  const listId = useId();

  const tokens = tokenViews(attention, selected, words);
  const arcs = arcTargets(attention, selected);
  const top = topTargets(attention, selected);
  const tie = isNearTie(attention, selected);

  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  // --- geometry for the arcs. Measured, never assumed: the tokens are laid
  //     out by the text engine, so only the browser knows where they ended up.
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    setBox({ width: base.width, height: base.height });
    setPoints(
      words.map((_, i) => {
        const el = tokenRefs.current[i];
        if (!el) return { x: 0, y: 0, top: -1 };
        const r = el.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top, top: Math.round(r.top - base.top) };
      }),
    );
  }, [words]);

  useLayoutEffect(measure, [measure, selected]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  // --- keyboard. Roving tabindex over the options, as in tokenizer/GuessStrip.
  const focusToken = (index: number) => {
    onSelect(index);
    tokenRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = words.length - 1;
    let next = selected;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(last, selected + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, selected - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    focusToken(next);
  };

  const selectedWord = words[selected] ?? "";
  const summary = a.announce(
    selectedWord,
    top.map((entry) => a.pair(words[entry.index] ?? "", percent(entry.weight))).join(", "),
  );

  return (
    <div className="space-y-6">
      <div ref={containerRef} className="relative">
        {/* Decorative reinforcement only. Everything an arc says is already in
            the button labels, the bars and the ranked list below. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={box.width}
          height={box.height}
        >
          {points &&
            arcs.map((arc) => {
              const from = points[selected];
              const to = points[arc.index];
              // Same line only: an arc across a line break reads as a diagonal
              // scribble rather than a connection.
              if (!from || !to || from.top !== to.top || from.top < 0) return null;
              const lift = Math.min(34, 14 + Math.abs(to.x - from.x) * 0.16);
              const mid = (from.x + to.x) / 2;
              return (
                <path
                  key={arc.index}
                  d={`M ${from.x} ${from.y} Q ${mid} ${from.y - lift} ${to.x} ${to.y}`}
                  fill="none"
                  className="stroke-accent"
                  strokeLinecap="round"
                  strokeWidth={1 + arc.weight * 5}
                  opacity={0.35 + arc.weight * 0.55}
                />
              );
            })}
        </svg>

        <div
          role="listbox"
          aria-label={a.sentenceLabel}
          aria-describedby={listId}
          onKeyDown={handleKeyDown}
          className="flex flex-wrap items-end justify-center gap-x-1 gap-y-8 px-2 py-6 sm:gap-x-2"
        >
          {tokens.map((token) => (
            <button
              key={token.index}
              ref={(el) => {
                tokenRefs.current[token.index] = el;
              }}
              type="button"
              role="option"
              aria-selected={token.selected}
              tabIndex={token.selected ? 0 : -1}
              onClick={() => focusToken(token.index)}
              aria-label={a.tokenLabel(
                token.word,
                percent(token.weight),
                token.index + 1,
                words.length,
              )}
              className={cn(
                "group relative flex min-h-11 flex-col items-center rounded px-1.5 pb-2 pt-1",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
                !reduced && "transition-[opacity,color] duration-fast",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "font-display text-title leading-none sm:text-display-md",
                  // Selection is marked by the caret above the word and by
                  // the colour, never by a filled box: a tinted rectangle
                  // around a two-letter word reads as an empty column,
                  // especially on the light theme.
                  token.selected
                    ? "font-semibold text-accent"
                    : token.emphasis > 0.66
                      ? "font-semibold text-fg"
                      : token.emphasis > 0.28
                        ? "font-medium text-fg-muted"
                        : "text-fg-faint",
                )}
                style={{ opacity: token.selected ? 1 : 0.45 + token.emphasis * 0.55 }}
              >
                {token.word}
              </span>

              {/* The primary strength channel, and the one that survives every
                  screen width, greyscale and reduced motion. */}
              <span aria-hidden className="mt-2 h-1 w-full rounded-pill bg-line/10">
                <span
                  className={cn(
                    "block h-full rounded-pill bg-accent",
                    !reduced && "transition-[width] duration-fast",
                  )}
                  style={{ width: `${Math.max(token.emphasis * 100, token.weight > 0 ? 4 : 0)}%` }}
                />
              </span>

              <span
                aria-hidden
                className={cn(
                  "mt-1 font-mono text-overline tabular-nums",
                  token.showPercent ? "text-fg-muted" : "text-transparent",
                )}
              >
                {a.percent(percent(token.weight))}
              </span>

              {/* The caret. A shape channel, so selection survives greyscale. */}
              {token.selected && (
                <span
                  aria-hidden
                  className="absolute inset-x-0.5 top-0 h-1 rounded-pill bg-accent"
                />
              )}
              {token.index === swapIndex && (
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-1/2 h-px w-6 -translate-x-1/2 bg-fg-faint"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <p id={listId} className="sr-only">
        {a.sentenceHint}
      </p>

      {/* The quiet ranked summary: the same row, as words and numbers. */}
      <div className="mx-auto flex max-w-md flex-col gap-2 rounded-card border border-line/10 bg-ink-900 p-4">
        <p className="text-overline uppercase text-fg-faint">{a.mostlyLookingAt(selectedWord)}</p>
        <ul className="space-y-1.5">
          {top.map((entry) => (
            <li key={entry.index} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate font-mono text-body-sm text-fg">
                {words[entry.index]}
              </span>
              <span aria-hidden className="h-1.5 flex-1 rounded-pill bg-line/10">
                <span
                  className="block h-full rounded-pill bg-accent"
                  style={{ width: `${Math.max(entry.weight * 100, 2)}%` }}
                />
              </span>
              <span className="w-12 shrink-0 text-right font-mono text-body-sm tabular-nums text-fg-muted">
                {a.percent(percent(entry.weight))}
              </span>
            </li>
          ))}
        </ul>
        {tie && <p className="pt-1 text-caption text-fg-faint">{a.nearTie}</p>}
      </div>

      <p aria-live="polite" className="sr-only">
        {summary}
      </p>
    </div>
  );
}
