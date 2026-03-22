import { test, expect } from "@playwright/test";

test.describe("Onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("agriweather-onboarding");
    });
    await page.reload();
  });

  test("should show onboarding tour for new users", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test("should navigate through onboarding steps", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Clicca Avanti 5 volte
    for (let i = 0; i < 5; i++) {
      const nextButton = page.locator("button", { hasText: /Avanti/i });
      await expect(nextButton).toBeVisible({ timeout: 3000 });
      await nextButton.click();
      await page.waitForTimeout(300); // Attendi animazione
    }

    // Ultimo step: clicca Inizia
    const startButton = page.locator("button", { hasText: /Inizia/i });
    await expect(startButton).toBeVisible({ timeout: 3000 });
    await startButton.click();

    // Dialog chiuso
    await expect(dialog).not.toBeVisible({ timeout: 3000 });
  });

  test("should close onboarding with Escape", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    await page.keyboard.press("Escape");
    
    await expect(dialog).not.toBeVisible({ timeout: 3000 });
  });

  test("should skip onboarding", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    await page.locator("button", { hasText: /Salta/i }).click();
    
    await expect(dialog).not.toBeVisible({ timeout: 3000 });
  });
});