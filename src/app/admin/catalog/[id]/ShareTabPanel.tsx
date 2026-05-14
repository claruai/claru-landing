"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Eye, ExternalLink, Loader2, RefreshCw, Trash2, Check } from "lucide-react";

interface ShareInfo {
  share_token: string | null;
  share_mode: "all" | "showcase" | null;
  share_expires_at: string | null;
  share_first_viewed_at: string | null;
  share_view_count: number | null;
  /** Server-resolved share URL — trust this for copy/open over locally-constructed URLs. */
  share_url?: string | null;
}

interface ShareTabPanelProps {
  datasetId: string;
  datasetName: string;
  initialShareInfo?: ShareInfo;
}

export default function ShareTabPanel({ datasetId, datasetName, initialShareInfo }: ShareTabPanelProps) {
  const [info, setInfo] = useState<ShareInfo | null>(initialShareInfo ?? null);
  const [loading, setLoading] = useState(!initialShareInfo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/catalog/${datasetId}`);
      if (res.ok) {
        const payload = await res.json();
        // GET /api/admin/catalog/[id] returns `{ dataset: {...} }`
        const d = payload.dataset ?? payload;
        setInfo({
          share_token: d.share_token,
          share_mode: d.share_mode,
          share_expires_at: d.share_expires_at,
          share_first_viewed_at: d.share_first_viewed_at,
          share_view_count: d.share_view_count,
          share_url: null,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    if (!initialShareInfo) void refresh();
  }, [initialShareInfo, refresh]);

  const mintLink = async (mode: "all" | "showcase", forceRotate = false) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/catalog/${datasetId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          force_rotate: forceRotate,
          expires_in_days: mode === "showcase" ? 365 : 30,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setError(
            `${data.error} (current mode: ${data.current_mode}). Click "Rotate" to switch.`,
          );
        } else {
          setError(data.error ?? "Failed to mint share link");
        }
        return;
      }
      setInfo({
        share_token: data.token,
        share_mode: data.mode,
        share_expires_at: data.expires_at,
        share_first_viewed_at: null,
        share_view_count: 0,
        // Always trust the server-returned share_url (it knows NEXT_PUBLIC_SITE_URL)
        share_url: data.share_url ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  };

  const deleteLink = async () => {
    if (!confirm("Invalidate this share link? Anyone with the URL will get a 404.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/catalog/${datasetId}/share`, { method: "DELETE" });
      if (res.ok) {
        setInfo({
          share_token: null,
          share_mode: null,
          share_expires_at: null,
          share_first_viewed_at: null,
          share_view_count: 0,
          share_url: null,
        });
      }
    } finally {
      setBusy(false);
    }
  };

  // Prefer server-supplied share_url (respects NEXT_PUBLIC_SITE_URL).
  // Fall back to constructing from window.origin so the tab still works
  // before the first refresh resolves.
  const url =
    info?.share_url ??
    (info?.share_token
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${info.share_token}`
      : null);

  const copy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading share state…
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-mono font-semibold text-[var(--text-primary)]">
          Share Link
        </h3>
        <p className="text-sm font-mono text-[var(--text-muted)]">
          Public /share/&lt;token&gt; URL for {datasetName}. Two modes: <em>Full Access</em>
          {" "}shows every clip (current behavior); <em>Showcase Only</em> shows just is_showcase=true clips.
        </p>
      </div>

      {info?.share_token && url ? (
        <div
          className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-3"
          data-testid="share-active"
        >
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center text-xs font-mono px-2 py-0.5 rounded ${
                info.share_mode === "showcase"
                  ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]"
                  : "bg-[var(--text-muted)]/15 text-[var(--text-secondary)]"
              }`}
              data-testid="share-mode-badge"
            >
              {info.share_mode === "showcase" ? "Showcase only" : "Full access"}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              expires {info.share_expires_at ? new Date(info.share_expires_at).toLocaleDateString() : "never"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              data-testid="share-url-input"
              className="flex-1 px-3 py-2 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)]"
            />
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Open
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" /> {info.share_view_count ?? 0} views
            </span>
            {info.share_first_viewed_at && (
              <span>first viewed {new Date(info.share_first_viewed_at).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => mintLink(info.share_mode === "showcase" ? "all" : "showcase", true)}
              disabled={busy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors disabled:opacity-50"
              data-testid="share-rotate-mode-btn"
            >
              <RefreshCw className="w-3 h-3" /> Switch to {info.share_mode === "showcase" ? "Full Access" : "Showcase Only"}
            </button>
            <button
              type="button"
              onClick={deleteLink}
              disabled={busy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border border-[var(--error)]/30 text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors disabled:opacity-50"
              data-testid="share-invalidate-btn"
            >
              <Trash2 className="w-3 h-3" /> Invalidate
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-[var(--border-subtle)] p-6 space-y-3">
          <p className="text-sm font-mono text-[var(--text-muted)]">
            No share link yet for this dataset.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => mintLink("all")}
              disabled={busy}
              className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              data-testid="share-create-full-btn"
            >
              Generate Full-Access Link
            </button>
            <button
              type="button"
              onClick={() => mintLink("showcase")}
              disabled={busy}
              className="flex items-center gap-2 rounded-md border border-[var(--accent-primary)] text-[var(--accent-primary)] px-4 py-2 text-sm font-mono font-semibold hover:bg-[var(--accent-primary)]/10 transition-colors disabled:opacity-50"
              data-testid="share-create-showcase-btn"
            >
              Generate Showcase-Only Link
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm font-mono text-[var(--error)]" data-testid="share-error">
          {error}
        </p>
      )}
    </div>
  );
}
