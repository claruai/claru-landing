import { test, expect, type Page } from '@playwright/test';

/**
 * SEO Validation E2E Test Suite (US-013)
 *
 * Verifies all SEO/AEO/GEO elements render correctly:
 * - Structured data (Organization, FAQPage JSON-LD)
 * - Canonical URLs
 * - robots.txt, sitemap.xml, llms.txt
 * - Dynamic OG images
 * - Server-rendered HTML headings
 */

// ---------------------------------------------------------------------------
// Page Object: SEO helpers
// ---------------------------------------------------------------------------

class SeoPage {
  constructor(private page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  /** Parse all JSON-LD script tags from the raw page HTML. */
  async getAllJsonLd(): Promise<Record<string, unknown>[]> {
    // Use raw HTML to reliably find JSON-LD regardless of hydration state
    const html = await this.page.content();
    const regex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
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
  async findJsonLdByType(type: string): Promise<Record<string, unknown> | null> {
    const allLd = await this.getAllJsonLd();
    for (const ld of allLd) {
      // Direct match
      if (ld['@type'] === type) return ld;
      // Inside @graph array
      if (Array.isArray(ld['@graph'])) {
        const match = (ld['@graph'] as Record<string, unknown>[]).find(
          (item) => item['@type'] === type,
        );
        if (match) return match;
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
// Tests
// ---------------------------------------------------------------------------

test.describe('SEO Validation Suite', () => {
  let seo: SeoPage;

  test.beforeEach(async ({ page }) => {
    seo = new SeoPage(page);
  });

  // 1. Homepage H1
  test('homepage has an <h1> in rendered HTML', async ({ page }) => {
    await seo.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text!.length).toBeGreaterThan(0);
  });

  // 2. Organization JSON-LD
  test('homepage has Organization JSON-LD with name "Claru"', async () => {
    await seo.goto('/');
    const org = await seo.findJsonLdByType('Organization');
    expect(org).not.toBeNull();
    expect(org!['name']).toBe('Claru');
  });

  // 3. Homepage canonical
  test('homepage has <link rel="canonical">', async () => {
    await seo.goto('/');
    const canonical = await seo.getCanonical();
    expect(canonical).toBeTruthy();
  });

  // 4. Homepage FAQ schema
  test('homepage has FAQPage JSON-LD', async () => {
    await seo.goto('/');
    const faq = await seo.findJsonLdByType('FAQPage');
    expect(faq).not.toBeNull();
    expect(faq!['mainEntity']).toBeDefined();
  });

  // 5. robots.txt
  test('robots.txt contains Sitemap directive and allows GPTBot', async ({
    page,
  }) => {
    const response = await page.goto('/robots.txt');
    expect(response!.status()).toBe(200);

    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();

    // Must contain Sitemap directive
    expect(body).toContain('Sitemap:');

    // GPTBot must NOT be blocked — check there is no "Disallow: /" for GPTBot
    // Split into user-agent sections and verify GPTBot section allows crawling
    const lines = body!.split('\n').map((l) => l.trim());
    let inGPTBotSection = false;
    for (const line of lines) {
      if (line.toLowerCase().startsWith('user-agent:')) {
        inGPTBotSection = line.includes('GPTBot');
      }
      if (inGPTBotSection && line.toLowerCase() === 'disallow: /') {
        throw new Error('GPTBot is blocked with Disallow: / — it should be allowed');
      }
    }
  });

  // 6. sitemap.xml
  test('sitemap.xml returns XML with 50+ URL entries', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response!.status()).toBe(200);

    const contentType = response!.headers()['content-type'] || '';
    expect(contentType).toMatch(/xml/);

    const body = await page.locator('body').innerText();
    // Next.js sitemaps render as XML — count <loc> tags in the raw content
    const content = await page.content();
    const urlCount = (content.match(/<loc>/gi) || []).length;
    expect(urlCount).toBeGreaterThanOrEqual(50);
  });

  // 7. llms.txt
  test('llms.txt returns content containing "Claru"', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    expect(response!.status()).toBe(200);

    const body = await page.locator('body').textContent();
    expect(body).toContain('Claru');
  });

  // 8. Case studies canonical
  test('/case-studies has canonical link', async () => {
    await seo.goto('/case-studies');
    const canonical = await seo.getCanonical();
    expect(canonical).toBeTruthy();
  });

  // 9. Pillar FAQ schema
  test('/pillars/acquire has FAQPage JSON-LD', async () => {
    await seo.goto('/pillars/acquire');
    const faq = await seo.findJsonLdByType('FAQPage');
    expect(faq).not.toBeNull();
  });

  // 10. OG image endpoint
  test('/api/og?title=Test returns image with status 200', async ({ page }) => {
    const response = await page.goto('/api/og?title=Test');
    expect(response!.status()).toBe(200);

    const contentType = response!.headers()['content-type'] || '';
    expect(contentType).toMatch(/image/);
  });

  // 11. OG meta tag on /for-annotators
  test('/for-annotators has og:image meta tag pointing to /api/og', async () => {
    await seo.goto('/for-annotators');
    const ogImage = await seo.getMetaProperty('og:image');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toContain('/api/og');
  });
});
