import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendInviteEmail } from "@/lib/email/invite";

/**
 * POST /api/admin/leads/[id]/approve
 *
 * Approves a lead:
 * 1. Updates status to "approved"
 * 2. Creates a Supabase Auth user (or reuses existing)
 * 3. Generates a magic link
 * 4. Stores supabase_user_id on the lead record
 * 5. Optionally sends an invite email with the magic link
 *
 * Request body (optional):
 *   { send_invite?: boolean, admin_notes?: string }
 */
export async function POST(
  request: NextRequest,
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

  // Parse optional body
  let adminNotes: string | undefined;
  let sendInvite = false;
  try {
    const body = await request.json();
    if (typeof body.admin_notes === "string") {
      adminNotes = body.admin_notes;
    }
    if (body.send_invite === true) {
      sendInvite = true;
    }
  } catch {
    // Body is optional
  }

  // Create or find Supabase Auth user
  let supabaseUserId = lead.supabase_user_id;
  let magicLink: string | null = null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";

  if (!supabaseUserId) {
    // Try to create new auth user
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
        console.error("[approve] Failed to create auth user:", createErr);
        return NextResponse.json(
          { error: "Failed to create auth user" },
          { status: 500 }
        );
      }
    } else {
      supabaseUserId = authUser.user.id;
    }
  }

  // Generate magic link — redirect through the auth callback so the code
  // can be exchanged for a session (sets auth cookies on the response).
  const { data: linkData, error: linkErr } =
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: lead.email,
      options: {
        redirectTo: `${siteUrl}/portal/auth/callback`,
      },
    });

  if (!linkErr && linkData?.properties?.action_link) {
    magicLink = linkData.properties.action_link;
  }

  // Update lead record
  const updateFields: Record<string, unknown> = {
    status: "approved",
    supabase_user_id: supabaseUserId,
  };
  if (adminNotes !== undefined) {
    updateFields.admin_notes = adminNotes;
  }

  const { data: updatedLead, error: updateErr } = await supabase
    .from("leads")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (updateErr) {
    console.error("[approve] Failed to update lead:", updateErr);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }

  // Optionally send invite email
  let inviteSent = false;
  let inviteError: string | undefined;

  if (sendInvite && magicLink) {
    const result = await sendInviteEmail({
      to: lead.email,
      name: lead.name,
      magicLink,
    });
    inviteSent = result.success;
    if (!result.success) {
      inviteError = result.error;
      console.error("[approve] Invite email failed:", result.error);
    }
  } else if (sendInvite && !magicLink) {
    inviteError = "Magic link generation failed — cannot send invite";
    console.error("[approve] send_invite requested but no magic link available");
  }

  return NextResponse.json({
    lead: updatedLead,
    message: "Lead approved successfully",
    invite_sent: inviteSent,
    ...(inviteError ? { invite_error: inviteError } : {}),
  });
}
