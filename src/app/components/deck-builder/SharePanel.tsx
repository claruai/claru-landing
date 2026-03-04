"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Copy,
  Check,
  Loader2,
  Link2,
  Shield,
  Calendar,
  Eye,
  Type,
  ExternalLink,
  Globe,
  Users,
  Mail,
  Search,
  Send,
  RefreshCw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ShareSettings {
  enabled: boolean;
  slug: string | null;
  expiry: string | null;
  gate_type: "none" | "email" | "password";
  gate_value: string | null;
  cta_enabled: boolean;
  cta_text: string | null;
  cta_url: string | null;
  show_branding: boolean;
}

interface SharePanelProps {
  templateId: string;
  templateName: string;
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type?: "success" | "error" | "warning") => void;
}

interface LeadResult {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
}

interface ShareToken {
  id: string;
  email: string;
  token: string;
  lead_id: string | null;
  parent_lead_id: string | null;
  created_at: string;
  expires_at: string | null;
}

type ExpiryOption = "never" | "7d" | "30d" | "custom";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getExpiryOption(expiry: string | null): ExpiryOption {
  if (!expiry) return "never";
  const expiryDate = new Date(expiry);
  const now = new Date();
  const diffDays = Math.round(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays >= 6 && diffDays <= 8) return "7d";
  if (diffDays >= 29 && diffDays <= 31) return "30d";
  return "custom";
}

