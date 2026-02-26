import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { fetchAnnotationJson } from "@/lib/s3/annotation";

// =============================================================================
// POST /api/admin/s3-annotation
//
// Admin variant of the portal s3-annotation route. Fetches an annotation JSON
// (or specs JSON) from an S3 object key (full URL).
//
// Auth: admin token cookie (same pattern as other admin routes).
//
// No Supabase cache lookup — admin callers are infrequent enough that the
// direct S3 fetch is acceptable. The logic is otherwise identical to the
// portal route: validate objectKey, reject path-traversal attempts, fetch
// from S3, return parsed JSON.
// =============================================================================

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const requestSchema = z.object({
  /** The S3 object key / URL to fetch the annotation JSON from. */
  objectKey: z.string().min(1, "objectKey is required"),
  /** Optional sample ID — accepted for interface compatibility, not used. */
  sampleId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // 1. Verify admin token
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const { objectKey } = parsed.data;

  // 3. Reject path-traversal attempts
  if (objectKey.includes("..")) {
    return NextResponse.json(
      { error: "Invalid objectKey" },
      { status: 400 }
    );
  }

  // 4. Fetch annotation JSON from S3
  const annotationData = await fetchAnnotationJson(objectKey);

  if (!annotationData) {
    return NextResponse.json(
      { error: "Failed to fetch annotation from S3" },
      { status: 502 }
    );
  }

  // 5. Return the annotation data
  return NextResponse.json({ annotation: annotationData, cached: false });
}
