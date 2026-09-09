import { useCallback, useMemo, useState } from "react";
import { LabRecap, LabSection, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { ALPHA, EPSILON_MIN, EPSILON_START, GAMMA } from "./engine";
import { DEFAULT_SLIDER, SLIDER_MAX, SLIDER_MIN, sliderToReward } from "./view";
import { WATCHABLE_EPISODES, useTrainingRun, type RunSettings } from "./useTrainingRun";
import { ChallengeStage } from "./components/ChallengeStage";
import { PolicyStage } from "./components/PolicyStage";
import { RulesStage } from "./components/RulesStage";
import { TrainStage } from "./components/TrainStage";
import { UpdateStage } from "./components/UpdateStage";
import { WorldStage } from "./components/WorldStage";

/**
 * Reward Playground.
 *
 * One idea: **the agent optimises what you reward, not what you meant.**
 *
 * ## The order
 *
 * A world before an algorithm (1): the visitor drives the agent by hand and
 * watches what each move costs, so "reward" is a thing that happened to them
 * before it is a term. Then the agent tries it itself, badly, and stops being
 * bad (2). Then what it built while doing that, and what a policy is as
 * distinct from the numbers it is read from (3). Then a single update, term by
 * term, from the run they just watched (4). Then the three dials (5). Then a
 * task (6).
 *
 * ## One run
 *
 * Sections 2, 3 and 4 share a single `useTrainingRun`. That is the whole
 * design: the arrows in section 3 move because the updates in section 4
 * happened, and both are the run the transport in section 2 is driving. Three
 * separate learners would have made the causal claim a coincidence.
 *
 * `learner.ts` is `engine.train()` taken one action at a time — proven
 * bit-identical in `learner.test.ts` — so what is watched here is not a
 * demonstration of the algorithm, it is the algorithm.
 */
export default function RewardPlayground() {
  const t = useT();
  const copy = t.labs["reward-playground"];

  const [slider, setSlider] = useState(DEFAULT_SLIDER);
  const tileReward = sliderToReward(slider);

  const [tuning, setTuning] = useState({
    alpha: ALPHA,
    gamma: GAMMA,
    epsilonStart: EPSILON_START,
  });

  const settings: RunSettings = useMemo(
    () => ({
      tileReward,
      alpha: tuning.alpha,
      gamma: tuning.gamma,
      epsilonStart: tuning.epsilonStart,
      epsilonMin: EPSILON_MIN,
      episodes: WATCHABLE_EPISODES,
    }),
    [tileReward, tuning],
  );

  const run = useTrainingRun(settings);

  const changed =
    tuning.alpha !== ALPHA || tuning.gamma !== GAMMA || tuning.epsilonStart !== EPSILON_START;

  const restore = useCallback(
    () => setTuning({ alpha: ALPHA, gamma: GAMMA, epsilonStart: EPSILON_START }),
    [],
  );

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — A world, and what it pays for. No learning yet, nothing named. */}
      <section aria-labelledby="reward-world-heading">
        <h2 id="reward-world-heading" className="sr-only">
          {copy.world.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{copy.world.question}</p>
        <WorldStage tileReward={tileReward} />

        <div className="mx-auto mt-6 max-w-[56rem]">
          <LabSlider
            label={copy.room.sliderLabel}
            value={slider}
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            onChange={setSlider}
            format={() => formatNumber(tileReward, 1)}
            valueText={() => copy.room.sliderValue(formatNumber(tileReward, 1))}
          />
          <p className="mt-2 text-body-sm text-fg-muted">{copy.world.sliderHint}</p>
        </div>
      </section>

      {/* 2 — It tries. This is the section the lab lives or dies on. */}
      <LabSection kicker={copy.train.kicker} title={copy.train.title} lede={copy.train.lede}>
        <TrainStage run={run} />
      </LabSection>

      {/* 3 — What it built while doing that. */}
      <LabSection kicker={copy.policy.kicker} title={copy.policy.title} lede={copy.policy.lede}>
        <PolicyStage run={run} />
      </LabSection>

      {/* 4 — One update, from the run above. */}
      <LabSection kicker={copy.update.kicker} title={copy.update.title} lede={copy.update.lede}>
        <UpdateStage run={run} tileReward={tileReward} />
      </LabSection>

      {/* 5 — The three dials. */}
      <LabSection kicker={copy.rules.kicker} title={copy.rules.title} lede={copy.rules.lede}>
        <RulesStage
          run={run}
          settings={settings}
          onChange={(next) =>
            setTuning({
              alpha: next.alpha,
              gamma: next.gamma,
              epsilonStart: next.epsilonStart,
            })
          }
          onRestore={restore}
          changed={changed}
        />
      </LabSection>

      {/* 6 — Now you set the reward. */}
      <LabSection
        kicker={copy.challenge.kicker}
        title={copy.challenge.title}
        lede={copy.challenge.lede}
      >
        <ChallengeStage />
        <p className="mt-8 max-w-prose text-body-sm text-fg-faint">{copy.learn.honesty}</p>
      </LabSection>

      <LabRecap lessons={copy.recap.lessons} footer={copy.recap.footer} />
    </div>
  );
}
