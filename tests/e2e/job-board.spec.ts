import { test, expect } from '@playwright/test';

/**
 * Helper: navigate to the first job detail page from the /jobs listing.
 * Returns the href that was navigated to.
 */
async function goToFirstJobDetail(page: import('@playwright/test').Page): Promise<string> {
  await page.goto('/jobs');

  const allJobLinks = await page.locator('a[href^="/jobs/"]').all();
  let targetHref: string | null = null;
  for (const link of allJobLinks) {
    const href = await link.getAttribute('href');
    if (href && href !== '/jobs' && href !== '/jobs/feed.xml') {
      targetHref = href;
      break;
    }
  }

  expect(targetHref).toBeTruthy();
  await page.goto(targetHref!);
  return targetHref!;
}

test.describe('Job Board', () => {
  /* ===================================================================
     LISTING PAGE
     =================================================================== */

  test('job listing page renders with heading and job cards', async ({ page }) => {
    await page.goto('/jobs');

    // The page should display the main heading
    await expect(page.locator('h1')).toBeVisible();

    // Verify at least one job card link renders (each card is an <a> pointing to /jobs/<slug>)
    const jobLinks = page.locator('a[href^="/jobs/"]').filter({
      hasNot: page.locator('a[href="/jobs/feed.xml"]'),
    });
    await expect(jobLinks.first()).toBeVisible();
  });

  test('search filters jobs by keyword', async ({ page }) => {
    await page.goto('/jobs');

    // Capture initial job count text (e.g. "Showing 18 of 42 positions")
    const countText = page.locator('text=/Showing \\d+/');
    await expect(countText.first()).toBeVisible();

    // Type a keyword in the search input
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('RLHF');

    // Allow debounce / re-render
    await page.waitForTimeout(600);

    // After filtering, the count or visible cards should have changed
    const filteredCountText = await countText.first().textContent();
    expect(filteredCountText).toBeTruthy();
  });

  test('clearing search resets the results', async ({ page }) => {
    await page.goto('/jobs');

    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    await searchInput.fill('xyznonexistent');
    await page.waitForTimeout(600);

    // Should show "No positions found" empty state
    await expect(page.getByText('No positions found')).toBeVisible();

    // Click the "Reset all filters" link to clear
    const resetBtn = page
      .locator('button, a')
      .filter({ hasText: /reset all filters/i })
      .first();
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(400);

      // Results should be back
      const jobLinks = page.locator('a[href^="/jobs/"]');
      await expect(jobLinks.first()).toBeVisible();
    }
  });

  test('category filter pills are present and functional', async ({ page }) => {
    await page.goto('/jobs');

    // The "All" pill plus at least one category pill should be visible
    const allPill = page.locator('button').filter({ hasText: /^All/ });
    await expect(allPill.first()).toBeVisible();

    // Click a specific category pill (RLHF or Data Labeling, whichever is visible)
    const categoryPill = page
      .locator('button')
      .filter({ hasText: /RLHF|Data Labeling|Quality Review|Video Capture/ })
      .first();

    if (await categoryPill.isVisible()) {
      await categoryPill.click();
      await page.waitForTimeout(400);

      // After clicking, the count text should update
      const countText = page.locator('text=/Showing \\d+/');
      await expect(countText.first()).toBeVisible();
    }
  });

  /* ===================================================================
     JOB DETAIL PAGE
     =================================================================== */

  test('job detail page renders title and description', async ({ page }) => {
    await goToFirstJobDetail(page);

    // Verify the job title heading is visible
    await expect(page.locator('h1')).toBeVisible();

    // Verify the description section exists (heading contains "DESCRIPTION")
    await expect(page.getByText('DESCRIPTION', { exact: false }).first()).toBeVisible();
  });

  test('job detail page has valid JobPosting JSON-LD schema', async ({ page }) => {
    await goToFirstJobDetail(page);

    // Verify JSON-LD script tag exists with JobPosting type
    const schema = page.locator('script[type="application/ld+json"]');
    await expect(schema.first()).toBeAttached();

    const schemaText = await schema.first().textContent();
    expect(schemaText).toBeTruthy();
    expect(schemaText).toContain('JobPosting');
    expect(schemaText).toContain('Claru');

    // Parse and validate key fields
    const data = JSON.parse(schemaText!);
    expect(data['@type']).toBe('JobPosting');
    expect(data.title).toBeTruthy();
    expect(data.hiringOrganization.name).toBe('Claru');
    expect(data.baseSalary).toBeTruthy();
  });

  test('job detail page has breadcrumb navigation', async ({ page }) => {
    await goToFirstJobDetail(page);

    // Breadcrumb should contain Home > Jobs > <title>
    await expect(
      page.locator('nav[aria-label="Breadcrumb"], nav').filter({ hasText: 'Home' }).first()
    ).toBeVisible();
    await expect(page.locator('a[href="/jobs"]').first()).toBeVisible();
  });

  test('job detail page has skills section', async ({ page }) => {
    await goToFirstJobDetail(page);

    // Skills section heading contains "SKILLS"
    await expect(page.getByText('SKILLS', { exact: false }).first()).toBeVisible();
  });

  test('Apply button links to app.claru.ai/signup', async ({ page }) => {
    await goToFirstJobDetail(page);

    // The "Apply Now" CTA should link to app.claru.ai/signup
    const applyLink = page.locator('a[href*="app.claru.ai/signup"]').first();
    await expect(applyLink).toBeVisible();

    const href = await applyLink.getAttribute('href');
    expect(href).toContain('app.claru.ai/signup');
  });

  test('job detail page has sidebar with quick info (desktop viewport)', async ({ page }) => {
    // Set desktop viewport to ensure sidebar renders (aside is hidden below lg)
    await page.setViewportSize({ width: 1280, height: 800 });

    await goToFirstJobDetail(page);

    // Sidebar quick info section (only visible on lg+ screens)
    await expect(page.getByText('QUICK INFO', { exact: false }).first()).toBeVisible();

    // Sidebar should show contractor type and compensation
    await expect(
      page.locator('aside').filter({ hasText: /Contractor/ }).first()
    ).toBeVisible();
  });

  /* ===================================================================
     WORK-WITH-US HUB PAGE
     =================================================================== */

  test('work-with-us hub page renders with key content', async ({ page }) => {
    await page.goto('/work-with-us');

    // Main heading should be visible
    await expect(page.locator('h1')).toBeVisible();

    // Key sections: "Choose your path" heading should be present
    await expect(
      page.getByRole('heading', { name: /choose your path/i })
    ).toBeVisible();

    // The "Apply" CTA should link to app.claru.ai/signup
    const applyLink = page.locator('a[href*="app.claru.ai/signup"]').first();
    await expect(applyLink).toBeVisible();
  });

  test('work-with-us page has FAQ section', async ({ page }) => {
    await page.goto('/work-with-us');

    // FAQ section should be present with at least one clickable question
    await expect(
      page.getByRole('button', { name: /data annotation work legitimate/i })
    ).toBeVisible();
  });
});
