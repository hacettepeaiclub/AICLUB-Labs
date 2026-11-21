import { expect, test } from "@playwright/test";

for (const { width, isMobile } of [
  { width: 390, isMobile: true },
  { width: 1280, isMobile: false },
]) {
  test.describe(`MLP training at ${width}px`, () => {
    test.use({ viewport: { width, height: 850 }, isMobile, hasTouch: isMobile });

    for (const copy of [
      {
        language: "en",
        train: "Train",
        pause: "Pause",
        loss: "Loss",
        epoch: "Epoch",
        step: "Step",
      },
      {
        language: "tr",
        train: "Eğit",
        pause: "Duraklat",
        loss: "Kayıp",
        epoch: "Epok",
        step: "Adımla",
      },
    ]) {
      test(`training improves loss and a paused step repaints the map (${copy.language})`, async ({
        page,
      }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
        }, copy.language);
        await page.goto("/labs/multilayer-perceptrons/");
        await expect(page.locator("html")).toHaveAttribute("lang", copy.language);

        const playground = page.locator('section[aria-labelledby="playground-heading"]');
        const train = playground.getByRole("button", { name: copy.train, exact: true });
        const pause = playground.getByRole("button", { name: copy.pause, exact: true });
        const step = playground.getByRole("button", { name: copy.step, exact: true });
        const epoch = playground
          .getByText(copy.epoch, { exact: true })
          .locator("xpath=following-sibling::p[1]");
        const loss = playground
          .getByText(copy.loss, { exact: true })
          .locator("xpath=following-sibling::p[1]");
        const read = async (value: typeof loss) =>
          Number((await value.innerText()).replaceAll(",", ""));
        const canvas = playground.locator("canvas[role=img]");
        const image = () => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());

        await expect(pause.or(train)).toBeVisible();
        if (await pause.isVisible()) {
          if (isMobile) await pause.tap();
          else await pause.click();
        }
        await expect(train).toBeVisible();
        const initialEpoch = await read(epoch);
        const initialLoss = await read(loss);
        await train.scrollIntoViewIfNeeded();
        if (isMobile) await train.tap();
        else await train.click();
        await expect(pause).toBeVisible();
        await expect.poll(() => read(loss)).toBeLessThan(initialLoss);
        if (isMobile) await pause.tap();
        else await pause.click();
        await expect(train).toBeVisible();

        const pausedEpoch = await read(epoch);
        expect(pausedEpoch).toBeGreaterThan(initialEpoch);
        const pausedImage = await image();
        if (isMobile) await step.tap();
        else await step.click();
        await expect.poll(() => read(epoch)).toBe(pausedEpoch + 20);
        await expect.poll(image).not.toBe(pausedImage);
      });
    }
  });
}
