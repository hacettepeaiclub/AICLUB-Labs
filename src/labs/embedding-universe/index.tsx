import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { LabRecap, LabSection } from "@/components/lab";
import { useT } from "@/i18n";
import { formatPercent } from "@/lib/format";
import { nearestNeighbours, totalVarianceExplained, varianceExplained } from "./engine";
import { VOCABULARY } from "./vocabulary";
import { NEIGHBOUR_COUNT, PREDICTION, hiddenDimensions } from "./view";
import { useUniverse } from "./useUniverse";
import { NeighbourList } from "./components/NeighbourList";
import { PredictionCard, type PredictionChoice } from "./components/PredictionCard";
import { ProjectionReveal, type RevealMode } from "./components/ProjectionReveal";
import { UniverseMap } from "./components/UniverseMap";
import { WordSearch } from "./components/WordSearch";

/**
 * Embedding Universe.
 *
 * One idea: **you are not looking at the embedding space, you are looking at a
 * projection of it.**
 *
 * Section 1 earns the belief that relationships are geometric — search a word,
 * its neighbours really are the words you would group it with. Section 2 takes
 * that belief apart with the same points, by naming two pairs the picture is
 * actively lying about.
 *
 * ## One map
 *
 * `UniverseMap` is mounted once, here, and both sections read it.
 * There is no second instance and no second projection: section 2 changes which
 * two points are emphasised in the map section 1 was exploring. That the
 * demonstration pair was on screen all along, unremarked, is the argument.
 *
 * ## Nothing here decides a number
 *
 * Every value on screen comes from `engine.ts` through `useUniverse` — the
 * ranks, the similarities, the coordinates, the two distortion pairs, the
 * variance shares. `lab.test.ts` reads these component sources and fails if a
 * vocabulary word or a measured constant ever appears as a literal in one.
 */
