/**
 * The record a build leaves of itself, so the size budget can measure that
 * build instead of making another one.
 *
 * ## Why
 *
 * `npm run build` writes Vite's manifest, `tools/prerender.mjs` reads it, and
 * then it must leave `dist/`: the server publishes everything in there. The
 * size budget (`tools/bundle-size.mjs`) needs the same manifest, so for a long
 * time it ran a second production build of its own. In CI that is a full
 * extra build of a commit that was just built and checked.
 *
 * So prerender no longer deletes the manifest; it moves it here, to
 * `.build/stamp.json` beside the project, outside anything that is shipped,
 * together with two things that say which build it describes:
 *
 * - **the source**: a fingerprint of the commit and of every uncommitted
 *   change, tracked or not, at the time of the build. A manifest from before
 *   an edit is not the manifest of the code on disk now.
 * - **the output**: a hash of every file the manifest names, as it was in the
 *   output folder. A `dist/` rebuilt, edited or swapped since is not the build
 *   this manifest describes.
 *
 * Only when both still hold is the stamp *fresh*, and only a fresh stamp is
 * used. Anything else — no git, no stamp, a stale one — means the budget makes
 * its own build, as it always did: it can be slower, never wrong.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/** Where the stamp lives: outside `dist/`, ignored by git. */
export const STAMP_PATH = path.resolve(process.env.BUILD_STAMP ?? ".build/stamp.json");

/** The source fingerprint as a build started, written by the Vite plugin in vite.config.ts. */
const START_PATH = path.join(path.dirname(STAMP_PATH), "build-start.json");

const sha256 = (data) => createHash("sha256").update(data).digest("hex");

const git = (args) =>
  execFileSync("git", args, { encoding: "buffer", stdio: ["ignore", "pipe", "ignore"] });

/**
 * Everything a production build reads besides the tracked source: the
 * environment Vite and the build tools use, and every `.env*` file beside
 * the project (Vite loads `.env`, `.env.local`, `.env.production`… and git
 * ignores the local ones). The same commit built with another
 * `VITE_SITE_URL` is another build.
 */
const BUILD_ENV = /^(VITE_|OUT_DIR$)/;

/**
 * NODE_ENV as this process was started with. Vite writes `production` into
 * `process.env.NODE_ENV` while it builds (and `development` for the dev server
 * prerender starts), so the live value says what Vite did, not what was asked
 * for. Read once, as this module loads: before prerender or the size budget
 * start Vite, and in vite.config.ts after Vite has set only its default.
 */
const NODE_ENV_AT_START = process.env.NODE_ENV;

function buildInputs(hash, env, root) {
  // Unset builds for production, the same as asking for it; anything else,
  // `development` above all, makes different React and a different build.
  const nodeEnv = env === process.env ? NODE_ENV_AT_START : env.NODE_ENV;
  hash.update(`\0env\0NODE_ENV=${nodeEnv || "production"}`);
  for (const key of Object.keys(env)
    .filter((k) => BUILD_ENV.test(k))
    .sort()) {
    hash.update(`\0env\0${key}=${env[key]}`);
  }
  for (const file of readdirSync(root)
    .filter((f) => f.startsWith(".env"))
    .sort()) {
    hash.update(`\0dotenv\0${file}\0`);
    hash.update(readFileSync(path.join(root, file)));
  }
}

/**
 * The commit plus every change not in it, and the build's environment
 * (above); null outside a git checkout.
 *
 * Untracked files count by content (a new lab is a new file); ignored ones do
 * not (`dist/`, `node_modules/`, test output), so building or testing does not
 * change the fingerprint of the source it built.
 */
export function sourceFingerprint(env = process.env, root = ".") {
  try {
    const hash = createHash("sha256");
    hash.update(git(["rev-parse", "HEAD"]));
    hash.update(git(["diff", "HEAD", "--binary"]));
    const untracked = git(["ls-files", "--others", "--exclude-standard", "-z"])
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
      .sort();
    for (const file of untracked) {
      hash.update(`\0${file}\0`);
      if (existsSync(file)) hash.update(git(["hash-object", "--", file]));
    }
    buildInputs(hash, env, root);
    return hash.digest("hex");
  } catch {
    return null;
  }
}

