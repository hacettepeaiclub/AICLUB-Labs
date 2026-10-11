import { useMemo, useRef, useState, type ReactNode } from "react";
import { Figure, LabSlider, Stage, Transport } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useKeyPress, useRafLoop } from "@/hooks";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { columnOrder, rowOrder, simulate } from "../engine";

/** An 8 × 8 grid of doubles: each row is exactly one 64-byte line. */
const N = 8;
const LINE = 8;
/** Reads per second while playing. */
const RATE = 6;

type Order = "rows" | "columns" | "own";

/**
 * Section 2: why — the cache, drawn.
 *
 * The same 64 numbers, a cache that holds four lines, and the two orders
 * from the race, one read at a time. Row by row, the first number of each
 * line misses and brings its seven neighbours in with it. Column by column,
 * every read lands on a line that was pushed out before it was needed
 * again — until the cache is given room for all eight lines, and the
 * difference vanishes, which is the capacity half of the story.
 *
 * "Your order" lets the visitor click cells in any order they like and get
 * the model's verdict on each, so the question can be one the lab did not
 * ask. Every colour on the grid is read off the simulation in `engine.ts`,
 * not drawn from a script.
 */
export function LineStage() {
  const t = useLabCopy("cache-locality").line;
  const [order, setOrder] = useState<Order>("columns");
  const [lines, setLines] = useState<4 | 8>(4);
  const [step, setStep] = useState(0);
  const [own, setOwn] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const carry = useRef(0);

  const sequence = useMemo(
    () => (order === "rows" ? rowOrder(N, N) : order === "columns" ? columnOrder(N, N) : own),
    [order, own],
  );
  const run = useMemo(() => simulate(sequence, { lineSize: LINE, lines }, true), [sequence, lines]);
  const total = sequence.length;
  const shown = order === "own" ? total : step;

  // The latest verdict on each cell, and which lines are held right now.
  const verdict = new Map<number, boolean>();
  let hits = 0;
  for (let s = 0; s < shown; s++) {
    const st = run.steps[s]!;
    verdict.set(st.address, st.hit);
    if (st.hit) hits++;
  }
  const misses = shown - hits;
  const held = shown > 0 ? run.held[shown - 1]! : [];
  const current = shown > 0 ? run.steps[shown - 1]! : null;

  // Playback only ever starts from a press, so reduced motion has nothing to
  // stop: there is no autoplay, and the slider and Step button do the same
  // job one read at a time.
  const stepRef = useRef(step);
  stepRef.current = step;
  useRafLoop((dt) => {
    carry.current += dt * RATE;
    const advance = Math.floor(carry.current);
    if (advance < 1) return;
    carry.current -= advance;
    const next = Math.min(stepRef.current + advance, total);
    setStep(next);
    if (next >= total) setPlaying(false);
  }, playing);

  const reset = () => {
    setPlaying(false);
    carry.current = 0;
    if (order === "own") setOwn([]);
    else setStep(0);
  };
  const toggle = () => {
    if (order === "own") return;
    if (step >= total) setStep(0);
    setPlaying((p) => !p);
  };
  const stepOnce = () => setStep((s) => Math.min(s + 1, total));

  useKeyPress(" ", (event) => {
    if (order === "own") return;
    event.preventDefault();
    toggle();
  });
  useKeyPress("r", reset);

  const choose = (next: Order) => {
    setOrder(next);
    setPlaying(false);
    carry.current = 0;
    setStep(0);
  };

  const done = order !== "own" && step >= total;

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={done || (order === "own" && current) ? t.announce(shown, misses, hits) : ""}
      viewport={
        <div className="space-y-4 rounded border border-line/10 bg-ink-950 p-3 sm:p-4">
          <div
            role={order === "own" ? "group" : "img"}
            aria-label={t.gridLabel(shown, misses, hits, held.length)}
            className="grid grid-cols-[2.75rem_repeat(8,minmax(0,1fr))] gap-1 sm:grid-cols-[3.5rem_repeat(8,minmax(0,1fr))] sm:gap-1.5"
          >
            {Array.from({ length: N }, (_, row) => {
              const isHeld = held.includes(row);
              return (
                <Row key={row}>
                  <span
                    className={cn(
                      "flex items-center justify-center rounded font-mono text-[0.65rem] sm:text-caption",
                      isHeld ? "bg-accent/30 text-fg" : "text-fg-faint",
                    )}
                  >
                    {t.lineChip(row)}
                  </span>
                  {Array.from({ length: N }, (_, col) => {
                    const address = row * N + col;
                    const seen = verdict.get(address);
                    const isCurrent = current?.address === address;
                    const className = cn(
                      "flex aspect-square items-center justify-center rounded border font-mono text-[0.6rem] sm:text-caption",
                      isCurrent ? "border-accent ring-1 ring-accent" : "border-transparent",
                      seen === undefined
                        ? "bg-ink-900 text-fg-faint"
                        : seen
                          ? "bg-signal-green/25 text-signal-green"
                          : "bg-signal-amber/25 text-signal-amber",
                    );
                    // Shape as well as colour: a hit is a dot, a miss a cross.
                    const mark = seen === undefined ? "" : seen ? "•" : "×";
                    return order === "own" ? (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setOwn((o) => [...o, address])}
                        aria-label={t.cellButton(row, col, seen)}
                        className={cn(className, "hover:border-line/40")}
                      >
                        {mark}
                      </button>
                    ) : (
                      <span key={col} className={className}>
                        {mark}
                      </span>
                    );
                  })}
                </Row>
              );
            })}
          </div>

          <div aria-hidden className="flex flex-wrap items-center gap-2">
            <span className="text-caption text-fg-muted">{t.cacheLabel(lines)}</span>
            {Array.from({ length: lines }, (_, slot) => {
              const line = held[slot];
              return (
                <span
                  key={slot}
                  className={cn(
                    "min-w-14 rounded border px-2 py-1 text-center font-mono text-caption",
                    line === undefined
                      ? "border-dashed border-line/15 text-fg-faint"
                      : "border-accent/40 bg-accent/15 text-fg",
                  )}
                >
                  {line === undefined ? t.emptySlot : t.lineChip(line)}
                </span>
              );
            })}
          </div>
          <p className="min-h-[1.25rem] text-caption text-fg-muted">
            {current
              ? current.hit
                ? t.hitLine(Math.floor(current.address / N), current.address % N, current.line)
                : t.missLine(
                    Math.floor(current.address / N),
                    current.address % N,
                    current.line,
                    current.evicted,
                  )
              : order === "own"
                ? t.ownHint
                : t.startHint}
          </p>
        </div>
      }
      primary={
        order === "own" ? (
          <Button variant="secondary" onClick={reset} className="min-h-[44px] w-full">
            {t.clear}
          </Button>
        ) : (
          <div className="space-y-3">
            <Transport
              running={playing}
              onRun={toggle}
              onStep={stepOnce}
              onReset={reset}
              runLabel={done ? t.replay : undefined}
            />
            <LabSlider
              label={t.scrub}
              value={step}
              min={0}
              max={total}
              onChange={(v) => {
                setPlaying(false);
                setStep(v);
              }}
              format={(v) => `${v} / ${total}`}
            />
          </div>
        )
      }
      secondary={
        <div className="space-y-4">
          <Segmented
            label={t.orderLabel}
            value={order}
            onChange={choose}
            options={[
              { value: "rows", label: t.orders.rows },
              { value: "columns", label: t.orders.columns },
              { value: "own", label: t.orders.own },
            ]}
          />
          <Segmented
            label={t.sizeLabel}
            value={String(lines) as "4" | "8"}
            onChange={(v) => {
              setLines(v === "8" ? 8 : 4);
              setPlaying(false);
            }}
            options={[
              { value: "4", label: t.size(4) },
              { value: "8", label: t.size(8) },
            ]}
          />
        </div>
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure label={t.figures.reads} value={String(shown)} />
          <Figure
            label={t.figures.misses}
            value={String(misses)}
            hint={t.figures.missesHint}
            tone="accent"
          />
          <Figure label={t.figures.hits} value={String(hits)} hint={t.figures.hitsHint} />
        </>
      }
    />
  );
}

/** One row of the grid: its line's label, then its eight numbers. */
function Row({ children }: { children: ReactNode }) {
  return <div className="contents">{children}</div>;
}
