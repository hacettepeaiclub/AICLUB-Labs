import type { Language } from "./preferences";

/**
 * What every page of this site says about itself.
 *
 * ## Why one module
 *
 * Two things need these strings and they must not drift: the browser tab,
 * which React updates as the visitor navigates, and the static `<head>` that
 * `tools/prerender.mjs` writes into one HTML file per route at build time.
 * Only the second one is ever seen by a link preview — WhatsApp, Discord,
 * LinkedIn and Slack read the markup as served and never run the app — and
 * only the first one is ever seen after the first paint.
 *
 * ## Why the static head is English
 *
 * There is one URL per lab and no locale segment, so a crawler has to be given
 * one language and it should be the one the document declares. The tab title
 * switches with the visitor's choice a moment later; a link preview cannot.
 */

/**
 * Where this is served from, without a trailing slash.
 *
 * Absolute URLs are not a preference here: `og:image` and `canonical` are
 * specified as absolute, and a relative one is dropped by most scrapers.
 * Overridable so a staging host does not advertise the production domain.
 */
export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL ?? "https://labs.hacettepeaiclub.com"
).replace(/\/+$/, "");

export const SITE_NAME = "AI Club Labs";

/** The card shown for the collection itself. */
export const DEFAULT_OG_IMAGE = "/og/home.jpg";

export interface PageMeta {
  /** The full `<title>`, already suffixed. */
  title: string;
  description: string;
  /** Absolute, for `og:image`. */
  image: string;
  /** Absolute, for `canonical` and `og:url`. */
  url: string;
  /** "website" for the collection, "article" for a lab. */
  type: "website" | "article";
}

const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * The collection's own card.
 *
 * The title is the bare site name: a home page that calls itself
 * "AI Club Labs — AI Club Labs" reads as a template nobody filled in.
 */
export function homeMeta(lede: string): PageMeta {
  return {
    title: `${SITE_NAME} — Hacettepe AI Club`,
    description: lede,
    image: absolute(DEFAULT_OG_IMAGE),
    url: absolute("/"),
    type: "website",
  };
}

/** One lab's card. `slug` decides the URL and the picture. */
export function labMeta(slug: string, title: string, description: string): PageMeta {
  return {
    title: `${title} — ${SITE_NAME}`,
    description,
    image: absolute(`/og/${slug}.jpg`),
    url: absolute(`/labs/${slug}`),
    type: "article",
  };
}

/** The card for a URL that is not a lab. Never indexed; see `prerender`. */
export function notFoundMeta(title: string, description: string): PageMeta {
  return {
    title: `${title} — ${SITE_NAME}`,
    description,
    image: absolute(DEFAULT_OG_IMAGE),
    url: absolute("/"),
    type: "website",
  };
}

/** The document language a given page is written in. */
export const htmlLang = (language: Language): string => language;
