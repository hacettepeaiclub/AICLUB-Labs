/**
 * What a visitor waits for, measured on the built site in Chromium.
 *
 *     npm run build
 *     npx vite preview --port 4185 --strictPort &
 *     node tools/perf-audit.mjs --origin http://localhost:4185 [--runs 3] [--out file.json]
 *
 * For the home page and the heaviest labs, on a laptop profile and on a phone
 * profile (390 × 844, 4× CPU slowdown, a fast-4G network), it records:
 *
 * - **LCP** and **CLS** from the page's own PerformanceObservers.
 * - **JavaScript downloaded** for the route: every script response,
 *   gzipped at level 9 (the server compresses; the preview does not), split
 *   into what loads before the page is interactive and what loads after.
 * - **Time to first interaction**: from navigation start until the lab's
 *   primary control is visible and enabled, and the main thread has been free
 *   of long tasks for a moment.
 * - **Long tasks** (> 50 ms) and **total blocking time** while the page loads,
 *   and again while the lab's main experiment runs.
 * - **INP proxy**: the longest Event Timing duration for the clicks the run
 *   makes on the lab's controls.
 *
 * Each metric is the median of `--runs` fresh browser contexts, with the raw
 * runs in the JSON. Nothing here runs in CI.
 */

/* global window */

import { writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright-core";

const PROFILES = {
  laptop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, cpu: 1, network: null },
  phone: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    cpu: 4,
    // Chrome DevTools' "Fast 4G".
    network: {
      latency: 150,
      downloadThroughput: 1.6e6 / 8 / 0.9,
      uploadThroughput: 750e3 / 8 / 0.9,
    },
  },
};

/**
 * The routes, and for each lab the control a visitor reaches for first and
 * what starts its main experiment. Names are the English accessible names.
 */
const ROUTES = [
  { path: "/", ready: (page) => page.locator("#labs a[href^='/labs/']").first() },
  {
    path: "/labs/probability/",
    ready: (page) => page.getByRole("button", { name: /^Door 1/ }).first(),
    run: async (page) => {
      const drop = page.getByRole("button", { name: "Drop balls" }).first();
      await drop.scrollIntoViewIfNeeded();
      await drop.click();
    },
  },
  {
    path: "/labs/gradient-descent/",
    ready: (page) => page.getByRole("button", { name: "Run", exact: true }).first(),
    run: async (page) => {
      await page.getByRole("button", { name: "Run", exact: true }).first().click();
    },
  },
  {
    path: "/labs/multilayer-perceptrons/",
    ready: (page) => page.getByRole("button", { name: "Train", exact: true }).first(),
    run: async (page) => {
      await page.getByRole("button", { name: "Train", exact: true }).first().click();
    },
  },
  {
    path: "/labs/jepa/",
    ready: (page) =>
      page
        .locator('[data-jepa-trainer="train"]')
        .getByRole("button", { name: "Train", exact: true }),
    run: async (page) => {
      const train = page
        .locator('[data-jepa-trainer="train"]')
        .getByRole("button", { name: "Train", exact: true });
      await train.scrollIntoViewIfNeeded();
      await train.click();
    },
  },
];

/** How long the experiment runs while long tasks are counted. */
const RUN_MS = 5000;
/** A quiet main thread for this long counts as interactive. */
const QUIET_MS = 500;

const median = (values) => {
  const sorted = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

function observe() {
  const state = { lcp: 0, cls: 0, longTasks: [], events: [] };
  window.__perf = state;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) state.lcp = entry.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) state.cls += entry.value;
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      state.longTasks.push({ start: entry.startTime, duration: entry.duration });
  }).observe({ type: "longtask", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      state.events.push({ name: entry.name, start: entry.startTime, duration: entry.duration });
  }).observe({ type: "event", buffered: true, durationThreshold: 16 });
}

const tbt = (tasks) => tasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0);

