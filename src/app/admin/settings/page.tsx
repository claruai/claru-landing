"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Setting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Email Template Generators (mirrors src/lib/email.ts)
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1a1a18;vertical-align:top;">
        <span style="font-size:12px;color:#92B090;text-transform:uppercase;letter-spacing:1px;">${label}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:4px 0 12px 0;border-bottom:1px solid #1a1a18;">
        <span style="font-size:14px;color:#e8e8e8;">${value || "(not provided)"}</span>
      </td>
    </tr>`;
}

function buildAdminNotificationHtml(): string {
  const sampleLead = {
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Acme AI Labs",
    role: "ML Engineer",
    data_needs: "Egocentric video data for embodied AI training",
    use_case: "Training vision-language models for robotic manipulation",
  };
  const adminLeadsUrl = "https://claru.ai/admin/leads";

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
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:14px;letter-spacing:3px;color:#92B090;text-transform:uppercase;">Claru AI</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#121210;border:1px solid #2a2a28;border-radius:8px;padding:32px;">
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                New Access Request
              </h1>
              <p style="margin:0 0 28px 0;font-size:14px;color:#888888;">
                A new data catalog access request has been submitted.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${fieldRow("Name", escapeHtml(sampleLead.name))}
                ${fieldRow("Email", escapeHtml(sampleLead.email))}
                ${fieldRow("Company", escapeHtml(sampleLead.company))}
                ${fieldRow("Role", escapeHtml(sampleLead.role))}
                ${fieldRow("Data Needs", escapeHtml(sampleLead.data_needs))}
                ${fieldRow("Use Case", escapeHtml(sampleLead.use_case))}
              </table>
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

function buildApprovalHtml(): string {
  const sampleLead = {
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Acme AI Labs",
  };
  const portalUrl = "https://claru.ai/portal";

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
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:14px;letter-spacing:3px;color:#92B090;text-transform:uppercase;">Claru AI</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#121210;border:1px solid #2a2a28;border-radius:8px;padding:32px;">
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Welcome to the Data Catalog
              </h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#888888;">
                Your access request has been approved.
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Hi ${escapeHtml(sampleLead.name)},
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Congratulations &mdash; your request to access the Claru Data Catalog on behalf of
                <strong style="color:#FFFFFF;">${escapeHtml(sampleLead.company)}</strong> has been approved.
                You can now browse our curated datasets, preview video samples, and review detailed metadata.
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Click the button below to access your personalized portal.
              </p>
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
              <p style="margin:24px 0 0 0;font-size:12px;line-height:1.5;color:#888888;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Use this email address (<span style="color:#92B090;">${escapeHtml(sampleLead.email)}</span>) to sign in via magic link.
                If your session expires, you can request a new sign-in link from the catalog page.
              </p>
            </td>
          </tr>
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

function buildRejectionHtml(withFeedback: boolean): string {
  const sampleLead = { name: "Jane Smith", email: "jane@example.com" };
  const bookingUrl = "https://calendly.com/claru";

  const feedbackBlock = withFeedback
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#1a1a18;border:1px solid #2a2a28;border-radius:6px;padding:16px;">
            <span style="font-size:12px;color:#92B090;text-transform:uppercase;letter-spacing:1px;">Feedback</span>
            <p style="margin:8px 0 0 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              We are currently focused on video and robotics datasets. We would love to revisit your request in Q2 when we expand our multimodal catalog.
            </p>
          </td>
        </tr>
      </table>`
    : "";

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
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:14px;letter-spacing:3px;color:#92B090;text-transform:uppercase;">Claru AI</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#121210;border:1px solid #2a2a28;border-radius:8px;padding:32px;">
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Update on Your Request
              </h1>
              <p style="margin:0 0 24px 0;font-size:14px;color:#888888;">
                Thank you for your interest in the Claru Data Catalog.
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                Hi ${escapeHtml(sampleLead.name)},
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
// Template Data
// ---------------------------------------------------------------------------

interface EmailTemplate {
  id: string;
  label: string;
  description: string;
  html: string;
}

function getEmailTemplates(): EmailTemplate[] {
  return [
    {
      id: "admin-notification",
      label: "Admin Notification",
      description: "Sent to the admin team when a new access request is submitted.",
      html: buildAdminNotificationHtml(),
    },
    {
      id: "lead-approval",
      label: "Lead Approval",
      description: "Sent to a lead when their access request is approved.",
      html: buildApprovalHtml(),
    },
    {
      id: "lead-rejection",
      label: "Lead Rejection",
      description: "Sent to a lead when their access request is rejected (no feedback).",
      html: buildRejectionHtml(false),
    },
    {
      id: "lead-rejection-feedback",
      label: "Lead Rejection (with feedback)",
      description: "Sent to a lead when their access request is rejected with feedback.",
      html: buildRejectionHtml(true),
    },
  ];
}

