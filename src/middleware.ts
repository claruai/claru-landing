import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware to protect admin routes.
 * Allows access to /admin (login page) and /api/admin/login without authentication.
 * All other /admin/* routes require a valid admin-token JWT cookie.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and login API endpoint without authentication
  if (pathname === "/admin" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Check for admin token cookie
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  // Verify the JWT
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      return redirectToLogin(request);
    }

    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    // Token is invalid or expired
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path+"],
};
