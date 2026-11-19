import { expect, test } from "@playwright/test";

const FINDER_CHUNK = /\/assets\/LabPalette-[^/?]+\.js$/;

const configurations = [
  {
    label: "Turkish touch success",
    width: 390,
    language: "tr",
    trigger: "Lab ara",
    loading: "Lab arama açılıyor…",
    mobile: true,
  },
  {
    label: "English desktop failure",
    width: 1280,
    language: "en",
    trigger: "Find a lab",
    loading: "Opening lab finder…",
    mobile: false,
  },
] as const;

for (const configuration of configurations) {
  test.describe(configuration.label, () => {
    test.use({
      viewport: { width: configuration.width, height: 844 },
      isMobile: configuration.mobile,
      hasTouch: configuration.mobile,
    });

    test("a pending finder announces opening until the dialog or its recovery appears", async ({
      page,
    }) => {
      let release!: () => void;
      const hold = new Promise<void>((resolve) => {
        release = resolve;
      });
      let seen!: () => void;
      const requested = new Promise<void>((resolve) => {
        seen = resolve;
      });
      await page.route("**/cloud.umami.is/**", (route) => route.abort());
      await page.route(FINDER_CHUNK, async (route) => {
        seen();
        await hold;
        if (configuration.mobile) await route.continue();
        else await route.abort();
      });
      await page.addInitScript((language) => {
        localStorage.setItem("aiclub-labs-language", language);
      }, configuration.language);

      const dialog = page.getByRole("dialog", { name: configuration.trigger });
      const status = page.getByRole("status").filter({ hasText: configuration.loading });
      const trigger = page.getByRole("button", { name: configuration.trigger, exact: true });
      try {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        if (configuration.mobile) await trigger.tap();
        else await trigger.press("Enter");
        await requested;
        await expect(status).toBeVisible();
        await expect(dialog).toBeHidden();
      } finally {
        release();
      }

      if (configuration.mobile) {
        await expect(dialog.getByRole("combobox")).toBeFocused();
      } else {
        await expect(
          page.getByRole("alert").filter({ hasText: "Finder unavailable." }),
        ).toBeVisible();
      }
      await expect(status).toBeHidden();
    });
  });
}
