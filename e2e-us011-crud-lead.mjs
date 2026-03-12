/**
 * US-011: E2E Test — Create, Edit, Delete Lead Flow
 *
 * Uses fetch to test the full CRUD lifecycle for leads via the admin API
 * at http://localhost:3001/api/admin/leads
 *
 * This test exercises the same backend endpoints that the Playwright browser
 * test would trigger through the UI. Browsers crash on this macOS machine
 * due to a Mach bootstrap_check_in conflict with the running Chrome instance,
 * so we drive the API layer directly.
 */

const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'team@claru.ai';
const ADMIN_PASSWORD = 'qweqwe123!';
const TEST_NAME = 'Test E2E User';
const TEST_EMAIL = 'test-e2e-crud@example.com';
const TEST_COMPANY = 'Test Corp';
const UPDATED_COMPANY = 'Updated Corp';

let adminCookie = '';
let createdLeadId = '';

async function step(name, fn) {
  process.stdout.write(`  ${name}...`);
  try {
    await fn();
    console.log(' [PASS]');
  } catch (err) {
    console.log(' [FAIL]');
    throw err;
  }
}

async function run() {
  console.log('=== US-011: E2E Test — Create, Edit, Delete Lead Flow ===\n');

  let allPassed = true;

  try {
    // ─── STEP 1: LOGIN ────────────────────────────────────────────
    console.log('[1/5] Authenticate as admin');
    await step('POST /api/admin/login', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
        redirect: 'manual',
      });
      if (!res.ok) throw new Error(`Login failed with ${res.status}: ${await res.text()}`);
      const body = await res.json();
      if (!body.success) throw new Error('Login response missing success:true');
      // Extract the admin-token cookie from Set-Cookie header
      const setCookies = res.headers.getSetCookie?.() ?? [res.headers.get('set-cookie')].filter(Boolean);
      for (const c of setCookies) {
        if (c.startsWith('admin-token=')) {
          adminCookie = c.split(';')[0]; // "admin-token=..."
          break;
        }
      }
      if (!adminCookie) throw new Error('No admin-token cookie received');
    });
    console.log('');

    // ─── STEP 2: CLEANUP — delete any existing test lead ─────────
    console.log('[2/5] Cleanup any pre-existing test lead');
    await step('Check for stale test lead', async () => {
      // Fetch leads page to find any existing test lead
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        method: 'GET',
        headers: { Cookie: adminCookie },
      });
      // If there's no GET endpoint for listing, skip cleanup
      if (res.status === 405) {
        console.log('\n    (No GET /api/admin/leads endpoint — skipping pre-cleanup)');
        return;
      }
      // Try parsing response to find existing leads with our test email
      // Since the leads list is rendered server-side, we'll just try creating
      // and handle the 409 if it already exists
    });
    console.log('');

    // ─── STEP 3: CREATE ──────────────────────────────────────────
    console.log('[3/5] Test CREATE flow');

    await step('POST /api/admin/leads (create lead)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          name: TEST_NAME,
          email: TEST_EMAIL,
          company: TEST_COMPANY,
        }),
      });

      if (res.status === 409) {
        // Lead already exists from a previous failed run — need to find & delete it first
        console.log('\n    Lead already exists (409). Looking up existing lead to clean up...');
        // We need to find the lead ID. Let's load the admin page HTML to extract it
        const leadsPageRes = await fetch(`${BASE_URL}/admin/leads`, {
          headers: { Cookie: adminCookie },
        });
        const html = await leadsPageRes.text();
        // Look for the lead's detail link in the HTML
        const idMatch = html.match(/\/admin\/leads\/([a-f0-9-]+).*?test-e2e-crud/s)
          || html.match(/test-e2e-crud.*?\/admin\/leads\/([a-f0-9-]+)/s);
        if (idMatch) {
          const existingId = idMatch[1];
          console.log(`    Found existing lead: ${existingId}. Deleting...`);
          const delRes = await fetch(`${BASE_URL}/api/admin/leads/${existingId}`, {
            method: 'DELETE',
            headers: { Cookie: adminCookie },
          });
          if (!delRes.ok) console.log(`    Warning: delete returned ${delRes.status}`);
          else console.log('    Cleaned up. Retrying create...');

          // Retry create
          const retryRes = await fetch(`${BASE_URL}/api/admin/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: adminCookie,
            },
            body: JSON.stringify({
              name: TEST_NAME,
              email: TEST_EMAIL,
              company: TEST_COMPANY,
            }),
          });
          if (!retryRes.ok) throw new Error(`Retry create failed: ${retryRes.status} ${await retryRes.text()}`);
          const retryBody = await retryRes.json();
          createdLeadId = retryBody.lead.id;
        } else {
          throw new Error('Could not find existing lead ID to clean up');
        }
      } else if (!res.ok) {
        throw new Error(`Create failed: ${res.status} ${await res.text()}`);
      } else {
        const body = await res.json();
        createdLeadId = body.lead.id;
      }

      if (!createdLeadId) throw new Error('No lead ID returned from create');
      console.log(`\n    Created lead ID: ${createdLeadId}`);
    });

    await step('GET /api/admin/leads/[id] (verify create)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}`, {
        headers: { Cookie: adminCookie },
      });
      if (!res.ok) throw new Error(`GET lead failed: ${res.status}`);
      const body = await res.json();
      if (body.lead.name !== TEST_NAME) throw new Error(`Name mismatch: ${body.lead.name}`);
      if (body.lead.email !== TEST_EMAIL) throw new Error(`Email mismatch: ${body.lead.email}`);
      if (body.lead.company !== TEST_COMPANY) throw new Error(`Company mismatch: ${body.lead.company}`);
      console.log(`\n    Verified: name="${body.lead.name}", email="${body.lead.email}", company="${body.lead.company}"`);
    });

    await step('Verify lead in HTML table', async () => {
      const res = await fetch(`${BASE_URL}/admin/leads`, {
        headers: { Cookie: adminCookie },
      });
      const html = await res.text();
      if (!html.includes(TEST_EMAIL) && !html.includes(TEST_NAME)) {
        throw new Error('Lead not found in rendered HTML table');
      }
      console.log(`\n    Verified: "${TEST_NAME}" / "${TEST_EMAIL}" present in server-rendered leads page`);
    });
    console.log('');

    // ─── STEP 4: EDIT ────────────────────────────────────────────
    console.log('[4/5] Test EDIT flow');

    await step(`PATCH /api/admin/leads/[id] (update company to "${UPDATED_COMPANY}")`, async () => {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({ company: UPDATED_COMPANY }),
      });
      if (!res.ok) throw new Error(`PATCH failed: ${res.status} ${await res.text()}`);
      const body = await res.json();
      if (body.lead.company !== UPDATED_COMPANY) {
        throw new Error(`Company not updated: got "${body.lead.company}", expected "${UPDATED_COMPANY}"`);
      }
    });

    await step('GET /api/admin/leads/[id] (verify edit)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}`, {
        headers: { Cookie: adminCookie },
      });
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const body = await res.json();
      if (body.lead.company !== UPDATED_COMPANY) {
        throw new Error(`Company still "${body.lead.company}" instead of "${UPDATED_COMPANY}"`);
      }
      console.log(`\n    Verified: company="${body.lead.company}"`);
    });

    await step('Verify updated value in HTML detail page', async () => {
      const res = await fetch(`${BASE_URL}/admin/leads/${createdLeadId}`, {
        headers: { Cookie: adminCookie },
      });
      const html = await res.text();
      if (!html.includes(UPDATED_COMPANY)) {
        throw new Error(`"${UPDATED_COMPANY}" not found in lead detail page HTML`);
      }
      console.log(`\n    Verified: "${UPDATED_COMPANY}" present in server-rendered detail page`);
    });
    console.log('');

    // ─── STEP 5: DELETE ──────────────────────────────────────────
    console.log('[5/5] Test DELETE flow');

    await step('DELETE /api/admin/leads/[id]', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}`, {
        method: 'DELETE',
        headers: { Cookie: adminCookie },
      });
      if (!res.ok) throw new Error(`DELETE failed: ${res.status} ${await res.text()}`);
      const body = await res.json();
      if (body.message !== 'Lead deleted') throw new Error(`Unexpected response: ${JSON.stringify(body)}`);
    });

    await step('GET /api/admin/leads/[id] (verify 404)', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}`, {
        headers: { Cookie: adminCookie },
      });
      if (res.status !== 404) {
        throw new Error(`Expected 404 after delete, got ${res.status}`);
      }
    });

    await step('Verify lead absent from HTML table', async () => {
      const res = await fetch(`${BASE_URL}/admin/leads`, {
        headers: { Cookie: adminCookie },
      });
      const html = await res.text();
      if (html.includes(TEST_EMAIL)) {
        throw new Error(`"${TEST_EMAIL}" still appears in leads page after deletion`);
      }
      console.log(`\n    Verified: "${TEST_EMAIL}" no longer in server-rendered leads page`);
    });
    console.log('');

    // ─── SUMMARY ─────────────────────────────────────────────────
    console.log('======================================================');
    console.log('  ALL TESTS PASSED');
    console.log('  [PASS] Authentication (Login)');
    console.log('  [PASS] Create Lead (POST + verify GET + verify HTML)');
    console.log('  [PASS] Edit Lead (PATCH + verify GET + verify HTML)');
    console.log('  [PASS] Delete Lead (DELETE + verify 404 + verify HTML)');
    console.log('======================================================');

  } catch (error) {
    allPassed = false;
    console.error(`\n[FAIL] ${error.message}`);
    if (error.stack) console.error(error.stack);
    process.exitCode = 1;
  }
}

run();
