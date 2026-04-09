import { test, expect, type Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Admin CRM E2E Tests — Queue, Pipeline, Prospects
 *
 * Tests the Three-Mode Admin Panel:
 *   /admin/queue    — Reply Queue (inbox reader output)
 *   /admin/pipeline — Active Pipeline (lead CRM table)
 *   /admin/prospects — Signal Discovery (daily scanner output)
 *
 * Auth: Uses Supabase Admin API to generate magic link for john@claru.ai.
 * Seed data must be present (run via Supabase MCP or seed script before running).
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ADMIN_TEST_EMAIL (defaults to john@claru.ai)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const ADMIN_EMAIL = process.env.ADMIN_TEST_EMAIL ?? 'john@claru.ai';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'admin-crm');

/**
 * Reset seed data to known state before the full test suite.
 * Dismiss/skip tests mutate DB rows; this ensures re-runs are idempotent.
 */
async function resetSeedData(): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return;
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  // Reset dismissed queue items back to their original draft_status
  await supabaseAdmin
    .from('reply_queue')
    .update({ draft_status: 'needs_manual_draft' })
    .eq('sender_name', 'Matthias Niessner')
    .eq('draft_status', 'dismissed');
  await supabaseAdmin
    .from('reply_queue')
    .update({ draft_status: 'pending' })
    .eq('sender_name', 'Daniel Georr')
    .eq('draft_status', 'dismissed');
  // Reset skipped prospect signals back to new
  await supabaseAdmin
    .from('prospect_signals')
    .update({ status: 'new' })
    .in('company_name', ['Sama', 'iMerit'])
    .eq('status', 'skipped');
}

// Global setup: reset seed data once before all tests in this file
test.beforeAll(async () => {
  await resetSeedData();
});

function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

async function authenticateAsAdmin(page: Page, baseURL: string): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: ADMIN_EMAIL,
  });

  if (error || !data?.properties?.hashed_token) {
    throw new Error(`Failed to generate magic link for ${ADMIN_EMAIL}: ${error?.message}`);
  }

  // Navigate directly to our local callback with token_hash — avoids the
  // external Supabase redirect which follows the project's Site URL (claru.ai),
  // not localhost. Our callback's Flow 2 handles token_hash verification.
  const tokenHash = data.properties.hashed_token;
  const callbackUrl = `${baseURL}/portal/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=magiclink`;
  await page.goto(callbackUrl, { waitUntil: 'load' });

  // Wait to land somewhere in /portal (not /portal/login)
  await page.waitForURL(
    (url) => url.pathname.startsWith('/portal') && !url.pathname.includes('/portal/login'),
    { timeout: 30_000 }
  );
}

test.describe('Admin CRM — Auth Guard', () => {
  // The new CRM routes use portal (Supabase) auth via middleware.
  // Unauthenticated requests are redirected to /portal/login, not 404.

  test('unauthenticated GET /admin/queue → redirect to /portal/login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/queue');
    // Middleware redirects to /portal/login
    await expect(page).toHaveURL(/\/portal\/login/);
  });

  test('unauthenticated GET /admin/pipeline → redirect to /portal/login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/pipeline');
    await expect(page).toHaveURL(/\/portal\/login/);
  });

  test('unauthenticated GET /admin/prospects → redirect to /portal/login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/admin/prospects');
    await expect(page).toHaveURL(/\/portal\/login/);
  });
});

test.describe('Admin CRM — Portal Nav', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await authenticateAsAdmin(page, testInfo.project.use.baseURL ?? 'http://localhost:3000');
    await page.goto('/portal');
  });

  test('admin sees Queue, Pipeline, Prospects tabs in portal nav', async ({ page }) => {
    ensureScreenshotDir();

    // Nav should have the 3 CRM tabs
    await expect(page.getByRole('link', { name: /queue/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pipeline/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /prospects/i })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'portal-nav-admin-tabs.png') });
  });
});

test.describe('Admin CRM — Queue Page', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await authenticateAsAdmin(page, testInfo.project.use.baseURL ?? 'http://localhost:3000');
  });

  test('queue page loads with seed items', async ({ page }) => {
    ensureScreenshotDir();
    await page.goto('/admin/queue');
    await page.waitForLoadState('load');

    // Should see the heading
    await expect(page.getByRole('heading', { name: 'Reply Queue' })).toBeVisible();

    // Should see at least 1 queue item (seed data: Daniel Georr + Matthias Niessner)
    await expect(page.getByText('Daniel Georr').first()).toBeVisible();
    await expect(page.getByText('Matthias Niessner').first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'queue-loaded.png') });
  });

  test('classification badges render correctly', async ({ page }) => {
    await page.goto('/admin/queue');
    await page.waitForLoadState('load');

    // "interested" badge from seed item 1
    await expect(page.getByText('interested').first()).toBeVisible();
    // "requirements" badge from seed item 2
    await expect(page.getByText('requirements', { exact: true }).first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'queue-classification-badges.png') });
  });

  test('needs_manual_draft item shows warning label', async ({ page }) => {
    await page.goto('/admin/queue');
    await page.waitForLoadState('load');

    await expect(page.getByText('Needs manual draft')).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'queue-needs-manual-draft.png') });
  });

  test('draft textarea is editable', async ({ page }) => {
    await page.goto('/admin/queue');
    await page.waitForLoadState('load');

    // Edit the draft for the first item (Daniel Georr — has a draft)
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    await textarea.click();
    await textarea.fill('Updated draft response for testing.');

    // Tab out to trigger blur → updateDraft server action
    await textarea.press('Tab');
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'queue-draft-edited.png') });
  });

  test('dismiss button removes item from queue', async ({ page }) => {
    await page.goto('/admin/queue');
    await page.waitForLoadState('load');

    // Count items before
    const initialItems = await page.locator('textarea').count();
    expect(initialItems).toBeGreaterThan(0);

    // Click Dismiss on the second item (Matthias Niessner — no draft, safe to dismiss)
    const dismissButtons = page.getByRole('button', { name: /dismiss/i });
    await dismissButtons.last().click();

    // Wait for server action to complete — use timeout since revalidation keeps network busy
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'queue-after-dismiss.png') });

    // Item count should decrease
    const finalItems = await page.locator('textarea').count();
    expect(finalItems).toBeLessThan(initialItems);
  });
});

