/**
 * Which elements move while a page loads, and by how much.
 *
 *     node tools/perf-shifts.mjs --origin http://localhost:4185 [/route ...] [--phone] [--no-ambient]
 *
 * Loads each route (laptop 1280×800, or the phone profile of
 * tools/perf-audit.mjs with --phone) and lists every layout-shift entry not
 * caused by input: its time, its value, and for each source node a selector,
 * its box before and after. CLS is their sum. This is the evidence for a
 * layout-shift fix; tools/perf-audit.mjs gives the medians.
 */

/* global window, Element */

import { chromium } from "playwright-core";

function observeShifts() {
  window.__shifts = [];
  const describe = (node) => {
    if (!(node instanceof Element)) return node ? node.nodeName : "(gone)";
    const id = node.id ? `#${node.id}` : "";
    const cls =
      node.className && typeof node.className === "string"
        ? `.${node.className.trim().split(/\s+/).slice(0, 3).join(".")}`
        : "";
    const text = (node.textContent ?? "").trim().slice(0, 40);
    return `${node.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
  };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      window.__shifts.push({
        at: Math.round(entry.startTime),
        value: entry.value,
        sources: (entry.sources ?? []).map((s) => ({
          node: describe(s.node),
          from: [
            s.previousRect.x,
            s.previousRect.y,
            s.previousRect.width,
            s.previousRect.height,
          ].map(Math.round),
          to: [s.currentRect.x, s.currentRect.y, s.currentRect.width, s.currentRect.height].map(
            Math.round,
          ),
        })),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
}

async function main() {
  const args = process.argv.slice(2);
  const at = args.indexOf("--origin");
  const origin = new URL(at >= 0 ? args[at + 1] : "http://localhost:4185").origin;
  const routes = args.filter((a) => a.startsWith("/"));
  const phone = args.includes("--phone");
  // --width N: a plain desktop browser at that width (as the e2e suite runs
  // a "phone" viewport), rather than the emulated, throttled phone.
  const widthAt = args.indexOf("--width");
  const width = widthAt >= 0 ? Number(args[widthAt + 1]) : 1280;
  const heightAt = args.indexOf("--height");
  const height = heightAt >= 0 ? Number(args[heightAt + 1]) : 800;
  const ambient = !args.includes("--no-ambient");
  const browser = await chromium.launch();
  try {
    for (const route of routes.length ? routes : ["/"]) {
      const context = await browser.newContext({
        // --reduced: as the e2e suite runs (playwright.config.ts).
        reducedMotion: args.includes("--reduced") ? "reduce" : "no-preference",
        ...(phone
          ? {
              viewport: { width: 390, height: 844 },
              deviceScaleFactor: 3,
              isMobile: true,
              hasTouch: true,
            }
          : { viewport: { width, height } }),
      });
      await context.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
      await context.addInitScript(observeShifts);
      await context.route("**/cloud.umami.is/**", (r) => r.abort());
      if (!ambient) await context.route(/\/assets\/FaultyTerminal-[^/]+\.js/, (r) => r.abort());
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      if (phone) {
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", {
          offline: false,
          latency: 150,
          downloadThroughput: 1.6e6 / 8 / 0.9,
          uploadThroughput: 750e3 / 8 / 0.9,
        });
      }
      await page.goto(origin + route, { waitUntil: "load" });
      await page.waitForTimeout(5000);
      const shifts = await page.evaluate(() => window.__shifts);
      const cls = shifts.reduce((sum, s) => sum + s.value, 0);
      console.log(
        `\n${route} [${phone ? "phone" : `desktop ${width}px`}${ambient ? "" : ", no ambient"}]  CLS ${cls.toFixed(3)}`,
      );
      for (const s of shifts) {
        console.log(`  ${String(s.at).padStart(6)} ms  ${s.value.toFixed(3)}`);
        for (const src of s.sources)
          console.log(`      ${src.node}  ${src.from.join(",")} → ${src.to.join(",")}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
