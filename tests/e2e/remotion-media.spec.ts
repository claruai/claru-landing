import { test, expect } from '@playwright/test';

/**
 * Remotion Media E2E Test Suite (US-028)
 *
 * Verifies all 22 pages with pre-rendered Remotion video compositions:
 * - 11 solution pages load <video> with correct src containing /videos/sol-
 * - 11 case study pages load <video> with correct src containing /videos/cs-
 * - Video elements have autoplay, muted, loop, playsInline attributes
 * - No console errors on each page
 * - Mobile viewport (375px) responsive layout
 */

// ---------------------------------------------------------------------------
// Solution pages: slug -> expected video filename
// ---------------------------------------------------------------------------

const SOLUTION_PAGES: Array<{ slug: string; videoFile: string }> = [
  { slug: 'egocentric-video-data', videoFile: 'sol-egocentric.mp4' },
  { slug: 'vla-training-data', videoFile: 'sol-vla.mp4' },
  { slug: 'manipulation-trajectory-data', videoFile: 'sol-manipulation.mp4' },
  { slug: 'teleoperation-data', videoFile: 'sol-teleop.mp4' },
  { slug: 'video-generation-training-data', videoFile: 'sol-video-gen.mp4' },
  { slug: 'expert-rlhf-annotation', videoFile: 'sol-rlhf.mp4' },
  { slug: 'red-teaming-data', videoFile: 'sol-red-teaming.mp4' },
  { slug: 'sim-to-real-data', videoFile: 'sol-sim2real.mp4' },
  { slug: 'open-datasets-vs-custom', videoFile: 'sol-open-vs-custom.mp4' },
  { slug: 'crowdsourced-vs-expert-rlhf', videoFile: 'sol-crowd-vs-expert.mp4' },
  { slug: 'eu-ai-act-red-teaming', videoFile: 'sol-eu-ai-act.mp4' },
];

// ---------------------------------------------------------------------------
// Case study pages: slug -> expected video filename
// ---------------------------------------------------------------------------

const CASE_STUDY_PAGES: Array<{ slug: string; videoFile: string }> = [
  { slug: 'egocentric-video-collection', videoFile: 'cs-egocentric.mp4' },
  { slug: 'workplace-egocentric-data', videoFile: 'cs-workplace.mp4' },
  { slug: 'fashion-ai-annotation', videoFile: 'cs-fashion.mp4' },
  { slug: 'game-based-data-capture', videoFile: 'cs-game-capture.mp4' },
  { slug: 'generative-ai-safety', videoFile: 'cs-gen-safety.mp4' },
  { slug: 'red-teaming-moderation', videoFile: 'cs-red-team.mp4' },
  { slug: 'video-content-classification', videoFile: 'cs-vid-classify.mp4' },
  { slug: 'video-model-evaluation', videoFile: 'cs-vid-eval.mp4' },
  { slug: 'video-quality-at-scale', videoFile: 'cs-vid-quality.mp4' },
  { slug: 'prompt-enhancement-benchmark', videoFile: 'cs-prompt-bench.mp4' },
  { slug: 'object-identity-persistence', videoFile: 'cs-object-id.mp4' },
];

// ---------------------------------------------------------------------------
// Solution page tests
// ---------------------------------------------------------------------------

