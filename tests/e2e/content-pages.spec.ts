import { test, expect, type Page } from '@playwright/test';

/**
 * Content Pages E2E Test Suite (US-013)
 *
 * Data-driven tests across all 11 /solutions/[slug] pages verifying:
 * - Page loads (HTTP 200, no JS errors)
 * - Exactly 1 <h1> element
 * - BreadcrumbList, FAQPage, Service JSON-LD
 * - Canonical URL and OG image meta
 * - FAQ accordion functionality
 * - Research citations with external links
 */

// ---------------------------------------------------------------------------
// Page slugs under test
// ---------------------------------------------------------------------------

const SLUGS = [
  'egocentric-video-data',
  'vla-training-data',
  'red-teaming-data',
  'video-generation-training-data',
  'manipulation-trajectory-data',
  'expert-rlhf-annotation',
  'sim-to-real-data',
  'teleoperation-data',
  'open-datasets-vs-custom',
  'crowdsourced-vs-expert-rlhf',
  'eu-ai-act-red-teaming',
];

// ---------------------------------------------------------------------------
// Helper: parse JSON-LD from raw HTML
// ---------------------------------------------------------------------------

class ContentPageHelper {
  constructor(private page: Page) {}

  /** Parse all JSON-LD script tags from the raw page HTML. */
  async getAllJsonLd(): Promise<Record<string, unknown>[]> {
    const html = await this.page.content();
    const regex =
      /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    const results: Record<string, unknown>[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      try {
        results.push(JSON.parse(match[1]));
      } catch {
        // skip malformed JSON-LD
      }
    }
    return results;
  }

  /** Find a JSON-LD block containing a given @type (supports @graph arrays). */
  async findJsonLdByType(
    type: string,
  ): Promise<Record<string, unknown> | null> {
    const allLd = await this.getAllJsonLd();
    for (const ld of allLd) {
      if (ld['@type'] === type) return ld;
      if (Array.isArray(ld['@graph'])) {
        const found = (ld['@graph'] as Record<string, unknown>[]).find(
          (item) => item['@type'] === type,
        );
        if (found) return found;
      }
    }
    return null;
  }

  /** Get the canonical link href. */
  async getCanonical(): Promise<string | null> {
    const link = this.page.locator('link[rel="canonical"]');
    if ((await link.count()) === 0) return null;
    return link.getAttribute('href');
  }

  /** Get a meta tag content by property. */
  async getMetaProperty(property: string): Promise<string | null> {
    const meta = this.page.locator(`meta[property="${property}"]`);
    if ((await meta.count()) === 0) return null;
    return meta.getAttribute('content');
  }
}

// ---------------------------------------------------------------------------
// Data-driven tests — parameterized across all 11 slugs
// ---------------------------------------------------------------------------

for (const slug of SLUGS) {
  test.describe(`/solutions/${slug}`, () => {
    let helper: ContentPageHelper;
    const jsErrors: string[] = [];

    test.beforeEach(async ({ page }) => {
      helper = new ContentPageHelper(page);

      // Capture JS errors during page load
      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });

      const response = await page.goto(`/solutions/${slug}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });

      // 1. Page loads (HTTP 200)
      expect(response).not.toBeNull();
      expect(response!.status()).toBe(200);
    });

    // 1. No JS errors
    test('page loads without JavaScript errors', async () => {
      expect(jsErrors).toEqual([]);
    });

    // 2. Exactly 1 <h1> element
    test('has exactly 1 <h1> element', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    // 3. <h1> contains text (not empty)
    test('<h1> contains text', async ({ page }) => {
      const h1 = page.locator('h1').first();
      const text = await h1.textContent();
      expect(text!.trim().length).toBeGreaterThan(0);
    });

    // 4. BreadcrumbList JSON-LD present
    test('has BreadcrumbList JSON-LD', async () => {
      const breadcrumb = await helper.findJsonLdByType('BreadcrumbList');
      expect(breadcrumb).not.toBeNull();
      // Should have itemListElement array
      expect(breadcrumb!['itemListElement']).toBeDefined();
      expect(
        Array.isArray(breadcrumb!['itemListElement']),
      ).toBe(true);
    });

    // 5. FAQPage JSON-LD present with 3-5 mainEntity items
    test('has FAQPage JSON-LD with 3-5 items', async () => {
      const faq = await helper.findJsonLdByType('FAQPage');
      expect(faq).not.toBeNull();
      expect(faq!['mainEntity']).toBeDefined();
      const items = faq!['mainEntity'] as unknown[];
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThanOrEqual(3);
      expect(items.length).toBeLessThanOrEqual(5);
    });

    // 6. Service JSON-LD present
    test('has Service JSON-LD', async () => {
      const service = await helper.findJsonLdByType('Service');
      expect(service).not.toBeNull();
    });

    // 7. Canonical URL matches /solutions/{slug}
    test('canonical URL matches /solutions/' + slug, async () => {
      const canonical = await helper.getCanonical();
      expect(canonical).toBeTruthy();
      expect(canonical).toContain(`/solutions/${slug}`);
    });

    // 8. og:image present and contains /api/og
    test('has og:image meta tag pointing to /api/og', async () => {
      const ogImage = await helper.getMetaProperty('og:image');
      expect(ogImage).toBeTruthy();
      expect(ogImage).toContain('/api/og');
    });

    // 9. At least 1 section element
    test('has at least 1 section element', async ({ page }) => {
      const sectionCount = await page
        .locator('[data-section], section')
        .count();
      expect(sectionCount).toBeGreaterThanOrEqual(1);
    });

    // 10. Research citations section has at least 3 external links
    test('research citations has at least 3 external links', async ({
      page,
    }) => {
      // Look for the citations/references section
      const citationLinks = page.locator(
        'a[href^="http"][rel~="noopener"], a[href^="https"][rel~="noopener"], a[href^="http"][target="_blank"], a[href^="https"][target="_blank"]',
      );
      const count = await citationLinks.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    // 11. FAQ section exists with expandable items
    test('FAQ accordion expands on click', async ({ page }) => {
      // Wait for hydration — the FAQ component is a client component ('use client')
      // that needs React to hydrate before click handlers work
      await page.waitForLoadState('networkidle');

      // Scroll to FAQ section to ensure it's in view
      const faqSection = page.locator('#faq');
      const faqSectionCount = await faqSection.count();
      if (faqSectionCount > 0) {
        await faqSection.scrollIntoViewIfNeeded();
      }

      // Target the first FAQ button by its stable ID pattern
      const firstFaqButton = page.locator('#faq-heading-0');
      const buttonCount = await firstFaqButton.count();
      expect(buttonCount).toBe(1);

      // Verify initial state is collapsed
      await expect(firstFaqButton).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      // Click to expand — use force:true in case of overlay issues
      await firstFaqButton.click({ timeout: 5000 });

      // Wait for React state update and re-render
      await expect(firstFaqButton).toHaveAttribute(
        'aria-expanded',
        'true',
        { timeout: 5000 },
      );

      // Verify the panel content is now visible
      const panel = page.locator('#faq-panel-0');
      await expect(panel).toBeVisible({ timeout: 3000 });
    });
  });
}

// ---------------------------------------------------------------------------
// OG Image API endpoint test
// ---------------------------------------------------------------------------

test.describe('OG Image API', () => {
  test('/api/og?title=Test&category=solution returns image', async ({
    page,
  }) => {
    const response = await page.goto(
      '/api/og?title=Test&category=solution',
    );
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    const contentType = response!.headers()['content-type'] || '';
    expect(contentType).toMatch(/image/);
  });
});
