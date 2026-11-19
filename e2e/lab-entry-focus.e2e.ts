import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

for (const { slug, target } of [
  { slug: "pca", target: ".lab-content [data-stage]" },
  { slug: "word-embeddings", target: ".lab-content [data-tour=predict]" },
]) {
  test(`Turkish Try it focuses the first ${slug} experiment below the mobile header`, async ({
    page,
  }) => {
    await page.route("**/cloud.umami.is/**", (route) => route.abort());
    await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "tr"));
    await page.goto(`/labs/${slug}/`);
    await page.getByRole("button", { name: "Deneyi aç" }).tap();

    const experiment = page.locator(target).first();
    await expect(experiment).toBeFocused();
    const inset = await experiment.evaluate((element) => {
      const header = [...document.querySelectorAll("header")].find(
        (candidate) => getComputedStyle(candidate).position === "sticky",
      );
      if (!header) throw new Error("Expected the sticky site header");
      return element.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
    });
    expect(inset).toBeGreaterThanOrEqual(8);
  });
}
