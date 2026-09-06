import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ControlPanel, Figure, FigureRow, LabSlider } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { clamp } from "@/lib/math";
import { createRun, gradient, step, type OptimizerConfig } from "../engine";
import { LANDSCAPES } from "../landscape";
import { useDescentRun } from "../useDescentRun";
import { LandscapeCanvas, ObjectiveChart } from "./LandscapeCanvas";
import { TOLERANCE, VIEW_EXTENT } from "./DescentStage";

/** A step size plain descent can survive on the steep axis: 2/1000 = 0.002. */
const GD_RATE = 0.001;
const ADAM_RATE = 0.1;
const MAX_STEPS = 300;

/** Absolute step size for the Adam run: 0.01 to 1.20. */
const ADAM_INDEX_MAX = 120;

/** One row of the first-step figure, measured on the real engine. */
function firstStep(config: OptimizerConfig): { dx: number; dy: number } {
  const preset = LANDSCAPES.scaleGap;
  const run = createRun(preset.landscape, preset.start, config, {
    tolerance: 0,
    maxSteps: 1,
    escapeRadius: Infinity,
  });
  const event = step(run);
  return { dx: Math.abs(event.update.x), dy: Math.abs(event.update.y) };
}

/** Log-scaled bar width, so a millionfold difference fits in one figure. */
const logWidth = (value: number, lo: number, hi: number): number => {
  if (!(value > 0)) return 2;
  return clamp(((Math.log10(value) - lo) / (hi - lo)) * 100, 2, 100);
};

/**
 * Section 5: what Adam's per-parameter scaling actually does.
 *
 * One behaviour, shown before anything is claimed. On a landscape whose two
 * curvatures differ by a factor of a million, the gradient's two components
 * differ by about the same factor — and Adam's first step is the same size on
 * both axes, because the corrected second moment ŝ₁ is exactly g² and the
 * update is η·ĝ/(√ŝ + ε), which reduces to η·sign(g)/(1 + ε/|g|).
 *
 * Every number in the figure is measured by running the engine one step, so
 * the picture cannot drift from the arithmetic it describes.
 *
 * What the section must not say is that this makes Adam better, faster, or
 * free of tuning. Phase 1 measured the opposite on the valley below: a
 * well-chosen momentum setting reaches the tolerance in about 10 steps where
 * Adam's best over a 300-point sweep of step sizes is 17.
 */
