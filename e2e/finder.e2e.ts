import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("finder keeps editing keys native and opens the highlighted lab", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Find a lab" });
  await trigger.focus();
  await trigger.press("Enter");
  const input = page.getByRole("combobox", { name: "Find a lab" });
  await expect(input).toBeFocused();
  await input.fill("sort");
  const optionId = await input.getAttribute("aria-activedescendant");
  expect(optionId).toBeTruthy();
  await input.press("Home");
  expect(await input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(0);
  await input.press("End");
  expect(await input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(4);
  await expect(input).toHaveAttribute("aria-activedescendant", optionId!);
  await input.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(input).toBeFocused();
  await input.press("Tab");
  const close = page.getByRole("dialog").getByRole("button", { name: "close" });
  await expect(close).toBeFocused();
  await close.press("Enter");
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  const list = page.getByRole("listbox");
  const firstId = await list.getByRole("option").first().getAttribute("id");
  const last = list.getByRole("option").last();
  const lastId = await last.getAttribute("id");
  await input.press("ArrowUp");
  await expect(input).toHaveAttribute("aria-activedescendant", lastId!);
  await input.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-activedescendant", firstId!);
  await input.press("ArrowUp");
  const slug = await last.getAttribute("data-slug");
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(`/labs/${slug}/?$`));
});

test("empty finder preserves the combobox relationship and announces the result", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("aiclub-labs-language", "en"));
  await page.goto("/");
  await page.getByRole("button", { name: "Find a lab" }).click();
  const dialog = page.getByRole("dialog", { name: "Find a lab" });
  const input = dialog.getByRole("combobox");
  const query = "zzzz-no-matching-lab";
  await input.fill(query);
  for (const key of ["ArrowUp", "ArrowDown", "Enter"]) await input.press(key);
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(query);
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).not.toHaveAttribute("aria-activedescendant");
  await expect(dialog.getByRole("listbox", { includeHidden: true })).toHaveAttribute(
    "id",
    (await input.getAttribute("aria-controls"))!,
  );
  await expect(dialog.getByRole("status")).toHaveText(`No lab matches “${query}”.`);
  const { violations } = await new AxeBuilder({ page }).include("dialog.lab-palette").analyze();
  expect(violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual(
    [],
  );
});
