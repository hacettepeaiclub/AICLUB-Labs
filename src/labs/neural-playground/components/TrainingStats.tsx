import { memo } from "react";
import { Figure } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber, formatPercent } from "@/lib/format";
import { useDebouncedValue } from "@/hooks";
import type { TrainerStats } from "../useTrainer";

export interface TrainingStatsProps {
  stats: TrainerStats;
  /** Training loss over time, oldest first. */
  history: readonly number[];
}

const WIDTH = 240;
const HEIGHT = 44;

/**
 * Loss over time. Drawn on a log scale: nearly all the interesting movement
 * happens in the first fraction of the range, and a linear axis hides it.
 */
const LossCurve = memo(function LossCurve({ history }: { history: readonly number[] }) {
  const t = useT().labs["neural-playground"].stats;
  if (history.length < 2) {
    return <div className="h-11 w-full max-w-60 rounded bg-ink-900" aria-hidden />;
  }

  const logs = history.map((loss) => Math.log10(Math.max(loss, 1e-5)));
  const max = Math.max(...logs);
  const min = Math.min(...logs);
  const span = Math.max(max - min, 0.25);
  const points = logs
    .map((value, i) => {
      const x = (i / (logs.length - 1)) * WIDTH;
      const y = HEIGHT - ((value - min) / span) * (HEIGHT - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="h-11 w-full max-w-60 rounded bg-ink-900"
      role="img"
      aria-label={t.curveLabel}
    >
      <polyline
        points={points}
        fill="none"
        className="stroke-accent"
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

/** The scoreboard: how well the network is doing, right now. */
export function TrainingStats({ stats, history }: TrainingStatsProps) {
  const t = useT().labs["neural-playground"].stats;
  // Stats publish 10x a second; announcing each one would be a running
  // commentary. This settles to whatever the figure is when training pauses
  // or plateaus.
  const settledAccuracy = useDebouncedValue(Math.round(stats.accuracy * 100), 1200);

  return (
    <div className="card-surface flex flex-wrap items-start justify-between gap-x-8 gap-y-4 p-5">
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Figure label={t.epoch} value={stats.epoch.toLocaleString("en-US")} tone="muted" />
        <Figure label={t.loss} value={formatNumber(stats.loss, 4)} />
        <Figure label={t.trainAcc} value={formatPercent(stats.accuracy, 1)} tone="accent" />
        <Figure label={t.testAcc} value={formatPercent(stats.testAccuracy, 1)} />
      </div>
      <LossCurve history={history} />
      <p aria-live="polite" className="sr-only">
        {t.announce(settledAccuracy)}
      </p>
    </div>
  );
}
