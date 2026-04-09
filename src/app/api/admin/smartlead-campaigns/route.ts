import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isAdmin } from "@/lib/auth/admin";

/**
 * GET /api/admin/smartlead-campaigns
 *
 * Returns list of active Smartlead campaigns for the queue-to-campaign dropdown.
 * Auth: Supabase session (explicit cookie plumbing required in Route Handlers).
 * Forwards request to Smartlead with SMARTLEAD_API_KEY query param.
 */
export async function GET(): Promise<NextResponse> {
  // Explicit session plumbing — Route Handlers require manual cookie forwarding
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.SMARTLEAD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "SMARTLEAD_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://server.smartlead.ai/api/v1/campaigns?api_key=${encodeURIComponent(apiKey)}&status=active`,
      { next: { revalidate: 300 } } // cache 5 min
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Smartlead API error: ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Normalize to { id, name } array regardless of response shape
    const campaigns = (Array.isArray(data) ? data : data?.data ?? []).map(
      (c: { id: number; name: string }) => ({
        id: c.id,
        name: c.name,
      })
    );

    return NextResponse.json({ campaigns });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch Smartlead campaigns" },
      { status: 502 }
    );
  }
}
