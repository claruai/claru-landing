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

test.describe("Deck Agent Modes — Mode Switching Flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("mode tabs switch correctly and update chips and placeholder", async ({
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
    /*  2. Verify default mode is Design (Art Director)                */
    /* -------------------------------------------------------------- */

    // The Design tab should have accent-colored text and border.
    // MODE_TABS: Strategy | Design | Build
    // Active tab class includes: text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]

    const designTab = page.locator("button").filter({ hasText: "Design" });
    const strategyTab = page.locator("button").filter({ hasText: "Strategy" });
    const buildTab = page.locator("button").filter({ hasText: "Build" });

    await expect(designTab).toBeVisible({ timeout: 5_000 });
    await expect(strategyTab).toBeVisible({ timeout: 5_000 });
    await expect(buildTab).toBeVisible({ timeout: 5_000 });

    // Design tab should be active — has accent color border
    await expect(designTab).toHaveClass(/text-\[var\(--accent-primary\)\]/, {
      timeout: 3_000,
    });

    // Verify Art Director suggestion chips are shown
    await expect(
      page.locator("button").filter({ hasText: "Redesign this slide" })
    ).toBeVisible({ timeout: 5_000 });
    await expect(
      page.locator("button").filter({ hasText: "Show me 3 options" })
    ).toBeVisible({ timeout: 5_000 });

    /* -------------------------------------------------------------- */
    /*  3. Click Strategy tab, verify active state changes             */
    /* -------------------------------------------------------------- */

    await strategyTab.click();

    // Strategy tab should now be active
    await expect(strategyTab).toHaveClass(
      /text-\[var\(--accent-primary\)\]/,
      { timeout: 3_000 }
    );

    // Design tab should no longer be active
    await expect(designTab).toHaveClass(/text-\[var\(--text-muted\)\]/, {
      timeout: 3_000,
    });

    // Verify Strategy suggestion chips appear
    await expect(
      page.locator("button").filter({ hasText: "Build a sales deck" })
    ).toBeVisible({ timeout: 5_000 });
    await expect(
      page.locator("button").filter({ hasText: "Restructure the flow" })
    ).toBeVisible({ timeout: 5_000 });

    // Art Director chips should be gone
    await expect(
      page.locator("button").filter({ hasText: "Redesign this slide" })
    ).toBeHidden();

    /* -------------------------------------------------------------- */
    /*  4. Click Build tab, verify active state and chips change       */
    /* -------------------------------------------------------------- */

    await buildTab.click();

    // Build tab should now be active
    await expect(buildTab).toHaveClass(/text-\[var\(--accent-primary\)\]/, {
      timeout: 3_000,
    });

    // Strategy tab should no longer be active
    await expect(strategyTab).toHaveClass(/text-\[var\(--text-muted\)\]/, {
      timeout: 3_000,
    });

    // Verify Page Builder suggestion chips appear
    await expect(
      page.locator("button").filter({ hasText: "Make heading bigger" })
    ).toBeVisible({ timeout: 5_000 });
    await expect(
      page.locator("button").filter({ hasText: "Fix the spacing" })
    ).toBeVisible({ timeout: 5_000 });

    // Strategy chips should be gone
    await expect(
      page.locator("button").filter({ hasText: "Build a sales deck" })
    ).toBeHidden();

    /* -------------------------------------------------------------- */
    /*  5. Verify textarea placeholder changes for Build mode          */
    /* -------------------------------------------------------------- */

    // Page Builder placeholder: "Change the heading font to 64px and fix the padding..."
    const textarea = page.locator("textarea");
    await expect(textarea).toHaveAttribute(
      "placeholder",
      /Change the heading font/
    );

    /* -------------------------------------------------------------- */
    /*  6. Click Design tab, verify mode switches back                 */
    /* -------------------------------------------------------------- */

    await designTab.click();

    // Design tab active again
    await expect(designTab).toHaveClass(/text-\[var\(--accent-primary\)\]/, {
      timeout: 3_000,
    });

    // Build tab inactive
    await expect(buildTab).toHaveClass(/text-\[var\(--text-muted\)\]/, {
      timeout: 3_000,
    });

    // Art Director chips should be back
    await expect(
      page.locator("button").filter({ hasText: "Redesign this slide" })
    ).toBeVisible({ timeout: 5_000 });

    // Build chips should be gone
    await expect(
      page.locator("button").filter({ hasText: "Make heading bigger" })
    ).toBeHidden();

    // Placeholder should change back to Art Director
    await expect(textarea).toHaveAttribute(
      "placeholder",
      /Redesign this slide with a bold stats layout/
    );
  });
});
