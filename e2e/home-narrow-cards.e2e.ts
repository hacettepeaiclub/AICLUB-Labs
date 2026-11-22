import { expect, test } from "@playwright/test";

for (const { width, isMobile } of [
  { width: 320, isMobile: true },
  { width: 1280, isMobile: false },
]) {
  test.describe(`home lab cards at ${width}px`, () => {
    test.use({ viewport: { width, height: 850 }, isMobile, hasTouch: isMobile });

    for (const language of ["en", "tr"]) {
      test(`contain ${language} titles and open PCA`, async ({ page }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript(
          (lang) => localStorage.setItem("aiclub-labs-language", lang),
          language,
        );
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("lang", language);

        const cards = page
          .locator("#labs")
          .getByRole("link")
          .filter({
            has: page.getByRole("heading", { level: 3 }),
          });
        await expect(cards.first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        const overflow = await cards.evaluateAll((links) =>
          links.flatMap((link) => {
            const heading = link.querySelector("h3");
            if (!heading) return [];
            const column = heading.getBoundingClientRect();
            const title = document.createRange();
            title.selectNodeContents(heading);
            const extendsPastColumn = [...title.getClientRects()].some(
              (line) => line.left < column.left - 1 || line.right > column.right + 1,
            );
            return extendsPastColumn ? [heading.textContent] : [];
          }),
        );
        expect(overflow).toEqual([]);

        const pca = cards.filter({ has: page.getByRole("heading", { name: "The Widest Shadow" }) });
        if (isMobile) {
          await pca.tap();
        } else {
          await pca.click();
        }
        await expect(page).toHaveURL("/labs/pca/");
      });
    }
  });
}
