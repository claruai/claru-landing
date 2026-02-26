import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  // Format: t=<timestamp>,v1=<signature>
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;

  // Verify signature if secret is configured
  if (webhookSecret) {
    const signatureHeader = request.headers.get("Calendly-Webhook-Signature");
    if (!verifySignature(rawBody, signatureHeader, webhookSecret)) {
      console.warn("[calendly-webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only handle booking created events
  if (payload.event !== "invitee.created") {
    return NextResponse.json({ received: true });
  }

  const data = payload.payload as Record<string, unknown>;
  const invitee = data.invitee as Record<string, string>;
  const event = data.event as Record<string, string>;

  const name = invitee?.name ?? "Unknown";
  const email = invitee?.email ?? "Unknown";
  const timezone = invitee?.timezone ?? "";
  const startTime = event?.start_time;
  const endTime = event?.end_time;
  const eventName = event?.name ?? "Call";

  const formattedStart = startTime ? formatDateTime(startTime) : "Unknown";
  const formattedEnd = endTime
    ? new Date(endTime).toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "";

  try {
    await resend.emails.send({
      from: `Claru AI <${process.env.RESEND_FROM_EMAIL || "team@claru.ai"}>`,
      to: "contact@claru.ai",
      subject: `Call booked — ${escapeHtml(name)} (${escapeHtml(eventName)})`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0a0908; color: #e8e8e8; padding: 32px; border-radius: 8px;">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #92B090; font-size: 14px; letter-spacing: 0.05em;">// CALL BOOKED</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #92B090; width: 120px; vertical-align: top;">Name</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #a8c4a6;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Event</td><td style="padding: 8px 0;">${escapeHtml(eventName)}</td></tr>
            <tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Time</td><td style="padding: 8px 0;">${escapeHtml(formattedStart)}${formattedEnd ? ` → ${escapeHtml(formattedEnd)}` : ""}</td></tr>
            ${timezone ? `<tr><td style="padding: 8px 0; color: #92B090; vertical-align: top;">Timezone</td><td style="padding: 8px 0;">${escapeHtml(timezone)}</td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.4);">
            Claru AI — Calendly Booking
          </div>
        </div>
      `,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[POST /api/calendly-webhook]", err);
    return NextResponse.json({ received: true }); // Don't leak errors to Calendly
  }
}
