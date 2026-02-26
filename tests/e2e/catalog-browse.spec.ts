import { test, expect, type Page } from '@playwright/test';
import { authenticateAsTestLead, hasPortalAuthEnv } from './helpers/portal-auth';

/**
 * US-023 -- Catalog Browse and Filter Flow
 *
 * End-to-end tests verifying catalog browse, category filtering,
 * tag filtering, and search on /portal/catalog. Requires a valid
 * Supabase session (programmatic magic link via service role key).
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - PORTAL_TEST_EMAIL (defaults to john+client@claru.ai)
 */

test.describe('Catalog Browse and Filter Flow (US-023)', () => {
  const canAuth = hasPortalAuthEnv();

  test.skip(!canAuth, 'Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');

  // ---------------------------------------------------------------------------
  // Auth setup: authenticate once and reuse state across tests in this describe
  // ---------------------------------------------------------------------------

  test.beforeEach(async ({ page, baseURL }) => {
    await authenticateAsTestLead(page, baseURL ?? 'http://localhost:3000');
    await page.goto('/portal/catalog');
    await page.waitForLoadState('networkidle');
  });

  // ---------------------------------------------------------------------------
  // AC-3: Verify dataset cards render on the page
  // ---------------------------------------------------------------------------

  test('dataset cards render on the page', async ({ page }) => {
    const cards = page.locator('[data-testid="dataset-card"]');
    const count = await cards.count();

    // The test lead should have access to at least one dataset
    expect(count).toBeGreaterThan(0);

    // Verify each card has a visible name heading
    const firstCard = cards.first();
    await expect(firstCard.locator('h3')).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // AC-10: Verify metadata completeness badges visible on cards
  // ---------------------------------------------------------------------------

  test('metadata completeness badges are visible on dataset cards', async ({ page }) => {
    const badges = page.locator('[data-testid="completeness-badge"]');
    const count = await badges.count();

    expect(count).toBeGreaterThan(0);

    // Each badge should contain a percentage value
    const firstBadge = badges.first();
    const badgeText = await firstBadge.textContent();
    expect(badgeText).toMatch(/\d+%/);
  });

  // ---------------------------------------------------------------------------
  // AC-4: Click a category filter pill — verify filtered results change
  // ---------------------------------------------------------------------------

  test('clicking a category filter pill filters the results', async ({ page }) => {
    const allCards = page.locator('[data-testid="dataset-card"]');
    const totalCount = await allCards.count();

    if (totalCount === 0) {
      test.skip(true, 'No datasets available for this lead');
      return;
    }

    // Find category filter buttons (excluding the "All" button)
    const categoryButtons = page.locator('[data-testid="category-filters"] button').filter({
      hasNot: page.locator('[data-testid="category-all"]'),
    });
    const categoryButtonCount = await categoryButtons.count();

    if (categoryButtonCount === 0) {
      test.skip(true, 'No category filters available');
      return;
    }

    // Click the first category pill
    const firstCategoryButton = categoryButtons.first();
    const categoryName = await firstCategoryButton.textContent();
    await firstCategoryButton.click();

    // Wait for filtering to take effect
    await page.waitForTimeout(300);

    // Filtered count should be different from total (or equal if all are in one category)
    const filteredCards = page.locator('[data-testid="dataset-card"]');
    const filteredCount = await filteredCards.count();

    // All visible cards should have the selected category badge
    if (filteredCount > 0 && categoryName) {
      for (let i = 0; i < Math.min(filteredCount, 5); i++) {
        const card = filteredCards.nth(i);
        const cardText = await card.textContent();
        expect(cardText).toContain(categoryName.trim());
      }
    }
  });

  // ---------------------------------------------------------------------------
  // AC-5: Select a tag filter — verify AND filtering with category
  // ---------------------------------------------------------------------------

  test('selecting a tag filter applies AND filtering with category', async ({ page }) => {
    const tagFilters = page.locator('[data-testid="tag-filters"] button');
    const tagCount = await tagFilters.count();

    if (tagCount === 0) {
      test.skip(true, 'No tag filters available (datasets have no annotation_types)');
      return;
    }

    // Record initial card count
    const allCards = page.locator('[data-testid="dataset-card"]');
    const initialCount = await allCards.count();

    if (initialCount === 0) {
      test.skip(true, 'No datasets available');
      return;
    }

    // Click a tag pill
    const firstTag = tagFilters.first();
    await firstTag.click();

    // Wait for filtering
    await page.waitForTimeout(300);

    // Filtered count should be <= initial count (AND filtering narrows results)
    const afterTagCount = await allCards.count();
    expect(afterTagCount).toBeLessThanOrEqual(initialCount);

    // Now also click a category filter if available
    const categoryButtons = page
      .locator('[data-testid="category-filters"] button')
      .filter({ hasNot: page.locator('[data-testid="category-all"]') });

    if ((await categoryButtons.count()) > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(300);

      const afterBothCount = await allCards.count();
      // AND filtering: combining category + tag should be <= tag-only count
      expect(afterBothCount).toBeLessThanOrEqual(afterTagCount);
    }
  });

  // ---------------------------------------------------------------------------
  // AC-6: Type in search box — verify results filter by query
  // ---------------------------------------------------------------------------

  test('typing in search box filters results by query', async ({ page }) => {
    const allCards = page.locator('[data-testid="dataset-card"]');
    const initialCount = await allCards.count();

    if (initialCount === 0) {
      test.skip(true, 'No datasets available');
      return;
    }

    // Get the name of the first dataset to use as a search term
    const firstCardName = await allCards.first().locator('h3').textContent();
    if (!firstCardName) {
      test.skip(true, 'Could not read first card name');
      return;
    }

    // Use a portion of the first card's name as the search query
    const searchTerm = firstCardName.trim().split(' ')[0];

    const searchInput = page.locator('[data-testid="catalog-search"]');
    await searchInput.fill(searchTerm);

    // Wait for debounce/filtering
    await page.waitForTimeout(300);

    // At least one card should remain visible
    const filteredCards = page.locator('[data-testid="dataset-card"]');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThan(0);

    // All visible cards should contain the search term in their text content
    for (let i = 0; i < Math.min(filteredCount, 5); i++) {
      const cardText = await filteredCards.nth(i).textContent();
      expect(cardText?.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  // ---------------------------------------------------------------------------
  // AC-7: Clear all filters — verify full list restores
  // ---------------------------------------------------------------------------

  test('clearing all filters restores the full dataset list', async ({ page }) => {
    const allCards = page.locator('[data-testid="dataset-card"]');
    const initialCount = await allCards.count();

    if (initialCount === 0) {
      test.skip(true, 'No datasets available');
      return;
    }

    // Apply a search filter to narrow results
    const searchInput = page.locator('[data-testid="catalog-search"]');
    await searchInput.fill('xyznonexistent');
    await page.waitForTimeout(300);

    // Should show zero or fewer results
    const narrowedCount = await allCards.count();
    expect(narrowedCount).toBeLessThan(initialCount);

    // Clear the search
    await searchInput.clear();
    await page.waitForTimeout(300);

    // If there is a "Clear all filters" button visible, click it too
    const clearButton = page.locator('[data-testid="clear-all-filters"]');
    if ((await clearButton.count()) > 0) {
      await clearButton.click();
      await page.waitForTimeout(300);
    }

    // Full list should be restored
    const restoredCount = await allCards.count();
    expect(restoredCount).toBe(initialCount);
  });

  // ---------------------------------------------------------------------------
  // AC-8: Verify URL query params update with each filter change
  // ---------------------------------------------------------------------------

  test('URL query params update with each filter change', async ({ page }) => {
    // Initially, URL should not have query params (or be just /portal/catalog)
    expect(page.url()).toContain('/portal/catalog');

    // Apply search
    const searchInput = page.locator('[data-testid="catalog-search"]');
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // URL should now contain q=test
    expect(page.url()).toContain('q=test');

    // Apply category filter if available
    const categoryButtons = page
      .locator('[data-testid="category-filters"] button')
      .filter({ hasNot: page.locator('[data-testid="category-all"]') });

    if ((await categoryButtons.count()) > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(500);

      // URL should contain both q and category params
      expect(page.url()).toContain('q=test');
      expect(page.url()).toContain('category=');
    }

    // Apply tag filter if available
    const tagButtons = page.locator('[data-testid="tag-filters"] button');
    if ((await tagButtons.count()) > 0) {
      await tagButtons.first().click();
      await page.waitForTimeout(500);

      // URL should contain tags param
      expect(page.url()).toContain('tags=');
    }

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // q param should be removed from URL
    expect(page.url()).not.toContain('q=test');
  });

  // ---------------------------------------------------------------------------
  // AC-9: Refresh page — verify filters persist from URL params
  // ---------------------------------------------------------------------------

  test('filters persist from URL params after page refresh', async ({ page }) => {
    const allCards = page.locator('[data-testid="dataset-card"]');
    const initialCount = await allCards.count();

    if (initialCount === 0) {
      test.skip(true, 'No datasets available');
      return;
    }

    // Get the name of the first card for a targeted search
    const firstCardName = await allCards.first().locator('h3').textContent();
    const searchTerm = firstCardName?.trim().split(' ')[0] ?? '';

    if (!searchTerm) {
      test.skip(true, 'Could not determine a search term');
      return;
    }

    // Apply search
    const searchInput = page.locator('[data-testid="catalog-search"]');
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(500);

    // Record the filtered count and URL
    const filteredCount = await allCards.count();
    const filteredUrl = page.url();
    expect(filteredUrl).toContain(`q=${encodeURIComponent(searchTerm)}`);

    // Refresh the page
    await page.reload({ waitUntil: 'networkidle' });

    // Search input should still contain the search term
    const searchInputAfterReload = page.locator('[data-testid="catalog-search"]');
    await expect(searchInputAfterReload).toHaveValue(searchTerm);

    // Same number of filtered results should be displayed
    const countAfterReload = await allCards.count();
    expect(countAfterReload).toBe(filteredCount);
  });

  // ---------------------------------------------------------------------------
  // Combined flow: category + tag + search, then clear all
  // ---------------------------------------------------------------------------

  test('combined filter flow: category, tag, search, and clear all', async ({ page }) => {
    const allCards = page.locator('[data-testid="dataset-card"]');
    const initialCount = await allCards.count();

    if (initialCount === 0) {
      test.skip(true, 'No datasets available');
      return;
    }

    // Step 1: Apply a category filter
    const categoryButtons = page
      .locator('[data-testid="category-filters"] button')
      .filter({ hasNot: page.locator('[data-testid="category-all"]') });

    if ((await categoryButtons.count()) > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(300);
    }

    const afterCategoryCount = await allCards.count();

    // Step 2: Apply a tag filter
    const tagButtons = page.locator('[data-testid="tag-filters"] button');
    if ((await tagButtons.count()) > 0) {
      await tagButtons.first().click();
      await page.waitForTimeout(300);
    }

    const afterTagCount = await allCards.count();
    expect(afterTagCount).toBeLessThanOrEqual(afterCategoryCount);

    // Step 3: Apply a search
    const searchInput = page.locator('[data-testid="catalog-search"]');
    await searchInput.fill('a');
    await page.waitForTimeout(300);

    // Step 4: Clear all filters
    const clearButton = page.locator('[data-testid="clear-all-filters"]');
    if ((await clearButton.count()) > 0) {
      await clearButton.click();
      await page.waitForTimeout(300);
    } else {
      // Manually clear if no button (e.g., results match)
      await searchInput.clear();
      await page.locator('[data-testid="category-all"]').click();
      // Deselect tags by clicking them again
      const activeTags = page.locator(
        '[data-testid="tag-filters"] button[class*="accent-primary"]',
      );
      for (let i = 0; i < (await activeTags.count()); i++) {
        await activeTags.nth(i).click();
      }
      await page.waitForTimeout(300);
    }

    // Full list should be restored
    const restoredCount = await allCards.count();
    expect(restoredCount).toBe(initialCount);

    // URL should be clean
    const url = new URL(page.url());
    expect(url.searchParams.has('q')).toBe(false);
    expect(url.searchParams.has('category')).toBe(false);
    expect(url.searchParams.has('tags')).toBe(false);
  });
});
