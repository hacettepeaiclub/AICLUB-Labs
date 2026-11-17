import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, browserName }) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  if (browserName === "webkit") {
    // The production CSP upgrades HTTP subresources, including those from the local preview.
    await page.route(
      (url) => url.hostname === "localhost",
      async (route) => {
        if (route.request().resourceType() !== "document") return route.fallback();
        const response = await route.fetch();
        const body = (await response.text()).replace(/upgrade-insecure-requests;?\s*/g, "");
        return route.fulfill({ response, body });
      },
    );
  }
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
});

test("a drag rotates the PCA picture at a mobile viewport", async ({ page }) => {
  await page.goto("/labs/pca/");
  const picture = page.locator("[data-stage]").first().locator("svg[role=img]");
  await picture.scrollIntoViewIfNeeded();
  const axis = picture.locator("line").first();
  const before = await axis.getAttribute("x1");
  const bounds = await picture.boundingBox();
  if (!bounds) throw new Error("PCA picture has no bounding box");
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  // Playwright's cross-browser touch API only exposes taps. Use its pointer
  // through the mobile layout to exercise the drag hooks in both engines.
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + bounds.width / 4, y, { steps: 4 });
  await page.mouse.up();
  await expect(axis).not.toHaveAttribute("x1", before ?? "");
});

test("touch opens a native learning dialog and closing it restores focus", async ({ page }) => {
  await page.goto("/labs/gradient-descent/");
  const open = page.getByRole("button", { name: "Open the learning guide" });
  // Preserve a prior focus target even in engines where tapping a button does not focus it.
  await open.focus();
  await open.tap();
  const guide = page.getByRole("dialog").filter({ hasText: "Learning guide" });
  await expect(guide).toBeVisible();
  expect(await guide.evaluate((dialog) => dialog.matches(":modal"))).toBe(true);
  await guide.getByRole("button", { name: /close/i }).tap();
  await expect(guide).toBeHidden();
  await expect(open).toBeFocused();
});

test("touch opens and dismisses the native finder from a lab", async ({ page }) => {
  await page.goto("/labs/pca/");
  await page.locator('summary[aria-label="Navigation"]').tap();
  await page.getByRole("button", { name: "Find a lab", exact: true }).tap();
  const finder = page.getByRole("dialog", { name: "Find a lab" });
  await expect(finder.getByRole("combobox")).toBeFocused();
  expect(await finder.evaluate((dialog) => dialog.matches(":modal"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(finder).toBeHidden();
});
