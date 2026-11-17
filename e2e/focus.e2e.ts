import { expect, test } from "@playwright/test";

test("keyboard navigation from a lab card focuses the destination heading", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).not.toBeFocused();

  const card = page.locator('main a[href="/labs/sorting/"]').first();
  await card.focus();
  await expect(card).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/labs\/sorting\/?$/);
  await expect(heading).toBeFocused();
  await expect(heading).toHaveAttribute("tabindex", "-1");
});
