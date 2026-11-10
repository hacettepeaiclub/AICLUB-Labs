import { expect, test, type Page } from "@playwright/test";

/**
 * The calculator's three events reach Umami, each once.
 *
 * The real script never loads here (its `data-domains` is the live site, and
 * it is blocked below anyway), so a stand-in records what the page sends.
 */

type Sent = [string, Record<string, unknown> | undefined];

async function recordEvents(page: Page) {
  await page.route("https://cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem("aiclub-labs-language", "en");
    const sent: unknown[] = JSON.parse(sessionStorage.getItem("sent") ?? "[]");
    Object.defineProperty(window, "umami", {
      value: {
        track: (event: string, data?: Record<string, unknown>) => {
          sent.push([event, data]);
          // Kept across a reload, to show a reload sends nothing new.
          sessionStorage.setItem("sent", JSON.stringify(sent));
        },
      },
    });
  });
}

const sent = (page: Page) =>
  page.evaluate(() => JSON.parse(sessionStorage.getItem("sent") ?? "[]") as Sent[]);
const named = async (page: Page, event: string) =>
  (await sent(page)).filter(([name]) => name === event);

test("the calculator counts lessons, finished puzzles and shared results", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await recordEvents(page);
  await page.goto("/calculator/");
  await page.evaluate(() => localStorage.setItem("aiclub-labs-calculator-model", "fx991ex"));
  await page.reload();

  // A lesson played to its end counts once.
  await page.getByRole("button", { name: "Show me", exact: true }).click();
  await expect.poll(() => named(page, "calc_lesson_done")).toHaveLength(1);
  const [done] = await named(page, "calc_lesson_done");
  expect(done?.[1]).toEqual({ lesson: expect.any(String), model: "fx991ex" });

  // Five questions given up: the day is finished with no points.
  await page.getByRole("button", { name: "Solve today's puzzle" }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "Give up", exact: true }).click();
    if (i < 4) await page.getByRole("button", { name: "Next question" }).click();
  }
  await expect
    .poll(() => named(page, "daily_finish"))
    .toEqual([["daily_finish", { model: "fx991ex", points: 0 }]]);

  await page.getByRole("button", { name: "See result" }).click();
  await page.getByRole("button", { name: "Copy my result" }).click();
  await expect
    .poll(() => named(page, "daily_share"))
    .toEqual([["daily_share", { model: "fx991ex" }]]);

  // Coming back to a day already finished does not count it again.
  await page.reload();
  await page.getByRole("button", { name: "See your result" }).click();
  await expect(page.getByRole("button", { name: "Copy my result" })).toBeVisible();
  expect(await named(page, "daily_finish")).toHaveLength(1);
});
