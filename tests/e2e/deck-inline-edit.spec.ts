import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@claru.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qweqwe123!";

/** The known template ID used for the inline-edit E2E test. */
const TEMPLATE_ID = "54f7930f-cf81-4c0d-8f66-28ddaf93476a";

/** Slide 12 (0-indexed 11) — a layout slide with heading "Next Steps". */
const TARGET_SLIDE_INDEX = 11;

/* ------------------------------------------------------------------ */
/*  Auth helper — logs in via the admin login API and sets the cookie  */
/* ------------------------------------------------------------------ */

async function loginAsAdmin(page: Page): Promise<void> {
  const baseURL = page.context().pages()[0]?.url()
    ? new URL(page.url()).origin
    : "http://localhost:3005";

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

test.describe("Deck Inline Text Editing", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("double-click heading in slide 12 to edit inline, append text, verify toast", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    /* ================================================================ */
    /*  1. Navigate to the deck builder editor for the template         */
    /* ================================================================ */

    await page.goto(`/admin/deck-builder/${TEMPLATE_ID}`);
    await page.waitForLoadState("networkidle");

    // Wait for the slide sorter to render with slide thumbnails
    await expect(
      page.locator("[data-slide-index]").first(),
    ).toBeVisible({ timeout: 15_000 });

    /* ================================================================ */
    /*  2. Click slide 12 (index 11) in the slide sorter                */
    /* ================================================================ */

    const slide12 = page.locator(`[data-slide-index="${TARGET_SLIDE_INDEX}"]`);
    await slide12.scrollIntoViewIfNeeded();
    await slide12.click();

    // Verify the slide is selected (has the accent-primary border)
    await expect(slide12).toHaveClass(/border-\[var\(--accent-primary\)\]/, {
      timeout: 5_000,
    });

    /* ================================================================ */
    /*  3. Locate the center preview iframe                             */
    /* ================================================================ */

    // The center preview iframe has title "Slide preview"
    const previewIframe = page.frameLocator('iframe[title="Slide preview"]');

    // Wait for the iframe content to load — look for any heading element
    // that contains "Next Steps"
    const heading = previewIframe.locator("h1, h2, h3").filter({
      hasText: /Next Steps/i,
    });
    await expect(heading).toBeVisible({ timeout: 15_000 });

    /* ================================================================ */
    /*  4. Double-click on the heading text to enter edit mode           */
    /* ================================================================ */

    await heading.dblclick();

    /* ================================================================ */
    /*  5. Verify the element has contentEditable='true'                 */
    /* ================================================================ */

    // Use evaluate inside the iframe to check contentEditable
    const isEditable = await heading.evaluate(
      (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isEditable).toBe(true);

    /* ================================================================ */
    /*  6. Type ' — Updated' to append text                             */
    /* ================================================================ */

    // Move cursor to end of text first
    await heading.press("End");
    await heading.type(" — Updated");

    /* ================================================================ */
    /*  7. Click elsewhere in the iframe to commit the edit              */
    /* ================================================================ */

    // Click the body of the iframe to trigger blur/click-outside
    const iframeBody = previewIframe.locator("body");
    await iframeBody.click({ position: { x: 10, y: 10 } });

    /* ================================================================ */
    /*  8. Verify toast "Text updated" appears                           */
    /* ================================================================ */

    // The toast renders in the parent page (not iframe) with format "> Text updated"
    await expect(
      page.locator("text=Text updated"),
    ).toBeVisible({ timeout: 10_000 });
  });
});
