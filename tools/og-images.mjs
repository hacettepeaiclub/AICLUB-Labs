/**
 * The pictures a shared link shows. Run by hand, output committed.
 *
 *     npx --yes sharp-cli@latest --version   # (sharp is not a dependency)
 *     npm i -D sharp && node tools/og-images.mjs && npm un sharp
 *
 * ## Why these are generated once and checked in
 *
 * They change only when a lab is added or a specimen is reshot, and the
 * alternative — making them during `npm run build` — would put a native image
 * library on the critical path of a deploy that runs `npm install` on a small
 * server. A broken build there is a site that stops updating; a stale picture
 * here is one command away from fixed. So `public/og/` is a build artefact
 * that lives in the repository on purpose.
 *
 * ## Why JPEG, and why 1200×630
 *
 * The specimen photographs ship to the browser as WebP, which is correct for
 * the site and wrong here: WhatsApp and LinkedIn — between them most of how
 * this club's links actually travel — still do not reliably render a WebP
 * `og:image`, and a card that falls back to no picture is worse than a heavier
 * file nobody downloads twice. 1200×630 is the size every scraper documents.
 *
 * ## Why the object is letterboxed rather than cropped
 *
 * The specimens are 960×905, near square, with the object centred on its
 * plinth. Cropping to 1.91:1 would cut the top of every object off. Fitting it
 * inside the frame on the page's own near-black leaves the photograph intact
 * and reads as the same dark room the pictures were shot in.
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SPECIMENS = path.resolve("src/assets/specimens");
const OUT = path.resolve("public/og");

/** The page's `--ink-950`, so the frame and the photograph share a ground. */
const GROUND = { r: 10, g: 10, b: 15, alpha: 1 };
const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error(
      "sharp is not installed. It is deliberately not a dependency:\n" +
        "  npm i -D sharp && node tools/og-images.mjs && npm un sharp",
    );
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const card = (input, options) =>
    sharp(input)
      .resize(WIDTH, HEIGHT, { fit: "contain", background: GROUND, ...options })
      .flatten({ background: GROUND })
      .jpeg({ quality: 82, progressive: true, chromaSubsampling: "4:4:4" })
      .toBuffer();

  const write = async (name, buffer) => {
    const target = path.join(OUT, `${name}.jpg`);
    await writeFile(target, buffer);
    console.log(`${path.relative(process.cwd(), target)}  ${(buffer.length / 1024).toFixed(0)} kB`);
  };

  // The large variants only; the `-sm` companions are for the lab page. The
  // empty plinth is skipped: a 404 is not a page anyone shares.
  const files = (await readdir(SPECIMENS)).filter(
    (name) => name.endsWith(".webp") && !name.endsWith("-sm.webp") && name !== "not-found.webp",
  );

  for (const file of files) {
    await write(path.basename(file, ".webp"), await card(path.join(SPECIMENS, file)));
  }

  // The collection speaks for itself with the club's mark rather than with any
  // one lab's object: the home page is not an exhibit, it is the room.
  const mark = await sharp(path.resolve("src/assets/aiclub-mark-white.png"))
    .resize({ height: Math.round(HEIGHT * 0.52), fit: "inside" })
    .toBuffer();
  await write(
    "home",
    await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: GROUND } })
      .composite([{ input: mark, gravity: "centre" }])
      .jpeg({ quality: 86, progressive: true, chromaSubsampling: "4:4:4" })
      .toBuffer(),
  );

  console.log(`\n${files.length + 1} cards written to public/og/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
