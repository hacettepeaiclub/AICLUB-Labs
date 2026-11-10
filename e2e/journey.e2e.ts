import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test.describe(`new visitor at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
    });

    test("evaluation stays independent after hiding validation and locking the model", async ({
      page,
    }) => {
      await page.goto("/labs/generalization/");
      await page.getByRole("button", { name: "Try it" }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      const k = page.getByRole("slider", { name: "Neighbours voting (k)" });
      await expect(page.getByRole("button", { name: "Lock model & test once" })).toBeDisabled();
      await page.getByRole("button", { name: "Reveal unseen examples" }).click();
      await k.focus();
      await k.press("ArrowRight");
      await expect(k).toHaveValue("3");
      await page.getByRole("button", { name: "Show training points" }).click();
      // Hiding an already-seen holdout must not unlock the sampling process.
      await expect(page.locator('input[type="range"]').nth(1)).toBeDisabled();
      await page.getByRole("button", { name: "Reveal unseen examples" }).click();
      await page.getByRole("button", { name: "Lock model & test once" }).click();
      await expect(k).toBeDisabled();
      await expect(page.getByRole("button", { name: "Lock model & test once" })).toBeDisabled();
      await page.getByRole("button", { name: "New dataset", exact: true }).click();
      await expect(k).toBeEnabled();
      await expect(k).toHaveValue("1");
      await expect(page.locator('input[type="range"]').nth(1)).toBeEnabled();
    });

    test("the exploration route opens optional depth and preserves its controls", async ({
      page,
    }) => {
      await page.goto("/labs/gradient-descent/");
      const optional = page.locator("details.lab-deeper").first();
      await expect(optional).not.toHaveAttribute("open");
      const title = await optional.locator("h2").textContent();
      await page.locator("[data-lab-orientation] summary").click();
      await page.getByRole("button", { name: new RegExp(title!) }).click();
      await expect(optional).toHaveAttribute("open", "");
      const slider = optional.getByRole("slider").first();
      await slider.focus();
      await slider.press("ArrowRight");
      const value = await slider.inputValue();
      await optional.locator(":scope > summary").click();
      await optional.locator(":scope > summary").click();
      await expect(slider).toHaveValue(value);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    });
  });
}
