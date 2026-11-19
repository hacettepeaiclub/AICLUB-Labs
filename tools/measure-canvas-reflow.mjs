/**
 * How much layout the three plain 2D canvases force, measured in Chromium.
 *
 *     node tools/measure-canvas-reflow.mjs                 the working tree
 *     node tools/measure-canvas-reflow.mjs --ref <commit>  that commit, exported with git archive
 *
 * Roadmap item R13: measure before changing anything, and claim nothing the
 * numbers do not show. This runs the app from source on Vite's dev server, so
 * stack frames name the real files, and for each of the sorting,
 * gradient-descent and graph-search labs:
 *
 * 1. **Forced layouts while resizing.** A devtools timeline trace across a
 *    sequence of window widths. A `Layout` event that carries a JavaScript
 *    stack is one the page forced synchronously (a read such as
 *    `getBoundingClientRect` after a write); those are counted, and the ones
 *    whose stack passes through BarCanvas, GridCanvas or LandscapeCanvas are
 *    attributed to them.
 * 2. **Layout reads from those files.** Every `getBoundingClientRect` call
 *    whose stack passes through them, counted by an init script — the same
 *    question asked without the tracer.
 * 3. **Sharp at 1, 1.25 and 2 device pixels per CSS pixel.** Every canvas's
 *    bitmap is `round(css size × min(dpr, 2))`.
 * 4. **Still canvases repaint.** After a resize and after a theme change,
 *    each canvas has ink on it, and the theme change changed the pixels.
 *
 * Prints a table and a JSON summary. It needs Playwright's Chromium and its
 * system libraries; nothing here is part of CI.
 */

// The functions passed to page.evaluate and addInitScript run in the page.
/* global window, document, Element, HTMLCanvasElement, requestAnimationFrame */

import { execFileSync } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
/**
 * Where canvas sizing code lives: the three components before R13, and the
 * shared hook after it. Counting the hook too keeps the comparison honest:
 * work moved into it would otherwise vanish from the "after" numbers.
 */
const FILES = ["BarCanvas.tsx", "GridCanvas.tsx", "LandscapeCanvas.tsx", "useCanvasBacking.ts"];
const LABS = ["sorting", "gradient-descent", "graph-search"];
const WIDTHS = [1280, 1180, 1040, 900, 800, 1100, 1280, 960, 1280];
const DPRS = [1, 1.25, 2];

const fromFiles = (stack) => FILES.find((name) => stack.includes(name)) ?? null;

/** The commit a ref names, or an error; nothing from the command line reaches a shell. */
function commitOf(ref) {
  if (!/^[\w./-]+$/.test(ref) || ref.startsWith("-")) throw new Error(`Not a ref: ${ref}`);
  return execFileSync("git", ["-C", ROOT, "rev-parse", "--verify", "--quiet", `${ref}^{commit}`], {
    encoding: "utf8",
  }).trim();
}

async function sourceRoot(ref) {
  if (!ref) return { root: ROOT, label: "working tree", cleanup: async () => {} };
  const commit = commitOf(ref);
  const dir = await mkdtemp(path.join(tmpdir(), "reflow-ref-"));
  const cleanup = () => rm(dir, { recursive: true, force: true });
  try {
    const archive = execFileSync("git", ["-C", ROOT, "archive", "--format=tar", commit], {
      maxBuffer: 1 << 30,
    });
    execFileSync("tar", ["-x", "-C", dir], { input: archive });
    await symlink(path.join(ROOT, "node_modules"), path.join(dir, "node_modules"));
  } catch (error) {
    await cleanup();
    throw error;
  }
  return { root: dir, label: `${ref} (${commit.slice(0, 7)})`, cleanup };
}

/** Wait until two frames have been painted, so resize observers and effects have run. */
const settle = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 60))),
      ),
  );

/** Each canvas: its CSS size, bitmap size, whether it has ink, and a hash of its pixels. */
const canvases = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("main canvas")]
      .filter((canvas) => {
        // A collapsed stage's canvas has no box, and its bitmap is whatever it
        // last had: nothing to judge sharpness or ink by.
        const rect = canvas.getBoundingClientRect();
        const visible =
          typeof canvas.checkVisibility === "function" ? canvas.checkVisibility() : true;
        return visible && rect.width > 0 && rect.height > 0;
      })
      .map((canvas) => {
        const rect = canvas.getBoundingClientRect();
        let ink = false;
        let hash = 0;
        try {
          const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) ink = true;
            hash = (hash * 31 + data[i] + data[i + 1] * 7 + data[i + 2] * 13) | 0;
          }
        } catch {
          // Not a 2D canvas; reported without pixels.
        }
        return {
          sized: canvas.dataset.measuredSizing === "1",
          css: [rect.width, rect.height],
          bitmap: [canvas.width, canvas.height],
          ink,
          hash,
        };
      }),
  );

