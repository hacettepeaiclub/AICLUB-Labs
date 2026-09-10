import { Figure, LabSlider, Stage } from "@/components/lab";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { SMOOTHING_WINDOW, curve, smooth } from "../view";
import type { RunSettings, TrainingRun } from "../useTrainingRun";

export interface RulesStageProps {
  run: TrainingRun;
  settings: RunSettings;
  onChange: (next: RunSettings) => void;
  onRestore: () => void;
  changed: boolean;
}

/**
 * Section 5 — the three parameters, and what changing them actually does.
 *
 * Each slider retrains from episode one, because there is no such thing as
 * changing α halfway through a run and asking what it did. The curve below is
 * the reward per episode of the run currently loaded, so the effect a
 * parameter has is read off a real learning curve rather than described.
 *
 * ## What this section is careful not to promise
 *
 * This room is small. Sweeping all three parameters against the engine showed
 * that the *final* route is nearly the same whatever they are set to — the
 * agent solves twenty-seven squares from almost anywhere. What genuinely
 * changes is how quickly the curve settles, how noisy it is on the way, and,
 * for exploration held high, whether it settles at all. So that is what the
 * copy claims and what the figures measure. Promising that α transforms the
 * policy here would be a claim the visitor could disprove in ten seconds.
 */
export function RulesStage({ run, settings, onChange, onRestore, changed }: RulesStageProps) {
  const copy = useT().labs["reward-playground"];
  const rules = copy.rules;

  const rewards = run.history.map((episode) => episode.totalReward);
  const trend = curve(smooth(rewards, SMOOTHING_WINDOW));
  const recent = run.history.slice(-50);
  const successRate = recent.length
    ? recent.filter((episode) => episode.reachedGoal).length / recent.length
    : 0;
  const meanSteps = recent.length
    ? recent.reduce((sum, episode) => sum + episode.steps, 0) / recent.length
    : 0;
  /** First episode after which twenty in a row all reached the door. */
  const settled = (() => {
    for (let i = 0; i + 20 <= run.history.length; i++) {
      if (run.history.slice(i, i + 20).every((episode) => episode.reachedGoal)) return i + 1;
    }
    return null;
  })();

  const set = (patch: Partial<RunSettings>) => onChange({ ...settings, ...patch });

  return (
    <Stage
      width="full"
      // Inverted: 738px of dials beside a 77px viewport, so the dead column
      // was on the left, under the thing being explained. The dials read as a
      // row under it instead.
      controls="stack"
      caption={rules.caption}
      viewport={
        <div className="rounded border border-line/10 bg-ink-950 p-4">
          <p className="text-overline uppercase text-fg-faint">{rules.curveTitle}</p>
          {trend.length < 2 ? (
            <p className="mt-2 text-body-sm text-fg-muted">{rules.curveEmpty}</p>
          ) : (
            <>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                role="img"
                aria-label={rules.curveLabel(
                  run.history.length,
                  formatNumber(rewards[rewards.length - 1] ?? 0, 1),
                  settled === null ? rules.notSettled : String(settled),
                )}
                className="mt-2 h-32 w-full"
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
              <p className="mt-2 text-caption text-fg-faint">{rules.curveHint}</p>
            </>
          )}
        </div>
      }
      primary={
        <div className="space-y-4">
          <div>
            <LabSlider
              label={rules.alpha.label}
              value={Math.round(settings.alpha * 100)}
              min={5}
              max={100}
              onChange={(value) => set({ alpha: value / 100 })}
              format={() => formatNumber(settings.alpha, 2)}
              valueText={() => rules.alpha.valueText(formatNumber(settings.alpha, 2))}
            />
            <p className="mt-1 text-caption text-fg-muted">{rules.alpha.what}</p>
          </div>
          <div>
            <LabSlider
              label={rules.gamma.label}
              value={Math.round(settings.gamma * 100)}
              min={30}
              max={99}
              onChange={(value) => set({ gamma: value / 100 })}
              format={() => formatNumber(settings.gamma, 2)}
              valueText={() => rules.gamma.valueText(formatNumber(settings.gamma, 2))}
            />
            <p className="mt-1 text-caption text-fg-muted">{rules.gamma.what}</p>
          </div>
          <div>
            <LabSlider
              label={rules.epsilon.label}
              value={Math.round(settings.epsilonStart * 100)}
              min={1}
              max={100}
              onChange={(value) => set({ epsilonStart: value / 100 })}
              format={() => formatNumber(settings.epsilonStart, 2)}
              valueText={() => rules.epsilon.valueText(formatNumber(settings.epsilonStart, 2))}
            />
            <p className="mt-1 text-caption text-fg-muted">{rules.epsilon.what}</p>
          </div>
          {changed && (
            <Button variant="ghost" onClick={onRestore} className="min-h-11 w-full justify-center">
              {rules.restore}
            </Button>
          )}
        </div>
      }
      figures={
        <>
          <Figure
            label={rules.settledLabel}
            value={settled === null ? rules.notSettled : String(settled)}
            tone="accent"
            hint={rules.settledHint}
          />
          <Figure
            label={rules.successLabel}
            value={`${Math.round(successRate * 100)}%`}
            hint={rules.successHint}
          />
          <Figure
            label={rules.stepsLabel}
            value={recent.length ? formatNumber(meanSteps, 1) : "—"}
            hint={rules.stepsHint}
          />
        </>
      }
      secondaryLabel={rules.scopeLabel}
      secondary={<p className="text-body-sm text-fg-muted">{rules.scope}</p>}
    />
  );
}
