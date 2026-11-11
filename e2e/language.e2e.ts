import { expect, test } from "@playwright/test";
import { labs } from "../src/labs/registry";

const paths = [
  "/",
  "/calculator/",
  "/labs/no-such-lab/",
  ...labs.map(({ meta }) => `/labs/${meta.slug}/`),
];
for (const path of paths) {
  test(`localized headings and shared lab names: ${path}`, async ({ browser, baseURL }) => {
    const headings: string[][] = [];
    for (const language of ["en", "tr"]) {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      await context.addInitScript(
        (language) => localStorage.setItem("aiclub-labs-language", language),
        language,
      );
      const page = await context.newPage();
      await page.route("**/cloud.umami.is/**", (route) => route.abort());
      await page.goto(`${baseURL}${path}`);
      await expect(page.locator("h1")).toBeVisible();
      const lab = page.locator("[data-lab]");
      if (await lab.count()) {
        if (!path.includes("word-embeddings-3d"))
          await expect(page.locator(".lab-content h2").first()).toBeAttached();
        const guess = page.locator("[data-tour=predict] button").first();
        if (path === "/labs/word-embeddings/") {
          await expect(guess).toBeEnabled();
          await guess.click();
        }
        if (!path.includes("word-embeddings-3d"))
          await expect(page.locator("[data-transfer-check]")).toBeAttached();
      }
      const all = page.locator("h1,h2,h3,h4,h5,h6");
      headings.push((await all.allTextContents()).map((s) => s.replace(/\s+/g, " ").trim()));
      if (language === "tr") {
        expect(await page.locator("html").getAttribute("lang")).toBe("tr");
        expect(await page.locator("body").innerText()).not.toMatch(/düzen(?:ek|eğ)/iu);
      }
      await context.close();
    }
    if (path === "/" || labs.some((l) => path === `/labs/${l.meta.slug}/`))
      expect(headings[1]![0]).toBe(headings[0]![0]);
    else expect(headings[1]![0]).not.toBe(headings[0]![0]);
    expect(headings[1]).not.toEqual(headings[0]);
  });
}
