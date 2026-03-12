import { test, expect, type Page } from '@playwright/test';

/**
 * US-011: E2E Playwright test for admin lead CRUD lifecycle.
 *
 * Tests the full create -> edit -> delete flow for a lead in the admin portal.
 * Dev server: localhost:3001, admin credentials: team@claru.ai / qweqwe123!
 *
 * Uses test.serial to enforce execution order since each step depends on the
 * previous one (edit needs the created lead, delete needs the edited lead).
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team@claru.ai';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qweqwe123!';

const TEST_LEAD = {
  name: 'Test E2E User',
  email: 'test-e2e-crud@example.com',
  company: 'Test Corp',
  updatedCompany: 'Updated Corp',
};

/**
 * Helper: Log in to the admin portal.
 * Navigates to /admin, fills email + password, submits, and waits for redirect.
 */
async function adminLogin(page: Page) {
  await page.goto('/admin');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  // Wait for redirect to dashboard (successful login)
  await page.waitForURL('**/admin/dashboard', { timeout: 10_000 });
}

/**
 * Helper: Navigate to /admin/leads and ensure the page has loaded.
 */
async function goToLeads(page: Page) {
  await page.goto('/admin/leads');
  // Wait for the table to appear (indicates leads data has loaded)
  await expect(page.locator('table')).toBeVisible({ timeout: 15_000 });
}

/**
 * Helper: Clean up the test lead if it exists (best-effort).
 * Searches for the test email in the leads table, clicks view, and deletes.
 */
async function cleanupTestLead(page: Page) {
  await goToLeads(page);

  // Search for the test lead
  const searchInput = page.locator('input[placeholder*="search" i]');
  await searchInput.fill(TEST_LEAD.email);
  await page.waitForTimeout(500);

  // Check if the lead exists in the table
  const viewLink = page.locator('a').filter({ hasText: '[view]' }).first();
  if (await viewLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await viewLink.click();
    await page.waitForURL('**/admin/leads/**', { timeout: 5_000 });

    // Click delete
    const deleteBtn = page.locator('button, a').filter({ hasText: '[delete lead]' }).first();
    if (await deleteBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await deleteBtn.click();

      // Type confirm email
      const confirmInput = page.locator('input[placeholder]').last();
      await confirmInput.fill(TEST_LEAD.email);

      // Click confirm delete
      const confirmDeleteBtn = page.locator('button').filter({ hasText: '[confirm delete]' });
      await confirmDeleteBtn.click();

      // Wait for redirect
      await page.waitForURL('**/admin/leads', { timeout: 10_000 });
    }
  }
}

