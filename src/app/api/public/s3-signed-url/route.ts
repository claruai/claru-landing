import { NextRequest, NextResponse } from "next/server";
import { getS3SignedUrl } from "@/lib/s3/presigner";

/**
 * Public S3 signed URL endpoint for prospect pages.
 * Only signs keys that belong to published datasets (checked via Supabase).
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const url = await getS3SignedUrl(key);
    if (!url) {
      return NextResponse.json(
        { error: "Failed to sign URL" },
        { status: 500 }
      );
    }
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Failed to sign URL" },
      { status: 500 }
    );
  }
}
