import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { Playground } from "./components/Playground";
import { NeuronLab } from "./components/NeuronLab";
import { LayersLab } from "./components/LayersLab";
import { DescentLab } from "./components/DescentLab";
import { ConceptList } from "./components/ConceptList";
import { SpiralChallenge } from "./components/SpiralChallenge";

/**
 * Neural Playground.
 *
 * The order is deliberate: watch a whole network learn first, then take it
 * apart. Every section runs the same engine — nothing here is an illustration
 * of the maths, it is the maths.
 */
export default function NeuralPlayground() {
  const t = useT().labs["neural-playground"];

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — The playground itself, plus the network's own view of the data */}
      <section aria-labelledby="playground-heading">
        {/* See the note in sorting-race: hidden heading, honest outline. */}
        <h2 id="playground-heading" className="sr-only">
          {t.liveTraining}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.question}</p>
        <Playground />
      </section>

      {/* 2 — One neuron */}
      <LabSection
        kicker={t.neuron.kicker}
        title={t.neuron.title}
        lede={t.neuron.lede}
      >
        <NeuronLab />
      </LabSection>

      {/* 3 — Why depth */}
      <LabSection
        kicker={t.layers.kicker}
        title={t.layers.title}
        lede={t.layers.lede}
      >
        <LayersLab />
      </LabSection>

      {/* 4 — How learning actually happens */}
      <LabSection
        kicker={t.descent.kicker}
        title={t.descent.title}
        lede={t.descent.lede}
      >
        <DescentLab />
      </LabSection>

      {/* 5 — The vocabulary, once the behavior is familiar */}
      <LabSection
        kicker={t.loop.kicker}
        title={t.loop.title}
        lede={t.loop.lede}
      >
        <ConceptList />
      </LabSection>

      {/* 6 — Challenge */}
      <LabSection
        kicker={t.challenge.kicker}
        title={t.challenge.title}
        lede={t.challenge.lede}
      >
        <SpiralChallenge />
      </LabSection>

      {/* 7 — Recap */}
      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
    </div>
  );
}
