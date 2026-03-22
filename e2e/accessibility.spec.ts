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

test.describe("Accessibility", () => {
  test("should have navigation landmark", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    await expect(page.locator("nav")).toBeVisible();
  });

  test("should have main heading", async ({ page }) => {
    await page.goto("/");
    await closeOnboarding(page);

    await expect(page.locator("h2").first()).toBeVisible();
  });

  test("should close dialog with Escape", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("agriweather-onboarding");
    });
    await page.reload();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("Escape");

    await expect(dialog).not.toBeVisible({ timeout: 3000 });
  });
});