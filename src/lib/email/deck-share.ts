import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SendDeckShareEmailParams {
  to: string;
  recipientName: string;
  deckTitle: string;
  shareUrl: string;
}

interface SendDeckShareEmailResult {
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Send Deck Share Email
// ---------------------------------------------------------------------------

export async function sendDeckShareEmail({
  to,
  recipientName,
  deckTitle,
  shareUrl,
}: SendDeckShareEmailParams): Promise<SendDeckShareEmailResult> {
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
      subject: "A presentation from Claru AI",
      html: buildDeckShareHtml({ recipientName, deckTitle, shareUrl }),
      text: buildDeckSharePlainText({ recipientName, deckTitle, shareUrl }),
    });

    if (error) {
      console.error("[sendDeckShareEmail] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error sending deck share email";
    console.error("[sendDeckShareEmail] Unexpected error:", err);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// HTML Template
// ---------------------------------------------------------------------------

function buildDeckShareHtml({
  recipientName,
  deckTitle,
  shareUrl,
}: {
  recipientName: string;
  deckTitle: string;
  shareUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>A presentation from Claru AI</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:'JetBrains Mono','Courier New',monospace;color:#e8e8e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0908;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:14px;letter-spacing:3px;color:#92B090;text-transform:uppercase;">Claru AI</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#121210;border:1px solid #2a2a28;border-radius:8px;padding:32px;">

              <!-- Title -->
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                ${escapeHtml(deckTitle)}
              </h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                // a presentation has been shared with you
              </p>

              <!-- Body -->
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                Hi ${escapeHtml(recipientName)},
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                The Claru AI team has shared a presentation with you. Click the button below to view it.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#92B090;border-radius:6px;">
                    <a href="${escapeHtml(shareUrl)}"
                       target="_blank"
                       style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#0a0908;text-decoration:none;font-family:'JetBrains Mono','Courier New',monospace;letter-spacing:0.05em;">
                      View Presentation
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer Note -->
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #2a2a28;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                  Need help? Reach us at <a href="mailto:team@claru.ai" style="color:#92B090;text-decoration:none;">team@claru.ai</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555555;font-family:'JetBrains Mono','Courier New',monospace;">
                Claru AI &mdash; Expert Human Intelligence for AI Labs
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

function buildDeckSharePlainText({
  recipientName,
  deckTitle,
  shareUrl,
}: {
  recipientName: string;
  deckTitle: string;
  shareUrl: string;
}): string {
  return `CLARU AI — ${deckTitle}

Hi ${recipientName},

The Claru AI team has shared a presentation with you.

View it here:
${shareUrl}

Need help? Reach us at team@claru.ai

---
Claru AI — Expert Human Intelligence for AI Labs`;
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
