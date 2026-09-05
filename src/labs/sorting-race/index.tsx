import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { RaceStage } from "./components/RaceStage";
import { SortStage } from "./components/SortStage";
import { SortChallenge } from "./components/SortChallenge";

/**
 * Sorting Race.
 *
 * One idea: the cost of sorting depends on the shape of the data, and
 * algorithms differ in how much they notice. The visitor draws the shape; the
 * counters answer. Every section runs the same engine.
 */
export default function SortingRace() {
  const t = useT().labs["sorting-race"];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 — Behaviour first: no names, one button. */}
      <section aria-labelledby="race-heading">
        {/* Hidden on purpose: this section names nothing until section 2, but
            the outline still needs its level-2 rung. */}
        <h2 id="race-heading" className="sr-only">
          {t.theRace}
        </h2>
        <RaceStage />
      </section>

      {/* 2 — Name what was just watched, one operation at a time. */}
      <LabSection
        kicker={t.watch.kicker}
        title={t.watch.title}
        lede={t.watch.lede}
      >
        <SortStage
          preset="almost"
          algorithms={["selection", "insertion"]}
          caption={t.watch.caption}
        />
      </LabSection>

      {/* 3 — The core: the data is the variable. */}
      <LabSection
        kicker={t.data.kicker}
        title={t.data.title}
        lede={t.data.lede}
      >
        <SortStage
          preset="random"
          algorithms={["selection", "insertion"]}
          showPresets
          emphasis="comparisons"
          caption={t.data.caption}
        />
      </LabSection>

      {/* 4 — Name the cause. */}
      <LabSection
        kicker={t.distance.kicker}
        title={t.distance.title}
        lede={t.distance.lede}
      >
        <SortStage
          preset="sorted"
          algorithms={["insertion"]}
          showPresets
          showInversions
          emphasis="comparisons"
          caption={t.distance.caption}
        />
      </LabSection>

      {/* 5 — Both axes, three different questions. */}
      <LabSection
        kicker={t.challenge.kicker}
        title={t.challenge.title}
        lede={t.challenge.lede}
      >
        <SortChallenge />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
    </div>
  );
}
