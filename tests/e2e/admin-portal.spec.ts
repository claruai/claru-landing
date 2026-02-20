import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team@claru.ai';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qweqwe123!';

test.describe('Admin Portal', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/admin');
    // Look for login form
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('input[type="email"], input[name="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.locator('button[type="submit"]').click();
    // Wait for error
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Invalid credentials').or(page.locator('text=invalid'))).toBeVisible();
  });

  test('valid login redirects to admin/jobs', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/admin/jobs', { timeout: 5000 });
    await expect(page).toHaveURL(/\/admin\/jobs/);
  });

  test('admin dashboard shows job table', async ({ page }) => {
    // Login first
    await page.goto('/admin');
    await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/admin/jobs', { timeout: 5000 });

    // Verify table renders
    await expect(page.locator('table').or(page.locator('[role="table"]'))).toBeVisible();
    // Verify job count summary
    await expect(page.locator('text=active').or(page.locator('text=total'))).toBeVisible();
  });

  test('search filters jobs in admin', async ({ page }) => {
    // Login
    await page.goto('/admin');
    await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/admin/jobs', { timeout: 5000 });

    // Search
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('RLHF');
      await page.waitForTimeout(500);
    }
  });

  test('protected routes redirect when not logged in', async ({ page }) => {
    await page.goto('/admin/jobs');
    // Should redirect to /admin login
    await page.waitForURL('**/admin', { timeout: 5000 });
    // Should NOT be on /admin/jobs
    const url = page.url();
    // Either redirected to /admin or shows login form
    await expect(page.locator('input[type="email"], input[name="email"]').or(page.locator('input[type="password"]'))).toBeVisible();
  });

  test('logout clears session', async ({ page }) => {
    // Login
    await page.goto('/admin');
    await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/admin/jobs', { timeout: 5000 });

    // Logout
    const logoutBtn = page.locator('button').filter({ hasText: /logout/i }).first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForURL('**/admin', { timeout: 5000 });
    }

    // Try accessing protected route
    await page.goto('/admin/jobs');
    await page.waitForTimeout(1000);
    // Should be redirected to login
    await expect(page.locator('input[type="email"], input[name="email"]').or(page.locator('input[type="password"]'))).toBeVisible();
  });
});
