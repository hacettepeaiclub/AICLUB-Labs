import { useMemo, useState } from "react";
import { Figure, FigureRow, LabRecap } from "@/components/lab";
import { useT } from "@/i18n";
import { formatPercent } from "@/lib/format";
import { nearestNeighbours } from "../embedding-universe/engine";
import { VOCABULARY } from "../embedding-universe/vocabulary";
import { NEIGHBOUR_COUNT, PREDICTION } from "../embedding-universe/view";
import { useSpace } from "./useSpace";
import { Universe3D } from "./components/Universe3D";

/**
 * Embedding Universe — 3D prototype.
 *
 * Built to answer one question: does a spatial version teach better than the
 * flat one? It is not part of the lesson. It has no prediction, no distortion
 * section and no recap, because adding those would make it a second lesson
 * rather than a look at an alternative.
 *
 * Everything it draws comes from the same frozen vocabulary and the same
 * shipped vectors as the published lab, through the same `pca` asked for three
 * components. `projection3d.test.ts` checks that PC1 and PC2 are the identical
 * axes the 2-D map uses, so this really is the same picture with one more
 * direction visible — not a different fit that happens to look nicer.
 */
export default function EmbeddingUniverse3D() {
  const t = useT();
  const copy = t.labs["embedding-universe-3d"];
  const { space, set, status, error, dimensions } = useSpace();

  const anchor = useMemo(() => VOCABULARY.findIndex((w) => w.id === PREDICTION.anchor), []);
  const [selected, setSelected] = useState(anchor);

  const neighbours = useMemo(() => {
    if (!set) return [];
    return nearestNeighbours(set.vectors, set.count, set.dimensions, selected, NEIGHBOUR_COUNT);
  }, [set, selected]);

  const current = VOCABULARY[selected];
  const score = (value: number) => value.toFixed(2);

  if (status === "error") {
    return (
      <div className="mx-auto max-w-prose text-center">
        <p className="text-body text-fg">{copy.error}</p>
        <p className="mt-2 font-mono text-caption text-fg-faint">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="mx-auto max-w-prose space-y-3">
        <p className="text-body-lg text-fg">{copy.lede}</p>
        {/* Said before the picture, not after it. A convincing spatial view is
            a better-looking misconception than a flat one if nothing corrects
            it: the space is 300-dimensional and this is three axes of it. */}
        <p className="text-body-sm text-fg-muted">{copy.honesty}</p>
      </div>

      <Universe3D
        points={space?.points ?? null}
        vocabulary={VOCABULARY}
        selected={selected}
        neighbours={neighbours}
        formatScore={score}
        onSelect={setSelected}
        copy={copy.map}
      />

      <div className="mx-auto max-w-[46rem] space-y-4">
        <FigureRow>
          <Figure
            label={copy.varianceLabel}
            value={space ? formatPercent(space.combined, 4) : "—"}
            hint={copy.varianceHint(dimensions)}
            tone="accent"
          />
          <Figure
            label={copy.selectedLabel}
            value={current?.en ?? "—"}
            hint={current?.tr ?? ""}
          />
        </FigureRow>
        <p className="text-body-sm text-fg-muted">{copy.compare}</p>
      </div>

      {/* The shell furniture every lab page has, with its heading overridden:
          this closes a prototype, it does not recap a lesson. */}
      <LabRecap title={copy.recapTitle} lessons={copy.recap.lessons} />
    </div>
  );
}
