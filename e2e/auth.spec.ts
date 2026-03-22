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

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");

    // Verifica elementi pagina login
    await expect(page.locator("text=/AgriWeather/i").first()).toBeVisible();
    await expect(page.locator("text=/Google/i")).toBeVisible();
  });

  test("should have login link in navbar", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    // Verifica link login esiste
    const loginLink = page.locator("a[href='/login']");
    await expect(loginLink).toBeVisible();
  });

  test("should show login banner", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("agriweather-login-banner-dismissed");
    });
    await page.reload();
    await closeOnboarding(page);

    // Cerca testo banner
    await expect(page.locator("text=/salvare.*città|preferenze/i").first()).toBeVisible({ timeout: 5000 });
  });
});