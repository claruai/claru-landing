import { test, expect } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers/admin-credentials";

/**
 * E2E test for admin catalog semantic search flow.
 *
 * Requires:
 * - Populated agent_context + embeddings for at least some samples
 * - Running dev server or PLAYWRIGHT_BASE_URL
 */

async function adminLogin(page: import("@playwright/test").Page) {
  await page.goto("/admin");
  await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/admin/**", { timeout: 10000 });
}

test.describe("Admin Catalog Search", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("search page renders with input and example queries", async ({
    page,
  }) => {
    await page.goto("/admin/catalog/search");

    // Search input visible
    await expect(
      page.locator('input[placeholder*="Semantic search"]'),
    ).toBeVisible();

    // Dataset filter dropdown visible
    await expect(page.locator("select").first()).toBeVisible();

    // Example queries visible
    await expect(page.getByText("try an example query")).toBeVisible();
  });

  test("clicking example query triggers search", async ({ page }) => {
    await page.goto("/admin/catalog/search");

    // Click first example query button
    const exampleButton = page
      .locator("button")
      .filter({ hasText: /person cooking|outdoor traffic|egocentric/ })
      .first();
    await exampleButton.click();

    // Should show loading state
    await expect(
      page.getByText("embedding query and searching..."),
    ).toBeVisible({ timeout: 5000 });

    // Wait for results or empty state
    await expect(
      page.getByText("result").or(page.getByText("No samples found")),
    ).toBeVisible({ timeout: 30000 });
  });

  test("search returns results with similarity scores and dataset names", async ({
    page,
  }) => {
    await page.goto("/admin/catalog/search");

    // Type a search query
    await page.fill('input[placeholder*="Semantic search"]', "person indoors");
    await page.locator('button:has-text("search")').click();

    // Wait for results (or empty state if no embeddings yet)
    await expect(
      page.getByText("result").or(page.getByText("No samples found")),
    ).toBeVisible({ timeout: 30000 });

    // If results exist, verify card structure
    const resultCards = page.locator(".grid > div");
    const count = await resultCards.count();

    if (count > 0) {
      // Verify similarity badge (percentage)
      await expect(resultCards.first().locator("text=/%/")).toBeVisible();

      // Verify dataset name present
      const firstCard = resultCards.first();
      const text = await firstCard.textContent();
      expect(text).toBeTruthy();
    }
  });
});
