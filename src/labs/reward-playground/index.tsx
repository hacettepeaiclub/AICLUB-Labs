import { useMemo, useState } from "react";
import { ControlPanel, LabRecap, LabSection, LabSlider } from "@/components/lab";
import { useT } from "@/i18n";
import { formatNumber } from "@/lib/format";
import { rolloutGreedy, train } from "./engine";
import {
  DEFAULT_SLIDER,
  SLIDER_MAX,
  SLIDER_MIN,
  behaviourOf,
  sliderToReward,
} from "./view";
import { LearningTrace } from "./components/LearningTrace";
import { RoomView } from "./components/RoomView";

/**
 * Reward Playground.
 *
 * One idea: **the robot optimises what you reward, not what you meant.**
 *
 * The visitor's only lever in the first section is what one square is worth.
 * Everything else — the route, the step count, the value map, every number in
 * the technical section — is derived from a single real Q-learning run against
 * that number. There is no scripted behaviour anywhere in this lab.
 *
 * ## One training run
 *
 * `train()` is called once per reward value and its result feeds both
 * sections, so the room and the value map are provably two views of the same
 * table rather than two versions of it. A full run costs a few milliseconds,
 * so the slider retrains on every movement and the visitor never waits.
 */
export default function RewardPlayground() {
  const t = useT();
  const copy = t.labs["reward-playground"];

  const [slider, setSlider] = useState(DEFAULT_SLIDER);
  const tileReward = sliderToReward(slider);

  // Snapshots are kept because section 2 scrubs through them; the same run
  // serves both sections.
  const training = useMemo(() => train({ tileReward, snapshots: true }), [tileReward]);
  const rollout = useMemo(() => rolloutGreedy(training.q), [training]);
  const behaviour = behaviourOf(rollout);

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 — A room, a robot and one decision. Nothing is named. */}
      <section aria-labelledby="reward-room-heading">
        <h2 id="reward-room-heading" className="sr-only">
          {copy.room.title}
        </h2>
        <p className="mx-auto mb-8 max-w-prose text-center text-body-lg text-fg">
          {copy.room.question}
        </p>

        <RoomView rollout={rollout} revision={slider} />

        <div className="mx-auto mt-10 max-w-md space-y-3">
          <ControlPanel>
            <LabSlider
              label={copy.room.sliderLabel}
              value={slider}
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              onChange={setSlider}
              format={() => formatNumber(tileReward, 1)}
              valueText={() => copy.room.sliderValue(formatNumber(tileReward, 1))}
              className="flex-1"
            />
          </ControlPanel>
          <p className="text-center text-body-sm text-fg-muted">{copy.room.hint}</p>
          {/* Earned in context: it only appears once the robot has actually
              stopped going to the door. */}
          {behaviour === "stayed" && (
            <p className="text-center text-body-sm text-fg">{copy.room.wow}</p>
          )}
        </div>
      </section>

      {/* 2 — The mechanism, live-bound to the reward above. */}
      <LabSection kicker={copy.learn.kicker} title={copy.learn.title} lede={copy.learn.lede}>
        <LearningTrace training={training} />
      </LabSection>

      {/* 3 — Three lines. */}
      <LabRecap lessons={copy.recap.lessons} footer={copy.recap.footer} />
    </div>
  );
}
