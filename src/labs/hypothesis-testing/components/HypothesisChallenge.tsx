import { useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Badge, Button, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { BOUNDS, TEST_TYPES, evaluate, type Params, type TestType } from "../engine";
import { CHALLENGES, challengeById, coord, judge, prob, type ChallengeId } from "../view";
import { DistributionPlot } from "./DistributionPlot";

/**
 * Two tasks, both stated as a constraint on the result.
 *
 * Neither can be passed by putting a control anywhere in particular: the
 * verdict comes from `judge()`, which reads the power and alpha that
 * `evaluate()` produced. The first has an obvious answer — add data — and the
 * second is there to take that answer most of the way off the table, because
 * the sigma it starts with is large enough that n alone is an expensive route
 * and the direction of the test is the cheaper one.
 *
 * The success note says which constraint each control satisfied, so passing
 * explains itself rather than just lighting up.
 */
export function HypothesisChallenge() {
  const t = useT();
  const copy = t.labs["hypothesis-testing"];
  const c = copy.challenge;

  const [id, setId] = useState<ChallengeId>("reach-power");
  const [beaten, setBeaten] = useState<Partial<Record<ChallengeId, boolean>>>({});
  const [edits, setEdits] = useState<Partial<Record<ChallengeId, Partial<Params>>>>({});

  const spec = challengeById(id);
  const params: Params = useMemo(
    () => ({ ...spec.start, ...(edits[id] ?? {}) }),
    [spec, edits, id],
  );
  const result = useMemo(() => evaluate(params), [params]);
  const verdict = judge(spec, result);

  if (verdict.solved && !beaten[id]) {
    // Safe during render for this component's own state: React re-renders with
    // it before committing, and the alternative is an effect that fires a
    // frame late and makes the badge lag the verdict beside it.
    setBeaten((was) => ({ ...was, [id]: true }));
  }

  const set = (patch: Partial<Params>) =>
    setEdits((was) => ({ ...was, [id]: { ...(was[id] ?? {}), ...patch } }));

  const solvedCount = CHALLENGES.filter((s) => beaten[s.id]).length;
  const puzzle = c.puzzles[id];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented
          label={c.puzzleLabel}
          value={id}
          options={CHALLENGES.map((s) => ({
            value: s.id,
            // A tick as well as a fill: solved is not carried by colour alone.
            label: `${beaten[s.id] ? "✓ " : ""}${c.puzzles[s.id].title}`,
          }))}
          onChange={(next: ChallengeId) => setId(next)}
        />
        <Badge dotClassName={solvedCount === CHALLENGES.length ? "bg-signal-green" : "bg-fg-faint"}>
          {t.common.solved(solvedCount, CHALLENGES.length)}
        </Badge>
      </div>

      <p className="max-w-prose text-body-sm text-fg-muted">
        {puzzle.brief(prob(spec.minPower), spec.maxAlpha.toFixed(2))}
      </p>

      <Stage
        width="full"
        caption={puzzle.lesson}
        announcement={
          verdict.solved
            ? c.announceSolved(prob(result.power))
            : c.announceAttempt(prob(result.power), prob(result.params.alpha))
        }
        viewport={<DistributionPlot result={result} />}
        readout={
          <div
            className={cn(
              "rounded border px-4 py-3",
              verdict.solved
                ? "border-signal-green/40 bg-signal-green/10"
                : "border-line/10 bg-ink-950",
            )}
          >
            <p className="text-body-sm text-fg">
              {verdict.solved && (
                <span aria-hidden className="mr-1.5">
                  ✓
                </span>
              )}
              {verdict.solved
                ? puzzle.solved(prob(result.power), result.params.alpha.toFixed(2))
                : !verdict.alphaMet
                  ? c.alphaTooHigh(spec.maxAlpha.toFixed(2))
                  : c.notYet(prob(result.power), prob(spec.minPower))}
            </p>
          </div>
        }
        primary={
          <div className="space-y-4">
            {spec.levers.includes("testType") && (
              <Segmented
                label={copy.betaSection.testTypeLabel}
                value={params.testType}
                options={TEST_TYPES.map((type) => ({ value: type, label: copy.testType[type] }))}
                onChange={(next: TestType) => set({ testType: next })}
              />
            )}
            {spec.levers.includes("n") && (
              <LabSlider
                label={copy.controls.n}
                value={params.n}
                min={BOUNDS.n.min}
                max={BOUNDS.n.max}
                onChange={(value) => set({ n: value })}
                format={() => String(params.n)}
                valueText={() => copy.controls.nValue(params.n)}
              />
            )}
            {spec.levers.includes("alpha") && (
              <LabSlider
                label={copy.controls.alpha}
                value={Math.round(params.alpha * 100)}
                min={Math.round(BOUNDS.alpha.min * 100)}
                max={Math.round(BOUNDS.alpha.max * 100)}
                onChange={(value) => set({ alpha: value / 100 })}
                format={() => params.alpha.toFixed(2)}
                valueText={() => copy.controls.alphaValue(params.alpha.toFixed(2))}
              />
            )}
            {spec.levers.includes("sigma") && (
              <LabSlider
                label={copy.controls.sigma}
                value={Math.round(params.sigma * 10)}
                min={Math.round(BOUNDS.sigma.min * 10)}
                max={Math.round(BOUNDS.sigma.max * 10)}
                onChange={(value) => set({ sigma: value / 10 })}
                format={() => coord(params.sigma)}
                valueText={() => copy.controls.sigmaValue(coord(params.sigma))}
              />
            )}
            <Button
              variant="ghost"
              onClick={() => setEdits((was) => ({ ...was, [id]: {} }))}
              className="min-h-11 w-full justify-center"
            >
              {c.reset}
            </Button>
          </div>
        }
        figures={
          <>
            <Figure
              label={c.powerLabel}
              value={prob(result.power)}
              tone={verdict.powerMet ? "accent" : "default"}
              hint={c.target(prob(spec.minPower))}
            />
            <Figure label={c.alphaLabel} value={result.params.alpha.toFixed(2)} />
            <Figure label={c.seLabel} value={coord(result.se)} />
          </>
        }
      />
    </div>
  );
}
