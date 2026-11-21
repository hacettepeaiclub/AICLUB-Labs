import { devices, expect, test, type Locator, type Page } from "@playwright/test";

type Point = { x: number; y: number };

async function handleCenter(handle: Locator): Promise<Point> {
  const dot = handle.locator("circle").last();
  await dot.evaluate((element) => element.scrollIntoView({ block: "center" }));
  return dot.evaluate((element: SVGCircleElement) => {
    const matrix = element.getScreenCTM();
    if (!matrix) throw new Error("Expected a visible SVG drag handle");
    const center = new DOMPoint(element.cx.baseVal.value, element.cy.baseVal.value).matrixTransform(
      matrix,
    );
    return { x: Math.round(center.x), y: Math.round(center.y) };
  });
}

async function expectHandleHit(handle: Locator, point: Point) {
  expect(
    await handle.evaluate(
      (element, point) => element.contains(document.elementFromPoint(point.x, point.y)),
      point,
    ),
  ).toBe(true);
}

async function drag(page: Page, start: Point, end: Point, touch: boolean) {
  if (!touch) {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 4 });
    await page.mouse.up();
    return;
  }

  const input = await page.context().newCDPSession(page);
  try {
    await input.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
    await input.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [end] });
    await input.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } finally {
    await input.detach();
  }
}

const labels = [
  {
    language: "en",
    output: "The network's output",
    layers: "Number of layers",
    depthTitle: "Make the network longer and watch the signal fade.",
    line: "The line's position. Arrow keys slide it along its arrow.",
  },
  {
    language: "tr",
    output: "Ağın çıktısı",
    layers: "Katman sayısı",
    depthTitle: "Katman sayısı arttıkça gradyan neden küçülür?",
    line: "Çizginin konumu. Ok tuşları onu okunun yönünde kaydırır.",
  },
];

for (const { profile, touch } of [
  { profile: "Pixel 7", touch: true },
  { profile: "Desktop Chrome", touch: false },
]) {
  test.describe(profile, () => {
    const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices[profile]!;
    test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

    const offset = touch ? 20 : 5;

    for (const copy of labels) {
      test.describe(copy.language, () => {
        test.beforeEach(async ({ page }) => {
          await page.route("**/cloud.umami.is/**", (route) => route.abort());
          await page.addInitScript(
            (language) => localStorage.setItem("aiclub-labs-language", language),
            copy.language,
          );
        });

        test(`off-center drags update the network output and chain depth (${copy.language})`, async ({
          page,
        }) => {
          await page.goto("/labs/backpropagation/");
          await expect(page.locator("html")).toHaveAttribute("lang", copy.language);

          const output = page.getByRole("slider", { name: copy.output, exact: true });
          const outputCenter = await handleCenter(output);
          const outputBefore = Number(await output.getAttribute("aria-valuenow"));
          const outputStart = { x: outputCenter.x - offset, y: outputCenter.y };
          await expectHandleHit(output, outputStart);
          await drag(page, outputStart, { x: outputStart.x, y: outputStart.y - 30 }, touch);
          await expect
            .poll(async () => Number(await output.getAttribute("aria-valuenow")))
            .toBeGreaterThan(outputBefore);

          const depth = page.getByRole("slider", { name: copy.layers, exact: true });
          const depthSummary = page
            .locator("details.lab-deeper > summary")
            .filter({ has: page.getByRole("heading", { name: copy.depthTitle, exact: true }) });
          await depthSummary.press("Enter");
          await expect(depth).toBeVisible();
          const depthCenter = await handleCenter(depth);
          const depthBefore = Number(await depth.getAttribute("aria-valuenow"));
          const depthStart = { x: depthCenter.x, y: depthCenter.y + offset };
          await expectHandleHit(depth, depthStart);
          await drag(page, depthStart, { x: depthStart.x + 75, y: depthStart.y }, touch);
          await expect
            .poll(async () => Number(await depth.getAttribute("aria-valuenow")))
            .toBeGreaterThan(depthBefore);
        });

        test("an off-center drag shifts the first neuron's decision line", async ({ page }) => {
          await page.goto("/labs/multilayer-perceptrons/");
          await expect(page.locator("html")).toHaveAttribute("lang", copy.language);

          const line = page.getByRole("slider", { name: copy.line, exact: true });
          const center = await handleCenter(line);
          await expect(line).toHaveAttribute("aria-valuetext", "b 0.0");
          const start = { x: center.x - offset, y: center.y };
          await expectHandleHit(line, start);
          await drag(page, start, { x: start.x - 30, y: start.y }, touch);
          await expect(line).not.toHaveAttribute("aria-valuetext", "b 0.0");
        });
      });
    }
  });
}
