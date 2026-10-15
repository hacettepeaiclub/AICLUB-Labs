/**
 * After the bundle: one static HTML file per route, plus a sitemap and robots.
 *
 * ## The problem this solves
 *
 * This is a single-page app. Vite emits one `index.html` whose body is an
 * empty `<div id="root">`, and the server rewrites every path to it. That is
 * fine for a visitor, whose browser runs the app — and useless for everything
 * that does not: WhatsApp, Discord, Slack, LinkedIn and Twitter all fetch the
 * URL, read the markup as served, and never execute a line of JavaScript. Up
 * to now every lab in the collection shared one title, "AI Club Labs", and had
 * no picture, no description and no canonical URL. A link to a lab posted in a
 * group chat — which is how a student club actually distributes anything —
 * showed a bare URL.
 *
 * ## What it does instead
 *
 * Takes the built `index.html` and writes a copy per route with that route's
 * `<title>`, description, Open Graph and Twitter tags, canonical link, and a
 * `<noscript>` heading so there is something to read if the app never boots.
 * The app itself is untouched: the same bundle loads, React mounts over the
 * same empty root, and `useDocumentHead` takes the title from there.
 *
 * The route list is not written here. It is loaded out of the app's own source
 * through Vite's SSR pipeline, so adding a lab to the registry adds its page,
 * its sitemap entry and its card with no second place to remember.
 *
 * ## What the server needs to do
 *
 * Serve `/labs/tokenization` from `labs/tokenization/index.html` when it exists, and
 * fall back to `/index.html` otherwise — which is what a static host does by
 * default, and what an SPA rewrite rule must be narrowed to allow. See
 * `docs/DEPLOY.md`.
 */

import { createServer } from "vite";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// The same folder Vite just built into: `OUT_DIR` when the deploy builds
// beside the live site, `dist` otherwise.
const DIST = path.resolve(process.env.OUT_DIR ?? "dist");

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * The page's security policy, written into every page the build produces.
 *
 * The server sends no security headers of its own, so the policy travels in
 * the page as a `<meta http-equiv>`, which browsers apply the same way except
 * for `frame-ancestors` (see docs/DEPLOY.md for the header the server should
 * add). It allows exactly what the site does: its own files, the analytics
 * script and the address it reports to, a worker of its own, and the inline
 * scripts in this very page, each allowed by the hash of its own text, so
 * editing one cannot silently break it or open the door to any other.
 * `upgrade-insecure-requests` turns any http request the page makes into an
 * https one.
 */
const ANALYTICS = ["https://cloud.umami.is", "https://gateway.umami.is"];

function securityPolicy(html) {
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    ([, body]) => `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`,
  );
  const policy =
    [
      "default-src 'self'",
      `script-src 'self' ${ANALYTICS[0]} ${hashes.join(" ")}`.trim(),
      // React writes style attributes, and the design tokens set custom
      // properties inline; neither can carry a hash.
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' ${ANALYTICS.join(" ")}`,
      "worker-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      // A closing semicolon on purpose. Some antivirus products append their
      // own directive to a page's policy without one, and on a policy ending in
      // `upgrade-insecure-requests` that turned the pair into one malformed
      // directive and a console error on every page.
    ].join("; ") + ";";
  const tags = [
    `<meta http-equiv="Content-Security-Policy" content="${escape(policy)}" />`,
    '<meta name="referrer" content="strict-origin-when-cross-origin" />',
  ];
  // Straight after the charset, so the policy is in force before any script.
  return html.replace(/(<meta charset="[^"]*" \/>)/i, `$1\n    ${tags.join("\n    ")}`);
}

/**
 * `<link rel="modulepreload">` for a lab's own code.
 *
 * A lab is lazy-loaded, so its chunk used to be requested only after the
 * entry bundle had downloaded, run, and routed: two round trips one after
 * the other before the lab could draw. The page already knows which lab it
 * is, so it names that lab's chunks itself and the browser fetches them
 * alongside the entry. Read from Vite's manifest, so a renamed chunk can
 * never leave a stale address behind; the entry's own chunks are already
 * preloaded by Vite and are left out.
 */
function labPreloads(manifest, slug) {
  const key = `src/labs/${slug}/index.tsx`;
  if (!manifest[key]) return "";
  const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
  const skip = new Set([entry?.file, ...(entry?.imports ?? []).map((k) => manifest[k]?.file)]);
  const files = new Set();
  const walk = (k) => {
    const chunk = manifest[k];
    if (!chunk || files.has(chunk.file) || skip.has(chunk.file)) return;
    files.add(chunk.file);
    for (const dep of chunk.imports ?? []) walk(dep);
  };
  walk(key);
  return [...files]
    .map((file) => `    <link rel="modulepreload" crossorigin href="/${file}" />`)
    .join("\n");
}

