import { expect, test } from "@playwright/test";
import { journeys } from "../src/components/lab/journeyCopy";

/**
 * The 3-D word map opens with a first move, and "Try it" hands over the map.
 *
 * The page used to open on a dark square with no orientation card, a disabled
 * route to the experiment and a keyboard-only hint. The neighbour scores were
 * only in screen-reader labels, so nothing on screen showed what stays fixed
 * while the cloud turns.
 */
const sizes = [
  { name: "phone", viewport: { width: 390, height: 844 } },
  { name: "laptop", viewport: { width: 1280, height: 800 } },
];

// The orientation card shows the lab's journey step 1 (LabExperience.tsx).
const journey = journeys["word-embeddings-3d"]!;

const words = {
  en: {
    firstMove: "Your first move",
    tap: journey.en[1],
    tryIt: /^Try it/,
    nearest: /^Nearest to/,
  },
  tr: {
    firstMove: "İlk adım",
    tap: journey.tr[1],
    tryIt: /^Deneyi aç/,
    nearest: /kelimesine en yakınlar,/,
  },
} as const;

for (const { name, viewport } of sizes) {
  test.describe(`${name} ${viewport.width}px`, () => {
    test.use({ viewport });

    for (const language of ["en", "tr"] as const) {
      test(`orientation, Try it and the neighbour list (${language})`, async ({ page }) => {
        const copy = words[language];
        await page.route("**/cloud.umami.is/**", (route) => route.abort());
        await page.addInitScript((language) => {
          localStorage.setItem("aiclub-labs-language", language);
        }, language);
        await page.goto("/labs/word-embeddings-3d/");

        const card = page.locator("[data-lab-orientation]");
        await expect(card).toBeVisible();
        await expect(card).toContainText(copy.firstMove);
        await expect(card.locator("p").nth(1)).toHaveText(copy.tap);

        // The map's own points must be ready before Try it has a target.
        const map = page.getByRole("listbox");
        await expect(map.locator("svg")).toBeVisible();
        const tryIt = page.getByRole("button", { name: copy.tryIt });
        await expect(tryIt).toBeEnabled();
        await tryIt.click();
        await expect(map).toBeFocused();
        // Still in the tab order after Try it took focus there.
        await expect(map).toHaveAttribute("tabindex", "0");
        await expect
          .poll(() =>
            page.evaluate(() => {
              const bar = [...document.querySelectorAll("header")].find(
                (h) => getComputedStyle(h).position === "sticky",
              );
              const top = document.activeElement?.getBoundingClientRect().top ?? -1;
              return top >= (bar?.getBoundingClientRect().bottom ?? 0) + 8;
            }),
          )
          .toBe(true);

        // The scores are on screen, in rows big enough to tap, and choosing
        // one moves the selection to that word.
        const list = page.locator("h3", { hasText: copy.nearest }).locator("xpath=..");
        const rows = list.getByRole("button");
        await expect(rows).toHaveCount(8);
        for (const box of await rows.evaluateAll((els) =>
          els.map((el) => el.getBoundingClientRect().height),
        ))
          expect(box).toBeGreaterThanOrEqual(44);
        const second = rows.nth(1);
        const word = (await second.locator("span.truncate.font-mono").textContent())?.trim();
        expect(word).toBeTruthy();
        await second.click();
        await expect(page.locator("h3", { hasText: word! })).toBeVisible();

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}
