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
import { CompareStage } from "./components/CompareStage";
import { MixStage } from "./components/MixStage";
import { ScaleStage } from "./components/ScaleStage";
import { SentenceView } from "./components/SentenceView";
import { SoftmaxStage } from "./components/SoftmaxStage";

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
 * sentence and the technical stages are provably views of one result rather
 * than versions of it.
 *
 * ## The order
 *
 * What the whole sentence does (1), then the same thing slowed down: what the
 * word asked for and what it got back (2), what the divisor was protecting
 * against (3), how matches turn into portions (4), and what the portions are
 * finally spent on (5). This used to be one section holding six stacked cards,
 * which put the fifth step three screens below the sentence it described.
 * Every stage now carries the selection control, so the cause and its effect
 * are on one screen at every width.
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
    <div className="space-y-20 md:space-y-28">
      {/* 1 — The sentence. Selected on load, so the lesson lands before the
          visitor has done anything, and nothing is named. */}
      <section aria-labelledby="attention-heading">
        <h2 id="attention-heading" className="sr-only">
          {a.hero.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{a.hero.question}</p>

        <SentenceView
          attention={attention}
          words={words}
          selected={selected}
          onSelect={setSelected}
          swapIndex={SWAP_INDEX}
          control={
            <div className="space-y-3">
              <Segmented
                label={a.swapLabel}
                value={variant}
                options={VARIANTS.map((option) => ({ value: option, label: option }))}
                onChange={setVariant}
              />
              <p className="text-caption text-fg-muted">{a.swapHint}</p>
              {/* Earned in context: the split only exists once the competitor is
                  in the sentence, so the limitation is shown where it happens. */}
              {variant === "dog" && <p className="text-caption text-fg">{a.dogNote}</p>}
            </div>
          }
        />
      </section>

      {/* 2 — What was asked for, and what was offered back. */}
      <LabSection kicker={a.reveal.kicker} title={a.reveal.title} lede={a.reveal.lede}>
        <CompareStage
          attention={attention}
          words={words}
          selected={selected}
          onSelect={setSelected}
        />
      </LabSection>

      {/* 3 — The divisor, shown by taking it away. */}
      <LabSection kicker={a.scale.kicker} title={a.scale.title} lede={a.scale.lede}>
        <ScaleStage
          attention={attention}
          words={words}
          selected={selected}
          onSelect={setSelected}
        />
      </LabSection>

      {/* 4 — Matches become portions of one fixed budget. */}
      <LabSection kicker={a.softmax.kicker} title={a.softmax.title} lede={a.softmax.lede}>
        <SoftmaxStage
          attention={attention}
          words={words}
          selected={selected}
          onSelect={setSelected}
        />
      </LabSection>

      {/* 5 — And are spent. */}
      <LabSection kicker={a.mix.kicker} title={a.mix.title} lede={a.mix.lede}>
        <MixStage attention={attention} words={words} selected={selected} onSelect={setSelected} />
        <p className="mt-8 max-w-prose text-body-sm text-fg-faint">{a.honesty}</p>
      </LabSection>

      {/* 6 — Three lines. */}
      <LabRecap lessons={a.recap.lessons} footer={a.recap.footer} />
    </div>
  );
}
