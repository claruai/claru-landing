import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "team@claru.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qweqwe123!";

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

  // The login endpoint sets an admin-token cookie via Set-Cookie header.
  // Playwright automatically picks up cookies from the response domain, but
  // if the cookie is missing we fall back to manually parsing the header.
  const setCookie = response.headers()["set-cookie"] ?? "";
  if (setCookie.includes("admin-token=")) {
    const tokenValue = setCookie.split("admin-token=")[1]?.split(";")[0] ?? "";
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
/*  Cleanup helper — delete a template by name via API                 */
/* ------------------------------------------------------------------ */

async function deleteTemplateByName(
  page: Page,
  name: string
): Promise<void> {
  const listRes = await page.request.get(`/api/admin/deck-builder`);
  if (!listRes.ok()) return;

  const { templates } = (await listRes.json()) as {
    templates: { id: string; name: string }[];
  };

  for (const t of templates) {
    if (t.name === name) {
      await page.request.delete(`/api/admin/deck-builder/${t.id}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Test suite                                                         */
/* ------------------------------------------------------------------ */

test.describe("Deck Builder CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  /* ================================================================ */
  /*  Full template lifecycle                                          */
  /* ================================================================ */

  test("full template lifecycle: seed demo, create, edit, duplicate, delete", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    // Clean up any leftover test templates from previous runs
    await deleteTemplateByName(page, "Test Sales Deck");
    await deleteTemplateByName(page, "Test Sales Deck (Copy)");

    /* -------------------------------------------------------------- */
    /*  1. Navigate to deck builder                                    */
    /* -------------------------------------------------------------- */

    await page.goto("/admin/deck-builder");
    await page.waitForLoadState("networkidle");

    /* -------------------------------------------------------------- */
    /*  2. Seed demo deck if empty state is shown                      */
    /* -------------------------------------------------------------- */

    const loadDemoButton = page.getByRole("button", {
      name: /Load Demo Deck/i,
    });
    const isEmpty = await loadDemoButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (isEmpty) {
      await loadDemoButton.click();

      // Wait for the seed API response
      await page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/admin/deck-builder/seed") &&
          resp.status() < 400,
        { timeout: 15_000 }
      );

      // The page does router.refresh() — wait for network to settle
      await page.waitForLoadState("networkidle");
    }

    /* -------------------------------------------------------------- */
    /*  3. Verify demo deck appears                                    */
    /* -------------------------------------------------------------- */

    // The demo deck name contains "Claru Sales Deck"
    await expect(
      page.locator("h3").filter({ hasText: /Claru Sales Deck/i })
    ).toBeVisible({ timeout: 10_000 });

    /* -------------------------------------------------------------- */
    /*  4. Create a new template                                       */
    /* -------------------------------------------------------------- */

    // Click "[+ new template]" button to reveal the inline create input
    const newTemplateButton = page.locator("button").filter({
      hasText: /\+ new template/i,
    });
    await newTemplateButton.click();

    // Fill the template name in the inline input
    const nameInput = page.locator('input[placeholder="Template name..."]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("Test Sales Deck");

    // Press Enter to submit (or click [create])
    await nameInput.press("Enter");

    /* -------------------------------------------------------------- */
    /*  5. Verify redirect to editor page                              */
    /* -------------------------------------------------------------- */

    await page.waitForURL(/\/admin\/deck-builder\/[a-f0-9-]+/, {
      timeout: 15_000,
    });

    /* -------------------------------------------------------------- */
    /*  6. Verify template name in editor header                       */
    /* -------------------------------------------------------------- */

    const templateNameInput = page.locator(
      'input[placeholder="Template name..."]'
    );
    await expect(templateNameInput).toBeVisible({ timeout: 5000 });
    await expect(templateNameInput).toHaveValue("Test Sales Deck");

    /* -------------------------------------------------------------- */
    /*  7. Verify 1 default slide exists in the sorter                 */
    /* -------------------------------------------------------------- */

    // Slide sorter shows numbered thumbnails. The first slide has number "1".
    const slideNumberLabels = page.locator(
      ".font-mono.text-\\[9px\\].text-white\\/80"
    );
    await expect(slideNumberLabels).toHaveCount(1, { timeout: 5000 });

    /* -------------------------------------------------------------- */
    /*  8. Edit the slide title                                        */
    /* -------------------------------------------------------------- */

    const titleInput = page.locator('input[placeholder="Slide title..."]');
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill("Welcome to Claru");
    await expect(titleInput).toHaveValue("Welcome to Claru");

    /* -------------------------------------------------------------- */
    /*  9. Add a new slide                                             */
    /* -------------------------------------------------------------- */

    const addSlideButton = page.locator("button").filter({
      hasText: /add slide/i,
    });
    await expect(addSlideButton).toBeVisible();
    await addSlideButton.click();

    // After adding, there should be 2 slide thumbnails
    await expect(slideNumberLabels).toHaveCount(2, { timeout: 5000 });

    /* -------------------------------------------------------------- */
    /*  10. Wait for autosave or manually save                         */
    /* -------------------------------------------------------------- */

    const saveButton = page.locator("button").filter({ hasText: /^save$/i });
    await saveButton.click();

    // Wait for "Saved" status
    await expect(
      page.locator("span").filter({ hasText: /^Saved$/i })
    ).toBeVisible({ timeout: 10_000 });

    /* -------------------------------------------------------------- */
    /*  11. Go back to the template list                               */
    /* -------------------------------------------------------------- */

    await page.goto("/admin/deck-builder");
    await page.waitForLoadState("networkidle");

    /* -------------------------------------------------------------- */
    /*  12. Verify "Test Sales Deck" appears in the list               */
    /* -------------------------------------------------------------- */

    await expect(
      page.locator("h3").filter({ hasText: "Test Sales Deck" })
    ).toBeVisible({ timeout: 10_000 });

    /* -------------------------------------------------------------- */
    /*  13. Duplicate the template                                     */
    /* -------------------------------------------------------------- */

    // Find the card containing "Test Sales Deck" (not a copy)
    const testDeckCard = page
      .locator(".group.rounded-xl")
      .filter({ hasText: "Test Sales Deck" })
      .filter({ hasNotText: "(Copy)" })
      .first();

    const duplicateButton = testDeckCard.locator("button").filter({
      hasText: /\[duplicate\]/i,
    });
    await expect(duplicateButton).toBeVisible({ timeout: 5000 });
    await duplicateButton.click();

    // Wait for the duplicate API call and page refresh
    await page.waitForResponse(
      (resp) =>
        resp.url().includes("/duplicate") && resp.status() < 400,
      { timeout: 10_000 }
    );
    await page.waitForLoadState("networkidle");

    // Verify the copy appears
    await expect(
      page.locator("h3").filter({ hasText: "Test Sales Deck (Copy)" })
    ).toBeVisible({ timeout: 10_000 });

    /* -------------------------------------------------------------- */
    /*  14. Delete the copy                                            */
    /* -------------------------------------------------------------- */

    // Find the card for the copy
    const copyCard = page
      .locator(".group.rounded-xl")
      .filter({ hasText: "Test Sales Deck (Copy)" })
      .first();

    const deleteButton = copyCard.locator("button").filter({
      hasText: /\[delete\]/i,
    });
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await deleteButton.click();

    // Confirm in the delete dialog — the confirm button has text "[confirm delete]"
    const confirmDeleteButton = page.locator("button").filter({
      hasText: /\[confirm delete\]/i,
    });
    await expect(confirmDeleteButton).toBeVisible({ timeout: 5000 });
    await confirmDeleteButton.click();

    // Wait for delete API call and page refresh
    await page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/admin/deck-builder/") &&
        resp.request().method() === "DELETE",
      { timeout: 10_000 }
    );
    await page.waitForLoadState("networkidle");

    // Verify the copy is gone
    await expect(
      page.locator("h3").filter({ hasText: "Test Sales Deck (Copy)" })
    ).toBeHidden({ timeout: 10_000 });

    // Verify the original "Test Sales Deck" still exists
    await expect(
      page.locator("h3").filter({ hasText: "Test Sales Deck" })
    ).toBeVisible();

    /* -------------------------------------------------------------- */
    /*  15. Cleanup — delete the test template                         */
    /* -------------------------------------------------------------- */

    await deleteTemplateByName(page, "Test Sales Deck");
  });

  /* ================================================================ */
  /*  Verify empty state messaging                                     */
  /* ================================================================ */

  test("empty state shows correct messaging when no templates exist", async ({
    page,
  }) => {
    test.setTimeout(30_000);

    // Delete all templates to ensure empty state
    const listRes = await page.request.get(`/api/admin/deck-builder`);
    if (listRes.ok()) {
      const { templates } = (await listRes.json()) as {
        templates: { id: string; name: string }[];
      };
      for (const t of templates) {
        await page.request.delete(`/api/admin/deck-builder/${t.id}`);
      }
    }

    await page.goto("/admin/deck-builder");
    await page.waitForLoadState("networkidle");

    // Should show "No templates yet" heading
    await expect(
      page.locator("h2").filter({ hasText: /No templates yet/i })
    ).toBeVisible({ timeout: 10_000 });

    // Should show "Create your first template" button
    await expect(
      page.getByRole("button", { name: /Create your first template/i })
    ).toBeVisible();

    // Should show "Load Demo Deck" button
    await expect(
      page.getByRole("button", { name: /Load Demo Deck/i })
    ).toBeVisible();
  });

  /* ================================================================ */
  /*  Verify create template validation                                */
  /* ================================================================ */

  test("create template shows error for empty name", async ({ page }) => {
    test.setTimeout(30_000);

    await page.goto("/admin/deck-builder");
    await page.waitForLoadState("networkidle");

    // Click "[+ new template]" to reveal the input
    const newTemplateButton = page.locator("button").filter({
      hasText: /\+ new template/i,
    });

    // The button might not be visible if we're in empty state, in which case
    // "Create your first template" is shown instead. Handle both cases.
    const hasNewTemplateBtn = await newTemplateButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasNewTemplateBtn) {
      await newTemplateButton.click();
    } else {
      // Click the "Create your first template" button in the empty state to
      // reveal the inline input
      const createFirstButton = page.getByRole("button", {
        name: /Create your first template/i,
      });
      if (await createFirstButton.isVisible()) {
        await createFirstButton.click();
      }
    }

    // The inline input should now be visible
    const nameInput = page.locator('input[placeholder="Template name..."]');
    const isInputVisible = await nameInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (isInputVisible) {
      // Leave it empty and try to create
      await nameInput.fill("");
      const createButton = page.locator("button").filter({
        hasText: /\[create\]/i,
      });
      await createButton.click();

      // Should see "Name is required" error
      await expect(
        page.locator("text=Name is required")
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
