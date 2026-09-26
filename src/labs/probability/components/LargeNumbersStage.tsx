import { useMemo, useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import {
  RIGHT_PROBABILITY,
  SCALES,
  firstOutcomes,
  run as runTrials,
  widestDeviation,
} from "../engine/largeNumbers";
import { bandY, grouped, logX } from "../view";
import { Coach, Explain } from "./Framing";
import { Prediction } from "./Prediction";

const SEED = 20260926;
/** Above this, individual outcomes stop being a picture and become a texture. */
const WATCHABLE = 100;

/**
 * Section 6 — the same decision, repeated until the proportion settles.
 *
 * The trial is deliberately the one the board upstairs is built from: a single
 * fair left/right decision. Section 5 stacks eight of them and looks at where
 * a ball lands; this one repeats the single decision and watches the share of
 * rights.
 *
 * ## The chart is allowed to wander
 *
 * The temptation with this law is to draw a tidy funnel closing on one half,
 * which would be a picture of a theorem nobody proved. What the law says is
 * that the proportion *tends* towards the probability, not that it gets closer
 * at every step, and the engine's own test asserts that a run does sometimes
 * move away. So the line is the run, wobble included, and the reference line
 * is drawn flat behind it rather than as a target the line is pulled onto.
 *
 * ## Why the axis is logarithmic
 *
 * Ten to a hundred thousand is four decades. On a linear axis the first three
 * are a smudge at the left edge, which happens to be where the entire
 * phenomenon lives. Each decade gets equal room instead.
 */
export function LargeNumbersStage() {
  const copy = useT().labs.probability;
  const l = copy.largeNumbers;

  const [trials, setTrials] = useState<number>(SCALES[0]);
  const [guess, setGuess] = useState<string | null>(null);

  const result = useMemo(() => runTrials(SEED, trials), [trials]);
  const outcomes = useMemo(
    () => (trials <= WATCHABLE ? firstOutcomes(SEED, trials) : []),
    [trials],
  );

  // The window is sized from the run, so a wandering run is drawn wandering
  // rather than clipped into a tidy band.
  const spread = Math.max(widestDeviation(result.points), 0.02) * 1.15;
  const low = RIGHT_PROBABILITY - spread;
  const high = RIGHT_PROBABILITY + spread;

  // The run, as a stroked trace: for each sampled point a short horizontal
  // run at its own proportion, and a thin riser joining it to the point
  // before. Both strokes stay hairline, so what is drawn is the path of the
  // proportion rather than the area under it; every point the engine recorded
  // gets one of each, so nothing is smoothed away or dropped.
  const strokes = result.points.map((point, i) => {
    const previous = result.points[i - 1] ?? point;
    const x = logX(point.trials, trials);
    const from = logX(previous.trials, trials);
    const y = bandY(point.proportion, low, high);
    const prevY = bandY(previous.proportion, low, high);
    return {
      runLeft: from,
      runWidth: Math.max(x - from, 0.25),
      runTop: y,
      riserLeft: from,
      riserTop: Math.min(prevY, y),
      riserHeight: Math.abs(y - prevY),
    };
  });

  const answered = guess !== null;
  // Grouped by the dictionary's separator, never by the browser's locale.
  const count = (value: number) => grouped(value, l.thousands);

  // Every scale reached so far, read off this same run. Printing them in a
  // column is what makes the non-monotone part visible as numbers rather than
  // as a claim about the shape of a line.
  const reached = SCALES.filter((scale) => scale <= trials).map((scale) => {
    const point =
      result.points.find((candidate) => candidate.trials === scale) ?? result.final;
    return { scale, point };
  });

  const coach = [
    { q: l.coach.notEvenly.q, a: l.coach.notEvenly.a },
    { q: l.coach.dueForOne.q, a: l.coach.dueForOne.a },
    { q: l.coach.howMany.q, a: l.coach.howMany.a },
  ];

  return (
    <>
      <Stage
        width="full"
        caption={l.caption}
        announcement={l.announce(count(trials), result.final.proportion.toFixed(4))}
        viewport={
          <div className="space-y-3">
            <div
              role="img"
              aria-label={l.chartLabel(
                count(trials),
                result.final.proportion.toFixed(4),
                RIGHT_PROBABILITY.toFixed(4),
              )}
              className="rounded border border-line/10 bg-ink-950 p-4"
            >
              <div className="relative aspect-[16/7] w-full">
                {/* The theoretical probability: one flat rule, drawn behind
                    the run. It is not a target the line is pulled towards, it
                    is the number the run is being compared against. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 h-px bg-accent/70"
                  style={{ top: `${bandY(RIGHT_PROBABILITY, low, high)}%` }}
                />
                {strokes.map((stroke, i) => (
                  <span key={i}>
                    {stroke.riserHeight > 0 && (
                      <span
                        aria-hidden
                        className="absolute w-px bg-fg"
                        style={{
                          left: `${stroke.riserLeft}%`,
                          top: `${stroke.riserTop}%`,
                          height: `${stroke.riserHeight}%`,
                        }}
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute h-px bg-fg"
                      style={{
                        left: `${stroke.runLeft}%`,
                        width: `${stroke.runWidth}%`,
                        top: `${stroke.runTop}%`,
                      }}
                    />
                  </span>
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[0.6rem] tabular-nums text-fg-faint">
                <span>{l.axisStart}</span>
                <span>{l.axisEnd(count(trials))}</span>
              </div>
            </div>

            {/* Small runs can still be watched one outcome at a time. */}
            {outcomes.length > 0 && (
              <div className="rounded border border-line/10 bg-ink-950 p-4">
                <p className="mb-2 text-caption text-fg-faint">{l.outcomesLabel(outcomes.length)}</p>
                <ul className="flex flex-wrap gap-1">
                  {outcomes.map((right, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex size-5 items-center justify-center rounded border font-mono text-[0.6rem]",
                        right
                          ? "border-accent/40 bg-accent/10 text-accent"
                          : "border-line/20 bg-ink-900 text-fg-muted",
                      )}
                    >
                      <span className="sr-only">{l.outcomeLabel(i + 1, right ? l.right : l.left)}</span>
                      <span aria-hidden>{right ? l.rightMark : l.leftMark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* The same run, read at each scale it has passed through. */}
            {answered && (
              <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-4">
                <table className="w-full border-collapse text-caption">
                  <caption className="sr-only">{l.tableCaption}</caption>
                  <thead>
                    <tr className="text-fg-faint">
                      <th scope="col" className="py-1 pr-3 text-left font-normal">
                        {l.trialsColumn}
                      </th>
                      <th scope="col" className="py-1 pr-3 text-right font-normal">
                        {l.theoreticalColumn}
                      </th>
                      <th scope="col" className="py-1 pr-3 text-right font-normal">
                        {l.observedColumn}
                      </th>
                      <th scope="col" className="py-1 text-right font-normal">
                        {l.deviationColumn}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reached.map(({ scale, point }) => (
                      <tr key={scale} className="border-t border-line/10">
                        <th
                          scope="row"
                          className="py-1 pr-3 text-left font-mono font-normal tabular-nums text-fg-muted"
                        >
                          {count(scale)}
                        </th>
                        <td className="py-1 pr-3 text-right font-mono tabular-nums text-accent">
                          {RIGHT_PROBABILITY.toFixed(4)}
                        </td>
                        <td className="py-1 pr-3 text-right font-mono tabular-nums text-fg">
                          {point.proportion.toFixed(4)}
                        </td>
                        <td className="py-1 text-right font-mono tabular-nums text-fg-muted">
                          {point.deviation.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-caption text-fg-faint">{l.tableNote}</p>
              </div>
            )}
          </div>
        }
        readout={
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-body-sm text-fg-muted">{l.reading(count(trials))}</p>
            {answered && (
              <Explain
                what={l.explainWhat}
                why={l.explainWhy}
                maths={l.explainMaths}
                copy={copy.explain}
              />
            )}
          </div>
        }
        primary={
          <div className="space-y-4">
            <Prediction
              question={l.predictQuestion}
              options={[
                { value: "settles", label: l.predict.settles },
                { value: "swings", label: l.predict.swings },
                { value: "exact", label: l.predict.exact },
              ]}
              chosen={guess}
              onChoose={setGuess}
              answer={l.predictAnswer}
              matched={guess === null ? undefined : guess === "settles"}
              copy={copy.prediction}
            />

            <div className="space-y-2">
              <p className="text-caption text-fg-faint">{l.scaleLabel}</p>
              <div className="grid grid-cols-3 gap-2">
                {SCALES.map((scale) => (
                  <Button
                    key={scale}
                    variant={scale === trials ? "primary" : "secondary"}
                    onClick={() => setTrials(scale)}
                    aria-pressed={scale === trials}
                    className="min-h-11 justify-center"
                  >
                    {count(scale)}
                  </Button>
                ))}
              </div>
              <p className="text-caption text-fg-muted">
                {trials <= WATCHABLE ? l.watchHint : l.acceleratedHint}
              </p>
            </div>
          </div>
        }
        figures={
          <>
            <Figure
              label={l.theoreticalFigure}
              value={RIGHT_PROBABILITY.toFixed(4)}
              tone="accent"
              hint={l.theoreticalHint}
            />
            <Figure label={l.observedFigure} value={result.final.proportion.toFixed(4)} />
            <Figure
              label={l.deviationFigure}
              value={result.final.deviation.toFixed(4)}
              hint={l.deviationHint}
            />
            <Figure label={l.trialsFigure} value={count(trials)} />
          </>
        }
      />
      <Coach label={l.coachLabel} questions={coach} />
    </>
  );
}
