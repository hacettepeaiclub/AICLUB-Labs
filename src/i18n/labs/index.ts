import { useLanguage, useLanguageDependency } from "@/i18n";
import type { Language } from "@/app/preferences";
import { failedFile, isLoadFailure } from "@/components/layout/loadFailure";
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
/** The last failed attempt per copy file, whoever made it; cleared on success. */
const lastFailure = new Map<string, unknown>();
let retries = 0;

/**
 * Where to ask again for a file whose import already failed in this document.
 *
 * Browsers keep a failed module in their module map: a second `import()` of
 * the same address rejects at once without a request (seen in Chromium, and
 * WebKit keeps failures too). So a retry asks for the same file under a query the
 * map has never seen. The address comes from the failure's own message, which
 * Chromium and Firefox include; WebKit's does not name it, and there the read
 * fails and the lab's boundary offers the reload, which recovers everywhere.
 */
function freshAddress(error: unknown, slug: LabSlug): string | null {
  // A wrapper (a bundler's preload helper, a test runner) may keep the
  // browser's own error as its `cause`.
  const cause = error instanceof Error ? error.cause : undefined;
  const origin = window.location.origin;
  for (const candidate of [error, cause]) {
    // Only a module that could not be downloaded is worth asking for again;
    // nothing else thrown while loading may choose what gets imported.
    if (!isLoadFailure(candidate)) continue;
    const file = failedFile(candidate, origin);
    if (!file) continue;
    const url = new URL(file);
    // This lab's own copy file — `pca-<hash>.js` built, `pca.ts` in source —
    // and not some other module a preload helper happened to name, nor a
    // sibling lab whose slug starts the same (`word-embeddings-3d`).
    const name = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
    if (!copyFileName(slug).test(name)) continue;
    url.searchParams.set("retry", String(++retries));
    // Root-relative, so test runners that cannot import `http:` resolve it
    // too; and checked to resolve back to this origin, so a path that starts
    // with `//` cannot turn into another host.
    const address = url.pathname + url.search;
    if (address.startsWith("//") || new URL(address, origin).origin !== origin) continue;
    return address;
  }
  return null;
}

/** A lab's copy file: a built chunk (Vite's 8-character hash) or its source module. */
const copyFileName = (slug: LabSlug): RegExp => {
  const name = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${name}(?:-[\\w-]{8}\\.m?js|\\.ts)$`);
};

function load(slug: LabSlug, language: Language): Promise<LabsCopy[LabSlug]> {
  const key = `${language}/${slug}`;
  const existing = inFlight.get(key);
  if (existing) return existing;

  const loader = loaders[language][`./${language}/${slug}.ts`];
  if (!loader) return Promise.reject(new Error(`No ${language} copy for the "${slug}" lab`));

  const previous = lastFailure.has(key) ? freshAddress(lastFailure.get(key), slug) : null;
  const request: Promise<LabModule> = previous
    ? (import(/* @vite-ignore */ previous) as Promise<LabModule>)
    : loader();

  const promise = request
    .then((module) => {
      // What came back must be copy: an object, as every copy file exports.
      // Thrown here, it settles the same way as a failed download below.
      if (typeof module?.default !== "object" || module.default === null) {
        throw new TypeError(`The ${language} copy for "${slug}" did not load as copy`);
      }
      return module.default;
    })
    .then(
      (copy) => {
        cache.set(key, copy);
        lastFailure.delete(key);
        inFlight.delete(key);
        return copy;
      },
      (error: unknown) => {
        // Not recorded in `failed`: whether a failure is final depends on who
        // asked. Only a read records it (see `read`); a prefetch or a language
        // switch that fails leaves the next read free to ask again — at a
        // fresh address (see `freshAddress`).
        lastFailure.set(key, error);
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
  // A language switch waits for this lab's copy in the new language, so the
  // lab changes language in one step instead of suspending behind its spinner.
  // Its failure cancels the switch; it is not recorded in `failed`, because
  // the lab is still showing, whole, in the language it already has.
  useLanguageDependency((next) => copyFor(slug, next));
  const key = `${language}/${slug}`;
  const copy = cache.get(key);
  if (copy) return copy as LabsCopy[S];
  // What `React.lazy` does with a chunk that would not load.
  if (failed.has(key)) throw failed.get(key);
  throw read(slug, language);
}

/**
 * What a reading component suspends on.
 *
 * A read's own failure is recorded in `failed`, so the next render throws it
 * to the lab's error boundary. Throwing the rejected promise to `<Suspense>`
 * instead would not hand it over: to React a thrown promise is only a reason
 * to render again, so it would ask again and keep the spinner up for good.
 * The promise given to Suspense therefore never rejects; it settles, and the
 * render that follows finds either the copy or the recorded failure.
 *
 * A read that finds a download already under way — started by a prefetch
 * (a card pointed at while offline, say) or by a language switch — waits for
 * it, but does not adopt its failure. When it fails, the read asks once more,
 * this time as itself and at a fresh address (see `freshAddress`). That second
 * request is what lets a lab open normally after a prefetch failed and the
 * connection came back. Where the failure did not name its file (WebKit), the
 * second request fails too, it is recorded, and the boundary offers its
 * reload, which is the dependable recovery everywhere (see `ErrorBoundary`).
 */
function read(slug: LabSlug, language: Language): Promise<void> {
  const key = `${language}/${slug}`;
  const pending = inFlight.get(key);
  if (pending) return pending.then(settled, settled);
  return load(slug, language).then(settled, (error: unknown) => {
    failed.set(key, error);
  });
}

const settled = (): void => undefined;

/** One lab's copy, for a language switch to wait on; a lab without prose has nothing to wait for. */
function copyFor(slug: LabSlug, language: Language): Promise<unknown> {
  if (!loaders[language][`./${language}/${slug}.ts`]) return Promise.resolve();
  const cached = cache.get(`${language}/${slug}`);
  return cached ? Promise.resolve(cached) : load(slug, language);
}

/**
 * Start a lab's copy downloading without reading it.
 *
 * Called wherever the lab's code is preloaded — a card pointed at, a palette
 * row highlighted, the "next" link scrolled into view — and by `LabPage` as it
 * renders, so the copy is in flight beside the lab's chunk rather than after
 * it. A failed prefetch is swallowed and forgotten: it must never surface as
 * an error on a page that is working, and it must not poison the cache for
 * the read that comes later, which makes its own request and reports its own
 * failure.
 */
export const prefetchLabCopy = (slug: string, language: Language): void => {
  // Not every lab has prose: a slug without a file has nothing to fetch.
  if (!loaders[language][`./${language}/${slug}.ts`]) return;
  const key = `${language}/${slug}`;
  if (cache.has(key) || failed.has(key) || inFlight.has(key)) return;
  // Swallowed and not recorded: a prefetch that fails must not decide what
  // the read that needs the copy will get. That read asks again.
  load(slug as LabSlug, language).catch(() => {});
};

export type { LabsCopy, LabSlug } from "./types";
