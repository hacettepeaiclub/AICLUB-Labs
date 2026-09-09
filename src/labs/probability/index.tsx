import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { BirthdayStage } from "./components/BirthdayStage";
import { ConditionalStage } from "./components/ConditionalStage";
import { MontyStage } from "./components/MontyStage";
import { SimpsonStage } from "./components/SimpsonStage";

/**
 * Probability Lab.
 *
 * One idea: **probability disagrees with intuition often enough that the
 * disagreement is worth studying on purpose.**
 *
 * Four short experiments rather than one long argument. Each is
 * self-contained — nothing in section 4 needs anything section 1 established —
 * and each runs the same way: you commit to a guess, the result arrives, and
 * only then does anybody explain anything. A probability read before guessing
 * is a fact; the same probability read after committing to a different one is
 * a surprise, and only the second kind changes an intuition.
 *
 * ## The order
 *
 * A game whose answer feels wrong (1); a collision that arrives far sooner
 * than expected (2); a clue whose wording moves the answer (3); and a
 * comparison that reverses when you add the groups up (4). Intuition fails in
 * a different way each time, which is the argument the sequence makes.
 *
 * ## Where the numbers come from
 *
 * Four pure engines under `engine/`. Exact values are computed in closed form;
 * simulated values are produced by actually running the experiment against a
 * seeded generator, and the two are never printed in the same column. A
 * simulation illustrates a theorem here — it does not establish one.
 */
export default function ProbabilityLab() {
  const copy = useT().labs.probability;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — a game with an answer nobody believes at first. */}
      <section aria-labelledby="prob-monty-heading">
        <h2 id="prob-monty-heading" className="sr-only">
          {copy.monty.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{copy.monty.question}</p>
        <MontyStage />
      </section>

      {/* 2 — how few people it takes. */}
      <LabSection
        kicker={copy.birthday.kicker}
        title={copy.birthday.title}
        lede={copy.birthday.lede}
      >
        <BirthdayStage />
      </LabSection>

      {/* 3 — the clue, and what its wording rules out. */}
      <LabSection
        kicker={copy.conditional.kicker}
        title={copy.conditional.title}
        lede={copy.conditional.lede}
      >
        <ConditionalStage />
      </LabSection>

      {/* 4 — better in every group, worse overall. */}
      <LabSection kicker={copy.simpson.kicker} title={copy.simpson.title} lede={copy.simpson.lede}>
        <SimpsonStage />
        <p className="mt-8 max-w-prose text-body-sm text-fg-faint">{copy.scope}</p>
      </LabSection>

      <LabRecap lessons={copy.recap.lessons} footer={copy.recap.footer} />
    </div>
  );
}
