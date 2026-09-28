import { useLanguage } from "@/i18n";
import type { Language } from "@/app/preferences";
import type { LabsCopy } from "./types";

/**
 * The teaching copy, fetched when a lab is.
 *
 * ## Why it is not in the shell dictionary
 *
 * The prose for the whole collection is ~150 KB of source per language and
 * none of it is readable from the home page. Sitting in `en.ts` it made up 98%
 * of the entry bundle: every visitor who landed on the grid downloaded eleven
 * labs' worth of sections, recaps and source notes, and most of them opened
 * none. It travels on its own now.
 *
 * ## Why it suspends rather than returning null
 *
 * A lab is already a lazy chunk behind `<Suspense>` in `LabPage`, with a
 * spinner the visitor has seen before. Loading the copy the same way puts both
 * fetches in flight together and behind the same spinner — rather than
 * rendering a lab full of missing strings for a frame, or threading a
 * "still loading" branch through every lab component.
 *
 * `useLabs` throwing a promise is what `React.lazy` does internally; the
 * boundary that catches the lab's own chunk catches this too.
 *
 * ## Why one chunk per language, not one per lab
 *
 * Splitting per lab would save a visitor who opens exactly one lab about 30 KB
 * gzipped, and cost every visitor who opens a second one a round trip. The
 * first lab is the expensive one either way, and the collection is meant to be
 * browsed.
 */

const cache = new Map<Language, LabsCopy>();
const inFlight = new Map<Language, Promise<LabsCopy>>();

function load(language: Language): Promise<LabsCopy> {
  const existing = inFlight.get(language);
  if (existing) return existing;

  const promise = (
    language === "tr"
      ? import("./tr").then((module) => module.trLabs)
      : import("./en").then((module) => module.enLabs)
  ).then((copy) => {
    cache.set(language, copy);
    inFlight.delete(language);
    return copy;
  });

  inFlight.set(language, promise);
  return promise;
}

/**
 * The lab dictionary for the active language.
 *
 * Suspends on the first call in a language, so it must be rendered inside a
 * `<Suspense>` boundary — which every lab already is.
 */
export function useLabs(): LabsCopy {
  const { language } = useLanguage();
  const copy = cache.get(language);
  if (copy) return copy;
  throw load(language);
}

/**
 * Start the fetch without reading the result.
 *
 * The home page calls this when a lab card is pointed at, so the copy is on
 * its way before the click rather than after it.
 */
export const prefetchLabs = (language: Language): void => {
  if (!cache.has(language)) void load(language);
};

export type { LabsCopy, LabSlug } from "./types";
