import { expect, test } from "@playwright/test";
import { tr } from "../src/i18n/tr";

const locales = [
  {
    lang: "en",
    daily: "Solve today's puzzle",
    practice: "Learn it key by key",
    menu: "Navigation",
    navigation: "Primary",
    labs: "All labs",
    calculator: "Calculator",
    offline: "You're offline.",
    step: "Step",
    stepSlider: "Step",
  },
  {
    lang: "tr",
    daily: "Bugünün bulmacasını çöz",
    practice: "Bir ders seç ve tuşları dene",
    menu: tr.shell.mobileNav,
    navigation: "Ana menü",
    labs: "Tüm lablar",
    calculator: "Hesap makinesi",
    offline: tr.shell.offlineNotice,
    step: "Adımla",
    stepSlider: "Adım",
  },
];

for (const { width, isMobile } of [
  { width: 320, isMobile: true },
  { width: 1280, isMobile: false },
]) {
  test.describe(`site interactions at ${width}px`, () => {
    test.use({ viewport: { width, height: 850 }, isMobile, hasTouch: isMobile });

    for (const copy of locales) {
      test.describe(copy.lang, () => {
        test.beforeEach(async ({ page }) => {
          await page.route("**/cloud.umami.is/**", (route) => route.abort());
          await page.addInitScript((language) => {
            localStorage.setItem("aiclub-labs-language", language);
          }, copy.lang);
        });

        test("opening the daily puzzle focuses the practice region below the header", async ({
          page,
        }) => {
          await page.goto("/calculator/");
          await expect(page.locator("html")).toHaveAttribute("lang", copy.lang);
          const daily = page.getByRole("button", { name: copy.daily, exact: true });
          if (isMobile) {
            await daily.tap();
          } else {
            await daily.press("Enter");
          }

          const practice = page.getByRole("region", { name: copy.practice });
          await expect(practice).toBeFocused();
          await expect
            .poll(() =>
              practice.evaluate((element) => {
                const stickyHeader = [...document.querySelectorAll("header")].find(
                  (candidate) => getComputedStyle(candidate).position === "sticky",
                );
                if (!stickyHeader) throw new Error("Expected the sticky site header");
                return (
                  element.getBoundingClientRect().top - stickyHeader.getBoundingClientRect().bottom
                );
              }),
            )
            .toBeGreaterThanOrEqual(8);
        });

        test("navigation preserves focus through a route change", async ({ page }) => {
          await page.goto("/");
          await expect(page.locator("html")).toHaveAttribute("lang", copy.lang);
          const nav = page.getByRole("navigation", { name: copy.navigation });
          const calculator = nav.getByRole("link", { name: copy.calculator });
          if (isMobile) {
            const menu = page.locator("summary").and(page.getByLabel(copy.menu));
            const labs = nav.getByRole("link", { name: copy.labs });
            await menu.tap();
            await labs.tap();
            await expect(nav).toBeHidden();
            await expect(menu).toBeFocused();

            await menu.press("Enter");
            await calculator.press("Escape");
            await expect(nav).toBeHidden();
            await expect(menu).toBeFocused();

            await menu.tap();
            await calculator.tap();
            await expect(nav).toBeHidden();
          } else {
            await calculator.press("Enter");
          }
          await expect(page).toHaveURL("/calculator/");
          const heading = page.getByRole("main").getByRole("heading", { level: 1 });
          if (isMobile) {
            await expect(heading).toBeFocused();
          } else {
            await expect(heading).toBeVisible();
            await expect(calculator).toBeFocused();
          }
        });

        test("the offline notice leaves a bottom-edge lab control operable", async ({
          page,
          context,
        }) => {
          await page.goto("/labs/gradient-descent/");
          await expect(page.locator("html")).toHaveAttribute("lang", copy.lang);
          const stage = page.locator(".lab-content [data-stage]").first();
          if (isMobile) await stage.locator("summary").first().tap();
          const step = stage.getByRole("button", { name: copy.step, exact: true });
          await expect(step).toBeVisible();

          await context.setOffline(true);
          try {
            await expect(page.getByRole("status").filter({ hasText: copy.offline })).toBeVisible();
            const point = await step.evaluate((button) => {
              button.scrollIntoView({ block: "end" });
              const bounds = button.getBoundingClientRect();
              return { x: bounds.x + bounds.width / 2, y: bounds.bottom - 2 };
            });
            expect(
              await step.evaluate(
                (button, point) => button.contains(document.elementFromPoint(point.x, point.y)),
                point,
              ),
            ).toBe(true);
            if (isMobile) {
              await page.touchscreen.tap(point.x, point.y);
            } else {
              await page.mouse.click(point.x, point.y);
            }
            await expect(
              stage.getByRole("slider", { name: copy.stepSlider, exact: true }),
            ).toHaveValue("1");
          } finally {
            await context.setOffline(false);
          }
        });
      });
    }
  });
}
