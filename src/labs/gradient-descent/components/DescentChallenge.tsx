import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Figure, LabSlider, Stage, Transport } from "@/components/lab";
import { Badge, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { OptimizerConfig, OptimizerKind } from "../engine";
import {
  landscapeFacts,
  learningRateAt,
  LR_LIMIT_INDEX,
  momentumLimitIndex,
} from "../landscape";
import {
  CHALLENGES,
  challengeOrder,
  DEFAULTS,
  judge,
  transfer,
  TRANSFER_LANDSCAPE,
  TRANSFER_START,
  type ChallengeId,
  type ChallengeSpec,
  type Verdict,
} from "../challenge";
import { useDescentRun } from "../useDescentRun";
import { LandscapeCanvas } from "./LandscapeCanvas";
import { VIEW_EXTENT } from "./DescentStage";

const GD_MAX_INDEX = Math.round(LR_LIMIT_INDEX * 1.3);
const MOMENTUM_MAX_INDEX = 420;
const ADAM_MAX_INDEX = 120;

/**
 * Section 6: the three challenges.
 *
 * Judging goes through `judge()`, which calls the same `measureRun` the
 * feasibility gate in `engine.test.ts` calls — so a challenge can never be
 * graded by different arithmetic than the arithmetic that proved it solvable.
 * The verdict this component receives is a set of facts; every sentence it
 * shows comes from the dictionary.
 *
 * ## One puzzle at a time
 *
 * All three used to be mounted together: three landscapes, three control
 * panels, three maps and three scrubbers stacked down the page, each running
 * its own engine. That is three instruments where the visitor can use one, and
 * on a phone it was an enormous amount of scrolling between a slider and the
 * surface it moved.
 *
 * A picker selects one. Which puzzles have been beaten is held here rather
 * than in the card, so switching away from a solved puzzle and back does not
 * forget it — the card is keyed by id and resets to that puzzle's own defaults,
 * which is what it should do, and the tally is not the card's business.
 */
export function DescentChallenge() {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const [solved, setSolved] = useState<ChallengeId[]>([]);
  const [selected, setSelected] = useState<ChallengeId>(challengeOrder[0] ?? "c1");

  const markSolved = useCallback((id: ChallengeId) => {
    setSolved((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const spec = CHALLENGES[selected];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented
          label={g.challenge.puzzle}
          value={selected}
          options={challengeOrder.map((id) => ({ value: id, label: g.challenge.items[id].title }))}
          onChange={setSelected}
        />
        <Badge
          dotClassName={solved.length === challengeOrder.length ? "bg-signal-green" : "bg-fg-faint"}
        >
          {g.challenge.progress(solved.length, challengeOrder.length)}
        </Badge>
      </div>

      <ChallengeCard key={selected} spec={spec} onSolved={() => markSolved(selected)} />
    </div>
  );
}

function ChallengeCard({ spec, onSolved }: { spec: ChallengeSpec; onSolved: () => void }) {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const reduced = useReducedMotion() ?? false;
  const defaults = DEFAULTS[spec.id];
  const facts = landscapeFacts(spec.landscape);

  const [optimizer, setOptimizer] = useState<OptimizerKind>(defaults.optimizer);
  const [rateIndex, setRateIndex] = useState(defaults.rateIndex);
  const [betaPercent, setBetaPercent] = useState(defaults.betaPercent);
  const [adamIndex, setAdamIndex] = useState(defaults.adamIndex);

  const beta = betaPercent / 100;
  const scaledRate = learningRateAt(spec.landscape, rateIndex);
  const adamRate = adamIndex / 100;

  const config: OptimizerConfig = useMemo(() => {
    if (optimizer === "adam") return { kind: "adam", learningRate: adamRate };
    if (optimizer === "momentum") return { kind: "momentum", learningRate: scaledRate, beta };
    return { kind: "gd", learningRate: scaledRate };
  }, [optimizer, adamRate, scaledRate, beta]);

  const run = useDescentRun({
    landscape: spec.landscape,
    start: spec.start,
    config,
    tolerance: spec.tolerance,
    // Enough room to show what a losing attempt actually does, without
    // pretending a run that never arrives has arrived.
    maxSteps: Math.max(120, spec.budget * 4),
    reduced,
  });
  const { view } = run;

  const verdict: Verdict = useMemo(() => judge(spec, config), [spec, config]);
  const revealed = run.atEnd && run.index > 0;

  useEffect(() => {
    if (revealed && verdict.kind === "solved") onSolved();
  }, [revealed, verdict.kind, onSolved]);

  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (!revealed) return;
    setAnnouncement(verdictText(g, verdict));
  }, [revealed, verdict, g]);

  const showsTransfer = spec.id === "c2";
  const moved = useMemo(
    () => (showsTransfer ? transfer(spec, scaledRate) : null),
    [showsTransfer, spec, scaledRate],
  );

  const rateMax = optimizer === "momentum" ? MOMENTUM_MAX_INDEX : GD_MAX_INDEX;
  const boundaryIndex = optimizer === "momentum" ? momentumLimitIndex(beta) : LR_LIMIT_INDEX;

  const rateSlider =
    optimizer === "adam" ? (
      <LabSlider
        label={g.adam.rate}
        value={adamIndex}
        min={1}
        max={ADAM_MAX_INDEX}
        onChange={setAdamIndex}
        format={() => formatNumber(adamRate, 2)}
        valueText={() => g.controls.learningRateValue(formatNumber(adamRate, 2))}
      />
    ) : (
      <LabSlider
        label={g.controls.learningRate}
        value={rateIndex}
        min={1}
        max={rateMax}
        onChange={setRateIndex}
        format={() => formatNumber(scaledRate, 5)}
        valueText={() => g.controls.learningRateValue(formatNumber(scaledRate, 5))}
      />
    );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-body-lg font-semibold text-fg">{g.challenge.items[spec.id].title}</h3>
        <p className="mt-2 max-w-prose text-body-sm text-fg-muted">
          {g.challenge.items[spec.id].brief}
        </p>
      </div>

      <Stage
        width="full"
        secondaryLabel={g.challenge.optimizerAndSettings}
        announcement={announcement}
        caption={
          /* Earned in context: it appears only once a run has actually been
             watched to the end, and it is a sentence rather than a badge. */
          revealed ? (
            <span
              className={cn(verdict.kind === "solved" ? "text-signal-green" : "text-fg-muted")}
            >
              <span className="font-medium">
                {verdict.kind === "solved" ? g.challenge.pass : g.challenge.notYet}
              </span>{" "}
              {verdictText(g, verdict)}
            </span>
          ) : (
            g.challenge.pressRun
          )
        }
        viewport={
          <LandscapeCanvas
            landscape={spec.landscape}
            extent={VIEW_EXTENT}
            path={view.run.path}
            pathLength={view.shown + 1}
            start={spec.start}
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
        }
        readout={
          <div className="space-y-2">
            <p className="font-mono text-caption text-fg-faint">
              {g.challenge.goal(spec.budget, spec.tolerance.toExponential(0))}
            </p>
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
        }
        primary={
          <div className="space-y-3">
            {rateSlider}
            <Transport
              running={run.playing}
              onRun={run.play}
              onStep={run.stepOnce}
              onReset={run.reset}
              runLabel={g.controls.run}
              stepDisabled={run.atEnd}
            />
          </div>
        }
        figures={
          <>
            <Figure label={g.figures.step} value={`${run.index} / ${run.total}`} />
            <Figure label={g.figures.objective} value={formatNumber(view.objective, 4)} />
            <Figure label={g.figures.status} value={g.status[view.status]} />
          </>
        }
        secondary={
          <>
            {spec.allowed.length > 1 && (
              <Segmented
                label={g.controls.optimizer}
                value={optimizer}
                options={spec.allowed.map((kind) => ({ value: kind, label: g.optimizers[kind] }))}
                onChange={setOptimizer}
              />
            )}
            {optimizer === "momentum" && (
              <LabSlider
                label={g.controls.beta}
                value={betaPercent}
                min={0}
                max={95}
                step={5}
                onChange={setBetaPercent}
                format={() => formatNumber(beta, 2)}
                valueText={() => g.controls.betaValue(formatNumber(beta, 2))}
              />
            )}
            {optimizer !== "adam" && (
              <p className="font-mono text-caption text-fg-faint">
                {g.challenge.boundaryHint(
                  formatNumber(learningRateAt(spec.landscape, boundaryIndex), 5),
                  formatNumber(facts.conditionNumber, 0),
                )}
              </p>
            )}
          </>
        }
      />

      {moved && (
        <div className="rounded-card border border-line/10 bg-ink-800 p-5">
          <h4 className="text-body-sm font-medium text-fg">{g.challenge.transfer.title}</h4>
          <p className="mt-2 max-w-prose text-body-sm text-fg-muted">
            {moved.divergentHere && moved.convergesThere
              ? g.challenge.transfer.divergesHereConvergesThere(
                  formatNumber(scaledRate, 5),
                  formatNumber(facts.stabilityLimit, 5),
                  formatNumber(landscapeFacts(TRANSFER_LANDSCAPE).stabilityLimit, 5),
                  moved.stepsThere ?? 0,
                )
              : moved.convergesThere
                ? g.challenge.transfer.worksOnBoth(moved.stepsThere ?? 0)
                : g.challenge.transfer.worksOnNeither}
          </p>
          <TransferPreview learningRate={scaledRate} tolerance={spec.tolerance} />
        </div>
      )}
    </div>
  );
}

/** The same step size, on the gentler landscape. Nothing else changes. */
function TransferPreview({ learningRate, tolerance }: { learningRate: number; tolerance: number }) {
  const t = useT();
  const g = t.labs["gradient-descent"];
  const reduced = useReducedMotion() ?? false;
  const run = useDescentRun({
    landscape: TRANSFER_LANDSCAPE,
    start: TRANSFER_START,
    config: { kind: "gd", learningRate },
    tolerance,
    maxSteps: 200,
    reduced,
  });
  const { view } = run;

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:items-center">
      <LandscapeCanvas
        landscape={TRANSFER_LANDSCAPE}
        extent={VIEW_EXTENT}
        path={view.run.path}
        pathLength={view.count}
        start={TRANSFER_START}
        current={view.run.status === "diverged" ? undefined : view.position}
        label={g.challenge.transfer.mapLabel(
          formatNumber(learningRate, 5),
          g.status[view.run.status],
          view.run.t,
        )}
      />
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <Figure label={g.figures.status} value={g.status[view.run.status]} />
        <Figure
          label={g.figures.stepsToTolerance}
          value={view.run.status === "converged" ? String(view.run.t) : "—"}
        />
      </div>
    </div>
  );
}

type Dict = ReturnType<typeof useT>["labs"]["gradient-descent"];

function verdictText(g: Dict, verdict: Verdict): string {
  switch (verdict.kind) {
    case "solved":
      return g.challenge.verdicts.solved(verdict.steps ?? 0, verdict.budget);
    case "diverged":
      return g.challenge.verdicts.diverged;
    case "over-budget":
      return verdict.steps === null
        ? g.challenge.verdicts.stalled(verdict.budget)
        : g.challenge.verdicts.overBudget(verdict.steps, verdict.budget);
    default:
      return g.challenge.pressRun;
  }
}
