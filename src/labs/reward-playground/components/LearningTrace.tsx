import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ControlPanel, Figure, FigureRow, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { GOAL, TILE } from "../world";
import type { Training } from "../engine";
import {
  ARROWS,
  cellActions,
  checkpointsAreFrontLoaded,
  isGridKey,
  moveCursor,
  routeBlindSpots,
  valueCells,
} from "../view";

export interface LearningTraceProps {
  training: Training;
}

/**
 * Section 2, bound live to whatever the reward slider is set to.
 *
 * Everything here is read out of `training.snapshots`, which are the real
 * Q-tables the algorithm held at each checkpoint. The scrubber selects one;
 * the map, the arrows and the four numbers of the selected cell are all
 * derived from it. Nothing is stored, interpolated or smoothed, so what the
 * map shows at checkpoint *k* is what the robot actually knew after that many
 * episodes — including the parts it got wrong.
 *
 * The checkpoints are not evenly spaced. In this world the first cell turns
 * positive around episode twelve and the whole room has a value by about
 * forty, so an evenly spaced scrubber would hide the entire story in the first
 * five percent of its travel.
 */
export function LearningTrace({ training }: LearningTraceProps) {
  const t = useT();
  const copy = t.labs["reward-playground"].learn;

  const snapshots = training.snapshots;
  const [index, setIndex] = useState(snapshots.length - 1);
  const [cell, setCell] = useState(TILE);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // A new reward means a new training run: go back to the finished table
  // rather than leaving the scrubber pointing at a checkpoint of the old one.
  useEffect(() => {
    setIndex(snapshots.length - 1);
  }, [snapshots]);

  const at = Math.min(index, snapshots.length - 1);
  const snapshot = snapshots[at];
  if (!snapshot) return null;

  const cells = valueCells(snapshot.q);
  const actions = cellActions(snapshot.q, cell);
  const best = actions.find((a) => a.best);
  const blindSpots = routeBlindSpots(snapshot.q);
  const selected = cells[cell];

  const focusCell = (next: number) => {
    setCell(next);
    cellRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isGridKey(event.key)) return;
    event.preventDefault();
    focusCell(moveCursor(cell, event.key));
  };

  return (
    <div className="space-y-6">
      <ControlPanel>
        <LabSlider
          label={copy.scrubber}
          value={at}
          min={0}
          max={Math.max(1, snapshots.length - 1)}
          onChange={setIndex}
          format={() => copy.episode(snapshot.episode)}
          valueText={() => copy.scrubberValue(snapshot.episode, training.episodes)}
          className="flex-1"
        />
      </ControlPanel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* The map. Real buttons, so the numbers are in the document rather
            than in a picture of one. */}
        <div
          role="grid"
          aria-label={copy.mapLabel(snapshot.episode)}
          onKeyDown={handleKeyDown}
          className="grid grid-cols-6 gap-1 rounded-card border border-line/10 bg-ink-900 p-3"
        >
          {cells.map((view) => {
            const isWallCell = view.kind === "wall";
            const label = isWallCell
              ? copy.wallCell(view.row + 1, view.col + 1)
              : copy.cellLabel(
                  view.row + 1,
                  view.col + 1,
                  formatNumber(view.value, 2),
                  view.action === null ? copy.noAction : copy.actions[view.action],
                );
            return (
              <button
                key={view.index}
                ref={(el) => {
                  cellRefs.current[view.index] = el;
                }}
                type="button"
                role="gridcell"
                aria-selected={view.index === cell}
                aria-label={label}
                tabIndex={view.index === cell ? 0 : -1}
                disabled={isWallCell}
                onClick={() => focusCell(view.index)}
                className={cn(
                  "relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
                  isWallCell ? "cursor-default bg-fg-faint/50" : "bg-line/[0.04]",
                  view.index === cell && "ring-2 ring-accent",
                )}
              >
                {!isWallCell && (
                  <>
                    {/* Tint is a third channel behind the arrow and the number,
                        never the only one. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-sm",
                        view.positive ? "bg-signal-green" : "bg-signal-rose",
                      )}
                      style={{ opacity: view.intensity * 0.28 }}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "relative font-mono text-body-sm leading-none",
                        view.index === GOAL ? "text-signal-green" : "text-fg",
                      )}
                    >
                      {view.index === GOAL ? "⌂" : view.action === null ? "" : ARROWS[view.action]}
                    </span>
                    <span
                      aria-hidden
                      className="relative mt-1 font-mono text-overline tabular-nums text-fg-muted"
                    >
                      {formatNumber(view.value, 1)}
                    </span>
                    {view.index === TILE && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-sm ring-1 ring-signal-amber/60"
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* One cell, four numbers, and the chain that produced them. */}
        <div className="space-y-4">
          <div className="card-surface p-5">
            <p className="text-overline uppercase text-fg-faint">
              {copy.selectedTitle((selected?.row ?? 0) + 1, (selected?.col ?? 0) + 1)}
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
                    {copy.actions[entry.action]}
                  </span>
                  <span className="flex-1 text-right font-mono text-body-sm tabular-nums text-fg">
                    {formatNumber(entry.value, 2)}
                  </span>
                  {/* Not colour alone: the best action is also named. */}
                  {entry.best && (
                    <span className="shrink-0 text-overline uppercase text-accent">
                      {copy.bestAction}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body-sm text-fg-muted">
              {copy.chain(
                (selected?.row ?? 0) + 1,
                (selected?.col ?? 0) + 1,
                best ? copy.actions[best.action] : copy.noAction,
                formatNumber(best?.value ?? 0, 2),
              )}
            </p>
          </div>

          <FigureRow>
            <Figure label={copy.episodeLabel} value={String(snapshot.episode)} />
            <Figure
              label={copy.unexploredLabel}
              value={String(blindSpots)}
              hint={copy.unexploredHint}
            />
          </FigureRow>
        </div>
      </div>

      <div className="max-w-prose space-y-3">
        <p className="text-body-sm text-fg-muted">{copy.propagation}</p>
        {/* The formula arrives last, once every term in it has been watched. */}
        <div className="rounded-card border border-line/10 bg-ink-900 p-4">
          <p className="text-overline uppercase text-fg-faint">{copy.formulaTitle}</p>
          <p className="mt-2 overflow-x-auto whitespace-nowrap font-mono text-body-sm text-fg">
            Q(s,a) ← Q(s,a) + α · [ r + γ · max Q(s′,a′) − Q(s,a) ]
          </p>
          <p className="mt-2 text-body-sm text-fg-muted">{copy.formulaNote}</p>
        </div>
        <p className="text-body-sm text-fg-faint">{copy.honesty}</p>
      </div>

      {checkpointsAreFrontLoaded(snapshots) ? null : (
        // Never expected to render: the schedule is front-loaded by
        // construction. Kept as a visible failure rather than a silent one.
        <p className="text-body-sm text-signal-rose">{copy.scheduleWarning}</p>
      )}
    </div>
  );
}
