/**
 * Telling a page that could not be downloaded from a page that broke.
 *
 * A lab is a lazy chunk. When its file cannot be fetched, the dynamic import
 * rejects with a message that names the failure — the wording differs per
 * browser — and that is all there is to go on. Anything else thrown while
 * rendering is a bug in the page.
 */
const LOAD_FAILURE =
  /dynamically imported module|Importing a module script failed|Unable to preload CSS|Loading (CSS )?chunk/i;

export function isLoadFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "ChunkLoadError" || LOAD_FAILURE.test(error.message);
}

/**
 * The file that failed, when the message names one on this site.
 *
 * Chrome and Firefox put the address in the message; Safari does not, and
 * then there is nothing to check.
 */
export function failedFile(error: unknown, origin: string): string | null {
  if (!(error instanceof Error)) return null;
  const match = /(https?:\/\/[^\s"')]+|\/[^\s"')]+\.(?:m?js|css))/.exec(error.message);
  if (!match?.[1]) return null;
  try {
    const url = new URL(match[1], origin);
    return url.origin === origin ? url.href : null;
  } catch {
    return null;
  }
}

const PROBE_TIMEOUT = 8000;

/**
 * Whether the site answers right now.
 *
 * `navigator.onLine` saying `true` only means some network is up; this asks
 * the server itself, bypassing every cache, before anything is reloaded. A
 * reload that cannot reach the server would swap the page for the browser's
 * own error screen.
 */
export async function siteAnswers(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
  try {
    const response = await fetch(import.meta.env.BASE_URL, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Whether a file the page asked for no longer exists: the site was deployed
 * again while the tab was open, and the file names changed. The server
 * answers a missing address either with a 404 or, in some setups, with the
 * app's own HTML page in its place.
 */
export async function fileIsGone(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (response.status === 404 || response.status === 410) return true;
    return response.ok && (response.headers.get("content-type") ?? "").includes("text/html");
  } catch {
    return false;
  }
}

/**
 * Preload links on this page whose download failed.
 *
 * Vite puts a `<link rel="modulepreload">` (or a stylesheet link) in the page
 * for each file a lazy page needs, just before importing it. WebKit keeps a
 * failed preload in its memory cache: after the connection comes back, even a
 * full reload hands the next import of that file the old failure, without
 * asking the network, and the page cannot recover. Requesting the file again
 * with a plain request clears it. So failed preloads are noted here, from
 * the links' own `error` events, and asked for once more before a reload.
 * Chromium does not need this; it costs it nothing but those requests.
 */
const failedPreloads = new Set<string>();

if (typeof document !== "undefined") {
  document.addEventListener(
    "error",
    (event) => {
      const link = event.target;
      if (!(link instanceof HTMLLinkElement) || !link.href) return;
      if (!/^(modulepreload|preload|stylesheet)$/.test(link.rel)) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin) failedPreloads.add(url.href);
    },
    // Load errors do not bubble; they can only be seen on the way down.
    true,
  );
}

/**
 * Reload the page, first asking again for every preload that failed, so the
 * reloaded page does not inherit the failure (see `failedPreloads`).
 */
export async function reloadPage(shouldReload: () => boolean = () => true): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
  await Promise.all(
    [...failedPreloads].map((href) =>
      fetch(href, { cache: "reload", signal: controller.signal }).catch(() => undefined),
    ),
  );
  clearTimeout(timer);
  // Navigation or a newer recovery can supersede the download while it waits.
  if (!shouldReload()) return false;
  window.location.reload();
  return true;
}
