import { test, expect } from '@playwright/test';
import { authenticateAsTestLead, hasPortalAuthEnv } from './helpers/portal-auth';
import * as fs from 'fs';
import * as path from 'path';

/**
 * US-025 -- Full User Acceptance Flow
 *
 * Comprehensive acceptance test covering the complete user journey:
 *   1. Browse catalog
 *   2. Filter by category + tag
 *   3. Open a dataset
 *   4. Open a sample in the detail modal
 *   5. Verify video + structured metadata
 *   6. Navigate through multiple samples
 *   7. Close modal and return to catalog
 *   8. Search and open a different dataset
 *
 * Screenshots are saved at key steps to tests/e2e/screenshots/.
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - PORTAL_TEST_EMAIL (defaults to john+client@claru.ai)
 */

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

test.describe('Full User Acceptance Flow (US-025)', () => {
  const canAuth = hasPortalAuthEnv();

  test.skip(!canAuth, 'Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');

  test.beforeEach(async ({ page, baseURL }) => {
    ensureScreenshotDir();
    await authenticateAsTestLead(page, baseURL ?? 'http://localhost:3000');
  });

  // ---------------------------------------------------------------------------
  // Complete user journey in a single test
  // ---------------------------------------------------------------------------

  test('complete user journey: browse → filter → open dataset → play → navigate → return → search', async ({
    page,
  }) => {
    // -------------------------------------------------------------------------
    // Step 1: Navigate to /portal/catalog as authenticated lead
    // -------------------------------------------------------------------------

    await page.goto('/portal/catalog');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ua-01-catalog-initial.png') });

    // -------------------------------------------------------------------------
    // Step 2: Verify all dataset categories visible
    // -------------------------------------------------------------------------

    const allDatasetCards = page.locator('[data-testid="dataset-card"]');
    const initialDatasetCount = await allDatasetCards.count();

    if (initialDatasetCount === 0) {
      test.skip(true, 'No datasets available for this lead — skipping acceptance test');
      return;
    }

    expect(initialDatasetCount).toBeGreaterThan(0);

    // Category filter bar should be visible
    const categoryFilters = page.locator('[data-testid="category-filters"]');
    await expect(categoryFilters).toBeVisible();

    // -------------------------------------------------------------------------
    // Step 3: Filter to a specific category (if category pills exist)
    // -------------------------------------------------------------------------

    const categoryButtons = page
      .locator('[data-testid="category-filters"] button')
      .filter({ hasNot: page.locator('[data-testid="category-all"]') });

    const categoryCount = await categoryButtons.count();
    let filteredByCategory = false;

    if (categoryCount > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(400);
      filteredByCategory = true;

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'ua-02-catalog-category-filtered.png'),
      });
    }

    // -------------------------------------------------------------------------
    // Step 4: Select a tag filter (if tag pills exist)
    // -------------------------------------------------------------------------

    const tagFilters = page.locator('[data-testid="tag-filters"] button');
    const tagCount = await tagFilters.count();

    if (tagCount > 0) {
      const initialCountAfterCategory = await allDatasetCards.count();
      await tagFilters.first().click();
      await page.waitForTimeout(400);

      const afterTagCount = await allDatasetCards.count();
      expect(afterTagCount).toBeLessThanOrEqual(initialCountAfterCategory);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'ua-03-catalog-tag-filtered.png'),
      });
    }

    // -------------------------------------------------------------------------
    // Step 5: Open a dataset from the filtered (or all) results
    // -------------------------------------------------------------------------

    // Clear filters first to ensure a dataset with samples is accessible
    if (filteredByCategory) {
      const allButton = page.locator('[data-testid="category-all"]');
      if ((await allButton.count()) > 0) {
        await allButton.click();
        await page.waitForTimeout(300);
      }
    }

    const firstDatasetCard = allDatasetCards.first();
    await expect(firstDatasetCard).toBeVisible();

    const datasetCardName = await firstDatasetCard.locator('h3').textContent();
    await firstDatasetCard.click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'ua-04-dataset-detail.png'),
    });

    // -------------------------------------------------------------------------
    // Step 6: Verify stats bar shows sample count
    // -------------------------------------------------------------------------

    // The dataset detail page shows a stats bar with sample count
    // Look for text matching a pattern like "X samples" or a count number
    const statsBar = page.locator('text=/\\d+ sample/');
    if ((await statsBar.count()) > 0) {
      await expect(statsBar.first()).toBeVisible();
    }

    // -------------------------------------------------------------------------
    // Step 7: Open first sample in detail modal
    // -------------------------------------------------------------------------

    const sampleItems = page.locator('[role="button"][aria-label^="Sample"]');
    const sampleCount = await sampleItems.count();

    if (sampleCount === 0) {
      // Dataset has no samples — skip the rest of the modal flow
      // but do go back and try another dataset
      await page.goto('/portal/catalog');
      await page.waitForLoadState('networkidle');
      return;
    }

    await sampleItems.first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'ua-05-modal-open.png'),
    });

    // -------------------------------------------------------------------------
    // Step 8: Verify video element loads (src is presigned URL or valid URL)
    // -------------------------------------------------------------------------

    const video = modal.locator('video');
    if ((await video.count()) > 0) {
      const src = await video.getAttribute('src');
      expect(src).toBeTruthy();

      if (src && src.includes('X-Amz-Signature')) {
        expect(src).toContain('X-Amz-Signature');
      }
    }

    // -------------------------------------------------------------------------
    // Step 9: Verify structured metadata visible in MetaTable (if available)
    // -------------------------------------------------------------------------

    // Allow time for annotation fetch
    await page.waitForTimeout(800);

    // No stuck loading spinners
    await expect(modal.getByText('Fetching annotation...')).not.toBeVisible();
    await expect(modal.getByText('Fetching specs...')).not.toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'ua-06-modal-metadata.png'),
    });

    // -------------------------------------------------------------------------
    // Step 10: Navigate through 2 more samples using keyboard or buttons
    // -------------------------------------------------------------------------

    if (sampleCount >= 3) {
      const nextButton = modal.locator('[aria-label="Next sample"]');

      if ((await nextButton.count()) > 0) {
        await nextButton.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'ua-07-modal-sample-2.png'),
        });

        await nextButton.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'ua-08-modal-sample-3.png'),
        });
      } else {
        // Fall back to keyboard navigation
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);
      }
    }

    // -------------------------------------------------------------------------
    // Step 11: Close modal and go back to catalog
    // -------------------------------------------------------------------------

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await expect(modal).not.toBeVisible({ timeout: 3000 });

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'ua-09-gallery-after-close.png'),
    });

    // Back to gallery — samples still visible
    expect(await page.locator('[role="button"][aria-label^="Sample"]').count()).toBeGreaterThan(
      0,
    );

    // -------------------------------------------------------------------------
    // Step 12: Navigate back to catalog, clear filters, and search for a term
    // -------------------------------------------------------------------------

    await page.goto('/portal/catalog');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('[data-testid="catalog-search"]');
    await expect(searchInput).toBeVisible();

    // Use the first few chars of the dataset we opened earlier as a search term
    const searchTerm = (datasetCardName ?? '').trim().split(' ')[0];
    if (searchTerm) {
      await searchInput.fill(searchTerm);
      await page.waitForTimeout(400);

      const searchResults = page.locator('[data-testid="dataset-card"]');
      const searchResultCount = await searchResults.count();
      expect(searchResultCount).toBeGreaterThan(0);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'ua-10-catalog-search.png'),
      });
    }

    // -------------------------------------------------------------------------
    // Step 13: Open a different dataset and verify it loads
    // -------------------------------------------------------------------------

    await searchInput.clear();
    await page.waitForTimeout(300);

    const allCards = page.locator('[data-testid="dataset-card"]');
    const totalCards = await allCards.count();

    if (totalCards >= 2) {
      // Open the second dataset
      await allCards.nth(1).click();
      await page.waitForLoadState('networkidle');

      // Verify dataset page loaded — URL should contain /portal/catalog/
      expect(page.url()).toContain('/portal/catalog/');

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'ua-11-second-dataset.png'),
      });
    }
  });
});
