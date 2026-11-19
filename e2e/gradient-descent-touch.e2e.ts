import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test("Turkish Gradient Descent reports the finished outcome and returns to Ready on reset", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "tr"));
  await page.goto("/labs/gradient-descent/");

  const stage = page.locator(".lab-content [data-stage]").first();
  const ready = stage.getByText("Hazır", { exact: true });
  await expect(ready).toBeVisible();
  await expect(stage.getByText("Çalışıyor", { exact: true })).toHaveCount(0);
  await stage.locator("summary").filter({ hasText: "Tam adım boyu ve adım adım denetimler" }).tap();

  await stage.getByRole("button", { name: "Adımla", exact: true }).tap();
  await expect(stage.getByText("Duraklatıldı", { exact: true })).toBeVisible();
  await stage.getByRole("button", { name: "Çalıştır", exact: true }).tap();
  await expect(
    stage.getByText(/^(Hedefe ulaştı|Uzaklık sınırı aşıldı|Adımlar tükendi)$/),
  ).toBeVisible();

  await stage.getByRole("button", { name: "Sıfırla", exact: true }).tap();
  await expect(ready).toBeVisible();
});
