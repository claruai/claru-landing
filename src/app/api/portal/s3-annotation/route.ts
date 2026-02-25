import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchAnnotationJson } from "@/lib/s3/annotation";

/**
 * Request body schema for the annotation fetch endpoint.
 * Accepts a single S3 object key string.
 */
const RequestBodySchema = z.object({
  objectKey: z.string(),
});

/**
 * POST /api/portal/s3-annotation
 *
 * Fetches and returns parsed annotation JSON from S3 for the given object key.
 *
 * - Validates Supabase session (401 if unauthenticated)
 * - Validates request body with Zod (400 if invalid)
 * - Rejects objectKey containing ".." to prevent path traversal (400)
 * - Returns parsed JSON on success, { error: string } on failure
 */
export async function POST(request: NextRequest) {
  // --- Auth: validate Supabase session ---
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  // --- Parse and validate request body ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = RequestBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body: objectKey (string) is required" },
      { status: 400 }
    );
  }

  const { objectKey } = parsed.data;

  // --- Security: reject path traversal ---
  if (objectKey.includes("..")) {
    return NextResponse.json(
      { error: "Invalid objectKey: path traversal is not allowed" },
      { status: 400 }
    );
  }

  // --- Fetch annotation from S3 ---
  const annotation = await fetchAnnotationJson(objectKey);

  if (!annotation) {
    return NextResponse.json(
      { error: "Failed to fetch annotation" },
      { status: 502 }
    );
  }

  return NextResponse.json(annotation);
}
