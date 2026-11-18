import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`finder reports a pending download at ${width}px and clears when it opens`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.route("**/cloud.umami.is/**", (route) => route.abort());
    await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
    let releaseChunk = () => {};
    const download = new Promise<void>((resolve) => {
      releaseChunk = resolve;
    });
    await page.route(/\/assets\/LabPalette-[^/?]+\.js$/, async (route) => {
      await download;
      await route.continue();
    });

    try {
      await page.goto("/");
      await page.getByRole("button", { name: "Find a lab" }).click();
      await expect(
        page.getByRole("status").filter({ hasText: "Opening lab finder…" }),
      ).toBeVisible();
    } finally {
      releaseChunk();
    }

    await expect(page.getByRole("dialog", { name: "Find a lab" })).toBeVisible();
    await expect(page.getByText("Opening lab finder…")).toBeHidden();
  });
}
