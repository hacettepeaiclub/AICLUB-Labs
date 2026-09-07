import { useEffect, useMemo, useState } from "react";
import { BASE_PATH, decodeInt16, type DatasetMeta, type EmbeddingSet } from "../embedding-universe/dataset";
import { project3d, type Space3 } from "./projection3d";

/**
 * The prototype's loader.
 *
 * Deliberately its own thirty lines rather than a flag on `useUniverse`. The
 * production hook computes the 2-D projection and the distortion pair, neither
 * of which this view uses, and adding a branch to it would put prototype
 * concerns inside the file the lesson depends on. This reads the same shipped
 * int16 file through the same decoder and asks `pca` for three components.
 */
export interface Space {
  readonly status: "loading" | "ready" | "error";
  readonly error: string | null;
  readonly set: EmbeddingSet | null;
  readonly space: Space3 | null;
  readonly dimensions: number;
}

const url = (file: string): string => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}${BASE_PATH}${file}`;
};

export function useSpace(): Space {
  const [set, setSet] = useState<EmbeddingSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [space, setSpace] = useState<Space3 | null>(null);

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
        const decoded = decodeInt16(await binResponse.arrayBuffer(), meta.wordCount, meta.dimensions);
        if (live) setSet(decoded);
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

  // Deferred past the paint, same as the 2-D lab: three components cost a
  // little more than two, and neither should be spent before anything is shown.
  useEffect(() => {
    if (!set) return;
    let live = true;
    const handle = setTimeout(() => {
      if (live) setSpace(project3d(set.vectors, set.count, set.dimensions));
    }, 0);
    return () => {
      live = false;
      clearTimeout(handle);
    };
  }, [set]);

  return useMemo(
    () => ({
      status: error ? "error" : set ? "ready" : "loading",
      error,
      set,
      space,
      dimensions: set?.dimensions ?? 0,
    }),
    [set, space, error],
  );
}
