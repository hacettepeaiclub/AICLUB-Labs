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
 * ## Why it builds on its own
 *
 * It runs its own production build, with the manifest switched on, into a
 * temporary folder. The deployed `dist/` stays exactly what `npm run build`
 * makes, and the check cannot be fooled by a stale `dist/` left on disk.
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

/** Kilobytes, gzipped. Current sizes are in the report this prints. */
const BUDGET = {
  /** The entry chunk alone: the shell, the home page and the lab registry. */
  entry: 36,
  /** Everything the home page's JavaScript waits for: entry and its static imports. */
  firstLoadJs: 90,
  /** The one stylesheet. */
  css: 14,
  /** Opening any one lab, prose included (docs/OVERVIEW.md §3). */
  lab: 150,
};

const kb = (bytes) => bytes / 1024;
const fmt = (bytes) => `${kb(bytes).toFixed(1)} KB`;

async function main() {
  const outDir = await mkdtemp(path.join(tmpdir(), "aiclub-size-"));
  try {
    await build({
      logLevel: "warn",
      build: { outDir, emptyOutDir: true, manifest: true },
    });
    const manifest = JSON.parse(await readFile(path.join(outDir, ".vite/manifest.json"), "utf8"));

    const sizes = new Map();
    const gz = async (file) => {
      if (!sizes.has(file)) sizes.set(file, gzipSync(await readFile(path.join(outDir, file)), { level: 9 }).length);
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
    await rm(outDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
