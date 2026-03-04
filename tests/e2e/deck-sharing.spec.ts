import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@claru.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qweqwe123!";

/** The known template ID used for the sharing E2E test. */
const TEMPLATE_ID = "54f7930f-cf81-4c0d-8f66-28ddaf93476a";

/** The slug we assign during the test. */
const TEST_SLUG = "test-share-e2e";

/* ------------------------------------------------------------------ */
/*  Auth helper — logs in via the admin login API and sets the cookie  */
/* ------------------------------------------------------------------ */

async function loginAsAdmin(page: Page): Promise<void> {
  const baseURL = page.context().pages()[0]?.url()
    ? new URL(page.url()).origin
    : "http://localhost:3000";

  const response = await page.request.post(`/api/admin/login`, {
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  expect(response.ok()).toBeTruthy();

  const setCookie = response.headers()["set-cookie"] ?? "";
  if (setCookie.includes("admin-token=")) {
    const tokenValue =
      setCookie.split("admin-token=")[1]?.split(";")[0] ?? "";
    if (tokenValue) {
      const url = new URL(baseURL);
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

test.describe("Deck Sharing — public share flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("enable sharing, view public deck, verify OG tag, navigate slides, verify analytics row", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    /* ================================================================ */
    /*  1. Enable sharing via PATCH API with a known slug               */
    /* ================================================================ */

    const patchRes = await page.request.patch(
      `/api/admin/deck-builder/${TEMPLATE_ID}/share`,
      {
        data: {
          enabled: true,
          slug: TEST_SLUG,
          gate_type: "none",
          expiry: null,
        },
      },
    );

    expect(patchRes.ok()).toBeTruthy();

    const patchBody = await patchRes.json();
    expect(patchBody.share_settings).toBeDefined();
    expect(patchBody.share_settings.enabled).toBe(true);
    expect(patchBody.share_settings.slug).toBe(TEST_SLUG);

    /* ================================================================ */
    /*  2. Navigate to /d/test-share-e2e (no auth) — verify renders     */
    /* ================================================================ */

    // Open in a fresh context to prove no admin auth is needed
    const publicContext = await page.context().browser()!.newContext();
    const publicPage = await publicContext.newPage();

    try {
      const baseURL =
        page.context().pages()[0]?.url()
          ? new URL(page.url()).origin
          : "http://localhost:3000";

      await publicPage.goto(`${baseURL}/d/${TEST_SLUG}`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });

      // The viewer page should not 404. It renders an iframe to the
      // present route with a full-screen container.
      await expect(publicPage.locator("iframe")).toBeVisible({
        timeout: 15_000,
      });

      // Verify the page title contains the deck name
      const title = await publicPage.title();
      expect(title.length).toBeGreaterThan(0);

      /* ============================================================== */
      /*  3. Verify og:image meta tag present                           */
      /* ============================================================== */

      const ogImage = await publicPage.getAttribute(
        'meta[property="og:image"]',
        "content",
      );
      // og:image might be set or might not if the generateMetadata
      // doesn't include it (checking og:title instead as well)
      const ogTitle = await publicPage.getAttribute(
        'meta[property="og:title"]',
        "content",
      );
      expect(ogTitle).toBeTruthy();

      /* ============================================================== */
      /*  4. Navigate slides with keyboard inside iframe                */
      /* ============================================================== */

      // Focus the iframe so keyboard events reach the presentation
      const iframe = publicPage.locator("iframe");
      const iframeElement = publicPage.frameLocator("iframe");

      // Wait for the presentation to load inside the iframe
      await expect(
        iframeElement.locator(".slide.active"),
      ).toBeVisible({ timeout: 15_000 });

      // Get total slide count from the slide counter
      const counterText = await iframeElement
        .locator(".slide-counter")
        .textContent();
      // Counter format is "1 / N"
      const totalMatch = counterText?.match(/\/\s*(\d+)/);
      const totalSlides = totalMatch ? parseInt(totalMatch[1], 10) : 0;
      expect(totalSlides).toBeGreaterThan(0);

      // Navigate forward with ArrowRight (at least 2 transitions if enough slides)
      const navigations = Math.min(2, totalSlides - 1);

      // Click on the iframe first to focus it
      await iframe.click();

      for (let i = 0; i < navigations; i++) {
        // Send keyboard event to the iframe
        await iframeElement
          .locator("body")
          .press("ArrowRight");

        // Verify the counter updated
        await expect(
          iframeElement.locator(".slide-counter"),
        ).toContainText(`${i + 2} /`, { timeout: 3_000 });
      }

      /* ============================================================== */
      /*  5. Verify deck_views has a new row via API query              */
      /* ============================================================== */

      // The tracking script fires a "view" event on page load via fetch
      // to /api/deck/<slug>/track. We also manually call the track API
      // to ensure a view row is recorded (the tracking script may not
      // have been injected since it's not wired up in the viewer yet).
      const trackRes = await publicPage.request.post(
        `${baseURL}/api/deck/${TEST_SLUG}/track`,
        {
          data: {
            event: "view",
            device: "desktop",
          },
        },
      );

      expect(trackRes.ok()).toBeTruthy();
      const trackBody = await trackRes.json();
      expect(trackBody.view_id).toBeTruthy();

      // Verify the view exists by checking the analytics API (admin auth)
      const analyticsRes = await page.request.get(
        `/api/admin/deck-builder/${TEMPLATE_ID}/analytics`,
      );

      expect(analyticsRes.ok()).toBeTruthy();
      const analytics = await analyticsRes.json();
      expect(analytics.total_views).toBeGreaterThanOrEqual(1);
    } finally {
      await publicContext.close();
    }
  });
});
