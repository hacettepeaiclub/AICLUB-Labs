import { useEffect, useMemo, useState } from "react";
import {
  BASE_PATH,
  decodeInt16,
  type DatasetMeta,
  type EmbeddingSet,
} from "./dataset";
import { distortion, pca, type Distortion, type Projection } from "./engine";
import { toViewport, type Viewport } from "./view";

/**
 * Loading the universe, in the order the lab actually needs it.
 *
 * ## Why this is two stages rather than one
 *
 * Section 1's opening question needs similarity and nothing else, and a
 * similarity query over 318 words costs about half a millisecond. The map needs
 * PCA, and PCA over this matrix costs around 460ms — the second eigenvalue gap
 * is 0.964, so the power iteration has to grind.
 *
 * Doing both before showing anything would put half a second of dead screen in
 * front of the visitor for something the first interaction does not use. So the
 * question goes live as soon as the vectors decode, and the projection is
 * computed in a task scheduled after that paint — while the visitor is reading
 * three words and deciding. By the time a chip is clicked the coordinates have
 * been sitting ready for several seconds.
 *
 * That is also why there is no spinner anywhere in this lab. The expensive work
 * happens behind an interaction that takes longer than the work does.
 *
 * ## One projection
 *
 * `pca` runs exactly once per mount and both sections read the same result.
 * Section 2 does not recompute anything; it changes which two points are
 * emphasised in a map that is already on screen.
 */

export interface UniverseData {
  readonly meta: DatasetMeta;
  readonly set: EmbeddingSet;
}

export interface UniverseGeometry {
  readonly projection: Projection;
  readonly distortion: Distortion;
  /** Screen-space frame and point positions, sized to the data's own extent. */
  readonly viewport: Viewport;
}

export interface Universe {
  readonly status: "loading" | "ready" | "error";
  readonly error: string | null;
  readonly data: UniverseData | null;
  /** `null` until the deferred projection finishes. The map waits for this; the question does not. */
  readonly geometry: UniverseGeometry | null;
}

const url = (file: string): string => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}${BASE_PATH}${file}`;
};

export function useUniverse(): Universe {
  const [data, setData] = useState<UniverseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<UniverseGeometry | null>(null);

  // Stage one: fetch and decode. Only the int16 file is ever requested — the
  // float32 reference is a repository fixture and is not deployed.
  useEffect(() => {
    const controller = new AbortController();
    let live = true;

    (async () => {
      try {
        const metaResponse = await fetch(url("dataset.json"), { signal: controller.signal });
        if (!metaResponse.ok) throw new Error(`dataset.json: HTTP ${metaResponse.status}`);
        const meta = (await metaResponse.json()) as DatasetMeta;

        const binResponse = await fetch(url(meta.int16.file), { signal: controller.signal });
        if (!binResponse.ok) throw new Error(`${meta.int16.file}: HTTP ${binResponse.status}`);
        const bytes = await binResponse.arrayBuffer();

        // Throws on a wrong byte count or a zero row, so a corrupt download
        // becomes a stated error rather than a map full of NaNs.
        const set = decodeInt16(bytes, meta.wordCount, meta.dimensions);
        if (live) setData({ meta, set });
      } catch (cause) {
        if (!live || controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    })();

    return () => {
      live = false;
      controller.abort();
    };
  }, []);

  // Stage two: the projection, deferred past the paint that made the question
  // interactive. `setTimeout` rather than an idle callback because this must
  // happen promptly and reliably, not whenever the browser feels unbusy.
  useEffect(() => {
    if (!data) return;
    let live = true;
    const handle = setTimeout(() => {
      if (!live) return;
      const { set } = data;
      const projection = pca(set.vectors, set.count, set.dimensions, 2);
      const found = distortion(set.vectors, set.count, set.dimensions, projection);
      const viewport = toViewport(projection, set.count);
      if (live) setGeometry({ projection, distortion: found, viewport });
    }, 0);
    return () => {
      live = false;
      clearTimeout(handle);
    };
  }, [data]);

  return useMemo(
    () => ({
      status: error ? "error" : data ? "ready" : "loading",
      error,
      data,
      geometry,
    }),
    [data, error, geometry],
  );
}
