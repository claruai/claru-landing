import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createServerClient } from "@supabase/ssr";

// ---------------------------------------------------------------------------
// Admin Auth Helpers (existing)
// ---------------------------------------------------------------------------

function redirectToAdminLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Allow the login page, login API, and social-feed preview without authentication
  if (
    pathname === "/admin" ||
    pathname === "/api/admin/login" ||
    pathname === "/admin/social-feed"
  ) {
    return NextResponse.next();
  }

  // Check for admin token cookie
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return redirectToAdminLogin(request);
  }

  // Verify the JWT
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      return redirectToAdminLogin(request);
    }

    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    // Token is invalid or expired
    return redirectToAdminLogin(request);
  }
}

// ---------------------------------------------------------------------------
// Portal Auth Helpers (Supabase magic link session)
// ---------------------------------------------------------------------------

/**
 * Creates a Supabase server client scoped to the middleware request/response
 * lifecycle. Unlike the server.ts helper (which uses next/headers cookies()),
 * middleware must read cookies from the request and write them to the response.
 */
function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request (so downstream server components see them)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Set cookies on the response (so the browser persists them)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}

async function handlePortalAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Auth callback and login page are always allowed through
  if (
    pathname === "/portal/login" ||
    pathname.startsWith("/portal/auth/callback")
  ) {
    return NextResponse.next();
  }

  // --- Admin preview: requires BOTH a valid admin-token cookie AND
  //     an explicit ?admin_preview=true param or Referer from /admin/ ---
  const adminToken = request.cookies.get("admin-token")?.value;
  const wantsPreview =
    request.nextUrl.searchParams.get("admin_preview") === "true" ||
    (request.headers.get("referer") ?? "").includes("/admin/");
  if (adminToken && wantsPreview) {
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        await jwtVerify(adminToken, new TextEncoder().encode(secret));
        // Clone request headers and inject x-admin-preview so server
        // components can read it via headers() and skip Supabase auth.
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-admin-preview", "true");
        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });
        response.headers.set("x-admin-preview", "true");
        return response;
      }
    } catch {
      // Invalid admin token — fall through to normal portal auth
    }
  }

  // Strip x-admin-preview from all non-privileged requests to prevent
  // client spoofing — portal users must not be able to bypass assertAdmin().
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-admin-preview");

  // Create a response we can modify (for cookie refresh)
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);

  // getUser() validates the session server-side (unlike getSession which only
  // reads the JWT without verifying). This is the recommended approach for
  // middleware auth checks per Supabase docs.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Distinguish between expired session and no session
    const hasSessionCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

    const redirectUrl = new URL("/portal/login", request.url);
    if (hasSessionCookie) {
      redirectUrl.searchParams.set("reason", "expired");
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Return the response with any refreshed session cookies
  return response;
}

// ---------------------------------------------------------------------------
// Main Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- New CRM admin routes (Supabase portal session auth) ---
  // These pages use assertAdmin() which checks Supabase session,
  // so they go through portal auth, not the legacy JWT admin auth.
  if (
    pathname.startsWith("/admin/queue") ||
    pathname.startsWith("/admin/pipeline") ||
    pathname.startsWith("/admin/prospects") ||
    pathname.startsWith("/api/admin/smartlead-campaigns")
  ) {
    return handlePortalAuth(request);
  }

  // --- Admin routes (existing JWT-based auth) ---
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return handleAdminAuth(request);
  }

  // --- Portal routes (Supabase session auth) ---
  if (pathname.startsWith("/portal") || pathname.startsWith("/api/portal")) {
    return handlePortalAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/portal/:path*",
    "/api/portal/:path*",
  ],
};
