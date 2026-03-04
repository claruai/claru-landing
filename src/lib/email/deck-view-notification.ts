import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SendDeckViewNotificationParams {
  /** Lead name (e.g. "Jane Smith") */
  leadName: string;
  /** Lead company (e.g. "Acme Corp") — may be empty */
  leadCompany: string;
  /** Lead email */
  leadEmail: string;
  /** Deck/template name */
  deckName: string;
  /** Full URL to the deck editor share panel */
  editorUrl: string;
}

interface SendDeckViewNotificationResult {
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Send Deck View Notification Email
// ---------------------------------------------------------------------------

/**
 * Sends a notification email to the admin when a tracked lead views a shared
 * deck. Uses Claru branding from MEMORY.md: bg #0a0908, card #121210,
 * border #2a2a28, accent #92B090.
 *
 * Never throws — all errors are caught and returned.
 */
export async function sendDeckViewNotification({
  leadName,
  leadCompany,
  leadEmail,
  deckName,
  editorUrl,
}: SendDeckViewNotificationParams): Promise<SendDeckViewNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Email not configured" };
  }

  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ??
    process.env.RESEND_FROM_EMAIL ??
    "team@claru.ai";

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "team@claru.ai";

  const resend = new Resend(apiKey);

  const companyLabel = leadCompany ? ` (${leadCompany})` : "";
  const subject = `${leadName}${companyLabel} viewed your deck "${deckName}"`;

  try {
    const { error } = await resend.emails.send({
      from: `Claru AI <${fromAddress}>`,
      to: adminEmail,
      subject,
      html: buildNotificationHtml({
        leadName,
        leadCompany,
        leadEmail,
        deckName,
        editorUrl,
      }),
      text: buildNotificationPlainText({
        leadName,
        leadCompany,
        leadEmail,
        deckName,
        editorUrl,
      }),
    });

    if (error) {
      console.error("[sendDeckViewNotification] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error sending deck view notification";
    console.error("[sendDeckViewNotification] Unexpected error:", err);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// HTML Template — Claru branding (dark theme, sage green)
// ---------------------------------------------------------------------------

function buildNotificationHtml({
  leadName,
  leadCompany,
  leadEmail,
  deckName,
  editorUrl,
}: Omit<SendDeckViewNotificationParams, "editorUrl"> & {
  editorUrl: string;
}): string {
  const companyLine = leadCompany
    ? `<span style="color:#92B090;">${escapeHtml(leadCompany)}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Deck Viewed</title>
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
              <h1 style="margin:0 0 8px 0;font-size:18px;font-weight:600;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                Deck Engagement Alert
              </h1>
              <p style="margin:0 0 24px 0;font-size:13px;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                // someone is viewing your deck
              </p>

              <!-- Lead Info -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #2a2a28;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:16px;background-color:#0a0908;">
                    <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                      ${escapeHtml(leadName)}
                    </p>
                    ${companyLine ? `<p style="margin:0 0 4px 0;font-size:13px;font-family:'JetBrains Mono','Courier New',monospace;">${companyLine}</p>` : ""}
                    <p style="margin:0;font-size:12px;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;">
                      ${escapeHtml(leadEmail)}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Deck -->
              <p style="margin:0 0 6px 0;font-size:12px;color:#888888;font-family:'JetBrains Mono','Courier New',monospace;text-transform:uppercase;letter-spacing:1px;">
                Viewed deck
              </p>
              <p style="margin:0 0 24px 0;font-size:14px;color:#e8e8e8;font-family:'JetBrains Mono','Courier New',monospace;">
                ${escapeHtml(deckName)}
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#92B090;border-radius:6px;">
                    <a href="${escapeHtml(editorUrl)}"
                       target="_blank"
                       style="display:inline-block;padding:12px 28px;font-size:13px;font-weight:700;color:#0a0908;text-decoration:none;font-family:'JetBrains Mono','Courier New',monospace;letter-spacing:0.05em;">
                      View Analytics
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Note -->
              <div style="margin-top:24px;padding-top:16px;border-top:1px solid #2a2a28;">
                <p style="margin:0;font-size:11px;line-height:1.5;color:#666666;font-family:'JetBrains Mono','Courier New',monospace;">
                  You received this because a tracked lead viewed a shared deck. Notifications are throttled to at most one per lead per deck per hour.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555555;font-family:'JetBrains Mono','Courier New',monospace;">
                Claru AI &mdash; Deck Builder
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

function buildNotificationPlainText({
  leadName,
  leadCompany,
  leadEmail,
  deckName,
  editorUrl,
}: Omit<SendDeckViewNotificationParams, "editorUrl"> & {
  editorUrl: string;
}): string {
  const companyLine = leadCompany ? ` (${leadCompany})` : "";
  return `CLARU AI -- Deck Engagement Alert

${leadName}${companyLine} is viewing your deck.

Lead: ${leadName}
${leadCompany ? `Company: ${leadCompany}\n` : ""}Email: ${leadEmail}
Deck: ${deckName}

View analytics:
${editorUrl}

---
Claru AI -- Deck Builder
Notifications throttled to max 1 per lead per deck per hour.`;
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
