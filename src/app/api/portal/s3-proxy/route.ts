import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getS3SignedUrl } from "@/lib/s3/presigner";

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
