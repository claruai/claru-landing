import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Allowlist of paths that can be revalidated via this endpoint
const ALLOWED_PATHS = ["/datasets", "/datasets/[slug]", "/"];

export async function POST(request: NextRequest) {
  // Guard: fail closed if secret is not configured
  if (!process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const secret = request.headers.get("x-revalidation-secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
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
