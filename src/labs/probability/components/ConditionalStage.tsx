import { useState } from "react";
import { Figure, Stage } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { OUTCOMES, analyse, isBothBoys, satisfies, type ClueId } from "../engine/conditional";
import { percent, ratio } from "../view";
import { Coach } from "./Framing";
import { Prediction } from "./Prediction";

/**
 * Section 3 — four outcomes, and what a sentence does to them.
 *
 * The matrix is the argument. Four boxes, all equally likely, and a clue that
 * greys some of them out: the conditional probability is then just the share
 * of what is left, which is a thing you can count on screen rather than a
 * formula you have to accept.
 *
 * ## Why there are two clues and not one
 *
 * Because "1/3" is not the answer to "the two children problem" — it is the
 * answer to one precise version of it. Switching the picker to "the first is a
 * boy" leaves two boxes instead of three and the answer becomes 1/2, with
 * nothing else changed. That contrast is the section; a version with only the
 * first clue would teach a number instead of the idea.
 *
 * A third reading, where you meet one child at random and see a boy, also
 * gives 1/2 and is deliberately out of scope. The caption says so rather than
 * leaving the impression that these two exhaust the question.
 */
export function ConditionalStage() {
  const copy = useT().labs.probability;
  const c = copy.conditional;

  const [clue, setClue] = useState<ClueId>("atLeastOneBoy");
  const [guess, setGuess] = useState<"half" | "third" | "quarter" | null>(null);

  const analysis = analyse(clue);
  const other = analyse(clue === "atLeastOneBoy" ? "firstIsBoy" : "atLeastOneBoy");

  // The one number in the coach's answers is this analysis's own.
  const coach = [
    { q: c.coach.notHalf.q, a: c.coach.notHalf.a(percent(analyse("atLeastOneBoy").probability)) },
    { q: c.coach.twoWays.q, a: c.coach.twoWays.a },
    { q: c.coach.wording.q, a: c.coach.wording.a },
  ];

  return (
    <>
      <Stage
        width="full"
        caption={c.caption}
        announcement={c.announce(c.clue[clue], analysis.kept.length, percent(analysis.probability))}
        viewport={
          <div className="space-y-3">
            <div
              role="img"
              aria-label={c.matrixLabel(
                c.clue[clue],
                analysis.kept.map((o) => c.outcome[o.id as keyof typeof c.outcome]).join(", "),
                percent(analysis.probability),
              )}
              className="rounded border border-line/10 bg-ink-950 p-4"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {OUTCOMES.map((outcome) => {
                  const kept = satisfies(outcome, clue);
                  const both = isBothBoys(outcome);
                  return (
                    <div
                      key={outcome.id}
                      className={cn(
                        "relative rounded border p-3 text-center",
                        kept ? "border-line/20 bg-ink-900" : "border-line/10 bg-ink-950",
                        kept && both && "border-accent bg-accent/10",
                      )}
                    >
                      <p
                        className={cn(
                          "font-mono text-body",
                          kept ? "text-fg" : "text-fg-faint line-through",
                        )}
                      >
                        {c.outcome[outcome.id as keyof typeof c.outcome]}
                      </p>
                      {/* Struck through and labelled, so "ruled out" is not a
                        shade of grey anybody has to interpret. */}
                      <p className="mt-1 text-caption text-fg-faint">
                        {kept ? (both ? c.counts : c.possible) : c.ruledOut}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 font-mono text-body-sm text-fg">
                {c.fraction(
                  ratio(analysis.favourable, analysis.kept.length),
                  percent(analysis.probability),
                )}
              </p>
            </div>

            {/* The comparison, always on screen: one clue's answer means little
              without the other's beside it. */}
            <div className="rounded border border-line/10 bg-ink-950 p-4">
              <table className="w-full border-collapse text-body-sm">
                <caption className="sr-only">{c.compareCaption}</caption>
                <thead>
                  <tr className="text-overline uppercase text-fg-faint">
                    <th scope="col" className="py-1.5 text-left font-normal">
                      {c.clueHeader}
                    </th>
                    <th scope="col" className="py-1.5 text-right font-normal">
                      {c.leftHeader}
                    </th>
                    <th scope="col" className="py-1.5 text-right font-normal">
                      {c.answerHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[analysis, other].map((entry) => (
                    <tr
                      key={entry.clue}
                      className={cn(
                        "border-t border-line/10",
                        entry.clue === clue && "text-fg",
                        entry.clue !== clue && "text-fg-muted",
                      )}
                    >
                      <td className="py-2">
                        {entry.clue === clue && (
                          <span aria-hidden className="mr-1.5 text-accent">
                            ▸
                          </span>
                        )}
                        {c.clue[entry.clue]}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {entry.kept.map((o) => c.outcome[o.id as keyof typeof c.outcome]).join(" ")}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {percent(entry.probability)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
        readout={
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-body-sm text-fg-muted">{c.explain[clue]}</p>
          </div>
        }
        primary={
          <div className="space-y-4">
            <Prediction
              question={c.predictQuestion}
              options={[
                { value: "half" as const, label: c.predict.half },
                { value: "third" as const, label: c.predict.third },
                { value: "quarter" as const, label: c.predict.quarter },
              ]}
              chosen={guess}
              onChoose={setGuess}
              answer={c.predictAnswer(percent(analyse("atLeastOneBoy").probability))}
              matched={guess === null ? undefined : guess === "third"}
              copy={copy.prediction}
            />

            <Segmented
              label={c.clueLabel}
              value={clue}
              options={[
                { value: "atLeastOneBoy" as const, label: c.clueShort.atLeastOneBoy },
                { value: "firstIsBoy" as const, label: c.clueShort.firstIsBoy },
              ]}
              onChange={setClue}
            />
            <p className="text-caption text-fg-muted">{c.clueHint}</p>
          </div>
        }
        figures={
          <>
            <Figure label={c.keptFigure} value={String(analysis.kept.length)} hint={c.keptHint} />
            <Figure
              label={c.bothFigure}
              value={ratio(analysis.favourable, analysis.kept.length)}
              hint={c.bothHint}
            />
            <Figure label={c.answerFigure} value={percent(analysis.probability)} tone="accent" />
          </>
        }
      />
      <Coach label={c.coachLabel} questions={coach} />
    </>
  );
}
