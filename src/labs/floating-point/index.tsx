import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { BitsStage } from "./components/BitsStage";
import { ChallengeStage } from "./components/ChallengeStage";
import { FormatsStage } from "./components/FormatsStage";
import { GapStage } from "./components/GapStage";
import { RulerStage } from "./components/RulerStage";
import { StoreStage } from "./components/StoreStage";
import { SumStage } from "./components/SumStage";

/**
 * Floating Point.
 *
 * One idea: **a computer keeps the nearest number it can write in a fixed
 * number of bits — and how near depends on how large the number is.**
 *
 * ## Order
 *
 * What is kept, then what that does to a sum, then how the bits encode it,
 * then the spacing that encoding produces — first on a toy format where every
 * value fits on a line, then in float32 across sixty powers of two — then what
 * choosing fewer bits costs, which is where AI comes in. Every section is a
 * consequence of the one before it, and none names a field, a format or a
 * rule before the visitor has watched it act.
 *
 * ## Honesty
 *
 * Every stored value on the page comes from `engine.ts`, which computes with
 * exact rationals and never with floats, and whose rounding is tested value
 * for value against the browser's own `parseFloat`, `String(n)` and
 * `Math.fround`, and against V8's `Math.f16round`.
 */
export default function FloatingPoint() {
  const t = useLabs()["floating-point"];

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — Behaviour first: a field and what it becomes. */}
      <section aria-labelledby="fp-store-heading">
        <h2 id="fp-store-heading" className="sr-only">
          {t.store.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.store.question}</p>
        <StoreStage />
      </section>

      {/* 2 — Two of them added, guessed before it is shown. */}
      <LabSection kicker={t.sum.kicker} title={t.sum.title} lede={t.sum.lede}>
        <SumStage />
      </LabSection>

      {/* 3 — What the bits are, discovered by flipping them. */}
      <LabSection kicker={t.bits.kicker} title={t.bits.title} lede={t.bits.lede}>
        <BitsStage />
      </LabSection>

      {/* 4 — Every value a small format can hold. */}
      <LabSection kicker={t.ruler.kicker} title={t.ruler.title} lede={t.ruler.lede}>
        <RulerStage />
      </LabSection>

      {/* 5 — The same spacing, at the size of a real format. */}
      <LabSection kicker={t.gap.kicker} title={t.gap.title} lede={t.gap.lede}>
        <GapStage />
      </LabSection>

      {/* 6 — Spending sixteen bits: range or precision. */}
      <LabSection kicker={t.formats.kicker} title={t.formats.title} lede={t.formats.lede}>
        <FormatsStage />
      </LabSection>

      {/* 7 — Three things arithmetic forbids, found by hand. */}
      <LabSection kicker={t.challenge.kicker} title={t.challenge.title} lede={t.challenge.lede}>
        <ChallengeStage />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "ieee754", supports: t.sources.ieee754 },
          { id: "goldberg", supports: t.sources.goldberg },
          { id: "ecma262", supports: t.sources.ecma262 },
          { id: "bfloat16", supports: t.sources.bfloat16 },
          { id: "mixedPrecision", supports: t.sources.mixedPrecision },
        ]}
      />
    </div>
  );
}
