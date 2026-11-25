import { expect, test } from "@playwright/test";
import enMlp from "../src/i18n/labs/en/multilayer-perceptrons";
import trMlp from "../src/i18n/labs/tr/multilayer-perceptrons";

const locales = [
  {
    language: "en",
    diagram: enMlp.playground.insideTitle,
    addLayer: "+ Add a layer",
    addNeuron: /^Add a neuron to /,
    removeNeuron: /^Remove a neuron from /,
  },
  {
    language: "tr",
    diagram: trMlp.playground.insideTitle,
    addLayer: "+ Katman ekle",
    addNeuron: / katmanına nöron ekle$/,
    removeNeuron: / katmanından nöron çıkar$/,
  },
];

for (const { width, touch } of [
  { width: 320, touch: true },
  { width: 1280, touch: false },
]) {
  test.describe(`network architecture at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: touch, hasTouch: touch });

    for (const copy of locales) {
      test(`each hidden layer has independent stepper targets (${copy.language})`, async ({
        page,
      }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript(
          (language) => localStorage.setItem("aiclub-labs-language", language),
          copy.language,
        );
        await page.goto("/labs/multilayer-perceptrons/");
        await expect(page.locator("html")).toHaveAttribute("lang", copy.language);
        if (touch) {
          await page.locator("summary").filter({ hasText: copy.diagram }).press("Enter");
        }

        const addLayer = page.getByRole("button", { name: copy.addLayer, exact: true });
        const increase = page.getByRole("button", { name: copy.addNeuron });
        const decrease = page.getByRole("button", { name: copy.removeNeuron });
        const layout = page
          .locator('section[aria-labelledby="playground-heading"]')
          .getByRole("group", { name: /\d+ → \d+ → \d+/ });
        await expect(increase.first()).toBeVisible();
        const missingLayers = 3 - (await increase.count());
        for (let i = 0; i < missingLayers; i++) {
          if (touch) await addLayer.tap();
          else await addLayer.click();
        }
        await expect(addLayer).toBeDisabled();
        await expect(increase).toHaveCount(3);

        const initial = (await layout.getAttribute("aria-label"))?.match(/\d+(?: → \d+)+/)?.[0];
        if (!initial) throw new Error("Expected a network diagram with an accessible layer shape");
        const shape = initial.split(" → ").map(Number);
        for (let i = 0; i < 3; i++) {
          const more = increase.nth(i);
          const less = decrease.nth(i);
          await more.evaluate((button) => button.scrollIntoView({ block: "center" }));
          const box = await more.boundingBox();
          if (!box) throw new Error("Expected a visible add-neuron button");
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);

          if (touch) {
            await more.tap({ position: { x: box.width - 2, y: box.height / 2 }, timeout: 3000 });
          } else {
            await more.click();
          }
          const changed = shape.map((count, column) => (column === i + 1 ? count + 1 : count));
          await expect(layout).toHaveAccessibleName(new RegExp(changed.join(" → ")));

          if (touch) await less.tap();
          else await less.click();
          await expect(layout).toHaveAccessibleName(new RegExp(initial));
        }
      });
    }
  });
}
