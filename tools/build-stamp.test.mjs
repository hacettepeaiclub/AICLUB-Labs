import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  manifestFiles,
  readFreshStamp,
  recordBuildStart,
  sourceFingerprint,
  sourceIfUnchanged,
  writeStamp,
} from "./build-stamp.mjs";

/**
 * The size budget measures the last build only while this says it is still
 * the build of the code on disk; every way it can stop being that is here.
 */

const manifest = {
  "index.html": { file: "assets/index-a.js", isEntry: true, css: ["assets/index-a.css"] },
  "src/labs/x/index.tsx": { file: "assets/x-b.js", isDynamicEntry: true, imports: ["index.html"] },
};

let dir;
let outDir;
let stampPath;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "stamp-test-"));
  outDir = path.join(dir, "dist");
  stampPath = path.join(dir, ".build", "stamp.json");
  await mkdir(path.join(outDir, "assets"), { recursive: true });
  for (const file of manifestFiles(manifest)) await writeFile(path.join(outDir, file), file);
});

afterEach(() => rm(dir, { recursive: true, force: true }));

describe("the build stamp", () => {
  it("names every chunk and stylesheet the manifest lists", () => {
    expect(manifestFiles(manifest)).toEqual([
      "assets/index-a.css",
      "assets/index-a.js",
      "assets/x-b.js",
    ]);
  });

  it("is fresh for the same source and untouched output", async () => {
    await writeStamp({ outDir, manifest, source: "s1", stampPath });
    const { stamp, reason } = await readFreshStamp({ source: "s1", stampPath });
    expect(reason).toBeNull();
    expect(stamp.manifest).toEqual(manifest);
    expect(stamp.outDir).toBe(path.resolve(outDir));
  });

  it("is stale once the source changes", async () => {
    await writeStamp({ outDir, manifest, source: "s1", stampPath });
    expect((await readFreshStamp({ source: "s2", stampPath })).stamp).toBeNull();
  });

  it("is never fresh without a source fingerprint", async () => {
    await writeStamp({ outDir, manifest, source: null, stampPath });
    expect((await readFreshStamp({ source: null, stampPath })).stamp).toBeNull();
  });

  it("is stale once a file it names is changed or gone", async () => {
    await writeStamp({ outDir, manifest, source: "s1", stampPath });
    await writeFile(path.join(outDir, "assets/x-b.js"), "rebuilt");
    expect((await readFreshStamp({ source: "s1", stampPath })).reason).toMatch(/x-b\.js/);

    await writeStamp({ outDir, manifest, source: "s1", stampPath });
    await rm(path.join(outDir, "assets/index-a.css"));
    expect((await readFreshStamp({ source: "s1", stampPath })).reason).toMatch(/index-a\.css/);
  });

  it("is ignored when missing, unreadable or malformed", async () => {
    expect((await readFreshStamp({ source: "s1", stampPath })).reason).toBe("no build stamp");
    await mkdir(path.dirname(stampPath), { recursive: true });
    await writeFile(stampPath, "{not json");
    expect((await readFreshStamp({ source: "s1", stampPath })).reason).toBe(
      "unreadable build stamp",
    );
    await writeFile(stampPath, JSON.stringify({ source: "s1" }));
    expect((await readFreshStamp({ source: "s1", stampPath })).reason).toBe(
      "malformed build stamp",
    );
  });

  it("is stale when the hashes do not cover the manifest", async () => {
    await writeStamp({ outDir, manifest, source: "s1", stampPath });
    const stamp = JSON.parse(await readFile(stampPath, "utf8"));
    delete stamp.files["assets/x-b.js"];
    await writeFile(stampPath, JSON.stringify(stamp));
    expect((await readFreshStamp({ source: "s1", stampPath })).reason).toBe(
      "malformed build stamp",
    );
  });
});

describe("the source fingerprint", () => {
  it("is vouched for only if unchanged since the build started, and only once", async () => {
    await recordBuildStart("dist");
    expect(await sourceIfUnchanged("dist")).toBe(sourceFingerprint());
    expect(await sourceIfUnchanged("dist")).toBeNull();
  });

  it("is not vouched for after a build into another folder", async () => {
    await recordBuildStart(outDir);
    expect(await sourceIfUnchanged("dist")).toBeNull();
  });

  it("is not vouched for when the source changed mid-build", async () => {
    await recordBuildStart("dist");
    const edit = path.join("tools", `.mid-build-edit-${process.pid}.txt`);
    await writeFile(edit, "edited while building");
    try {
      expect(await sourceIfUnchanged("dist")).toBeNull();
    } finally {
      await rm(edit, { force: true });
    }
  });

  it("is stable while nothing changes", () => {
    const first = sourceFingerprint();
    expect(first).toMatch(/^[0-9a-f]{64}$/);
    expect(sourceFingerprint()).toBe(first);
  });
});
