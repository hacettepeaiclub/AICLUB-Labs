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

test("a drag rotates the PCA picture at a mobile viewport", async ({
  page,
  context,
  browserName,
}) => {
  await page.goto("/labs/pca/");
  const picture = page.locator("[data-stage]").first().locator("svg[role=img]");
  await picture.scrollIntoViewIfNeeded();
  const axis = picture.locator("line").first();
  const before = await axis.getAttribute("x1");
  const bounds = await picture.boundingBox();
  if (!bounds) throw new Error("PCA picture has no bounding box");
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  const distance = bounds.width / 4;

  if (browserName === "chromium") {
    const input = await context.newCDPSession(page);
    try {
      await input.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (const step of [1, 2, 3, 4]) {
        await input.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x + (distance * step) / 4, y }],
        });
      }
      await input.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } finally {
      await input.detach();
    }
  } else {
    // WebKit exposes touch taps but has no Playwright touch drag API.
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + distance, y, { steps: 4 });
    await page.mouse.up();
  }
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
  const trigger = page.getByRole("button", { name: "Find a lab", exact: true });
  await expect(trigger).toBeVisible();
  const target = await trigger.boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await trigger.tap();
  const finder = page.getByRole("dialog", { name: "Find a lab" });
  await expect(finder.getByRole("combobox")).toBeFocused();
  expect(await finder.evaluate((dialog) => dialog.matches(":modal"))).toBe(true);
  const close = finder.getByRole("button", { name: "close" });
  const closeTarget = await close.boundingBox();
  expect(closeTarget?.width).toBeGreaterThanOrEqual(44);
  expect(closeTarget?.height).toBeGreaterThanOrEqual(44);
  await close.tap();
  await expect(finder).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the mobile navigation fits on screen with full-sized link targets", async ({ page }) => {
  const width = 390;
  await page.setViewportSize({ width, height: 850 });
  await page.goto("/");
  const menu = page.locator('summary[aria-label="Navigation"]');
  const menuTarget = await menu.boundingBox();
  expect(menuTarget?.width).toBeGreaterThanOrEqual(44);
  expect(menuTarget?.height).toBeGreaterThanOrEqual(44);
  await menu.tap();

  const navigation = page.getByRole("navigation", { name: "Primary" });
  const bounds = await navigation.boundingBox();
  if (!bounds) throw new Error("Mobile navigation is off screen");
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
  const links = navigation.getByRole("link");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    const target = await link.boundingBox();
    expect(target?.width).toBeGreaterThanOrEqual(44);
    expect(target?.height).toBeGreaterThanOrEqual(44);
  }

  await navigation.getByRole("link", { name: "Calculator" }).tap();
  await expect(page).toHaveURL("/calculator/");
  await expect(navigation).toBeHidden();
});
