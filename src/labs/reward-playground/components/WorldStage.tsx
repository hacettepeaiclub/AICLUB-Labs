import { useCallback, useState, type KeyboardEvent } from "react";
import { Figure, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { ACTIONS, GOAL, START, nextState, reward, type Action } from "../world";
import { rewardParts, type RewardPart } from "../view";
import { RoomGrid } from "./RoomGrid";

/** The four moves, laid out the way they point. `null` is the gap in the pad. */
const PAD: readonly (Action | null)[] = [null, 0, null, 2, 1, 3];

interface Move {
  readonly id: number;
  readonly action: Action;
  readonly from: number;
  readonly to: number;
  readonly parts: readonly RewardPart[];
  readonly total: number;
  readonly blocked: boolean;
  readonly arrived: boolean;
}

export interface WorldStageProps {
  tileReward: number;
}

/**
 * Section 1 — the room, moved by hand, with the consequences itemised.
 *
 * No learning happens here at all, and that is the point: before anything can
 * be said about how the agent works out what to do, the visitor has to know
 * what the world pays for. So they drive it themselves, one move at a time,
 * and every move prints what it cost and why.
 *
 * The ledger is the section's whole argument. A card listing "step: −0.5,
 * square: +2, door: +20" is a rulebook; the same three numbers appearing the
 * moment you walk into the thing that pays them is a consequence. Nothing is
 * listed before it has happened.
 *
 * Rewards come from `world.reward()` via `rewardParts`, which is checked in
 * `lab.test.ts` to add back up to exactly what the world charges — so the
 * itemisation cannot drift from the number the algorithm actually sees.
 */
export function WorldStage({ tileReward }: WorldStageProps) {
  const copy = useT().labs["reward-playground"];
  const world = copy.world;

  const [at, setAt] = useState(START);
  const [moves, setMoves] = useState<readonly Move[]>([]);
  const [total, setTotal] = useState(0);
  const [nextId, setNextId] = useState(1);

  const move = useCallback(
    (action: Action) => {
      setAt((from) => {
        if (from === GOAL) return from;
        const to = nextState(from, action);
        const parts = rewardParts(from, to, tileReward);
        const paid = reward(from, to, tileReward);
        setMoves((previous) =>
          [
            {
              id: nextId,
              action,
              from,
              to,
              parts,
              total: paid,
              blocked: to === from,
              arrived: to === GOAL,
            },
            ...previous,
          ].slice(0, 6),
        );
        setNextId((n) => n + 1);
        setTotal((sum) => sum + paid);
        return to;
      });
    },
    [nextId, tileReward],
  );

  const restart = () => {
    setAt(START);
    setMoves([]);
    setTotal(0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, Action> = {
      ArrowUp: 0,
      ArrowDown: 1,
      ArrowLeft: 2,
      ArrowRight: 3,
    };
    const action = map[event.key];
    if (action === undefined) return;
    event.preventDefault();
    move(action);
  };

  const latest = moves[0];
  const done = at === GOAL;
  const announcement = latest
    ? world.moveAnnounce(
        copy.learn.actions[latest.action],
        formatNumber(latest.total, 1),
        formatNumber(total, 1),
      )
    : "";

  return (
    <Stage
      width="full"
      caption={world.caption}
      announcement={announcement}
      viewport={
        <RoomGrid
          agent={at}
          path={undefined}
          label={world.mapLabel(moves.length, formatNumber(total, 1))}
        />
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-overline uppercase text-fg-faint">{world.ledgerTitle}</p>
          {moves.length === 0 ? (
            <p className="mt-2 text-body-sm text-fg-muted">{world.ledgerEmpty}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {moves.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-mono text-body-sm text-fg">
                    {copy.learn.actions[entry.action]}
                  </span>
                  <span aria-hidden className="text-fg-faint">
                    →
                  </span>
                  {/* The consequence in words, so the number is never the only
                      thing that says what happened. */}
                  <span className="text-body-sm text-fg-muted">
                    {entry.blocked
                      ? world.consequence.wall
                      : entry.arrived
                        ? world.consequence.door
                        : entry.parts.some((p) => p.kind === "tile")
                          ? world.consequence.square
                          : world.consequence.floor}
                  </span>
                  <span aria-hidden className="text-fg-faint">
                    →
                  </span>
                  <span className="flex flex-wrap items-baseline gap-1.5">
                    {entry.parts.map((part, i) => (
                      <span key={part.kind} className="font-mono text-body-sm tabular-nums">
                        {i > 0 && (
                          <span aria-hidden className="mr-1.5 text-fg-faint">
                            +
                          </span>
                        )}
                        <span
                          className={cn(
                            part.amount > 0 ? "text-signal-green" : "text-fg",
                            part.kind === "goal" && "font-semibold",
                          )}
                        >
                          {formatNumber(part.amount, 1)}
                        </span>
                        <span className="ml-1 text-caption text-fg-faint">
                          {world.rewardKind[part.kind]}
                        </span>
                      </span>
                    ))}
                    {entry.parts.length > 1 && (
                      <span className="font-mono text-body-sm tabular-nums text-fg">
                        = {formatNumber(entry.total, 1)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
      primary={
        <div className="space-y-3">
          <p className="text-caption font-medium text-fg-muted">{world.padLabel}</p>
          <div
            role="group"
            aria-label={world.padLabel}
            onKeyDown={onKeyDown}
            className="grid w-fit grid-cols-3 gap-1"
          >
            {PAD.map((action, i) =>
              action === null ? (
                <span key={i} aria-hidden />
              ) : (
                <Button
                  key={i}
                  variant="secondary"
                  onClick={() => move(action)}
                  disabled={done}
                  aria-label={copy.learn.actions[action]}
                  className="min-h-11 min-w-11 justify-center font-mono"
                >
                  {["↑", "↓", "←", "→"][action]}
                </Button>
              ),
            )}
          </div>
          <p className="text-caption text-fg-faint">{world.padHint}</p>
          {done && <p className="text-body-sm text-fg">{world.arrived}</p>}
          <Button variant="ghost" onClick={restart} className="min-h-11">
            {world.restart}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure label={world.movesLabel} value={String(moves.length ? nextId - 1 : 0)} />
          <Figure
            label={world.totalLabel}
            value={formatNumber(total, 1)}
            tone="accent"
            hint={world.totalHint}
          />
          <Figure
            label={world.squareLabel}
            value={formatNumber(tileReward, 1)}
            hint={world.squareHint}
          />
        </>
      }
      secondaryLabel={world.rulesLabel}
      secondary={
        <ul className="space-y-2 text-body-sm text-fg-muted">
          {ACTIONS.map((action) => (
            <li key={action} className="flex items-baseline justify-between gap-3">
              <span>{copy.learn.actions[action]}</span>
              <span className="font-mono tabular-nums text-fg">
                {formatNumber(reward(at, nextState(at, action), tileReward), 1)}
              </span>
            </li>
          ))}
          <li className="pt-1 text-caption text-fg-faint">{world.previewHint}</li>
        </ul>
      }
    />
  );
}
