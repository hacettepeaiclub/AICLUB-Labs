import { expect, test } from "@playwright/test";
import { labs } from "../src/labs/registry";

/**
 * "Try it" must land the first experiment fully below the sticky header.
 *
 * On a phone the header wraps to two rows, and a fixed scroll margin used to
 * leave each stage's first line — the question telling a newcomer what to do —
 * underneath it; word embeddings' whole question was hidden.
 */
const sizes = [
  { name: "phone", viewport: { width: 390, height: 844 } },
  { name: "laptop", viewport: { width: 1280, height: 800 } },
];

for (const { name, viewport } of sizes) {
  test.describe(`${name} ${viewport.width}px`, () => {
    test.use({ viewport });

    for (const language of ["en", "tr"] as const) {
      test(`Try it lands below the header in every lab (${language})`, async ({ page }) => {
        test.setTimeout(120_000);
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
        }, language);
        const label = language === "tr" ? /^Deneyi aç/ : /^Try it/;
        const missed: string[] = [];
        let checked = 0;
        for (const { meta } of labs) {
          await page.goto(`/labs/${meta.slug}/`);
          // The orientation card appears once the lab's own content has loaded.
          await page
            .locator(".lab-content [data-stage], .lab-content [data-tour=predict], .lab-content h2")
            .first()
            .waitFor();
          const tryIt = page.getByRole("button", { name: label });
          if ((await tryIt.count()) === 0) continue;
          await expect(tryIt).toBeEnabled();
          await tryIt.click();
          // Reduced motion (the suite's default) scrolls instantly; let layout settle.
          await page.waitForTimeout(100);
          const { top, header } = await page.evaluate(() => {
            const target = document.activeElement as HTMLElement;
            const bar = [...document.querySelectorAll("header")].find(
              (h) => getComputedStyle(h).position === "sticky",
            );
            return {
              top: target.getBoundingClientRect().top,
              header: bar ? bar.getBoundingClientRect().bottom : 0,
            };
          });
          checked++;
          if (top < header + 8) missed.push(`${meta.slug}: top ${top} vs header ${header}`);
        }
        expect(checked).toBeGreaterThan(15);
        expect(missed).toEqual([]);
      });
    }
  });
}
