import { expect, test } from "@playwright/test";

const HOME_CHUNK = /\/assets\/HomePage-[^/?]+\.js$/;

for (const width of [390, 1280]) {
  test(`the footer stays below the fold while home loads at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.route("**/cloud.umami.is/**", (route) => route.abort());
    let release!: () => void;
    const hold = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(HOME_CHUNK, async (route) => {
      await hold;
      await route.continue();
    });

    const labs = page.locator("#labs");
    const footer = page.getByRole("contentinfo");
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(footer).toBeAttached();
      await expect(labs).toHaveCount(0);
      const spaceBelowFold = await footer.evaluate(
        (element) => element.getBoundingClientRect().top - window.innerHeight,
      );
      expect(spaceBelowFold).toBeGreaterThanOrEqual(0);
    } finally {
      release();
    }
    await expect(labs).toBeVisible();
  });
}
