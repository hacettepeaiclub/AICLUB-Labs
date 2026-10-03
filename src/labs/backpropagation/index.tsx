import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { ChainStage } from "./components/ChainStage";
import { ChallengeStage } from "./components/ChallengeStage";
import { CostStage } from "./components/CostStage";
import { DepthStage } from "./components/DepthStage";
import { LedgerStage } from "./components/LedgerStage";
import { PullStage } from "./components/PullStage";
import { ZoomStage } from "./components/ZoomStage";

/**
 * Backpropagation.
 *
 * One idea: **every weight is told exactly how much of the error is its
 * fault, and the telling is the chain rule run backwards from the loss.**
 *
 * ## Order, and why nothing here is a "step" button
 *
 * Each section is a different gesture, chosen for what it makes physical.
 * Pulling the output makes blame something you feel along the wires;
 * zooming makes "derivative" mean "the curve, close enough to be a line";
 * turning a dial makes the chain rule a gear train; tapping nodes in order
 * makes the backward pass something the visitor performs and can get wrong.
 * Then two consequences: why it is cheap (a race, timed for real), and how
 * it fails (a chain that the visitor stretches until the signal dies). The
 * challenge closes with the tool that catches a broken backward pass.
 *
 * ## Honesty
 *
 * One engine computes everything (`engine.ts`), and its gradients are held
 * to central differences for every graph on the page. The race's times are
 * measured, not modelled, and both sides must reach the same gradient.
 */
export default function Backpropagation() {
  const t = useLabs().backpropagation;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — Behaviour first: grab the output. */}
      <section aria-labelledby="bp-pull-heading">
        <h2 id="bp-pull-heading" className="sr-only">
          {t.pull.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.pull.question}</p>
        <PullStage />
      </section>

      {/* 2 — What the number a weight receives actually is. */}
      <LabSection kicker={t.zoom.kicker} title={t.zoom.title} lede={t.zoom.lede}>
        <ZoomStage />
      </LabSection>

      {/* 3 — Why the numbers multiply. */}
      <LabSection kicker={t.chain.kicker} title={t.chain.title} lede={t.chain.lede}>
        <ChainStage />
      </LabSection>

      {/* 4 — The backward pass, performed by hand, in the only order it allows. */}
      <LabSection kicker={t.ledger.kicker} title={t.ledger.title} lede={t.ledger.lede}>
        <LedgerStage />
      </LabSection>

      {/* 5 — Why it won: one pass back against two per weight. */}
      <LabSection kicker={t.cost.kicker} title={t.cost.title} lede={t.cost.lede}>
        <CostStage />
      </LabSection>

      {/* 6 — How it fails: a long chain of small factors. */}
      <LabSection kicker={t.depth.kicker} title={t.depth.title} lede={t.depth.lede}>
        <DepthStage />
      </LabSection>

      {/* 7 — Catching a broken one. */}
      <LabSection kicker={t.challenge.kicker} title={t.challenge.title} lede={t.challenge.lede}>
        <ChallengeStage />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "backpropagation", supports: t.sources.backpropagation },
          { id: "linnainmaa", supports: t.sources.linnainmaa },
          { id: "griewank", supports: t.sources.griewank },
          { id: "autodiffSurvey", supports: t.sources.autodiffSurvey },
          { id: "vanishing", supports: t.sources.vanishing },
        ]}
      />
    </div>
  );
}
