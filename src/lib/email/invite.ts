import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SendInviteEmailParams {
  to: string;
  name: string;
  magicLink: string;
}

interface SendInviteEmailResult {
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Send Invite Email
// ---------------------------------------------------------------------------

export async function sendInviteEmail({
  to,
  name,
  magicLink,
}: SendInviteEmailParams): Promise<SendInviteEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Email not configured" };
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "team@claru.ai";

  try {
    const { error } = await resend.emails.send({
      from: `Claru AI <${fromAddress}>`,
      to,
      subject: "Your Claru Data Portal Access",
      html: buildInviteHtml({ name, magicLink }),
      text: buildInvitePlainText({ name, magicLink }),
    });

    if (error) {
      console.error("[sendInviteEmail] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error sending invite email";
    console.error("[sendInviteEmail] Unexpected error:", err);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// HTML Template
// ---------------------------------------------------------------------------

function buildInviteHtml({
  name,
  magicLink,
}: {
  name: string;
  magicLink: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Claru Data Portal Access</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'JetBrains Mono','Courier New',monospace;color:#e8e8e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:14px;letter-spacing:3px;color:#00ff88;text-transform:uppercase;">Claru AI</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#0a0a0a;border:1px solid rgba(0,255,136,0.15);border-radius:8px;padding:32px;">

              <!-- Title -->
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                Portal Access Granted
              </h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                // your data portal is ready
              </p>

              <!-- Body -->
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                Hi ${escapeHtml(name)},
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                Your access to the Claru Data Portal has been granted. You can now browse our curated datasets, preview samples, and review detailed metadata.
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                Click the button below to access your portal:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#00ff88;border-radius:6px;">
                    <a href="${escapeHtml(magicLink)}"
                       target="_blank"
                       style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#050505;text-decoration:none;font-family:'JetBrains Mono','Courier New',monospace;letter-spacing:0.05em;">
                      Access Portal
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Note -->
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(0,255,136,0.1);">
                <p style="margin:0 0 8px 0;font-size:12px;line-height:1.5;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                  This link expires in <span style="color:#00ff88;">24 hours</span>. If it has expired, contact your administrator to request a new invite.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                  Need help? Reach us at <a href="mailto:team@claru.ai" style="color:#00ff88;text-decoration:none;">team@claru.ai</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555555;font-family:'JetBrains Mono','Courier New',monospace;">
                Claru AI &mdash; Data Portal
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Plain Text Fallback
// ---------------------------------------------------------------------------

function buildInvitePlainText({
  name,
  magicLink,
}: {
  name: string;
  magicLink: string;
}): string {
  return `CLARU AI — Portal Access Granted

Hi ${name},

Your access to the Claru Data Portal has been granted. You can now browse our curated datasets, preview samples, and review detailed metadata.

Access your portal here:
${magicLink}

This link expires in 24 hours. If it has expired, contact your administrator to request a new invite.

Need help? Reach us at team@claru.ai

---
Claru AI — Data Portal`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
