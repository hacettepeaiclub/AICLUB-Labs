import { test, expect } from "@playwright/test";
for (const width of [390, 1440])
  test(`calculator learning flow ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "tr"));
    await page.goto("/calculator");
    if (width === 390) {
      const menu = page.locator("header details");
      await menu.locator("summary").click();
      await menu.getByRole("link", { name: "Hesap makinesi", exact: true }).click();
      await expect(menu).not.toHaveAttribute("open", "");
    }
    await page.getByText("Serbest kullanım", { exact: true }).click();
    await page.locator('button[data-key="2"]').click();
    await page.keyboard.type("+3");
    await page.keyboard.press("Enter");
    await expect(page.locator(".calc-screen")).toContainText("5");
    await page.getByText("Ders", { exact: true }).click();
    await page.getByRole("button", { name: "Göster", exact: true }).click();
    await page.getByRole("button", { name: "Tuşları görmeden dene" }).click();
    await expect(page.getByRole("heading", { name: "Şimdi sen dene" })).toBeVisible();
    await page.getByRole("button", { name: "Günlük soruları aç" }).click();
    const prompt = await page.locator(".calc-task > p").first().textContent();
    await page.getByRole("button", { name: "Pes et", exact: true }).click();
    await expect(page.locator(".calc-task > p").first()).toHaveText(prompt!);
    await expect(page.locator(".calc-verdict")).toContainText("Doğru cevap");
    await page.getByRole("button", { name: "Sonraki soru" }).click();
    await expect(page.locator(".calc-task")).toContainText(/soru 2/i);
    await expect(page.locator(".calc-verdict")).toBeEmpty();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath("dark.png"),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Açık", exact: true }).click();
    await page.screenshot({
      path: testInfo.outputPath("light.png"),
      fullPage: true,
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
