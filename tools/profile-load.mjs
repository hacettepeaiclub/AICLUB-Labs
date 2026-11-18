/**
 * Where a page's load-time main-thread work goes, by function.
 *
 *     node tools/profile-load.mjs /labs/gradient-descent/ [--width 1280] [--cpu 1] [--top 25]
 *
 * Runs the app from source on Vite's dev server (so functions keep their
 * names and files), records a V8 CPU profile from navigation until the page
 * has been quiet for a second, and prints the functions with the most self
 * time, and the source files with the most total self time. Dev-mode code is
 * slower than production, so read the shares, not the milliseconds.
 */

import path from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

async function main() {
  const args = process.argv.slice(2);
  const route = args.find((a) => a.startsWith("/"));
  if (!route) throw new Error("Give a route, e.g. /labs/gradient-descent/");
  const option = (name, fallback) => {
    const at = args.indexOf(name);
    return at >= 0 ? Number(args[at + 1]) : fallback;
  };
  const width = option("--width", 1280);
  const cpu = option("--cpu", 1);
  const top = option("--top", 25);
  // --click <name>: profile the 5 s after clicking the first button with this
  // accessible name, instead of the load.
  const clickAt = args.indexOf("--click");
  const click = clickAt >= 0 ? args[clickAt + 1] : null;

  let server = null;
  let browser = null;
  try {
    server = await createServer({ root: ROOT, logLevel: "error", server: { port: 0 } });
    await server.listen();
    const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      reducedMotion: "no-preference",
    });
    await context.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
    await context.route("**/cloud.umami.is/**", (r) => r.abort());
    // A first visit compiles every module on the dev server; profile the second.
    const warm = await context.newPage();
    await warm.goto(origin + route, { waitUntil: "load" });
    await warm.waitForTimeout(3000);
    await warm.close();

    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
    if (click) {
      await page.goto(origin + route, { waitUntil: "load" });
      const button = page.getByRole("button", { name: click, exact: true }).first();
      await button.waitFor({ state: "visible", timeout: 60_000 });
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await cdp.send("Profiler.start");
      await button.click();
      await page.waitForTimeout(5000);
    } else {
      await cdp.send("Profiler.start");
      await page.goto(origin + route, { waitUntil: "load" });
      await page.waitForTimeout(4000);
    }
    const { profile } = await cdp.send("Profiler.stop");

    const byId = new Map(profile.nodes.map((n) => [n.id, n]));
    const self = new Map();
    const dt = profile.timeDeltas;
    profile.samples.forEach((id, i) => {
      self.set(id, (self.get(id) ?? 0) + (dt[i] ?? 0) / 1000);
    });
    const fns = new Map();
    const files = new Map();
    for (const [id, ms] of self) {
      const { callFrame } = byId.get(id);
      const file = callFrame.url.replace(origin, "").replace(/\?.*$/, "") || "(native)";
      if (/^\((idle|program|garbage collector)\)$/.test(callFrame.functionName)) continue;
      const key = `${callFrame.functionName || "(anonymous)"}  ${file}:${callFrame.lineNumber + 1}`;
      fns.set(key, (fns.get(key) ?? 0) + ms);
      files.set(file, (files.get(file) ?? 0) + ms);
    }
    const total = [...fns.values()].reduce((a, b) => a + b, 0);
    const show = (map, n) =>
      [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(
          ([k, ms]) =>
            `  ${ms.toFixed(0).padStart(6)} ms  ${((ms / total) * 100).toFixed(1).padStart(5)}%  ${k}`,
        )
        .join("\n");
    console.log(
      `\n${route}${click ? ` after clicking "${click}"` : ""} at ${width}px, CPU ×${cpu}: ${total.toFixed(0)} ms of script self time\n`,
    );
    console.log(`Functions:\n${show(fns, top)}\n\nFiles:\n${show(files, 15)}`);
  } finally {
    await browser?.close();
    await server?.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
