import { expect, test } from "@playwright/test";
import { tr } from "../src/i18n/tr";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test.beforeEach(async ({ page }) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "tr"));
});

test("Turkish mobile navigation fits the screen and its links can be tapped", async ({ page }) => {
  await page.goto("/");
  await page.locator('summary[aria-label="Gezinme"]').tap();
  const menu = page.getByRole("navigation", { name: "Ana menü" });
  await expect(menu).toBeVisible();
  const bounds = await menu.boundingBox();
  if (!bounds) throw new Error("Expected visible mobile navigation");
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  const links = menu.getByRole("link");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    const target = await link.boundingBox();
    expect(target?.width).toBeGreaterThanOrEqual(44);
    expect(target?.height).toBeGreaterThanOrEqual(44);
  }
  await menu.getByRole("link", { name: "Hesap makinesi" }).tap();
  await expect(page).toHaveURL("/calculator/");
  await expect(menu).toBeHidden();
});

test("Turkish touch finder recovery restores focus and clears on navigation", async ({ page }) => {
  await page.route(/\/assets\/LabPalette-[^/?]+\.js$/, (route) => route.abort());
  await page.goto("/");
  const finder = page.getByRole("button", { name: tr.palette.open, exact: true });
  const alert = page.getByRole("alert").filter({ hasText: tr.palette.unavailable });

  await finder.tap();
  await expect(alert).toBeVisible();
  await page.getByRole("button", { name: /^kapat$/i }).tap();
  await expect(alert).toBeHidden();
  await expect(finder).toBeFocused();

  await finder.tap();
  await expect(alert).toBeVisible();
  await page.locator('summary[aria-label="Gezinme"]').tap();
  await page
    .getByRole("navigation", { name: "Ana menü" })
    .getByRole("link", { name: "Hesap makinesi" })
    .tap();
  await expect(page).toHaveURL("/calculator/");
  await expect(alert).toBeHidden();
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeFocused();
});
