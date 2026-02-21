import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, email, company, project_description } = body;

  if (!name || !email || !company) {
    return NextResponse.json(
      { error: "Name, email, and company are required" },
      { status: 400 }
    );
  }

  try {
    await resend.emails.send({
      from: `Claru AI <${process.env.RESEND_FROM_EMAIL || "team@claru.ai"}>`,
      to: "contact@claru.ai",
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
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.4);">
            Claru AI — Consultation Request
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ success: true }); // Don't leak errors to client
  }
}
