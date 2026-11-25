import { expect, test } from "@playwright/test";

import { en } from "../src/i18n/en";
import { tr } from "../src/i18n/tr";

const homeCopy = [
  { language: "en", ...en.home },
  { language: "tr", ...tr.home },
];

for (const { width, touch } of [
  { width: 320, touch: true },
  { width: 390, touch: true },
  { width: 1280, touch: false },
]) {
  test.describe(`home at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: touch, hasTouch: touch });

    for (const copy of homeCopy) {
      test(`introduces the labs and scrolls to them in ${copy.language}`, async ({ page }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript(
          (language) => localStorage.setItem("aiclub-labs-language", language),
          copy.language,
        );
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("lang", copy.language);

        const header = page.getByRole("banner");
        await expect(header.getByRole("link", { name: "AI Club Labs", exact: true })).toBeVisible();
        const hero = page.getByRole("region", { name: copy.title });
        await expect(hero.getByRole("heading", { level: 1, name: copy.title })).toBeVisible();
        await expect(hero.getByText(copy.lede, { exact: true })).toBeVisible();
        const browse = hero.getByRole("link", { name: copy.browse });
        await expect(browse).toBeInViewport();

        const labs = page.getByRole("region", { name: copy.labs, exact: true });
        const heading = labs.getByRole("heading", { name: copy.labs, exact: true });
        if (touch) {
          await expect(heading).toBeInViewport({ ratio: 1 });
          await browse.tap();
        } else {
          await browse.press("Enter");
        }

        await expect(page).toHaveURL(/#labs$/);
        await expect(heading).toBeInViewport({ ratio: 1 });
        await expect
          .poll(async () => {
            const headerBox = await header.boundingBox();
            const headingBox = await heading.boundingBox();
            if (!headerBox || !headingBox) throw new Error("Expected a visible header and heading");
            return headingBox.y - (headerBox.y + headerBox.height);
          })
          .toBeGreaterThanOrEqual(0);
      });
    }
  });
}
