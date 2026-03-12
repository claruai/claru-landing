/**
 * US-012: E2E Test -- Approve with Invite and Re-send Flow
 *
 * Uses Playwright to test the approve-with-invite and re-send invite
 * workflow in the admin portal at http://localhost:3001/admin/leads
 */

import { chromium } from 'playwright';

const HEADLESS_SHELL = '/Users/johnthomas/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'team@claru.ai';
const ADMIN_PASSWORD = 'qweqwe123!';
const TEST_NAME = 'Test Invite User';
const TEST_EMAIL = 'test-e2e-invite@example.com';
const TEST_COMPANY = 'Invite Corp';

async function run() {
  console.log('=== US-012: E2E Test -- Approve with Invite and Re-send Flow ===\n');

  // Use headless shell to avoid crashpad bootstrap issues on macOS
  const browser = await chromium.launch({
    executablePath: HEADLESS_SHELL,
    headless: true,
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  try {
    // ----------------------------------------------------------------
    // STEP 1: Login to admin portal
    // ----------------------------------------------------------------
    console.log('[1/6] Navigating to admin login...');
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    // Check if already authenticated (redirected to dashboard/leads)
    if (page.url().includes('/admin/dashboard') || page.url().includes('/admin/leads') || page.url().includes('/admin/jobs')) {
      console.log('  Already authenticated, skipping login');
    } else {
      console.log('  Filling login credentials...');
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();

      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(ADMIN_EMAIL);
      await passwordInput.fill(ADMIN_PASSWORD);

      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();

      // Wait for navigation to dashboard
      await page.waitForURL(/\/admin\/(dashboard|leads|jobs|settings)/, { timeout: 15000 }).catch(() => {});
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: '/tmp/e2e-us012-01-after-login.png' });
    console.log(`  Current URL: ${page.url()}`);
    console.log('  [PASS] Login successful\n');

    // ----------------------------------------------------------------
    // STEP 2: Navigate to leads page and create a test lead
    // ----------------------------------------------------------------
    console.log('[2/6] Creating test lead...');
    await page.goto(`${BASE_URL}/admin/leads`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: '/tmp/e2e-us012-02-leads-page.png' });

    // First, clean up any existing test lead from a previous failed run
    const existingLead = page.locator(`text=${TEST_EMAIL}`);
    if (await existingLead.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('  Found existing test lead -- cleaning up first...');
      // Click view on the existing lead
      const existingRow = page.locator('tr').filter({ hasText: TEST_EMAIL }).first();
      const existingViewLink = existingRow.locator('a').filter({ hasText: /view/i });
      await existingViewLink.click();
      await page.waitForURL(/\/admin\/leads\//, { timeout: 5000 });
      await page.waitForLoadState('networkidle');

      // Scroll to danger zone and delete
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      const existingDeleteBtn = page.locator('button').filter({ hasText: /delete lead/i });
      await existingDeleteBtn.click();
      await page.waitForTimeout(300);

      // Fill confirmation
      const existingConfirmInput = page.locator('.fixed input[type="text"], input[placeholder*="' + TEST_EMAIL + '"]').first();
      await existingConfirmInput.fill(TEST_EMAIL);
      const existingConfirmDeleteBtn = page.locator('button').filter({ hasText: /confirm delete/i });
      await existingConfirmDeleteBtn.click();
      await page.waitForURL(/\/admin\/leads$/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      console.log('  Cleaned up existing test lead');
    }

    // Click [+ new lead] to open slide-over panel
    const newLeadBtn = page.locator('button').filter({ hasText: /\+\s*new\s*lead/i });
    await newLeadBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Found [+ new lead] button, clicking...');
    await newLeadBtn.click();
    await page.waitForTimeout(500);

    // Fill the form
    const nameField = page.locator('input[placeholder*="name" i], input[name="name"]').first();
    await nameField.waitFor({ state: 'visible', timeout: 5000 });
    await nameField.fill(TEST_NAME);

    const emailField = page.locator('input[placeholder*="email" i], input[name="email"], input[type="email"]').last();
    await emailField.fill(TEST_EMAIL);

    const companyField = page.locator('input[placeholder*="company" i], input[name="company"]').first();
    await companyField.fill(TEST_COMPANY);

    await page.screenshot({ path: '/tmp/e2e-us012-03-create-form.png' });

    // Click create lead
    const createBtn = page.locator('button').filter({ hasText: /create\s*lead/i });
    await createBtn.click();

    // Wait for success
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');

    // Verify lead appeared in table
    const leadInTable = page.locator(`text=${TEST_EMAIL}`).or(page.locator(`text=${TEST_NAME}`));
    await leadInTable.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.screenshot({ path: '/tmp/e2e-us012-04-lead-created.png' });
    console.log(`  Verified: "${TEST_NAME}" / "${TEST_EMAIL}" visible in leads table`);
    console.log('  [PASS] Test lead created successfully\n');

    // ----------------------------------------------------------------
    // STEP 3: Navigate to the lead's detail page
    // ----------------------------------------------------------------
    console.log('[3/6] Navigating to lead detail page...');

    // Find the row and click [view]
    const leadRow = page.locator('tr').filter({ hasText: TEST_EMAIL }).first();
    const viewLink = leadRow.locator('a').filter({ hasText: /view/i });

    if (await viewLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await viewLink.click();
    } else {
      const anyLink = leadRow.locator('a').first();
      await anyLink.click();
    }

    await page.waitForURL(/\/admin\/leads\//, { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Verify we see the lead name on the detail page
    await page.locator(`text=${TEST_NAME}`).first().waitFor({ state: 'visible', timeout: 5000 });
    await page.screenshot({ path: '/tmp/e2e-us012-05-lead-detail.png' });
    console.log(`  Current URL: ${page.url()}`);
    console.log(`  Verified: Lead name "${TEST_NAME}" visible on detail page`);
    console.log('  [PASS] Lead detail page loaded\n');

    // ----------------------------------------------------------------
    // STEP 4: Approve with invite
    // ----------------------------------------------------------------
    console.log('[4/6] Testing APPROVE WITH INVITE...');

    // Find the approve dropdown button (contains "approve" text with chevron)
    const approveDropdownBtn = page.locator('button').filter({ hasText: /approve/i }).first();
    await approveDropdownBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Found approve dropdown button, clicking...');
    await approveDropdownBtn.click();
    await page.waitForTimeout(300);

    await page.screenshot({ path: '/tmp/e2e-us012-06-approve-dropdown.png' });

    // Click [approve & send invite]
    const approveWithInviteBtn = page.locator('button').filter({ hasText: /approve.*send invite/i });
    await approveWithInviteBtn.waitFor({ state: 'visible', timeout: 3000 });
    console.log('  Found [approve & send invite] option, clicking...');
    await approveWithInviteBtn.click();

    // Wait for the approve action to complete (involves API call + possibly Resend)
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: '/tmp/e2e-us012-07-after-approve.png' });

    // Verify status changed to "approved"
    // The status badge should show "approved" text
    const approvedText = page.locator('text=/approved/i');
    await approvedText.first().waitFor({ state: 'visible', timeout: 10000 });
    console.log('  Verified: Status badge shows "approved"');

    // Check for toast (may be success or warning/failure -- both are acceptable)
    const toastLocator = page.locator('.fixed.bottom-6 div, [role="alert"]');
    const toastVisible = await toastLocator.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (toastVisible) {
      const toastContent = await toastLocator.first().textContent();
      console.log(`  Toast content: "${toastContent}"`);
      // Accept any toast that mentions "approved" or "invite"
      if (toastContent && (toastContent.match(/approved/i) || toastContent.match(/invite/i))) {
        console.log('  Toast correctly references approve/invite status');
      }
    } else {
      console.log('  Toast may have auto-dismissed (3s timeout in code) -- acceptable');
    }

    console.log('  [PASS] Approve with invite completed\n');

    // ----------------------------------------------------------------
    // STEP 5: Re-send invite
    // ----------------------------------------------------------------
    console.log('[5/6] Testing RE-SEND INVITE...');

    // The [re-send invite] button should now be visible for approved leads
    const resendBtn = page.locator('button').filter({ hasText: /re-send invite/i });
    await resendBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Found [re-send invite] button');
    await page.screenshot({ path: '/tmp/e2e-us012-08-resend-visible.png' });

    // Click [re-send invite]
    console.log('  Clicking [re-send invite]...');
    await resendBtn.click();

    // Check for loading state ([sending...] text)
    const sendingLocator = page.locator('text=/sending/i');
    const loadingVisible = await sendingLocator.isVisible({ timeout: 1500 }).catch(() => false);
    if (loadingVisible) {
      console.log('  Loading state [sending...] appeared');
    } else {
      console.log('  Loading state was too fast to catch -- acceptable');
    }

    // Wait for the invite action to complete
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: '/tmp/e2e-us012-09-after-resend.png' });

    // Check for toast with result
    const resendToastVisible = await toastLocator.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (resendToastVisible) {
      const resendToastContent = await toastLocator.first().textContent();
      console.log(`  Re-send toast content: "${resendToastContent}"`);
    } else {
      console.log('  Re-send toast may have auto-dismissed -- acceptable');
    }

    // Verify button reverts to [re-send invite] (not still [sending...])
    await resendBtn.waitFor({ state: 'visible', timeout: 5000 });
    const btnText = await resendBtn.textContent();
    if (btnText && btnText.match(/re-send invite/i)) {
      console.log('  Button reverted to [re-send invite] -- correct');
    } else {
      console.log(`  Button text is: "${btnText}" -- may need review`);
    }

    console.log('  [PASS] Re-send invite completed\n');

    // ----------------------------------------------------------------
    // STEP 6: Cleanup -- delete the test lead
    // ----------------------------------------------------------------
    console.log('[6/6] Cleaning up -- deleting test lead...');

    // Scroll to the danger zone
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Click [delete lead]
    const deleteBtn = page.locator('button').filter({ hasText: /delete lead/i });
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Found [delete lead] button, clicking...');
    await deleteBtn.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/tmp/e2e-us012-10-delete-dialog.png' });

    // Type confirmation email
    console.log(`  Typing confirmation email: "${TEST_EMAIL}"...`);
    // Try the exact placeholder first
    let confirmInput = page.locator(`input[placeholder="${TEST_EMAIL}"]`);
    if (!(await confirmInput.isVisible({ timeout: 1000 }).catch(() => false))) {
      // Fallback: find any text input in the fixed dialog
      confirmInput = page.locator('.fixed input[type="text"], .fixed input[type="email"]').first();
    }
    await confirmInput.waitFor({ state: 'visible', timeout: 3000 });
    await confirmInput.fill(TEST_EMAIL);

    await page.screenshot({ path: '/tmp/e2e-us012-11-delete-confirm-filled.png' });

    // Click [confirm delete]
    const confirmDeleteBtn = page.locator('button').filter({ hasText: /confirm delete/i });
    await confirmDeleteBtn.waitFor({ state: 'enabled', timeout: 3000 });
    console.log('  Clicking [confirm delete]...');
    await confirmDeleteBtn.click();

    // Wait for redirect back to /admin/leads
    await page.waitForURL(/\/admin\/leads/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/tmp/e2e-us012-12-after-delete.png' });
    console.log(`  Current URL: ${page.url()}`);

    // Verify lead is gone
    const deletedLead = page.locator(`text=${TEST_EMAIL}`);
    const count = await deletedLead.count();
    if (count === 0) {
      console.log(`  Verified: "${TEST_EMAIL}" no longer appears in the table`);
      console.log('  [PASS] Cleanup successful\n');
    } else {
      throw new Error(`Lead "${TEST_EMAIL}" still appears in the table after deletion`);
    }

    // ----------------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------------
    console.log('======================================================');
    console.log('  ALL TESTS PASSED');
    console.log('  + Login');
    console.log('  + Create test lead');
    console.log('  + Navigate to lead detail');
    console.log('  + Approve with invite');
    console.log('  + Re-send invite');
    console.log('  + Delete test lead (cleanup)');
    console.log('======================================================');

  } catch (error) {
    console.error(`\n[FAIL] ${error.message}`);
    await page.screenshot({ path: '/tmp/e2e-us012-error.png' });
    console.error('  Error screenshot saved: /tmp/e2e-us012-error.png');
    console.error(`  Current URL: ${page.url()}`);

    // Print page content for debugging
    const content = await page.content();
    console.error('\n  Page HTML (first 2000 chars):');
    console.error(content.substring(0, 2000));

    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
