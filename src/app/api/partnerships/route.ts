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

interface PartnershipsPayload {
  name: string;
  email: string;
  business: string;
  business_type: string;
  description: string;
  sample_link: string | null;
}

export async function POST(request: NextRequest) {
  let body: PartnershipsPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, email, business, business_type, description, sample_link } = body;

  if (!name || !email || !business || !business_type || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Fire Meta CAPI Contact event up-front so a Resend outage can't lose the
  // conversion. Same pattern as /api/contact.
  const metaEventId = crypto.randomUUID();
  try {
    const xff = request.headers.get("x-forwarded-for");
    const clientIp = xff ? xff.split(",")[0]!.trim() : null;
    const referer = request.headers.get("referer") || "https://claru.ai/partnerships";
    const [firstName, ...lastParts] = name.split(" ");
    await sendCapiEvent({
      eventName: "Contact",
      eventId: metaEventId,
      eventSourceUrl: referer,
      actionSource: "website",
      userData: {
        email,
        firstName: firstName || null,
        lastName: lastParts.length ? lastParts.join(" ") : null,
        externalId: email,
        clientIpAddress: clientIp,
        clientUserAgent: request.headers.get("user-agent"),
        fbc: request.cookies.get("_fbc")?.value || null,
        fbp: request.cookies.get("_fbp")?.value || null,
      },
    });
  } catch (err) {
    console.warn("[POST /api/partnerships] Meta CAPI send failed", err);
  }

  try {
    const ph = getPostHogServer();
    ph?.capture({
      distinctId: email,
      event: "partnerships_form_server",
      properties: {
        business,
        business_type,
        has_sample_link: !!sample_link,
        channel: "supply",
      },
    });

    const subject = `Partner application — ${business} (${business_type})`;

    await getResend().emails.send({
      from: `Claru AI <${process.env.RESEND_FROM_EMAIL || "team@claru.ai"}>`,
      to: ["team@claru.ai", "partners@claru.ai"],
      bcc: "claru@attio.email",
      subject,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0a0908; color: #e8e8e8; padding: 32px; border-radius: 8px;">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #92B090; font-size: 14px; letter-spacing: 0.05em;">// NEW PARTNER APPLICATION</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #92B090; width: 160px; vertical-align: top;">Name</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #a8c4a6;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Business + city</td><td style="padding: 8px 0;">${escapeHtml(business)}</td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Type</td><td style="padding: 8px 0;">${escapeHtml(business_type)}</td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">What they do</td><td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(description)}</td></tr>
            ${sample_link ? `<tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Sample</td><td style="padding: 8px 0;"><a href="${escapeHtml(sample_link)}" style="color: #a8c4a6;">${escapeHtml(sample_link)}</a></td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.4);">
            Claru AI — Partner Application • channel: supply
          </div>
        </div>
      `,
    });

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
            company: business,
            role: null,
            use_case: description,
            data_needs: null,
          },
          { onConflict: "email" },
        )
        .select("id")
        .single();

      if (leadRow?.id) {
        // Mark CRM channel as supply (vs the demand-side default in /api/contact).
        // Existing rows get type/channel touched but icp_score is left alone for
        // pipeline state preservation.
        await supabase.from("lead_crm_data").upsert(
          {
            lead_id: leadRow.id,
            type: "supply",
            thread_state: "warm",
            waiting_on: "us",
            last_touch_at: new Date().toISOString(),
          },
          { onConflict: "lead_id" },
        );

        // Partnerships table retains its existing schema; we write empty
        // values for the NOT-NULL columns the simplified form no longer
        // collects (geography, modalities, archive_size, preferred_deal).
        // Nullable columns (website, sample_link) get null when missing.
        await supabase.from("partnerships_leads").upsert(
          {
            lead_id: leadRow.id,
            org_type: business_type,
            website: null,
            geography: [],
            modalities: [],
            archive_size: "",
            preferred_deal: [],
            sample_link,
            additional_notes: `${business} — ${description}`,
          },
          { onConflict: "lead_id" },
        );
      }
    } catch (err) {
      console.warn("[POST /api/partnerships] Failed to upsert lead", email, err);
    }

    return NextResponse.json({ success: true, meta_event_id: metaEventId });
  } catch (err) {
    console.error("[POST /api/partnerships]", err);
    return NextResponse.json({ success: true, meta_event_id: metaEventId });
  }
}
