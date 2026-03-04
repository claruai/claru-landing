import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@claru.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qweqwe123!";

/** The known template ID used for the lead-sharing E2E test. */
const TEMPLATE_ID = "54f7930f-cf81-4c0d-8f66-28ddaf93476a";

/** Unique slug for this test to avoid collision with deck-sharing.spec.ts. */
const TEST_SLUG = "test-lead-share-e2e";

/** Test lead details. */
const TEST_LEAD = {
  name: "E2E Lead Viewer",
  email: `e2e-lead-${Date.now()}@example.com`,
  company: "E2E Test Corp",
};

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

test.describe("Deck Sharing — lead share with analytics", () => {
  /** IDs created during the test, cleaned up in afterEach. */
  let leadId: string | null = null;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: delete the test lead (cascades tokens via the API)
    if (leadId) {
      await page.request.delete(`/api/admin/leads/${leadId}`);
      leadId = null;
    }
  });

  test("create lead, enable sharing, send token, view with token, verify per-lead analytics", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    /* ================================================================ */
    /*  1. Create a test lead via API                                   */
    /* ================================================================ */

    const createLeadRes = await page.request.post(`/api/admin/leads`, {
      data: {
        name: TEST_LEAD.name,
        email: TEST_LEAD.email,
        company: TEST_LEAD.company,
      },
    });

    expect(createLeadRes.status()).toBe(201);
    const createLeadBody = await createLeadRes.json();
    expect(createLeadBody.lead).toBeDefined();
    expect(createLeadBody.lead.id).toBeTruthy();
    leadId = createLeadBody.lead.id as string;

    /* ================================================================ */
    /*  2. Enable sharing on the template via PATCH API                 */
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
    expect(patchBody.share_settings.enabled).toBe(true);
    expect(patchBody.share_settings.slug).toBe(TEST_SLUG);

    /* ================================================================ */
    /*  3. Create a share token via POST .../share/send                 */
    /* ================================================================ */

    const sendRes = await page.request.post(
      `/api/admin/deck-builder/${TEMPLATE_ID}/share/send`,
      {
        data: {
          lead_ids: [leadId],
        },
      },
    );

    expect(sendRes.ok()).toBeTruthy();
    const sendBody = await sendRes.json();
    expect(sendBody.tokens).toBeDefined();
    expect(sendBody.tokens.length).toBe(1);

    const tokenObj = sendBody.tokens[0] as {
      email: string;
      token: string;
      url: string;
    };
    expect(tokenObj.token).toBeTruthy();
    expect(tokenObj.email).toBe(TEST_LEAD.email);

    const shareToken = tokenObj.token;

    /* ================================================================ */
    /*  4. Open /d/[slug]?t=[token] — verify renders                   */
    /* ================================================================ */

    // Use a fresh browser context (no admin cookies) to simulate a lead
    const leadContext = await page.context().browser()!.newContext();
    const leadPage = await leadContext.newPage();

    try {
      const baseURL =
        page.context().pages()[0]?.url()
          ? new URL(page.url()).origin
          : "http://localhost:3000";

      await leadPage.goto(
        `${baseURL}/d/${TEST_SLUG}?t=${shareToken}`,
        { waitUntil: "networkidle", timeout: 30_000 },
      );

      // Verify the presentation iframe loaded
      await expect(leadPage.locator("iframe")).toBeVisible({
        timeout: 15_000,
      });

      const iframeElement = leadPage.frameLocator("iframe");

      // Wait for the first slide to be active
      await expect(
        iframeElement.locator(".slide.active"),
      ).toBeVisible({ timeout: 15_000 });

      /* ============================================================== */
      /*  5. Record a view event via the track API (attributed to token)*/
      /* ============================================================== */

      const viewRes = await leadPage.request.post(
        `${baseURL}/api/deck/${TEST_SLUG}/track`,
        {
          data: {
            event: "view",
            token: shareToken,
            device: "desktop",
          },
        },
      );

      expect(viewRes.ok()).toBeTruthy();
      const viewBody = await viewRes.json();
      expect(viewBody.view_id).toBeTruthy();

      const viewId = viewBody.view_id as string;

      /* ============================================================== */
      /*  6. Navigate 3 slides (send slide_change events via API)       */
      /* ============================================================== */

      // Also navigate via keyboard inside the iframe for visual proof
      const iframe = leadPage.locator("iframe");
      await iframe.click();

      // Navigate forward 3 times, sending tracking events for each
      for (let i = 0; i < 3; i++) {
        await iframeElement.locator("body").press("ArrowRight");

        // Small delay to let the slide transition occur
        await leadPage.waitForTimeout(300);

        // Send slide_change tracking event
        const slideRes = await leadPage.request.post(
          `${baseURL}/api/deck/${TEST_SLUG}/track`,
          {
            data: {
              event: "slide_change",
              view_id: viewId,
              token: shareToken,
              slide_index: i,
              duration: 2,
            },
          },
        );

        expect(slideRes.ok()).toBeTruthy();
      }

      /* ============================================================== */
      /*  7. Send complete event                                        */
      /* ============================================================== */

      const completeRes = await leadPage.request.post(
        `${baseURL}/api/deck/${TEST_SLUG}/track`,
        {
          data: {
            event: "complete",
            view_id: viewId,
            token: shareToken,
            duration: 10,
          },
        },
      );

      expect(completeRes.ok()).toBeTruthy();
    } finally {
      await leadContext.close();
    }

    /* ================================================================ */
    /*  8. Fetch /api/admin/leads/[id]/deck-views — verify attributed   */
    /* ================================================================ */

    const deckViewsRes = await page.request.get(
      `/api/admin/leads/${leadId}/deck-views`,
    );

    expect(deckViewsRes.ok()).toBeTruthy();
    const deckViewsBody = await deckViewsRes.json();
    expect(deckViewsBody.views).toBeDefined();
    expect(deckViewsBody.views.length).toBeGreaterThanOrEqual(1);

    // Find the view we created (most recent, attributed to our lead)
    const leadView = deckViewsBody.views[0] as {
      id: string;
      template_id: string;
      slides_viewed: { index: number; timestamp: string; duration: number }[];
      total_duration_seconds: number;
      completion_rate: number;
      viewer_email: string;
    };

    // Verify the view is attributed to the correct lead email
    expect(leadView.viewer_email).toBe(TEST_LEAD.email);

    // Verify slides_viewed has 3 entries from our slide_change events
    expect(leadView.slides_viewed).toBeDefined();
    expect(leadView.slides_viewed.length).toBe(3);

    // Verify completion_rate was calculated (> 0 since we viewed slides)
    expect(leadView.completion_rate).toBeGreaterThan(0);

    // Verify total_duration_seconds was set from the complete event
    expect(leadView.total_duration_seconds).toBeGreaterThanOrEqual(1);
  });
});
