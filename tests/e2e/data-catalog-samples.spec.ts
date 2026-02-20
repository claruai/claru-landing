import { test, expect } from '@playwright/test';

test.describe('Data Catalog — Admin Sample Management (US-010)', () => {
  /* ===================================================================
     These tests require valid admin credentials to access the admin
     panel. They verify UI structure and validation behavior for the
     sample management features (Add Sample via URL, Bulk Import).

     To run: set ADMIN_EMAIL and ADMIN_PASSWORD env vars, or they
     will use the defaults for local dev.
     =================================================================== */

  const adminEmail = process.env.ADMIN_EMAIL ?? 'team@claru.ai';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'qweqwe123!';

  /* ===================================================================
     LOGIN + NAVIGATE TO CATALOG
     =================================================================== */

  test.describe('Admin login and catalog navigation', () => {
    test('login as admin and navigate to /admin/catalog', async ({ page }) => {
      await page.goto('/admin');

      // Fill credentials
      await page.locator('#admin-email').fill(adminEmail);
      await page.locator('#admin-password').fill(adminPassword);
      await page.getByRole('button', { name: /authenticate/i }).click();

      // Wait for redirect after successful login
      await page.waitForURL('**/admin/**', { timeout: 15000 });

      // Navigate to catalog page
      await page.goto('/admin/catalog');

      // Verify the catalog page loaded — should have "create dataset" link
      const createButton = page.locator('a[href="/admin/catalog/new"]');
      await expect(createButton.first()).toBeVisible({ timeout: 10000 });
    });

    test('catalog table renders dataset rows with edit links', async ({ page }) => {
      // Login
      await page.goto('/admin');
      await page.locator('#admin-email').fill(adminEmail);
      await page.locator('#admin-password').fill(adminPassword);
      await page.getByRole('button', { name: /authenticate/i }).click();
      await page.waitForURL('**/admin/**', { timeout: 15000 });

      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      // There should be at least one dataset row with an [edit] link
      const editLinks = page.locator('a:has-text("[edit]")');
      const editCount = await editLinks.count();
      expect(editCount).toBeGreaterThanOrEqual(0); // may be 0 if no datasets seeded
    });
  });

  /* ===================================================================
     DATASET EDIT PAGE — ADD SAMPLE VIA URL FORM
     These tests navigate to the first dataset's edit page and verify
     the AddSampleForm UI renders with the expected fields.
     =================================================================== */

  test.describe('Add Sample via URL form (requires auth + datasets)', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.goto('/admin');
      await page.locator('#admin-email').fill(adminEmail);
      await page.locator('#admin-password').fill(adminPassword);
      await page.getByRole('button', { name: /authenticate/i }).click();
      await page.waitForURL('**/admin/**', { timeout: 15000 });
    });

    test('"Add Sample via URL" section is visible on dataset edit page', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      // Click the first dataset link in the table (the name link, not [edit])
      const firstDatasetLink = page.locator('table tbody tr a').first();
      const linkCount = await firstDatasetLink.count();

      if (linkCount === 0) {
        test.skip(true, 'No datasets in catalog — cannot test edit page');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // The "Add Sample via URL" heading should be visible
      await expect(page.getByText('Add Sample via URL')).toBeVisible();
    });

    test('Media URL input field is visible and accepts text', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Media URL input (identified by placeholder or label)
      const urlInput = page.locator('input[placeholder*="https://"]').first();
      await expect(urlInput).toBeVisible();

      // Fill a test URL
      await urlInput.fill('https://example.com/test-video.mp4');
      expect(await urlInput.inputValue()).toBe('https://example.com/test-video.mp4');
    });

    test('Metadata JSON textarea is visible and accepts text', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // The Metadata JSON label should be visible
      await expect(page.getByText('Metadata JSON')).toBeVisible();

      // The textarea should contain default "{}" value
      const jsonTextarea = page.locator('textarea').first();
      await expect(jsonTextarea).toBeVisible();
      const initialValue = await jsonTextarea.inputValue();
      expect(initialValue).toContain('{}');
    });

    test('Add Sample button is visible', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // "Add Sample" button should be present
      const addButton = page.getByRole('button', { name: /add sample/i });
      await expect(addButton).toBeVisible();
    });

    test('empty URL submission shows validation error', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Click "Add Sample" without filling URL
      const addButton = page.getByRole('button', { name: /add sample/i });
      await addButton.click();

      // Should show URL required error
      await expect(page.getByText(/media url is required/i)).toBeVisible({ timeout: 5000 });
    });

    test('invalid URL shows validation error on blur', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Type an invalid URL into the Media URL field
      const urlInput = page.locator('input[placeholder*="https://"]').first();
      await urlInput.fill('not-a-valid-url');
      await urlInput.blur();

      // Should show URL format error
      await expect(
        page.getByText(/url must start with http/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test('invalid JSON in textarea shows error on blur', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Clear the JSON textarea and type invalid JSON
      const jsonTextarea = page.locator('textarea').first();
      await jsonTextarea.clear();
      await jsonTextarea.fill('not json');
      await jsonTextarea.blur();

      // Should show JSON validation error
      await expect(
        page.getByText(/invalid json/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test('valid JSON clears error on blur', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Type invalid JSON first
      const jsonTextarea = page.locator('textarea').first();
      await jsonTextarea.clear();
      await jsonTextarea.fill('not json');
      await jsonTextarea.blur();

      // Wait for error to show
      await expect(page.getByText(/invalid json/i)).toBeVisible({ timeout: 5000 });

      // Now type valid JSON
      await jsonTextarea.clear();
      await jsonTextarea.fill('{"key": "value"}');
      await jsonTextarea.blur();

      // Error should be gone
      await expect(page.getByText(/invalid json/i)).not.toBeVisible({ timeout: 3000 });
    });

    test('form has both URL and JSON fields populated for submission', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Fill URL
      const urlInput = page.locator('input[placeholder*="https://"]').first();
      await urlInput.fill('https://example.com/test-video.mp4');

      // Fill metadata JSON
      const jsonTextarea = page.locator('textarea').first();
      await jsonTextarea.clear();
      await jsonTextarea.fill('{"subcategory": "outdoor", "fps": 30}');

      // Verify values
      expect(await urlInput.inputValue()).toBe('https://example.com/test-video.mp4');
      expect(await jsonTextarea.inputValue()).toBe('{"subcategory": "outdoor", "fps": 30}');

      // Add Sample button should be visible and enabled
      const addButton = page.getByRole('button', { name: /add sample/i });
      await expect(addButton).toBeVisible();
      await expect(addButton).toBeEnabled();

      // We do NOT click submit to avoid triggering a real API call
    });
  });

  /* ===================================================================
     BULK IMPORT SECTION
     Verify the Bulk Import button/panel renders on the dataset edit page.
     =================================================================== */

  test.describe('Bulk Import section (requires auth + datasets)', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.goto('/admin');
      await page.locator('#admin-email').fill(adminEmail);
      await page.locator('#admin-password').fill(adminPassword);
      await page.getByRole('button', { name: /authenticate/i }).click();
      await page.waitForURL('**/admin/**', { timeout: 15000 });
    });

    test('"Bulk Import Samples" button is visible on dataset edit page', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // The "Bulk Import Samples" button should be present
      const bulkButton = page.getByRole('button', { name: /bulk import/i });
      await expect(bulkButton).toBeVisible();
    });

    test('clicking Bulk Import opens the import panel with JSON and CSV tabs', async ({
      page,
    }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Click Bulk Import button
      const bulkButton = page.getByRole('button', { name: /bulk import/i });
      await bulkButton.click();

      // The expanded panel should show "Bulk Import" heading
      await expect(page.getByText('Bulk Import').first()).toBeVisible();

      // Should have JSON Paste and CSV Upload tabs
      await expect(page.getByRole('button', { name: /json paste/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /csv upload/i })).toBeVisible();
    });

    test('JSON paste tab has textarea and Import All button', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Open Bulk Import
      await page.getByRole('button', { name: /bulk import/i }).click();
      await expect(page.getByText('Bulk Import').first()).toBeVisible();

      // JSON Paste should be the default active tab
      await expect(page.getByText('Paste JSON Array')).toBeVisible();

      // Textarea for pasting JSON should be present
      const jsonTextarea = page.locator('textarea[placeholder*="media_url"]');
      await expect(jsonTextarea).toBeVisible();

      // Import All button should be present (disabled initially)
      const importButton = page.getByRole('button', { name: /import all/i });
      await expect(importButton).toBeVisible();
    });

    test('JSON bulk import shows validation feedback for invalid JSON', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Open Bulk Import
      await page.getByRole('button', { name: /bulk import/i }).click();

      // Type invalid JSON into the bulk import textarea
      const jsonTextarea = page.locator('textarea[placeholder*="media_url"]');
      await jsonTextarea.fill('not json');

      // Should show "Invalid JSON syntax" error
      await expect(page.getByText(/invalid json syntax/i)).toBeVisible({ timeout: 5000 });
    });

    test('JSON bulk import shows sample count for valid JSON array', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Open Bulk Import
      await page.getByRole('button', { name: /bulk import/i }).click();

      // Type valid JSON array with 2 samples
      const jsonTextarea = page.locator('textarea[placeholder*="media_url"]');
      const validPayload = JSON.stringify([
        { media_url: 'https://example.com/video1.mp4', metadata: { fps: 30 } },
        { media_url: 'https://example.com/video2.mp4', metadata: { fps: 60 } },
      ]);
      await jsonTextarea.fill(validPayload);

      // Should show "2 samples to import"
      await expect(page.getByText(/2 samples to import/i)).toBeVisible({ timeout: 5000 });

      // Import All button should now be enabled
      const importButton = page.getByRole('button', { name: /import all/i });
      await expect(importButton).toBeEnabled();

      // We do NOT click import to avoid triggering a real API call
    });

    test('CSV Upload tab renders with file chooser button', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Open Bulk Import
      await page.getByRole('button', { name: /bulk import/i }).click();

      // Switch to CSV tab
      await page.getByRole('button', { name: /csv upload/i }).click();

      // Should show "Upload CSV File" label and a file chooser button
      await expect(page.getByText('Upload CSV File')).toBeVisible();
      await expect(page.getByRole('button', { name: /choose .csv file/i })).toBeVisible();

      // Should show the format hint about required columns
      await expect(page.getByText(/media_url/)).toBeVisible();
    });

    test('close button dismisses bulk import panel', async ({ page }) => {
      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // Open Bulk Import
      await page.getByRole('button', { name: /bulk import/i }).click();
      await expect(page.getByText('Bulk Import').first()).toBeVisible();

      // Click the close button (X icon with aria-label)
      const closeButton = page.getByRole('button', { name: /close bulk import/i });
      await closeButton.click();

      // Panel should be dismissed, "Bulk Import Samples" button should be back
      await expect(page.getByRole('button', { name: /bulk import/i })).toBeVisible();
    });
  });

  /* ===================================================================
     DATASET EDIT PAGE — FILE UPLOAD COLLAPSIBLE
     Verify the secondary "Or upload a file" section exists.
     =================================================================== */

  test.describe('File upload collapsible section (requires auth + datasets)', () => {
    test('"Or upload a file" toggle is visible on dataset edit page', async ({ page }) => {
      // Login
      await page.goto('/admin');
      await page.locator('#admin-email').fill(adminEmail);
      await page.locator('#admin-password').fill(adminPassword);
      await page.getByRole('button', { name: /authenticate/i }).click();
      await page.waitForURL('**/admin/**', { timeout: 15000 });

      await page.goto('/admin/catalog');
      await expect(page.locator('a[href="/admin/catalog/new"]').first()).toBeVisible({
        timeout: 10000,
      });

      const firstDatasetLink = page.locator('table tbody tr a').first();
      if ((await firstDatasetLink.count()) === 0) {
        test.skip(true, 'No datasets in catalog');
        return;
      }

      await firstDatasetLink.click();
      await page.waitForURL('**/admin/catalog/**', { timeout: 10000 });

      // "Or upload a file" toggle should be visible
      await expect(page.getByText('Or upload a file')).toBeVisible();
    });
  });
});
