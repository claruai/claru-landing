import { NextRequest } from "next/server";
import { getS3SignedUrl } from "@/lib/s3/presigner";

/**
 * GET /api/media/s3?key=video_capture/completed/.../file.MP4
 *
 * Proxy for S3 media files. Generates a fresh signed URL and redirects.
 * This allows slide HTML to use stable URLs like:
 *   <video src="/api/media/s3?key=video_capture/completed/.../file.MP4">
 *
 * No auth required — the key itself is the access control (you need to know
 * the exact S3 path). For public-facing shared decks, this is acceptable.
 * For stricter access control, add auth checks here.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return new Response("Missing 'key' parameter", { status: 400 });
  }

  // Basic path traversal protection
  if (key.includes("..") || key.startsWith("/")) {
    return new Response("Invalid key", { status: 400 });
  }

  const signedUrl = await getS3SignedUrl(key, 3600); // 1hr expiry

  if (!signedUrl) {
    return new Response("Failed to sign URL", { status: 500 });
  }

  // Redirect to the signed URL — browser follows the redirect transparently
  // for <video> and <img> elements. The signed URL handles range requests
  // natively (important for video seeking).
  return new Response(null, {
    status: 302,
    headers: {
      Location: signedUrl,
      "Cache-Control": "private, max-age=3000", // Cache for ~50min (URL valid for 60min)
    },
  });
}
