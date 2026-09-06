import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ControlPanel, Figure, FigureRow, LabSlider } from "@/components/lab";
import { Badge, Button } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import {
  LANDSCAPES,
  LR_LIMIT_INDEX,
  landscapeFacts,
  learningRateAt,
  regimeAt,
  type LandscapeId,
} from "../landscape";
import { useDescentRun } from "../useDescentRun";
import { LandscapeCanvas, ObjectiveChart } from "./LandscapeCanvas";

/** How far past the stability limit the slider can reach. */
const LR_MAX_INDEX = Math.round(LR_LIMIT_INDEX * 1.3);

export const VIEW_EXTENT = 1.35;
export const TOLERANCE = 1e-3;
const MAX_STEPS = 300;

export interface Mark {
  key: string;
  /** Position along the slider track, 0–100. */
  position: number;
  label: string;
  value: string;
  strong?: boolean;
  /**
   * Second row. Section 4's two boundaries land on the same number when β = 0,
   * which is correct and would otherwise print one label on top of the other.
   * Stacking them keeps both readable and makes the coincidence legible.
   */
  row?: 0 | 1;
}

/**
 * Threshold marks under a step-size slider.
 *
 * Each mark carries its own value, so the strip is readable without colour,
 * and a mark near either end anchors its label inward instead of hanging off
 * the edge — which at 390px would push the page sideways.
 */
