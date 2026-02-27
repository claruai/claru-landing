import { Resend } from 'resend';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

// ---------------------------------------------------------------------------
// Resend Client
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'team@claru.ai';
const ADMIN_EMAIL = FROM_EMAIL; // admin notifications go to the same address

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeadInfo {
  name: string;
  email: string;
  company: string;
  role: string;
  data_needs: string;
  use_case: string;
}

interface ApprovalLeadInfo {
  name: string;
  email: string;
  company: string;
}

interface RejectionLeadInfo {
  name: string;
  email: string;
}

// ---------------------------------------------------------------------------
// Admin Notification: New Access Request
// ---------------------------------------------------------------------------

export async function sendAdminNotification(lead: LeadInfo) {
  const subject = `New Data Catalog Access Request \u2014 ${lead.company || lead.name}`;

  const html = buildAdminNotificationHtml(lead);

  const { error } = await resend.emails.send({
    from: `Claru AI <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject,
    html,
  });

  if (error) {
    console.error('[sendAdminNotification] Resend error:', error);
  }
}

// ---------------------------------------------------------------------------
// HTML Template
// ---------------------------------------------------------------------------

function buildAdminNotificationHtml(lead: LeadInfo): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://claru.ai';
  const adminLeadsUrl = `${siteUrl}/admin/leads`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Data Catalog Access Request</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:'JetBrains Mono','Courier New',monospace;color:#FFFFFF;">
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
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                New Access Request
              </h1>
              <p style="margin:0 0 28px 0;font-size:14px;color:#888888;">
                A new data catalog access request has been submitted.
              </p>

              <!-- Lead Details Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${fieldRow('Name', escapeHtml(lead.name))}
                ${fieldRow('Email', escapeHtml(lead.email))}
                ${fieldRow('Company', escapeHtml(lead.company))}
                ${fieldRow('Role', escapeHtml(lead.role))}
                ${fieldRow('Data Needs', escapeHtml(lead.data_needs))}
                ${fieldRow('Use Case', escapeHtml(lead.use_case))}
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#92B090;border-radius:6px;">
                    <a href="${escapeHtml(adminLeadsUrl)}"
                       target="_blank"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#0a0908;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                      Review in Admin Portal
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555555;">
                Claru AI &mdash; Data Catalog Portal
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
// Supabase Auth: Create User for Approved Lead
// ---------------------------------------------------------------------------

/**
 * Creates a Supabase Auth user for an approved lead's email address.
 * If the user already exists (e.g. re-approval), returns the existing user ID.
 * Returns the Supabase auth user ID to store on the lead record.
 */
export async function createSupabaseAuthUser(
  email: string
): Promise<{ userId: string; error?: string }> {
  const supabase = createSupabaseAdminClient();

  // Attempt to create the auth user with email already confirmed
  const { data: createData, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (createData?.user) {
    return { userId: createData.user.id };
  }

  // If the user already exists, look them up by email
  if (createError && createError.message?.includes('already been registered')) {
    const { data: listData, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('[createSupabaseAuthUser] listUsers error:', listError);
      return { userId: '', error: listError.message };
    }

    const existingUser = listData.users.find((u) => u.email === email);
    if (existingUser) {
      return { userId: existingUser.id };
    }

    return { userId: '', error: 'User reported as existing but not found' };
  }

  console.error('[createSupabaseAuthUser] createUser error:', createError);
  return { userId: '', error: createError?.message ?? 'Unknown error' };
}

// ---------------------------------------------------------------------------
// Lead Approval Email
// ---------------------------------------------------------------------------

export async function sendLeadApprovalEmail(lead: ApprovalLeadInfo) {
  const subject = 'Your Claru Data Catalog Access Has Been Approved';
  const html = buildApprovalHtml(lead);

  const { error } = await resend.emails.send({
    from: `Claru AI <${FROM_EMAIL}>`,
    to: lead.email,
    subject,
    html,
  });

  if (error) {
    console.error('[sendLeadApprovalEmail] Resend error:', error);
  }
}

function buildApprovalHtml(lead: ApprovalLeadInfo): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://claru.ai';
  const portalUrl = `${siteUrl}/portal`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Claru Data Catalog Access Has Been Approved</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:'JetBrains Mono','Courier New',monospace;color:#FFFFFF;">
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
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Welcome to the Data Catalog
              </h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#888888;">
                Your access request has been approved.
              </p>

              <!-- Body -->
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Hi ${escapeHtml(lead.name)},
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Congratulations &mdash; your request to access the Claru Data Catalog on behalf of
                <strong style="color:#FFFFFF;">${escapeHtml(lead.company)}</strong> has been approved.
                You can now browse our curated datasets, preview video samples, and review detailed metadata.
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Click the button below to access your personalized portal.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#92B090;border-radius:6px;">
                    <a href="${escapeHtml(portalUrl)}"
                       target="_blank"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#0a0908;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                      Access Your Data Catalog
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Note -->
              <p style="margin:24px 0 0 0;font-size:12px;line-height:1.5;color:#888888;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Use this email address (<span style="color:#92B090;">${escapeHtml(lead.email)}</span>) to sign in via magic link.
                If your session expires, you can request a new sign-in link from the catalog page.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555555;">
                Claru AI &mdash; Data Catalog Portal
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
// Lead Rejection Email
// ---------------------------------------------------------------------------

export async function sendLeadRejectionEmail(
  lead: RejectionLeadInfo,
  feedback?: string
) {
  const subject = 'Update on Your Claru Data Catalog Request';
  const html = buildRejectionHtml(lead, feedback);

  const { error } = await resend.emails.send({
    from: `Claru AI <${FROM_EMAIL}>`,
    to: lead.email,
    subject,
    html,
  });

  if (error) {
    console.error('[sendLeadRejectionEmail] Resend error:', error);
  }
}

function buildRejectionHtml(
  lead: RejectionLeadInfo,
  feedback?: string
): string {
  // Read booking URL from the database setting, falling back to env/default.
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? 'https://claru.ai/#contact';
  try {
    const { createSupabaseAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'booking_url')
      .single<{ value: string }>();
    if (data?.value) bookingUrl = data.value;
  } catch {
    // Use fallback
  }

  const feedbackBlock = feedback
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#1a1a18;border:1px solid #2a2a28;border-radius:6px;padding:16px;">
            <span style="font-size:12px;color:#92B090;text-transform:uppercase;letter-spacing:1px;">Feedback</span>
            <p style="margin:8px 0 0 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              ${escapeHtml(feedback)}
            </p>
          </td>
        </tr>
      </table>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Update on Your Claru Data Catalog Request</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:'JetBrains Mono','Courier New',monospace;color:#FFFFFF;">
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
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Update on Your Request
              </h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#888888;">
                Thank you for your interest in the Claru Data Catalog.
              </p>

              <!-- Body -->
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Hi ${escapeHtml(lead.name)},
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                After reviewing your access request, we&rsquo;re unable to grant catalog access
                at this time. This may be due to current availability, data type alignment,
                or other factors.
              </p>

              ${feedbackBlock}

              <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                We&rsquo;d love to learn more about your specific needs. Book a call with our
                team to discuss how we can help.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#92B090;border-radius:6px;">
                    <a href="${escapeHtml(bookingUrl)}"
                       target="_blank"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#0a0908;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                      Book a Call
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555555;">
                Claru AI &mdash; Data Catalog Portal
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
// Helpers
// ---------------------------------------------------------------------------

function fieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1a1a18;vertical-align:top;">
        <span style="font-size:12px;color:#92B090;text-transform:uppercase;letter-spacing:1px;">${label}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:4px 0 12px 0;border-bottom:1px solid #1a1a18;">
        <span style="font-size:14px;color:#e8e8e8;">${value || '(not provided)'}</span>
      </td>
    </tr>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
