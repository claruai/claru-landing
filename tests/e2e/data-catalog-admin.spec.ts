import { test, expect } from '@playwright/test';

test.describe('Data Catalog — Admin Flow (US-024)', () => {
  /* ===================================================================
     ADMIN LOGIN (/admin)
     =================================================================== */

  test.describe('Admin login page', () => {
    test('login page renders with email and password fields', async ({ page }) => {
      await page.goto('/admin');

      // Page title / heading
      await expect(page.locator('h1')).toBeVisible();
      const headingText = await page.locator('h1').textContent();
      expect(headingText).toContain('admin');

      // Email and password inputs
      await expect(page.locator('#admin-email')).toBeVisible();
      await expect(page.locator('#admin-password')).toBeVisible();

      // Authenticate button
      const submitButton = page.getByRole('button', { name: /authenticate/i });
      await expect(submitButton).toBeVisible();
    });

    test('shows error on invalid credentials', async ({ page }) => {
      await page.goto('/admin');

      await page.locator('#admin-email').fill('bad@example.com');
      await page.locator('#admin-password').fill('wrongpassword');
      await page.getByRole('button', { name: /authenticate/i }).click();

      // Wait for error message to appear
      await expect(page.getByText(/invalid|error|unauthorized/i).first()).toBeVisible({
        timeout: 10000,
      });
    });
  });

  /* ===================================================================
     ADMIN LEADS PAGE (/admin/leads)
     Note: These tests verify UI structure. Without valid admin auth,
     the middleware will redirect to /admin login. We test that the
     redirect works, and test UI structure assuming the page loads.
     =================================================================== */

  test.describe('Admin leads page (UI structure)', () => {
    test('unauthenticated access to /admin/leads redirects to /admin', async ({ page }) => {
      await page.goto('/admin/leads');

      // Middleware should redirect to /admin login page
      await page.waitForURL('**/admin');
      expect(page.url()).toMatch(/\/admin$/);
    });

    test('unauthenticated access to /admin/catalog redirects to /admin', async ({ page }) => {
      await page.goto('/admin/catalog');

      // Middleware should redirect to /admin login page
      await page.waitForURL('**/admin');
      expect(page.url()).toMatch(/\/admin$/);
    });
  });

  /* ===================================================================
     ADMIN LEADS TABLE (structure verification)
     These tests describe the expected UI elements that should be present
     on the leads page when authenticated.
     =================================================================== */

  test.describe('Admin leads table structure (requires auth)', () => {
    // Skip these tests by default since they require valid admin credentials.
    // To run: set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hasCredentials = adminEmail && adminPassword;

    test.skip(!hasCredentials, 'Requires ADMIN_EMAIL and ADMIN_PASSWORD env vars');

    test.beforeEach(async ({ page }) => {
      if (!hasCredentials) return;

      // Login first
      await page.goto('/admin');
      await page.locator('#admin-email').fill(adminEmail!);
      await page.locator('#admin-password').fill(adminPassword!);
      await page.getByRole('button', { name: /authenticate/i }).click();

      // Wait for redirect after login
      await page.waitForURL('**/admin/**', { timeout: 10000 });
    });

    test('leads table renders with filter tabs', async ({ page }) => {
      await page.goto('/admin/leads');

      // Filter tabs: All, Pending, Approved, Rejected
      await expect(page.getByRole('button', { name: /all/i }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /pending/i }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /approved/i }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /rejected/i }).first()).toBeVisible();
    });

    test('leads page has search input', async ({ page }) => {
      await page.goto('/admin/leads');

      const searchInput = page.locator('input[type="text"], input[type="search"]').first();
      await expect(searchInput).toBeVisible();
    });

    test('catalog table renders with Create Dataset button', async ({ page }) => {
      await page.goto('/admin/catalog');

      // "Create Dataset" button should be present in the header
      const createButton = page.locator('a[href="/admin/catalog/new"]');
      await expect(createButton.first()).toBeVisible();

      const buttonText = await createButton.first().textContent();
      expect(buttonText).toContain('create dataset');
    });
  });
});
