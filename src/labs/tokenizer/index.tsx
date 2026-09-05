import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { CompareStage } from "./components/CompareStage";
import { GuessStrip } from "./components/GuessStrip";
import { MergeStage } from "./components/MergeStage";
import { TokenChallenge } from "./components/TokenChallenge";
import { TrainPanel } from "./components/TrainPanel";

/**
 * Tokenizer Lab.
 *
 * One idea: **tokens are not given, they are learned — and what was learned
 * decides what is cheap to say.**
 *
 * The visitor guesses and is wrong (1), trains a tokenizer by hand and sees
 * where pieces come from (2), controls how much training their own sentence
 * gets (3), discovers that the training text sets the ceiling (4), and then
 * has to work both levers deliberately (5).
 */
export default function TokenizerLab() {
  const t = useT().labs.tokenizer;

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 — Behaviour first. Nothing is named until you have been wrong. */}
      <section aria-label={t.guess.sectionLabel}>
        <GuessStrip />
      </section>

      {/* 2 — Name what was just watched, one merge at a time. */}
      <LabSection kicker={t.train.kicker} title={t.train.title} lede={t.train.lede}>
        <TrainPanel />
      </LabSection>

      {/* 3 — The core interaction: how much training, on your own text. */}
      <LabSection kicker={t.merge.kicker} title={t.merge.title} lede={t.merge.lede}>
        <MergeStage />
      </LabSection>

      {/* 4 — The cause: the corpus, not the algorithm. */}
      <LabSection kicker={t.compare.kicker} title={t.compare.title} lede={t.compare.lede}>
        <CompareStage />
      </LabSection>

      {/* 5 — Both levers, deliberately. */}
      <LabSection kicker={t.challenge.kicker} title={t.challenge.title} lede={t.challenge.lede}>
        <TokenChallenge />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
    </div>
  );
}
