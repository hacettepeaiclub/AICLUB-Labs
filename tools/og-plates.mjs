/**
 * Link-preview cards for the labs that have no specimen photograph.
 *
 *     npm run build
 *     npm i -D sharp playwright && npx playwright install chromium
 *     node tools/og-plates.mjs
 *     npm un sharp playwright
 *
 * ## Why this exists
 *
 * `og-images.mjs` makes a card from each lab's specimen photograph, and the
 * labs added after the photographs stopped — the site moved to drawing each
 * lab's own diagram instead (`LabPlate`) — had no card at all. A link to one
 * of them showed the collection's picture rather than its own.
 *
 * ## What the card shows
 *
 * The lab's plate, exactly as it stands beside the lab's title: the lab's own
 * diagram on plotting paper inside a hairline frame. It is captured from the
 * built site rather than redrawn here, so the card cannot drift from the page,
 * and it is rendered at the card's size rather than enlarged from a small
 * screenshot: the device pixel ratio is chosen so the vector plate is drawn
 * at full resolution. Motion is reduced, so every diagram is caught at rest.
 *
 * It sits on the page's near-black, letterboxed like the photographs, at the
 * same 1200×630 and the same JPEG settings, so a card made here and one made
 * from a photograph are the same kind of file.
 *
 * Only labs without a specimen photograph get a card here; the rest keep
 * theirs. Output is committed, like the others (see `og-images.mjs`).
 */

import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer, preview } from "vite";

const DIST = path.resolve("dist");
const SPECIMENS = path.resolve("src/assets/specimens");
const OUT = path.resolve("public/og");

/** The page's `--ink-950`, as in `og-images.mjs`. */
const GROUND = { r: 10, g: 10, b: 15, alpha: 1 };
const WIDTH = 1200;
const HEIGHT = 630;
/** The plate's height on the card; the rest is ground above and below. */
const PLATE_HEIGHT = 560;

async function main() {
  let sharp, chromium;
  try {
    ({ default: sharp } = await import("sharp"));
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(
      "sharp and playwright are deliberately not dependencies:\n" +
        "  npm i -D sharp playwright && npx playwright install chromium\n" +
        "  node tools/og-plates.mjs && npm un sharp playwright",
    );
    process.exit(1);
  }
  if (!existsSync(path.join(DIST, "index.html"))) {
    console.error("No build to photograph. Run `npm run build` first.");
    process.exit(1);
  }

  // The lab list comes from the registry, the way `prerender.mjs` reads it,
  // so a new lab needs no entry here.
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  let slugs;
  try {
    const { labs } = await vite.ssrLoadModule("/src/labs/registry.ts");
    slugs = labs
      .filter((lab) => !lab.meta.draft)
      .map((lab) => lab.meta.slug)
      .filter((slug) => !existsSync(path.join(SPECIMENS, `${slug}.webp`)));
  } finally {
    await vite.close();
  }
  if (slugs.length === 0) {
    console.log("Every lab has a specimen photograph; nothing to draw.");
    return;
  }

  const server = await preview({ preview: { port: 0, open: false } });
  const base = server.resolvedUrls.local[0].replace(/\/$/, "");
  const browser = await chromium.launch();

  const open = async (slug, deviceScaleFactor) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor,
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${base}/labs/${slug}`, { waitUntil: "networkidle" });
    // A string, so this Node script needs no browser globals to lint.
    await page.evaluate("document.fonts.ready");
    return { context, plate: page.locator("header .plate-frame").first() };
  };

  try {
    for (const slug of slugs) {
      // Measured once at 1×, then drawn again at whatever ratio makes it
      // PLATE_HEIGHT device pixels tall.
      const probe = await open(slug, 1);
      const box = await probe.plate.boundingBox();
      await probe.context.close();
      if (!box) throw new Error(`/labs/${slug} has no plate in its header`);

      const { context, plate } = await open(slug, PLATE_HEIGHT / box.height);
      const shot = await plate.screenshot({ animations: "disabled" });
      await context.close();

      const fitted = await sharp(shot)
        .resize({ height: PLATE_HEIGHT, kernel: "lanczos3" })
        .png()
        .toBuffer();
      const card = await sharp({
        create: { width: WIDTH, height: HEIGHT, channels: 3, background: GROUND },
      })
        .composite([{ input: fitted, gravity: "centre" }])
        .jpeg({ quality: 82, progressive: true, chromaSubsampling: "4:4:4" })
        .toBuffer();

      const target = path.join(OUT, `${slug}.jpg`);
      await writeFile(target, card);
      console.log(`${path.relative(process.cwd(), target)}  ${(card.length / 1024).toFixed(0)} kB`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
