import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useLabs } from "@/i18n/labs";
import { createRng } from "@/lib/random";
import {
  chain,
  chainedSuccess,
  chainSuccessTheory,
  linear,
  linearInsertTheory,
  linearSuccessTheory,
  mean,
} from "../engine";
import { formatValue } from "../view";

const M = 1024;
const LOADS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const TOP = 10;
const W = 100;
const H = 60;

const x = (alpha: number) => (alpha / 0.95) * W;
const y = (probes: number) => H - 2 - ((Math.min(probes, TOP) - 1) / (TOP - 1)) * (H - 4);

function measure(seed: number) {
  return LOADS.map((alpha) => {
    const n = Math.round(alpha * M);
    const rng = createRng(seed * 101 + Math.round(alpha * 100));
    const homes = Array.from({ length: n }, () => Math.floor(rng() * M));
    return {
      alpha,
      chained: chainedSuccess(chain(homes, M)),
      linear: mean(linear(homes, M).costs),
    };
  });
}

/** A curve, stopped where it leaves the top of the chart rather than flattened along it. */
const path = (f: (a: number) => number) => {
  const pts: string[] = [];
  for (let a = 0; a <= 0.95 + 1e-9; a += 0.005) {
    const v = f(a);
    pts.push(`${x(a).toFixed(2)},${y(v).toFixed(2)}`);
    if (v >= TOP) break;
  }
  return pts.join(" ");
};

/**
 * Section 4: the two strategies, side by side, against their formulas.
 *
 * Lines are the expected cost of finding a stored key: 1 + α/2 for chaining
 * and Knuth's ½(1 + 1/(1 − α)) for linear probing, with the cost of an
 * insertion into the probed table dashed above. Dots are measured on real
 * tables of 1,024 slots with random homes, so the visitor sees the formulas
 * hold and can re-run them. The scale stops at 10 probes on purpose: the
 * insertion curve leaves it before α = 0.8, and that departure is the point.
 */
export function CompareStage() {
  const lab = useLabs()["hash-tables"];
  const t = lab.compare;
  const [alpha, setAlpha] = useState(0.75);
  const [seed, setSeed] = useState(1);
  const dots = useMemo(() => measure(seed), [seed]);

  return (
    <Stage
      width="wide"
      caption={t.caption}
      announcement={t.announce(
        formatValue(alpha),
        formatValue(chainSuccessTheory(alpha)),
        formatValue(linearSuccessTheory(alpha)),
      )}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={t.chartLabel}
            className="block h-56 w-full sm:h-64"
          >
            {[1, 2, 4, 6, 8, 10].map((v) => (
              <line
                key={v}
                x1={0}
                x2={W}
                y1={y(v)}
                y2={y(v)}
                className="stroke-line/10"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <polyline
              points={path(linearInsertTheory)}
              className="fill-none stroke-signal-amber"
              strokeWidth={1.2}
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={path(linearSuccessTheory)}
              className="fill-none stroke-signal-amber"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={path(chainSuccessTheory)}
              className="fill-none stroke-accent"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={x(alpha)}
              x2={x(alpha)}
              y1={1}
              y2={H - 1}
              className="stroke-data"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Dots as HTML over the chart, so they stay round however the chart stretches. */}
          <div className="relative -mt-56 h-56 sm:-mt-64 sm:h-64" aria-hidden>
            {dots.map((d) => (
              <span key={`c${d.alpha}`}>
                <span
                  className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-ink-950"
                  style={{ left: `${x(d.alpha)}%`, top: `${(y(d.chained) / H) * 100}%` }}
                />
                <span
                  className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-amber ring-2 ring-ink-950"
                  style={{ left: `${x(d.alpha)}%`, top: `${(y(d.linear) / H) * 100}%` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-caption text-fg-faint">
            <span>α = 0</span>
            <span>{t.axis}</span>
            <span>0.95</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-caption text-fg-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 bg-accent" />
              {t.legend.chain}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 bg-signal-amber" />
              {t.legend.linear}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 border-t border-dashed border-signal-amber" />
              {t.legend.insert}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rounded-full bg-fg-muted" />
              {t.legend.dots}
            </li>
          </ul>
        </div>
      }
      primary={
        <LabSlider
          label={t.loadLabel}
          value={alpha}
          min={0.05}
          max={0.95}
          step={0.05}
          onChange={setAlpha}
          format={(v) => formatValue(v)}
        />
      }
      secondary={
        <Button
          variant="secondary"
          onClick={() => setSeed((s) => s + 1)}
          className="min-h-[44px] w-full"
        >
          {t.again}
        </Button>
      }
      secondaryLabel={t.secondaryLabel}
      figures={
        <>
          <Figure label={t.figures.chain} value={formatValue(chainSuccessTheory(alpha))} />
          <Figure
            label={t.figures.linear}
            value={formatValue(linearSuccessTheory(alpha))}
            tone="accent"
          />
          <Figure
            label={t.figures.insert}
            value={formatValue(linearInsertTheory(alpha), 1)}
            hint={t.figures.insertHint}
          />
        </>
      }
    />
  );
}