/**
 * Note the source as a build starts (vite.config.ts calls this at
 * `buildStart`). A file edited while the build runs may or may not be in the
 * output, so the source is only vouched for if it is the same at both ends.
 */
export async function recordBuildStart(outDir) {
  await mkdir(path.dirname(START_PATH), { recursive: true });
  await writeFile(
    START_PATH,
    JSON.stringify({ outDir: path.resolve(outDir), source: sourceFingerprint() }),
    "utf8",
  );
}

/**
 * The source fingerprint if it has not changed since the build into `outDir`
 * started, else null — and a stamp with a null source is never fresh. The
 * start record is used once.
 */
export async function sourceIfUnchanged(outDir) {
  let start = null;
  try {
    start = JSON.parse(await readFile(START_PATH, "utf8"));
  } catch {
    return null;
  } finally {
    await rm(START_PATH, { force: true });
  }
  const now = sourceFingerprint();
  if (!start || start.outDir !== path.resolve(outDir) || !start.source || start.source !== now) {
    return null;
  }
  return now;
}

/** Every file a Vite manifest names: chunks, their stylesheets and assets. */
export function manifestFiles(manifest) {
  const files = new Set();
  for (const chunk of Object.values(manifest)) {
    if (chunk.file) files.add(chunk.file);
    for (const file of chunk.css ?? []) files.add(file);
    for (const file of chunk.assets ?? []) files.add(file);
  }
  return [...files].sort();
}

async function hashFiles(outDir, files) {
  const hashes = {};
  for (const file of files) hashes[file] = sha256(await readFile(path.join(outDir, file)));
  return hashes;
}

/** Record the manifest of the build in `outDir`. Called by prerender. */
export async function writeStamp({
  outDir,
  manifest,
  source = sourceFingerprint(),
  stampPath = STAMP_PATH,
}) {
  const stamp = {
    outDir: path.resolve(outDir),
    source,
    files: await hashFiles(outDir, manifestFiles(manifest)),
    manifest,
  };
  await mkdir(path.dirname(stampPath), { recursive: true });
  await writeFile(stampPath, `${JSON.stringify(stamp)}\n`, "utf8");
  return stamp;
}

/**
 * The stamp, if it still describes both the source on disk and the files in
 * its output folder; otherwise `{ stamp: null, reason }` saying why not.
 */
export async function readFreshStamp({
  source = sourceFingerprint(),
  stampPath = STAMP_PATH,
} = {}) {
  if (!existsSync(stampPath)) return { stamp: null, reason: "no build stamp" };
  let stamp;
  try {
    stamp = JSON.parse(await readFile(stampPath, "utf8"));
  } catch {
    return { stamp: null, reason: "unreadable build stamp" };
  }
  const isObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);
  if (
    !isObject(stamp) ||
    !isObject(stamp.manifest) ||
    !isObject(stamp.files) ||
    typeof stamp.outDir !== "string"
  ) {
    return { stamp: null, reason: "malformed build stamp" };
  }
  if (source === null || stamp.source !== source) {
    return { stamp: null, reason: "the source has changed since that build" };
  }
  // Anything odd inside a stamp that parsed (an entry that is not a chunk, a
  // file name that is not a string) means it was not written by this tool.
  try {
    const files = manifestFiles(stamp.manifest);
    if (files.join("\n") !== Object.keys(stamp.files).sort().join("\n")) {
      return { stamp: null, reason: "malformed build stamp" };
    }
    for (const file of files) {
      const full = path.join(stamp.outDir, file);
      if (!existsSync(full) || sha256(await readFile(full)) !== stamp.files[file]) {
        return {
          stamp: null,
          reason: `${path.relative(".", full)} is not the file that build made`,
        };
      }
    }
  } catch {
    return { stamp: null, reason: "malformed build stamp" };
  }
  return { stamp, reason: null };
}
