import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendInviteEmail } from "@/lib/email/invite";

/**
 * POST /api/admin/leads/[id]/invite
 *
 * Re-sends a magic link invite to an already-approved lead.
 *
 * 1. Verifies admin auth
 * 2. Fetches the lead — 404 if not found
 * 3. Returns 400 if lead is not approved
 * 4. Creates auth user if missing (edge case: approved but user creation failed)
 * 5. Generates a fresh magic link
 * 6. Sends invite email via Resend
 *
 * Returns: { success: boolean, error?: string }
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch the lead
  const { data: lead, error: fetchErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Only approved leads can receive invites
  if (lead.status !== "approved") {
    return NextResponse.json(
      { error: "Lead must be approved to send invite" },
      { status: 400 }
    );
  }

  // Edge case: lead is approved but auth user creation previously failed.
  // Create the auth user now before generating a magic link.
  let supabaseUserId = lead.supabase_user_id;

  if (!supabaseUserId) {
    const { data: authUser, error: createErr } =
      await supabase.auth.admin.createUser({
        email: lead.email,
        email_confirm: true,
      });

    if (createErr) {
      // User might already exist — try to find them
      const { data: existingUsers } =
        await supabase.auth.admin.listUsers();

      const existing = existingUsers?.users?.find(
        (u) => u.email === lead.email
      );

      if (existing) {
        supabaseUserId = existing.id;
      } else {
        console.error("[invite] Failed to create auth user:", createErr);
        return NextResponse.json(
          { success: false, error: "Failed to create auth user" },
          { status: 500 }
        );
      }
    } else {
      supabaseUserId = authUser.user.id;
    }

    // Persist the supabase_user_id on the lead record
    await supabase
      .from("leads")
      .update({ supabase_user_id: supabaseUserId })
      .eq("id", id);
  }

  // Generate fresh magic link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";

  const { data: linkData, error: linkErr } =
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: lead.email,
      options: {
        redirectTo: `${siteUrl}/portal/auth/callback`,
      },
    });

  if (linkErr || !linkData?.properties?.action_link) {
    console.error("[invite] Failed to generate magic link:", linkErr);
    return NextResponse.json(
      { success: false, error: "Failed to generate magic link" },
      { status: 500 }
    );
  }

  const magicLink = linkData.properties.action_link;

  // Send invite email
  const result = await sendInviteEmail({
    to: lead.email,
    name: lead.name,
    magicLink,
  });

  if (!result.success) {
    console.error("[invite] Failed to send invite email:", result.error);
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
