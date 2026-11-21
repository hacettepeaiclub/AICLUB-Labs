import { expect, test, type Locator } from "@playwright/test";

function contrast(target: Locator) {
  return target.evaluate((element) => {
    const context = document.createElement("canvas").getContext("2d");
    if (!context) throw new Error("Canvas 2D is required to resolve CSS colors");
    const background = element.closest(".calc-device");
    if (!background) throw new Error("Expected a calculator control");
    const style = getComputedStyle(element);

    context.fillStyle = getComputedStyle(background).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    context.fillStyle = style.backgroundColor;
    context.fillRect(0, 0, 1, 1);
    const backdrop = context.getImageData(0, 0, 1, 1).data;
    context.fillStyle = style.color;
    context.fillRect(0, 0, 1, 1);
    const text = context.getImageData(0, 0, 1, 1).data;

    const luminance = (pixel: Uint8ClampedArray) =>
      [0.2126, 0.7152, 0.0722].reduce((total, weight, index) => {
        const channel = pixel[index]! / 255;
        const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        return total + weight * linear;
      }, 0);

    const colors = [luminance(backdrop), luminance(text)];
    return (Math.max(...colors) + 0.05) / (Math.min(...colors) + 0.05);
  });
}

for (const { width, touch } of [
  { width: 390, touch: true },
  { width: 1280, touch: false },
]) {
  test.describe(`light calculator at ${width}px`, () => {
    test.use({ viewport: { width, height: 850 }, isMobile: touch, hasTouch: touch });

    for (const language of ["en", "tr"]) {
      test(`key legends and selected modifiers meet AA contrast (${language})`, async ({
        page,
      }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
          localStorage.setItem("aiclub-labs-theme", "light");
        }, language);
        await page.goto("/calculator/");
        await expect(page.locator("html")).toHaveAttribute("lang", language);
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

        const amberLegend = page.locator(".calc-legend .text-signal-amber").first();
        await expect(amberLegend).toBeVisible();
        expect(await contrast(amberLegend)).toBeGreaterThanOrEqual(4.5);

        const freeUse = page
          .locator("label")
          .getByText(language === "en" ? "Free use" : "Serbest kullanım", { exact: true });
        if (touch) await freeUse.tap();
        else await freeUse.click();

        for (const name of ["SHIFT", "ALPHA"]) {
          const key = page.getByRole("button", { name, exact: true });
          await expect(key).toHaveAttribute("aria-pressed", "false");
          expect(await contrast(key)).toBeGreaterThanOrEqual(4.5);
          if (touch) await key.tap();
          else await key.press("Enter");
          await expect(key).toHaveAttribute("aria-pressed", "true");
          await expect.poll(() => contrast(key)).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  });
}
