import { en } from "@/i18n/en";
import { labs } from "@/labs/registry";
import { homeMeta, labMeta, SITE_URL } from "./siteMeta";
import type { PageMeta } from "./siteMeta";

/**
 * Every URL this site serves, with the head each one should be given.
 *
 * ## Who reads this
 *
 * `tools/prerender.mjs`, and nothing in the browser. It loads this module
 * through Vite's SSR pipeline after a build so the route list, the wording and
 * the URL shape all come from the same code the app uses, rather than from a
 * second list in a script that would quietly fall behind the registry.
 *
 * ## Why the copy is English
 *
 * These heads are what a link scraper sees, and they are served from one URL
 * per lab with no locale segment. See the note in `siteMeta.ts`.
 *
 * ## Why drafts are here
 *
 * A draft lab is routable but kept off the grid, so it gets a page with a
 * proper title — and `indexed: false`, which keeps it out of the sitemap and
 * puts `noindex` in its head. It is reachable by anyone with the link and by
 * nobody else.
 */

export interface Route {
  /** URL path, leading slash, no trailing slash except for the root. */
  path: string;
  meta: PageMeta;
  /** Whether it belongs in the sitemap and may be indexed. */
  indexed: boolean;
  /** ISO date, for the sitemap's `lastmod`. Absent for the home page. */
  lastmod?: string;
}

export const routes: Route[] = [
  {
    path: "/",
    meta: homeMeta(en.home.lede),
    indexed: true,
  },
  ...labs.map((lab): Route => {
    const copy = en.labMeta[lab.meta.slug as keyof typeof en.labMeta];
    return {
      path: `/labs/${lab.meta.slug}`,
      meta: labMeta(
        lab.meta.slug,
        copy?.title ?? lab.meta.title,
        copy?.description ?? lab.meta.description,
      ),
      indexed: !lab.meta.draft,
      lastmod: lab.meta.publishedAt,
    };
  }),
];

export const siteUrl = SITE_URL;
