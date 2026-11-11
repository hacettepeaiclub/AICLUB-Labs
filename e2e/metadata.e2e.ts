import { test, expect } from "@playwright/test";
for (const route of ["/", "/labs/attention/"]) {
  test(`static metadata and no-JavaScript content: ${route}`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const response = await request.get(route);
    const html = await response.text();
    for (const token of ["<title>", 'property="og:image"', 'name="twitter:card"', "<noscript>"])
      expect(html).toContain(token);
    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(baseURL + route);
    await expect(page.locator("#root h1")).toBeVisible();
    expect(await page.locator("noscript").innerText()).toContain("JavaScript");
    await context.close();
  });
}
test("a failed app download retains readable content", async ({ page }) => {
  await page.route("**/assets/*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("#root .boot-content h1")).toBeVisible();
});
