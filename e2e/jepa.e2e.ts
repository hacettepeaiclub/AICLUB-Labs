import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const words = {
  tr: {
    step: "10 adım ilerlet",
    before: "Eğitim öncesi",
    after: "Güncel model",
    play: "Eğit",
    pause: "Durdur",
    advanced: "İki işlemi ayrı incele",
    stop: "Hedefe giden gradyanı durdur",
    prediction: "Hayır, temsiller aynılaşabilir",
    flow: "Tahminin izini sür",
    empty: "Bu parçanın görünen komşusu yok. Başka bir gizli parçayı seç.",
    begin: "Karşılaştırmayı eğit",
  },
  en: {
    step: "Advance 10 steps",
    before: "Before training",
    after: "Current model",
    play: "Train",
    pause: "Pause",
    advanced: "Inspect the two operations",
    stop: "Stop gradients through the target",
    prediction: "No, vectors can become alike",
    flow: "Trace a prediction",
    empty: "This patch has no visible neighbours. Select another hidden patch.",
    begin: "Train this comparison",
  },
};
const steps = (trainer: Locator) =>
  trainer.locator('[data-stage-part="figures"] > div').first().locator("p").last();
async function open(page: Page, language: "tr" | "en", theme: "light" | "dark") {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(
    ({ language, theme }) => {
      localStorage.setItem("aiclub-labs-language", language);
      localStorage.setItem("aiclub-labs-theme", theme);
    },
    { language, theme },
  );
  await page.goto("/labs/jepa/");
  await expect(page.locator("h1")).toHaveText("The Missing Piece");
}

for (const language of ["tr", "en"] as const)
  for (const theme of ["dark", "light"] as const)
    for (const width of [390, 1440]) {
      test(`JEPA ${language} ${theme} ${width}: trace, score, compare and change method`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await open(page, language, theme);
        const w = words[language];
        const trainer = page.locator('[data-jepa-trainer="train"]');
        await trainer.getByLabel(w.prediction, { exact: true }).check();
        await expect(trainer.getByRole("status").first()).not.toBeEmpty();
        await trainer.getByRole("button", { name: w.step, exact: true }).click();
        await expect(steps(trainer)).toHaveText("10");
        const map = trainer.locator("canvas[data-jepa-map]");
        await expect(map).toHaveAttribute("role", "img");
        expect(
          await map.evaluate((canvas: HTMLCanvasElement) => {
            const expected = Math.ceil(canvas.getBoundingClientRect().width * devicePixelRatio);
            return canvas.width >= expected && canvas.height === canvas.width;
          }),
        ).toBe(true);
        await trainer.getByRole("button", { name: w.before, exact: true }).click();
        await expect(steps(trainer)).toHaveText("0");
        await trainer.getByRole("button", { name: w.after, exact: true }).click();
        await expect(steps(trainer)).toHaveText("10");
        const preview = trainer.locator('[data-stage-part="viewport"]');
        await preview.locator('[data-patch="0"]').focus();
        expect(await preview.locator('[data-patch="0"]').evaluate((el) => el.tagName)).toBe(
          "BUTTON",
        );
        expect(
          await preview
            .locator('[data-patch="0"]')
            .evaluate((el) => getComputedStyle(el).boxShadow),
        ).toBe("none");
        await page.keyboard.press("Enter");
        const flow = trainer.locator("[data-jepa-flow]");
        await expect(flow.getByText(w.empty, { exact: true })).toBeVisible();
        await flow.getByRole("combobox").selectOption("1");
        await flow.locator("[data-jepa-signal]").focus();
        await page.keyboard.press("Home");
        await page.keyboard.press("ArrowRight");
        await expect(flow.locator('[data-vector="guess"]')).toBeVisible();
        await expect(steps(trainer)).toHaveText("10");
        await flow.getByRole("button", { name: /03/ }).click();
        await expect(flow.getByRole("button", { name: /03/ })).toHaveAttribute(
          "aria-pressed",
          "true",
        );
        const rows = trainer.locator("[data-jepa-scores] tbody tr");
        await expect(rows).toHaveCount(3);
        const counts = await rows.locator("td:first-of-type").allTextContents();
        const totals = counts.map((s) => Number(s.split("/")[1]));
        expect(totals[0]).toBe(totals[1]! + totals[2]!);
        expect(totals[2]).toBeGreaterThan(0);
        await flow.locator("h3").scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath("prediction-flow.png") });
        const collapse = page.locator('[data-jepa-trainer="collapse"]');
        const method = collapse.locator("[data-jepa-method]");
        await method.selectOption("detached");
        await collapse.getByRole("button", { name: w.step, exact: true }).click();
        await expect(steps(collapse)).toHaveText("10");
        await method.selectOption("ema");
        await expect(steps(collapse)).toHaveText("0");
        await collapse.locator('[data-stage-part="secondary"] > summary').click();
        await expect(collapse.getByLabel(w.stop, { exact: true })).toBeChecked();
        await expect(collapse.getByLabel(w.stop, { exact: true })).toBeDisabled();
        await method.selectOption("detached");
        await expect(collapse.getByLabel(w.stop, { exact: true })).toBeEnabled();
        await collapse.getByLabel(w.stop, { exact: true }).uncheck();
        await expect(method).toHaveValue("joint");
        const application = page.locator("[data-jepa-application]");
        await application.locator('[data-query-texture="dots"]').click();
        await expect(application.locator('[data-query-texture="dots"]')).toHaveAttribute(
          "aria-pressed",
          "true",
        );
        await application.locator("[data-search-mask]").focus();
        await page.keyboard.press("End");
        await expect(application.locator("[data-search-match]")).toHaveCount(4);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        expect(errors).toEqual([]);
      });
    }

