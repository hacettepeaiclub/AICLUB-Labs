import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { labs } from "../src/labs/registry";

test.beforeEach(async ({ page }) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
});

async function scan(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations
      .filter(({ impact }) => impact === "serious" || impact === "critical")
      .map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(({ target }) => target) })),
  ).toEqual([]);
}

for (const path of [
  "/",
  "/calculator/",
  ...labs.map(({ meta }) => `/labs/${meta.slug}/`),
  "/missing/",
]) {
  test(`initial accessibility: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    if (path.startsWith("/labs/")) {
      await expect(page.locator(".lab-content h2").first()).toBeAttached();
    }
    await scan(page);
  });
}

test("experiment accessibility: gradient descent after a step", async ({ page }) => {
  await page.goto("/labs/gradient-descent/");
  const stage = page.locator("[data-stage]").first();
  await stage.getByRole("button", { name: "Step", exact: true }).click();
  await expect(stage.getByRole("slider", { name: "Step", exact: true })).toHaveValue("1");
  await scan(page);
});

test("experiment accessibility: hash table after inserting a key", async ({ page }) => {
  await page.goto("/labs/hash-tables/");
  const stage = page.locator("[data-stage]").first();
  await stage.getByRole("textbox", { name: "A key" }).fill("axe-scan");
  await stage.getByRole("button", { name: "Put it in" }).click();
  await expect(stage.locator("ol li").getByText("axe-scan", { exact: true })).toBeVisible();
  await scan(page);
});

test("experiment accessibility: probability after picking a door", async ({ page }) => {
  await page.goto("/labs/probability/");
  const stage = page.locator("[data-stage]").first();
  await stage.getByRole("button", { name: "Door 1, closed" }).click();
  await expect(stage.getByRole("button", { name: "Door 1, your pick" })).toBeVisible();
  await scan(page);
});

test("finder accessibility while open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find a lab", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Find a lab" })).toBeVisible();
  await scan(page);
});

test("learning guide accessibility while open", async ({ page }) => {
  await page.goto("/labs/pca/");
  await page.getByRole("button", { name: "Open the learning guide" }).click();
  const guide = page.getByRole("dialog").filter({ hasText: "Learning guide" });
  await expect(guide.getByRole("link").first()).toBeVisible();
  await scan(page);
});