async function measure(browser, origin, route, profile, { ambient = true } = {}) {
  const { cpu, network, ...contextOptions } = PROFILES[profile];
  const context = await browser.newContext({ ...contextOptions, reducedMotion: "no-preference" });
  await context.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  await context.addInitScript(observe);
  await context.route("**/cloud.umami.is/**", (r) => r.abort());
  // --no-ambient: the site-wide WebGL decoration is left out (its chunk fails
  // and it renders nothing, as it already does when that chunk cannot load).
  // Headless Chromium here draws WebGL with SwiftShader, on the CPU, so its
  // cost on this host says little about a real device's GPU.
  if (!ambient) await context.route(/\/assets\/FaultyTerminal-[^/]+\.js/, (r) => r.abort());
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  if (network) {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, ...network });
  }

  const scripts = [];
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "script") return;
    const url = new URL(response.url());
    if (url.origin !== origin) return;
    try {
      const body = await response.body();
      scripts.push({
        url: url.pathname,
        at: Date.now(),
        gzip: gzipSync(body, { level: 9 }).length,
      });
    } catch {
      // A response with no body (an aborted request) costs nothing.
    }
  });

  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const started = Date.now();
  await page.goto(origin + route.path, { waitUntil: "load" });
  const control = route.ready(page);
  await control.waitFor({ state: "visible", timeout: 60_000 });
  // Enabled, and then a quiet main thread: what a click needs to be answered.
  // Then a quiet main thread: what a click needs to be answered. Polled from
  // here, since the site's CSP (rightly) refuses the eval waitForFunction uses.
  const deadline = Date.now() + 60_000;
  for (;;) {
    const quietFor = await page.evaluate(() => {
      const tasks = window.__perf.longTasks;
      const last = tasks.length ? tasks[tasks.length - 1] : null;
      return performance.now() - (last ? last.start + last.duration : 0);
    });
    if (quietFor >= QUIET_MS) break;
    if (Date.now() > deadline) throw new Error(`${route.path}: never quiet for ${QUIET_MS} ms`);
    await page.waitForTimeout(100);
  }
  // Interactive: the control is usable and the last long task before the
  // quiet spell has ended (or, with none, the document is parsed).
  const interactiveAt = await page.evaluate(() => {
    const tasks = window.__perf.longTasks;
    const last = tasks.length ? tasks[tasks.length - 1] : null;
    const parsed = performance.getEntriesByType("navigation")[0]?.domContentLoadedEventEnd ?? 0;
    return Math.max(parsed, last ? last.start + last.duration : 0);
  });
  const interactiveWall = Date.now();
  const atLoad = await page.evaluate(() => JSON.parse(JSON.stringify(window.__perf)));

  let run = null;
  if (route.run) {
    const before = atLoad.longTasks.length;
    const t0 = await page.evaluate(() => performance.now());
    try {
      await route.run(page);
    } catch (error) {
      errors.push(`run: ${String(error.message).split("\n")[0]}`);
    }
    await page.waitForTimeout(RUN_MS);
    const after = await page.evaluate(() => JSON.parse(JSON.stringify(window.__perf)));
    const tasks = after.longTasks.slice(before).filter((t) => t.start >= t0);
    const clicks = after.events.filter((e) => e.start >= t0 && /pointer|click|key/.test(e.name));
    run = {
      longTasks: tasks.length,
      longestTask: tasks.reduce((m, t) => Math.max(m, t.duration), 0),
      blockingMs: tbt(tasks),
      inpProxy: clicks.reduce((m, e) => Math.max(m, e.duration), 0),
    };
  }
  const final = await page.evaluate(() => JSON.parse(JSON.stringify(window.__perf)));
  await context.close();

  const loadTasks = atLoad.longTasks;
  const jsBefore = scripts.filter((s) => s.at <= interactiveWall).reduce((n, s) => n + s.gzip, 0);
  const jsAll = scripts.reduce((n, s) => n + s.gzip, 0);
  return {
    lcp: atLoad.lcp,
    cls: final.cls,
    interactive: interactiveAt,
    wallToInteractive: interactiveWall - started,
    loadLongTasks: loadTasks.length,
    loadBlockingMs: tbt(loadTasks),
    longestLoadTask: loadTasks.reduce((m, t) => Math.max(m, t.duration), 0),
    jsBeforeInteractiveKB: jsBefore / 1024,
    jsTotalKB: jsAll / 1024,
    scripts: scripts.length,
    run,
    errors,
  };
}

const METRICS = [
  ["lcp", "LCP ms"],
  ["cls", "CLS"],
  ["interactive", "interactive ms"],
  ["loadBlockingMs", "load TBT ms"],
  ["longestLoadTask", "longest load task ms"],
  ["jsBeforeInteractiveKB", "JS before interactive KB gz"],
  ["jsTotalKB", "JS total KB gz"],
  ["run.longTasks", "run long tasks"],
  ["run.blockingMs", "run TBT ms"],
  ["run.longestTask", "run longest task ms"],
  ["run.inpProxy", "INP proxy ms"],
];
const pick = (result, key) =>
  key.split(".").reduce((value, part) => (value == null ? null : value[part]), result);

async function main() {
  const args = process.argv.slice(2);
  const option = (name, fallback) => {
    const at = args.indexOf(name);
    return at >= 0 ? args[at + 1] : fallback;
  };
  const origin = new URL(option("--origin", "http://localhost:4185")).origin;
  const runs = Number(option("--runs", "3"));
  const out = option("--out", null);
  const only = option("--route", null);
  const ambient = !args.includes("--no-ambient");
  if (!Number.isInteger(runs) || runs < 1) throw new Error("--runs must be a positive integer");

  const browser = await chromium.launch();
  const report = { origin, runs, ambient, when: new Date().toISOString(), results: [] };
  try {
    for (const route of ROUTES.filter((r) => !only || r.path === only)) {
      for (const profile of Object.keys(PROFILES)) {
        const raw = [];
        for (let i = 0; i < runs; i++)
          raw.push(await measure(browser, origin, route, profile, { ambient }));
        const summary = {};
        for (const [key] of METRICS) summary[key] = median(raw.map((r) => pick(r, key)));
        report.results.push({ path: route.path, profile, summary, raw });
        console.log(`\n${route.path}  [${profile}]  median of ${runs}`);
        for (const [key, label] of METRICS) {
          const value = summary[key];
          if (value === null) continue;
          console.log(
            `  ${label.padEnd(30)} ${key === "cls" ? value.toFixed(3) : value.toFixed(0)}`,
          );
        }
        const errors = raw.flatMap((r) => r.errors);
        if (errors.length) console.log(`  page errors: ${[...new Set(errors)].join(" | ")}`);
      }
    }
  } finally {
    await browser.close();
  }
  if (out) await writeFile(out, `${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