// ---------------------------------------------------------------------------
// Admin Settings Page
// ---------------------------------------------------------------------------

export default function AdminSettingsPage() {
  const router = useRouter();

  // Booking URL state
  const [bookingUrl, setBookingUrl] = useState("");
  const [savedBookingUrl, setSavedBookingUrl] = useState("");
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  // Email template state
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const templates = getEmailTemplates();

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        const settings: Setting[] = data.settings ?? [];
        const booking = settings.find((s) => s.key === "booking_url");
        if (booking?.value) {
          setBookingUrl(booking.value);
          setSavedBookingUrl(booking.value);
        }
      } catch {
        // settings table might not exist yet, that is okay
      } finally {
        setIsLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSaveBookingUrl = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setSaveError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "booking_url", value: bookingUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSavedBookingUrl(bookingUrl);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  }, [bookingUrl]);

  const handleCopyHtml = useCallback(async (templateId: string, html: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopyStatus((prev) => ({ ...prev, [templateId]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [templateId]: false }));
      }, 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopyStatus((prev) => ({ ...prev, [templateId]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [templateId]: false }));
      }, 2000);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }, [router]);

  // Write HTML into iframe after render
  const writeIframeContent = useCallback(
    (iframe: HTMLIFrameElement | null, html: string) => {
      if (!iframe) return;
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    },
    []
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          <Link
            href="/admin/dashboard"
            className="hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            claru
            <span className="text-[var(--accent-primary)]">/</span>
            admin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-secondary)]">settings</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200"
        >
          [logout]
        </button>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* ----------------------------------------------------------------- */}
        {/* Section 1: Call Booking URL */}
        {/* ----------------------------------------------------------------- */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)] mb-1">
              Call Booking URL
            </h2>
            <p className="text-sm font-mono text-[var(--text-muted)]">
              Configure the booking link used in rejection emails and CTAs.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
            {isLoadingSettings ? (
              <div className="text-sm font-mono text-[var(--text-muted)] animate-pulse">
                loading settings...
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="booking-url"
                    className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
                  >
                    booking url
                  </label>
                  <input
                    id="booking-url"
                    type="url"
                    value={bookingUrl}
                    onChange={(e) => {
                      setBookingUrl(e.target.value);
                      setSaveStatus("idle");
                    }}
                    placeholder="https://calendly.com/your-link"
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200"
                  />
                </div>

                {savedBookingUrl && (
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Current URL:{" "}
                    <a
                      href={savedBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-primary)] hover:underline"
                    >
                      {savedBookingUrl}
                    </a>
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSaveBookingUrl}
                    disabled={isSaving || bookingUrl === savedBookingUrl}
                    className="px-4 py-2 text-sm font-mono font-medium rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "saving..." : "save"}
                  </button>

                  {saveStatus === "success" && (
                    <span className="text-xs font-mono text-[var(--accent-primary)]">
                      saved successfully
                    </span>
                  )}

                  {saveStatus === "error" && (
                    <span className="text-xs font-mono text-[var(--error)]">
                      error: {saveError}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Section 2: Email Template Previews */}
        {/* ----------------------------------------------------------------- */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)] mb-1">
              Email Templates
            </h2>
            <p className="text-sm font-mono text-[var(--text-muted)]">
              Preview all transactional email templates rendered with sample data.
            </p>
          </div>

          <div className="space-y-4">
            {templates.map((template) => {
              const isExpanded = expandedTemplate === template.id;
              const isCopied = copyStatus[template.id] ?? false;

              return (
                <div
                  key={template.id}
                  className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden"
                >
                  {/* Template header (accordion toggle) */}
                  <button
                    onClick={() =>
                      setExpandedTemplate(isExpanded ? null : template.id)
                    }
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--bg-primary)]/50 transition-colors duration-150"
                  >
                    <div>
                      <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
                        {template.label}
                      </h3>
                      <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                        {template.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 ml-4">
                      {isExpanded ? "[-]" : "[+]"}
                    </span>
                  </button>

                  {/* Expanded template preview */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border-subtle)]">
                      {/* Copy button */}
                      <div className="px-6 py-3 flex items-center justify-end border-b border-[var(--border-subtle)]">
                        <button
                          onClick={() =>
                            handleCopyHtml(template.id, template.html)
                          }
                          className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 transition-colors duration-150"
                        >
                          {isCopied ? "[copied]" : "[copy html]"}
                        </button>
                      </div>

                      {/* Preview iframe */}
                      <div className="px-6 py-4">
                        <div className="rounded-md border border-[var(--border-subtle)] overflow-hidden bg-[#0a0908]">
                          <iframe
                            ref={(el) => {
                              iframeRefs.current[template.id] = el;
                              writeIframeContent(el, template.html);
                            }}
                            title={`${template.label} preview`}
                            className="w-full border-0"
                            style={{ height: "500px" }}
                            sandbox="allow-same-origin"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
