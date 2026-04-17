import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/admin-auth";
import { fetchAnnotationJson } from "@/lib/s3/annotation";
import { fetchAnnotationParquet } from "@/lib/s3/annotation-parquet";

// =============================================================================
// POST /api/admin/s3-annotation
//
// Admin variant of the portal s3-annotation route. Fetches an annotation JSON
// (or parquet) from an S3 object key. Supports both JSON and parquet formats,
// and cross-bucket signing for datasets in non-default buckets.
//
// Auth: admin token cookie (same pattern as other admin routes).
// =============================================================================

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const requestSchema = z.object({
  /** The S3 object key / URL to fetch the annotation from. */
  objectKey: z.string().min(1, "objectKey is required"),
  /** Optional sample ID — accepted for interface compatibility, not used. */
  sampleId: z.string().uuid().optional(),
  /** Optional bucket override for cross-bucket datasets. */
  bucket: z.string().optional(),
});

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

  const { objectKey, bucket } = parsed.data;

  // 3. Reject path-traversal attempts
  if (objectKey.includes("..")) {
    return NextResponse.json(
      { error: "Invalid objectKey" },
      { status: 400 }
    );
  }

  // 4. Determine bucket override
  const defaultBucket = process.env.S3_BUCKET_NAME;
  const bucketOverride =
    bucket && bucket !== defaultBucket ? bucket : undefined;

  // 5. Fetch annotation — parquet or JSON
  const isParquet = objectKey.endsWith(".parquet");

  if (isParquet) {
    const annotationData = await fetchAnnotationParquet(
      objectKey,
      bucketOverride
    );
    if (!annotationData) {
      return NextResponse.json(
        { error: "Failed to fetch parquet annotation from S3" },
        { status: 502 }
      );
    }
    return NextResponse.json({ annotation: annotationData, cached: false });
  }

  const annotationData = await fetchAnnotationJson(objectKey, bucketOverride);

  if (!annotationData) {
    return NextResponse.json(
      { error: "Failed to fetch annotation from S3" },
      { status: 502 }
    );
  }

  // 6. Return the annotation data
  return NextResponse.json({ annotation: annotationData, cached: false });
}
