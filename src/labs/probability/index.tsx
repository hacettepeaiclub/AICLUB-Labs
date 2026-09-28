import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { BirthdayStage } from "./components/BirthdayStage";
import { Setup } from "./components/Framing";
import { ConditionalStage } from "./components/ConditionalStage";
import { LargeNumbersStage } from "./components/LargeNumbersStage";
import { MontyStage } from "./components/MontyStage";
import { PascalStage } from "./components/PascalStage";
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
  const copy = useLabs().probability;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* Every section now opens the same way: the rules of the situation,
          then the thing itself. What used to sit here was a lede that named
          the result — "the answer is not 1/2", "Simpson's paradox" — which
          spends the surprise before the visitor has touched anything. The
          names arrive further down, after the behaviour. */}

      {/* 1 — a game with an answer nobody believes at first. */}
      <section aria-labelledby="prob-monty-heading">
        <h2 id="prob-monty-heading" className="sr-only">
          {copy.monty.title}
        </h2>
        <p className="mb-4 max-w-prose text-body-lg text-fg">{copy.monty.question}</p>
        <Setup rules={copy.monty.setup} />
        <MontyStage />
      </section>

      {/* 2 — how few people it takes. */}
      <LabSection kicker={copy.birthday.kicker} title={copy.birthday.title}>
        <Setup rules={copy.birthday.setup} />
        <BirthdayStage />
      </LabSection>

      {/* 3 — the clue, and what its wording rules out. */}
      <LabSection kicker={copy.conditional.kicker} title={copy.conditional.title}>
        <Setup rules={copy.conditional.setup} />
        <ConditionalStage />
      </LabSection>

      {/* 4 — better in every group, worse overall. */}
      <LabSection kicker={copy.simpson.kicker} title={copy.simpson.title}>
        <Setup rules={copy.simpson.setup} />
        <SimpsonStage />
      </LabSection>

      {/* 5 — a random route, and a shape that is not random. The first four
          experiments each end in a number that surprises; these last two are
          a pair, and they end in a shape and then in a limit. */}
      <LabSection kicker={copy.pascal.kicker} title={copy.pascal.title}>
        <Setup rules={copy.pascal.setup} />
        <PascalStage />
      </LabSection>

      {/* The bridge. One sentence, on the page's own ground, because the two
          sections that surround it are one argument rather than two. */}
      <p className="max-w-prose text-body-lg text-fg-muted">{copy.bridge}</p>

      {/* 6 — the same single decision, repeated until its proportion settles. */}
      <LabSection kicker={copy.largeNumbers.kicker} title={copy.largeNumbers.title}>
        <Setup rules={copy.largeNumbers.setup} />
        <LargeNumbersStage />
        <p className="mt-8 max-w-prose text-body-sm text-fg-faint">{copy.scope}</p>
      </LabSection>

      <LabRecap lessons={copy.recap.lessons} footer={copy.recap.footer} />
      <LabSources
        title={copy.sources.title}
        entries={[
          { id: "statisticalInference", supports: copy.sources.statisticalInference },
          { id: "simpson", supports: copy.sources.simpson },
        ]}
      />
    </div>
  );
}
