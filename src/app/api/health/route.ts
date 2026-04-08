import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const checks: Record<string, { status: "ok" | "fail"; latency_ms: number; error?: string }> = {};

  // Supabase connectivity
  const sbStart = Date.now();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    checks.supabase = {
      status: "fail",
      latency_ms: Date.now() - sbStart,
      error: "Missing SUPABASE env vars",
    };
  } else {
    try {
      const supabase = createClient(url, key);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const { error } = await supabase
        .from("datasets")
        .select("id", { count: "exact", head: true })
        .abortSignal(controller.signal);
      clearTimeout(timeout);
      checks.supabase = {
        status: error ? "fail" : "ok",
        latency_ms: Date.now() - sbStart,
        ...(error && { error: error.message }),
      };
    } catch (e) {
      checks.supabase = {
        status: "fail",
        latency_ms: Date.now() - sbStart,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  }

  const allOk = Object.values(checks).every((c) => c.status === "ok");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - start,
      checks,
    },
    {
      status: allOk ? 200 : 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
