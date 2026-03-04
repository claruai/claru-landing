import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3005";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@claru.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qweqwe123!";
const DEMO_TEMPLATE_ID = "54f7930f-cf81-4c0d-8f66-28ddaf93476a";

/* ------------------------------------------------------------------ */
/*  Auth helper — logs in via the admin login API and sets the cookie  */
/* ------------------------------------------------------------------ */

async function loginAsAdmin(page: Page): Promise<void> {
  const response = await page.request.post(`${BASE_URL}/api/admin/login`, {
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  expect(response.ok()).toBeTruthy();

  // The login endpoint sets an admin-token cookie via Set-Cookie header.
  // Playwright automatically picks up cookies from the response domain, but
  // if the cookie is missing we fall back to manually parsing the header.
  const setCookie = response.headers()["set-cookie"] ?? "";
  if (setCookie.includes("admin-token=")) {
    const tokenValue =
      setCookie.split("admin-token=")[1]?.split(";")[0] ?? "";
    if (tokenValue) {
      const url = new URL(BASE_URL);
      await page.context().addCookies([
        {
          name: "admin-token",
          value: tokenValue,
          domain: url.hostname,
          path: "/",
        },
      ]);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Test suite                                                         */
/* ------------------------------------------------------------------ */

test.describe("Deck Editor Media — Preview Iframe", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("slide 6 preview shows video elements with proxy URLs and no errors", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    /* -------------------------------------------------------------- */
    /*  1. Navigate to the deck editor for the demo template           */
    /* -------------------------------------------------------------- */

    await page.goto(
      `${BASE_URL}/admin/deck-builder/${DEMO_TEMPLATE_ID}`
    );
    await page.waitForLoadState("networkidle");

    // Verify we're on the editor page
    const templateNameInput = page.locator(
      'input[placeholder="Template name..."]'
    );
    await expect(templateNameInput).toBeVisible({ timeout: 15_000 });

    /* -------------------------------------------------------------- */
    /*  2. Click on slide 6 thumbnail in the left sidebar              */
    /* -------------------------------------------------------------- */

    // Slide thumbnails have a data-slide-index attribute.
    // Slide 6 is index 5 (0-based).
    const slide6Thumbnail = page.locator('[data-slide-index="5"]');
    await expect(slide6Thumbnail).toBeVisible({ timeout: 10_000 });
    await slide6Thumbnail.click();

    // Verify selection — the thumbnail should have the accent border
    await expect(slide6Thumbnail).toHaveClass(/border-\[var\(--accent-primary\)\]/, {
      timeout: 3_000,
    });

    /* -------------------------------------------------------------- */
    /*  3. Wait for the preview iframe to update                       */
    /* -------------------------------------------------------------- */

    // The preview uses a debounced srcdoc iframe with title "Slide Preview".
    // Wait for the iframe to appear and have content.
    const previewIframe = page.frameLocator('iframe[title="Slide Preview"]');

    // Wait for the iframe to have loaded content — the presentation
    // renderer creates a .stage element inside the iframe.
    await expect(
      previewIframe.locator(".stage, .slide, [class*='slide']").first()
    ).toBeVisible({ timeout: 15_000 });

    /* -------------------------------------------------------------- */
    /*  4. Find video elements in the preview iframe                   */
    /* -------------------------------------------------------------- */

    // Wait for video elements to appear in the iframe.
    // The preview navigates to the selected slide via postMessage, so
    // video elements should be present in the current slide's HTML.
    await expect(previewIframe.locator("video").first()).toBeVisible({
      timeout: 15_000,
    });

    /* -------------------------------------------------------------- */
    /*  5. Assert video src or source elements use proxy URLs          */
    /* -------------------------------------------------------------- */

    // Check that video elements reference the S3 media proxy.
    // Videos can have src attribute directly or <source> child elements.
    const hasProxyUrls = await previewIframe.locator("video").first().evaluate(
      (container: HTMLVideoElement) => {
        // Collect all video-related URLs
        const urls: string[] = [];

        // Check direct src on the video element itself and all videos
        const allVideos = container.ownerDocument.querySelectorAll("video");
        for (const video of allVideos) {
          if (video.src) urls.push(video.src);
          if (video.currentSrc) urls.push(video.currentSrc);
          // Check <source> child elements
          const sources = video.querySelectorAll("source");
          for (const source of sources) {
            if (source.src) urls.push(source.src);
          }
        }

        // At least one URL should contain the proxy pattern
        return urls.some((url) => url.includes("/api/media/s3?key="));
      }
    );

    expect(hasProxyUrls).toBe(true);

    /* -------------------------------------------------------------- */
    /*  6. Assert no video has networkState === 3 (error)              */
    /* -------------------------------------------------------------- */

    // Use page.evaluate on the iframe's content to check all videos.
    // frameLocator doesn't support evaluateAll directly, so we check
    // via the first video element's ownerDocument.
    const hasVideoError = await previewIframe
      .locator("video")
      .first()
      .evaluate((el: HTMLVideoElement) => {
        const videos = el.ownerDocument.querySelectorAll("video");
        return Array.from(videos).some((v) => v.networkState === 3);
      });

    expect(hasVideoError).toBe(false);
  });
});
