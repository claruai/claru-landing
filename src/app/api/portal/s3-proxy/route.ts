import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import {
  getGrantedDatasetIds,
  getDatasetIdsForObjectKey,
  hasOverlap,
} from "@/lib/portal/access-control";

/**
 * GET /api/portal/s3-proxy?key=...
 *
 * Proxies S3/CloudFront file downloads through the server to avoid CORS issues.
 * Requires authenticated portal session.
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  if (key.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  // Authorization: verify user has access to a dataset that contains this key.
  const grantedDatasetIds = await getGrantedDatasetIds(supabase, user.id);
  if (!grantedDatasetIds || grantedDatasetIds.size === 0) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const candidateDatasetIds = await getDatasetIdsForObjectKey(key);
  if (!hasOverlap(candidateDatasetIds, grantedDatasetIds)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const signedUrl = await getS3SignedUrl(key);
    if (!signedUrl) {
      return NextResponse.json({ error: "Failed to sign" }, { status: 500 });
    }

    const response = await fetch(signedUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
