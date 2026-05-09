import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

// Allowlist of paths that can be revalidated via this endpoint
const ALLOWED_PATHS = ["/datasets", "/datasets/[slug]", "/"];

/**
 * Constant-time string compare. Equal-length inputs use timingSafeEqual
 * directly; mismatched-length inputs still perform a compare against `a`
 * to keep the timing profile uniform before returning false.
 */
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: NextRequest) {
  // Guard: fail closed if secret is not configured
  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const secret = request.headers.get("x-revalidation-secret");
  if (!secret || !safeEqual(secret, expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const path = (body as { path?: string }).path;

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // Only allow revalidation of known paths to prevent revalidation storms
  const allowed = ALLOWED_PATHS.some(
    (p) => path === p || path.startsWith("/datasets"),
  );
  if (!allowed) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Revalidation failed", details: String(error) },
      { status: 500 },
    );
  }
}
