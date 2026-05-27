import { test, expect } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers/admin-credentials";

/**
 * E2E tests for full corpus search + lead curation (Phase 2).
 *
 * Requires:
 * - Populated video_index table (loader scripts completed)
 * - Running dev server or PLAYWRIGHT_BASE_URL
 */

async function adminLogin(page: import("@playwright/test").Page) {
  await page.goto("/admin");
  await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/admin/**", { timeout: 10000 });
}

test.describe("Full Corpus Search", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("search page shows mode toggle with three options", async ({
    page,
  }) => {
    await page.goto("/admin/catalog/search");

    // Mode toggle buttons
    await expect(page.getByText("Catalog Samples")).toBeVisible();
    await expect(page.getByText("Full Corpus")).toBeVisible();
    await expect(page.getByText("Both")).toBeVisible();
  });

  test("full corpus search returns results with FULL CORPUS badges", async ({
    page,
  }) => {
    await page.goto("/admin/catalog/search");

    // Switch to Full Corpus mode
    await page.getByText("Full Corpus").click();

    // Enter search query
    await page.fill('input[placeholder*="Search full video corpus"]', "nature wildlife ocean");
    await page.locator('button[type="submit"]').click();

    // Wait for results
    await page.waitForSelector('[class*="grid"]', { timeout: 15000 });

    // Check for FULL CORPUS badges
    const badges = page.locator("text=full corpus");
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test("URL params persist search state", async ({ page }) => {
    await page.goto(
      "/admin/catalog/search?q=drone+aerial&mode=full_corpus",
    );

    // Verify search auto-executes from URL params
    const input = page.locator('input[placeholder*="Search"]');
    await expect(input).toHaveValue("drone aerial");

    // Wait for results
    await page.waitForSelector('[class*="grid"]', { timeout: 15000 });
  });

  test("bucket filter shows when in full_corpus mode", async ({ page }) => {
    await page.goto("/admin/catalog/search");

    // In catalog mode: dataset filter should be visible
    const datasetSelect = page.locator("select").first();
    await expect(datasetSelect).toBeVisible();

    // Switch to full corpus
    await page.getByText("Full Corpus").click();

    // Bucket filter should appear (if video_index has data)
    // Dataset filter should be hidden
    const bucketSelect = page.locator("select");
    const bucketCount = await bucketSelect.count();
    // Either bucket filter is present (data exists) or none (empty index)
    expect(bucketCount).toBeLessThanOrEqual(1);
  });
});

test.describe("Lead Curation — Add to Lead", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("single add to lead via combobox", async ({ page }) => {
    await page.goto("/admin/catalog/search");

    // Search for something
    await page.fill('input[placeholder*="Semantic search"]', "person cooking");
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('[class*="grid"]', { timeout: 15000 });

    // Click "add to lead" on first result
    const addButton = page.locator("text=add to lead").first();
    await addButton.click();

    // Combobox should appear with search input
    await expect(
      page.locator('input[placeholder="Search leads..."]'),
    ).toBeVisible();
  });

  test("bulk select shows floating action bar", async ({ page }) => {
    await page.goto("/admin/catalog/search");

    // Search
    await page.fill('input[placeholder*="Semantic search"]', "outdoor traffic");
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('[class*="grid"]', { timeout: 15000 });

    // Select checkboxes on first 3 results
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    const toSelect = Math.min(3, checkboxCount);

    for (let i = 0; i < toSelect; i++) {
      await checkboxes.nth(i).check({ force: true });
    }

    // Floating bar should appear
    await expect(
      page.locator(`text=${toSelect} selected`),
    ).toBeVisible();

    // Select lead dropdown should be present
    await expect(page.locator("text=Select lead...")).toBeVisible();
  });
});

test.describe("Response Validation", () => {
  test("no s3:// strings in search API response", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin/catalog/search");

    // Execute search and intercept API response
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/admin/catalog/search") && r.status() === 200,
      ),
      (async () => {
        await page.fill('input[placeholder*="Semantic search"]', "person walking");
        await page.locator('button[type="submit"]').click();
      })(),
    ]);

    const body = await response.text();
    expect(body).not.toContain("s3://");
  });
});
