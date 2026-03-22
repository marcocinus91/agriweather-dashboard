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

test.describe("City Search", () => {
  test("should search for a city", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    const searchInput = page.locator("input[placeholder*='città']");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("Roma");

    // Attendi risultati
    await expect(page.locator("text=Roma").first()).toBeVisible({ timeout: 8000 });
  });

  test("should select a city from search results", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    const searchInput = page.locator("input[placeholder*='città']");
    await searchInput.fill("Torino");

    // Attendi dropdown risultati
    await page.waitForTimeout(1000);

    // Clicca sul risultato
    const result = page.locator("text=Torino").first();
    await expect(result).toBeVisible({ timeout: 8000 });
    await result.click();

    // Verifica selezione nell'h2
    await expect(page.locator("h2", { hasText: /Torino/i })).toBeVisible({ timeout: 5000 });
  });
});