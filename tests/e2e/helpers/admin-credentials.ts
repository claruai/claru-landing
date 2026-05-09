/**
 * Shared admin credentials for E2E tests.
 *
 * The admin password MUST come from the ADMIN_PASSWORD env var. We do not
 * fall back to a literal so the password never lives in source. If the env
 * var is missing we throw immediately so tests fail fast instead of
 * silently logging in with a placeholder.
 *
 * Set ADMIN_PASSWORD in .env.local (gitignored) or in CI secrets.
 */

export const ADMIN_EMAIL: string =
  process.env.ADMIN_EMAIL ?? 'team@claru.ai';

export const ADMIN_PASSWORD: string = (() => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      'ADMIN_PASSWORD env var is required for E2E tests. ' +
        'Set it in .env.local or your CI secrets.',
    );
  }
  return pw;
})();
