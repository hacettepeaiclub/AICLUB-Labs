import { expect, test } from "@playwright/test";

const FINDER_CHUNK = /\/assets\/LabPalette-[^/?]+\.js$/;

test.beforeEach(async ({ page }) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  let intercepted = false;
  await page.route(FINDER_CHUNK, (route) => {
    intercepted = true;
    return route.abort();
  });
  await page.goto("/labs/pca/");
  await page.getByRole("button", { name: /^Find a lab/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Finder unavailable." })).toBeVisible();
  // Idle prefetch can hit the route before navigation completes.
  expect(intercepted).toBe(true);
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
  await page.getByRole("button", { name: /^Find a lab/ }).click();
  await expect(page.getByRole("dialog", { name: "Find a lab" })).toBeVisible();
});

test("finder recovery is dismissible and clears on unrelated navigation", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Find a lab" });
  const alert = page.getByRole("alert").filter({ hasText: "Finder unavailable." });
  const dismiss = page.getByRole("button", { name: "Dismiss" });

  await dismiss.press("Enter");
  await expect(alert).toBeHidden();
  await expect(trigger).toBeFocused();

  const calculator = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Calculator" });
  await calculator.press("Control+k");
  await expect(alert).toBeVisible();
  await dismiss.press("Enter");
  await expect(alert).toBeHidden();
  await expect(calculator).toBeFocused();

  await trigger.press("Enter");
  await expect(alert).toBeVisible();
  await calculator.click();
  await expect(page).toHaveURL("/calculator/");
  await expect(alert).toBeHidden();
});
