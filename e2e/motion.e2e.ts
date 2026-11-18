import { expect, test, type Locator, type Page } from "@playwright/test";
import { labs } from "../src/labs/registry";

const stage = (page: Page) => page.locator("[data-stage]").first();
const readout = (target: Locator) =>
  target.locator('[data-stage-part="figures"], [data-stage-part="readout"]');

async function changes(read: () => Promise<string | null>, act: () => Promise<void>) {
  const before = await read();
  await act();
  await expect.poll(read, { timeout: 12_000 }).not.toBe(before);
}

async function clickAndAdvance(button: Locator) {
  await expect(button).toBeEnabled();
  const figures = readout(button.locator("xpath=ancestor::*[@data-stage][1]"));
  await changes(
    () => figures.textContent(),
    () => button.click(),
  );
}

const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).first();

async function moveSlider(slider: Locator) {
  const stage = slider.locator("xpath=ancestor::*[@data-stage][1]");
  await changes(
    () => readout(stage).textContent(),
    () => slider.press("ArrowRight"),
  );
}

const exercise: Record<string, (page: Page) => Promise<void>> = {
  jepa: (page) => clickAndAdvance(button(page, "Train")),
  pca: (page) => moveSlider(stage(page).getByRole("slider", { name: "v, around" })),
  diffusion: (page) => clickAndAdvance(button(page, "Reverse one step")),
  generalization: (page) => clickAndAdvance(button(page, "Reveal unseen examples")),
  attention: async (page) => {
    const first = stage(page);
    const cat = first.getByRole("option", { name: /^cat,/ });
    const rival = first.locator("label").filter({ hasText: /^dog$/ });
    await changes(
      () => cat.getAttribute("aria-label"),
      () => rival.click(),
    );
  },
  backpropagation: async (page) => {
    const first = stage(page);
    await first.getByRole("slider").press("ArrowUp");
    await clickAndAdvance(first.getByRole("button", { name: "Let go", exact: true }));
  },
  convolution: (page) => clickAndAdvance(button(page, "Slide one step")),
  "word-embeddings": async (page) => {
    const prediction = page.locator("[data-tour=predict]");
    const choice = prediction.getByRole("button").first();
    const result = prediction.getByText(/^You picked /);
    const word = await choice.innerText();
    await expect(result).toHaveCount(0);
    await choice.click();
    await expect(result).toContainText(`You picked ${word}:`);
  },
  "word-embeddings-3d": async (page) => {
    const map = page.getByRole("listbox");
    const selected = map.locator('[role="option"][aria-selected="true"] circle').first();
    await changes(
      () => selected.getAttribute("cx"),
      () => map.press("Shift+ArrowRight"),
    );
  },
  "gradient-descent": (page) => clickAndAdvance(button(page, "Run")),
  "floating-point": (page) => clickAndAdvance(button(page, "Show me another")),
  "cache-locality": (page) => clickAndAdvance(button(page, "Run")),
  "race-condition": async (page) => {
    const run = stage(page).getByRole("button", { name: /^Run A/ });
    const counter = readout(stage(page));
    await changes(
      () => counter.textContent(),
      async () => {
        // A's load and increment are local; the third operation stores the result.
        await run.click();
        await run.click();
        await run.click();
      },
    );
  },
  "cryptographic-hashing": (page) => clickAndAdvance(button(page, "Hash it again")),
  "hash-tables": async (page) => {
    const first = stage(page);
    await first.getByRole("textbox", { name: "A key" }).fill("motion-check");
    await first.getByRole("button", { name: "Put it in" }).click();
    await expect(first.locator("ol ul").getByText("motion-check", { exact: true })).toBeVisible();
  },
  "hypothesis-testing": (page) => moveSlider(stage(page).getByRole("slider").first()),
  "multilayer-perceptrons": (page) => clickAndAdvance(button(page, "Train")),
  "graph-search": (page) => clickAndAdvance(button(page, "Run")),
  probability: async (page) => {
    await button(page, "Door 1, closed").click();
    await expect(button(page, "Door 1, your pick")).toBeVisible();
  },
  "reinforcement-learning": (page) => clickAndAdvance(button(page, "Train")),
  sorting: async (page) => {
    const bars = stage(page).locator("canvas[aria-label]").first();
    await changes(
      () => bars.getAttribute("aria-label"),
      () => button(page, "Sort").click(),
    );
  },
  tokenization: (page) => moveSlider(page.getByRole("slider", { name: "Merges learned" }).first()),
};

for (const { meta } of labs) {
  test(`${meta.slug}: experiment advances with motion enabled`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    await page.route("**/cloud.umami.is/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
    );
    await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
    await page.goto(`/labs/${meta.slug}/`);
    await expect(page.locator("main h1")).toBeVisible();
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
      false,
    );
    const run = exercise[meta.slug];
    if (!run) throw new Error(`No motion smoke interaction for ${meta.slug}`);
    await run(page);
    expect(errors).toEqual([]);
  });
}
