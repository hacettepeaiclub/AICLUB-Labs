/**
 * A local rehearsal of deploy/install-release.sh, the script that installs a
 * release on the server. Nothing here talks to the server.
 *
 *     node tools/simulate-deploy.mjs              builds three releases first
 *     node tools/simulate-deploy.mjs A B C        three built dist/ folders, oldest first
 *
 * ## What it proves
 *
 * A visitor who opened a page before a deploy keeps running that release's
 * JavaScript and fetches its lazy chunks by their hashed names afterwards. So,
 * in a temporary `~/labs`, served over HTTP the way nginx serves `dist/`:
 *
 * 1. Release A is put in place the old way, with no release lists, as the
 *    server is today.
 * 2. Release B is installed by the script. Every file of B is served, and so
 *    is every file under A's assets/ and every /assets/ URL A's pages name.
 * 3. Release C is installed:
 *    - an hour later: A's bundles are still served (installed within 7 days);
 *    - eight days later: B's bundles are still served (one of the last two
 *      releases) and the bundles only A had are gone — the pruning is bounded.
 *    In both, the pages, sitemap and every other file outside assets/ are
 *    exactly C's.
 *
 * Each timeline runs once with rsync and once with cp, and the two must leave
 * identical folders.
 *
 * ## Making the releases
 *
 * Without arguments it exports HEAD three times with `git archive`, changes a
 * different string in each (a lab, then the shell), and builds each, so the
 * releases share some hashed files and differ in others, as real ones do.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readdir, readFile, rm, symlink, writeFile, cp, mkdir } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const INSTALL = path.join(ROOT, "deploy", "install-release.sh");
const DAY = 86400;

const sha = (data) => createHash("sha256").update(data).digest("hex");

/** Every file under a folder, relative and sorted. */
async function listFiles(dir, prefix = "") {
  const out = [];
  for (const entry of await readdir(path.join(dir, prefix), { withFileTypes: true })) {
    const rel = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(dir, rel)));
    else if (entry.isFile()) out.push(rel);
  }
  return out.sort();
}

/** A folder's files and their hashes: two folders with equal trees are the same. */
async function tree(dir) {
  const lines = [];
  for (const file of await listFiles(dir))
    lines.push(`${file} ${sha(await readFile(path.join(dir, file)))}`);
  return lines.join("\n");
}

/** The URLs a release's visitors can ask for: its assets and what its pages link to under /assets/. */
async function assetUrls(dist) {
  const urls = new Set();
  for (const file of await listFiles(dist)) {
    if (file.startsWith("assets/")) urls.add(`/${file}`);
    if (file.endsWith(".html")) {
      const html = await readFile(path.join(dist, file), "utf8");
      for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) urls.add(match[1]);
    }
  }
  return [...urls].sort();
}

