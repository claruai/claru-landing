import { test, expect } from '@playwright/test';

/**
 * Helper: navigate to the first case study detail page from /case-studies.
 * Returns the href that was navigated to.
 */
async function goToFirstCaseStudyDetail(
  page: import('@playwright/test').Page
): Promise<string> {
  await page.goto('/case-studies');

  const cardLink = page.locator('a[href^="/case-studies/"]').first();
  await expect(cardLink).toBeVisible();

  const href = await cardLink.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).not.toBe('/case-studies');

  await page.goto(href!);
  return href!;
}

/**
 * Helper: find and parse all JSON-LD script tags on the current page.
 * Returns an array of parsed objects.
 */
async function getAllJsonLd(
  page: import('@playwright/test').Page
): Promise<Record<string, unknown>[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  const results: Record<string, unknown>[] = [];

  for (const script of scripts) {
    const text = await script.textContent();
    if (text) {
      results.push(JSON.parse(text));
    }
  }

  return results;
}

test.describe('Case Studies', () => {
  /* ===================================================================
     INDEX PAGE
     =================================================================== */

  test.describe('Index page (/case-studies)', () => {
    test('renders 10 case study cards', async ({ page }) => {
      await page.goto('/case-studies');

      // Wait for cards to render (each card is a link to /case-studies/<slug>)
      const cardLinks = page.locator('a[href^="/case-studies/"]').filter({
        hasNot: page.locator('a[href="/case-studies"]'),
      });

      // Wait for at least one card to appear
      await expect(cardLinks.first()).toBeVisible();

      // Count should be exactly 10
      const count = await cardLinks.count();
      expect(count).toBe(10);
    });

    test('category filter pills filter the card grid', async ({ page }) => {
      await page.goto('/case-studies');

      // Verify "All" pill is present
      const allPill = page.locator('button').filter({ hasText: /^All$/ });
      await expect(allPill.first()).toBeVisible();

      // Count text should show 10 when "All" is selected
      const countText = page.locator('text=/Showing \\d+ case/');
      await expect(countText.first()).toBeVisible();
      const initialText = await countText.first().textContent();
      expect(initialText).toContain('10');

      // Click "Data Collection" filter pill
      const categoryPill = page
        .locator('button')
        .filter({ hasText: /^Data Collection$/ });
      await expect(categoryPill).toBeVisible();
      await categoryPill.click();

      // Allow animation / re-render
      await page.waitForTimeout(500);

      // Count text should have changed (fewer than 10)
      const filteredText = await countText.first().textContent();
      expect(filteredText).toBeTruthy();
      // The filtered count should differ from 10 (unless all are Data Collection,
      // which they are not based on the data)
      expect(filteredText).not.toContain('10');
    });

    test('clicking a case study card navigates to detail page', async ({ page }) => {
      await page.goto('/case-studies');

      const firstCard = page.locator('a[href^="/case-studies/"]').first();
      await expect(firstCard).toBeVisible();

      const href = await firstCard.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^\/case-studies\/[a-z0-9-]+$/);

      await firstCard.click();

      // Should navigate to the detail page
      await page.waitForURL(`**${href}`);
      expect(page.url()).toContain(href!);
    });
  });

  /* ===================================================================
     DETAIL PAGE — CONTENT SECTIONS
     =================================================================== */

  test.describe('Detail page content', () => {
    test('headline text exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);
      await expect(page.locator('h1')).toBeVisible();
      const headlineText = await page.locator('h1').textContent();
      expect(headlineText!.length).toBeGreaterThan(0);
    });

    test('quick summary block exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      // The quick summary block has a terminal title bar with "summary.md"
      await expect(page.getByText('summary.md')).toBeVisible();

      // Should contain Challenge / Solution / Result prefixes
      await expect(page.getByText('Challenge:').first()).toBeVisible();
      await expect(page.getByText('Solution:').first()).toBeVisible();
      await expect(page.getByText('Result:').first()).toBeVisible();
    });

    test('snapshot stats exist (at least 3)', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      // Snapshot stats are in a grid with grid-cols-2 md:grid-cols-4
      // Each stat has font-mono text-2xl (the value) and text-xs (the label)
      const statValues = page.locator(
        '.grid.grid-cols-2 span.font-mono.font-bold'
      );
      const count = await statValues.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('challenge section exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);
      await expect(
        page.getByText('// THE CHALLENGE', { exact: false }).first()
      ).toBeVisible();
    });

    test('approach section exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);
      await expect(
        page.getByText('// OUR APPROACH', { exact: false }).first()
      ).toBeVisible();
    });

    test('results grid exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);
      await expect(
        page.getByText('// RESULTS', { exact: false }).first()
      ).toBeVisible();

      // Results grid: md:grid-cols-3 with stat cards
      const resultCards = page.locator(
        'section:has-text("// RESULTS") .grid div.rounded-xl'
      );
      const count = await resultCards.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('FAQ accordion exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);
      await expect(
        page.getByText('// FAQ', { exact: false }).first()
      ).toBeVisible();

      // FAQ items have expandable buttons with aria-expanded
      const faqButtons = page.locator('button[aria-expanded]');
      const count = await faqButtons.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('related case studies section exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);
      await expect(
        page.getByText('// RELATED', { exact: false }).first()
      ).toBeVisible();

      // Related cards link to other case studies
      const relatedLinks = page
        .locator('section:has-text("// RELATED") a[href^="/case-studies/"]');
      const count = await relatedLinks.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('CTA button exists', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      // CTA section contains "Book a Call" button
      await expect(
        page.getByRole('link', { name: /Book a Call/i })
      ).toBeVisible();
    });
  });

  /* ===================================================================
     DETAIL PAGE — JSON-LD / STRUCTURED DATA
     =================================================================== */

  test.describe('Detail page structured data', () => {
    test('Article JSON-LD exists with required fields', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      const schemas = await getAllJsonLd(page);
      const article = schemas.find(
        (s) => s['@type'] === 'Article'
      ) as Record<string, unknown> | undefined;

      expect(article).toBeTruthy();
      expect(article!.headline).toBeTruthy();
      expect(article!.datePublished).toBeTruthy();

      // Author should be an organization object
      const author = article!.author as Record<string, unknown>;
      expect(author).toBeTruthy();
      expect(author.name).toBeTruthy();
    });

    test('FAQPage JSON-LD exists with at least 3 questions', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      const schemas = await getAllJsonLd(page);
      const faq = schemas.find(
        (s) => s['@type'] === 'FAQPage'
      ) as Record<string, unknown> | undefined;

      expect(faq).toBeTruthy();

      const mainEntity = faq!.mainEntity as Array<Record<string, unknown>>;
      expect(mainEntity).toBeTruthy();
      expect(mainEntity.length).toBeGreaterThanOrEqual(3);

      // Each question should have a name and acceptedAnswer
      for (const question of mainEntity) {
        expect(question['@type']).toBe('Question');
        expect(question.name).toBeTruthy();

        const answer = question.acceptedAnswer as Record<string, unknown>;
        expect(answer['@type']).toBe('Answer');
        expect(answer.text).toBeTruthy();
      }
    });

    test('BreadcrumbList JSON-LD exists with 3 items', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      const schemas = await getAllJsonLd(page);
      const breadcrumb = schemas.find(
        (s) => s['@type'] === 'BreadcrumbList'
      ) as Record<string, unknown> | undefined;

      expect(breadcrumb).toBeTruthy();

      const items = breadcrumb!.itemListElement as Array<Record<string, unknown>>;
      expect(items).toBeTruthy();
      expect(items.length).toBe(3);

      // Verify positions and names
      expect(items[0].position).toBe(1);
      expect(items[0].name).toBe('Home');
      expect(items[1].position).toBe(2);
      expect(items[1].name).toBe('Case Studies');
      expect(items[2].position).toBe(3);
      expect(items[2].name).toBeTruthy();
    });
  });

  /* ===================================================================
     SERVICE USED CALLOUT
     =================================================================== */

  test.describe('Service Used callout', () => {
    test('Service Used callout exists and links to a /pillars/ path', async ({ page }) => {
      await goToFirstCaseStudyDetail(page);

      // The "Service Used" label should be visible
      await expect(page.getByText('Service Used').first()).toBeVisible();

      // The callout links to a pillar page
      const pillarLink = page.locator('a[href^="/pillars/"]');
      await expect(pillarLink.first()).toBeVisible();

      const href = await pillarLink.first().getAttribute('href');
      expect(href).toMatch(/^\/pillars\//);
    });
  });

  /* ===================================================================
     NAVIGATION INTEGRATION
     =================================================================== */

  test.describe('Navigation integration', () => {
    test('Case Studies link exists in header navigation', async ({ page }) => {
      await page.goto('/');

      // Header nav should contain a link to /case-studies
      const navLink = page.locator('header a[href="/case-studies"]');
      await expect(navLink.first()).toBeVisible();

      const linkText = await navLink.first().textContent();
      expect(linkText).toContain('Case Studies');
    });
  });

  /* ===================================================================
     PILLAR PAGE CROSS-LINK
     =================================================================== */

  test.describe('Pillar page integration', () => {
    test('pillar page has See It In Practice section with case study callout', async ({
      page,
    }) => {
      await page.goto('/pillars/validate/red-teaming');

      // The section label "// SEE IT IN PRACTICE" should exist
      await expect(
        page.getByText('// SEE IT IN PRACTICE', { exact: false }).first()
      ).toBeVisible();

      // Should contain a case study callout with a link to /case-studies/
      const caseStudyLink = page.locator(
        'section:has-text("SEE IT IN PRACTICE") a[href^="/case-studies/"]'
      );
      await expect(caseStudyLink.first()).toBeVisible();
    });
  });
});
