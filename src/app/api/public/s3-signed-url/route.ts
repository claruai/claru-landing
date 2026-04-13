import { NextRequest, NextResponse } from "next/server";
import { getS3SignedUrl } from "@/lib/s3/presigner";

const ALLOWED_PREFIXES = [
  "egocentric-capture/",
  "game-capture/",
  "cinematic/",
  "workplace/",
  "traffic/",
];

function isAllowedKey(key: string): boolean {
  if (key.includes("..") || key.startsWith("/")) return false;
  return ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key || !isAllowedKey(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    const url = await getS3SignedUrl(key);
    if (!url) {
      return NextResponse.json(
        { error: "Failed to sign URL" },
        { status: 500 },
      );
    }
    return NextResponse.json({ url }, {
      headers: { "Cache-Control": "private, max-age=1800" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to sign URL" },
      { status: 500 },
    );
  }
}
