import { useEffect, useMemo, useState } from "react";
import { Figure, LabSlider, Stage } from "@/components/lab";
import { Badge, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { greedyPolicy } from "../engine";
import {
  CHALLENGES,
  LEVER_RANGE,
  challengeById,
  judge,
  type ChallengeId,
  type Settings,
} from "../challenge";
import { RoomGrid } from "./RoomGrid";

/** Slider tracks are integers; each lever divides down to its own step. */
const TRACK: Record<string, number> = { tileReward: 10, epsilon: 100 };

/**
 * The challenge — three puzzles, one lever each, judged by what the agent does.
 *
 * Every verdict comes from a real training run at the visitor's setting. A
 * puzzle cannot be passed by putting a slider in a blessed position: it is
 * passed when the agent genuinely behaves the way the puzzle asks, read out of
 * `rolloutGreedy` and the episodes the run actually lived through.
 *
 * `challenge.test.ts` measures all three against the engine — that each starts
 * unsolved, that each is solvable, and that the solutions form one contiguous
 * band rather than a lucky value. Solved state is carried by a tick and a word
 * as well as a colour.
 */
export function ChallengeStage() {
  const t = useT();
  const challenge = t.labs["reward-playground"].challenge;

  const [id, setId] = useState<ChallengeId>("cross");
  const [beaten, setBeaten] = useState<Partial<Record<ChallengeId, boolean>>>({});
  const [levers, setLevers] = useState<Partial<Record<ChallengeId, number>>>({});

  const spec = challengeById(id);
  const range = LEVER_RANGE[spec.lever];
  const scale = TRACK[spec.lever] ?? 100;
  const value = levers[id] ?? spec.start[spec.lever];

  const settings: Settings = useMemo(() => ({ ...spec.start, [spec.lever]: value }), [spec, value]);
  const attempt = useMemo(() => judge(spec, settings), [spec, settings]);

  useEffect(() => {
    if (attempt.solved) setBeaten((was) => (was[id] ? was : { ...was, [id]: true }));
  }, [attempt.solved, id]);

  const solvedCount = CHALLENGES.filter((candidate) => beaten[candidate.id]).length;
  const puzzle = challenge.puzzles[id];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented
          label={challenge.puzzleLabel}
          value={id}
          options={CHALLENGES.map((candidate) => ({
            value: candidate.id,
            // A tick as well as a fill: solved is not carried by colour alone.
            label: `${beaten[candidate.id] ? "✓ " : ""}${challenge.puzzles[candidate.id].title}`,
          }))}
          onChange={(next) => setId(next)}
        />
        <Badge dotClassName={solvedCount === CHALLENGES.length ? "bg-signal-green" : "bg-fg-faint"}>
          {t.common.solved(solvedCount, CHALLENGES.length)}
        </Badge>
      </div>

      <div className="max-w-prose">
        <p className="text-body-sm text-fg-muted">{puzzle.brief}</p>
      </div>

      <Stage
        width="full"
        caption={puzzle.lesson}
        announcement={
          attempt.solved
            ? challenge.announceSolved(puzzle.title)
            : challenge.announceAttempt(challenge.behaviour[attempt.behaviour])
        }
        viewport={
          <RoomGrid
            agent={attempt.rollout.path[attempt.rollout.path.length - 1] ?? 0}
            path={attempt.rollout.path}
            // The table this attempt produced, so the route and the arrows
            // are provably the same run.
            policy={greedyPolicy(attempt.q)}
            label={challenge.mapLabel(
              challenge.behaviour[attempt.behaviour],
              attempt.rollout.steps,
            )}
          />
        }
        readout={
          <div
            className={cn(
              "rounded border px-4 py-3",
              attempt.solved
                ? "border-signal-green/40 bg-signal-green/10"
                : "border-line/10 bg-ink-950",
            )}
          >
            <p className="text-body-sm text-fg">
              {attempt.solved && (
                <span aria-hidden className="mr-1.5">
                  ✓
                </span>
              )}
              {attempt.solved
                ? challenge.verdict.solved
                : attempt.untouched
                  ? challenge.verdict.untouched
                  : challenge.verdict.notYet(challenge.behaviour[attempt.behaviour])}
            </p>
          </div>
        }
        primary={
          <div className="space-y-3">
            <LabSlider
              label={challenge.levers[spec.lever]}
              value={Math.round(value * scale)}
              min={Math.round(range.min * scale)}
              max={Math.round(range.max * scale)}
              onChange={(next) => setLevers((was) => ({ ...was, [id]: next / scale }))}
              format={() => formatNumber(value, spec.lever === "tileReward" ? 1 : 2)}
              valueText={() =>
                challenge.leverValue(
                  challenge.levers[spec.lever],
                  formatNumber(value, spec.lever === "tileReward" ? 1 : 2),
                )
              }
            />
            <p className="text-caption text-fg-muted">{challenge.leverHint[spec.lever]}</p>
          </div>
        }
        figures={
          <>
            <Figure
              label={challenge.behaviourLabel}
              value={challenge.behaviourShort[attempt.behaviour]}
              tone={attempt.solved ? "accent" : "default"}
            />
            <Figure
              label={challenge.stepsLabel}
              value={attempt.rollout.reachedGoal ? String(attempt.rollout.steps) : "—"}
            />
            <Figure
              label={challenge.successLabel}
              value={`${Math.round(attempt.successRate * 100)}%`}
              hint={challenge.successHint}
            />
          </>
        }
      />
    </div>
  );
}
