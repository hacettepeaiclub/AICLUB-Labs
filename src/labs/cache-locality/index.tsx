import { LabRecap, LabSection, LabSources } from "@/components/lab";
import { useLabCopy } from "@/i18n/labs";
import { LineStage } from "./components/LineStage";
import { OrderStage } from "./components/OrderStage";
import { RaceStage } from "./components/RaceStage";
import { StrideStage } from "./components/StrideStage";
import { useBench } from "./useBench";

/**
 * Cache locality.
 *
 * One idea: **memory arrives a line at a time, so reading a number's
 * neighbours next is nearly free, and reading far from the last read is not.**
 *
 * ## Order
 *
 * The claim first, as a measurement on the visitor's own machine: the same
 * sum, twice, several times apart. Then why, with a cache small enough to
 * draw. Then the stride that turns that why into a curve, measured again.
 * Then a matrix product the visitor reorders, where the model's ranking and
 * their processor's are set side by side.
 *
 * ## Honesty
 *
 * Every time on the page is measured, in a worker, on the visitor's own
 * processor (`bench.ts`), with both orders doing provably the same work. The
 * cache drawn in sections 2 and 4 is a model — fully associative, LRU, one
 * level — and the page never presents its counts as a forecast of a real
 * machine's times; it sets them beside the measurements instead. Where a
 * real processor departs from the model (a prefetcher, lines fetched in
 * pairs), the copy says so rather than smoothing it over.
 */
export default function CacheLocality() {
  const t = useLabCopy("cache-locality");
  // One worker for the whole lab, started by the first button pressed.
  const bench = useBench();

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1 — The claim, measured: same sum, two orders. */}
      <section aria-labelledby="cl-race-heading">
        <h2 id="cl-race-heading" className="sr-only">
          {t.race.title}
        </h2>
        <p className="mb-6 max-w-prose text-body-lg text-fg">{t.race.question}</p>
        <RaceStage bench={bench} />
      </section>

      {/* 2 — Why: lines, and a cache small enough to watch. */}
      <LabSection kicker={t.line.kicker} title={t.line.title} lede={t.line.lede}>
        <LineStage />
      </LabSection>

      {/* 3 — Stride: the distance between reads, priced. */}
      <LabSection kicker={t.stride.kicker} title={t.stride.title} lede={t.stride.lede}>
        <StrideStage bench={bench} />
      </LabSection>

      {/* 4 — Your turn: six loop orders, the model against the stopwatch. */}
      <LabSection kicker={t.order.kicker} title={t.order.title} lede={t.order.lede}>
        <OrderStage bench={bench} />
      </LabSection>

      <LabRecap lessons={t.recap.lessons} footer={t.recap.footer} />
      <LabSources
        title={t.sources.title}
        entries={[
          { id: "drepper", supports: t.sources.drepper },
          { id: "memoryWall", supports: t.sources.memoryWall },
          { id: "blocked", supports: t.sources.blocked },
          { id: "locality", supports: t.sources.locality },
        ]}
      />
    </div>
  );
}
