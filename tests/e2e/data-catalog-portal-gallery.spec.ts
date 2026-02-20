import { test, expect } from '@playwright/test';

test.describe('Data Catalog — Portal Gallery & Auth Boundary (US-011)', () => {
  /* ===================================================================
     AUTH BOUNDARY TESTS
     The portal requires a valid Supabase magic link session. Without
     one, all /portal/* routes (except /portal/login and /portal/auth/*)
     should redirect to /portal/login.

     We cannot test authenticated gallery/detail views without a real
     magic link session, so these tests focus on auth boundary behavior.
     =================================================================== */

  test.describe('Portal auth boundary — unauthenticated access', () => {
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

    test('/portal/catalog/some-dataset-id redirects to /portal/login', async ({ page }) => {
      // Even a specific dataset detail page should redirect
      await page.goto('/portal/catalog/00000000-0000-0000-0000-000000000000');

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
     LOGIN PAGE RENDERING
     The /portal/login page should always be accessible without a
     session and render the expected UI elements.
     =================================================================== */

  test.describe('Login page (/portal/login)', () => {
    test('login page renders without redirect', async ({ page }) => {
      await page.goto('/portal/login');

      // Should stay on the login page, not redirect
      expect(page.url()).toContain('/portal/login');

      // Page heading should be visible
      await expect(page.locator('h1')).toBeVisible();
    });

    test('login page renders with "claru/portal" heading', async ({ page }) => {
      await page.goto('/portal/login');

      const headingText = await page.locator('h1').textContent();
      expect(headingText).toContain('portal');
    });

    test('login page shows "authenticated access required" subtitle', async ({ page }) => {
      await page.goto('/portal/login');

      await expect(page.getByText('authenticated access required')).toBeVisible();
    });

    test('login page has email input with correct type', async ({ page }) => {
      await page.goto('/portal/login');

      const emailInput = page.locator('#portal-email');
      await expect(emailInput).toBeVisible();
      expect(await emailInput.getAttribute('type')).toBe('email');
    });

    test('login page has "sign in with magic link" button', async ({ page }) => {
      await page.goto('/portal/login');

      const submitButton = page.getByRole('button', { name: /sign in with magic link/i });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
    });

    test('login page shows "passwordless authentication via email" footer', async ({
      page,
    }) => {
      await page.goto('/portal/login');

      await expect(page.getByText('passwordless authentication via email')).toBeVisible();
    });

    test('email input accepts text', async ({ page }) => {
      await page.goto('/portal/login');

      const emailInput = page.locator('#portal-email');
      await emailInput.fill('tester@frontier.ai');

      // Verify the input value
      expect(await emailInput.inputValue()).toBe('tester@frontier.ai');

      // Submit button should remain enabled
      const submitButton = page.getByRole('button', { name: /sign in with magic link/i });
      await expect(submitButton).toBeEnabled();

      // We do NOT click submit to avoid triggering a real Supabase OTP request
    });

    test('session expired banner shows when reason=expired', async ({ page }) => {
      await page.goto('/portal/login?reason=expired');

      await expect(page.getByText(/session has expired/i)).toBeVisible();
    });

    test('session expired banner does not show without query param', async ({ page }) => {
      await page.goto('/portal/login');

      // The expired banner should NOT be visible
      await expect(page.getByText(/session has expired/i)).not.toBeVisible();
    });
  });

  /* ===================================================================
     GALLERY AND DETAIL VIEW — AUTHENTICATED TESTS
     These tests require a valid portal session (magic link auth).
     They are skipped by default since there is no way to authenticate
     without a real Supabase magic link flow.

     To enable: set PORTAL_SESSION_COOKIE env var with a valid
     Supabase auth token cookie value.
     =================================================================== */

  test.describe('Portal gallery (requires authenticated session)', () => {
    const sessionCookie = process.env.PORTAL_SESSION_COOKIE;
    const hasSession = !!sessionCookie;

    test.skip(!hasSession, 'Requires PORTAL_SESSION_COOKIE env var for authenticated tests');

    test('portal catalog page renders gallery grid', async ({ page }) => {
      if (!hasSession) return;

      // Note: Cookie injection would need to be configured per-project
      // This is a placeholder for when session-based tests are enabled
      await page.goto('/portal/catalog');

      // Should not redirect to login
      expect(page.url()).toContain('/portal/catalog');

      // Gallery heading or grid should be visible
      await expect(page.locator('h1').first()).toBeVisible();
    });

    test('portal dataset detail page renders with samples', async ({ page }) => {
      if (!hasSession) return;

      await page.goto('/portal/catalog');
      expect(page.url()).toContain('/portal/catalog');

      // Click the first dataset card
      const firstCard = page.locator('a[href*="/portal/catalog/"]').first();
      if ((await firstCard.count()) === 0) {
        test.skip(true, 'No datasets available in portal');
        return;
      }

      await firstCard.click();
      await page.waitForURL('**/portal/catalog/**', { timeout: 10000 });

      // Dataset detail page should have a heading
      await expect(page.locator('h1').first()).toBeVisible();
    });

    test('sample card click opens detail view', async ({ page }) => {
      if (!hasSession) return;

      // Navigate to a dataset with samples
      await page.goto('/portal/catalog');
      const firstCard = page.locator('a[href*="/portal/catalog/"]').first();
      if ((await firstCard.count()) === 0) {
        test.skip(true, 'No datasets available');
        return;
      }

      await firstCard.click();
      await page.waitForURL('**/portal/catalog/**', { timeout: 10000 });

      // Click the first sample in the gallery grid
      const sampleCard = page.locator('[data-sample-card]').first();
      if ((await sampleCard.count()) === 0) {
        test.skip(true, 'No samples in this dataset');
        return;
      }

      await sampleCard.click();

      // Detail modal/view should open
      await expect(page.locator('[data-detail-view]').first()).toBeVisible({ timeout: 5000 });
    });

    test('detail view has Copy JSON button', async ({ page }) => {
      if (!hasSession) return;

      await page.goto('/portal/catalog');
      const firstCard = page.locator('a[href*="/portal/catalog/"]').first();
      if ((await firstCard.count()) === 0) {
        test.skip(true, 'No datasets available');
        return;
      }

      await firstCard.click();
      await page.waitForURL('**/portal/catalog/**', { timeout: 10000 });

      const sampleCard = page.locator('[data-sample-card]').first();
      if ((await sampleCard.count()) === 0) {
        test.skip(true, 'No samples available');
        return;
      }

      await sampleCard.click();
      await expect(page.locator('[data-detail-view]').first()).toBeVisible({ timeout: 5000 });

      // Copy JSON button should be present
      const copyButton = page.getByRole('button', { name: /copy json/i });
      await expect(copyButton).toBeVisible();
    });

    test('Escape key closes detail view', async ({ page }) => {
      if (!hasSession) return;

      await page.goto('/portal/catalog');
      const firstCard = page.locator('a[href*="/portal/catalog/"]').first();
      if ((await firstCard.count()) === 0) {
        test.skip(true, 'No datasets available');
        return;
      }

      await firstCard.click();
      await page.waitForURL('**/portal/catalog/**', { timeout: 10000 });

      const sampleCard = page.locator('[data-sample-card]').first();
      if ((await sampleCard.count()) === 0) {
        test.skip(true, 'No samples available');
        return;
      }

      await sampleCard.click();
      await expect(page.locator('[data-detail-view]').first()).toBeVisible({ timeout: 5000 });

      // Press Escape to close
      await page.keyboard.press('Escape');

      // Detail view should be dismissed
      await expect(page.locator('[data-detail-view]')).not.toBeVisible({ timeout: 5000 });
    });

    test('next/previous navigation works in detail view', async ({ page }) => {
      if (!hasSession) return;

      await page.goto('/portal/catalog');
      const firstCard = page.locator('a[href*="/portal/catalog/"]').first();
      if ((await firstCard.count()) === 0) {
        test.skip(true, 'No datasets available');
        return;
      }

      await firstCard.click();
      await page.waitForURL('**/portal/catalog/**', { timeout: 10000 });

      // Need at least 2 samples for navigation
      const sampleCards = page.locator('[data-sample-card]');
      if ((await sampleCards.count()) < 2) {
        test.skip(true, 'Need at least 2 samples for navigation test');
        return;
      }

      await sampleCards.first().click();
      await expect(page.locator('[data-detail-view]').first()).toBeVisible({ timeout: 5000 });

      // Press right arrow for next sample
      await page.keyboard.press('ArrowRight');

      // The detail view should still be visible (navigated to next)
      await expect(page.locator('[data-detail-view]').first()).toBeVisible();

      // Press left arrow to go back
      await page.keyboard.press('ArrowLeft');

      // Should still be in detail view
      await expect(page.locator('[data-detail-view]').first()).toBeVisible();
    });
  });
});
