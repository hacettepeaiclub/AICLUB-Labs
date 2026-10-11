import { useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLanguage } from "@/i18n";
import { useLabCopy } from "@/i18n/labs";
import { cn } from "@/lib/cn";
import { RACE_N } from "../bench";
import type { Bench } from "../useBench";
import { formatNumber, formatRatio } from "../view";

type Result = { rowMs: number; columnMs: number; rowSum: number; columnSum: number };

/**
 * Section 1: the same sum, twice, timed on the visitor's own machine.
 *
 * The lab's claim arrives before any explanation: one button, two loops that
 * add the same four million numbers, and a stopwatch that says one of them
 * took several times longer. Both sums are printed and are equal, so the
 * difference cannot be the arithmetic — which is the question the rest of
 * the lab answers.
 */
export function RaceStage({ bench }: { bench: Bench }) {
  const t = useLabCopy("cache-locality").race;
  const { language } = useLanguage();
  const [result, setResult] = useState<Result | null>(null);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);

  const run = () => {
    setRunning(true);
    setFailed(false);
    bench
      .race()
      .then(setResult)
      .catch(() => setFailed(true))
      .finally(() => setRunning(false));
  };

  const slowest = result ? Math.max(result.rowMs, result.columnMs) : 0;
  const ratio = result ? result.columnMs / result.rowMs : NaN;
  const count = RACE_N * RACE_N;

  const lane = (kind: "row" | "column") => {
    const ms = result ? (kind === "row" ? result.rowMs : result.columnMs) : null;
    return (
      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[3.75rem_minmax(0,1fr)]">
        <Walk kind={kind} />
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-body-sm text-fg">{kind === "row" ? t.rowLabel : t.columnLabel}</p>
            <p className="font-mono text-body-sm tabular-nums text-fg">
              {ms === null ? "—" : t.ms(formatNumber(ms, language))}
            </p>
          </div>
          <div className="h-3 overflow-hidden rounded-pill bg-ink-900">
            <div
              className={cn(
                "h-full rounded-pill transition-[width] duration-slow ease-out-expo",
                kind === "row" ? "bg-signal-green" : "bg-signal-amber",
              )}
              style={{ width: ms === null ? "0%" : `${Math.max(2, (ms / slowest) * 100)}%` }}
            />
          </div>
          <p className="text-caption text-fg-faint">{kind === "row" ? t.rowHow : t.columnHow}</p>
        </div>
      </div>
    );
  };

  return (
    <Stage
      width="column"
      controls="stack"
      caption={t.caption(formatNumber(count, language, 0))}
      announcement={
        result
          ? t.announce(
              formatNumber(result.rowMs, language),
              formatNumber(result.columnMs, language),
              formatRatio(ratio, language),
            )
          : failed
            ? t.error
            : ""
      }
      viewport={
        <div className="space-y-5 rounded border border-line/10 bg-ink-950 p-4">
          {lane("row")}
          {lane("column")}
          <p className="text-caption text-fg-faint">
            {failed ? t.error : t.gridNote(formatNumber(RACE_N, language, 0))}
          </p>
        </div>
      }
      primary={
        <Button onClick={run} disabled={running} className="min-h-[44px] w-full">
          {running ? t.running : result ? t.again : t.run}
        </Button>
      }
      figures={
        <>
          <Figure
            label={t.figures.ratio}
            value={result ? formatRatio(ratio, language) : "—"}
            hint={t.figures.ratioHint}
            tone="accent"
          />
          <Figure
            label={t.figures.sum}
            value={result ? formatNumber(result.rowSum, language, 1) : "—"}
            hint={
              result
                ? result.rowSum === result.columnSum
                  ? t.figures.sumSame
                  : t.figures.sumDiffers
                : t.figures.sumHint
            }
          />
        </>
      }
    />
  );
}

/**
 * The order of reading, drawn on a 4×4 grid: a path that runs along the rows,
 * or down the columns. A picture of the loop, not of the data.
 */
function Walk({ kind }: { kind: "row" | "column" }) {
  const cells = 4;
  const step = 12;
  const points: string[] = [];
  for (let a = 0; a < cells; a++) {
    for (let b = 0; b < cells; b++) {
      const [r, c] = kind === "row" ? [a, b] : [b, a];
      points.push(`${6 + c * step},${6 + r * step}`);
    }
  }
  return (
    <svg viewBox="0 0 48 48" className="w-full" aria-hidden>
      {Array.from({ length: cells * cells }, (_, i) => (
        <rect
          key={i}
          x={1 + (i % cells) * step}
          y={1 + Math.floor(i / cells) * step}
          width={10}
          height={10}
          rx={1.5}
          className="fill-fg-faint/15"
        />
      ))}
      <polyline
        points={points.join(" ")}
        fill="none"
        strokeWidth={1.4}
        strokeLinejoin="round"
        className={kind === "row" ? "stroke-signal-green" : "stroke-signal-amber"}
      />
      <circle
        cx={6}
        cy={6}
        r={2.2}
        className={kind === "row" ? "fill-signal-green" : "fill-signal-amber"}
      />
    </svg>
  );
}
