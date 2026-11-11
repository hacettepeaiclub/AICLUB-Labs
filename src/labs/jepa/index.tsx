import { Link } from "react-router-dom";
import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useT } from "@/i18n";
import { useLabCopy } from "@/i18n/labs";
import { PictureStage } from "./components/PictureStage";
import { PixelsStage } from "./components/PixelsStage";
import { TrainStage } from "./components/TrainStage";

/**
 * The Missing Piece: a joint-embedding predictive architecture (JEPA).
 *
 * One idea: **hide part of a picture and learn by predicting it — not its
 * pixels, but what it is.** It is the collection's last lab because it is
 * made of the others: pixels as numbers (Convolution), vectors as places
 * (Word embeddings), small networks (Multilayer perceptrons) trained by
 * backpropagation and Adam (Backpropagation, Gradient descent), and the
 * question of whether a low loss means anything (Generalization).
 *
 * ## Order
 *
 * What the model is given; the model learning while you watch; the same
 * model with its slow copy switched off, which reaches a loss of zero by
 * learning nothing; and only then why the guess is a kind and not a picture.
 *
 * ## Honesty
 *
 * Every number on the page comes from `engine.ts`, a JEPA written out in
 * full: forward and backward passes checked against finite differences, the
 * target encoder an exponential moving average of the context encoder as in
 * I-JEPA. The textures are synthetic and the scale is a lesson's; the page
 * says both.
 */

/** The labs this one is made of, in the order the model uses them. */
const PARTS = [
  "convolution",
  "word-embeddings",
  "multilayer-perceptrons",
  "backpropagation",
  "gradient-descent",
  "generalization",
  "attention",
] as const;

export default function Jepa() {
  const t = useLabCopy("jepa");
  const shell = useT();

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — What the model is given: numbers. */}
      <section aria-labelledby="jepa-picture-heading">
        <h2 id="jepa-picture-heading" className="sr-only">
          {t.picture.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.picture.question}</p>
        <PictureStage />
      </section>

      {/* 2 — Hide, guess, compare: the model learns. */}
      <LabSection kicker={t.train.kicker} title={t.train.title} lede={t.train.lede}>
        <TrainStage mode="train" />
      </LabSection>

      {/* 3 — The same, with the slow copy off: zero loss, nothing learned. */}
      <LabSection kicker={t.collapse.kicker} title={t.collapse.title} lede={t.collapse.lede}>
        <TrainStage mode="collapse" />
      </LabSection>

      {/* 4 — Why the guess is a kind and not a picture. */}
      <LabSection kicker={t.pixels.kicker} title={t.pixels.title} lede={t.pixels.lede}>
        <PixelsStage />
      </LabSection>

      <aside className="rounded-lg border border-line/20 bg-ink-800 p-5">
        <h2 className="text-title text-fg">{t.bridge.title}</h2>
        <p className="mt-2 text-body text-fg-muted">{t.bridge.intro}</p>
        <ul className="mt-4 space-y-3">
          {PARTS.map((slug) => (
            <li key={slug}>
              <Link
                to={`/labs/${slug}/`}
                className="inline-flex min-h-11 items-center text-accent underline"
              >
                {shell.labMeta[slug].title}
              </Link>
              <p className="text-body-sm text-fg-muted">{t.bridge.items[slug]}</p>
            </li>
          ))}
        </ul>
      </aside>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "ijepa", supports: t.sources.ijepa },
          { id: "byol", supports: t.sources.byol },
          { id: "lecunPath", supports: t.sources.lecunPath },
        ]}
      />
    </div>
  );
}
