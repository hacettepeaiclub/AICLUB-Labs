import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { AdamStage } from "./components/AdamStage";
import { CompareStage } from "./components/CompareStage";
import { DescentChallenge } from "./components/DescentChallenge";
import { DescentStage } from "./components/DescentStage";
import { GradientStage } from "./components/GradientStage";

/**
 * Gradient Descent.
 *
 * One idea: the curvature of the landscape — not the algorithm — decides what
 * step size you are allowed to take, and when curvature differs by direction,
 * one step size cannot serve every direction at once.
 *
 * That is why this lab is two-dimensional and the neural playground's descent
 * section is not. On a single axis a gradient is only a sign, so it always
 * points at the minimum; and there is only one curvature, so "badly
 * conditioned" cannot be shown at all. Momentum and Adam appear here as
 * consequences of that problem rather than as a tour of optimizers.
 *
 * Every section runs the same engine. Nothing is pre-baked and nothing is
 * eased: what the map draws at step 7 is what the seventh call to `step()`
 * returned.
 */
export default function GradientDescent() {
  const g = useT().labs["gradient-descent"];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 — Behaviour first: a map, a slider, a button, and no vocabulary. */}
      <section aria-labelledby="gd-find-heading">
        <h2 id="gd-find-heading" className="sr-only">
          {g.find.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{g.find.question}</p>
        <DescentStage
          landscapeId="gentle"
          defaultLearningRateIndex={70}
          caption={g.find.caption}
        />
      </section>

      {/* 2 — Name what just happened: a gradient is a vector, and it does not
          point where you are going. */}
      <LabSection kicker={g.direction.kicker} title={g.direction.title} lede={g.direction.lede}>
        <GradientStage />
      </LabSection>

      {/* 3 — The centre of the lab: the ceiling on a step size belongs to the
          surface, and it can be named exactly. */}
      <LabSection kicker={g.rate.kicker} title={g.rate.title} lede={g.rate.lede}>
        <DescentStage
          landscapeId="steep"
          detailed
          defaultLearningRateIndex={40}
          caption={g.rate.caption}
        />
      </LabSection>

      {/* 4 — A consequence: accumulated gradients, a wider stability range,
          and oscillation as the price. */}
      <LabSection
        kicker={g.momentumSection.kicker}
        title={g.momentumSection.title}
        lede={g.momentumSection.lede}
      >
        <CompareStage
          landscapeId="valley"
          defaultLearningRateIndex={150}
          defaultBeta={0}
          caption={g.momentumSection.caption}
        />
      </LabSection>

      {/* 5 — A second consequence: a step size per parameter, scaled by that
          parameter's own gradient history. */}
      <LabSection kicker={g.adam.kicker} title={g.adam.title} lede={g.adam.lede}>
        <AdamStage />
      </LabSection>

      {/* 6 — Three questions the rest of the page has answers to. */}
      <LabSection
        kicker={g.challenge.kicker}
        title={g.challenge.title}
        lede={g.challenge.lede}
      >
        <DescentChallenge />
      </LabSection>

      <LabRecap lessons={g.recap.lessons} footer={g.recap.footer} />
    </div>
  );
}
