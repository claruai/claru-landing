import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase Auth callback handler for magic link verification.
 *
 * Handles two flows:
 * 1. PKCE code exchange: Supabase redirects here with `?code=AUTH_CODE`
 *    after verifying the magic link token. We exchange the code for a
 *    session (requires PKCE code_verifier cookie from the browser that
 *    initiated signInWithOtp).
 * 2. Token hash verification: If the email template links directly to
 *    the app (bypassing Supabase's /auth/v1/verify), we receive
 *    `?token_hash=...&type=magiclink` and verify inline.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const redirectTo = new URL("/portal", request.url);

  // If Supabase redirected with an error (expired token, already used, etc.)
  if (error) {
    console.error(
      "[auth/callback] Supabase returned error:",
      error,
      errorDescription
    );
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("reason", "expired");
    return NextResponse.redirect(loginUrl);
  }

  // Helper: create a Supabase server client bound to a response object
  function makeClient(response: NextResponse) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
  }

  // Flow 1: PKCE code exchange (standard magic link via Supabase verify)
  if (code) {
    const response = NextResponse.redirect(redirectTo);
    const supabase = makeClient(response);

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return response;
    }

    console.error(
      "[auth/callback] Code exchange failed:",
      exchangeError.message
    );
    // Fall through to login redirect below
  }

  // Flow 2: Direct token hash verification (admin-generated links or
  // custom email templates that skip Supabase's /auth/v1/verify)
  if (tokenHash && type) {
    const response = NextResponse.redirect(redirectTo);
    const supabase = makeClient(response);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "magiclink" | "email",
    });

    if (!verifyError) {
      return response;
    }

    console.error(
      "[auth/callback] Token hash verification failed:",
      verifyError.message
    );
  }

  // No valid params or all attempts failed — redirect to login
  const loginUrl = new URL("/portal/login", request.url);
  loginUrl.searchParams.set("reason", "expired");
  return NextResponse.redirect(loginUrl);
}
