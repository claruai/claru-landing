import { test, expect } from '@playwright/test';

/**
 * E2E tests for unified sample management (US-014).
 *
 * Tests single sample creation, validation, editing, deletion,
 * and keyboard shortcuts using the new tabbed interface.
 */
test.describe('Sample Management — Single Sample Flows', () => {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'team@claru.ai';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'qweqwe123!';

  /** Helper: login and navigate to a dataset edit page */
  async function loginAndNavigateToDataset(page: import('@playwright/test').Page) {
    // Login
    await page.goto('/admin');
    await page.locator('#admin-email').fill(adminEmail);
    await page.locator('#admin-password').fill(adminPassword);
    await page.getByRole('button', { name: /authenticate/i }).click();
    await page.waitForURL('**/admin/**', { timeout: 15000 });

    // Navigate to catalog
    await page.goto('/admin/catalog');
    await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
      timeout: 10000,
    });

    // Click first dataset edit link
    const editLink = page.locator('a:has-text("[edit]")').first();
    const editCount = await editLink.count();
    if (editCount === 0) {
      test.skip(true, 'No datasets available for testing');
      return;
    }
    await editLink.click();
    await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });
  }

  // -----------------------------------------------------------------------
  // Test 1: Add single sample via S3 URI
  // -----------------------------------------------------------------------

  test('add a single sample via S3 URI', async ({ page }) => {
    await loginAndNavigateToDataset(page);

    // Click Add Sample tab
    await page.getByRole('button', { name: 'Add Sample' }).click();

    // Fill S3 URI
    const s3Input = page.locator('input[placeholder*="s3://"]');
    await expect(s3Input).toBeVisible({ timeout: 5000 });
    await s3Input.fill('s3://moonvalley-annotation-platform/test/e2e-sample.mp4');

    // Fill metadata JSON
    const metaTextarea = page.locator('textarea');
    await metaTextarea.clear();
    await metaTextarea.fill('{"test": true, "source": "e2e"}');

    // Submit
    await page.getByRole('button', { name: /add sample/i }).click();

    // Verify success message
    await expect(page.getByText('Sample added.')).toBeVisible({ timeout: 10000 });
  });

  // -----------------------------------------------------------------------
  // Test 2: Form validation
  // -----------------------------------------------------------------------

  test('shows validation errors for empty S3 URI and invalid JSON', async ({ page }) => {
    await loginAndNavigateToDataset(page);

    // Click Add Sample tab
    await page.getByRole('button', { name: 'Add Sample' }).click();

    // Try to submit empty form
    await page.getByRole('button', { name: /add sample/i }).click();

    // Verify error shown for empty S3 URI
    await expect(page.getByText(/S3 Object URI is required/i)).toBeVisible({ timeout: 5000 });

    // Enter valid S3 URI but invalid JSON
    const s3Input = page.locator('input[placeholder*="s3://"]');
    await s3Input.fill('s3://bucket/test.mp4');

    const metaTextarea = page.locator('textarea');
    await metaTextarea.clear();
    await metaTextarea.fill('{invalid json}');
    await metaTextarea.blur();

    // Verify JSON error shown
    await expect(page.getByText(/invalid json/i)).toBeVisible({ timeout: 5000 });
  });

  // -----------------------------------------------------------------------
  // Test 3: Edit a sample
  // -----------------------------------------------------------------------

  test('click sample row to open edit panel, modify, and save', async ({ page }) => {
    await loginAndNavigateToDataset(page);

    // Click Samples tab (should be default)
    const samplesTab = page.getByRole('button', { name: 'Samples' });
    await samplesTab.click();

    // Wait for table to load
    const tableRow = page.locator('table tbody tr').first();
    const rowExists = await tableRow.count();
    if (rowExists === 0) {
      test.skip(true, 'No samples available for editing');
      return;
    }

    // Click first row to open edit panel
    await tableRow.click();

    // Verify edit panel opens
    await expect(page.getByText('Edit Sample')).toBeVisible({ timeout: 5000 });

    // Modify S3 object key
    const s3Input = page.locator('.fixed input[type="text"]').first();
    const originalValue = await s3Input.inputValue();
    await s3Input.clear();
    await s3Input.fill(originalValue + '-edited');

    // Click save
    await page.getByRole('button', { name: /save/i }).first().click();

    // Panel should close (Edit Sample text gone)
    await expect(page.getByText('Edit Sample')).not.toBeVisible({ timeout: 5000 });
  });

  // -----------------------------------------------------------------------
  // Test 4: Delete a sample
  // -----------------------------------------------------------------------

  test('delete a sample from edit panel', async ({ page }) => {
    await loginAndNavigateToDataset(page);

    // First add a sample to delete
    await page.getByRole('button', { name: 'Add Sample' }).click();
    const s3Input = page.locator('input[placeholder*="s3://"]');
    await s3Input.fill('s3://bucket/e2e-delete-test-' + Date.now() + '.mp4');
    await page.getByRole('button', { name: /add sample/i }).click();
    await expect(page.getByText('Sample added.')).toBeVisible({ timeout: 10000 });

    // Switch to Samples tab
    await page.getByRole('button', { name: 'Samples' }).click();

    // Wait for table and click first row
    const tableRow = page.locator('table tbody tr').first();
    await expect(tableRow).toBeVisible({ timeout: 10000 });
    await tableRow.click();

    // Verify edit panel opens
    await expect(page.getByText('Edit Sample')).toBeVisible({ timeout: 5000 });

    // Click Delete
    await page.getByRole('button', { name: /delete sample/i }).click();

    // Confirm deletion
    await expect(page.getByText('Are you sure?')).toBeVisible({ timeout: 3000 });
    await page.getByRole('button', { name: /confirm/i }).click();

    // Panel should close
    await expect(page.getByText('Edit Sample')).not.toBeVisible({ timeout: 5000 });
  });

  // -----------------------------------------------------------------------
  // Test 5: Keyboard shortcuts
  // -----------------------------------------------------------------------

  test('Escape closes the edit panel', async ({ page }) => {
    await loginAndNavigateToDataset(page);

    // Click Samples tab
    await page.getByRole('button', { name: 'Samples' }).click();

    // Wait for table
    const tableRow = page.locator('table tbody tr').first();
    const rowExists = await tableRow.count();
    if (rowExists === 0) {
      test.skip(true, 'No samples available');
      return;
    }

    // Open edit panel
    await tableRow.click();
    await expect(page.getByText('Edit Sample')).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Panel should close
    await expect(page.getByText('Edit Sample')).not.toBeVisible({ timeout: 5000 });
  });
});
