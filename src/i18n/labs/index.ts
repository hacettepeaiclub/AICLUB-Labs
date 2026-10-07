import { useLanguage } from "@/i18n";
import type { Language } from "@/app/preferences";
import type { LabsCopy, LabSlug } from "./types";

/**
 * The teaching copy, fetched one lab at a time.
 *
 * ## Why it is not in the shell dictionary
 *
 * The prose for the whole collection is ~200 KB of source per language and
 * none of it is readable from the home page. Sitting in `en.ts` it made up 98%
 * of the entry bundle: every visitor who landed on the grid downloaded every
 * lab's sections, recaps and source notes, and most of them opened none. It
 * travels on its own now.
 *
 * ## Why one chunk per lab, not one per language
 *
 * It used to be one chunk per language, on the argument that a second lab
 * would otherwise cost a second round trip. That stopped holding as the
 * collection grew: at sixteen labs the language chunk was ~55 KB gzipped —
 * more than the lab's own code — and a visitor who opened one lab paid for all
 * sixteen. And the round trip it was saving is not there: every lab is already
 * its own lazy chunk, so opening a second lab is a fetch regardless. Its copy
 * now rides alongside, requested at the same moment (see `prefetchLabCopy` and
 * its callers), so the two arrive together instead of one after the other.
 *
 * ## Why it suspends rather than returning null
 *
 * A lab is already a lazy chunk behind `<Suspense>` in `LabPage`, with a
 * spinner the visitor has seen before. Loading the copy the same way puts both
 * fetches behind the same spinner — rather than rendering a lab full of
 * missing strings for a frame, or threading a "still loading" branch through
 * every lab component.
 *
 * `useLabCopy` throwing a promise is what `React.lazy` does internally; the
 * boundary that catches the lab's own chunk catches this too.
 */

type LabModule = { default: LabsCopy[LabSlug] };
type Loader = () => Promise<LabModule>;

// One lazy loader per file. The `index.ts` in each folder gathers the whole
// collection for tests and types; it is excluded here, so it never ships.
const loaders: Record<Language, Record<string, Loader>> = {
  en: import.meta.glob<LabModule>(["./en/*.ts", "!./en/index.ts"]),
  tr: import.meta.glob<LabModule>(["./tr/*.ts", "!./tr/index.ts"]),
};

const cache = new Map<string, LabsCopy[LabSlug]>();
const inFlight = new Map<string, Promise<LabsCopy[LabSlug]>>();
const failed = new Map<string, unknown>();

function load(slug: LabSlug, language: Language): Promise<LabsCopy[LabSlug]> {
  const key = `${language}/${slug}`;
  const existing = inFlight.get(key);
  if (existing) return existing;

  const loader = loaders[language][`./${language}/${slug}.ts`];
  if (!loader) return Promise.reject(new Error(`No ${language} copy for the "${slug}" lab`));

  const promise = loader().then(
    (module) => {
      cache.set(key, module.default);
      inFlight.delete(key);
      return module.default;
    },
    (error: unknown) => {
      // Kept, so the next read throws it rather than suspending again. A
      // rejected promise thrown to `<Suspense>` is not an error to React, only
      // a reason to try again: it would re-render, ask again, and leave the
      // spinner up for good instead of handing the failure to the lab's error
      // boundary. Retrying in place would not help anyway — browsers remember
      // a module that failed to load — which is why that boundary's retry
      // reloads the page, and a reload clears this too.
      failed.set(key, error);
      inFlight.delete(key);
      throw error;
    },
  );

  inFlight.set(key, promise);
  return promise;
}

/**
 * One lab's copy in the active language.
 *
 * Suspends on the first call for a lab and language, so it must be rendered
 * inside a `<Suspense>` boundary — which every lab already is.
 */
export function useLabCopy<S extends LabSlug>(slug: S): LabsCopy[S] {
  const { language } = useLanguage();
  const key = `${language}/${slug}`;
  const copy = cache.get(key);
  if (copy) return copy as LabsCopy[S];
  // What `React.lazy` does with a chunk that would not load.
  if (failed.has(key)) throw failed.get(key);
  throw load(slug, language);
}

/**
 * Start a lab's copy downloading without reading it.
 *
 * Called wherever the lab's code is preloaded — a card pointed at, a palette
 * row highlighted, the "next" link scrolled into view — and by `LabPage` as it
 * renders, so the copy is in flight beside the lab's chunk rather than after
 * it. A failed prefetch is swallowed: it must never surface as an error on a
 * page that is working; the read that needs the copy reports it.
 */
export const prefetchLabCopy = (slug: string, language: Language): void => {
  // Not every lab has prose: a slug without a file has nothing to fetch.
  if (!loaders[language][`./${language}/${slug}.ts`]) return;
  const key = `${language}/${slug}`;
  if (cache.has(key) || failed.has(key)) return;
  load(slug as LabSlug, language).catch(() => {});
};

export type { LabsCopy, LabSlug } from "./types";
