import { expect, test, type Page } from "@playwright/test";

/**
 * Nothing on the first screen jumps while a page loads.
 *
 * The home page's layout shift was 0.26 on a laptop and 0.31 on a phone
 * ("poor" is above 0.25): the footer stood on screen until the page's chunk
 * pushed it away, and the static loading text sat the whole body 12vh down.
 * The bar here is Google's "good", 0.1, summed over every shift not caused by
 * input in the first few seconds. tools/perf-shifts.mjs lists the elements
 * when this fails.
 */

const ROUTES = ["/", "/calculator/", "/labs/probability/", "/labs/gradient-descent/"];

async function cumulativeShift(page: Page, path: string) {
  await page.addInitScript(() => {
    localStorage.setItem("aiclub-labs-language", "en");
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  // The WebGL decoration is optional and renders nothing without its chunk;
  // leaving it out keeps a software-rendered GPU from slowing the run.
  await page.route(/\/assets\/FaultyTerminal-[^/]+\.js/, (route) => route.abort());
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.goto(path);
  await expect(page.locator("main h1")).toBeVisible();
  await page.waitForTimeout(2000);
  return page.evaluate(() => (window as unknown as { __cls: number }).__cls);
}

for (const viewport of [
  { name: "laptop", width: 1280, height: 800 },
  { name: "phone", width: 390, height: 844 },
]) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });
    for (const path of ROUTES) {
      test(`layout shift on ${path} stays below 0.1`, async ({ page }) => {
        expect(await cumulativeShift(page, path)).toBeLessThan(0.1);
      });
    }
  });
}
