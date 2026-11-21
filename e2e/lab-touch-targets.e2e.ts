import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Touch targets a lab audit at 390px found under 44px.
 *
 * Each lab's "How does it work?" button was 32px tall under its stages;
 * tokenization's cut cells, the lab's whole first experiment, were 18px wide;
 * attention's score tracks were 36px tall and its two divisor shortcuts 17px;
 * backpropagation's Check buttons were 36px and its table toggle 17px; the
 * multilayer perceptron's neuron steppers were 32px and "Add a layer" 40px.
 * Attention's shortest words ("it", ".") were 29px wide, backpropagation's
 * one-letter suspects 42px and its ledger nodes 42px tall.
 *
 * Drag handles drawn in an SVG shrink with it: backpropagation's output dot
 * was 25px and its depth handle 14px on a phone, the perceptron's line
 * handles 34px. Their hit circles now grow to 44px on screen; that is checked
 * by hit-testing 21px out from each handle's centre, as a finger would land.
 * Every lab shares four more: "Try it" (32px), the tour's Back and Next
 * (32px) and close (36px), and the learning guide's close (40px).
 *
 * Tokenization's cells sit edge to edge along a sentence, so 44px wide would
 * spread it into a column of letters; they meet the 24px WCAG 2.5.8 minimum
 * instead, and are 44px tall.
 */
const sizes = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
];

const guide = { en: "How does it work?", tr: "Nasıl çalışıyor?" } as const;
const addLayer = { en: "+ Add a layer", tr: "+ Katman ekle" } as const;
const check_ = { en: "Check", tr: "Kontrol et" } as const;
const accuse = { en: "Where is the fault?", tr: "Hata nerede?" } as const;
const copy = {
  en: { tryIt: "Try it", tour: "Guided tour", learn: "Open the learning guide" },
  tr: { tryIt: "Deneyi aç", tour: "Rehberli tur", learn: "Öğrenme rehberini aç" },
} as const;

async function open(page: Page, slug: string) {
  await page.goto(`/labs/${slug}/`);
  await page.locator(".lab-content [data-stage], .lab-content h2").first().waitFor();
  // Collapsed sections hold some of the targets under test.
  await page.evaluate(() =>
    document
      .querySelectorAll<HTMLDetailsElement>(".lab-content details")
      .forEach((d) => (d.open = true)),
  );
}

/**
 * Handles whose taps miss 21px from their centre, up, down, left or right.
 * Points outside the SVG are skipped: a handle at a chart's edge cannot be
 * reached past it, and nothing else is there to steal the tap.
 */
async function missedHandles(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((handles) => {
    const missed: string[] = [];
    let found = 0;
    for (const handle of handles) {
      const dot = handle.querySelector("circle:last-of-type") ?? handle;
      if (dot.getBoundingClientRect().width === 0) continue;
      found++;
      handle.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
      const r = dot.getBoundingClientRect();
      const svg = (handle as SVGElement).ownerSVGElement!.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      for (const [dx, dy] of [
        [-21, 0],
        [21, 0],
        [0, -21],
        [0, 21],
      ] as const) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < svg.left || x > svg.right || y < svg.top || y > svg.bottom) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit || !handle.contains(hit))
          missed.push(`${handle.getAttribute("aria-label")} at ${dx},${dy}`);
      }
    }
    return { found, missed };
  });
}

const overflowOf = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function boxes(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((els) =>
    els
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => ({ w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 })),
  );
}

