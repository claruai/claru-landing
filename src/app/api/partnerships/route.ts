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

  // Server-side validation: bound lengths, validate email + sample_link.
  // Client uses Zod but anyone hitting the route directly can post arbitrary
  // strings — and the description/business get rendered into an outbound
  // email + saved to Supabase.
  if (
    name.length > 200 ||
    email.length > 320 ||
    business.length > 200 ||
    business_type.length > 80 ||
    description.length > 2000
  ) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  // sample_link: optional, but if provided must be http(s). Reject
  // javascript:, data:, file:, etc. — those would render as scripted hrefs
  // in the inbound email rendered by some mail clients.
  let safeSampleLink: string | null = sample_link ?? null;
  if (safeSampleLink) {
    try {
      const parsed = new URL(safeSampleLink);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        safeSampleLink = null;
      }
    } catch {
      safeSampleLink = null;
    }
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

  // PostHog capture is fire-and-forget; never block the user on it.
  try {
    const ph = getPostHogServer();
    ph?.capture({
      distinctId: email,
      event: "partnerships_form_server",
      properties: {
        business,
        business_type,
        has_sample_link: !!safeSampleLink,
        channel: "supply",
      },
    });
  } catch (err) {
    console.warn("[POST /api/partnerships] PostHog capture failed", err);
  }

  // Resend send is the load-bearing path — if it fails, the lead is lost.
  // Don't swallow this error; return 502 so the client can show a real
  // error and the user can retry.
  try {
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
            ${safeSampleLink ? `<tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Sample</td><td style="padding: 8px 0;"><a href="${escapeHtml(safeSampleLink)}" style="color: #a8c4a6;">${escapeHtml(safeSampleLink)}</a></td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.4);">
            Claru AI — Partner Application • channel: supply
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[POST /api/partnerships] Resend send failed", err);
    return NextResponse.json(
      { error: "Email delivery failed — please email partners@claru.ai directly." },
      { status: 502 },
    );
  }

  // Supabase upsert is best-effort. If it fails the lead is in the inbox
  // (already sent above) — we just lose the CRM row. Don't fail the request.
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
          sample_link: safeSampleLink,
          additional_notes: `${business} — ${description}`,
        },
        { onConflict: "lead_id" },
      );
    }
  } catch (err) {
    console.warn("[POST /api/partnerships] Failed to upsert lead", email, err);
  }

  return NextResponse.json({ success: true, meta_event_id: metaEventId });
}
