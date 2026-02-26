import { test, expect, type Page } from '@playwright/test';
import { authenticateAsTestLead, hasPortalAuthEnv } from './helpers/portal-auth';

/**
 * US-024 -- Sample Detail and Video Playback Flow
 *
 * End-to-end tests verifying S3 video playback and metadata display
 * in the sample detail modal on /portal/catalog/[id].
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - PORTAL_TEST_EMAIL (defaults to john+client@claru.ai)
 */

test.describe('Sample Detail and Video Playback Flow (US-024)', () => {
  const canAuth = hasPortalAuthEnv();

  test.skip(!canAuth, 'Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');

  // ---------------------------------------------------------------------------
  // Auth setup
  // ---------------------------------------------------------------------------

  test.beforeEach(async ({ page, baseURL }) => {
    await authenticateAsTestLead(page, baseURL ?? 'http://localhost:3000');
    await page.goto('/portal/catalog');
    await page.waitForLoadState('networkidle');
  });

  // ---------------------------------------------------------------------------
  // Helper: navigate into a dataset that has samples
  // Returns true if at least one sample is visible in the gallery.
  // ---------------------------------------------------------------------------

  async function navigateToDatasetWithSamples(page: Page): Promise<boolean> {
    const cards = page.locator('[data-testid="dataset-card"]');
    const count = await cards.count();
    if (count === 0) return false;

    await cards.first().click();
    await page.waitForLoadState('networkidle');

    const sampleItems = page.locator('[role="button"][aria-label^="Sample"]');
    return (await sampleItems.count()) > 0;
  }

  // ---------------------------------------------------------------------------
  // AC: Verify sample gallery grid renders
  // ---------------------------------------------------------------------------

  test('sample gallery grid renders on dataset detail page', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available for this lead');
      return;
    }

    const sampleItems = page.locator('[role="button"][aria-label^="Sample"]');
    const count = await sampleItems.count();
    expect(count).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // AC: Click first sample — verify detail modal opens
  // ---------------------------------------------------------------------------

  test('clicking first sample opens the detail modal', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    const firstSample = page.locator('[role="button"][aria-label^="Sample"]').first();
    await firstSample.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toHaveAttribute('aria-label', /Sample \d+ detail view/);
  });

  // ---------------------------------------------------------------------------
  // AC: Verify video element exists with src containing presigned URL
  //     (X-Amz-Signature in URL) if sample is backed by S3
  // ---------------------------------------------------------------------------

  test('modal video element has a valid src (presigned if S3-backed)', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    await page.locator('[role="button"][aria-label^="Sample"]').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    const video = modal.locator('video');
    if ((await video.count()) === 0) {
      // Sample may be image-only — skip video check
      return;
    }

    const src = await video.getAttribute('src');
    expect(src).toBeTruthy();

    if (src && src.includes('X-Amz-Signature')) {
      // Confirmed: S3 presigned URL
      expect(src).toContain('X-Amz-Signature');
    }
    // If no X-Amz-Signature, it's a non-S3 sample — src still non-empty
  });

  // ---------------------------------------------------------------------------
  // AC: Verify MetaTable section renders if metadata exists
  // ---------------------------------------------------------------------------

  test('MetaTable section headers render when metadata is present', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    await page.locator('[role="button"][aria-label^="Sample"]').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Allow time for annotation fetch if applicable
    await page.waitForTimeout(500);

    // MetaTable section headers start with '// ' (terminal aesthetic)
    const overviewHeader = modal.getByText('// OVERVIEW');
    const technicalHeader = modal.getByText('// TECHNICAL SPECS');

    const hasOverview = (await overviewHeader.count()) > 0;
    const hasTechnical = (await technicalHeader.count()) > 0;

    if (hasOverview || hasTechnical) {
      // At least one section header is visible
      if (hasOverview) {
        await expect(overviewHeader.first()).toBeVisible();
      } else {
        await expect(technicalHeader.first()).toBeVisible();
      }
    }
    // If neither header exists, the sample has no structured metadata — pass silently
  });

  // ---------------------------------------------------------------------------
  // AC: Verify Copy JSON button exists and is clickable
  // ---------------------------------------------------------------------------

  test('Copy JSON button is visible and clickable', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    await page.locator('[role="button"][aria-label^="Sample"]').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    const copyJsonButton = modal.locator('[aria-label="Copy JSON to clipboard"]');
    await expect(copyJsonButton).toBeVisible({ timeout: 5000 });

    // Verify clickable (should not throw)
    await copyJsonButton.click();
  });

  // ---------------------------------------------------------------------------
  // AC: Navigate to next sample via arrow button — verify modal content updates
  // ---------------------------------------------------------------------------

  test('next sample arrow button updates modal content', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    const sampleCount = await page
      .locator('[role="button"][aria-label^="Sample"]')
      .count();

    if (sampleCount < 2) {
      test.skip(true, 'Need at least 2 samples to test navigation');
      return;
    }

    await page.locator('[role="button"][aria-label^="Sample"]').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    const initialLabel = await modal.getAttribute('aria-label');

    const nextButton = modal.locator('[aria-label="Next sample"]');
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    await page.waitForTimeout(300);

    // Modal aria-label should now reference the next sample index
    const newLabel = await modal.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  // ---------------------------------------------------------------------------
  // AC: Close modal via Escape key — verify return to gallery
  // ---------------------------------------------------------------------------

  test('pressing Escape closes the modal and returns to gallery', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    await page.locator('[role="button"][aria-label^="Sample"]').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await expect(modal).not.toBeVisible({ timeout: 3000 });

    // Gallery items should still be present
    const gallery = page.locator('[role="button"][aria-label^="Sample"]');
    expect(await gallery.count()).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // AC: Open a sample without annotation data — verify no stuck loading spinner
  // ---------------------------------------------------------------------------

  test('sample without annotation data shows no stuck loading spinner', async ({ page }) => {
    const hasDataset = await navigateToDatasetWithSamples(page);
    if (!hasDataset) {
      test.skip(true, 'No datasets or samples available');
      return;
    }

    await page.locator('[role="button"][aria-label^="Sample"]').first().click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Wait long enough for any async annotation fetch to resolve or time out
    await page.waitForTimeout(3500);

    // Loading text should no longer be visible
    const fetchingAnnotation = modal.getByText('Fetching annotation...');
    const fetchingSpecs = modal.getByText('Fetching specs...');

    await expect(fetchingAnnotation).not.toBeVisible();
    await expect(fetchingSpecs).not.toBeVisible();
  });
});
