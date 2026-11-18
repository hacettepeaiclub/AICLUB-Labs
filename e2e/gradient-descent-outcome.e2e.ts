import { expect, test } from "@playwright/test";

/**
 * The "Outcome" figure in gradient descent's first stage tells a newcomer
 * whether anything is happening. Before LABS-3 it read "Running" at step 0.
 */
test.beforeEach(async ({ page }) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
});

for (const [language, words] of [
  [
    "en",
    {
      ready: "Ready",
      paused: "Paused",
      running: "Running",
      step: "Step",
      run: "Run",
      pause: "Pause",
      more: "Exact step size and step-by-step controls",
    },
  ],
  [
    "tr",
    {
      ready: "Hazır",
      paused: "Duraklatıldı",
      running: "Çalışıyor",
      step: "Adımla",
      run: "Çalıştır",
      pause: "Duraklat",
      more: "Tam adım boyu ve adım adım denetimler",
    },
  ],
] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 },
  ]) {
    test(`outcome reads Ready, then Paused after a step, Running while it plays (${language}, ${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.addInitScript((language) => {
        localStorage.setItem("aiclub-labs-language", language);
      }, language);
      await page.goto("/labs/gradient-descent/");
      const stage = page.locator(".lab-content [data-stage]").first();
      const outcome = (word: string) => stage.getByText(word, { exact: true }).first();

      await expect(outcome(words.ready)).toBeVisible();
      await expect(stage.getByText(words.running, { exact: true })).toHaveCount(0);

      // On a narrow screen Step and Run sit in the stage's collapsed "more
      // controls" section; from lg up that section is hidden and the same
      // controls are in the side rail.
      const more = stage.locator("summary").filter({ hasText: words.more });
      if (await more.isVisible()) await more.click();
      await stage.getByRole("button", { name: words.step, exact: true }).click();
      await expect(outcome(words.paused)).toBeVisible();

      await stage.getByRole("button", { name: words.run, exact: true }).click();
      await expect(outcome(words.running)).toBeVisible();
      await stage.getByRole("button", { name: words.pause, exact: true }).click();
      await expect(outcome(words.paused)).toBeVisible();
    });
  }
}