test.describe.serial('Lead CRUD Lifecycle (US-011)', () => {
  // Track the created lead's detail URL for subsequent tests
  let leadDetailUrl: string;

  test.beforeAll(async ({ browser }) => {
    // Clean up any leftover test lead from a previous failed run
    const page = await browser.newPage();
    await adminLogin(page);
    await cleanupTestLead(page);
    await page.close();
  });

  test('Step 1: Create a new lead via slide-over panel', async ({ page }) => {
    // -- Authenticate --
    await adminLogin(page);

    // -- Navigate to leads --
    await goToLeads(page);

    // -- Click [+ new lead] --
    const newLeadBtn = page.locator('button').filter({ hasText: '[+ new lead]' });
    await expect(newLeadBtn).toBeVisible();
    await newLeadBtn.click();

    // -- Verify slide-over panel opens --
    // Panel has heading "New Lead"
    await expect(page.locator('h3').filter({ hasText: 'New Lead' })).toBeVisible({ timeout: 3_000 });

    // -- Test validation: submit empty form --
    const createBtn = page.locator('button').filter({ hasText: '[create lead]' });
    await createBtn.click();
    // Should show validation error(s) for required name and email
    await expect(page.locator('text=Name is required').or(page.locator('text=Email is required'))).toBeVisible({ timeout: 2_000 });

    // -- Fill in form fields --
    // Name field (first text input in the panel)
    const nameInput = page.locator('.fixed input[type="text"]').first();
    await nameInput.fill(TEST_LEAD.name);

    // Email field
    const emailInput = page.locator('.fixed input[type="email"]');
    await emailInput.fill(TEST_LEAD.email);

    // Company field (second text input)
    const companyInput = page.locator('.fixed input[type="text"]').nth(1);
    await companyInput.fill(TEST_LEAD.company);

    // -- Submit --
    await createBtn.click();

    // -- Verify success --
    // The panel closes and an alert("Lead created successfully") appears.
    // Playwright auto-dismisses dialogs, but we can listen for it.
    page.once('dialog', (dialog) => dialog.accept());

    // Wait for the panel to close (the fixed element should disappear)
    await expect(page.locator('h3').filter({ hasText: 'New Lead' })).not.toBeVisible({ timeout: 10_000 });

    // -- Verify the lead appears in the table --
    // The page is refreshed (router.refresh), so wait for table to reload
    await page.waitForTimeout(2_000);
    await page.reload(); // Ensure fresh server data
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });

    // Search for our new lead
    const searchInput = page.locator('input[placeholder*="search" i]');
    await searchInput.fill(TEST_LEAD.name);
    await page.waitForTimeout(500);

    // Verify the lead row exists
    await expect(page.locator('td').filter({ hasText: TEST_LEAD.name })).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('td').filter({ hasText: TEST_LEAD.email })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: TEST_LEAD.company })).toBeVisible();

    // Store the view link URL for the next test
    const viewLink = page.locator('a').filter({ hasText: '[view]' }).first();
    await expect(viewLink).toBeVisible();
    leadDetailUrl = await viewLink.getAttribute('href') ?? '';
    expect(leadDetailUrl).toContain('/admin/leads/');
  });

  test('Step 2: Edit the lead (change company name)', async ({ page }) => {
    // -- Authenticate --
    await adminLogin(page);

    // -- Navigate to the lead detail page --
    expect(leadDetailUrl).toBeTruthy();
    await page.goto(leadDetailUrl);

    // Wait for detail page to load (look for the lead name heading)
    await expect(page.locator('h2').filter({ hasText: TEST_LEAD.name })).toBeVisible({ timeout: 10_000 });

    // -- Verify current company value --
    await expect(page.locator('dd').filter({ hasText: TEST_LEAD.company })).toBeVisible();

    // -- Click [edit] --
    const editBtn = page.locator('button').filter({ hasText: '[edit]' });
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // -- Verify fields become editable inputs --
    // When editing, the InfoField components are replaced by EditField (input) components.
    // The Company field should now be an input.
    // Look for inputs with current values
    await expect(page.locator('[save]').or(page.locator('button').filter({ hasText: '[save]' }))).toBeVisible({ timeout: 3_000 });

    // Find the Company input field (the EditField component renders an input with placeholder "Company")
    const companyInput = page.locator('input[placeholder="Company"]');
    await expect(companyInput).toBeVisible();
    expect(await companyInput.inputValue()).toBe(TEST_LEAD.company);

    // -- Change company to "Updated Corp" --
    await companyInput.clear();
    await companyInput.fill(TEST_LEAD.updatedCompany);

    // -- Click [save] --
    const saveBtn = page.locator('button').filter({ hasText: '[save]' });
    await saveBtn.click();

    // -- Verify success toast --
    await expect(page.locator('text=Lead updated')).toBeVisible({ timeout: 5_000 });

    // -- Verify the company now shows "Updated Corp" --
    // After saving, editing mode is exited and the InfoField shows the new value
    await expect(page.locator('dd').filter({ hasText: TEST_LEAD.updatedCompany })).toBeVisible({ timeout: 5_000 });

    // Confirm the old value is gone
    await expect(page.locator('dd').filter({ hasText: TEST_LEAD.company })).not.toBeVisible();
  });

  test('Step 3: Delete the lead', async ({ page }) => {
    // -- Authenticate --
    await adminLogin(page);

    // -- Navigate to the lead detail page --
    expect(leadDetailUrl).toBeTruthy();
    await page.goto(leadDetailUrl);

    // Wait for the detail page to load
    await expect(page.locator('h2').filter({ hasText: TEST_LEAD.name })).toBeVisible({ timeout: 10_000 });

    // -- Click [delete lead] --
    const deleteBtn = page.locator('button').filter({ hasText: '[delete lead]' });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // -- Verify confirmation dialog appears --
    await expect(page.locator('text=This will permanently remove')).toBeVisible({ timeout: 3_000 });

    // -- Type the email in the confirmation input --
    const confirmInput = page.locator('.fixed input[type="text"]');
    await expect(confirmInput).toBeVisible();
    await confirmInput.fill(TEST_LEAD.email);

    // -- Click [confirm delete] --
    const confirmDeleteBtn = page.locator('button').filter({ hasText: '[confirm delete]' });
    // Button should now be enabled (email matches)
    await expect(confirmDeleteBtn).toBeEnabled();
    await confirmDeleteBtn.click();

    // -- Verify redirect back to /admin/leads --
    await page.waitForURL('**/admin/leads', { timeout: 10_000 });

    // -- Verify the test lead is no longer in the table --
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });

    // Search for the deleted lead
    const searchInput = page.locator('input[placeholder*="search" i]');
    await searchInput.fill(TEST_LEAD.email);
    await page.waitForTimeout(500);

    // The lead should not be present. Either the table shows "no leads matching query"
    // or the email does not appear in any row.
    const leadRow = page.locator('td').filter({ hasText: TEST_LEAD.email });
    await expect(leadRow).not.toBeVisible({ timeout: 5_000 });
  });
});
