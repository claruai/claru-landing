import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";
import { sendDeckShareEmail } from "@/lib/email/deck-share";

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// ---------------------------------------------------------------------------
// POST /api/admin/deck-builder/[id]/share/send
// Creates share tokens and sends share emails to leads and/or emails.
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id: templateId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const leadIds: string[] = Array.isArray(body.lead_ids) ? body.lead_ids : [];
  const emails: string[] = Array.isArray(body.emails) ? body.emails : [];
  const parentLeadId =
    typeof body.parent_lead_id === "string" ? body.parent_lead_id : null;

  if (leadIds.length === 0 && emails.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one lead_id or email" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  // Fetch template to verify it exists and get name + share settings
  const { data: template, error: tplErr } = await supabase
    .from("slide_templates")
    .select("id, name, share_settings")
    .eq("id", templateId)
    .single();

  if (tplErr || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 },
    );
  }

  const shareSettings = template.share_settings as {
    enabled?: boolean;
    slug?: string;
  } | null;

  if (!shareSettings?.enabled || !shareSettings?.slug) {
    return NextResponse.json(
      { error: "Sharing is not enabled for this template" },
      { status: 400 },
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://claru.ai";
  const slug = shareSettings.slug;

  // Collect recipients: { email, name, lead_id }
  const recipients: {
    email: string;
    name: string;
    lead_id: string | null;
  }[] = [];

  // Resolve lead_ids to email addresses
  if (leadIds.length > 0) {
    const { data: leads, error: leadsErr } = await supabase
      .from("leads")
      .select("id, name, email")
      .in("id", leadIds);

    if (leadsErr) {
      console.error("[POST share/send] Failed to fetch leads:", leadsErr);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 },
      );
    }

    for (const lead of leads ?? []) {
      recipients.push({
        email: lead.email,
        name: lead.name || lead.email,
        lead_id: lead.id,
      });
    }
  }

  // Add free-form emails
  for (const email of emails) {
    const trimmed = typeof email === "string" ? email.trim() : "";
    if (trimmed) {
      recipients.push({
        email: trimmed,
        name: trimmed,
        lead_id: null,
      });
    }
  }

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "No valid recipients found" },
      { status: 400 },
    );
  }

  // Create tokens and send emails
  const results: { email: string; token: string; url: string }[] = [];
  let sentCount = 0;

  for (const recipient of recipients) {
    const token = crypto.randomBytes(16).toString("hex");
    const shareUrl = `${siteUrl}/d/${slug}?t=${token}`;

    // Insert deck_share_tokens row
    const { error: insertErr } = await supabase
      .from("deck_share_tokens")
      .insert({
        template_id: templateId,
        lead_id: recipient.lead_id,
        email: recipient.email,
        token,
        parent_lead_id: parentLeadId,
      });

    if (insertErr) {
      console.error(
        `[POST share/send] Failed to create token for ${recipient.email}:`,
        insertErr,
      );
      // Continue with other recipients
      continue;
    }

    // Send email
    const emailResult = await sendDeckShareEmail({
      to: recipient.email,
      recipientName: recipient.name,
      deckTitle: template.name as string,
      shareUrl,
    });

    if (emailResult.success) {
      sentCount++;
    } else {
      console.warn(
        `[POST share/send] Email failed for ${recipient.email}:`,
        emailResult.error,
      );
    }

    results.push({
      email: recipient.email,
      token,
      url: shareUrl,
    });
  }

  return NextResponse.json({
    sent: sentCount,
    tokens: results,
  });
}
