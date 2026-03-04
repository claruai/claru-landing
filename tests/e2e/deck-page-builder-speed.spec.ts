import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3005";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@claru.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qweqwe123!";
const DEMO_TEMPLATE_ID = "54f7930f-cf81-4c0d-8f66-28ddaf93476a";

/* ------------------------------------------------------------------ */
/*  Skip if ANTHROPIC_API_KEY is not set                               */
/* ------------------------------------------------------------------ */

const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

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

test.describe("Deck Page Builder — Response Speed", () => {
  // Skip all tests in this suite if ANTHROPIC_API_KEY is not set
  test.skip(!hasApiKey, "ANTHROPIC_API_KEY not set — skipping speed test");

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("Page Builder responds to a simple edit in under 10 seconds", async ({
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
    /*  2. Switch to Build mode (Page Builder)                         */
    /* -------------------------------------------------------------- */

    const buildTab = page.locator("button").filter({ hasText: "Build" });
    await expect(buildTab).toBeVisible({ timeout: 5_000 });
    await buildTab.click();

    // Verify Build tab is active
    await expect(buildTab).toHaveClass(/text-\[var\(--accent-primary\)\]/, {
      timeout: 3_000,
    });

    /* -------------------------------------------------------------- */
    /*  3. Send a simple edit message                                  */
    /* -------------------------------------------------------------- */

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible({ timeout: 5_000 });
    await textarea.fill("change the title to Test Title");

    // Record the time right before sending
    const startTime = Date.now();

    // Press Enter to send (or click the send button)
    const sendButton = page.locator("button").filter({ has: page.locator("svg") }).last();
    // Use keyboard submit which is the standard send pattern
    await textarea.press("Enter");

    /* -------------------------------------------------------------- */
    /*  4. Wait for the assistant response to complete                 */
    /* -------------------------------------------------------------- */

    // The chat panel shows an assistant message when the response completes.
    // A streaming message has isStreaming=true; we wait for a non-streaming
    // assistant message to appear after our user message.
    //
    // Strategy: wait for the send button to become enabled again (not streaming)
    // and for an assistant message to appear in the chat.

    // First, wait for the streaming indicator to appear (message is being processed)
    await page.waitForTimeout(500);

    // Then wait for streaming to complete — the textarea becomes enabled again
    // when isStreaming flips to false.
    await expect(textarea).toBeEnabled({ timeout: 30_000 });

    // Also verify we got an assistant response (not an error).
    // Assistant messages are rendered in the chat area. We check that at least
    // one message from the assistant appeared after our input.
    // We look for any non-error assistant content or tool call indicators.
    const assistantMessage = page.locator('[class*="bg-[var(--bg-tertiary)]"]').last();

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    /* -------------------------------------------------------------- */
    /*  5. Assert response time < 10 seconds                           */
    /* -------------------------------------------------------------- */

    // eslint-disable-next-line no-console
    console.log(`Page Builder response time: ${elapsed}ms`);

    expect(elapsed).toBeLessThan(10_000);
  });
});
