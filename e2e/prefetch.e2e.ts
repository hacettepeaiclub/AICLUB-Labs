import { expect, test } from "@playwright/test";

const PCA_COPY = /\/assets\/pca-[^/?]+\.js$/;

test("a failed hover prefetch allows opening the lab after the connection returns", async ({
  page,
  browserName,
}) => {
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  if (browserName === "webkit") {
    // The production CSP upgrades HTTP subresources on the local preview.
    await page.route(
      (url) => url.hostname === "localhost",
      async (route) => {
        if (route.request().resourceType() !== "document") return route.fallback();
        const response = await route.fetch();
        const body = (await response.text()).replace(/upgrade-insecure-requests;?\s*/g, "");
        return route.fulfill({ response, body });
      },
    );
  }
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  // Fail only the translated copy. The lab module itself is free to preload.
  await page.route(PCA_COPY, (route) => route.abort("internetdisconnected"));
  await page.goto("/");
  const card = page.locator('#labs a[href="/labs/pca/"]');
  await Promise.all([
    page.waitForEvent("requestfailed", (request) => PCA_COPY.test(request.url())),
    card.hover(),
  ]);
  await page.unroute(PCA_COPY);

  await card.click();
  await expect(page).toHaveURL("/labs/pca/");
  const experiment = page.getByRole("slider", { name: "v, around" });
  const loadFailure = page.getByRole("heading", { name: "The lab couldn't load." });
  if (browserName === "webkit") {
    // A retained failure may show Try again for a reachable file. Both
    // recovery labels reload the document and clear WebKit's module state.
    await expect(experiment.or(loadFailure)).toBeVisible();
    if (await loadFailure.isVisible()) {
      await page.getByRole("button", { name: /^(Try again|Reload page)$/ }).click();
    }
  }
  await expect(experiment).toBeVisible();
  await expect(loadFailure).toHaveCount(0);
});
