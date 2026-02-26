import { type Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Portal authentication helper for E2E tests.
 *
 * Uses Supabase Admin API (service role key) to programmatically generate
 * a magic link for the test lead, then navigates the Playwright page through
 * the auth callback to establish a valid session.
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - PORTAL_TEST_EMAIL (defaults to "john+client@claru.ai")
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const TEST_EMAIL = process.env.PORTAL_TEST_EMAIL ?? 'john+client@claru.ai';

/**
 * Returns true if the required environment variables are available
 * for programmatic portal authentication.
 */
export function hasPortalAuthEnv(): boolean {
  return !!(SUPABASE_URL && SERVICE_ROLE_KEY);
}

/**
 * Authenticate a Playwright page as the test lead by generating a magic link
 * via the Supabase Admin API and navigating through the callback.
 *
 * After this function returns, the page has valid Supabase session cookies
 * and can access all /portal/* routes.
 */
export async function authenticateAsTestLead(
  page: Page,
  baseURL: string,
): Promise<void> {
  if (!hasPortalAuthEnv()) {
    throw new Error(
      'Portal auth env vars not set (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)',
    );
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Generate a magic link for the test lead using the admin API.
  // generateLink returns the full link with the OTP code embedded.
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: TEST_EMAIL,
    options: {
      redirectTo: `${baseURL}/portal/auth/callback`,
    },
  });

  if (error || !data?.properties?.hashed_token) {
    throw new Error(
      `Failed to generate magic link for ${TEST_EMAIL}: ${error?.message ?? 'no hashed_token returned'}`,
    );
  }

  // The generateLink response includes the full verification URL.
  // We need to extract the token_hash and type to construct the
  // Supabase verify endpoint URL that will set the session cookie.
  const actionLink = data.properties.action_link;

  // Navigate to the Supabase action link which will verify the OTP
  // and redirect to our callback URL with a code parameter.
  await page.goto(actionLink, { waitUntil: 'networkidle' });

  // After following the redirects, we should land on /portal or /portal/catalog.
  // Wait for the URL to contain /portal (excluding /portal/login).
  await page.waitForURL(
    (url) =>
      url.pathname.startsWith('/portal') &&
      !url.pathname.includes('/portal/login'),
    { timeout: 30_000 },
  );
}

export { TEST_EMAIL };
