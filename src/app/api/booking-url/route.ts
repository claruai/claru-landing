import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/booking-url
 *
 * Public endpoint that returns the configured booking URL from the
 * settings table. Used by client components (CalendlyProvider, etc.)
 * so the URL is managed in one place via the admin settings panel.
 *
 * Response is cached for 5 minutes to avoid hitting the DB on every
 * page load.
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "booking_url")
      .single<{ value: string }>();

    return NextResponse.json(
      { url: data?.value ?? null },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json({ url: null });
  }
}
