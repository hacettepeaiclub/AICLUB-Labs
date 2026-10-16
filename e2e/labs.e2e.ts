import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { tourFor } from "../src/components/lab/guide/tours";
import { GUIDES } from "../src/labs/learning";

/** Every lab on the home page has a learning guide, so this is the list. */
const SLUGS = Object.keys(GUIDES);

test.beforeEach(async ({ page }) => {
  // A test run is not a visit: the analytics script never loads.
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  // English, and every lab's first-visit welcome already seen, so no modal
  // stands between the test and the page.
  await page.addInitScript((slugs) => {
    localStorage.setItem("aiclub-labs-language", "en");
    localStorage.setItem("aiclub-labs-welcomed", JSON.stringify(slugs));
  }, SLUGS);
});

/** Uncaught exceptions and console errors, collected for the whole test. */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    // The analytics request is aborted on purpose (see beforeEach).
    if (message.type() === "error" && !message.text().includes("net::ERR_FAILED")) {
      errors.push(`console: ${message.text()}`);
    }
  });
  return errors;
}

test("the home page lists every lab", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  for (const slug of SLUGS) {
    await expect(page.locator(`a[href="/labs/${slug}/"]`).first()).toBeVisible();
  }
  expect(errors).toEqual([]);
});

for (const slug of SLUGS) {
  test(`${slug}: loads, tours every stage, opens its guide`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/labs/${slug}/`);
    await expect(page.locator("h1")).toBeVisible();

    // The embedding lab opens with a guess; its map, and its one stage,
    // arrive once the guess is made.
    // (A lab's `intro` tour is the one for an opening that is not a stage.)
    if (tourFor(slug)?.intro) {
      const predict = page.locator("[data-tour=predict] button").first();
      await expect(predict).toBeEnabled({ timeout: 15_000 });
      await predict.click();
    }

    // A stage gets the tour at its position on the page, so the two counts
    // must agree: a stage added without a tour, or a tour left behind when a
    // stage was removed, fails here.
    const tours = Object.keys(tourFor(slug) ?? {}).filter((key) => key !== "intro");
    await expect(page.locator("[data-stage]")).toHaveCount(tours.length, { timeout: 15_000 });

    // The header's tour starts, shows its card, and closes.
    await page.getByRole("button", { name: "How does it work?" }).first().click();
    const card = page.getByRole("dialog", { name: "Guided tour" });
    await expect(card).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(card).toBeHidden();

    // The learning guide opens with every resource in it, and closes.
    await page.getByRole("button", { name: "Open the learning guide" }).click();
    const guide = page.getByRole("dialog", { name: /./ }).filter({ hasText: "Learning guide" });
    await expect(guide).toBeVisible();
    const resources = (GUIDES[slug] ?? []).flatMap((topic) => topic.items).length;
    await expect(guide.getByRole("link")).toHaveCount(resources);
    await page.keyboard.press("Escape");
    await expect(guide).toBeHidden();

    expect(errors).toEqual([]);
  });
}

test("an address with no lab shows the not-found page", async ({ page }) => {
  await page.goto("/labs/no-such-lab/");
  await expect(page.getByText("This lab doesn't exist. Yet.")).toBeVisible();
});

// Automated accessibility checks catch only part of what matters, but what
// they catch is never acceptable: a serious or critical finding fails.
for (const path of ["/", "/labs/gradient-descent/", "/labs/hash-tables/", "/labs/probability/"]) {
  test(`accessibility: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(1000);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
    expect(serious).toEqual([]);
  });
}