export function AdamStage() {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const reduced = useReducedMotion() ?? false;

  const scale = LANDSCAPES.scaleGap;
  const grad = gradient(scale.landscape, scale.start);
  const gdStep = firstStep({ kind: "gd", learningRate: GD_RATE });
  const adamStep = firstStep({ kind: "adam", learningRate: ADAM_RATE });

  const rows = [
    { key: "gradient", label: g.adam.rowGradient, x: Math.abs(grad.x), y: Math.abs(grad.y) },
    { key: "gd", label: g.adam.rowGd(formatNumber(GD_RATE, 4)), x: gdStep.dx, y: gdStep.dy },
    { key: "adam", label: g.adam.rowAdam(formatNumber(ADAM_RATE, 2)), x: adamStep.dx, y: adamStep.dy },
  ] as const;

  const lo = -8;
  const hi = 3;

  // --- the run
  const valley = LANDSCAPES.valley;
  const [rateIndex, setRateIndex] = useState(20);
  const learningRate = rateIndex / 100;

  const run = useDescentRun({
    landscape: valley.landscape,
    start: valley.start,
    config: { kind: "adam", learningRate },
    tolerance: TOLERANCE,
    maxSteps: MAX_STEPS,
    reduced,
  });
  const { view } = run;

  const [announcement, setAnnouncement] = useState("");
  const settled = !run.playing && run.atEnd;
  useEffect(() => {
    if (settled) setAnnouncement(g.announce.finished(view.run.t, g.status[view.run.status]));
  }, [settled, view.run.t, view.run.status, g]);

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------- the surprising bit */}
      <div className="card-surface p-5 md:p-6">
        <h3 className="text-body font-medium text-fg">{g.adam.firstStepTitle}</h3>
        <p className="mt-2 max-w-prose text-body-sm text-fg-muted">
          {g.adam.firstStepLede(
            formatNumber(scale.landscape.a, 0),
            formatNumber(scale.landscape.b, 3),
          )}
        </p>

        <table className="mt-5 w-full border-collapse text-body-sm">
          <caption className="sr-only">{g.adam.tableCaption}</caption>
          <thead>
            <tr className="text-overline uppercase text-fg-faint">
              <th scope="col" className="w-1/3 py-2 text-left font-normal">
                {g.adam.colQuantity}
              </th>
              <th scope="col" className="py-2 text-left font-normal">
                {g.adam.colX}
              </th>
              <th scope="col" className="py-2 text-left font-normal">
                {g.adam.colY}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line/10 align-middle">
                <th scope="row" className="py-3 pr-4 text-left font-normal text-fg">
                  {row.label}
                </th>
                {([row.x, row.y] as const).map((value, i) => (
                  <td key={i} className="py-3 pr-4">
                    <span className="block font-mono tabular-nums text-fg">
                      {value.toExponential(2)}
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 block h-1.5 rounded-pill bg-accent"
                      style={{ width: `${logWidth(value, lo, hi)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-5 max-w-prose text-body-sm text-fg-muted">{g.adam.firstStepNote}</p>
      </div>

      {/* ------------------------------------------------------- the run */}
      <div className="space-y-4">
        <ControlPanel>
          <LabSlider
            label={g.adam.rate}
            value={rateIndex}
            min={1}
            max={ADAM_INDEX_MAX}
            onChange={setRateIndex}
            format={() => formatNumber(learningRate, 2)}
            valueText={() => g.controls.learningRateValue(formatNumber(learningRate, 2))}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button onClick={run.play}>{run.playing ? g.controls.pause : g.controls.run}</Button>
            <Button variant="ghost" onClick={run.reset}>
              {g.controls.reset}
            </Button>
          </div>
        </ControlPanel>

        <FigureRow>
          <Figure label={g.figures.step} value={`${run.index} / ${run.total}`} />
          <Figure label={g.figures.objective} value={formatNumber(view.objective, 4)} tone="accent" />
          <Figure label={g.figures.status} value={g.status[view.status]} />
          {/* Held back until the run has actually been watched to the end.
              Showing it at step 0 would answer the question before it is asked. */}
          <Figure
            label={g.figures.stepsToTolerance}
            value={run.atEnd && view.run.status === "converged" ? String(view.run.t) : "—"}
          />
        </FigureRow>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <LandscapeCanvas
            landscape={valley.landscape}
            extent={VIEW_EXTENT}
            path={view.run.path}
            pathLength={view.shown + 1}
            start={valley.start}
            current={view.position}
            diverged={view.status === "diverged"}
            label={g.map.label(
              formatNumber(view.position.x, 3),
              formatNumber(view.position.y, 3),
              run.index,
              formatNumber(view.objective, 4),
              formatNumber(view.gradientNorm, 3),
              g.status[view.status],
            )}
          />
          <ObjectiveChart
            series={view.series}
            count={view.count}
            tolerance={TOLERANCE}
            cursor={view.shown}
            label={g.chart.label(formatNumber(view.objective, 4), run.index)}
          />
        </div>

        <LabSlider
          label={g.controls.scrubber}
          value={run.index}
          min={0}
          max={Math.max(1, run.total)}
          onChange={run.setIndex}
          format={(value) => `${value} / ${run.total}`}
          valueText={(value) => g.controls.scrubberValue(value, run.total)}
        />
      </div>

      <p className="max-w-prose text-body-sm text-fg-muted">{g.adam.honesty}</p>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
