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
 * Handles whose taps miss at their centre, or 21px from it up, down, left or
 * right.
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
        [0, 0],
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

/** Pairs of layer steppers whose boxes intersect, and how they are placed. */
async function overlappingSteppers(page: Page) {
  return page.locator(".lab-content [data-layer-stepper]").evaluateAll((els) => {
    const rects = els.map((el) => el.getBoundingClientRect());
    const overlaps: string[] = [];
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i]!;
        const b = rects[j]!;
        if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
          overlaps.push(
            `MLP steppers ${i}/${j} overlap: ` +
              [a, b].map((r) => `[${r.left},${r.right}]×[${r.top},${r.bottom}]`).join(" ") +
              ` in ${els[0]!.parentElement!.getBoundingClientRect().width}px, ` +
              els[0]!.getAttribute("data-layer-stepper"),
          );
      }
    return {
      count: els.length,
      placements: [...new Set(els.map((el) => el.getAttribute("data-layer-stepper")))],
      overlaps,
    };
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
        check(
          "MLP neuron stepper",
          await boxes(page, ".lab-content [data-layer-stepper] > button"),
        );
        check(
          "MLP add layer",
          await boxes(page, `.lab-content button:text-is("${addLayer[language]}")`),
        );
        tooSmall.push(...(await overlappingSteppers(page)).overlaps);

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

/**
 * The perceptron at its largest, three hidden layers: on a 320px phone each
 * of the five columns is 35px, too narrow for even a stacked pair of 44px
 * steppers, which then move to a row of their own under the diagram.
 */
for (const width of [320, 360, 390, 1280]) {
  test.describe(`${width}px, the largest network`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: true });

    for (const language of ["en", "tr"] as const) {
      test(`layer steppers stay apart and full size (${language})`, async ({ page }) => {
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
        }, language);
        await open(page, "multilayer-perceptrons");
        const add = page.locator(`.lab-content button:text-is("${addLayer[language]}")`);
        while (await add.isEnabled()) await add.click();
        const steppers = page.locator(".lab-content [data-layer-stepper]");
        await expect(steppers).toHaveCount(3);

        // Measured once the layout settles: the diagram re-measures its width
        // after a layer is added, and a frame can fall between. A lasting
        // overlap still fails, with the boxes, the width and the placement.
        await expect.poll(async () => (await overlappingSteppers(page)).overlaps).toEqual([]);
        const { placements } = await overlappingSteppers(page);
        test.info().annotations.push({ type: "stepper placement", description: placements.join() });
        // QA measured 35px columns here: only the row under the diagram fits.
        if (width === 320) expect(placements).toEqual(["listed"]);
        for (const { w, h } of await boxes(page, ".lab-content [data-layer-stepper] > button")) {
          expect(w).toBeGreaterThanOrEqual(44);
          expect(h).toBeGreaterThanOrEqual(44);
        }
        await expect.poll(() => overflowOf(page)).toBeLessThanOrEqual(0);

        // The steppers still edit the layer they name: + on the last hidden
        // layer grows it by one neuron.
        const diagram = page.locator(".lab-content svg[role=group][aria-label*='→']").first();
        const shape = async () =>
          (await diagram.getAttribute("aria-label"))!
            .match(/\d+(?: → \d+)+/)![0]
            .split(" → ")
            .map(Number);
        const before = await shape();
        await steppers.last().locator("button").last().click();
        await expect
          .poll(shape)
          .toEqual(before.map((n, i) => (i === before.length - 2 ? n + 1 : n)));
      });
    }
  });
}

/**
 * Grown for touch, a line's two handles must not take each other's taps:
 * with w = (0.4, 0) the tip sits 0.4 from the foot, closer than two 44px hit
 * circles on a phone, and the foot's had covered the tip's dot.
 */
for (const width of [390, 1280]) {
  // 0.1 brings the dots so close that they touch; 0.4 only the hit circles.
  for (const w1 of [0.4, 0.1]) {
    test(`${width}px: close handles each keep their own dot (w = ${w1}, 0)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.route("**/cloud.umami.is/**", (route) => route.abort());
      await page.addInitScript((w1) => {
        localStorage.setItem(
          "acl:multilayer-perceptrons:neuron",
          JSON.stringify({ w1, w2: 0, bias: 0 }),
        );
      }, w1);
      await open(page, "multilayer-perceptrons");
      const { found, missed } = await missedHandles(page, ".lab-content svg g[role=slider]");
      expect(found).toBeGreaterThanOrEqual(2);
      expect(missed.filter((m) => m.endsWith(" at 0,0"))).toEqual([]);
    });
  }
}
