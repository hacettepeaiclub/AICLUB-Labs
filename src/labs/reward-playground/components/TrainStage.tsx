import { Figure, Stage, Transport } from "@/components/lab";
import { Button, Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { greedyPolicy } from "../engine";
import { SMOOTHING_WINDOW, curve, smooth } from "../view";
import { SPEEDS, type TrainingRun } from "../useTrainingRun";
import { RoomGrid } from "./RoomGrid";

export interface TrainStageProps {
  run: TrainingRun;
}

/**
 * Section 2 — the agent trying, failing, and gradually not failing.
 *
 * This is the one that has to earn the lab. Everything on screen is the live
 * learner: the agent is standing where the learner says it is standing, the
 * trail is the episode it is in the middle of, the arrows are the greedy
 * policy read out of the table as it stands this instant, and the curve is the
 * reward each episode actually collected.
 *
 * Nothing here is a recording. Pressing Run advances real Q-learning; the
 * route straightening out is the table changing underneath it. The proof that
 * this is the same run the rest of the lab talks about is in
 * `learner.test.ts`, which checks the live path against `train()` bit for bit.
 *
 * ## Why whole episodes
 *
 * The transport steps one *action*, but the run loop advances one *episode* a
 * tick. Watching a single action at 150 per second is a blur, and stopping
 * halfway through a route leaves the agent somewhere the policy map cannot
 * explain. Episodes are the unit the learning actually happens in.
 */
export function TrainStage({ run }: TrainStageProps) {
  const copy = useT().labs["reward-playground"];
  const train = copy.train;

  const rewards = run.history.map((episode) => episode.totalReward);
  const trend = curve(smooth(rewards, SMOOTHING_WINDOW));
  const recent = run.history.slice(-20);
  const successRate = recent.length
    ? recent.filter((episode) => episode.reachedGoal).length / recent.length
    : 0;
  const lastEpisode = run.history[run.history.length - 1];

  return (
    <Stage
      width="full"
      caption={train.caption}
      announcement={
        run.done
          ? train.announceDone(run.episodes)
          : train.announce(run.episode, formatNumber(run.episodeReward, 1))
      }
      viewport={
        <div className="space-y-3">
          <RoomGrid
            agent={run.state}
            path={run.path}
            policy={greedyPolicy(run.q)}
            label={train.mapLabel(run.episode, run.episodes)}
          />

          {/* The curve. Every point is one episode that was actually run. */}
          <div className="rounded border border-line/10 bg-ink-950 p-4">
            <p className="text-overline uppercase text-fg-faint">{train.curveTitle}</p>
            {trend.length < 2 ? (
              <p className="mt-2 text-body-sm text-fg-muted">{train.curveEmpty}</p>
            ) : (
              <>
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={train.curveLabel(
                    run.history.length,
                    formatNumber(rewards[0] ?? 0, 1),
                    formatNumber(rewards[rewards.length - 1] ?? 0, 1),
                  )}
                  className="mt-2 h-24 w-full"
                >
                  <polyline
                    points={trend.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={1.4}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-1 flex justify-between font-mono text-caption tabular-nums text-fg-faint">
                  <span>{train.episodeShort(1)}</span>
                  <span>{train.episodeShort(run.history.length)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      }
      readout={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-body-sm text-fg-muted">
            {lastEpisode
              ? train.lastEpisode(
                  lastEpisode.episode,
                  lastEpisode.steps,
                  formatNumber(lastEpisode.totalReward, 1),
                  lastEpisode.reachedGoal ? train.outcome.reached : train.outcome.ranOut,
                )
              : train.notStarted}
          </p>
        </div>
      }
      primary={
        <div className="space-y-3">
          <Transport
            running={run.running}
            onRun={run.toggleRun}
            onStep={run.stepOnce}
            onReset={run.reset}
            runLabel={train.runLabel}
            stepDisabled={run.done}
          />
          <Button
            variant="secondary"
            onClick={run.episodeOnce}
            disabled={run.done}
            className="min-h-11 w-full justify-center"
          >
            {train.oneEpisode}
          </Button>
        </div>
      }
      figures={
        <>
          <Figure
            label={train.episodeLabel}
            value={`${run.episode}`}
            tone="accent"
            hint={train.ofTotal(run.episodes)}
          />
          <Figure
            label={train.successLabel}
            value={`${Math.round(successRate * 100)}%`}
            hint={train.successHint(recent.length)}
          />
          <Figure label={train.stepsLabel} value={lastEpisode ? String(lastEpisode.steps) : "—"} />
          <Figure
            label={train.rewardLabel}
            value={lastEpisode ? formatNumber(lastEpisode.totalReward, 1) : "—"}
          />
        </>
      }
      secondaryLabel={train.speedLabel}
      secondary={
        <Segmented
          label={train.speedLabel}
          value={String(run.speed)}
          options={SPEEDS.map((speed) => ({ value: String(speed), label: String(speed) }))}
          onChange={(value) => {
            const speed = SPEEDS.find((candidate) => String(candidate) === value);
            if (speed) run.setSpeed(speed);
          }}
        />
      }
    />
  );
}
