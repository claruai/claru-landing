import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getS3SignedUrl } from "@/lib/s3/presigner";

/**
 * Zod schema for the request body.
 * Validates that objectKey is a non-empty string.
 */
const RequestBodySchema = z.object({
  objectKey: z.string().min(1, "objectKey is required"),
});

/**
 * POST /api/admin/s3-signed-url
 *
 * Returns a presigned S3 URL for the given object key.
 * Requires a valid admin token cookie.
 *
 * Request body: { objectKey: string }
 * Response:     { signedUrl: string } on success
 *               { error: string }     on failure
 */
export async function POST(request: NextRequest) {
  // ---------- Auth: validate admin token cookie ----------
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ---------- Parse and validate request body ----------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 }
    );
  }

  const { objectKey } = parsed.data;

  // ---------- Security: reject path traversal ----------
  if (objectKey.includes("..")) {
    return NextResponse.json(
      { error: "Invalid objectKey: path traversal is not allowed" },
      { status: 400 }
    );
  }

  // ---------- Log the request ----------
  console.log(
    `[admin/s3-signed-url] objectKey="${objectKey}" timestamp="${new Date().toISOString()}"`
  );

  // ---------- Generate presigned URL ----------
  try {
    const signedUrl = await getS3SignedUrl(objectKey);

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error(
      "[admin/s3-signed-url] AWS SDK error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
