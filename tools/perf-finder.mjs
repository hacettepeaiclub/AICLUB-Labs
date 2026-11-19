/**
 * How long the lab finder takes to appear after a tap, on the built site.
 *
 *     node tools/perf-finder.mjs --origin http://localhost:4185 [--runs 5]
 *
 * The finder is its own chunk, fetched when the browser is idle or when the
 * header button is pointed at. Two cases, on the home page and on a lab, for
 * the laptop and phone profiles of tools/perf-audit.mjs:
 *
 * - **cold**: the tap comes before any prefetch (idle prefetch is held back by
 *   blocking the chunk until the tap, then releasing it), so the chunk is
 *   fetched on demand;
 * - **warm**: the page has been idle long enough for the prefetch to finish.
 *
 * Reported: tap → finder chunk response, and tap → dialog visible with the
 * search box focused. Medians of `--runs`.
 */

import { chromium } from "playwright-core";

const PROFILES = {
  laptop: { viewport: { width: 1280, height: 800 }, cpu: 1, network: null },
  phone: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    cpu: 4,
    network: {
      latency: 150,
      downloadThroughput: 1.6e6 / 8 / 0.9,
      uploadThroughput: 750e3 / 8 / 0.9,
    },
  },
};
const ROUTES = ["/", "/labs/sorting/"];
const FINDER = /\/assets\/LabPalette-[^/?]+\.js(\?.*)?$/;

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/** Open the finder the way a visitor on this profile would. */
async function openFinder(page, phone) {
  if (phone) {
    await page.locator('summary[aria-label="Navigation"]').tap();
    await page.getByRole("button", { name: "Find a lab", exact: true }).tap();
  } else {
    await page
      .getByRole("button", { name: /^Find a lab/ })
      .first()
      .click();
  }
}

async function once(browser, origin, route, profile, cold) {
  const { cpu, network, ...options } = PROFILES[profile];
  const context = await browser.newContext({ ...options, reducedMotion: "no-preference" });
  await context.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  await context.route("**/cloud.umami.is/**", (r) => r.abort());
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  if (network) {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, ...network });
  }

  // Cold: hold the finder chunk until the tap, so no prefetch can land first.
  let release = null;
  if (cold) {
    const gate = new Promise((resolve) => (release = resolve));
    await page.route(FINDER, async (r) => {
      await gate;
      await r.continue();
    });
  }
  await page.goto(origin + route, { waitUntil: "load" });
  await page.waitForTimeout(cold ? 1500 : 6000);

  let chunkAt = null;
  page.on("response", (response) => {
    if (FINDER.test(response.url()) && chunkAt === null) chunkAt = Date.now();
  });
  const tap = Date.now();
  release?.();
  await openFinder(page, profile === "phone");
  const dialog = page.getByRole("dialog", { name: "Find a lab" });
  await dialog.getByRole("combobox").waitFor({ state: "visible", timeout: 30_000 });
  const shown = Date.now();
  await context.close();
  return { chunk: chunkAt === null ? null : chunkAt - tap, shown: shown - tap };
}

async function main() {
  const args = process.argv.slice(2);
  const option = (name, fallback) => {
    const at = args.indexOf(name);
    return at >= 0 ? args[at + 1] : fallback;
  };
  const origin = new URL(option("--origin", "http://localhost:4185")).origin;
  const runs = Number(option("--runs", "5"));
  const browser = await chromium.launch();
  try {
    for (const route of ROUTES) {
      for (const profile of Object.keys(PROFILES)) {
        for (const cold of [true, false]) {
          const raw = [];
          for (let i = 0; i < runs; i++)
            raw.push(await once(browser, origin, route, profile, cold));
          const chunks = raw.map((r) => r.chunk).filter((v) => v !== null);
          console.log(
            `${route.padEnd(16)} ${profile.padEnd(6)} ${cold ? "cold" : "warm"}  ` +
              `tap→chunk ${chunks.length ? `${median(chunks)} ms` : "already loaded"}  ` +
              `tap→dialog ${median(raw.map((r) => r.shown))} ms  (runs: ${raw.map((r) => r.shown).join(", ")})`,
          );
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
