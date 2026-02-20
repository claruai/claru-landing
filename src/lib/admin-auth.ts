import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET_KEY = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

/**
 * Create a signed JWT for admin authentication.
 * Token expires after 24 hours.
 */
export async function createAdminToken(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET_KEY());

  return token;
}

/**
 * Verify an admin JWT token.
 * Returns true if the token is valid and not expired.
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET_KEY());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check admin session from a cookies store (e.g. from next/headers).
 * Works in both Server Components and Route Handlers.
 */
export async function getAdminSession(
  cookies: { get: (name: string) => { value: string } | undefined }
): Promise<boolean> {
  const tokenCookie = cookies.get("admin-token");
  if (!tokenCookie?.value) {
    return false;
  }
  return verifyAdminToken(tokenCookie.value);
}
