import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const TOKEN_RE = /^[a-f0-9]{64}$/;

/**
 * GET /api/share/[token]/bundle
 *
 * Returns a fresh 1-hour presigned URL for the dataset's `bundle_s3_key`
 * (e.g. a lerobot v2.1 tarball). The same share token that gates the
 * /share/<token> view gates this download — when the share link expires,
 * the bundle download stops working too.
 *
 * Default behaviour: HTTP 302 redirect to the presigned URL so a browser
 * `<a download>` or `curl -L -O` works directly. Pass `?json=1` to receive
 * `{ url, expires_in_seconds, size_bytes, format, label }` instead — useful
 * when the share page wants to render the URL client-side.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const wantJson = request.nextUrl.searchParams.get("json") === "1";
  const supabase = createSupabaseAdminClient();

  const { data: dataset } = await supabase
    .from("datasets")
    .select(
      "id, share_expires_at, bundle_s3_bucket, bundle_s3_key, bundle_size_bytes, bundle_format, bundle_label",
    )
    .eq("share_token", token)
    .single();

  if (
    !dataset ||
    (dataset.share_expires_at &&
      new Date(dataset.share_expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Invalid or expired share link" },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  if (!dataset.bundle_s3_key) {
    return NextResponse.json(
      { error: "No bundle attached to this dataset" },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const bucket = dataset.bundle_s3_bucket || undefined;
  const ttl = 3600; // 1 hour
  const signed = await getS3SignedUrl(dataset.bundle_s3_key, ttl, bucket);
  if (!signed) {
    return NextResponse.json({ error: "Failed to sign URL" }, { status: 500 });
  }

  if (wantJson) {
    return NextResponse.json(
      {
        url: signed,
        expires_in_seconds: ttl,
        size_bytes: dataset.bundle_size_bytes,
        format: dataset.bundle_format,
        label: dataset.bundle_label,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return NextResponse.redirect(signed, {
    status: 302,
    headers: { "Cache-Control": "private, no-store" },
  });
}
