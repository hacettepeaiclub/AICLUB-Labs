import { expect, test } from "@playwright/test";

for (const { width, isMobile } of [
  { width: 390, isMobile: true },
  { width: 1280, isMobile: false },
]) {
  test.describe(`3D word map at ${width}px`, () => {
    test.use({ viewport: { width, height: 850 }, isMobile, hasTouch: isMobile });

    for (const language of ["en", "tr"]) {
      test(`dragging preserves selection and pressing a word selects it (${language})`, async ({
        page,
      }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript(
          (lang) => localStorage.setItem("aiclub-labs-language", lang),
          language,
        );
        await page.goto("/labs/word-embeddings-3d/");
        await expect(page.locator("html")).toHaveAttribute("lang", language);

        const map = page.getByRole("listbox");
        const selected = map.getByRole("option", { selected: true });
        await expect(selected).toHaveCount(1);
        await map.evaluate((element) => element.scrollIntoView({ block: "center" }));

        const initialId = await selected.getAttribute("id");
        expect(initialId).toBeTruthy();
        const target = await map.getByRole("option", { selected: false }).evaluateAll((options) => {
          for (const option of options) {
            const dot = option.querySelector("circle");
            const matrix = dot?.getScreenCTM();
            if (!dot || !matrix) continue;
            const center = new DOMPoint(dot.cx.baseVal.value, dot.cy.baseVal.value).matrixTransform(
              matrix,
            );
            const mapBounds = dot.ownerSVGElement?.getBoundingClientRect();
            if (!mapBounds) continue;
            if (
              center.x > mapBounds.left + 40 &&
              center.x < mapBounds.right - 50 &&
              center.y > Math.max(150, mapBounds.top + 30) &&
              center.y < Math.min(innerHeight - 50, mapBounds.bottom - 30)
            ) {
              return { id: option.id, x: Math.round(center.x), y: Math.round(center.y) };
            }
          }
          throw new Error("No unselected word has a reachable drag target");
        });

        if (isMobile) {
          const session = await page.context().newCDPSession(page);
          const touchPoints = [{ x: target.x, y: target.y }];
          await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints });
          await session.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: target.x + 36, y: target.y }],
          });
          await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints });
          await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await session.detach();
        } else {
          await page.mouse.move(target.x, target.y);
          await page.mouse.down();
          await page.mouse.move(target.x + 36, target.y, { steps: 3 });
          await page.mouse.move(target.x, target.y, { steps: 3 });
          await page.mouse.up();
        }
        await expect(selected).toHaveAttribute("id", initialId!);

        if (isMobile) {
          await page.touchscreen.tap(target.x, target.y);
        } else {
          await page.mouse.click(target.x, target.y);
        }
        await expect(selected).toHaveAttribute("id", target.id);

        const neighbours = page
          .getByRole("heading", {
            name: language === "en" ? /^Nearest to/ : /kelimesine en yakınlar,/,
          })
          .locator("xpath=..");
        const neighbour = neighbours.getByRole("button").first();
        if (isMobile) {
          await neighbour.tap();
        } else {
          await neighbour.press("Enter");
        }
        await expect(selected).not.toHaveAttribute("id", target.id);
        const neighbourId = await selected.getAttribute("id");
        expect(neighbourId).toBeTruthy();
        await expect(map).toHaveAttribute("aria-activedescendant", neighbourId!);
        if (!isMobile) {
          await map.press("Enter");
          await expect(selected).toHaveAttribute("id", neighbourId!);
        }
      });
    }
  });
}
