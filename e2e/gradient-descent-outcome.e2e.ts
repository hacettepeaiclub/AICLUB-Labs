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
  test(`outcome reads Ready, then Paused after a step, Running while it plays (${language})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript((language) => {
      localStorage.setItem("aiclub-labs-language", language);
    }, language);
    await page.goto("/labs/gradient-descent/");
    const stage = page.locator(".lab-content [data-stage]").first();
    const outcome = (word: string) => stage.getByText(word, { exact: true }).first();

    await expect(outcome(words.ready)).toBeVisible();
    await expect(stage.getByText(words.running, { exact: true })).toHaveCount(0);

    // Step and Run live in the stage's collapsed "more controls" section.
    // With motion on the stage never settles for a pointer click; keyboard
    // activation is what a keyboard visitor does anyway.
    await stage.locator("summary").filter({ hasText: words.more }).press("Enter");
    // Step and Run live in the stage's collapsed "more controls" section.
    // With motion on the stage never settles for a pointer click; keyboard
    // activation is what a keyboard visitor does anyway.
    await stage.locator("summary").filter({ hasText: words.more }).press("Enter");
    await stage.getByRole("button", { name: words.step, exact: true }).click();
    await expect(outcome(words.paused)).toBeVisible();

    await stage.getByRole("button", { name: words.run, exact: true }).click();
    await expect(outcome(words.running)).toBeVisible();
    await stage.getByRole("button", { name: words.pause, exact: true }).click();
    await expect(outcome(words.paused)).toBeVisible();
  });
}
