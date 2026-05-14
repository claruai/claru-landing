"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, Loader2, Package, X, Eye } from "lucide-react";

interface DatasetOption {
  id: string;
  slug: string;
  name: string;
  showcase_count: number;
}

interface SentPack {
  dataset_id: string;
  name: string;
  share_url: string | null;
  share_view_count: number;
  share_first_viewed_at: string | null;
  share_expires_at: string | null;
  is_expired: boolean;
  created_at: string;
  clip_count: number;
}

interface SendSamplePackModalProps {
  leadId: string;
  recipient: { name: string | null; email: string; company: string | null };
}

export default function SendSamplePackButton(props: SendSamplePackModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="send-sample-pack-btn"
        className="inline-flex items-center gap-2 rounded-md border border-[var(--accent-primary)] text-[var(--accent-primary)] px-3 py-1.5 text-xs font-mono hover:bg-[var(--accent-primary)]/10 transition-colors"
      >
        <Package className="w-3.5 h-3.5" /> Send Sample Pack
      </button>
      {open && <SendSamplePackModal {...props} onClose={() => setOpen(false)} />}
    </>
  );
}

function SendSamplePackModal({
  leadId,
  recipient,
  onClose,
}: SendSamplePackModalProps & { onClose: () => void }) {
  const [datasets, setDatasets] = useState<DatasetOption[]>([]);
  const [history, setHistory] = useState<SentPack[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ share_url: string; expires_at: string } | null>(null);
  const [expiresDays, setExpiresDays] = useState(30);
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [datasetsRes, historyRes] = await Promise.all([
          fetch("/api/admin/catalog?include_showcase_counts=1"),
          fetch(`/api/admin/leads/${leadId}/sample-packs`),
        ]);
        if (cancelled) return;
        if (datasetsRes.ok) {
          const dsData = await datasetsRes.json();
          const list = (dsData.datasets ?? dsData ?? []) as Array<{
            id: string;
            slug: string;
            name: string;
            showcase_count?: number;
          }>;
          setDatasets(
            list
              .filter((d) => (d.showcase_count ?? 0) > 0)
              .map((d) => ({
                id: d.id,
                slug: d.slug,
                name: d.name,
                showcase_count: d.showcase_count ?? 0,
              })),
          );
        }
        if (historyRes.ok) {
          const h = await historyRes.json();
          setHistory(h.packs ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const canSubmit = useMemo(
    () => selected.size > 0 && !!recipient.email && !!recipient.company,
    [selected, recipient],
  );

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const sourceSlugs = datasets.filter((d) => selected.has(d.id)).map((d) => d.slug);
      const res = await fetch("/api/admin/sample-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_dataset_slugs: sourceSlugs,
          recipient: {
            name: recipient.name ?? "",
            email: recipient.email,
            company: recipient.company ?? "",
          },
          expires_in_days: expiresDays,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create sample pack");
        return;
      }
      setCreated({ share_url: data.share_url, expires_at: data.expires_at });
      // Optimistic prepend to history
      setHistory((prev) => [
        {
          dataset_id: data.dataset_id,
          name: data.dataset_name,
          share_url: data.share_url,
          share_view_count: 0,
          share_first_viewed_at: null,
          share_expires_at: data.expires_at,
          is_expired: false,
          created_at: new Date().toISOString(),
          clip_count: data.clip_count,
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="send-sample-pack-modal"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-mono font-semibold text-[var(--text-primary)]">
              Send Sample Pack
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              To {recipient.name ?? recipient.email} {recipient.company && `(${recipient.company})`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {created ? (
          <div
            className="rounded-md border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 p-4 space-y-3"
            data-testid="send-sample-pack-result"
          >
            <p className="text-sm font-mono text-[var(--accent-primary)]">Sample pack created.</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={created.share_url}
                data-testid="send-sample-pack-url"
                className="flex-1 px-3 py-2 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)]"
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(created.share_url)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
              <a
                href={created.share_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            </div>
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              Expires {new Date(created.expires_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Select source datasets (showcase clips only)
              </h3>
              {loading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
                  <span className="text-xs font-mono text-[var(--text-muted)]">Loading…</span>
                </div>
              ) : datasets.length === 0 ? (
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  No datasets with showcase clips available. Mark some clips as ★ first.
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-1 rounded border border-[var(--border-subtle)] p-2">
                  {datasets.map((d) => (
                    <label
                      key={d.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs font-mono cursor-pointer hover:bg-[var(--bg-tertiary)] rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(d.id)}
                        onChange={() => {
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (next.has(d.id)) next.delete(d.id);
                            else next.add(d.id);
                            return next;
                          });
                        }}
                        className="accent-[var(--accent-primary)]"
                      />
                      <span className="text-[var(--text-primary)]">{d.name}</span>
                      <span className="text-[var(--text-muted)] ml-auto">
                        {d.showcase_count} showcase
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-mono">
                <span className="text-[var(--text-muted)] uppercase tracking-wider">
                  Expires in (days)
                </span>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={expiresDays}
                  onChange={(e) => setExpiresDays(parseInt(e.target.value, 10) || 30)}
                  className="mt-1 w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)]"
                />
              </label>
              <label className="block text-xs font-mono">
                <span className="text-[var(--text-muted)] uppercase tracking-wider">
                  Internal note (optional)
                </span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)]"
                />
              </label>
            </div>

            {error && <p className="text-xs font-mono text-[var(--error)]">{error}</p>}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-mono rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit || submitting}
                data-testid="send-sample-pack-submit"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-xs font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                {submitting ? "Building…" : "Create sample pack"}
              </button>
            </div>
          </>
        )}

        <div className="border-t border-[var(--border-subtle)] pt-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Previously sent ({history.length})
          </h3>
          {history.length === 0 ? (
            <p className="text-xs font-mono text-[var(--text-muted)]">No sample packs yet.</p>
          ) : (
            <ul className="space-y-1">
              {history.map((p) => (
                <li
                  key={p.dataset_id}
                  className="flex items-center justify-between px-2 py-1.5 text-xs font-mono rounded border border-[var(--border-subtle)]"
                >
                  <div className="flex flex-col">
                    <span className="text-[var(--text-primary)]">{p.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {p.clip_count} clips · created {new Date(p.created_at).toLocaleDateString()} ·{" "}
                      {p.is_expired ? "expired" : `expires ${p.share_expires_at ? new Date(p.share_expires_at).toLocaleDateString() : "—"}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <Eye className="w-3 h-3" /> {p.share_view_count}
                    </span>
                    {p.share_url && (
                      <a
                        href={p.share_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent-primary)] hover:opacity-80"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
