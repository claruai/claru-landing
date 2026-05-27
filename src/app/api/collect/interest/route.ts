import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPostHogServer } from "@/lib/posthog-server";
import { detectGeo } from "@/lib/geo";
import { sendTikTokServerEvent } from "@/lib/tracking/tiktok-server";

/**
 * Interest form for supply-side data collectors (e.g. /br/collect/captura-domestica).
 *
 * LATAM-gated conversion: if the visitor's IP geolocates to South
 * America or Mexico, we treat the submit as a real conversion —
 * (1) fire TikTok server-side `CompleteRegistration` (deduped with the
 *     client `ttq.track` via shared event_id),
 * (2) send the user a follow-up email with the signup link,
 * (3) flag the response so the form can show a "go sign up now" CTA.
 *
 * Outside LATAM we still store the lead, notify the team, and return
 * success — but we do NOT fire TikTok or send the user email. Keeps
 * the pixel learning on the audience we actually pay to reach.
 */

const SIGNUP_URL = "https://app.claru.ai/signup";

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

function buildSignupEmail({
  lang,
  name,
  signupUrl,
}: {
  lang: "pt" | "en";
  name: string;
  signupUrl: string;
}): { subject: string; html: string } {
  const firstName = name.split(" ")[0] || (lang === "pt" ? "olá" : "hi");

  if (lang === "pt") {
    return {
      subject: "Próximo passo: criar sua conta na Claru AI",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0908; color: #e8e8e8; padding: 32px 24px; max-width: 560px; margin: 0 auto;">
          <h2 style="margin: 0 0 16px; color: #92B090; font-size: 18px;">${escapeHtml(firstName)}, recebemos seu cadastro.</h2>
          <p style="margin: 0 0 16px; line-height: 1.6;">O projeto está aberto agora. Pra começar, crie sua conta direto no nosso app:</p>
          <p style="margin: 24px 0;">
            <a href="${signupUrl}" style="display: inline-block; background: #ffffff; color: #0a0908; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: 600;">
              Criar minha conta →
            </a>
          </p>
          <p style="margin: 0 0 12px; line-height: 1.6; font-size: 14px; color: rgba(255,255,255,0.7);">
            Lá você confirma elegibilidade, recebe o guia de gravação e libera o clipe piloto. Sem taxa, em nenhum momento.
          </p>
          <p style="margin: 24px 0 0; line-height: 1.6; font-size: 13px; color: rgba(255,255,255,0.5);">
            Dúvidas? Responda esse e-mail.<br/>
            Claru AI · Uma empresa Reka AI, apoiada pela NVIDIA
          </p>
        </div>
      `,
    };
  }

  return {
    subject: "Next step: create your Claru AI account",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0908; color: #e8e8e8; padding: 32px 24px; max-width: 560px; margin: 0 auto;">
        <h2 style="margin: 0 0 16px; color: #92B090; font-size: 18px;">${escapeHtml(firstName)}, we got your application.</h2>
        <p style="margin: 0 0 16px; line-height: 1.6;">The project is live. To get started, create your account in our app:</p>
        <p style="margin: 24px 0;">
          <a href="${signupUrl}" style="display: inline-block; background: #ffffff; color: #0a0908; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: 600;">
            Create my account →
          </a>
        </p>
        <p style="margin: 0 0 12px; line-height: 1.6; font-size: 14px; color: rgba(255,255,255,0.7);">
          You'll confirm eligibility, get the filming guide, and unlock the pilot clip. No fee, ever.
        </p>
        <p style="margin: 24px 0 0; line-height: 1.6; font-size: 13px; color: rgba(255,255,255,0.5);">
          Questions? Just reply to this email.<br/>
          Claru AI · A Reka AI company, backed by NVIDIA
        </p>
      </div>
    `,
  };
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    name,
    email,
    whatsapp,
    city,
    phone_model,
    country: bodyCountry = "BR",
    source = "br-collect-captura-domestica",
    lang: rawLang = "pt",
    event_id,
    visitor_id,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  // Geo decision — header-driven, with a dev-only ?dev_geo escape hatch.
  const geo = detectGeo(request);
  const detectedCountry = geo.country || bodyCountry;
  const isLatamConversion = geo.isLatamConversion;
  const lang: "pt" | "en" = rawLang === "en" ? "en" : "pt";

  const useCaseSummary = [
    `Country: ${detectedCountry}`,
    `Geo source: ${geo.source}`,
    `LATAM conversion: ${isLatamConversion ? "yes" : "no"}`,
    `City: ${city || "—"}`,
    `WhatsApp: ${whatsapp || "—"}`,
    `Phone model: ${phone_model || "—"}`,
    `Source: ${source}`,
  ].join(" · ");

  const heardAboutSummary = [utm_source, utm_medium, utm_campaign]
    .filter(Boolean)
    .join(" / ");

  try {
    const ph = getPostHogServer();
    ph?.capture({
      distinctId: email,
      event: "supply_interest_form_server",
      properties: {
        country: detectedCountry,
        geo_source: geo.source,
        is_latam_conversion: isLatamConversion,
        city,
        phone_model,
        source,
        lang,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
      },
    });

    // Team notification email — LATAM cohort only. Non-LATAM submissions
    // are still stored in Supabase and surface via the app.claru.ai
    // signup funnel; the inbox noise isn't worth it.
    if (isLatamConversion) {
      // Team notification — LATAM only.
      try {
        await getResend().emails.send({
          from: `Claru AI <${process.env.RESEND_FROM_EMAIL || "team@claru.ai"}>`,
          to: "contact@claru.ai",
          bcc: "claru@attio.email",
          subject: `[LATAM ✓] New collector interest — ${detectedCountry} · ${city || "—"}`,
          html: `
            <div style="font-family: 'JetBrains Mono', monospace; background: #0a0908; color: #e8e8e8; padding: 32px; border-radius: 8px;">
              <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 24px;">
                <h2 style="margin: 0; color: #92B090; font-size: 14px; letter-spacing: 0.05em;">// NEW COLLECTOR INTEREST · ${escapeHtml(detectedCountry)} · LATAM</h2>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #92B090; width: 160px; vertical-align: top;">Name</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #a8c4a6;">${escapeHtml(email)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">WhatsApp</td><td style="padding: 8px 0;">${escapeHtml(whatsapp || "—")}</td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Country (geo)</td><td style="padding: 8px 0;">${escapeHtml(detectedCountry)} <span style="color: rgba(255,255,255,0.4);">(${escapeHtml(geo.source)})</span></td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">TikTok event</td><td style="padding: 8px 0;"><strong style="color:#92B090;">CompleteRegistration fired</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">City</td><td style="padding: 8px 0;">${escapeHtml(city || "—")}</td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Phone model</td><td style="padding: 8px 0;">${escapeHtml(phone_model || "—")}</td></tr>
                <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Source</td><td style="padding: 8px 0;">${escapeHtml(source)} · lang=${escapeHtml(lang)}</td></tr>
                ${heardAboutSummary ? `<tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">UTM</td><td style="padding: 8px 0;">${escapeHtml(heardAboutSummary)}</td></tr>` : ""}
              </table>
            </div>
          `,
        });
      } catch {
        console.warn("[POST /api/collect/interest] Failed to send team email", email);
      }

      // User-facing signup CTA email.
      try {
        const { subject, html } = buildSignupEmail({ lang, name, signupUrl: SIGNUP_URL });
        await getResend().emails.send({
          from: `Claru AI <${process.env.RESEND_FROM_EMAIL || "team@claru.ai"}>`,
          to: email,
          subject,
          html,
        });
      } catch {
        console.warn("[POST /api/collect/interest] Failed to send signup email", email);
      }
    }

    try {
      await getResend().contacts.create({
        audienceId:
          process.env.RESEND_SUPPLY_AUDIENCE_ID ||
          process.env.RESEND_AUDIENCE_ID ||
          "e33492fa-da3f-495e-a699-c054e0e5f27a",
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
        unsubscribed: false,
      });
    } catch {
      console.warn("[POST /api/collect/interest] Failed to create Resend contact", email);
    }

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
            company: `Collector · ${detectedCountry}`,
            use_case: useCaseSummary,
            heard_about: heardAboutSummary || null,
          },
          { onConflict: "email" },
        )
        .select("id")
        .single();

      if (leadRow?.id) {
        await supabase.from("lead_crm_data").upsert(
          {
            lead_id: leadRow.id,
            type: "supply",
            // LATAM converts get a slightly higher score — they matched
            // the audience we paid to acquire and got the signup email.
            icp_score: isLatamConversion ? 6 : 5,
            thread_state: "warm",
            waiting_on: "us",
            last_touch_at: new Date().toISOString(),
          },
          { onConflict: "lead_id", ignoreDuplicates: true },
        );
      }
    } catch {
      console.warn("[POST /api/collect/interest] Failed to upsert lead", email);
    }

    // LATAM-only: server-side TikTok event. Deduped with the client
    // pixel via shared event_id. No-op when env is missing.
    if (isLatamConversion && event_id) {
      const referer = request.headers.get("referer") || undefined;
      const userAgent = request.headers.get("user-agent") || undefined;
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        undefined;
      // Fire-and-forget — don't block the form response on TikTok latency.
      const sharedEvent = {
        event_id,
        email,
        phone: whatsapp || undefined,
        externalId: visitor_id || undefined,
        ip,
        userAgent,
        url: referer,
        contents: [
          {
            content_id: source,
            content_type: "product" as const,
            content_name: "Captura doméstica BR",
          },
        ],
        value: 50,
        currency: "USD",
        utm: { utm_source, utm_medium, utm_campaign, utm_content, utm_term },
      };
      void sendTikTokServerEvent({ ...sharedEvent, event: "CompleteRegistration" });
      void sendTikTokServerEvent({ ...sharedEvent, event: "SubmitForm" });
      void sendTikTokServerEvent({ ...sharedEvent, event: "Lead" });
    }

    return NextResponse.json({
      success: true,
      is_latam_conversion: isLatamConversion,
      signup_url: isLatamConversion ? SIGNUP_URL : null,
    });
  } catch (err) {
    console.error("[POST /api/collect/interest]", err);
    return NextResponse.json({
      success: true,
      is_latam_conversion: false,
      signup_url: null,
    });
  }
}
