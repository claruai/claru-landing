// =============================================================================
// Slide Screenshot Capture — Renders slide HTML and captures a PNG screenshot
// Uses Playwright (already installed) for server-side rendering
// =============================================================================

import { chromium, type Browser } from 'playwright';

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
  }
  return browserInstance;
}

/**
 * Renders slide HTML and captures a PNG screenshot.
 * Returns the screenshot as a base64-encoded string.
 *
 * @param viewport  Optional { width, height } override (default 1920x1080).
 */
export async function captureSlideScreenshot(
  html: string,
  viewport?: { width: number; height: number },
): Promise<string> {
  const vp = viewport ?? { width: 1920, height: 1080 };
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // Set the HTML content directly
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Wait a moment for any GSAP animations to start + videos to render first frame
    await page.waitForTimeout(800);

    // Capture screenshot
    const buffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height },
    });

    return buffer.toString('base64');
  } finally {
    await context.close();
  }
}

/**
 * Navigates to a URL and captures a PNG screenshot.
 * Used for server-rendered slide routes (e.g. /api/slide/[id]/[index]).
 * Returns the screenshot as a base64-encoded string.
 *
 * @param viewport  Optional { width, height } override (default 1920x1080).
 */
export async function captureSlideScreenshotFromUrl(
  url: string,
  viewport?: { width: number; height: number },
): Promise<string> {
  const vp = viewport ?? { width: 1920, height: 1080 };
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // Navigate to the server-rendered slide route
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait a moment for any GSAP animations to start + videos to render first frame
    await page.waitForTimeout(800);

    // Capture screenshot
    const buffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height },
    });

    return buffer.toString('base64');
  } finally {
    await context.close();
  }
}

/**
 * Cleanup — call on process exit
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
