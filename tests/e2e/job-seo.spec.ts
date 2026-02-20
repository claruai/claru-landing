import { test, expect } from '@playwright/test';

test.describe('Job SEO Schema Validation', () => {
  test('job detail pages have valid JobPosting JSON-LD', async ({ page }) => {
    // Navigate to jobs listing
    await page.goto('/jobs');

    // Collect first 5 job links
    const jobLinks = await page.locator('a[href^="/jobs/"]').all();
    const urls: string[] = [];
    for (const link of jobLinks.slice(0, 5)) {
      const href = await link.getAttribute('href');
      if (href && href !== '/jobs' && href !== '/jobs/feed.xml' && !urls.includes(href)) {
        urls.push(href);
      }
      if (urls.length >= 5) break;
    }

    expect(urls.length).toBeGreaterThan(0);

    for (const url of urls) {
      await page.goto(url);

      // Find JSON-LD script
      const schemas = await page.locator('script[type="application/ld+json"]').all();
      let foundJobPosting = false;

      for (const schema of schemas) {
        const text = await schema.textContent();
        if (text && text.includes('JobPosting')) {
          const data = JSON.parse(text);

          // Assert required fields
          expect(data['@type']).toBe('JobPosting');
          expect(data.title).toBeTruthy();
          expect(data.description).toBeTruthy();
          expect(data.datePosted).toBeTruthy();
          expect(data.validThrough).toBeTruthy();
          expect(data.hiringOrganization.name).toBe('Claru');
          expect(data.jobLocationType).toBe('TELECOMMUTE');
          expect(data.baseSalary).toBeTruthy();
          expect(data.baseSalary.value.minValue).toBeGreaterThanOrEqual(15);
          expect(data.baseSalary.value.maxValue).toBeLessThanOrEqual(120);
          expect(data.baseSalary.value.unitText).toBe('HOUR');

          foundJobPosting = true;
        }
      }

      expect(foundJobPosting).toBe(true);
    }
  });

  test('work-with-us has FAQPage schema', async ({ page }) => {
    await page.goto('/work-with-us');
    const schemas = await page.locator('script[type="application/ld+json"]').all();
    let foundFAQ = false;

    for (const schema of schemas) {
      const text = await schema.textContent();
      if (text && text.includes('FAQPage')) {
        const data = JSON.parse(text);
        expect(data['@type']).toBe('FAQPage');
        expect(data.mainEntity).toBeTruthy();
        expect(data.mainEntity.length).toBeGreaterThan(0);
        foundFAQ = true;
      }
    }

    expect(foundFAQ).toBe(true);
  });

  test('RSS feed is valid XML with job items', async ({ page }) => {
    const response = await page.goto('/jobs/feed.xml');
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('xml');

    const body = await page.content();
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('<item>');
    expect(body).toContain('Claru AI Jobs');

    // Verify items have required fields
    expect(body).toContain('<title>');
    expect(body).toContain('<link>');
    expect(body).toContain('<pubDate>');
    expect(body).toContain('<guid');
  });
});