function expiryOptionToISO(option: ExpiryOption, customDate?: string): string | null {
  if (option === "never") return null;
  if (option === "custom" && customDate) return new Date(customDate).toISOString();
  const days = option === "7d" ? 7 : 30;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function formatExpiryDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Convert ISO date to YYYY-MM-DD for the date input. */
function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().split("T")[0];
}

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SharePanel({
  templateId,
  templateName,
  isOpen,
  onClose,
  showToast,
}: SharePanelProps) {
  const [settings, setSettings] = useState<ShareSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slugEditing, setSlugEditing] = useState(false);
  const [slugDraft, setSlugDraft] = useState("");
  const [expiryOption, setExpiryOption] = useState<ExpiryOption>("never");
  const [customExpiryDate, setCustomExpiryDate] = useState("");
  const [passwordDraft, setPasswordDraft] = useState("");

  // Lead sharing state
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState<LeadResult[]>([]);
  const [leadSearching, setLeadSearching] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<LeadResult[]>([]);
  const [existingTokens, setExistingTokens] = useState<ShareToken[]>([]);
  const [sendingLeadIds, setSendingLeadIds] = useState<Set<string>>(new Set());
  const [sendingAll, setSendingAll] = useState(false);
  const [resendingEmails, setResendingEmails] = useState<Set<string>>(new Set());

  // Invite by email state
  const [emailInput, setEmailInput] = useState("");
  const [sendingEmails, setSendingEmails] = useState(false);

  const slugInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leadSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Fetch settings ----------------------------------------------- */

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/share`,
      );
      if (res.ok) {
        const data = await res.json();
        const s = data.share_settings as ShareSettings;
        setSettings(s);
        setExpiryOption(getExpiryOption(s.expiry));
        if (s.expiry) setCustomExpiryDate(toDateInputValue(s.expiry));
        if (s.gate_value) setPasswordDraft(s.gate_value);
        if (data.tokens) {
          setExistingTokens(data.tokens as ShareToken[]);
        }
      }
    } catch {
      showToast("Failed to load share settings", "error");
    } finally {
      setLoading(false);
    }
  }, [templateId, showToast]);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
      setCopied(false);
      setSlugEditing(false);
      setLeadSearch("");
      setLeadResults([]);
      setSelectedLeads([]);
      setEmailInput("");
    }
  }, [isOpen, fetchSettings]);

  /* ---- Save settings (debounced auto-save) -------------------------- */

  const saveSettings = useCallback(
    async (patch: Partial<ShareSettings>) => {
      setSaving(true);
      try {
        const res = await fetch(
          `/api/admin/deck-builder/${templateId}/share`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          },
        );
        if (res.ok) {
          const data = await res.json();
          const s = data.share_settings as ShareSettings;
          setSettings(s);
          setExpiryOption(getExpiryOption(s.expiry));
          if (s.expiry) setCustomExpiryDate(toDateInputValue(s.expiry));
          if (s.gate_value) setPasswordDraft(s.gate_value);
        } else {
          const data = await res.json().catch(() => ({}));
          showToast(data.error || "Failed to save", "error");
        }
      } catch {
        showToast("Network error", "error");
      } finally {
        setSaving(false);
      }
    },
    [templateId, showToast],
  );

  /** Debounced save for inputs that change frequently (password, CTA text/url) */
  const debouncedSave = useCallback(
    (patch: Partial<ShareSettings>) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveSettings(patch), 600);
    },
    [saveSettings],
  );

  /* ---- Lead search -------------------------------------------------- */

  const searchLeads = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setLeadResults([]);
        return;
      }
      setLeadSearching(true);
      try {
        const res = await fetch(
          `/api/admin/leads?q=${encodeURIComponent(query.trim())}`,
        );
        if (res.ok) {
          const data = await res.json();
          setLeadResults(data.leads as LeadResult[]);
        }
      } catch {
        // Silently fail search
      } finally {
        setLeadSearching(false);
      }
    },
    [],
  );

  const debouncedLeadSearch = useCallback(
    (query: string) => {
      if (leadSearchTimerRef.current) clearTimeout(leadSearchTimerRef.current);
      leadSearchTimerRef.current = setTimeout(() => searchLeads(query), 300);
    },
    [searchLeads],
  );

  useEffect(() => {
    debouncedLeadSearch(leadSearch);
  }, [leadSearch, debouncedLeadSearch]);

  /* ---- Send to individual lead -------------------------------------- */

  const handleSendToLead = useCallback(
    async (leadId: string) => {
      setSendingLeadIds((prev) => new Set(prev).add(leadId));
      try {
        const res = await fetch(
          `/api/admin/deck-builder/${templateId}/share/send`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lead_ids: [leadId] }),
          },
        );
        if (res.ok) {
          const data = await res.json();
          showToast(`Sent to ${data.sent} recipient`, "success");
          // Refresh tokens
          fetchSettings();
          // Remove from selected
          setSelectedLeads((prev) => prev.filter((l) => l.id !== leadId));
        } else {
          const data = await res.json().catch(() => ({}));
          showToast(data.error || "Failed to send", "error");
        }
      } catch {
        showToast("Network error", "error");
      } finally {
        setSendingLeadIds((prev) => {
          const next = new Set(prev);
          next.delete(leadId);
          return next;
        });
      }
    },
    [templateId, showToast, fetchSettings],
  );

  /* ---- Send to all selected leads ----------------------------------- */

  const handleSendAll = useCallback(async () => {
    if (selectedLeads.length === 0) return;
    setSendingAll(true);
    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/share/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_ids: selectedLeads.map((l) => l.id),
          }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        showToast(`Sent to ${data.sent} recipients`, "success");
        fetchSettings();
        setSelectedLeads([]);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to send", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSendingAll(false);
    }
  }, [templateId, selectedLeads, showToast, fetchSettings]);

  /* ---- Resend to existing token email ------------------------------- */

  const handleResend = useCallback(
    async (email: string, leadId: string | null) => {
      setResendingEmails((prev) => new Set(prev).add(email));
      try {
        const payload: Record<string, unknown> = leadId
          ? { lead_ids: [leadId] }
          : { emails: [email] };
        const res = await fetch(
          `/api/admin/deck-builder/${templateId}/share/send`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (res.ok) {
          showToast(`Resent to ${email}`, "success");
          fetchSettings();
        } else {
          const data = await res.json().catch(() => ({}));
          showToast(data.error || "Failed to resend", "error");
        }
      } catch {
        showToast("Network error", "error");
      } finally {
        setResendingEmails((prev) => {
          const next = new Set(prev);
          next.delete(email);
          return next;
        });
      }
    },
    [templateId, showToast, fetchSettings],
  );

  /* ---- Send by email ------------------------------------------------ */

  const handleSendByEmail = useCallback(async () => {
    const emails = emailInput
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emails.length === 0) {
      showToast("Enter valid email addresses", "error");
      return;
    }

    setSendingEmails(true);
    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/share/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emails }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        showToast(`Sent to ${data.sent} recipients`, "success");
        fetchSettings();
        setEmailInput("");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to send", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSendingEmails(false);
    }
  }, [templateId, emailInput, showToast, fetchSettings]);

  /* ---- Keyboard escape ---------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* ---- Copy link ----------------------------------------------------- */

  const shareUrl = settings?.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/d/${settings.slug}`
    : null;

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy link", "error");
    }
  }, [shareUrl, showToast]);

  /* ---- Lead selection helpers --------------------------------------- */

  const addLead = useCallback((lead: LeadResult) => {
    setSelectedLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) return prev;
      return [...prev, lead];
    });
    setLeadSearch("");
    setLeadResults([]);
  }, []);

  const removeLead = useCallback((leadId: string) => {
    setSelectedLeads((prev) => prev.filter((l) => l.id !== leadId));
  }, []);

  // Emails that already have tokens (for dedup)
  const sharedEmails = new Set(existingTokens.map((t) => t.email));

  // Filter search results to exclude already-selected and already-shared leads
  const filteredResults = leadResults.filter(
    (l) =>
      !selectedLeads.some((s) => s.id === l.id),
  );

  /* ---- Render ------------------------------------------------------- */

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-[420px] max-w-full bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-[slideInShare_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Share
            </h3>
            {saving && (
              <Loader2 className="w-3.5 h-3.5 text-[var(--text-muted)] animate-spin" />
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
            </div>
          ) : settings ? (
            <div className="px-5 py-4 space-y-6">
              {/* ---- Sharing Toggle ---------------------------------- */}
              <SettingSection
                icon={<Eye className="w-3.5 h-3.5" />}
                label="Sharing"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-[var(--text-primary)]">
                      {settings.enabled ? "Enabled" : "Disabled"}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                      {settings.enabled
                        ? "Anyone with the link can view"
                        : "Only you can access this deck"}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.enabled}
                    onChange={(enabled) => saveSettings({ enabled })}
                  />
                </div>
              </SettingSection>

              {/* ---- Everything below only shows when enabled --------- */}
              {settings.enabled && (
                <>
                  {/* ---- Slug / URL ---------------------------------- */}
                  <SettingSection
                    icon={<Link2 className="w-3.5 h-3.5" />}
                    label="Link"
                  >
                    <div className="space-y-2">
                      {/* URL Display */}
                      <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-md p-2 border border-[var(--border-subtle)]">
                        <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                          /d/
                        </span>
                        {slugEditing ? (
                          <input
                            ref={slugInputRef}
                            type="text"
                            value={slugDraft}
                            onChange={(e) =>
                              setSlugDraft(
                                e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9-]/g, ""),
                              )
                            }
                            onBlur={() => {
                              if (slugDraft && slugDraft !== settings.slug) {
                                saveSettings({ slug: slugDraft });
                              }
                              setSlugEditing(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                              } else if (e.key === "Escape") {
                                setSlugEditing(false);
                              }
                            }}
                            autoFocus
                            className="flex-1 min-w-0 bg-transparent font-mono text-xs text-[var(--accent-primary)] outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setSlugDraft(settings.slug ?? "");
                              setSlugEditing(true);
                            }}
                            className="flex-1 min-w-0 text-left font-mono text-xs text-[var(--accent-primary)] hover:underline truncate"
                            title="Click to edit slug"
                          >
                            {settings.slug || "generating..."}
                          </button>
                        )}
                      </div>

                      {/* Full URL + Copy */}
                      {shareUrl && (
                        <div className="flex items-center gap-2">
                          <span className="flex-1 min-w-0 font-mono text-[10px] text-[var(--text-muted)] truncate">
                            {shareUrl}
                          </span>
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded transition-colors shrink-0"
                          >
                            {copied ? (
                              <Check className="w-3 h-3 text-[var(--accent-primary)]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copied ? "copied" : "copy"}
                          </button>
                          <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded transition-colors shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                            open
                          </a>
                        </div>
                      )}
                    </div>
                  </SettingSection>

                  {/* ---- Expiry -------------------------------------- */}
                  <SettingSection
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    label="Expiry"
                  >
                    <div className="space-y-2">
                      <select
                        value={expiryOption}
                        onChange={(e) => {
                          const opt = e.target.value as ExpiryOption;
                          setExpiryOption(opt);
                          if (opt !== "custom") {
                            saveSettings({
                              expiry: expiryOptionToISO(opt),
                            });
                          }
                        }}
                        className="w-full px-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50 appearance-none cursor-pointer"
                      >
                        <option value="never">Never</option>
                        <option value="7d">7 days</option>
                        <option value="30d">30 days</option>
                        <option value="custom">Custom date</option>
                      </select>

                      {expiryOption === "custom" && (
                        <input
                          type="date"
                          value={customExpiryDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            setCustomExpiryDate(e.target.value);
                            if (e.target.value) {
                              saveSettings({
                                expiry: expiryOptionToISO("custom", e.target.value),
                              });
                            }
                          }}
                          className="w-full px-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50"
                        />
                      )}

                      {settings.expiry && (
                        <p className="font-mono text-[10px] text-[var(--text-muted)]">
                          Expires: {formatExpiryDate(settings.expiry)}
                        </p>
                      )}
                    </div>
                  </SettingSection>

                  {/* ---- Gate ---------------------------------------- */}
                  <SettingSection
                    icon={<Shield className="w-3.5 h-3.5" />}
                    label="Access Gate"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {(
                          [
                            { value: "none", label: "None" },
                            { value: "email", label: "Email" },
                            { value: "password", label: "Password" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              saveSettings({
                                gate_type: opt.value,
                                ...(opt.value === "none"
                                  ? { gate_value: null }
                                  : {}),
                              });
                            }}
                            className={`flex-1 py-1.5 font-mono text-xs rounded-md border transition-colors ${
                              settings.gate_type === opt.value
                                ? "text-[var(--accent-primary)] border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/5"
                                : "text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]/30"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {settings.gate_type === "email" && (
                        <p className="font-mono text-[10px] text-[var(--text-muted)]">
                          Viewers must enter their email before viewing. A lead
                          record is created automatically.
                        </p>
                      )}

                      {settings.gate_type === "password" && (
                        <div>
                          <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1">
                            Password
                          </label>
                          <input
                            type="text"
                            value={passwordDraft}
                            onChange={(e) => {
                              setPasswordDraft(e.target.value);
                              debouncedSave({ gate_value: e.target.value });
                            }}
                            placeholder="Enter a password..."
                            className="w-full px-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50 placeholder:text-[var(--text-muted)]/50"
                          />
                        </div>
                      )}
                    </div>
                  </SettingSection>

                  {/* ---- CTA ----------------------------------------- */}
                  <SettingSection
                    icon={<Type className="w-3.5 h-3.5" />}
                    label="Call to Action"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-xs text-[var(--text-primary)]">
                          {settings.cta_enabled ? "Enabled" : "Disabled"}
                        </p>
                        <ToggleSwitch
                          enabled={settings.cta_enabled}
                          onChange={(cta_enabled) =>
                            saveSettings({ cta_enabled })
                          }
                        />
                      </div>

                      {settings.cta_enabled && (
                        <div className="space-y-2">
                          <div>
                            <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1">
                              Button text
                            </label>
                            <input
                              type="text"
                              value={settings.cta_text ?? ""}
                              onChange={(e) => {
                                setSettings((prev) =>
                                  prev
                                    ? { ...prev, cta_text: e.target.value }
                                    : prev,
                                );
                                debouncedSave({ cta_text: e.target.value });
                              }}
                              placeholder="Get Started"
                              className="w-full px-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50 placeholder:text-[var(--text-muted)]/50"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1">
                              Link URL
                            </label>
                            <input
                              type="url"
                              value={settings.cta_url ?? ""}
                              onChange={(e) => {
                                setSettings((prev) =>
                                  prev
                                    ? { ...prev, cta_url: e.target.value }
                                    : prev,
                                );
                                debouncedSave({ cta_url: e.target.value });
                              }}
                              placeholder="https://..."
                              className="w-full px-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50 placeholder:text-[var(--text-muted)]/50"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </SettingSection>

                  {/* ---- Branding ------------------------------------ */}
                  <SettingSection
                    icon={<Globe className="w-3.5 h-3.5" />}
                    label="Branding"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-[var(--text-primary)]">
                          &quot;Powered by Claru&quot;
                        </p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                          Show branding on the shared deck
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.show_branding}
                        onChange={(show_branding) =>
                          saveSettings({ show_branding })
                        }
                      />
                    </div>
                  </SettingSection>

                  {/* ---- Share to Leads ------------------------------- */}
                  <div className="border-t border-[var(--border-subtle)] pt-6">
                    <SettingSection
                      icon={<Users className="w-3.5 h-3.5" />}
                      label="Share to Leads"
                    >
                      <div className="space-y-3">
                        {/* Lead search */}
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
                          <input
                            type="text"
                            value={leadSearch}
                            onChange={(e) => setLeadSearch(e.target.value)}
                            placeholder="Search leads by name or email..."
                            className="w-full pl-8 pr-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50 placeholder:text-[var(--text-muted)]/50"
                          />
                          {leadSearching && (
                            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] animate-spin" />
                          )}
                        </div>

                        {/* Search results dropdown */}
                        {filteredResults.length > 0 && (
                          <div className="border border-[var(--border-subtle)] rounded-md bg-[var(--bg-secondary)] max-h-40 overflow-y-auto">
                            {filteredResults.map((lead) => (
                              <button
                                key={lead.id}
                                onClick={() => addLead(lead)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono text-xs text-[var(--text-primary)] truncate">
                                    {lead.name}
                                  </p>
                                  <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                                    {lead.email}
                                    {lead.company ? ` -- ${lead.company}` : ""}
                                  </p>
                                </div>
                                {sharedEmails.has(lead.email) && (
                                  <span className="font-mono text-[10px] text-[var(--accent-primary)] shrink-0">
                                    shared
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Selected leads */}
                        {selectedLeads.length > 0 && (
                          <div className="space-y-1">
                            {selectedLeads.map((lead) => (
                              <div
                                key={lead.id}
                                className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-md border border-[var(--border-subtle)]"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono text-xs text-[var(--text-primary)] truncate">
                                    {lead.name}
                                  </p>
                                  <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                                    {lead.email}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleSendToLead(lead.id)}
                                  disabled={sendingLeadIds.has(lead.id)}
                                  className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded hover:bg-[var(--accent-primary)]/5 transition-colors disabled:opacity-50 shrink-0"
                                >
                                  {sendingLeadIds.has(lead.id) ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Send className="w-3 h-3" />
                                  )}
                                  send
                                </button>
                                <button
                                  onClick={() => removeLead(lead.id)}
                                  className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            {selectedLeads.length > 1 && (
                              <button
                                onClick={handleSendAll}
                                disabled={sendingAll}
                                className="w-full flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-[var(--bg-primary)] bg-[var(--accent-primary)] rounded-md hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50"
                              >
                                {sendingAll ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Send className="w-3.5 h-3.5" />
                                )}
                                Send All ({selectedLeads.length})
                              </button>
                            )}
                          </div>
                        )}

                        {/* Previously shared */}
                        {existingTokens.length > 0 && (
                          <div className="space-y-1 mt-2">
                            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                              Previously shared
                            </p>
                            {existingTokens.map((token) => (
                              <div
                                key={token.id}
                                className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)]/50 rounded-md"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono text-xs text-[var(--text-primary)] truncate">
                                    {token.email}
                                  </p>
                                  <p className="font-mono text-[10px] text-[var(--text-muted)]">
                                    {formatRelativeDate(token.created_at)}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleResend(token.email, token.lead_id)
                                  }
                                  disabled={resendingEmails.has(token.email)}
                                  className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded transition-colors disabled:opacity-50 shrink-0"
                                >
                                  {resendingEmails.has(token.email) ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3" />
                                  )}
                                  resend
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </SettingSection>
                  </div>

                  {/* ---- Invite by Email ------------------------------ */}
                  <SettingSection
                    icon={<Mail className="w-3.5 h-3.5" />}
                    label="Invite by Email"
                  >
                    <div className="space-y-2">
                      <textarea
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter emails, comma-separated..."
                        rows={2}
                        className="w-full px-3 py-2 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md focus:outline-none focus:border-[var(--accent-primary)]/50 placeholder:text-[var(--text-muted)]/50 resize-y"
                      />
                      <button
                        onClick={handleSendByEmail}
                        disabled={sendingEmails || !emailInput.trim()}
                        className="w-full flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-md hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingEmails ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        {sendingEmails ? "sending..." : "send invites"}
                      </button>
                    </div>
                  </SettingSection>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Failed to load settings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-in animation keyframe */}
      <style jsx global>{`
        @keyframes slideInShare {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

/** Section wrapper for each setting group */
function SettingSection({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[var(--accent-primary)]">{icon}</span>
        <h4 className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </h4>
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}

/** Toggle switch styled for the terminal aesthetic */
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
        enabled
          ? "bg-[var(--accent-primary)]"
          : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
          enabled
            ? "translate-x-[18px] bg-[var(--bg-primary)]"
            : "translate-x-[3px] bg-[var(--text-muted)]"
        }`}
      />
    </button>
  );
}