/**
 * Count canvas layout reads from the measured files, and tag the canvases
 * whose 2D context they ask for. Installed in every context before any page
 * loads, so every check sees the same tags.
 */
async function instrument(context, { countReads = true } = {}) {
  await context.addInitScript(
    ([files, countReads]) => {
      const reads = Object.fromEntries(files.map((f) => [f, 0]));
      const original = Element.prototype.getBoundingClientRect;
      // Off for the traced pass: the tracer records only the frame that asked
      // for layout, and a wrapper here would be that frame instead of the code.
      if (countReads)
        Element.prototype.getBoundingClientRect = function (...args) {
          const stack = new Error().stack ?? "";
          const file = files.find((name) => stack.includes(name));
          if (file && this instanceof HTMLCanvasElement) reads[file]++;
          return original.apply(this, args);
        };
      // Mark the canvases whose context the measured code asks for, so the
      // checks below judge those and nothing else on the page.
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (...args) {
        const stack = new Error().stack ?? "";
        if (files.some((name) => stack.includes(name))) this.dataset.measuredSizing = "1";
        return getContext.apply(this, args);
      };
      Object.defineProperty(window, "__canvasReads", { value: reads });
    },
    [FILES, countReads],
  );
}

/** Open a lab in a fresh context and walk it through the resize sequence. */
async function resizeRun(browser, origin, slug, { traced }) {
  const context = await browser.newContext({
    viewport: { width: WIDTHS[0], height: 900 },
    reducedMotion: "reduce",
  });
  await instrument(context, { countReads: !traced });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${origin}/labs/${slug}/`);
  await page.locator("main canvas").first().waitFor();
  await settle(page);
  const readsAtLoad = await page.evaluate(() => ({ ...window.__canvasReads }));
  if (traced) {
    await browser.startTracing(page, {
      categories: ["devtools.timeline", "disabled-by-default-devtools.timeline.stack"],
    });
  }
  for (const width of WIDTHS.slice(1)) {
    await page.setViewportSize({ width, height: 900 });
    await settle(page);
  }
  const trace = traced ? JSON.parse((await browser.stopTracing()).toString("utf8")) : null;
  const readsAfter = await page.evaluate(() => ({ ...window.__canvasReads }));
  return { context, page, errors, trace, readsAtLoad, readsAfter };
}

async function measureLab(browser, origin, slug) {
  // Pass 1, traced: which JavaScript forces layout while the window resizes.
  const tracedRun = await resizeRun(browser, origin, slug, { traced: true });
  const { trace } = tracedRun;
  await tracedRun.context.close();
  // Pass 2, counted: canvas layout reads from the measured files, then the
  // still-canvas checks on the same page.
  const { context, page, errors, readsAtLoad, readsAfter } = await resizeRun(
    browser,
    origin,
    slug,
    { traced: false },
  );
  errors.push(...tracedRun.errors);

  const forced = { total: 0 };
  const frames = {};
  for (const name of FILES) forced[name] = 0;
  for (const event of trace.traceEvents ?? []) {
    if (event.name !== "Layout") continue;
    const stack = event.args?.beginData?.stackTrace;
    if (!Array.isArray(stack) || stack.length === 0) continue;
    forced.total++;
    const file = fromFiles(stack.map((frame) => frame.url ?? "").join("\n"));
    if (file) forced[file]++;
    // The JavaScript that asked for the layout, for --frames.
    const top = stack.find((frame) => frame.url) ?? stack[0];
    const where = `${top.functionName || "(anonymous)"} ${String(top.url ?? "")
      .replace(/^.*\/(src|node_modules)\//, "$1/")
      .replace(/\?.*$/, "")}:${top.lineNumber}`;
    frames[where] = (frames[where] ?? 0) + 1;
  }
  const resizeReads = {};
  for (const name of FILES) resizeReads[name] = readsAfter[name] - readsAtLoad[name];

  // Still canvases after the resizes: ink on every one, then a theme change.
  // Only the canvases the measured code sized count; there must be some.
  const sizedOnly = async () => (await canvases(page)).filter((c) => c.sized);
  const afterResize = await sizedOnly();
  await page
    .getByRole("group", { name: "Theme" })
    .getByRole("button", { pressed: false })
    .first()
    .click();
  await settle(page);
  const afterTheme = await sizedOnly();
  await context.close();

  return {
    slug,
    errors,
    forced,
    reads: { load: readsAtLoad, resize: resizeReads },
    frames,
    sampled: afterResize.length > 0 && afterTheme.length === afterResize.length,
    inkAfterResize: afterResize.length > 0 && afterResize.every((c) => c.ink),
    repaintedOnTheme:
      afterResize.length > 0 &&
      afterResize.every((c, i) => afterTheme[i] && afterTheme[i].hash !== c.hash),
    canvases: afterResize.length,
  };
}

async function sharpness(browser, origin, slug) {
  const out = [];
  for (const dpr of DPRS) {
    const context = await browser.newContext({
      viewport: { width: 1100, height: 900 },
      deviceScaleFactor: dpr,
      reducedMotion: "reduce",
    });
    await instrument(context);
    const page = await context.newPage();
    await page.goto(`${origin}/labs/${slug}/`);
    await page.locator("main canvas").first().waitFor();
    await settle(page);
    const scale = Math.min(dpr, 2);
    const sized = (await canvases(page)).filter((c) => c.sized);
    const wrong = sized.filter(
      (c) =>
        c.bitmap[0] !== Math.round(c.css[0] * scale) ||
        c.bitmap[1] !== Math.round(c.css[1] * scale),
    );
    out.push({ dpr, sampled: sized.length, sharp: sized.length > 0 && wrong.length === 0, wrong });
    await context.close();
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const refAt = args.indexOf("--ref");
  const ref = refAt >= 0 ? args[refAt + 1] : null;
  if (refAt >= 0 && !ref) throw new Error("--ref needs a commit.");

  const { root, label, cleanup } = await sourceRoot(ref);
  let server = null;
  let browser = null;
  try {
    server = await createServer({
      root,
      configFile: path.join(root, "vite.config.ts"),
      logLevel: "error",
      server: { port: 0, strictPort: false },
    });
    await server.listen();
    const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
    browser = await chromium.launch();
    const results = [];
    for (const slug of LABS) {
      const result = await measureLab(browser, origin, slug);
      result.sharpness = await sharpness(browser, origin, slug);
      results.push(result);
    }
    console.log(`\nSource: ${label}  (${WIDTHS.length - 1} resizes per lab)\n`);
    for (const r of results) {
      const own = FILES.map((f) => `${f} ${r.forced[f]}`).join(", ");
      const reads = FILES.map((f) => `${f} ${r.reads.resize[f]}`).join(", ");
      console.log(`${r.slug}`);
      console.log(`  forced layouts while resizing: ${r.forced.total} total; from ${own}`);
      console.log(`  canvas getBoundingClientRect at load: ${JSON.stringify(r.reads.load)}`);
      console.log(`  canvas getBoundingClientRect while resizing: ${reads}`);
      console.log(
        `  sharp at DPR ${r.sharpness.map((s) => `${s.dpr}: ${s.sharp ? "yes" : "NO"}`).join(", ")}`,
      );
      console.log(
        `  ${r.canvases} canvases; ink after resize: ${r.inkAfterResize}; repainted on theme change: ${r.repaintedOnTheme}`,
      );
      if (r.errors.length) console.log(`  page errors: ${r.errors.join(" | ")}`);
      if (args.includes("--frames")) {
        for (const [where, n] of Object.entries(r.frames).sort((a, b) => b[1] - a[1])) {
          console.log(`    ${String(n).padStart(3)}  ${where}`);
        }
      }
    }
    console.log(`\n${JSON.stringify({ source: label, results })}`);
    const unsampled = results.filter((r) => !r.sampled || r.sharpness.some((s) => s.sampled === 0));
    if (unsampled.length > 0) {
      throw new Error(
        `No measured canvas was sampled on: ${unsampled.map((r) => r.slug).join(", ")}`,
      );
    }
  } finally {
    await browser?.close();
    await server?.close();
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
