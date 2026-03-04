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

test.describe("Deck Video Playback — Present Mode", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("videos load and autoplay on slide 6 in presentation mode", async ({
    page,
    context,
  }) => {
    test.setTimeout(90_000);

    /* -------------------------------------------------------------- */
    /*  1. Navigate to the deck editor for the demo template           */
    /* -------------------------------------------------------------- */

    await page.goto(
      `${BASE_URL}/admin/deck-builder/${DEMO_TEMPLATE_ID}`
    );
    await page.waitForLoadState("networkidle");

    // Verify we're on the editor page (template name input should be visible)
    const templateNameInput = page.locator(
      'input[placeholder="Template name..."]'
    );
    await expect(templateNameInput).toBeVisible({ timeout: 15_000 });

    /* -------------------------------------------------------------- */
    /*  2. Click the "present" button                                  */
    /* -------------------------------------------------------------- */

    // Listen for a new page (tab) to open
    const presentPagePromise = context.waitForEvent("page", {
      timeout: 15_000,
    });

    const presentButton = page.locator("button").filter({
      hasText: /^present$/i,
    });
    await expect(presentButton).toBeVisible({ timeout: 5_000 });
    await presentButton.click();

    /* -------------------------------------------------------------- */
    /*  3. Switch to the new presentation tab                          */
    /* -------------------------------------------------------------- */

    const presentPage = await presentPagePromise;
    await presentPage.waitForLoadState("domcontentloaded");

    // Verify the presentation loaded — look for the slide stage container
    // The presentation uses a .stage element with slides inside it.
    await presentPage.waitForSelector(".stage", { timeout: 15_000 });

    /* -------------------------------------------------------------- */
    /*  4. Navigate to slide 6 (5 ArrowRight presses)                  */
    /* -------------------------------------------------------------- */

    for (let i = 0; i < 5; i++) {
      await presentPage.keyboard.press("ArrowRight");
      // Small pause between presses to let transitions complete
      await presentPage.waitForTimeout(300);
    }

    /* -------------------------------------------------------------- */
    /*  5. Wait for video elements to load (readyState >= 2)           */
    /* -------------------------------------------------------------- */

    // Wait up to 30 seconds for at least one video element to have
    // enough data loaded (readyState >= 2 means HAVE_CURRENT_DATA)
    await presentPage.waitForFunction(
      () => {
        const videos = document.querySelectorAll("video");
        if (videos.length === 0) return false;
        return Array.from(videos).some((v) => v.readyState >= 2);
      },
      { timeout: 30_000 }
    );

    /* -------------------------------------------------------------- */
    /*  6. Assert no video has networkState === 3 (NETWORK_NO_SOURCE)  */
    /* -------------------------------------------------------------- */

    const hasVideoError = await presentPage.evaluate(() => {
      const videos = document.querySelectorAll("video");
      return Array.from(videos).some((v) => v.networkState === 3);
    });

    expect(hasVideoError).toBe(false);

    /* -------------------------------------------------------------- */
    /*  7. Assert at least one video is playing (not paused)           */
    /* -------------------------------------------------------------- */

    const hasPlayingVideo = await presentPage.evaluate(() => {
      const videos = document.querySelectorAll("video");
      return Array.from(videos).some((v) => !v.paused);
    });

    expect(hasPlayingVideo).toBe(true);

    /* -------------------------------------------------------------- */
    /*  8. Cleanup — close the presentation tab                        */
    /* -------------------------------------------------------------- */

    await presentPage.close();
  });
});
