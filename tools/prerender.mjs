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
 * Serve `/labs/tokenizer` from `labs/tokenizer/index.html` when it exists, and
 * fall back to `/index.html` otherwise — which is what a static host does by
 * default, and what an SPA rewrite rule must be narrowed to allow. See
 * `docs/DEPLOY.md`.
 */

import { createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist");

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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
  try {
    const manifest = await vite.ssrLoadModule("/src/app/routesManifest.ts");
    routes = manifest.routes;
    siteUrl = manifest.siteUrl;
  } finally {
    await vite.close();
  }

  const template = await readFile(path.join(DIST, "index.html"), "utf8");

  for (const route of routes) {
    const withHead = template
      .replace("</head>", `${head(route)}\n  </head>`)
      .replace("<title>AI Club Labs</title>", `<title>${escape(route.meta.title)}</title>`)
      .replace('<div id="root"></div>', `<div id="root"></div>\n${noscript(route)}`);

    const file =
      route.path === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.path.replace(/^\//, ""), "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, withHead, "utf8");
  }

  await writeFile(path.join(DIST, "sitemap.xml"), sitemap(routes, siteUrl), "utf8");
  await writeFile(path.join(DIST, "robots.txt"), robots(siteUrl), "utf8");

  const indexed = routes.filter((r) => r.indexed).length;
  console.log(
    `prerendered ${routes.length} routes (${indexed} indexed), sitemap.xml and robots.txt → ${siteUrl}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
