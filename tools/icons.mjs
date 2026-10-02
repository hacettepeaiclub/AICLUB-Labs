/**
 * Every icon the site ships, from the one logo the site draws.
 *
 *     npm i -D sharp && npm run icons && npm un sharp
 *
 * ## Why this exists
 *
 * The header draws `src/assets/aiclub-mark-white.png`. The tab, the bookmark,
 * the home-screen icon and the result in a search engine used to draw a
 * second logo: a thinner deer on a slate blue from an earlier palette. Two
 * logos is one too many; this makes the rest out of the first.
 *
 * ## The tab: the deer alone, in the colour the tab bar needs
 *
 * No badge and no ground — just the deer, the way the header draws it. The
 * catch is that the mark is white, and a white mark on a light tab bar is not
 * there at all. So the tab icon is an SVG whose fill follows
 * `prefers-color-scheme`: white on a dark browser, the club navy #003588 on a
 * light one. Chrome, Edge and Firefox draw SVG favicons and evaluate that
 * query against the browser's own theme.
 *
 * The SVG carries the deer as an embedded PNG used as a mask, not as paths:
 * the logo only exists as a raster, and tracing it would produce a second
 * drawing of it, which is the thing this file exists to prevent. A favicon is
 * rendered in a mode that blocks external files but allows `data:` URLs, so
 * the embedded image is what makes this work.
 *
 * `favicon.ico` is the fallback for everything that does not draw SVG — older
 * browsers, and most of the crawlers that put an icon beside a search result.
 * A raster cannot change colour, so it is navy: those places are light far
 * more often than not, and a search engine shows the icon on a light chip even
 * in its dark theme.
 *
 * ## Small sizes: a silhouette
 *
 * The deer is five thin strands. In a tab, at 16 and 32 pixels, a strand is
 * narrower than a pixel and the mark averages out to a pale smear of its own
 * colour and whatever is behind it. Those sizes draw the strands merged into
 * one solid shape — see `solid` — so the antlers and the V of the head read at
 * a glance. Type designers call this an optical size.
 *
 * ## The home screen is the exception
 *
 * An app icon cannot be transparent. iOS fills transparency with black, and
 * Android crops the icon to its launcher's shape and needs every pixel of the
 * square. So the Apple, Android and maskable icons are the white deer on the
 * site's own near-black, `--ink-950` — the deer as it appears on the site,
 * rather than on a coloured badge. At those sizes the strands have room and
 * are drawn as strands.
 *
 * ## Why the output is committed
 *
 * The same reason as `public/og`: a native image library on the critical path
 * of a deploy that runs `npm install` on a small server is a deploy that can
 * break, and icons change about once a year.
 */

import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = path.resolve("src/assets/aiclub-mark-white.png");
const OUT = path.resolve("public");

/** `--accent-fill`, the club's own navy: the deer on a light ground. */
const NAVY = "#003588";
/** `--ink-950`, the page itself: the ground of the home-screen icons. */
const INK = "#0a0a0f";

async function main() {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error("sharp is not installed, on purpose:\n  npm i -D sharp && npm run icons && npm un sharp");
    process.exit(1);
  }

  // The source PNG has a margin of transparency around the deer. Trimming it
  // makes the ratios below mean "how much of the square is deer".
  const mark = await sharp(await readFile(SOURCE)).trim().toBuffer();

  /**
   * The mark with its parallel strands merged into one solid shape.
   *
   * At high resolution the alpha is blurred until the gaps between strands
   * close, then thresholded back to a hard edge. Two pipelines, not one:
   * sharp applies its operations in a fixed order of its own, and in a single
   * chain the threshold runs before the blur. Blur 12 at this size is the
   * least that closes every gap; below it a dotted seam survives down the
   * head, above it the antlers start to swell together.
   */
  const big = await sharp(mark).resize(512, 512, { fit: "inside" }).toBuffer();
  const { width: bw, height: bh } = await sharp(big).metadata();
  const blurred = await sharp(big).extractChannel("alpha").blur(12).toBuffer();
  const silhouetteAlpha = await sharp(blurred).threshold(55).toColourspace("b-w").toBuffer();

  /** A mark in one colour, from an alpha channel. */
  const paint = (alpha, width, height, colour) =>
    sharp({ create: { width, height, channels: 3, background: colour } })
      .joinChannel(alpha)
      .png()
      .toBuffer();

  const silhouette = (colour) => paint(silhouetteAlpha, bw, bh, colour);

  /** The deer, `fill` of a transparent square, centred. */
  const bare = async (size, source, fill) => {
    const box = Math.round(size * fill);
    const deer = await sharp(source).resize(box, box, { fit: "inside", kernel: "lanczos3" }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: deer, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  /** The white deer on the page's ink, for places that refuse transparency. */
  const grounded = async (size, fill) => {
    const box = Math.round(size * fill);
    const deer = await sharp(mark).resize(box, box, { fit: "inside", kernel: "lanczos3" }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 3, background: INK } })
      .composite([{ input: deer, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  const written = [];
  const write = async (name, buffer) => {
    await writeFile(path.join(OUT, name), buffer);
    written.push(`${name.padEnd(30)} ${(buffer.length / 1024).toFixed(1)} kB`);
  };

  // --- the tab -------------------------------------------------------------

  // Embedded at 128px: enough for a 48px icon on a 2× screen, small enough
  // that the SVG stays a few kilobytes. White, because it is used as a mask —
  // the colour comes from the rectangle it cuts out.
  const maskPng = await sharp(await silhouette("#ffffff"))
    .resize(128, 128, { fit: "inside" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const { width: mw, height: mh } = await sharp(maskPng).metadata();
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">`,
    `<style>.deer{fill:${NAVY}}@media (prefers-color-scheme:dark){.deer{fill:#fff}}</style>`,
    `<mask id="m"><image href="data:image/png;base64,${maskPng.toString("base64")}"`,
    ` x="${(128 - mw) / 2}" y="${(128 - mh) / 2}" width="${mw}" height="${mh}"/></mask>`,
    `<rect class="deer" width="128" height="128" mask="url(#m)"/>`,
    `</svg>`,
  ].join("");
  await write("favicon.svg", Buffer.from(svg));

  const navySilhouette = await silhouette(NAVY);
  const ico16 = await bare(16, navySilhouette, 0.94);
  const ico32 = await bare(32, navySilhouette, 0.94);
  const ico48 = await bare(48, navySilhouette, 0.94);
  await write(
    "favicon.ico",
    ico([
      { size: 16, png: ico16 },
      { size: 32, png: ico32 },
      { size: 48, png: ico48 },
    ]),
  );

  // --- the home screen -----------------------------------------------------

  await write("apple-touch-icon.png", await grounded(180, 0.64));
  await write("android-chrome-192x192.png", await grounded(192, 0.66));
  await write("android-chrome-512x512.png", await grounded(512, 0.66));
  // Deer well inside the central 80% circle a launcher may crop to.
  await write("maskable-512x512.png", await grounded(512, 0.5));

  // The separate PNG favicons are gone: with a sized PNG on offer, Chrome
  // picks it over the SVG for an exact size match, and the tab stops
  // following the theme.
  for (const stale of ["favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png"]) {
    await unlink(path.join(OUT, stale)).catch(() => {});
  }

  console.log(written.join("\n"));
}

/**
 * An .ico holding PNGs, which every browser since IE Vista reads.
 *
 * Written by hand because it is forty lines and the only library that does it
 * would be a dependency for one file: a six-byte header, a sixteen-byte entry
 * per image pointing at its bytes, then the PNGs back to back.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width, 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
