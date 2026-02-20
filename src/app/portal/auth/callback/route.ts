import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase Auth callback handler for magic link verification.
 *
 * When a lead clicks a magic link in their email, Supabase redirects to
 * this route with a `code` query parameter. We exchange that code for a
 * session, which sets auth cookies on the response, then redirect the
 * user to the portal dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = new URL("/portal", request.url);

  if (code) {
    const response = NextResponse.redirect(redirectTo);

    const supabase = createServerClient(
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // If there is no code or the exchange failed, redirect to login with
  // a generic error. We avoid leaking specific error details.
  const loginUrl = new URL("/portal/login", request.url);
  loginUrl.searchParams.set("reason", "expired");
  return NextResponse.redirect(loginUrl);
}
