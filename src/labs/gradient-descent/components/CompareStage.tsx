import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ControlPanel, Figure, FigureRow, LabSlider } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import type { OptimizerConfig } from "../engine";
import {
  LANDSCAPES,
  LR_LIMIT_INDEX,
  landscapeFacts,
  learningRateAt,
  momentumLimitIndex,
  type LandscapeId,
} from "../landscape";
import { useDescentRuns, type RunView } from "../useDescentRun";
import { LandscapeCanvas } from "./LandscapeCanvas";
import { ThresholdMarks, TOLERANCE, VIEW_EXTENT } from "./DescentStage";

/** Far enough past the momentum boundary at the largest β to cross it. */
const LR_MAX_INDEX = 420;
const MAX_STEPS = 300;

export interface CompareStageProps {
  landscapeId: LandscapeId;
  defaultLearningRateIndex: number;
  defaultBeta: number;
  caption?: string;
}

/**
 * Section 4: plain descent and momentum, from the same point, at the same step
 * size, advancing in lockstep.
 *
 * Lockstep matters. If the two ran on a clock, finishing first would mean
 * being quicker to compute rather than needing fewer steps, and the comparison
 * would be about nothing. One index drives both; a run that has finished holds
 * at its last point while the other keeps going.
 *
 * Two boundaries are marked on the step-size track, and they are not the same
 * number. Plain descent needs η·max(a,b) < 2. The convention implemented here
 * — v ← βv + ∇f, θ ← θ − ηv — gives momentum η·max(a,b) < 2(1 + β), which is
 * *wider*. So momentum can take a larger step than plain descent, and what it
 * charges for the extra range is oscillation rather than blow-up.
 */
export function CompareStage({
  landscapeId,
  defaultLearningRateIndex,
  defaultBeta,
  caption,
}: CompareStageProps) {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const reduced = useReducedMotion() ?? false;

  const preset = LANDSCAPES[landscapeId];
  const facts = landscapeFacts(preset.landscape);

  const [lrIndex, setLrIndex] = useState(defaultLearningRateIndex);
  const [betaPercent, setBetaPercent] = useState(Math.round(defaultBeta * 100));

  const learningRate = learningRateAt(preset.landscape, lrIndex);
  const beta = betaPercent / 100;

  const configs: OptimizerConfig[] = [
    { kind: "gd", learningRate },
    { kind: "momentum", learningRate, beta },
  ];

  const runs = useDescentRuns({
    landscape: preset.landscape,
    start: preset.start,
    configs,
    tolerance: TOLERANCE,
    maxSteps: MAX_STEPS,
    reduced,
  });

  const [plain, withMomentum] = runs.views;

  const [announcement, setAnnouncement] = useState("");
  const settled = !runs.playing && runs.atEnd;
  useEffect(() => {
    if (!settled || !plain || !withMomentum) return;
    setAnnouncement(
      g.momentumSection.announce(
        plain.run.t,
        g.status[plain.run.status],
        withMomentum.run.t,
        g.status[withMomentum.run.status],
      ),
    );
  }, [settled, plain, withMomentum, g]);

  const momentumIndex = momentumLimitIndex(beta);

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
        <LabSlider
          label={g.controls.beta}
          value={betaPercent}
          min={0}
          max={95}
          step={5}
          onChange={setBetaPercent}
          format={() => formatNumber(beta, 2)}
          valueText={() => g.controls.betaValue(formatNumber(beta, 2))}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button onClick={runs.play}>{runs.playing ? g.controls.pause : g.controls.run}</Button>
          <Button variant="ghost" onClick={runs.reset}>
            {g.controls.reset}
          </Button>
        </div>
      </ControlPanel>

      {/* Both stability boundaries, on the same scale as the slider. The
          momentum mark moves as β changes, and that movement is the lesson.
          It sits on its own row because at β = 0 the two are the same number —
          which is true, and would otherwise print one label over the other. */}
      <ThresholdMarks
        marks={[
          {
            key: "plain",
            position: (LR_LIMIT_INDEX / LR_MAX_INDEX) * 100,
            label: g.momentumSection.marks.plain,
            value: formatNumber(facts.stabilityLimit, 5),
          },
          {
            key: "momentum",
            position: (momentumIndex / LR_MAX_INDEX) * 100,
            label: g.momentumSection.marks.momentum,
            value: formatNumber(learningRateAt(preset.landscape, momentumIndex), 5),
            strong: true,
            row: 1,
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ComparePanel
          title={g.optimizers.gd}
          view={plain}
          landscapeId={landscapeId}
          index={runs.index}
        />
        <ComparePanel
          title={g.optimizers.momentum}
          view={withMomentum}
          landscapeId={landscapeId}
          index={runs.index}
          highlight
        />
      </div>

      <LabSlider
        label={g.controls.scrubber}
        value={runs.index}
        min={0}
        max={Math.max(1, runs.total)}
        onChange={runs.setIndex}
        format={(value) => `${value} / ${runs.total}`}
        valueText={(value) => g.controls.scrubberValue(value, runs.total)}
      />

      {caption && <p className="max-w-prose text-body-sm text-fg-muted">{caption}</p>}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function ComparePanel({
  title,
  view,
  landscapeId,
  index,
  highlight = false,
}: {
  title: string;
  view: RunView | undefined;
  landscapeId: LandscapeId;
  index: number;
  highlight?: boolean;
}) {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const preset = LANDSCAPES[landscapeId];
  if (!view) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-body font-medium text-fg">{title}</h3>
        <p className="font-mono text-caption text-fg-muted">
          {g.figures.stepsTaken(Math.min(index, view.count - 1))}
        </p>
      </div>
      <LandscapeCanvas
        landscape={preset.landscape}
        extent={VIEW_EXTENT}
        path={view.run.path}
        pathLength={view.shown + 1}
        start={preset.start}
        current={view.position}
        diverged={view.status === "diverged"}
        label={g.map.label(
          formatNumber(view.position.x, 3),
          formatNumber(view.position.y, 3),
          view.shown,
          formatNumber(view.objective, 4),
          formatNumber(view.gradientNorm, 3),
          g.status[view.status],
        )}
      />
      <FigureRow>
        <Figure
          label={g.figures.objective}
          value={formatNumber(view.objective, 4)}
          tone={highlight ? "accent" : "default"}
        />
        <Figure label={g.figures.status} value={g.status[view.status]} />
      </FigureRow>
    </div>
  );
}