/** The tags a route contributes, as one indented block. */
function head(route) {
  const { meta } = route;
  const tags = [
    ["meta", { name: "description", content: meta.description }],
    ["link", { rel: "canonical", href: meta.url }],
    ["meta", { property: "og:site_name", content: "AI Club Labs" }],
    ["meta", { property: "og:type", content: meta.type }],
    ["meta", { property: "og:title", content: meta.title }],
    ["meta", { property: "og:description", content: meta.description }],
    ["meta", { property: "og:url", content: meta.url }],
    ["meta", { property: "og:image", content: meta.image }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    ["meta", { property: "og:locale", content: "en_GB" }],
    ["meta", { property: "og:locale:alternate", content: "tr_TR" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: meta.title }],
    ["meta", { name: "twitter:description", content: meta.description }],
    ["meta", { name: "twitter:image", content: meta.image }],
  ];
  if (!route.indexed) tags.push(["meta", { name: "robots", content: "noindex, follow" }]);

  return tags
    .map(
      ([tag, attrs]) =>
        `    <${tag} ${Object.entries(attrs)
          .map(([k, v]) => `${k}="${escape(v)}"`)
          .join(" ")} />`,
    )
    .join("\n");
}

/**
 * The one thing a reader gets if the bundle never arrives.
 *
 * Not an attempt at server rendering: the labs are canvases and simulations
 * and there is nothing honest to render for them without a browser. It is the
 * page's name and its sentence, which is also what a crawler that does run
 * JavaScript will find confirmed a moment later.
 */
function noscript(route) {
  return `    <noscript>
      <h1>${escape(route.meta.title)}</h1>
      <p>${escape(route.meta.description)}</p>
      <p><a href="/">All labs</a></p>
    </noscript>`;
}

/**
 * A page that only forwards. `replace` keeps the old address out of the
 * history, so Back does not bounce the visitor into it again; the query and
 * the hash travel with them. The meta refresh covers a browser with
 * JavaScript off, and the canonical link and `noindex` tell a search engine
 * which address is the real one.
 */
function redirectPage(to, canonical) {
  const target = escape(to);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Moved</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${escape(canonical)}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
  </head>
  <body>
    <p>This lab has moved to <a href="${target}">${target}</a>.</p>
  </body>
</html>
`;
}

function sitemap(routes, siteUrl) {
  const entries = routes
    .filter((route) => route.indexed)
    .map((route) => {
      const lastmod = route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : "";
      const priority = route.path === "/" ? "1.0" : "0.8";
      return `  <url>
    <loc>${escape(siteUrl + (route.path === "/" ? "/" : route.path))}</loc>${lastmod}
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const robots = (siteUrl) => `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

async function main() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "warn",
  });

  let routes;
  let siteUrl;
  let renamed = {};
  try {
    const manifest = await vite.ssrLoadModule("/src/app/routesManifest.ts");
    routes = manifest.routes;
    siteUrl = manifest.siteUrl;
    renamed = (await vite.ssrLoadModule("/src/labs/renamed.ts")).RENAMED;
  } finally {
    await vite.close();
  }

  // The template's own description is the dev server's; every route writes
  // its own below, and a page with two leaves the choice to the crawler.
  const template = (await readFile(path.join(DIST, "index.html"), "utf8")).replace(
    /\s*<meta\s+name="description"[^>]*\/>/,
    "",
  );

  const manifestPath = path.join(DIST, ".vite", "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : {};

  // The Turkish shell dictionary's chunk, for index.html's early preload.
  const trShell = manifest["src/i18n/tr.ts"]?.file;
  const templateWithShell = trShell ? template.replace("__TR_SHELL__", `/${trShell}`) : template;

  let fallbacks = 0;
  for (const route of routes) {
    // A lab whose card has not been made yet would advertise an image that
    // 404s, and a scraper shows a broken picture rather than none. Until the
    // card exists, the lab borrows the collection's.
    const card = new URL(route.meta.image).pathname;
    if (!existsSync(path.join(DIST, card))) {
      route.meta = { ...route.meta, image: `${siteUrl}/og/home.jpg` };
      fallbacks++;
    }

    const slug = route.path.startsWith("/labs/") ? route.path.split("/")[2] : null;
    const preloads = slug ? labPreloads(manifest, slug) : "";
    const withHead = securityPolicy(templateWithShell)
      .replace("</head>", `${head(route)}${preloads ? `\n${preloads}` : ""}\n  </head>`)
      .replace("<title>AI Club Labs</title>", `<title>${escape(route.meta.title)}</title>`)
      .replace('<div id="root"></div>', `<div id="root"></div>\n${noscript(route)}`);

    const file =
      route.path === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.path.replace(/^\//, ""), "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, withHead, "utf8");
  }

  // Every address a lab used to have still answers, by sending the browser to
  // the new one. The server can do this better with a 301 (see DEPLOY.md);
  // this page is what makes the old links work even where it does not.
  for (const [from, to] of Object.entries(renamed)) {
    const file = path.join(DIST, "labs", from, "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(
      file,
      securityPolicy(redirectPage(`/labs/${to}/`, `${siteUrl}/labs/${to}/`)),
      "utf8",
    );
  }

  await writeFile(path.join(DIST, "sitemap.xml"), sitemap(routes, siteUrl), "utf8");
  // Its work is done; the server has no reason to publish the file map.
  await rm(path.join(DIST, ".vite"), { recursive: true, force: true });
  await writeFile(path.join(DIST, "robots.txt"), robots(siteUrl), "utf8");

  const indexed = routes.filter((r) => r.indexed).length;
  console.log(
    `prerendered ${routes.length} routes (${indexed} indexed), ${Object.keys(renamed).length} redirects from old addresses, sitemap.xml and robots.txt → ${siteUrl}`,
  );
  if (fallbacks > 0) {
    console.log(
      `${fallbacks} route(s) have no card of their own yet and use /og/home.jpg — see docs/DEPLOY.md`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
