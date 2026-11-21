/**
 * The size budget, checked on every pull request.
 *
 *     npm run size
 *
 * ## Why this exists
 *
 * #40 cut first-load JavaScript from 157.7 to 80 KB gzipped. Sixteen merges
 * later it was 86.6, and nobody had decided that: each merge added a few
 * hundred bytes that no review would notice, and the only way anyone found out
 * was by building two commits and comparing them by hand. A budget makes the
 * number visible on every pull request and stops one that crosses it, so the
 * next increase is a decision rather than an accident.
 *
 * ## What it measures
 *
 * Gzipped bytes, at level 9, of what a visitor actually downloads:
 *
 * - **First load**: the entry chunk and everything it imports statically —
 *   what the home page waits for — plus the stylesheet.
 * - **Each lab**: the lab's own chunk and the shared chunks it pulls in that
 *   the first load does not already include, plus its prose in the larger of
 *   the two languages. That is the cost of opening it.
 *
 * Which file belongs to what is read from Vite's manifest rather than guessed
 * from file names, so a renamed or split chunk cannot slip past.
 *
 * ## Which build it measures
 *
 * The one `npm run build` just made, when that is still the build of the code
 * on disk. Its manifest is moved out of `dist/` into a build stamp
 * (`tools/build-stamp.mjs`) together with a fingerprint of the source and a
 * hash of every file it names; a stamp is used only while both still match,
 * so a stale `dist/` left on disk cannot pass for the current code.
 *
 *     npm run size                     the last build if fresh, else its own
 *     npm run size -- --reuse-build    the last build, or fail
 *
 * CI runs the second form straight after its build: the same commit is never
 * built twice, and a stamp that somehow went stale fails the check rather
 * than quietly costing a second build. Without a fresh stamp — no build yet,
 * an edit since — this makes its own production build, manifest on, into a
 * temporary folder, and the deployed `dist/` stays exactly what
 * `npm run build` makes.
 *
 * ## Changing a budget
 *
 * Raise it in this file, in the same pull request that needs it, and say why
 * in that pull request. That is the point: the number moves when someone
 * chooses to move it.
 */

import { appendFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "vite";
import { readFreshStamp } from "./build-stamp.mjs";

/** Kilobytes, gzipped. Current sizes are in the report this prints. */
const BUDGET = {
  /**
   * The entry chunk alone: the shell, the home page and the lab registry.
   * Raised from 36: the shell now carries the retry of a failed lab download
   * at a fresh address, offline and terminal-error recovery, the mobile
   * finder with its loading and dismissible-error states, and keyboard-safe
   * mobile navigation (34.2 → 36.6 KB). All of it must work before any lab
   * chunk has loaded, so none of it can be deferred.
   */
  entry: 38,
  /** Everything the home page's JavaScript waits for: entry and its static imports. */
  firstLoadJs: 90,
  /** The one stylesheet. */
  css: 14,
  /** Opening any one lab, prose included (docs/OVERVIEW.md §3). */
  lab: 150,
};

const kb = (bytes) => bytes / 1024;
const fmt = (bytes) => `${kb(bytes).toFixed(1)} KB`;

/**
 * The build to measure: `{ outDir, manifest, cleanup }`. The last build when
 * its stamp is fresh; otherwise, unless `requireReuse`, a build of its own.
 */
async function buildToMeasure({ requireReuse }) {
  const { stamp, reason } = await readFreshStamp();
  if (stamp) {
    console.log(`Measuring the build in ${path.relative(".", stamp.outDir) || "."}.`);
    return { outDir: stamp.outDir, manifest: stamp.manifest, cleanup: async () => {} };
  }
  if (requireReuse) {
    throw new Error(
      `--reuse-build: no fresh build to measure (${reason}). Run npm run build first.`,
    );
  }
  console.log(`Building to measure (${reason}).`);
  const outDir = await mkdtemp(path.join(tmpdir(), "aiclub-size-"));
  const cleanup = () => rm(outDir, { recursive: true, force: true });
  try {
    await build({
      logLevel: "warn",
      build: { outDir, emptyOutDir: true, manifest: true },
    });
    const manifest = JSON.parse(await readFile(path.join(outDir, ".vite/manifest.json"), "utf8"));
    return { outDir, manifest, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const unknown = args.filter((arg) => arg !== "--reuse-build");
  if (unknown.length > 0) throw new Error(`Unknown argument: ${unknown.join(" ")}`);

  const { outDir, manifest, cleanup } = await buildToMeasure({
    requireReuse: args.includes("--reuse-build"),
  });
  try {
    const sizes = new Map();
    const gz = async (file) => {
      if (!sizes.has(file))
        sizes.set(file, gzipSync(await readFile(path.join(outDir, file)), { level: 9 }).length);
      return sizes.get(file);
    };

    /** A manifest entry's own file and every chunk it imports statically. */
    const staticClosure = (key, seen = new Set()) => {
      const chunk = manifest[key];
      if (!chunk || seen.has(chunk.file)) return seen;
      seen.add(chunk.file);
      for (const dep of chunk.imports ?? []) staticClosure(dep, seen);
      return seen;
    };

    const entryKey = Object.keys(manifest).find((key) => manifest[key].isEntry);
    if (!entryKey) throw new Error("The manifest has no entry chunk.");
    const entry = manifest[entryKey];
    const firstLoad = staticClosure(entryKey);

    const entryBytes = await gz(entry.file);
    let firstLoadBytes = 0;
    for (const file of firstLoad) firstLoadBytes += await gz(file);
    let cssBytes = 0;
    for (const file of entry.css ?? []) cssBytes += await gz(file);

    const rows = [];
    const check = (name, bytes, limit) => {
      const over = kb(bytes) > limit;
      rows.push({ name, size: fmt(bytes), budget: `${limit} KB`, ok: !over });
      return !over;
    };

    let ok = true;
    ok = check("Entry chunk", entryBytes, BUDGET.entry) && ok;
    ok = check("First-load JavaScript", firstLoadBytes, BUDGET.firstLoadJs) && ok;
    ok = check("Stylesheet", cssBytes, BUDGET.css) && ok;

    const labKeys = Object.keys(manifest)
      .filter((key) => /^src\/labs\/[^/]+\/index\.tsx$/.test(key) && manifest[key].isDynamicEntry)
      .sort();
    if (labKeys.length === 0) throw new Error("No lab chunks found in the manifest.");

    for (const key of labKeys) {
      const slug = key.split("/")[2];
      let bytes = 0;
      for (const file of staticClosure(key)) if (!firstLoad.has(file)) bytes += await gz(file);
      // The lab's prose arrives with it; count the heavier language.
      let prose = 0;
      for (const language of ["en", "tr"]) {
        const copy = manifest[`src/i18n/labs/${language}/${slug}.ts`];
        if (copy) prose = Math.max(prose, await gz(copy.file));
      }
      ok = check(`Lab: ${slug}`, bytes + prose, BUDGET.lab) && ok;
    }

    const width = Math.max(...rows.map((row) => row.name.length));
    console.log("");
    for (const row of rows) {
      console.log(
        `${row.ok ? "  " : "✗ "}${row.name.padEnd(width)}  ${row.size.padStart(9)}  / ${row.budget}`,
      );
    }
    console.log("");

    // On GitHub Actions, the same table on the run's summary page.
    if (process.env.GITHUB_STEP_SUMMARY) {
      const table = [
        "### Bundle size (gzipped)",
        "",
        "| | Size | Budget |",
        "| --- | ---: | ---: |",
        ...rows.map((row) => `| ${row.ok ? "" : "❌ "}${row.name} | ${row.size} | ${row.budget} |`),
        "",
      ].join("\n");
      await appendFile(process.env.GITHUB_STEP_SUMMARY, table);
    }

    if (!ok) {
      console.error(
        "Over budget. Make it smaller, or raise the budget in tools/bundle-size.mjs and say why.",
      );
      process.exitCode = 1;
    } else {
      console.log("Within budget.");
    }
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
