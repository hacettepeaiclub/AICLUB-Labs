import { expect, test, type Locator } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

async function expectTouchTarget(button: Locator) {
  await expect(button).toBeVisible();
  const bounds = await button.boundingBox();
  expect(bounds?.width).toBeGreaterThanOrEqual(44);
  expect(bounds?.height).toBeGreaterThanOrEqual(44);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`Turkish finder in ${theme} mode`, () => {
    test.beforeEach(async ({ page }) => {
      await page.route("**/cloud.umami.is/**", (route) => route.abort());
      await page.addInitScript((initialTheme) => {
        localStorage.setItem("aiclub-labs-language", "tr");
        localStorage.setItem("aiclub-labs-theme", initialTheme);
      }, theme);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "tr");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    });

    test("one tap opens the finder from the header and Escape restores focus", async ({ page }) => {
      const trigger = page.getByRole("button", { name: "Lab ara", exact: true });
      await expectTouchTarget(trigger);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        390,
      );

      await trigger.tap();
      const finder = page.getByRole("dialog", { name: "Lab ara" });
      const search = finder.getByRole("combobox");
      await expect(search).toBeFocused();
      await search.press("Escape");
      await expect(finder).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test("the localized close control works by touch and keyboard", async ({ page }) => {
      const trigger = page.getByRole("button", { name: "Lab ara", exact: true });
      const finder = page.getByRole("dialog", { name: "Lab ara" });
      const search = finder.getByRole("combobox");
      const close = finder.getByRole("button", { name: /^kapat$/i });

      await trigger.tap();
      await expectTouchTarget(close);
      await close.tap();
      await expect(finder).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.press("Enter");
      await expect(search).toBeFocused();
      await search.press("Tab");
      await expect(close).toBeFocused();
      await close.press("Enter");
      await expect(finder).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  });
}