test("JEPA waits offscreen and pixel comparison needs an explicit start", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page, "en", "dark");
  const trainer = page.locator('[data-jepa-trainer="train"]');
  await trainer.getByRole("button", { name: "Train", exact: true }).click();
  await expect.poll(async () => Number(await steps(trainer).innerText())).toBeGreaterThan(0);
  await page.locator("h1").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const paused = await steps(trainer).innerText();
  await page.waitForTimeout(300);
  await expect(steps(trainer)).toHaveText(paused);
  const pixels = page.locator("[data-jepa-pixels]");
  const begin = pixels.getByRole("button", { name: "Train this comparison", exact: true });
  await expect(begin).toBeEnabled();
  await begin.click();
  await expect(pixels.locator('[data-stage-part="primary"] button').first()).toBeDisabled();
  await expect(
    pixels.getByRole("button", { name: "Training the model first: 100%", exact: true }),
  ).toHaveCount(0, { timeout: 30000 });
  await expect(pixels.locator("tbody")).not.toContainText("Training the model first:", {
    timeout: 30000,
  });
  const results = await new AxeBuilder({ page }).include("[data-jepa-pixels]").analyze();
  expect(
    results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
});

test("JEPA direct manipulation edits pixels, scrubs training, and searches with a learned encoder", async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page, "tr", "dark");
  const pixel = page.locator('[data-pixel="0"]').first();
  await pixel.click();
  const brightness = page.locator("[data-pixel-brightness]");
  await brightness.focus();
  await page.keyboard.press("End");
  await expect(pixel).toContainText("1,00");
  const trainer = page.locator('[data-jepa-trainer="train"]');
  const seek = trainer.locator("[data-jepa-seek]");
  await seek.focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(steps(trainer)).toHaveText("20");
  await page.keyboard.press("Home");
  await expect(steps(trainer)).toHaveText("0");
  const flow = trainer.locator("[data-jepa-flow]");
  await expect(flow.locator("[data-jepa-layers] svg")).toHaveCount(0);
  await flow.locator("[data-jepa-layers] > summary").click();
  await expect(flow.locator("[data-jepa-layers] svg")).toBeVisible();
  await flow.locator("[data-jepa-layers] select").selectOption("predictor");
  await expect(flow.locator("[data-jepa-layers] svg")).toHaveAttribute("aria-label", /4 → 16 → 4/);
  const application = page.locator("[data-jepa-application]");
  await application.locator("[data-search-light]").scrollIntoViewIfNeeded();
  await expect(application.locator("[data-search-ready]")).toHaveAttribute(
    "data-search-ready",
    "true",
    { timeout: 30000 },
  );
  await application.locator("[data-search-mask]").focus();
  await page.keyboard.press("Home");
  for (const kind of ["horizontal", "vertical", "dots", "flat"]) {
    await application.locator(`[data-query-texture="${kind}"]`).click();
    await expect(application.locator("[data-search-match]").first()).toHaveAttribute(
      "data-search-match",
      kind,
    );
  }
  await application.locator("h3").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("visual-search.png") });
});

test("JEPA discards queued evaluation results after rewinding a running model", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page, "en", "dark");
  const trainer = page.locator('[data-jepa-trainer="train"]');
  const seek = trainer.locator("[data-jepa-seek]");
  await seek.focus();
  await page.keyboard.press("End");
  await expect.poll(async () => Number(await steps(trainer).innerText())).toBeGreaterThan(0);
  await seek.focus();
  await page.keyboard.press("Home");
  await expect(steps(trainer)).toHaveText("0");
  await page.waitForTimeout(300);
  await expect(steps(trainer)).toHaveText("0");
});

test("JEPA retains its interactions when Web Workers are unavailable", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "Worker", { value: undefined, configurable: true }),
  );
  await open(page, "en", "light");
  const trainer = page.locator('[data-jepa-trainer="train"]');
  await trainer.getByRole("button", { name: "Advance 10 steps", exact: true }).click();
  await expect(steps(trainer)).toHaveText("10");
});

test("JEPA rapid scrubbing settles on the final requested step", async ({ page }) => {
  await open(page, "en", "dark");
  const trainer = page.locator('[data-jepa-trainer="train"]'),
    seek = trainer.locator("[data-jepa-seek]");
  await seek.focus();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("End");
    await page.keyboard.press("Home");
  }
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
  await expect(steps(trainer)).toHaveText("30");
  await page.waitForTimeout(300);
  await expect(steps(trainer)).toHaveText("30");
});

for (const theme of ["dark", "light"] as const)
  for (const width of [390, 1440])
    test(`JEPA ${theme} ${width}: compositor highlight keeps the real value readable once`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await open(page, "en", theme);
      const trainer = page.locator('[data-jepa-trainer="train"]');
      await trainer.getByRole("button", { name: "Advance 10 steps", exact: true }).click();
      await expect(steps(trainer)).toHaveText("10");
      const mark = steps(trainer).locator('[aria-hidden="true"][data-digits]');
      await expect(mark).toHaveAttribute("data-digits", "10");
      await expect(mark).toHaveCSS("transition-property", "opacity");
      expect(await mark.evaluate((el) => getComputedStyle(el, "::after").content)).toBe('"10"');
      // No duplicate DOM text: copy/paste and the accessible value stay exact.
      expect(await steps(trainer).textContent()).toBe("10");
      expect(await steps(trainer).innerText()).toBe("10");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await trainer.getByRole("button", { name: "Advance 10 steps", exact: true }).click();
      await expect(steps(trainer)).toHaveText("20");
      await expect(steps(trainer).locator("[data-digits]")).toHaveCount(0);
    });
