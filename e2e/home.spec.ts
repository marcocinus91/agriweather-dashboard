import { test, expect, Page } from "@playwright/test";

async function closeOnboarding(page: Page) {
  try {
    const dialog = page.getByRole("dialog");
    if (await dialog.isVisible({ timeout: 2000 })) {
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible({ timeout: 2000 });
    }
  } catch {
    // Onboarding già chiuso
  }
}

test.describe("Homepage", () => {
  test("should load the dashboard", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    // Verifica navbar
    await expect(page.locator("nav")).toBeVisible();

    // Verifica tab
    await expect(page.locator("button", { hasText: "Oggi" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Settimana" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Colture" })).toBeVisible();
  });

  test("should show weather data", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    // Cerca temperatura (°C)
    await expect(page.locator("text=/\\d+.*°C/").first()).toBeVisible({ timeout: 15000 });
  });

  test("should switch between tabs", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    // Tab Settimana
    await page.locator("button", { hasText: "Settimana" }).click();
    await expect(page.locator("text=/Temperature|Precipitazioni/i").first()).toBeVisible({ timeout: 10000 });

    // Tab Colture
    await page.locator("button", { hasText: "Colture" }).click();
    await expect(page.locator("text=/Gradi Giorno|GDD/i").first()).toBeVisible({ timeout: 10000 });

    // Tab Oggi
    await page.locator("button", { hasText: "Oggi" }).click();
    await expect(page.locator("text=/Nowcasting|Precipitazioni/i").first()).toBeVisible({ timeout: 10000 });
  });
});