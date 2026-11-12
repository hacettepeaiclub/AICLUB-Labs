import { Link } from "react-router-dom";
import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useT } from "@/i18n";
import { useLabCopy } from "@/i18n/labs";
import { MatrixStage } from "./components/MatrixStage";
import { ReduceStage } from "./components/ReduceStage";
import { ShadowStage } from "./components/ShadowStage";

/**
 * The Widest Shadow: eigenvectors, covariance and PCA.
 *
 * One idea: **a matrix turns almost every direction; for a cloud of data the
 * directions its covariance matrix leaves unturned are where the data spreads
 * most and least, and that is PCA.** The Map of Meaning flattens 300 numbers
 * onto two of these directions and Gradient Descent's curvature ratio is a
 * ratio of two of their eigenvalues; this lab is where both come from.
 *
 * ## Order
 *
 * A matrix bending one arrow, until the visitor finds the directions it only
 * stretches; then a cloud, and a line turned until its shadow is widest; and
 * only then the name for what was found, and what keeping one number costs.
 *
 * ## Honesty
 *
 * Every number comes from `engine.ts`, which is tested against a sweep of
 * every half degree: the eigenvectors are exactly the unturned directions,
 * and the widest shadow's variance is the first eigenvalue. The people are a
 * seeded synthetic sample, and the page says so.
 */

/** Where the same directions turn up in the collection. */
const ELSEWHERE = ["word-embeddings", "gradient-descent", "jepa"] as const;

export default function Pca() {
  const t = useLabCopy("pca");
  const shell = useT();

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — A matrix bends space; find what it does not turn. */}
      <section aria-labelledby="pca-turn-heading">
        <h2 id="pca-turn-heading" className="sr-only">
          {t.turn.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.turn.question}</p>
        <MatrixStage />
      </section>

      {/* 2 — The same, for data: the widest shadow is an eigenvector. */}
      <LabSection kicker={t.shadow.kicker} title={t.shadow.title} lede={t.shadow.lede}>
        <ShadowStage />
      </LabSection>

      {/* 3 — Keep one number: what survives, what is lost. */}
      <LabSection kicker={t.reduce.kicker} title={t.reduce.title} lede={t.reduce.lede}>
        <ReduceStage />
      </LabSection>

      <aside className="rounded-lg border border-line/20 bg-ink-800 p-5">
        <h2 className="text-title text-fg">{t.bridge.title}</h2>
        <p className="mt-2 text-body text-fg-muted">{t.bridge.intro}</p>
        <ul className="mt-4 space-y-3">
          {ELSEWHERE.map((slug) => (
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
          { id: "pearson", supports: t.sources.pearson },
          { id: "hotelling", supports: t.sources.hotelling },
        ]}
      />
    </div>
  );
}
