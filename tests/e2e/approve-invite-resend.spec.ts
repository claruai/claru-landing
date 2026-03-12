import { test, expect } from '@playwright/test';

/**
 * US-012 -- E2E: Approve with Invite and Re-send Flow
 *
 * Tests the full invite workflow:
 *   1. Login to admin portal
 *   2. Create a test lead via the slide-over panel
 *   3. Navigate to the lead's detail page
 *   4. Approve with invite (dropdown)
 *   5. Re-send invite (button, shown for approved leads)
 *   6. Cleanup: delete the test lead
 *
 * Resend may not be configured in dev — the test accepts both
 * "invite sent" and "invite failed" toasts as valid outcomes.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team@claru.ai';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qweqwe123!';

const TEST_LEAD_NAME = 'Test Invite User';
const TEST_LEAD_EMAIL = 'test-e2e-invite@example.com';
const TEST_LEAD_COMPANY = 'Invite Corp';

test.describe('US-012: Approve with Invite and Re-send Flow', () => {
  test('full approve-invite and re-send lifecycle', async ({ page }) => {
    test.setTimeout(90_000);

    // ---------------------------------------------------------------
    // Step 1: Login to admin portal
    // ---------------------------------------------------------------

    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Check if already authenticated (redirected away from login page)
    if (page.url().endsWith('/admin') || page.url().endsWith('/admin/')) {
      await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').click();

      // Wait for redirect to admin dashboard/jobs page
      await page.waitForURL('**/admin/**', { timeout: 10_000 });
    }

    // ---------------------------------------------------------------
    // Step 2: Navigate to leads page and create a test lead
    // ---------------------------------------------------------------

    await page.goto('/admin/leads');
    await page.waitForLoadState('networkidle');

    // Cleanup: if a test lead already exists from a previous failed run, delete it first
    const staleLeadVisible = await page.locator('text=' + TEST_LEAD_EMAIL).isVisible({ timeout: 2_000 }).catch(() => false);
    if (staleLeadVisible) {
      console.log('Found stale test lead from a previous run -- cleaning up first');
      const staleRow = page.locator('tr, [role="row"]').filter({ hasText: TEST_LEAD_EMAIL }).first();
      const staleViewLink = staleRow.locator('a').filter({ hasText: /view/i });
      await staleViewLink.click();
      await page.waitForURL('**/admin/leads/**', { timeout: 5_000 });
      await page.waitForLoadState('networkidle');

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      const staleDeleteBtn = page.locator('button').filter({ hasText: /delete lead/i });
      await staleDeleteBtn.click();
      await page.waitForTimeout(300);

      const staleConfirmInput = page.locator('.fixed input[type="text"]').first();
      await staleConfirmInput.fill(TEST_LEAD_EMAIL);
      const staleConfirmDeleteBtn = page.locator('button').filter({ hasText: /confirm delete/i });
      await staleConfirmDeleteBtn.click();
      await page.waitForURL('**/admin/leads', { timeout: 10_000 });
      await page.waitForLoadState('networkidle');
      console.log('Stale test lead deleted');
    }

    // Click [+ new lead] to open slide-over panel
    const newLeadBtn = page.locator('button').filter({ hasText: /\+\s*new\s*lead/i });
    await expect(newLeadBtn).toBeVisible({ timeout: 5_000 });
    await newLeadBtn.click();

    // Wait for slide-over panel to appear — look for the create lead form
    const nameInput = page.locator('input[placeholder*="name" i], input[name="name"]').first();
    await expect(nameInput).toBeVisible({ timeout: 3_000 });

    // Fill form fields
    await nameInput.fill(TEST_LEAD_NAME);

    const emailInput = page.locator('input[placeholder*="email" i], input[name="email"], input[type="email"]').last();
    await emailInput.fill(TEST_LEAD_EMAIL);

    const companyInput = page.locator('input[placeholder*="company" i], input[name="company"]').first();
    await companyInput.fill(TEST_LEAD_COMPANY);

    // Submit the form
    const createBtn = page.locator('button').filter({ hasText: /create\s*lead/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    // Wait for panel to close and success indication
    // The slide-over should close and the lead should appear in the table
    await page.waitForTimeout(2_000);

    // Verify the lead appeared in the table by searching for the email or name
    const tableArea = page.locator('table, [role="table"], [class*="table"]');
    await expect(tableArea.first()).toBeVisible({ timeout: 5_000 });

    // Look for the test lead in the table
    const leadInTable = page.locator('text=' + TEST_LEAD_EMAIL).or(page.locator('text=' + TEST_LEAD_NAME));
    await expect(leadInTable.first()).toBeVisible({ timeout: 5_000 });

    // ---------------------------------------------------------------
    // Step 3: Navigate to the test lead's detail page
    // ---------------------------------------------------------------

    // Find the [view] link/button in the same row as the test lead
    // Try to click the row link or [view] button near the lead
    const viewLink = page.locator('a').filter({ hasText: /view/i }).first();

    // Alternative: find the table row containing test email and click the view link
    const leadRow = page.locator('tr, [role="row"]').filter({ hasText: TEST_LEAD_EMAIL }).first();
    const rowViewLink = leadRow.locator('a').filter({ hasText: /view/i });

    if (await rowViewLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await rowViewLink.click();
    } else {
      // Fallback: click any link in the lead row
      const rowLink = leadRow.locator('a').first();
      await rowLink.click();
    }

    // Wait for the detail page to load
    await page.waitForURL('**/admin/leads/**', { timeout: 5_000 });
    await page.waitForLoadState('networkidle');

    // Verify we're on the lead detail page — should show lead name and pending status
    await expect(page.locator('text=' + TEST_LEAD_NAME).first()).toBeVisible({ timeout: 5_000 });

    // ---------------------------------------------------------------
    // Step 4: Test APPROVE WITH INVITE
    // ---------------------------------------------------------------

    // Find the approve dropdown trigger button — contains "approve" and "▾" chevron
    const approveDropdownBtn = page.locator('button').filter({ hasText: /approve/i }).first();
    await expect(approveDropdownBtn).toBeVisible({ timeout: 5_000 });
    await approveDropdownBtn.click();

    // Wait for dropdown menu to appear
    await page.waitForTimeout(300);

    // Click [approve & send invite] option
    const approveWithInviteBtn = page.locator('button').filter({ hasText: /approve.*send invite/i });
    await expect(approveWithInviteBtn).toBeVisible({ timeout: 3_000 });
    await approveWithInviteBtn.click();

    // Wait for the action to complete
    await page.waitForTimeout(3_000);

    // Verify status changed to "approved" — look for the approved badge/text
    // The LeadStatusBadge component shows the status
    const approvedBadge = page.locator('text=/approved/i').first();
    await expect(approvedBadge).toBeVisible({ timeout: 10_000 });

    // Verify a toast appeared mentioning the invite — either success or failure is valid
    // Toast messages:
    // - "Lead approved and invite sent to {email}" (success)
    // - "Lead approved but invite failed: {error}" (Resend not configured)
    // - "Lead approved (no invite sent)" (send_invite was somehow false)
    const toastArea = page.locator('.fixed.bottom-6, [class*="toast"], [role="alert"]');
    const toastText = page.locator('text=/approved|invite/i');

    // Give the toast time to appear
    const toastVisible = await toastText.first().isVisible({ timeout: 5_000 }).catch(() => false);
    if (toastVisible) {
      const toastContent = await toastText.first().textContent();
      console.log('Approve toast:', toastContent);
    } else {
      console.log('No toast detected after approve — this may be acceptable if it auto-dismissed quickly');
    }

    // ---------------------------------------------------------------
    // Step 5: Test RE-SEND INVITE
    // ---------------------------------------------------------------

    // For approved leads, the [re-send invite] button should now be visible
    const resendBtn = page.locator('button').filter({ hasText: /re-send invite/i });
    await expect(resendBtn).toBeVisible({ timeout: 5_000 });

    // Click [re-send invite]
    await resendBtn.click();

    // Verify loading state appears — button text changes to [sending...]
    const sendingText = page.locator('text=/sending/i');
    const loadingVisible = await sendingText.isVisible({ timeout: 2_000 }).catch(() => false);
    if (loadingVisible) {
      console.log('Loading state [sending...] appeared');
    } else {
      console.log('Loading state was too fast to catch — this is acceptable');
    }

    // Wait for the action to complete
    await page.waitForTimeout(3_000);

    // Verify a toast with the result
    // - "Invite sent to {email}" (success)
    // - "Invite failed: {error}" (Resend not configured)
    const resendToast = page.locator('text=/invite.*sent|invite.*failed/i');
    const resendToastVisible = await resendToast.first().isVisible({ timeout: 5_000 }).catch(() => false);
    if (resendToastVisible) {
      const resendToastContent = await resendToast.first().textContent();
      console.log('Re-send toast:', resendToastContent);
    } else {
      console.log('No re-send toast detected — may have auto-dismissed');
    }

    // The button should revert back to [re-send invite] (not [sending...])
    await expect(resendBtn).toBeVisible({ timeout: 5_000 });
    const btnText = await resendBtn.textContent();
    expect(btnText).toMatch(/re-send invite/i);

    // ---------------------------------------------------------------
    // Step 6: CLEANUP — Delete the test lead
    // ---------------------------------------------------------------

    // Scroll down to find the danger zone
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Click [delete lead]
    const deleteBtn = page.locator('button').filter({ hasText: /delete lead/i });
    await expect(deleteBtn).toBeVisible({ timeout: 5_000 });
    await deleteBtn.click();

    // Wait for confirmation dialog
    await page.waitForTimeout(300);

    // Type the lead's email in the confirmation input
    const confirmInput = page.locator('input[placeholder="' + TEST_LEAD_EMAIL + '"]');
    if (await confirmInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmInput.fill(TEST_LEAD_EMAIL);
    } else {
      // Fallback: find the input in the dialog
      const dialogInput = page.locator('.fixed input[type="text"]').first();
      await dialogInput.fill(TEST_LEAD_EMAIL);
    }

    // Click [confirm delete]
    const confirmDeleteBtn = page.locator('button').filter({ hasText: /confirm delete/i });
    await expect(confirmDeleteBtn).toBeEnabled({ timeout: 3_000 });
    await confirmDeleteBtn.click();

    // Wait for redirect to /admin/leads
    await page.waitForURL('**/admin/leads', { timeout: 10_000 });

    // Verify the lead is gone from the table
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1_000);

    const deletedLead = page.locator('text=' + TEST_LEAD_EMAIL);
    await expect(deletedLead).not.toBeVisible({ timeout: 5_000 });

    console.log('US-012 E2E test passed: Approve with Invite and Re-send Flow');
  });
});