for (const viewport of sizes) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport, hasTouch: true });

    for (const language of ["en", "tr"] as const) {
      test(`lab controls are large enough to tap (${language})`, async ({ page }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
        }, language);
        const tooSmall: string[] = [];
        const check = (where: string, list: { w: number; h: number }[], minW = 44, minH = 44) => {
          expect(list.length, `${where}: nothing found`).toBeGreaterThan(0);
          for (const { w, h } of list)
            if (w < minW || h < minH) tooSmall.push(`${where}: ${w}×${h}`);
        };

        const guideButton = `.lab-content button:has-text("${guide[language]}")`;

        await open(page, "tokenization");
        // Once laid out: diagrams draw at a default width before their first measure.
        await expect
          .poll(() => overflowOf(page), { message: "tokenization overflows" })
          .toBeLessThanOrEqual(0);
        check("tokenization guide", await boxes(page, guideButton));
        check("tokenization cut cell", await boxes(page, "[role=group] button[aria-pressed]"), 24);

        await open(page, "attention");
        await expect
          .poll(() => overflowOf(page), { message: "attention overflows" })
          .toBeLessThanOrEqual(0);
        check("attention guide", await boxes(page, guideButton));
        // The whole track takes the drag, so its height is the target.
        check(
          "attention score track",
          await boxes(page, ".cursor-ew-resize:has(> [role=slider])"),
          0,
        );
        check("attention divisor shortcut", await boxes(page, ".lab-content button.underline"), 0);
        check("attention word", await boxes(page, ".lab-content [role=listbox] > button"));

        await open(page, "backpropagation");
        await expect
          .poll(() => overflowOf(page), { message: "backpropagation overflows" })
          .toBeLessThanOrEqual(0);
        check("backpropagation guide", await boxes(page, guideButton));
        check(
          "backpropagation Check",
          await boxes(page, `.lab-content button:text-is("${check_[language]}")`),
        );
        check(
          "backpropagation table toggle",
          await boxes(page, ".lab-content details.rounded > summary"),
          0,
        );
        check(
          "backpropagation suspect",
          await boxes(page, `.lab-content [role=group][aria-label="${accuse[language]}"] button`),
        );
        check("backpropagation ledger node", await boxes(page, ".lab-content svg g[role=button]"));
        const pulled = await missedHandles(page, ".lab-content svg g[role=slider]");
        expect(pulled.found, "backpropagation handles").toBeGreaterThanOrEqual(2);
        tooSmall.push(...pulled.missed.map((m) => `backpropagation handle ${m}`));

        await open(page, "multilayer-perceptrons");
        await expect
          .poll(() => overflowOf(page), { message: "multilayer-perceptrons overflows" })
          .toBeLessThanOrEqual(0);
        const steppers = ".lab-content div.absolute[role=group] > button";
        check("MLP neuron stepper", await boxes(page, steppers));
        check(
          "MLP add layer",
          await boxes(page, `.lab-content button:text-is("${addLayer[language]}")`),
        );
        // The bigger steppers sit side by side, or stacked when columns are
        // narrow; neighbouring layers' pairs must never overlap.
        const groups = await page
          .locator(".lab-content div.absolute[role=group]")
          .evaluateAll((els) =>
            els.map((el) => el.getBoundingClientRect()).map((r) => [r.left, r.right]),
          );
        for (let i = 1; i < groups.length; i++)
          if (groups[i]![0]! < groups[i - 1]![1]!)
            tooSmall.push(`MLP steppers ${i - 1}/${i} overlap`);

        const lines = await missedHandles(page, ".lab-content svg g[role=slider]");
        expect(lines.found, "MLP line handles").toBeGreaterThanOrEqual(2);
        tooSmall.push(...lines.missed.map((m) => `MLP line handle ${m}`));

        expect(tooSmall).toEqual([]);
      });

      test(`shared lab controls are large enough to tap (${language})`, async ({ page }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
        }, language);
        const c = copy[language];
        const tooSmall: string[] = [];
        const check = async (where: string, locator: Locator) => {
          await expect(locator, where).toBeVisible();
          const box = (await locator.boundingBox())!;
          if (box.width < 44 || box.height < 44)
            tooSmall.push(`${where}: ${Math.round(box.width)}×${Math.round(box.height)}`);
        };

        await open(page, "attention");
        await check("Try it", page.locator("[data-lab-orientation] button", { hasText: c.tryIt }));

        await page.locator(`.lab-content button:has-text("${guide[language]}")`).first().click();
        const tour = page.getByRole("dialog", { name: c.tour });
        const buttons = tour.locator("button");
        await check("tour Next", buttons.last());
        await buttons.last().click();
        await expect(buttons).toHaveCount(3);
        await check("tour close", buttons.nth(0));
        await check("tour Back", buttons.nth(1));
        await check("tour Next (2nd step)", buttons.nth(2));
        await page.keyboard.press("Escape");
        await expect(tour).toBeHidden();

        await page.getByRole("button", { name: c.learn }).click();
        const learning = page.locator("dialog[open]");
        // Its panel scales in from 0.985; measure it at rest.
        await learning.evaluate((dialog) =>
          Promise.all(dialog.getAnimations({ subtree: true }).map((a) => a.finished)),
        );
        await check("learning guide close", learning.locator("header button"));

        expect(tooSmall).toEqual([]);
        await expect.poll(() => overflowOf(page)).toBeLessThanOrEqual(0);
      });
    }
  });
}
