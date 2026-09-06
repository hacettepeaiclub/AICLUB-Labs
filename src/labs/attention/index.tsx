import { useMemo, useState } from "react";
import { LabRecap, LabSection } from "@/components/lab";
import { Segmented } from "@/components/ui";
import { useT } from "@/i18n";
import { attend } from "./engine";
import { LAB_MODEL } from "./lexicon";
import {
  DEFAULT_VARIANT,
  QUERY_INDEX,
  SWAP_INDEX,
  TOKEN_COUNT,
  VARIANTS,
  displayTokens,
  embedVariant,
  type Variant,
} from "./sentences";
import { AttentionTrace } from "./components/AttentionTrace";
import { SentenceView } from "./components/SentenceView";

/**
 * Attention Playground.
 *
 * One idea: **attention is a competition, not a lookup.** Every token asks the
 * same question of every other token, and a fixed 100% is divided among the
 * answers — so changing any competitor moves every share, including the ones
 * you were not touching.
 *
 * Two controls, and no third. Select a token; swap the one curated context
 * word. There is no Run button because there is no time axis, no slider
 * because there is no parameter worth tuning, and no challenge because the
 * interaction is already a discovery loop.
 *
 * ## One calculation
 *
 * `attend()` runs once per sentence variant. Selecting a different token
 * recomputes nothing — it reads a different row of the same matrix, so the
 * sentence and the technical trace are provably two views of one result
 * rather than two versions of it.
 */
export default function AttentionPlayground() {
  const t = useT();
  const a = t.labs.attention;

  const [variant, setVariant] = useState<Variant>(DEFAULT_VARIANT);
  const [selected, setSelected] = useState(QUERY_INDEX);

  // Three possible sentences, so this memo has three possible results.
  const attention = useMemo(() => attend(LAB_MODEL, embedVariant(variant), TOKEN_COUNT), [variant]);
  const words = useMemo(() => displayTokens(variant), [variant]);

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1 — The sentence. Selected on load, so the lesson lands before the
          visitor has done anything, and nothing is named. */}
      <section aria-labelledby="attention-heading">
        <h2 id="attention-heading" className="sr-only">
          {a.hero.title}
        </h2>
        <p className="mx-auto mb-2 max-w-prose text-center text-body-lg text-fg">
          {a.hero.question}
        </p>

        <SentenceView
          attention={attention}
          words={words}
          selected={selected}
          onSelect={setSelected}
          swapIndex={SWAP_INDEX}
        />

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3">
          <Segmented
            label={a.swapLabel}
            value={variant}
            options={VARIANTS.map((option) => ({ value: option, label: option }))}
            onChange={setVariant}
          />
          <p className="max-w-prose text-center text-body-sm text-fg-muted">
            {a.swapHint}
          </p>
          {/* Earned in context: the split only exists once the competitor is
              in the sentence, so the limitation is shown where it happens. */}
          {variant === "dog" && (
            <p className="max-w-prose text-center text-body-sm text-fg">{a.dogNote}</p>
          )}
        </div>
      </section>

      {/* 2 — One causal chain, live-bound to the selection above. */}
      <LabSection kicker={a.reveal.kicker} title={a.reveal.title} lede={a.reveal.lede}>
        <AttentionTrace attention={attention} words={words} selected={selected} />
        <p className="mt-8 max-w-prose text-body-sm text-fg-faint">{a.honesty}</p>
      </LabSection>

      {/* 3 — Three lines. */}
      <LabRecap lessons={a.recap.lessons} footer={a.recap.footer} />
    </div>
  );
}
