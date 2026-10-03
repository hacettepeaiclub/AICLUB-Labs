import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { grow } from "../engine";
import { formatValue } from "../view";

const LIMIT = 200;
const W = 100;
const H = 50;

/**
 * Section 5: a table that is never too full, because it moves house.
 *
 * Every insertion is drawn as a bar of the work it did — 1 for the key, plus
 * every key copied when it set off a resize — with the running average over
 * all insertions so far as a line. The spikes are real and get taller; the
 * line still stays under 3, because each spike pays for the doubling that
 * keeps the next one far away. HashMap's defaults set the thresholds.
 */
export function ResizeStage() {
  const t = useLabs()["hash-table"].resize;
  const [n, setN] = useState(100);
  const steps = useMemo(() => grow(LIMIT), []);
  const shown = steps.slice(0, n);
  const tallest = Math.max(...steps.map((s) => s.cost));

  let total = 0;
  const averages = shown.map((s, i) => {
    total += s.cost;
    return total / (i + 1);
  });
  const average = averages.at(-1) ?? 0;
  const resizes = shown.filter((s) => s.cost > 1).length;
  const capacity = shown.at(-1)?.capacity ?? 16;

  const bar = W / LIMIT;
  const scale = (v: number) => (v / tallest) * (H - 2);
  // A cost of 1 is a two-hundredth of the tallest spike, under a pixel; it
  // is drawn at a hairline so the ordinary insertions are visibly there.
  const barHeight = (v: number) => Math.max(scale(v), 0.8);
  // The average has its own axis, 0 to 4: drawn on the bars' scale it would
  // be a flat line at the bottom, and drawn on a stretched one it would lie.
  const LINE_H = 24;
  const ay = (v: number) => LINE_H - 1 - (v / 4) * (LINE_H - 2);
  const line = averages
    .map((a, i) => `${((i + 0.5) * bar).toFixed(2)},${ay(a).toFixed(2)}`)
    .join(" ");

  return (
    <Stage
      width="wide"
      controls="stack"
      caption={t.caption}
      announcement={t.announce(n, capacity, formatValue(average))}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={t.chartLabel(n, resizes, formatValue(average))}
            className="block h-48 w-full"
          >
            {shown.map((s, i) => (
              <rect
                key={i}
                x={i * bar + bar * 0.15}
                width={bar * 0.7}
                y={H - barHeight(s.cost)}
                height={barHeight(s.cost)}
                className={s.cost > 1 ? "fill-signal-amber" : "fill-accent/60"}
              />
            ))}
          </svg>
          <p className="mt-4 text-overline uppercase text-fg-faint">{t.averageTitle}</p>
          <svg
            viewBox={`0 0 ${W} ${LINE_H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={t.averageLabel(formatValue(average))}
            className="mt-2 block h-20 w-full"
          >
            <line
              x1={0}
              x2={W}
              y1={ay(3)}
              y2={ay(3)}
              className="stroke-line/30"
              strokeWidth={0.8}
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={0}
              x2={W}
              y1={ay(1)}
              y2={ay(1)}
              className="stroke-line/10"
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={line}
              className="fill-none stroke-data"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="mt-1 flex justify-between font-mono text-caption text-fg-faint">
            <span>1</span>
            <span>{t.axis}</span>
            <span>{LIMIT}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-caption text-fg-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-accent/60" />
              {t.legend.insert}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-signal-amber" />
              {t.legend.resize}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 bg-data" />
              {t.legend.average}
            </li>
          </ul>
        </div>
      }
      primary={<LabSlider label={t.keysLabel} value={n} min={1} max={LIMIT} onChange={setN} />}
      figures={
        <>
          <Figure
            label={t.figures.capacity}
            value={String(capacity)}
            hint={t.figures.capacityHint(Math.floor(capacity * 0.75))}
          />
          <Figure label={t.figures.resizes} value={String(resizes)} />
          <Figure
            label={t.figures.average}
            value={formatValue(average)}
            hint={t.figures.averageHint}
            tone="accent"
          />
        </>
      }
    />
  );
}