export function ThresholdMarks({ marks }: { marks: readonly Mark[] }) {
  const stacked = marks.some((m) => m.row === 1);
  return (
    <div className={cn("relative", stacked ? "h-[4.75rem]" : "h-9")} aria-hidden>
      <div className="absolute inset-x-0 top-0 h-px bg-line/10" />
      {marks.map((mark) => {
        const pos = Math.max(0, Math.min(100, mark.position));
        const edge = pos < 14 ? "start" : pos > 86 ? "end" : "middle";
        return (
          <div
            key={mark.key}
            className={cn(
              "absolute",
              // The second row starts below the first row's labels rather than
              // drawing a tick down through them.
              mark.row === 1 ? "top-9" : "top-0",
              edge === "start" && "translate-x-0 text-left",
              edge === "end" && "-translate-x-full text-right",
              edge === "middle" && "-translate-x-1/2 text-center",
            )}
            style={{ left: `${pos}%` }}
          >
            <div
              className={cn(
                "h-2 w-px",
                mark.strong ? "bg-accent" : "bg-fg-faint",
                edge === "start" && "mr-auto",
                edge === "end" && "ml-auto",
                edge === "middle" && "mx-auto",
              )}
            />
            <p className="mt-1 whitespace-nowrap text-overline uppercase text-fg-faint">
              {mark.label}
            </p>
            <p className="whitespace-nowrap font-mono text-overline text-fg-muted">{mark.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export interface DescentStageProps {
  landscapeId: LandscapeId;
  /** Section 3 turns on the thresholds, the regime label and the loss curve. */
  detailed?: boolean;
  defaultLearningRateIndex: number;
  caption?: string;
}

/**
 * One landscape, one step size, one run.
 *
 * Section 1 uses the plain form: a map, a slider and a button, and no
 * vocabulary at all. Section 3 turns on everything the same stage can show —
 * the two thresholds marked on the slider track, the name of the regime the
 * current step size is in, and the objective plotted against step number.
 */
export function DescentStage({
  landscapeId,
  detailed = false,
  defaultLearningRateIndex,
  caption,
}: DescentStageProps) {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const reduced = useReducedMotion() ?? false;

  const preset = LANDSCAPES[landscapeId];
  const facts = landscapeFacts(preset.landscape);

  const [lrIndex, setLrIndex] = useState(defaultLearningRateIndex);
  const learningRate = learningRateAt(preset.landscape, lrIndex);
  const regime = regimeAt(lrIndex);

  const run = useDescentRun({
    landscape: preset.landscape,
    start: preset.start,
    config: { kind: "gd", learningRate },
    tolerance: TOLERANCE,
    maxSteps: MAX_STEPS,
    reduced,
  });
  const { view } = run;

  // Announced at transitions only — when a run settles or is rewound — never
  // once per frame while it is playing.
  const [announcement, setAnnouncement] = useState("");
  const settled = !run.playing && run.atEnd;
  useEffect(() => {
    if (settled) setAnnouncement(g.announce.finished(view.run.t, g.status[view.run.status]));
    else if (run.index === 0) setAnnouncement(g.announce.ready);
  }, [settled, run.index, view.run.t, view.run.status, g]);

  const summary = g.map.label(
    formatNumber(view.position.x, 3),
    formatNumber(view.position.y, 3),
    run.index,
    formatNumber(view.objective, 4),
    formatNumber(view.gradientNorm, 3),
    g.status[view.status],
  );

  return (
    <div className="space-y-4">
      <ControlPanel>
        <LabSlider
          label={g.controls.learningRate}
          value={lrIndex}
          min={1}
          max={LR_MAX_INDEX}
          onChange={setLrIndex}
          format={() => formatNumber(learningRate, 5)}
          valueText={() => g.controls.learningRateValue(formatNumber(learningRate, 5))}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button onClick={run.play}>{run.playing ? g.controls.pause : g.controls.run}</Button>
          <Button variant="secondary" onClick={run.stepOnce} disabled={run.atEnd}>
            {g.controls.stepOnce}
          </Button>
          <Button variant="ghost" onClick={run.reset}>
            {g.controls.reset}
          </Button>
        </div>
      </ControlPanel>

      {detailed && (
        <div className="space-y-3">
          {/* The two thresholds, on the same scale as the slider above. */}
          <ThresholdMarks
            marks={[
              {
                key: "monotone",
                position: ((LR_LIMIT_INDEX / 2) / LR_MAX_INDEX) * 100,
                label: g.rate.marks.monotone,
                value: formatNumber(facts.monotoneLimit, 5),
              },
              {
                key: "stability",
                position: (LR_LIMIT_INDEX / LR_MAX_INDEX) * 100,
                label: g.rate.marks.stability,
                value: formatNumber(facts.stabilityLimit, 5),
                strong: true,
              },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{g.rate.regimes[regime]}</Badge>
            <p className="text-body-sm text-fg-muted">{g.rate.regimeNote[regime]}</p>
          </div>
        </div>
      )}

      <FigureRow>
        <Figure label={g.figures.step} value={`${run.index} / ${run.total}`} />
        <Figure
          label={g.figures.objective}
          value={formatNumber(view.objective, 4)}
          tone="accent"
          hint={g.figures.objectiveHint}
        />
        <Figure label={g.figures.gradientNorm} value={formatNumber(view.gradientNorm, 3)} />
        <Figure label={g.figures.status} value={g.status[view.status]} />
        {detailed && (
          <Figure
            label={g.figures.conditionNumber}
            value={formatNumber(facts.conditionNumber, 0)}
            hint={g.figures.conditionNumberHint}
          />
        )}
      </FigureRow>

      <div className={detailed ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}>
        <LandscapeCanvas
          landscape={preset.landscape}
          extent={VIEW_EXTENT}
          path={view.run.path}
          pathLength={view.shown + 1}
          start={preset.start}
          current={view.position}
          diverged={view.status === "diverged"}
          label={summary}
        />
        {detailed && (
          <div className="flex flex-col gap-4">
            <ObjectiveChart
              series={view.series}
              count={view.count}
              tolerance={TOLERANCE}
              cursor={view.shown}
              label={g.chart.label(formatNumber(view.objective, 4), run.index)}
              className="flex-1"
            />
            <p className="text-body-sm text-fg-faint">{g.rate.scope}</p>
          </div>
        )}
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

      {caption && <p className="max-w-prose text-body-sm text-fg-muted">{caption}</p>}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
