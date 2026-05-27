import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time string compare. Equal-length inputs use timingSafeEqual
 * directly; mismatched-length inputs still perform a compare against `a`
 * to keep the timing profile uniform before returning false.
 */
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * GET /api/cron/embed-samples
 *
 * Vercel cron endpoint that invokes the Supabase Edge Function
 * `embed-samples` to process pending embeddings.
 *
 * Protected by CRON_SECRET to prevent unauthorized invocations.
 * Fails closed if CRON_SECRET is not configured.
 */
export async function GET(request: NextRequest) {
  // Validate cron secret — fail closed if not configured.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[cron/embed-samples] CRON_SECRET not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${cronSecret}`;
  if (!safeEqual(authHeader, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/embed-samples`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("[cron/embed-samples] Edge Function error:", text);
      return NextResponse.json(
        { error: "Edge Function failed", detail: text },
        { status: 502 },
      );
    }

    const result = await response.json();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[cron/embed-samples] Error:", err);
    return NextResponse.json(
      { error: "Failed to invoke Edge Function" },
      { status: 500 },
    );
  }
}
