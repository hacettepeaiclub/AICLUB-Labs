/**
 * Generate browser and home-screen icons from the header's original mark.
 * SVG favicons use the terminal palette: dark green on light browser chrome,
 * phosphor green on dark chrome. The ICO fallback uses dark green for legibility.
 * Small icons retain the merged silhouette; home-screen icons keep all strands
 * in phosphor green on the site's near-black ground.
 *
 * Outputs are committed so deploys do not require a native image dependency.
 * To regenerate: npm i -D sharp && npm run icons && npm un sharp
 */

import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = path.resolve("src/assets/aiclub-mark-white.webp");
const OUT = path.resolve("public");

/** Terminal accents on light and dark backgrounds. */
const GREEN_DARK = "#276238";
const GREEN_LIGHT = "#a7ef9e";
/** `--ink-950`, the page itself: the ground of the home-screen icons. */
const INK = "#0a0a0f";

async function main() {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error(
      "sharp is not installed, on purpose:\n  npm i -D sharp && npm run icons && npm un sharp",
    );
    process.exit(1);
  }

  // The source has a margin of transparency around the deer. Trimming it
  // makes the ratios below mean "how much of the square is deer".
  //
  // `.png()` matters: a bare `toBuffer()` re-encodes in the input's format,
  // and for a WebP source that is *lossy* WebP — every step below would then
  // work from a degraded copy. PNG keeps each intermediate exact.
  const mark = await sharp(await readFile(SOURCE))
    .trim()
    .png()
    .toBuffer();

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
    const deer = await sharp(source)
      .resize(box, box, { fit: "inside", kernel: "lanczos3" })
      .toBuffer();
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: deer, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  /** The phosphor-green deer on the page's ink, for places that refuse transparency. */
  const grounded = async (size, fill) => {
    const box = Math.round(size * fill);
    const deer = await sharp(mark)
      .tint(GREEN_LIGHT)
      .resize(box, box, { fit: "inside", kernel: "lanczos3" })
      .toBuffer();
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
    `<style>.deer{fill:${GREEN_DARK}}@media (prefers-color-scheme:dark){.deer{fill:${GREEN_LIGHT}}}</style>`,
    `<mask id="m"><image href="data:image/png;base64,${maskPng.toString("base64")}"`,
    ` x="${(128 - mw) / 2}" y="${(128 - mh) / 2}" width="${mw}" height="${mh}"/></mask>`,
    `<rect class="deer" width="128" height="128" mask="url(#m)"/>`,
    `</svg>`,
  ].join("");
  await write("favicon.svg", Buffer.from(svg));

  const greenSilhouette = await silhouette(GREEN_DARK);
  const ico16 = await bare(16, greenSilhouette, 0.94);
  const ico32 = await bare(32, greenSilhouette, 0.94);
  const ico48 = await bare(48, greenSilhouette, 0.94);
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
