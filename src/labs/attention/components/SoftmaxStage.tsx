import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { rowScores, rowWeights, type Attention } from "../engine";
import { percent, softmaxOf } from "../view";
import { TokenPicker } from "./TokenPicker";

/** How far a dragged score may go past the row's own, either way. */
const HEADROOM = 2;
/** One arrow-key step on a score. */
const STEP = 0.1;

export interface SoftmaxStageProps {
  attention: Attention;
  words: readonly string[];
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * §4 — scores become shares, and the visitor holds the scores.
 *
 * Every word's match is a bar the visitor can drag, and every word's share is
 * recomputed from the whole row on every move, by the engine's own softmax
 * (`softmaxOf`). That makes the section's one claim something you do rather
 * than read: push one score up and every other share falls — including the
 * ones you never touched — because they all come out of the same 100%.
 *
 * The model's own shares stay on screen as a faint tick on each bar, so a
 * change is always measured against where it started, and "Back to the
 * model" puts every score back. Changing the selected word starts over: the
 * edits belong to one row.
 *
 * Each score handle is a real slider for keyboards and screen readers (arrow
 * keys, Shift for ten steps), and every bar carries its number, so length is
 * never the only channel.
 */
export function SoftmaxStage({ attention, words, selected, onSelect }: SoftmaxStageProps) {
  const a = useLabCopy("attention");
  const s = a.softmax;

  const model = useMemo(() => Array.from(rowScores(attention, selected)), [attention, selected]);
  const modelShares = rowWeights(attention, selected);
  const [scores, setScores] = useState<number[]>(model);
  useEffect(() => setScores(model), [model]);

  const shares = useMemo(() => softmaxOf(scores), [scores]);
  const lo = Math.floor(Math.min(...model)) - HEADROOM;
  const hi = Math.ceil(Math.max(...model)) + HEADROOM;
  const edited = scores.some((v, i) => Math.abs(v - (model[i] ?? 0)) > 1e-9);

  const setScore = (index: number, value: number) =>
    setScores((current) => {
      const next = current.slice();
      next[index] = Math.round(Math.min(hi, Math.max(lo, value)) * 100) / 100;
      return next;
    });

  let best = 0;
  for (let i = 1; i < shares.length; i++) if (shares[i]! > shares[best]!) best = i;
  const total = shares.reduce((sum, v) => sum + v, 0);
  const touched = scores.filter((v, i) => Math.abs(v - (model[i] ?? 0)) > 1e-9).length;

  return (
    <Stage
      width="full"
      caption={s.caption}
      announcement={
        edited ? s.announce(words[best] ?? "", a.percent(percent(shares[best] ?? 0))) : ""
      }
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          <div className="mb-2 grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 text-overline uppercase text-fg-faint sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)]">
            <span>{a.trace.colToken}</span>
            <span>{a.trace.colScore}</span>
            <span>{a.trace.colShare}</span>
          </div>
          <ul className="space-y-1">
            {words.map((word, index) => (
              <li
                key={index}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <span
                  className={cn(
                    "truncate font-mono text-caption",
                    index === selected ? "text-accent" : "text-fg-muted",
                  )}
                >
                  {word}
                </span>
                <ScoreTrack
                  value={scores[index] ?? 0}
                  model={model[index] ?? 0}
                  lo={lo}
                  hi={hi}
                  label={s.scoreHandle(word)}
                  valueText={(v) => s.scoreValue(formatNumber(v, 2))}
                  onChange={(v) => setScore(index, v)}
                />
                <span className="flex items-center gap-2">
                  <span aria-hidden className="relative h-2 flex-1 rounded-pill bg-line/10">
                    <span
                      className="absolute inset-y-0 left-0 rounded-pill bg-accent"
                      style={{ width: `${Math.max((shares[index] ?? 0) * 100, 1)}%` }}
                    />
                    {/* Where the model had it, so a change reads as a change. */}
                    <span
                      className="absolute -inset-y-0.5 w-0.5 rounded-pill bg-fg/60"
                      style={{ left: `${(modelShares[index] ?? 0) * 100}%` }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right font-mono text-caption tabular-nums text-fg">
                    {a.percent(percent(shares[index] ?? 0))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-caption text-fg-faint">{s.legend}</p>
        </div>
      }
      primary={
        <div className="space-y-3">
          <p className="text-body-sm text-fg-muted">{s.dragHint}</p>
          <Button
            variant="secondary"
            onClick={() => setScores(model)}
            disabled={!edited}
            className="w-full"
          >
            {s.reset}
          </Button>
        </div>
      }
      secondary={
        <TokenPicker label={a.pickLabel} words={words} selected={selected} onSelect={onSelect} />
      }
      secondaryLabel={s.pickAnother}
      figures={
        <>
          <Figure
            label={a.figures.biggestShare}
            value={a.percent(percent(shares[best] ?? 0))}
            tone="accent"
            hint={words[best]}
          />
          <Figure label={a.figures.sharesTotal} value={a.percent(percent(total))} />
          <Figure label={s.touchedLabel} value={String(touched)} hint={s.touchedHint} />
        </>
      }
    />
  );
}

/**
 * One draggable score: a signed bar from zero, with a grip at its end. Press
 * anywhere on the track and the score jumps there; drag and it follows.
 */
function ScoreTrack({
  value,
  model,
  lo,
  hi,
  label,
  valueText,
  onChange,
}: {
  value: number;
  model: number;
  lo: number;
  hi: number;
  label: string;
  valueText: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const zero = at(0);

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const box = track.current!.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    onChange(lo + fraction * (hi - lo));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const sign =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0;
    if (sign === 0) return;
    event.preventDefault();
    onChange(value + sign * STEP * (event.shiftKey ? 10 : 1));
  };

  return (
    <div
      ref={track}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
      className="relative flex h-9 cursor-ew-resize touch-pan-y select-none items-center"
    >
      <span aria-hidden className="absolute inset-x-0 h-2 rounded-pill bg-line/10" />
      <span aria-hidden className="absolute h-4 w-px bg-line/40" style={{ left: `${zero}%` }} />
      <span
        aria-hidden
        className={cn("absolute h-2 rounded-pill", value < 0 ? "bg-fg-faint" : "bg-data/70")}
        style={
          value < 0
            ? { left: `${at(value)}%`, width: `${zero - at(value)}%` }
            : { left: `${zero}%`, width: `${at(value) - zero}%` }
        }
      />
      {/* The model's own score. */}
      <span
        aria-hidden
        className="absolute h-3 w-0.5 rounded-pill bg-fg/60"
        style={{ left: `${at(model)}%` }}
      />
      <span
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={lo}
        aria-valuemax={hi}
        aria-valuenow={value}
        aria-valuetext={valueText(value)}
        onKeyDown={onKeyDown}
        className="absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-data bg-ink-900"
        style={{ left: `${at(value)}%` }}
      />
    </div>
  );
}
