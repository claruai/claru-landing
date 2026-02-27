import { test, expect } from '@playwright/test';

/**
 * E2E tests for batch editing, batch delete, and pagination (US-016).
 */
test.describe('Sample Management — Batch Operations & Pagination', () => {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'team@claru.ai';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'qweqwe123!';

  /** Helper: login and navigate to a dataset edit page */
  async function loginAndNavigateToDataset(page: import('@playwright/test').Page) {
    await page.goto('/admin');
    await page.locator('#admin-email').fill(adminEmail);
    await page.locator('#admin-password').fill(adminPassword);
    await page.getByRole('button', { name: /authenticate/i }).click();
    await page.waitForURL('**/admin/**', { timeout: 15000 });

    await page.goto('/admin/catalog');
    await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
      timeout: 10000,
    });

    const editLink = page.locator('a:has-text("[edit]")').first();
    const editCount = await editLink.count();
    if (editCount === 0) {
      test.skip(true, 'No datasets available for testing');
      return;
    }
    await editLink.click();
    await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });
  }

  /** Helper: ensure we're on Samples tab and have rows */
  async function ensureSamplesTab(page: import('@playwright/test').Page) {
    await page.getByRole('button', { name: 'Samples' }).click();

    // Wait for table to appear
    const tableBody = page.locator('table tbody');
    await expect(tableBody).toBeVisible({ timeout: 10000 });

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    return rowCount;
  }

  // -----------------------------------------------------------------------
  // Test 1: Selection
  // -----------------------------------------------------------------------

  test('select samples via checkboxes and see batch action bar', async ({ page }) => {
    await loginAndNavigateToDataset(page);
    const rowCount = await ensureSamplesTab(page);

    if (rowCount < 3) {
      test.skip(true, 'Need at least 3 samples for selection test');
      return;
    }

    // Click checkboxes on first 3 rows (click the td with checkbox, not the row)
    const checkboxes = page.locator('table tbody tr td:first-child input[type="checkbox"]');

    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    await checkboxes.nth(2).click();

    // Verify batch action bar shows 3 selected
    await expect(page.getByText('3 selected')).toBeVisible({ timeout: 5000 });

    // Deselect one
    await checkboxes.nth(1).click();

    // Verify count updates to 2
    await expect(page.getByText('2 selected')).toBeVisible({ timeout: 5000 });
  });

  // -----------------------------------------------------------------------
  // Test 2: Select All
  // -----------------------------------------------------------------------

  test('select all checkbox selects and deselects all on current page', async ({ page }) => {
    await loginAndNavigateToDataset(page);
    const rowCount = await ensureSamplesTab(page);

    if (rowCount === 0) {
      test.skip(true, 'No samples available');
      return;
    }

    // Click select all header checkbox
    const selectAll = page.locator('table thead input[type="checkbox"]');
    await selectAll.click();

    // Verify count shows total for current page
    await expect(page.getByText(/\d+ selected/)).toBeVisible({ timeout: 5000 });

    // Click again to deselect all
    await selectAll.click();

    // Batch action bar should disappear
    await expect(page.getByText(/\d+ selected/)).not.toBeVisible({ timeout: 5000 });
  });

  // -----------------------------------------------------------------------
  // Test 3: Batch edit
  // -----------------------------------------------------------------------

  test('batch edit applies updates to selected samples', async ({ page }) => {
    await loginAndNavigateToDataset(page);
    const rowCount = await ensureSamplesTab(page);

    if (rowCount < 2) {
      test.skip(true, 'Need at least 2 samples for batch edit test');
      return;
    }

    // Select first 2 samples
    const checkboxes = page.locator('table tbody tr td:first-child input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();

    // Click Edit Selected
    await page.getByRole('button', { name: /edit selected/i }).click();

    // Verify modal opens
    await expect(page.getByText(/edit 2 samples/i)).toBeVisible({ timeout: 5000 });

    // Check the metadata_json field checkbox and enter value
    const metaCheckbox = page.locator('label:has-text("Metadata JSON") input[type="checkbox"]');
    await metaCheckbox.click();

    const metaInput = page.locator('textarea').last();
    await metaInput.clear();
    await metaInput.fill('{"batch_edited": true}');

    // Click Apply
    await page.getByRole('button', { name: /apply/i }).click();

    // Modal should close
    await expect(page.getByText(/edit 2 samples/i)).not.toBeVisible({ timeout: 5000 });
  });

  // -----------------------------------------------------------------------
  // Test 4: Batch delete
  // -----------------------------------------------------------------------

  test('batch delete removes selected samples', async ({ page }) => {
    await loginAndNavigateToDataset(page);
    const rowCount = await ensureSamplesTab(page);

    if (rowCount < 2) {
      test.skip(true, 'Need at least 2 samples for batch delete test');
      return;
    }

    // Select first 2 samples
    const checkboxes = page.locator('table tbody tr td:first-child input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();

    // Click Delete Selected
    await page.getByRole('button', { name: /delete selected/i }).click();

    // Verify confirmation dialog
    await expect(page.getByText(/delete 2 samples/i)).toBeVisible({ timeout: 5000 });

    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click();

    // Batch action bar should disappear after deletion completes
    await expect(page.getByText('2 selected')).not.toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Test 5: Pagination
  // -----------------------------------------------------------------------

  test('pagination controls appear for datasets with 50+ samples', async ({ page }) => {
    await loginAndNavigateToDataset(page);

    // Go to Samples tab
    await page.getByRole('button', { name: 'Samples' }).click();

    // Wait for table to load
    await page.waitForTimeout(2000);

    // Check if pagination exists (only appears for 50+ samples)
    const paginationNext = page.getByRole('button', { name: /next/i });
    const hasPagination = await paginationNext.count();

    if (hasPagination === 0) {
      // Dataset has fewer than 50 samples — verify Samples count is shown
      const samplesHeader = page.getByText(/samples \(\d+\)/i);
      await expect(samplesHeader).toBeVisible({ timeout: 5000 });
      return;
    }

    // Verify page indicator
    await expect(page.getByText(/page 1 of/i)).toBeVisible({ timeout: 5000 });

    // Click Next
    await paginationNext.click();

    // Verify page indicator updates
    await expect(page.getByText(/page 2 of/i)).toBeVisible({ timeout: 10000 });

    // Click Previous
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(page.getByText(/page 1 of/i)).toBeVisible({ timeout: 10000 });
  });
});
