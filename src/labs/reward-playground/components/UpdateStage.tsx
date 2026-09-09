import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { colOf, rowOf } from "../world";
import { rewardParts } from "../view";
import type { TrainingRun } from "../useTrainingRun";

export interface UpdateStageProps {
  run: TrainingRun;
  tileReward: number;
}

/**
 * Section 4 — the one update that just happened, term by term.
 *
 * The formula arrives only after every quantity in it has a value on screen
 * that came from somewhere the visitor watched. `run.last` is a real
 * `StepRecord`: the state the agent was in, the action it picked, whether that
 * pick was exploration, what the world paid, what the table already believed
 * and what it believes now.
 *
 * ## Nothing here is illustrative
 *
 * There are no example numbers in this component and there is no fallback set
 * of them. Before the first action it says so and shows nothing, because a
 * plausible-looking update that never happened is exactly the lie this lab is
 * built to avoid. `lab.test.ts` scans the source for any measured value
 * appearing as a literal.
 *
 * The arithmetic is not redone here either: `qBefore`, `bootstrap`, `target`
 * and `tdError` are all carried on the record the learner produced at the
 * moment of the update, and `learner.test.ts` checks they reconstruct
 * `Q + α·(target − Q)` exactly.
 */
export function UpdateStage({ run, tileReward }: UpdateStageProps) {
  const copy = useT().labs["reward-playground"];
  const update = copy.update;
  const last = run.last;

  const terms = last
    ? [
        { key: "before", value: formatNumber(last.qBefore, 3), label: update.terms.before },
        { key: "reward", value: formatNumber(last.reward, 3), label: update.terms.reward },
        { key: "bootstrap", value: formatNumber(last.bootstrap, 3), label: update.terms.bootstrap },
        { key: "target", value: formatNumber(last.target, 3), label: update.terms.target },
        { key: "error", value: formatNumber(last.tdError, 3), label: update.terms.error },
        { key: "after", value: formatNumber(last.qAfter, 3), label: update.terms.after },
      ]
    : [];

  return (
    <Stage
      width="full"
      caption={update.caption}
      viewport={
        <div className="space-y-3">
          {!last ? (
            <div className="rounded border border-line/10 bg-ink-950 p-6">
              <p className="text-body-sm text-fg-muted">{update.nothingYet}</p>
            </div>
          ) : (
            <>
              {/* What happened, as a sentence, before any algebra. */}
              <div className="rounded border border-line/10 bg-ink-950 p-4">
                <p className="text-overline uppercase text-fg-faint">{update.whatHappened}</p>
                <p className="mt-2 text-body-sm text-fg">
                  {update.sentence(
                    rowOf(last.state) + 1,
                    colOf(last.state) + 1,
                    copy.learn.actions[last.action],
                    last.exploring ? update.choice.explored : update.choice.exploited,
                    last.blocked
                      ? update.landed.wall
                      : update.landed.moved(rowOf(last.next) + 1, colOf(last.next) + 1),
                    formatNumber(last.reward, 1),
                  )}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {rewardParts(last.state, last.next, tileReward).map((part) => (
                    <li
                      key={part.kind}
                      className="font-mono text-caption tabular-nums text-fg-muted"
                    >
                      <span className={part.amount > 0 ? "text-signal-green" : "text-fg"}>
                        {formatNumber(part.amount, 1)}
                      </span>{" "}
                      {copy.world.rewardKind[part.kind]}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Belief, evidence, new belief. */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: update.panels.belief,
                    body: update.panels.beliefBody,
                    value: last.qBefore,
                  },
                  {
                    title: update.panels.evidence,
                    body: update.panels.evidenceBody,
                    value: last.target,
                  },
                  {
                    title: update.panels.updated,
                    body: update.panels.updatedBody,
                    value: last.qAfter,
                  },
                ].map((panel, i) => (
                  <div key={panel.title} className="rounded border border-line/10 bg-ink-950 p-4">
                    <p className="text-overline uppercase text-fg-faint">{panel.title}</p>
                    <p
                      className={cn(
                        "mt-1 font-mono tabular-nums",
                        i === 2 ? "text-accent" : "text-fg",
                      )}
                    >
                      {formatNumber(panel.value, 3)}
                    </p>
                    <p className="mt-2 text-caption text-fg-muted">{panel.body}</p>
                  </div>
                ))}
              </div>

              {/* The formula last, once every term above has a number. */}
              <div className="overflow-x-auto rounded border border-line/10 bg-ink-950 p-4">
                <p className="text-overline uppercase text-fg-faint">{update.formulaTitle}</p>
                <p className="mt-2 whitespace-nowrap font-mono text-body-sm text-fg">
                  Q(s,a) ← Q(s,a) + α · [ r + γ · max Q(s′,a′) − Q(s,a) ]
                </p>
                <table className="mt-3 w-full border-collapse text-body-sm">
                  <caption className="sr-only">{update.tableCaption}</caption>
                  <tbody>
                    {terms.map((term) => (
                      <tr key={term.key} className="border-t border-line/10">
                        <td className="py-1.5 pr-3 text-caption text-fg-muted">{term.label}</td>
                        <td className="py-1.5 text-right font-mono tabular-nums text-fg">
                          {term.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      }
      primary={
        <div className="space-y-3">
          <Button
            onClick={run.stepOnce}
            disabled={run.done}
            className="min-h-11 w-full justify-center"
          >
            {update.stepLabel}
          </Button>
          <p className="text-caption text-fg-faint">{update.stepHint}</p>
        </div>
      }
      figures={
        last ? (
          <>
            <Figure
              label={update.errorLabel}
              value={formatNumber(last.tdError, 2)}
              tone="accent"
              hint={update.errorHint}
            />
            <Figure
              label={update.movedLabel}
              value={formatNumber(last.qAfter - last.qBefore, 3)}
              hint={update.movedHint}
            />
            <Figure
              label={update.epsilonLabel}
              value={formatNumber(last.epsilon, 2)}
              hint={last.exploring ? update.choice.explored : update.choice.exploited}
            />
          </>
        ) : undefined
      }
    />
  );
}
