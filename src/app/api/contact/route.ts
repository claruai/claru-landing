import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPostHogServer } from "@/lib/posthog-server";
import { sendCapiEvent } from "@/lib/meta/capi";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name: rawName, email, company, project_description, heard_about, source } = body;

  // Email + company are the floor — the inline hero collector sends only those two.
  // For full contact forms, name is provided; for the inline form, we backfill from email.
  if (!email || !company) {
    return NextResponse.json(
      { error: "Email and company are required" },
      { status: 400 }
    );
  }

  // Fall back to the local-part of the email when name is omitted.
  const name = (rawName && rawName.trim()) || email.split("@")[0] || "(no name)";

  try {
    const ph = getPostHogServer();
    ph?.capture({
      distinctId: email,
      event: "contact_form_server",
      properties: {
        company,
        has_project_description: !!project_description,
        heard_about,
        source: source || "modal",
        name_provided: !!(rawName && rawName.trim()),
      },
    });

    // 1. Send notification email to team
    await getResend().emails.send({
      from: `Claru AI <${process.env.RESEND_FROM_EMAIL || "team@claru.ai"}>`,
      to: "contact@claru.ai",
      bcc: "claru@attio.email",
      subject: `New consultation request from ${company}`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0a0908; color: #e8e8e8; padding: 32px; border-radius: 8px;">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #92B090; font-size: 14px; letter-spacing: 0.05em;">// NEW CONSULTATION REQUEST</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #92B090; width: 120px; vertical-align: top;">Name</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #a8c4a6;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Company</td><td style="padding: 8px 0;">${escapeHtml(company)}</td></tr>
            ${project_description ? `<tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Project</td><td style="padding: 8px 0;">${escapeHtml(project_description)}</td></tr>` : ""}
            ${heard_about ? `<tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Heard via</td><td style="padding: 8px 0;">${escapeHtml(heard_about)}</td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.4);">
            Claru AI — Consultation Request
          </div>
        </div>
      `,
    });

    // 2. Add submitter as a Resend contact (for audience/remarketing)
    try {
      await getResend().contacts.create({
        audienceId: process.env.RESEND_AUDIENCE_ID || "e33492fa-da3f-495e-a699-c054e0e5f27a",
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
        unsubscribed: false,
      });
    } catch {
      // Non-fatal — contact may already exist (duplicate email)
      console.warn("[POST /api/contact] Failed to create Resend contact", email);
    }

    // 3. Insert as a lead in Supabase and create CRM record
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const { data: leadRow } = await supabase
        .from("leads")
        .upsert(
          {
            name,
            email,
            company,
            use_case: project_description || null,
            heard_about: heard_about || null,
            // Intentionally omit `status` — do not overwrite an existing
            // 'approved'/'rejected' lead if they re-submit the contact form.
          },
          { onConflict: "email" },
        )
        .select("id")
        .single();

      if (leadRow?.id) {
        // Create CRM record only if one doesn't exist — do not overwrite
        // pipeline state (icp_score, thread_state, waiting_on) for existing leads.
        await supabase.from("lead_crm_data").upsert(
          {
            lead_id: leadRow.id,
            type: "demand",
            icp_score: 7, // Inbound form — interested but funding unknown
            thread_state: "warm",
            waiting_on: "us",
            last_touch_at: new Date().toISOString(),
          },
          { onConflict: "lead_id", ignoreDuplicates: true },
        );
      }
    } catch {
      // Non-fatal — don't block form submission on DB errors
      console.warn("[POST /api/contact] Failed to upsert lead", email);
    }

    // 4. Fire Meta Conversions API "Contact" event. Same event_id is returned
    // to the client so the browser-side Pixel fire dedupes against this server call.
    const metaEventId = crypto.randomUUID();
    try {
      const xff = request.headers.get("x-forwarded-for");
      const clientIp = xff ? xff.split(",")[0]!.trim() : null;
      const referer = request.headers.get("referer") || "https://claru.ai";
      const [firstName, ...lastParts] = name.split(" ");
      await sendCapiEvent({
        eventName: "Contact",
        eventId: metaEventId,
        eventSourceUrl: referer,
        actionSource: "website",
        userData: {
          email,
          firstName,
          lastName: lastParts.join(" ") || null,
          externalId: email,
          clientIpAddress: clientIp,
          clientUserAgent: request.headers.get("user-agent"),
          fbc: request.cookies.get("_fbc")?.value || null,
          fbp: request.cookies.get("_fbp")?.value || null,
        },
      });
    } catch (err) {
      console.warn("[POST /api/contact] Meta CAPI send failed", err);
    }

    return NextResponse.json({ success: true, meta_event_id: metaEventId });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ success: true }); // Don't leak errors to client
  }
}
