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
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
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

interface AnalyticsData {
  total_views: number;
  unique_viewers: number;
  avg_completion_rate: number;
  views_by_day: { date: string; count: number }[];
  top_slides: { index: number; avg_duration: number }[];
  device_breakdown: { desktop: number; mobile: number; tablet: number };
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

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const slugInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Fetch analytics ---------------------------------------------- */

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/analytics`,
      );
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data as AnalyticsData);
      }
    } catch {
      // Silently fail -- analytics are non-critical
    } finally {
      setAnalyticsLoading(false);
    }
  }, [templateId]);

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
      fetchAnalytics();
      setCopied(false);
      setSlugEditing(false);
    }
  }, [isOpen, fetchSettings, fetchAnalytics]);

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

                  {/* ---- Analytics ------------------------------------ */}
                  <div className="border-t border-[var(--border-subtle)] pt-5">
                    <SettingSection
                      icon={<BarChart3 className="w-3.5 h-3.5" />}
                      label="Analytics"
                    >
                      {analyticsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-4 h-4 text-[var(--text-muted)] animate-spin" />
                        </div>
                      ) : analytics && analytics.total_views > 0 ? (
                        <div className="space-y-4">
                          {/* Stat cards */}
                          <div className="grid grid-cols-3 gap-2">
                            <StatCard
                              label="Views"
                              value={analytics.total_views.toString()}
                            />
                            <StatCard
                              label="Unique"
                              value={analytics.unique_viewers.toString()}
                            />
                            <StatCard
                              label="Completion"
                              value={`${Math.round(analytics.avg_completion_rate * 100)}%`}
                            />
                          </div>

                          {/* Sparkline */}
                          <div>
                            <p className="font-mono text-[10px] text-[var(--text-muted)] mb-1.5">
                              Views (last 30 days)
                            </p>
                            <Sparkline data={analytics.views_by_day.map((d) => d.count)} />
                          </div>

                          {/* Device breakdown */}
                          <div>
                            <p className="font-mono text-[10px] text-[var(--text-muted)] mb-1.5">
                              Devices
                            </p>
                            <DeviceBreakdown
                              desktop={analytics.device_breakdown.desktop}
                              mobile={analytics.device_breakdown.mobile}
                              tablet={analytics.device_breakdown.tablet}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <p className="font-mono text-[10px] text-[var(--text-muted)]">
                            No views yet
                          </p>
                          <p className="font-mono text-[10px] text-[var(--text-muted)]/60 mt-0.5">
                            Share your deck to start tracking engagement
                          </p>
                        </div>
                      )}
                    </SettingSection>
                  </div>
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

/** Small stat card for analytics */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md p-2.5 text-center">
      <p className="font-mono text-sm font-semibold text-[var(--accent-primary)]">
        {value}
      </p>
      <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
        {label}
      </p>
    </div>
  );
}

/** SVG sparkline for views over time */
function Sparkline({ data }: { data: number[] }) {
  const width = 330;
  const height = 40;
  const padding = 2;

  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (v / max) * (height - padding * 2);
    return `${x},${y}`;
  });

  // Build area path (fill under the line)
  const firstX = padding;
  const lastX = padding + ((data.length - 1) / Math.max(data.length - 1, 1)) * (width - padding * 2);
  const areaPath = `M${firstX},${height - padding} L${points.join(" L")} L${lastX},${height - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-10"
      preserveAspectRatio="none"
    >
      {/* Area fill */}
      <path
        d={areaPath}
        fill="var(--accent-primary)"
        fillOpacity="0.1"
      />
      {/* Line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Device breakdown as horizontal bar with icons */
function DeviceBreakdown({
  desktop,
  mobile,
  tablet,
}: {
  desktop: number;
  mobile: number;
  tablet: number;
}) {
  const total = desktop + mobile + tablet;
  if (total === 0) {
    return (
      <p className="font-mono text-[10px] text-[var(--text-muted)]/60">
        No device data
      </p>
    );
  }

  const pct = (v: number) => Math.round((v / total) * 100);

  const items: {
    icon: React.ReactNode;
    label: string;
    count: number;
    percent: number;
  }[] = [
    {
      icon: <Monitor className="w-3 h-3" />,
      label: "Desktop",
      count: desktop,
      percent: pct(desktop),
    },
    {
      icon: <Smartphone className="w-3 h-3" />,
      label: "Mobile",
      count: mobile,
      percent: pct(mobile),
    },
    {
      icon: <Tablet className="w-3 h-3" />,
      label: "Tablet",
      count: tablet,
      percent: pct(tablet),
    },
  ];

  return (
    <div className="space-y-1.5">
      {items
        .filter((item) => item.count > 0)
        .map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] shrink-0">
              {item.icon}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)] w-12 shrink-0">
              {item.label}
            </span>
            <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-primary)] rounded-full transition-all"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] w-8 text-right shrink-0">
              {item.percent}%
            </span>
          </div>
        ))}
    </div>
  );
}