test.describe('Solution pages — video compositions', () => {
  for (const { slug, videoFile } of SOLUTION_PAGES) {
    test.describe(slug, () => {
      test(`loads <video> with src containing /videos/${videoFile}`, async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        await page.goto(`/solutions/${slug}`, { waitUntil: 'networkidle' });

        // Find the video element with the expected src
        const video = page.locator(`video[src*="/videos/sol-"]`).first();
        await expect(video).toBeVisible({ timeout: 10_000 });

        const src = await video.getAttribute('src');
        expect(src).toContain(`/videos/${videoFile}`);
      });

      test('video has autoplay, muted, loop, playsInline attributes', async ({ page }) => {
        await page.goto(`/solutions/${slug}`, { waitUntil: 'networkidle' });

        const video = page.locator(`video[src*="/videos/sol-"]`).first();
        await expect(video).toBeVisible({ timeout: 10_000 });

        // autoplay — HTML attribute is boolean, rendered as empty string or "true"
        const autoplay = await video.getAttribute('autoplay');
        expect(autoplay !== null).toBeTruthy();

        // muted
        const muted = await video.evaluate((el) => (el as HTMLVideoElement).muted);
        expect(muted).toBe(true);

        // loop
        const loop = await video.getAttribute('loop');
        expect(loop !== null).toBeTruthy();

        // playsInline (HTML lowercases to "playsinline")
        const playsInline = await video.evaluate(
          (el) => el.hasAttribute('playsinline') || (el as HTMLVideoElement).playsInline,
        );
        expect(playsInline).toBe(true);
      });

      test('no console errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            const text = msg.text();
            // Ignore known benign errors (e.g. favicon, analytics)
            if (
              text.includes('favicon') ||
              text.includes('_next/static') ||
              text.includes('ERR_BLOCKED_BY_CLIENT')
            ) {
              return;
            }
            consoleErrors.push(text);
          }
        });

        await page.goto(`/solutions/${slug}`, { waitUntil: 'networkidle' });
        // Wait a moment for any deferred errors
        await page.waitForTimeout(1000);

        expect(consoleErrors).toEqual([]);
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Case study page tests
// ---------------------------------------------------------------------------

test.describe('Case study pages — video compositions', () => {
  for (const { slug, videoFile } of CASE_STUDY_PAGES) {
    test.describe(slug, () => {
      test(`loads <video> with src containing /videos/${videoFile}`, async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        await page.goto(`/case-studies/${slug}`, { waitUntil: 'networkidle' });

        const video = page.locator(`video[src*="/videos/cs-"]`).first();
        await expect(video).toBeVisible({ timeout: 10_000 });

        const src = await video.getAttribute('src');
        expect(src).toContain(`/videos/${videoFile}`);
      });

      test('video has autoplay, muted, loop, playsInline attributes', async ({ page }) => {
        await page.goto(`/case-studies/${slug}`, { waitUntil: 'networkidle' });

        const video = page.locator(`video[src*="/videos/cs-"]`).first();
        await expect(video).toBeVisible({ timeout: 10_000 });

        const autoplay = await video.getAttribute('autoplay');
        expect(autoplay !== null).toBeTruthy();

        const muted = await video.evaluate((el) => (el as HTMLVideoElement).muted);
        expect(muted).toBe(true);

        const loop = await video.getAttribute('loop');
        expect(loop !== null).toBeTruthy();

        const playsInline = await video.evaluate(
          (el) => el.hasAttribute('playsinline') || (el as HTMLVideoElement).playsInline,
        );
        expect(playsInline).toBe(true);
      });

      test('no console errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            const text = msg.text();
            if (
              text.includes('favicon') ||
              text.includes('_next/static') ||
              text.includes('ERR_BLOCKED_BY_CLIENT')
            ) {
              return;
            }
            consoleErrors.push(text);
          }
        });

        await page.goto(`/case-studies/${slug}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        expect(consoleErrors).toEqual([]);
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Mobile viewport (375px) responsive tests
// ---------------------------------------------------------------------------

test.describe('Mobile viewport (375px) — video responsive layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  // Test a representative sample of solution pages
  const sampleSolutions = SOLUTION_PAGES.slice(0, 3);
  for (const { slug, videoFile } of sampleSolutions) {
    test(`solution/${slug} — video visible and contained at 375px`, async ({ page }) => {
      await page.goto(`/solutions/${slug}`, { waitUntil: 'networkidle' });

      const video = page.locator(`video[src*="/videos/sol-"]`).first();
      await expect(video).toBeVisible({ timeout: 10_000 });

      // Verify video container does not overflow viewport
      const box = await video.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
        expect(box.x).toBeGreaterThanOrEqual(0);
      }
    });
  }

  // Test a representative sample of case study pages
  const sampleCaseStudies = CASE_STUDY_PAGES.slice(0, 3);
  for (const { slug, videoFile } of sampleCaseStudies) {
    test(`case-study/${slug} — video visible and contained at 375px`, async ({ page }) => {
      await page.goto(`/case-studies/${slug}`, { waitUntil: 'networkidle' });

      const video = page.locator(`video[src*="/videos/cs-"]`).first();
      await expect(video).toBeVisible({ timeout: 10_000 });

      const box = await video.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
        expect(box.x).toBeGreaterThanOrEqual(0);
      }
    });
  }

  // Full sweep: all 22 pages load video at mobile
  for (const { slug } of SOLUTION_PAGES) {
    test(`solution/${slug} — video element present at 375px`, async ({ page }) => {
      await page.goto(`/solutions/${slug}`, { waitUntil: 'networkidle' });
      const video = page.locator(`video[src*="/videos/sol-"]`).first();
      await expect(video).toBeAttached({ timeout: 10_000 });
    });
  }

  for (const { slug } of CASE_STUDY_PAGES) {
    test(`case-study/${slug} — video element present at 375px`, async ({ page }) => {
      await page.goto(`/case-studies/${slug}`, { waitUntil: 'networkidle' });
      const video = page.locator(`video[src*="/videos/cs-"]`).first();
      await expect(video).toBeAttached({ timeout: 10_000 });
    });
  }
});
