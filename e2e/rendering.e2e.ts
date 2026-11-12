import { expect, test, type Page } from "@playwright/test";
test.use({ deviceScaleFactor: 2 });

async function ready(page: Page) {
  await expect
    .poll(
      () =>
        page.locator(".faulty-terminal-canvas").evaluate((canvas: HTMLCanvasElement) => {
          const gl = canvas.getContext("webgl2");
          return (
            !!gl?.getParameter(gl.CURRENT_PROGRAM) &&
            canvas.width === Math.floor(canvas.clientWidth * Math.min(devicePixelRatio, 1.5))
          );
        }),
      { timeout: 15000 },
    )
    .toBe(true);
}
for (const theme of ["dark", "light"])
  test(`terminal ${theme}: full resolution survives motion preference changes and context loss`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript((theme) => {
      localStorage.setItem("aiclub-labs-language", "en");
      localStorage.setItem("aiclub-labs-theme", theme);
    }, theme);
    await page.route("**/cloud.umami.is/**", (r) => r.abort());
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await ready(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".faulty-terminal-canvas")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await ready(page);
    await page
      .locator(".faulty-terminal-canvas")
      .evaluate((canvas: HTMLCanvasElement) =>
        canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext(),
      );
    await expect(page.locator(".faulty-terminal-canvas")).toHaveCSS("visibility", "hidden");
    await page.goto("/labs/jepa/");
    await page
      .locator('[data-jepa-trainer="train"]')
      .getByRole("button", { name: "Advance 10 steps", exact: true })
      .click();
    await expect(
      page
        .locator('[data-jepa-trainer="train"] [data-stage-part="figures"] > div')
        .first()
        .locator("p")
        .last(),
    ).toHaveText("10");
    expect(errors).toEqual([]);
  });

test("terminal retains graphics without the optional parallel compiler extension", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.getExtension;
    WebGL2RenderingContext.prototype.getExtension = function (name) {
      return name === "KHR_parallel_shader_compile" ? null : original.call(this, name);
    };
  });
  await page.goto("/");
  await ready(page);
});
