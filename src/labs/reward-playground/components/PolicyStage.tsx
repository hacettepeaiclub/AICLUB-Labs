import { useState, type KeyboardEvent } from "react";
import { Figure, Stage } from "@/components/lab";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { createQ, greedyPolicy, rolloutGreedy, valueMap } from "../engine";
import { ARROWS, cellActions, isGridKey, moveCursor } from "../view";
import { TILE, colOf, rowOf } from "../world";
import type { TrainingRun } from "../useTrainingRun";
import { RoomGrid } from "./RoomGrid";

export interface PolicyStageProps {
  run: TrainingRun;
}

/** An all-zero table: what the policy looked like before a single episode. */
const UNTRAINED = createQ();

/**
 * Section 3 — the policy, and where it comes from.
 *
 * Two rooms side by side: the same map before any training and as it stands
 * now. The left one is not a mock-up — it is `greedyPolicy` over a table of
 * zeros, which is genuinely what the agent believed at episode zero, arrows
 * and all. Ties break towards "up", so an untrained room really does point
 * uniformly upward, and that uniformity is the honest picture of knowing
 * nothing rather than a placeholder for it.
 *
 * ## What an arrow is, exactly
 *
 * The action the greedy policy selects in that square — `argmax_a Q(s,a)` —
 * and not a Q-value. The Q-values are the four numbers in the inspector, and
 * the arrow is what happens when you take the largest of them. Keeping those
 * two ideas apart is the whole job of this section, so the copy never calls an
 * arrow a value and the inspector always shows all four numbers, including the
 * three that lost.
 */
export function PolicyStage({ run }: PolicyStageProps) {
  const copy = useT().labs["reward-playground"];
  const policy = copy.policy;

  const [cell, setCell] = useState(TILE);

  const now = greedyPolicy(run.q);
  const values = valueMap(run.q);
  const actions = cellActions(run.q, cell);
  const best = actions.find((entry) => entry.best);
  const route = rolloutGreedy(run.q);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isGridKey(event.key)) return;
    event.preventDefault();
    setCell(moveCursor(cell, event.key));
  };

  return (
    <Stage
      width="full"
      caption={policy.caption}
      viewport={
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-overline uppercase text-fg-faint">{policy.beforeTitle}</p>
              <RoomGrid
                agent={route.path[0] ?? 0}
                policy={greedyPolicy(UNTRAINED)}
                label={policy.beforeLabel}
              />
            </div>
            <div>
              <p className="mb-2 text-overline uppercase text-fg-faint">
                {policy.afterTitle(run.episode)}
              </p>
              {/* Selectable: this is the map the inspector reads from. */}
              <div onKeyDown={onKeyDown}>
                <RoomGrid
                  agent={route.path[route.path.length - 1] ?? 0}
                  path={route.path}
                  policy={now}
                  values={values}
                  selected={cell}
                  onSelect={setCell}
                  label={policy.afterLabel(run.episode)}
                />
              </div>
            </div>
          </div>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-overline uppercase text-fg-faint">
            {copy.learn.selectedTitle(rowOf(cell) + 1, colOf(cell) + 1)}
          </p>
          <ul className="mt-3 space-y-2">
            {actions.map((entry) => (
              <li key={entry.action} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded font-mono text-body-sm",
                    entry.best ? "bg-accent-fill text-accent-fg" : "bg-ink-700 text-fg-muted",
                  )}
                >
                  {ARROWS[entry.action]}
                </span>
                <span className="w-20 shrink-0 text-caption text-fg-muted">
                  {copy.learn.actions[entry.action]}
                </span>
                <span className="flex-1 text-right font-mono text-body-sm tabular-nums text-fg">
                  {formatNumber(entry.value, 2)}
                </span>
                {/* Named, not just tinted: the winner is never colour alone. */}
                {entry.best && (
                  <span className="shrink-0 text-overline uppercase text-accent">
                    {copy.learn.bestAction}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-body-sm text-fg-muted">
            {policy.selects(
              rowOf(cell) + 1,
              colOf(cell) + 1,
              best ? copy.learn.actions[best.action] : copy.learn.noAction,
              formatNumber(best?.value ?? 0, 2),
            )}
          </p>
        </div>
      }
      primary={
        <div className="space-y-2">
          <p className="text-caption font-medium text-fg-muted">{policy.pickLabel}</p>
          <p className="text-caption text-fg-faint">{policy.pickHint}</p>
        </div>
      }
      figures={
        <>
          <Figure label={policy.episodeLabel} value={String(run.episode)} />
          <Figure
            label={policy.routeLabel}
            value={route.reachedGoal ? String(route.steps) : "—"}
            tone="accent"
            hint={route.reachedGoal ? policy.routeHint : policy.routeNone}
          />
          <Figure
            label={policy.valueLabel}
            value={formatNumber(values[cell] ?? 0, 2)}
            hint={policy.valueHint}
          />
        </>
      }
    />
  );
}
