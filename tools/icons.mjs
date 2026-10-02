/**
 * Every icon the site ships, from the one logo the site draws.
 *
 *     npm i -D sharp && npm run icons && npm un sharp
 *
 * ## Why this exists
 *
 * The header draws `src/assets/aiclub-mark-white.png`. The tab, the bookmark,
 * the home-screen icon and the result in a search engine were drawing
 * something else: a thinner, smaller version of the same deer on #1e3d59, a
 * slate blue left over from an earlier palette that is not the club's colour.
 * At 16 and 32 pixels that version was a grey smudge on a grey ground. Two
 * logos is one too many; this makes the second out of the first.
 *
 * ## Why the mark sits on navy rather than on nothing
 *
 * The mark is white on transparent. On a dark tab bar that reads; on a light
 * one, on a white search results page, it disappears — which is exactly what
 * the club's main site currently looks like in a search engine. So every icon
 * is the mark on the club navy, #003588, the same badge the footer already
 * draws beside the club's name. White on that navy is 11.26:1.
 *
 * ## The three shapes
 *
 * - **Favicons** (16, 32, 48, 192 and the .ico) are a rounded square, mark
 *   large. Up to 48 the mark is drawn as a solid silhouette — see `solid` —
 *   because its strands are thinner than a pixel there.
 * - **The Apple touch icon** is a full square with no transparency: iOS
 *   rounds the corners itself and fills any transparency with black.
 * - **The maskable icon** is a full square with the mark inside the central
 *   safe zone, because Android may crop it to a circle, a squircle or a
 *   teardrop, and the deer's antlers must survive all of them.
 *
 * ## Why the output is committed
 *
 * The same reason as `public/og`: a native image library on the critical path
 * of a deploy that runs `npm install` on a small server is a deploy that can
 * break, and icons change about once a year.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = path.resolve("src/assets/aiclub-mark-white.png");
const OUT = path.resolve("public");

/** `--accent-fill`, the club's own navy. */
const NAVY = "#003588";

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
   * The mark for the smallest sizes: its parallel strands merged into one
   * solid white silhouette.
   *
   * The deer is drawn as five thin strands with gaps between them. At 16 and
   * 32 pixels a strand is narrower than a pixel, so each pixel averages white
   * strand with navy gap and the whole mark comes out a pale blue-grey — the
   * smudge the old icon had too. No size that small can show five strands, so
   * it stops trying: the alpha is blurred at high resolution until the gaps
   * close, then thresholded back to a hard edge. What survives is the shape
   * that reads at a glance — the antlers and the V of the head — in full
   * white. Type designers call this an optical size; it is the same move.
   */
  const solid = async () => {
    const big = await sharp(mark).resize(512, 512, { fit: "inside" }).toBuffer();
    const { width, height } = await sharp(big).metadata();
    // Two pipelines, not one: sharp applies its operations in a fixed order of
    // its own, and in a single chain the threshold runs before the blur — so
    // the edge comes out soft and the gaps stay open. Blur 12 at this size is
    // the least that closes every gap between strands; below it a dotted seam
    // survives down the head, above it the antlers start to swell together.
    const blurred = await sharp(big).extractChannel("alpha").blur(12).toBuffer();
    const alpha = await sharp(blurred).threshold(55).toColourspace("b-w").toBuffer();
    return sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
      .joinChannel(alpha)
      .png()
      .toBuffer();
  };
  const silhouette = await solid();

  /** A square of `size` with the mark centred, `fill` of it at most. */
  const icon = async (size, { fill, radius, source = mark }) => {
    const rx = Math.round(size * radius);
    const ground = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
        `<rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${NAVY}"/></svg>`,
    );
    const box = Math.round(size * fill);
    const deer = await sharp(source)
      .resize(box, box, { fit: "inside", kernel: "lanczos3" })
      .toBuffer();
    return sharp(ground)
      .composite([{ input: deer, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  // Up to 48px the silhouette, a little larger in the square. 16 and 32 are
  // the tab. 48 is what a search engine fetches — and then shows at 16 to 24
  // pixels beside a result, so it has the same problem the tab does. From
  // 180 up, on a home screen, the strands have room and are drawn as strands.
  const favicon = (size) =>
    size <= 48
      ? icon(size, { fill: 0.86, radius: 0.22, source: silhouette })
      : icon(size, { fill: 0.78, radius: 0.22 });
  const written = [];
  const write = async (name, buffer) => {
    await writeFile(path.join(OUT, name), buffer);
    written.push(`${name.padEnd(30)} ${(buffer.length / 1024).toFixed(1)} kB`);
  };

  const small = { 16: await favicon(16), 32: await favicon(32), 48: await favicon(48) };
  await write("favicon-16x16.png", small[16]);
  await write("favicon-32x32.png", small[32]);
  // A multiple of 48 is what Google asks for before it will show an icon in
  // search results; 16 and 32 alone are not enough.
  await write("favicon-48x48.png", small[48]);
  await write("favicon.ico", ico([16, 32, 48].map((size) => ({ size, png: small[size] }))));

  await write("android-chrome-192x192.png", await favicon(192));
  await write("android-chrome-512x512.png", await favicon(512));
  // Full bleed, no rounding, deer well inside the 80% safe circle.
  await write("maskable-512x512.png", await icon(512, { fill: 0.5, radius: 0 }));
  // iOS rounds and masks the square itself.
  await write("apple-touch-icon.png", await icon(180, { fill: 0.64, radius: 0 }));

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
