import { expect, test } from "@playwright/test";

const FINDER_CHUNK = /\/assets\/LabPalette-[^/?]+\.js$/;

test.beforeEach(async ({ page }) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  await page.route(FINDER_CHUNK, (route) => route.abort());
  await page.goto("/labs/pca/");
  await Promise.all([
    page.waitForEvent("requestfailed", (request) => FINDER_CHUNK.test(request.url())),
    page.getByRole("button", { name: "Find a lab", exact: true }).click(),
  ]);
  await expect(page.getByRole("alert").filter({ hasText: "Finder unavailable." })).toBeVisible();
});

test("a failed finder can return to all labs", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Reload page" })).toBeVisible();
  await page.getByRole("link", { name: "Back to all labs" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("#labs")).toBeVisible();
});

test("a failed finder can reload the current lab", async ({ page }) => {
  await page.unroute(FINDER_CHUNK);
  await Promise.all([
    page.waitForEvent("domcontentloaded"),
    page.getByRole("button", { name: "Reload page" }).click(),
  ]);
  await expect(page).toHaveURL("/labs/pca/");
  await page.getByRole("button", { name: "Find a lab", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Find a lab" })).toBeVisible();
});