export default function EmbeddingUniverse() {
  const t = useT();
  const copy = t.labs["embedding-universe"];
  const universe = useUniverse();

  const anchorIndex = useMemo(() => VOCABULARY.findIndex((w) => w.id === PREDICTION.anchor), []);
  const [selected, setSelected] = useState(anchorIndex);
  const [chosen, setChosen] = useState<number | null>(null);
  const [mode, setMode] = useState<RevealMode>("none");
  const mapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /**
   * Section 2 talks about two points on the map, so it brings the map back.
   *
   * The map stopped being sticky when it became the hero — pinning something
   * this size would have left no room for anything else. Instead, choosing a
   * mode scrolls to it, which is a movement the visitor asked for rather than
   * one the page decided on. Under reduced motion it jumps rather than glides.
   */
  const showPair = (next: RevealMode) => {
    setMode(next);
    if (next !== "none") {
      mapRef.current?.scrollIntoView({
        block: "center",
        behavior: reduced ? "auto" : "smooth",
      });
    }
  };

  const set = universe.data?.set ?? null;
  /**
   * Similarities always at two decimals.
   *
   * Not `formatNumber`: it maximises fraction digits rather than fixing them,
   * so a column of cosines came out as 0.5, 0.47, 0.41 — ragged to compare, and
   * 0.2951 collapsed to "0.3", which throws away the precision the number is
   * there to carry. The house decimal separator stays "." as everywhere else.
   */
  const score = (value: number) => value.toFixed(2);

  const neighbours = useMemo(() => {
    if (!set) return [];
    return nearestNeighbours(set.vectors, set.count, set.dimensions, selected, NEIGHBOUR_COUNT);
  }, [set, selected]);

  // Every word ranked against the anchor, once. The three chips are an
  // editorial choice; where each of them lands is the engine's answer.
  const anchorRanking = useMemo(() => {
    if (!set || anchorIndex < 0) return null;
    const ordered = nearestNeighbours(set.vectors, set.count, set.dimensions, anchorIndex, set.count);
    const byIndex = new Map(ordered.map((n, position) => [n.index, { rank: position + 1, ...n }]));
    return { ordered, byIndex, total: set.count - 1 };
  }, [set, anchorIndex]);

  const choices = useMemo<PredictionChoice[]>(() => {
    if (!anchorRanking) return [];
    return PREDICTION.candidates.flatMap((id) => {
      const index = VOCABULARY.findIndex((w) => w.id === id);
      const item = VOCABULARY[index];
      const scored = anchorRanking.byIndex.get(index);
      if (!item || !scored) return [];
      return [
        {
          index,
          item,
          rank: scored.rank,
          total: anchorRanking.total,
          similarity: scored.similarity,
        },
      ];
    });
  }, [anchorRanking]);

  const nearestChoice = useMemo<PredictionChoice | null>(() => {
    const best = anchorRanking?.ordered[0];
    const item = best ? VOCABULARY[best.index] : undefined;
    if (!best || !item || !anchorRanking) return null;
    return {
      index: best.index,
      item,
      rank: 1,
      total: anchorRanking.total,
      similarity: best.similarity,
    };
  }, [anchorRanking]);

  const geometry = universe.geometry;
  const variance = geometry ? varianceExplained(geometry.projection) : null;
  const combined = geometry ? totalVarianceExplained(geometry.projection) : null;

  const highlighted = useMemo<number[]>(() => {
    const found = geometry?.distortion;
    if (!found || mode === "none") return [];
    const pair = mode === "hidden" ? found.hiddenNeighbour : found.falseNeighbour;
    return [pair.a, pair.b];
  }, [geometry, mode]);

  const anchor = VOCABULARY[anchorIndex];
  const current = VOCABULARY[selected];
  const revealed = chosen !== null;

  if (universe.status === "error") {
    return (
      <div className="mx-auto max-w-prose text-center">
        <p className="text-body text-fg">{copy.data.error}</p>
        <p className="mt-2 font-mono text-caption text-fg-faint">{universe.error}</p>
      </div>
    );
  }

  if (!anchor || !current) return null;

  return (
    <div className="space-y-16">
      {/* 1 — a question, and no map behind it. */}
      <section aria-labelledby="eu-explore-heading" className="!mb-10">
        <h2 id="eu-explore-heading" className="sr-only">
          {copy.explore.title}
        </h2>
        <PredictionCard
          anchor={anchor}
          choices={choices}
          nearest={nearestChoice}
          chosen={chosen}
          ready={universe.status === "ready"}
          formatScore={score}
          onChoose={(index) => {
            setChosen(index);
            setSelected(anchorIndex);
          }}
          copy={copy.predict}
        />
      </section>

      {revealed && (
        <>
          {/* The hero. One instance, shared by both sections.
              No longer sticky: a pinned block had to be capped at 42vh to leave
              the page usable, and that cap was the whole reason the universe
              read as a small chart. Full size in the flow instead, with
              section 2 bringing it back into view when it needs it. */}
          <div ref={mapRef} className="scroll-mt-20">
            <UniverseMap
              viewport={geometry?.viewport ?? null}
              vocabulary={VOCABULARY}
              selected={selected}
              neighbours={neighbours}
              highlighted={highlighted}
              formatScore={score}
              onSelect={setSelected}
              copy={copy.map}
            />
          </div>

          <section
            aria-labelledby="eu-neighbours-heading"
            className="mx-auto max-w-[44rem] !mt-10"
          >
            <h2 id="eu-neighbours-heading" className="sr-only">
              {copy.explore.neighboursTitle}
            </h2>
            <p className="sr-only" aria-live="polite">
              {copy.explore.announce(current.en, current.tr)}
            </p>
            <div className="space-y-8">
              <WordSearch vocabulary={VOCABULARY} onSelect={setSelected} copy={copy.search} />
              <NeighbourList
                anchor={current}
                neighbours={neighbours}
                vocabulary={VOCABULARY}
                formatScore={score}
                onSelect={setSelected}
                copy={copy.neighbours}
              />
            </div>
          </section>

          {/* 2 — the same points, now saying something else. */}
          <div className="mx-auto max-w-[44rem]">
            <LabSection
              kicker={copy.projection.kicker}
              title={copy.projection.title}
              lede={copy.projection.lede}
            >
              <ProjectionReveal
                mode={mode}
                onModeChange={showPair}
                hidden={geometry?.distortion.hiddenNeighbour ?? null}
                falsePair={geometry?.distortion.falseNeighbour ?? null}
                vocabulary={VOCABULARY}
                // Ranks run 1..count-1: a word is never its own neighbour.
                total={Math.max(0, (set?.count ?? 0) - 1)}
                variance={variance}
                combined={combined}
                rankCorrelation={geometry?.distortion.rankCorrelation ?? null}
                remainingDimensions={hiddenDimensions(set?.dimensions ?? 0, 2)}
                formatScore={score}
                formatPercent={formatPercent}
                copy={copy.projection}
              />
            </LabSection>
          </div>
        </>
      )}

      {/* 3 — three lines, then where the vectors came from. The technical
          provenance lives here, after the interaction, never in front of it. */}
      <LabRecap
        lessons={copy.recap.lessons}
        footer={
          <>
            <span className="block">{copy.honesty.source}</span>
            <span className="mt-3 block">{copy.honesty.turkish}</span>
          </>
        }
      />
    </div>
  );
}