/** A static server over `dir`, as nginx serves dist/: a file, a folder's index.html, or 404. */
async function serve(dir) {
  const server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(dir, pathname);
    if (!file.startsWith(dir)) return res.writeHead(400).end();
    if (pathname.endsWith("/")) file = path.join(file, "index.html");
    try {
      const body = await readFile(file);
      res.writeHead(200).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

/** Fetch every URL; return those not answered 200 with the release's own bytes. */
async function failures(origin, urls, sourceDist) {
  const bad = [];
  for (const url of urls) {
    const res = await fetch(origin + url);
    const body = Buffer.from(await res.arrayBuffer());
    const expected = await readFile(path.join(sourceDist, url));
    if (res.status !== 200 || sha(body) !== sha(expected)) bad.push(`${res.status} ${url}`);
  }
  return bad;
}

async function install(labs, dist, { now, copy }) {
  execFileSync("tar", ["-C", dist, "-czf", path.join(labs, "site.tgz"), "."]);
  execFileSync("bash", [INSTALL], {
    env: { ...process.env, LABS_DIR: labs, NOW: String(now), DEPLOY_COPY: copy },
    stdio: ["ignore", "ignore", "inherit"],
  });
}

let checks = 0;
function expectNone(label, list) {
  checks++;
  if (list.length > 0) {
    throw new Error(`${label}: ${list.length} failed\n  ${list.slice(0, 10).join("\n  ")}`);
  }
  console.log(`  ✓ ${label}`);
}

/** One timeline: A the old way, B by the script, C `gap` seconds after B. */
async function timeline([A, B, C], { gap, copy }) {
  const labs = await mkdtemp(path.join(tmpdir(), "labs-sim-"));
  const dist = path.join(labs, "dist");
  const server = await serve(dist);
  try {
    // Release A, as the old deploy left it: files only, no release lists.
    await mkdir(dist);
    await cp(A, dist, { recursive: true });

    const T = 1_800_000_000;
    await install(labs, B, { now: T, copy });
    expectNone(
      `B installed: every file of B is served`,
      await failures(
        server.origin,
        (await listFiles(B)).map((f) => `/${f}`),
        B,
      ),
    );
    expectNone(
      `B installed: every chunk of A is still served`,
      await failures(server.origin, await assetUrls(A), A),
    );

    await install(labs, C, { now: T + gap, copy });
    const cFiles = await listFiles(C);
    expectNone(
      `C installed: every file of C is served`,
      await failures(
        server.origin,
        cFiles.map((f) => `/${f}`),
        C,
      ),
    );
    expectNone(
      `C installed: every chunk of B is still served`,
      await failures(server.origin, await assetUrls(B), B),
    );

    const outside = (await listFiles(dist)).filter((f) => !f.startsWith("assets/"));
    const cOutside = cFiles.filter((f) => !f.startsWith("assets/"));
    expectNone(
      "C installed: outside assets/, dist/ is exactly C",
      outside.join("\n") === cOutside.join("\n") ? [] : ["file lists differ"],
    );

    const newer = new Set([...(await assetUrls(B)), ...(await assetUrls(C))]);
    const onlyA = (await assetUrls(A)).filter((url) => !newer.has(url));
    if (onlyA.length === 0)
      throw new Error("A shares every bundle with B and C; the releases do not differ.");
    if (gap < 7 * DAY) {
      expectNone(
        `C installed ${gap / 3600} h after B: A's ${onlyA.length} own chunks still served`,
        await failures(server.origin, onlyA, A),
      );
    } else {
      const kept = [];
      for (const url of onlyA)
        if ((await fetch(server.origin + url)).status !== 404) kept.push(url);
      expectNone(
        `C installed ${gap / DAY} days after B: A's ${onlyA.length} own chunks pruned`,
        kept,
      );
    }
    for (const leftover of ["dist-next", "site.tgz"]) {
      expectNone(`${leftover} cleaned up`, existsSync(path.join(labs, leftover)) ? [leftover] : []);
    }
    return {
      dist: await tree(dist),
      releases: (await readdir(path.join(labs, "releases"))).sort().join(","),
    };
  } finally {
    server.close();
    await rm(labs, { recursive: true, force: true });
  }
}

/** Three releases built from HEAD, each with a different change. */
async function buildReleases() {
  const work = await mkdtemp(path.join(tmpdir(), "labs-releases-"));
  const edits = [
    [],
    [["src/labs/sorting/index.tsx", '\nexport const __release = "B";\n']],
    [
      ["src/labs/sorting/index.tsx", '\nexport const __release = "C";\n'],
      ["src/main.tsx", '\nconsole.debug("release C");\n'],
    ],
  ];
  const dists = [];
  for (const [i, changes] of edits.entries()) {
    const dir = path.join(work, String.fromCharCode(65 + i));
    await mkdir(dir);
    const archive = execFileSync("git", ["-C", ROOT, "archive", "--format=tar", "HEAD"], {
      maxBuffer: 1 << 30,
    });
    execFileSync("tar", ["-x", "-C", dir], { input: archive });
    await symlink(path.join(ROOT, "node_modules"), path.join(dir, "node_modules"));
    for (const [file, text] of changes) {
      await writeFile(path.join(dir, file), (await readFile(path.join(dir, file), "utf8")) + text);
    }
    console.log(`Building release ${String.fromCharCode(65 + i)}…`);
    execFileSync("npm", ["run", "build"], { cwd: dir, stdio: "ignore" });
    dists.push(path.join(dir, "dist"));
  }
  return { dists, cleanup: () => rm(work, { recursive: true, force: true }) };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 0 && args.length !== 3)
    throw new Error("Give three dist/ folders, oldest first, or none.");
  const { dists, cleanup } =
    args.length === 3
      ? { dists: args.map((a) => path.resolve(a)), cleanup: async () => {} }
      : await buildReleases();
  try {
    for (const gap of [3600, 8 * DAY]) {
      const results = {};
      for (const copy of ["rsync", "cp"]) {
        console.log(
          `\nTimeline: C ${gap < DAY ? "an hour" : "eight days"} after B, copying with ${copy}`,
        );
        results[copy] = await timeline(dists, { gap, copy });
      }
      expectNone(
        "rsync and cp leave identical dist/ and release lists",
        results.rsync.dist === results.cp.dist && results.rsync.releases === results.cp.releases
          ? []
          : ["they differ"],
      );
    }
    console.log(`\nAll ${checks} checks passed.`);
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
