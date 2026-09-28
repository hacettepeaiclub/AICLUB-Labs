import { useEffect } from "react";
import type { PageMeta } from "./siteMeta";

/**
 * Keeps the document's head in step with the page being shown.
 *
 * ## What this is for, and what it is not for
 *
 * This is for the visitor: the browser tab, the bookmark they make, the entry
 * in their history, and what a screen reader announces after a navigation —
 * all of which read `document.title`, and all of which were saying
 * "AI Club Labs" on every page of the site.
 *
 * It is *not* what makes a shared link show a card. Link previews are fetched
 * by scrapers that never run JavaScript, so they see the markup as served.
 * That is `tools/prerender.mjs`, which writes the same fields into a static
 * HTML file per route at build time. The two read from `siteMeta.ts` so they
 * cannot disagree.
 *
 * ## Why it writes the social tags too
 *
 * They cost four `setAttribute` calls and they keep the live document honest —
 * anyone who inspects a page, or any tool that reads the DOM rather than the
 * response body, sees the same thing the scraper was given.
 */
export function useDocumentHead(meta: PageMeta): void {
  useEffect(() => {
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", meta.url);
    setMeta("property", "og:type", meta.type);
    setMeta("property", "og:image", meta.image);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", meta.image);
    setLink("canonical", meta.url);
  }, [meta.title, meta.description, meta.url, meta.type, meta.image]);
}

/**
 * Set a `<meta>`, creating it if the prerendered head did not have one.
 *
 * `attribute` is `name` or `property` because the two vocabularies disagree:
 * Open Graph uses `property`, Twitter and the HTML spec use `name`, and a tag
 * written with the wrong one is ignored rather than wrong-looking.
 */
function setMeta(attribute: "name" | "property", key: string, value: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

function setLink(rel: string, href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}
