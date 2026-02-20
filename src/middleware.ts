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

  // Allow the login page and login API endpoint without authentication
  if (pathname === "/admin" || pathname === "/api/admin/login") {
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

  // Allow the login page and auth callback without authentication
  if (
    pathname === "/portal/login" ||
    pathname.startsWith("/portal/auth/callback")
  ) {
    return NextResponse.next();
  }

  // Create a response we can modify (for cookie refresh)
  const response = NextResponse.next({
    request: { headers: request.headers },
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
