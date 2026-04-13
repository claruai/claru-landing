import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const TOKEN_RE = /^[a-f0-9]{64}$/;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "key required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: dataset } = await supabase
    .from("datasets")
    .select("id, share_expires_at")
    .eq("share_token", token)
    .single();

  if (
    !dataset ||
    (dataset.share_expires_at &&
      new Date(dataset.share_expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Invalid or expired share link" },
      { status: 404 }
    );
  }

  const signedUrl = await getS3SignedUrl(key, 300);
  if (!signedUrl) {
    return NextResponse.json(
      { error: "Failed to sign URL" },
      { status: 500 }
    );
  }

  const res = await fetch(signedUrl);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 502 }
    );
  }

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=300, no-transform",
    },
  });
}
