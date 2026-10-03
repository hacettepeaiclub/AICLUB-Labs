import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabs } from "@/i18n/labs";
import { ChallengeStage } from "./components/ChallengeStage";
import { DepthStage } from "./components/DepthStage";
import { KernelStage } from "./components/KernelStage";
import { LearnStage } from "./components/LearnStage";
import { ShiftStage } from "./components/ShiftStage";
import { SizeStage } from "./components/SizeStage";
import { SlideStage } from "./components/SlideStage";

/**
 * Convolution.
 *
 * One idea: **a small set of weights, slid across a whole picture, finds
 * the same pattern wherever it is — and those weights can be learned.**
 *
 * ## Order
 *
 * The sum at one position, then what different weights make of a picture,
 * then why sharing them across positions is the point, then the counting
 * that every layer needs, then what stacking layers buys, and only then the
 * claim that matters most for AI: nobody writes these kernels, descent finds
 * them. The challenge comes last, so the visitor designs three kernels after
 * having watched one being found.
 *
 * ## Honesty
 *
 * Every picture on the page is computed by `engine.ts`, which implements the
 * cross-correlation a convolution layer actually performs, and is tested cell
 * for cell against a brute-force reading of its definition. The receptive
 * field is tested against perturbing a real stack, and the fit against the
 * hidden kernel it has to recover.
 */
export default function Convolution() {
  const t = useLabs().convolution;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — Behaviour first: one window, one sum, one step at a time. */}
      <section aria-labelledby="cv-slide-heading">
        <h2 id="cv-slide-heading" className="sr-only">
          {t.slide.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.slide.question}</p>
        <SlideStage />
      </section>

      {/* 2 — Different weights, different pictures. */}
      <LabSection kicker={t.kernels.kicker} title={t.kernels.title} lede={t.kernels.lede}>
        <KernelStage />
      </LabSection>

      {/* 3 — The same weights everywhere, so the answer moves with the shape. */}
      <LabSection kicker={t.shift.kicker} title={t.shift.title} lede={t.shift.lede}>
        <ShiftStage />
      </LabSection>

      {/* 4 — Counting windows: padding and stride. */}
      <LabSection kicker={t.size.kicker} title={t.size.title} lede={t.size.lede}>
        <SizeStage />
      </LabSection>

      {/* 5 — Stacking small windows. */}
      <LabSection kicker={t.depth.kicker} title={t.depth.title} lede={t.depth.lede}>
        <DepthStage />
      </LabSection>

      {/* 6 — The weights are found, not written. */}
      <LabSection kicker={t.learn.kicker} title={t.learn.title} lede={t.learn.lede}>
        <LearnStage />
      </LabSection>

      {/* 7 — Three kernels to design by hand. */}
      <LabSection kicker={t.challenge.kicker} title={t.challenge.title} lede={t.challenge.lede}>
        <ChallengeStage />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "lecunZip", supports: t.sources.lecunZip },
          { id: "convArithmetic", supports: t.sources.convArithmetic },
          { id: "vgg", supports: t.sources.vgg },
          { id: "alexnet", supports: t.sources.alexnet },
          { id: "hubelWiesel", supports: t.sources.hubelWiesel },
        ]}
      />
    </div>
  );
}