test.describe('Admin CRM — Pipeline Page', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await authenticateAsAdmin(page, testInfo.project.use.baseURL ?? 'http://localhost:3000');
  });

  test('pipeline page loads with seed leads', async ({ page }) => {
    ensureScreenshotDir();
    await page.goto('/admin/pipeline');
    await page.waitForLoadState('load');

    await expect(page.getByRole('heading', { name: 'Pipeline' })).toBeVisible();

    // Should see both seeded companies (exact: true avoids matching daniel@hub.xyz)
    await expect(page.getByText('Hub.XYZ', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Spaitial', { exact: true })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'pipeline-loaded.png') });
  });

  test('filter tabs work — demand/supply/all', async ({ page }) => {
    await page.goto('/admin/pipeline');
    await page.waitForLoadState('load');

    // Click "supply" filter — seed data is all demand, so table should be empty
    await page.getByRole('button', { name: /supply/i }).click();
    await expect(page.getByText('No active leads in this view')).toBeVisible();

    // Click "all" — leads reappear
    await page.getByRole('button', { name: /all/i }).click();
    await expect(page.getByText('Hub.XYZ', { exact: true }).first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'pipeline-filter-tabs.png') });
  });

  test('thread state dropdown is interactive', async ({ page }) => {
    await page.goto('/admin/pipeline');
    await page.waitForLoadState('load');

    // Find a thread state select (should show 'warm' for Hub.XYZ seed row)
    const stateSelects = page.locator('select').filter({ hasText: /warm|hot|cold/ });
    await expect(stateSelects.first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'pipeline-thread-state.png') });
  });

  test('expanding a row shows email and type detail', async ({ page }) => {
    await page.goto('/admin/pipeline');
    await page.waitForLoadState('load');

    // Click the chevron/company name to expand (use role button to avoid strict mode)
    await page.getByRole('button', { name: /Hub\.XYZ/ }).click();
    await page.waitForTimeout(300);

    // Expanded detail should show email
    await expect(page.getByText('daniel@hub.xyz').first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'pipeline-row-expanded.png') });
  });
});

test.describe('Admin CRM — Prospects Page', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await authenticateAsAdmin(page, testInfo.project.use.baseURL ?? 'http://localhost:3000');
  });

  test('prospects page loads with seed signals', async ({ page }) => {
    ensureScreenshotDir();
    await page.goto('/admin/prospects');
    await page.waitForLoadState('load');

    await expect(page.getByRole('heading', { name: 'Prospects' })).toBeVisible();

    // Should see the 2 new signals (.first() bypasses strict mode for multi-match)
    await expect(page.getByText('Sama').first()).toBeVisible();
    await expect(page.getByText('iMerit').first()).toBeVisible();

    // Queued signal should appear in "Queued" section
    await expect(page.getByText('CloudFactory').first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prospects-loaded.png') });
  });

  test('signal type badges render', async ({ page }) => {
    await page.goto('/admin/prospects');
    await page.waitForLoadState('load');

    // gtm file badges for Sama and iMerit
    const gtmBadges = page.getByText('gtm file');
    await expect(gtmBadges.first()).toBeVisible();

    // hiring badge for CloudFactory (exact: true avoids matching description text)
    await expect(page.getByText('hiring', { exact: true }).first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prospects-signal-badges.png') });
  });

  test('skip button removes signal from new list', async ({ page }) => {
    await page.goto('/admin/prospects');
    await page.waitForLoadState('load');

    // Skip the iMerit signal
    const skipButtons = page.getByRole('button', { name: /skip/i });
    const initialCount = await skipButtons.count();
    expect(initialCount).toBeGreaterThan(0);

    await skipButtons.last().click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prospects-after-skip.png') });

    // One fewer skip button (signal moved to skipped, no longer shown)
    const finalCount = await page.getByRole('button', { name: /skip/i }).count();
    expect(finalCount).toBeLessThan(initialCount);
  });

  test('Queue to Smartlead button loads campaign dropdown', async ({ page }) => {
    await page.goto('/admin/prospects');
    await page.waitForLoadState('load');

    // Click "Queue to Smartlead" on first new signal (Sama)
    const queueBtn = page.getByRole('button', { name: /queue to smartlead/i }).first();
    await expect(queueBtn).toBeVisible();
    await queueBtn.click();

    // Either: campaign select appears (SMARTLEAD_API_KEY configured)
    // or:     error message appears (key not set in local dev)
    await page.waitForTimeout(1500);

    // Either outcome is acceptable in local dev — just verify the button was clickable
    // and something happened (dropdown OR error)
    const hasSelect = await page.locator('select').filter({ hasText: /campaign/i }).isVisible().catch(() => false);
    const hasError = await page.getByText(/could not load|not configured/i).isVisible().catch(() => false);
    expect(hasSelect || hasError).toBe(true);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prospects-queue-to-smartlead.png') });
  });
});
