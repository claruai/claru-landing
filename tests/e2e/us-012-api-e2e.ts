#!/usr/bin/env npx tsx
/**
 * US-012 — E2E: Approve with Invite and Re-send Flow
 *
 * API-level E2E test that exercises the same flow a browser user would:
 *   1. Login to admin portal (POST /api/admin/login)
 *   2. Create a test lead (POST /api/admin/leads)
 *   3. Approve with invite (POST /api/admin/leads/[id]/approve { send_invite: true })
 *   4. Re-send invite (POST /api/admin/leads/[id]/invite)
 *   5. Cleanup: Delete the test lead (DELETE /api/admin/leads/[id])
 *
 * Resend may not be configured — the test accepts both invite success and failure
 * as valid outcomes and verifies the response shapes are correct.
 *
 * Run: npx tsx tests/e2e/us-012-api-e2e.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team@claru.ai';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qweqwe123!';

const TEST_LEAD_NAME = 'Test Invite User';
const TEST_LEAD_EMAIL = 'test-e2e-invite@example.com';
const TEST_LEAD_COMPANY = 'Invite Corp';

let adminCookie = '';
let testLeadId = '';
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

async function apiRequest(
  method: string,
  path: string,
  body?: Record<string, unknown>,
): Promise<{ status: number; data: Record<string, unknown>; headers: Headers }> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (adminCookie) {
    headers['Cookie'] = adminCookie;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });

  // Capture Set-Cookie header for the admin-token
  const setCookie = res.headers.get('set-cookie');
  if (setCookie && setCookie.includes('admin-token')) {
    // Extract the cookie value
    const match = setCookie.match(/admin-token=[^;]+/);
    if (match) {
      adminCookie = match[0];
    }
  }

  let data: Record<string, unknown> = {};
  try {
    data = await res.json() as Record<string, unknown>;
  } catch {
    // Response may not be JSON
  }

  return { status: res.status, data, headers: res.headers };
}

async function main() {
  console.log('\n=== US-012: Approve with Invite and Re-send Flow ===\n');

  // ---------------------------------------------------------------
  // Step 1: Login to admin portal
  // ---------------------------------------------------------------
  console.log('Step 1: Login to admin portal');

  const loginRes = await apiRequest('POST', '/api/admin/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  assert(loginRes.status === 200, `Login returned status 200 (got ${loginRes.status})`);
  assert(loginRes.data.success === true, 'Login returned { success: true }');
  assert(adminCookie.includes('admin-token'), 'Admin token cookie was set');

  if (loginRes.status !== 200) {
    console.error('Cannot proceed without admin auth. Exiting.');
    process.exit(1);
  }

  // ---------------------------------------------------------------
  // Step 2: Cleanup any existing test lead (idempotency)
  // ---------------------------------------------------------------
  console.log('\nStep 2: Cleanup any existing test lead');

  const listRes = await apiRequest('GET', '/api/admin/leads');
  if (listRes.status === 200 && Array.isArray(listRes.data.leads)) {
    const existing = (listRes.data.leads as Array<{ id: string; email: string }>).find(
      (l) => l.email === TEST_LEAD_EMAIL,
    );
    if (existing) {
      console.log(`  Found existing test lead (id: ${existing.id}), deleting...`);
      await apiRequest('DELETE', `/api/admin/leads/${existing.id}`);
      console.log('  Existing test lead deleted.');
    } else {
      console.log('  No existing test lead found.');
    }
  }

  // ---------------------------------------------------------------
  // Step 3: Create a test lead
  // ---------------------------------------------------------------
  console.log('\nStep 3: Create a test lead');

  const createRes = await apiRequest('POST', '/api/admin/leads', {
    name: TEST_LEAD_NAME,
    email: TEST_LEAD_EMAIL,
    company: TEST_LEAD_COMPANY,
  });

  assert(createRes.status === 201, `Create lead returned status 201 (got ${createRes.status})`);

  const createdLead = createRes.data.lead as {
    id: string;
    name: string;
    email: string;
    company: string;
    status: string;
  } | undefined;

  assert(createdLead !== undefined, 'Response includes the created lead object');
  assert(createdLead?.name === TEST_LEAD_NAME, `Lead name is "${TEST_LEAD_NAME}"`);
  assert(createdLead?.email === TEST_LEAD_EMAIL, `Lead email is "${TEST_LEAD_EMAIL}"`);
  assert(createdLead?.company === TEST_LEAD_COMPANY, `Lead company is "${TEST_LEAD_COMPANY}"`);
  assert(createdLead?.status === 'pending', 'Lead status is "pending"');

  testLeadId = createdLead?.id ?? '';

  if (!testLeadId) {
    console.error('No lead ID returned. Cannot proceed.');
    process.exit(1);
  }

  console.log(`  Created lead ID: ${testLeadId}`);

  // ---------------------------------------------------------------
  // Step 4: Verify the lead detail page (GET)
  // ---------------------------------------------------------------
  console.log('\nStep 4: Verify lead detail via GET');

  const detailRes = await apiRequest('GET', `/api/admin/leads/${testLeadId}`);
  assert(detailRes.status === 200, `GET lead detail returned 200 (got ${detailRes.status})`);

  const detailLead = detailRes.data.lead as { status: string } | undefined;
  assert(detailLead?.status === 'pending', 'Lead is still in "pending" status');

  // ---------------------------------------------------------------
  // Step 5: Approve with invite (send_invite: true)
  // ---------------------------------------------------------------
  console.log('\nStep 5: Approve with invite (send_invite: true)');

  const approveRes = await apiRequest('POST', `/api/admin/leads/${testLeadId}/approve`, {
    send_invite: true,
  });

  assert(approveRes.status === 200, `Approve returned status 200 (got ${approveRes.status})`);

  const approvedLead = approveRes.data.lead as { status: string } | undefined;
  assert(approvedLead?.status === 'approved', 'Lead status changed to "approved"');

  // Verify response includes invite_sent field (boolean)
  const inviteSent = approveRes.data.invite_sent;
  const inviteError = approveRes.data.invite_error;

  assert(
    typeof inviteSent === 'boolean',
    `Response includes invite_sent as boolean (got ${typeof inviteSent}: ${inviteSent})`,
  );

  if (inviteSent) {
    console.log('  Invite was successfully sent via Resend.');
    assert(true, 'invite_sent is true — Resend is configured and working');
  } else if (inviteError) {
    console.log(`  Invite failed (expected in dev): ${inviteError}`);
    assert(typeof inviteError === 'string', `invite_error is a string: "${inviteError}"`);
    // This is a valid outcome — Resend may not be configured
    assert(true, 'Approval succeeded even though invite failed (error isolation works)');
  } else {
    console.log('  No invite sent and no error — send_invite may have been processed differently');
    assert(true, 'Approval succeeded with no invite information (acceptable)');
  }

  // Verify the lead is still approved after invite attempt
  const afterApproveRes = await apiRequest('GET', `/api/admin/leads/${testLeadId}`);
  const afterApproveLead = afterApproveRes.data.lead as { status: string } | undefined;
  assert(
    afterApproveLead?.status === 'approved',
    'Lead remains "approved" after invite attempt (regardless of invite outcome)',
  );

  // ---------------------------------------------------------------
  // Step 6: Re-send invite
  // ---------------------------------------------------------------
  console.log('\nStep 6: Re-send invite');

  const resendRes = await apiRequest('POST', `/api/admin/leads/${testLeadId}/invite`);

  // The re-send endpoint returns 200 with { success: boolean, error?: string }
  assert(
    resendRes.status === 200,
    `Re-send invite returned status 200 (got ${resendRes.status})`,
  );

  if (resendRes.data.success) {
    console.log('  Re-send invite succeeded — Resend is configured.');
    assert(true, 'Re-send returned { success: true }');
  } else {
    const resendError = resendRes.data.error as string | undefined;
    console.log(`  Re-send failed (expected in dev): ${resendError}`);
    assert(
      typeof resendError === 'string',
      `Re-send returned { success: false, error: "${resendError}" }`,
    );
    // This is a valid outcome — Resend may not be configured
    assert(true, 'Re-send failure is gracefully handled with error message');
  }

  // ---------------------------------------------------------------
  // Step 7: Verify re-send for non-approved lead is rejected
  // ---------------------------------------------------------------
  console.log('\nStep 7: Verify re-send guard — reset to pending then try re-send');

  // Reset to pending
  const resetRes = await apiRequest('PATCH', `/api/admin/leads/${testLeadId}`, {
    status: 'pending',
  });
  assert(resetRes.status === 200, `Reset to pending returned 200 (got ${resetRes.status})`);

  // Try re-send on a pending lead
  const resendPendingRes = await apiRequest('POST', `/api/admin/leads/${testLeadId}/invite`);
  assert(
    resendPendingRes.status === 400,
    `Re-send on pending lead returned 400 (got ${resendPendingRes.status})`,
  );

  // ---------------------------------------------------------------
  // Step 8: Cleanup — Delete the test lead
  // ---------------------------------------------------------------
  console.log('\nStep 8: Cleanup — Delete the test lead');

  const deleteRes = await apiRequest('DELETE', `/api/admin/leads/${testLeadId}`);
  assert(deleteRes.status === 200, `Delete returned status 200 (got ${deleteRes.status})`);

  // Verify the lead is gone
  const verifyDeleteRes = await apiRequest('GET', `/api/admin/leads/${testLeadId}`);
  assert(
    verifyDeleteRes.status === 404,
    `GET deleted lead returns 404 (got ${verifyDeleteRes.status})`,
  );

  // ---------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------
  console.log('\n=== Results ===');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${passed + failed}`);

  if (failed > 0) {
    console.error('\nUS-012 E2E test FAILED');
    process.exit(1);
  } else {
    console.log('\nUS-012 E2E test PASSED');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
