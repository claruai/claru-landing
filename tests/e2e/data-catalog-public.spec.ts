import { test, expect } from '@playwright/test';

test.describe('Data Catalog — Public Flow (US-023)', () => {
  /* ===================================================================
     LANDING PAGE (/data-catalog)
     =================================================================== */

  test.describe('Landing page (/data-catalog)', () => {
    test('page loads with hero headline and CTA', async ({ page }) => {
      await page.goto('/data-catalog');

      // Hero headline should be visible
      await expect(page.locator('h1')).toBeVisible();
      const headlineText = await page.locator('h1').textContent();
      expect(headlineText!.length).toBeGreaterThan(0);

      // "Request Access" CTA button should be present and link to /data-catalog/request
      const requestAccessLink = page.locator('a[href="/data-catalog/request"]').first();
      await expect(requestAccessLink).toBeVisible();
    });

    test('renders 4 category overview cards', async ({ page }) => {
      await page.goto('/data-catalog');

      // Scroll to the categories section
      await page.locator('#categories').scrollIntoViewIfNeeded();

      // Each category card contains an h3 with the category name
      const categoryHeadings = page.locator('#categories h3');
      await expect(categoryHeadings.first()).toBeVisible();

      const count = await categoryHeadings.count();
      expect(count).toBe(4);

      // Verify the four expected category names
      const expectedCategories = [
        'Egocentric Crowd',
        'Egocentric Workplaces',
        'Licensed Cinematic',
        'Game Capture',
      ];

      for (const name of expectedCategories) {
        await expect(page.getByRole('heading', { name, level: 3 })).toBeVisible();
      }
    });

    test('"Request Access" CTA links to /data-catalog/request', async ({ page }) => {
      await page.goto('/data-catalog');

      const ctaLinks = page.locator('a[href="/data-catalog/request"]');
      await expect(ctaLinks.first()).toBeVisible();

      // There should be at least 2 Request Access CTAs (hero + bottom section)
      const count = await ctaLinks.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('catalog stats bar displays aggregate numbers', async ({ page }) => {
      await page.goto('/data-catalog');

      // Verify key stats are rendered
      await expect(page.getByText('7,500+')).toBeVisible();
      await expect(page.getByText('hours of video')).toBeVisible();
      await expect(page.getByText('100%')).toBeVisible();
      await expect(page.getByText('rights-cleared')).toBeVisible();
    });

    test('breadcrumb navigation renders', async ({ page }) => {
      await page.goto('/data-catalog');

      // Breadcrumb should contain Home link and Data Catalog text
      const homeLink = page.locator('nav a[href="/"]').first();
      await expect(homeLink).toBeVisible();
      await expect(page.getByText('Data Catalog').first()).toBeVisible();
    });

    test('responsive: renders at 375px width', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/data-catalog');

      // Hero headline should still be visible at mobile width
      await expect(page.locator('h1')).toBeVisible();

      // At least one category card should be visible
      await page.locator('#categories').scrollIntoViewIfNeeded();
      const categoryHeadings = page.locator('#categories h3');
      await expect(categoryHeadings.first()).toBeVisible();
    });
  });

  /* ===================================================================
     REQUEST FORM (/data-catalog/request)
     =================================================================== */

  test.describe('Request form (/data-catalog/request)', () => {
    test('multi-step form renders with step indicator', async ({ page }) => {
      await page.goto('/data-catalog/request');

      // Terminal header should show step count
      await expect(page.getByText('STEP 1/3')).toBeVisible();

      // Step 1 label should be visible
      await expect(page.getByText('Step 1: About You')).toBeVisible();

      // Form fields for step 1 should be present
      await expect(page.locator('#name')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
    });

    test('step 1 shows name, email, company, role fields', async ({ page }) => {
      await page.goto('/data-catalog/request');

      await expect(page.locator('#name')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#company')).toBeVisible();
      await expect(page.locator('#role')).toBeVisible();

      // Next button should be present
      const nextButton = page.getByRole('button', { name: /next/i });
      await expect(nextButton).toBeVisible();
    });

    test('fill step 1 and advance to step 2', async ({ page }) => {
      await page.goto('/data-catalog/request');

      // Fill required fields
      await page.locator('#name').fill('Test User');
      await page.locator('#email').fill('test@example.com');

      // Click Next to advance
      const nextButton = page.getByRole('button', { name: /next/i });
      await nextButton.click();

      // Wait for step 2 to appear
      await expect(page.getByText('Step 2: Data Needs')).toBeVisible();
      await expect(page.getByText('STEP 2/3')).toBeVisible();

      // Step 2 fields should be present
      await expect(page.locator('#data_needs')).toBeVisible();
      await expect(page.locator('#use_case')).toBeVisible();
    });

    test('fill step 2 and advance to review step', async ({ page }) => {
      await page.goto('/data-catalog/request');

      // Step 1
      await page.locator('#name').fill('Test User');
      await page.locator('#email').fill('test@example.com');
      await page.locator('#company').fill('Acme Inc');
      await page.locator('#role').fill('ML Engineer');
      await page.getByRole('button', { name: /next/i }).click();

      // Step 2
      await expect(page.getByText('Step 2: Data Needs')).toBeVisible();
      await page.locator('#data_needs').fill('We need egocentric video data');
      await page.locator('#use_case').selectOption('Video Generation');
      await page.getByRole('button', { name: /next/i }).click();

      // Step 3: Review
      await expect(page.getByText('Step 3: Review + Submit')).toBeVisible();
      await expect(page.getByText('STEP 3/3')).toBeVisible();
    });

    test('review step shows submitted data', async ({ page }) => {
      await page.goto('/data-catalog/request');

      // Step 1
      await page.locator('#name').fill('Jane Doe');
      await page.locator('#email').fill('jane@frontier.ai');
      await page.locator('#company').fill('Frontier Labs');
      await page.locator('#role').fill('Head of Data');
      await page.getByRole('button', { name: /next/i }).click();

      // Step 2
      await expect(page.locator('#use_case')).toBeVisible();
      await page.locator('#data_needs').fill('Robotics training data');
      await page.locator('#use_case').selectOption('Robotics/Manipulation');
      await page.getByRole('button', { name: /next/i }).click();

      // Step 3: verify the review fields display submitted values
      await expect(page.getByText('Step 3: Review + Submit')).toBeVisible();

      // ReviewField components display "$ label: value"
      await expect(page.getByText('Jane Doe')).toBeVisible();
      await expect(page.getByText('jane@frontier.ai')).toBeVisible();
      await expect(page.getByText('Frontier Labs')).toBeVisible();
      await expect(page.getByText('Head of Data')).toBeVisible();
      await expect(page.getByText('Robotics training data')).toBeVisible();
      await expect(page.getByText('Robotics/Manipulation')).toBeVisible();

      // Submit button should be present (but we don't click it)
      const submitButton = page.getByRole('button', { name: /submit request/i });
      await expect(submitButton).toBeVisible();
    });

    test('back button navigates to previous step', async ({ page }) => {
      await page.goto('/data-catalog/request');

      // Step 1 -> fill and advance
      await page.locator('#name').fill('Test');
      await page.locator('#email').fill('t@t.com');
      await page.getByRole('button', { name: /next/i }).click();

      // Step 2 visible
      await expect(page.getByText('Step 2: Data Needs')).toBeVisible();

      // Click Back
      const backButton = page.getByRole('button', { name: /back/i });
      await expect(backButton).toBeVisible();
      await backButton.click();

      // Should return to step 1
      await expect(page.getByText('Step 1: About You')).toBeVisible();
    });

    test('validation errors show when required fields empty', async ({ page }) => {
      await page.goto('/data-catalog/request');

      // Try to advance without filling required fields
      const nextButton = page.getByRole('button', { name: /next/i });
      await nextButton.click();

      // Validation errors should appear for name and email
      await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible();
      await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
    });
  });

  /* ===================================================================
     HEADER NAVIGATION
     =================================================================== */

  test.describe('Navigation integration', () => {
    test('header renders with navigation links on /data-catalog', async ({ page }) => {
      await page.goto('/data-catalog');

      // Header should be present
      await expect(page.locator('header').first()).toBeVisible();
    });
  });
});
