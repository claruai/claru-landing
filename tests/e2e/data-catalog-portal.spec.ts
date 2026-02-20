import { test, expect } from '@playwright/test';

test.describe('Data Catalog — Portal Flow (US-025)', () => {
  /* ===================================================================
     AUTH BOUNDARY
     Unauthenticated users should be redirected to /portal/login.
     =================================================================== */

  test.describe('Auth boundary (unauthenticated)', () => {
    test('/portal redirects to /portal/login', async ({ page }) => {
      await page.goto('/portal');

      // Middleware should redirect unauthenticated users to /portal/login
      await page.waitForURL('**/portal/login**', { timeout: 10000 });
      expect(page.url()).toContain('/portal/login');
    });

    test('/portal/catalog redirects to /portal/login when unauthenticated', async ({
      page,
    }) => {
      await page.goto('/portal/catalog');

      await page.waitForURL('**/portal/login**', { timeout: 10000 });
      expect(page.url()).toContain('/portal/login');
    });

    test('/portal/request redirects to /portal/login when unauthenticated', async ({
      page,
    }) => {
      await page.goto('/portal/request');

      await page.waitForURL('**/portal/login**', { timeout: 10000 });
      expect(page.url()).toContain('/portal/login');
    });
  });

  /* ===================================================================
     LOGIN PAGE (/portal/login)
     =================================================================== */

  test.describe('Login page (/portal/login)', () => {
    test('renders with email input and magic link button', async ({ page }) => {
      await page.goto('/portal/login');

      // Page heading
      await expect(page.locator('h1')).toBeVisible();
      const headingText = await page.locator('h1').textContent();
      expect(headingText).toContain('portal');

      // Subtitle
      await expect(page.getByText('authenticated access required')).toBeVisible();

      // Email input
      const emailInput = page.locator('#portal-email');
      await expect(emailInput).toBeVisible();
      expect(await emailInput.getAttribute('type')).toBe('email');

      // Submit button with magic link text
      const submitButton = page.getByRole('button', { name: /sign in with magic link/i });
      await expect(submitButton).toBeVisible();
    });

    test('displays passwordless authentication footer text', async ({ page }) => {
      await page.goto('/portal/login');

      await expect(
        page.getByText('passwordless authentication via email')
      ).toBeVisible();
    });

    test('shows session expired banner when reason=expired', async ({ page }) => {
      await page.goto('/portal/login?reason=expired');

      await expect(
        page.getByText(/session has expired/i)
      ).toBeVisible();
    });

    test('email input accepts text and button is clickable', async ({ page }) => {
      await page.goto('/portal/login');

      const emailInput = page.locator('#portal-email');
      await emailInput.fill('user@example.com');

      // Verify the input value
      expect(await emailInput.inputValue()).toBe('user@example.com');

      // Submit button should be enabled
      const submitButton = page.getByRole('button', { name: /sign in with magic link/i });
      await expect(submitButton).toBeEnabled();

      // We do NOT click submit to avoid triggering a real Supabase OTP request
    });
  });

  /* ===================================================================
     LOGIN PAGE — ALLOWED WITHOUT AUTH
     The /portal/login path should not redirect (it is the login page).
     =================================================================== */

  test.describe('Login page is accessible without session', () => {
    test('/portal/login does not redirect', async ({ page }) => {
      await page.goto('/portal/login');

      // Should stay on the login page, not redirect
      expect(page.url()).toContain('/portal/login');

      // Content should be rendered
      await expect(page.locator('h1')).toBeVisible();
    });
  });
});
