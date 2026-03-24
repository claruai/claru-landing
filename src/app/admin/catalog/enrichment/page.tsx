"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EnrichmentStatus {
  total_samples: number;
  with_agent_context: number;
  with_embedding: number;
  with_enrichment_json: number;
  needs_agent_context: number;
  needs_embedding: number;
  datasets: Array<{ id: string; name: string; total_samples: number }>;
}

interface JobStatus {
  id: string;
  status: string;
  action: string;
  processed: number;
  total: number;
  failed: number;
  error_log: Array<{ id: string; error: string }>;
  started_at: string;
  completed_at: string | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EnrichmentPage() {
  const [status, setStatus] = useState<EnrichmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<JobStatus | null>(null);
  const [dryRun, setDryRun] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string>("map_existing");
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch enrichment status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/catalog/enrichment/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Poll active job
  const pollJob = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`/api/admin/catalog/enrichment/job/${jobId}`);
      if (!res.ok) return;
      const data = await res.json();
      setActiveJob(data);

      if (data.status === "completed" || data.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        fetchStatus(); // refresh counts
      }
    } catch {
      // silently retry on next poll
    }
  }, [fetchStatus]);

  // Run enrichment
  const handleRun = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/catalog/enrichment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: selectedAction,
          dataset_id: selectedDataset || undefined,
          dry_run: dryRun,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed (${res.status})`);
      }

      if (dryRun) {
        setError(`Dry run: would process ${data.would_process} samples`);
      } else if (data.job_id) {
        setActiveJob({
          id: data.job_id,
          status: "pending",
          action: selectedAction,
          processed: 0,
          total: 0,
          failed: 0,
          error_log: [],
          started_at: new Date().toISOString(),
          completed_at: null,
        });
        // Start polling
        pollRef.current = setInterval(() => pollJob(data.job_id), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start job");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const isJobActive = activeJob && (activeJob.status === "pending" || activeJob.status === "running");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          <Link
            href="/admin/dashboard"
            className="hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            claru<span className="text-[var(--accent-primary)]">/</span>admin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <Link
            href="/admin/catalog"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            catalog
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-primary)]">enrichment</span>
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/catalog/search"
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 transition-colors duration-150"
          >
            [search catalog]
          </Link>
          <Link
            href="/admin/catalog"
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            [back to catalog]
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)]" />
          </div>
        )}

        {/* Status overview */}
        {status && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
                enrichment status
              </h2>
              <button
                onClick={fetchStatus}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> refresh
              </button>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>agent_context: {status.with_agent_context} / {status.total_samples}</span>
                <span>embeddings: {status.with_embedding} / {status.total_samples}</span>
              </div>
              <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                <div
                  className="bg-[var(--accent-primary)] transition-all duration-300"
                  style={{ width: `${status.total_samples > 0 ? (status.with_agent_context / status.total_samples) * 100 : 0}%` }}
                />
              </div>
              <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-500 transition-all duration-300"
                  style={{ width: `${status.total_samples > 0 ? (status.with_embedding / status.total_samples) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "needs context", value: status.needs_agent_context },
                { label: "needs embedding", value: status.needs_embedding },
                { label: "has enrichment_json", value: status.with_enrichment_json },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                  <p className="text-2xl font-mono font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-xs font-mono text-[var(--text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action controls */}
        {status && (
          <section className="space-y-4">
            <h2 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
              run enrichment
            </h2>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">action</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  disabled={!!isJobActive}
                  className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] disabled:opacity-50"
                >
                  <option value="map_existing">map_existing</option>
                  <option value="gemini_enrich">gemini_enrich</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">dataset</label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  disabled={!!isJobActive}
                  className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md font-mono text-sm text-[var(--text-primary)] disabled:opacity-50"
                >
                  <option value="">all datasets</option>
                  {status.datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  disabled={!!isJobActive}
                  className="rounded"
                />
                dry run
              </label>
              <button
                onClick={handleRun}
                disabled={!!isJobActive || submitting}
                className="px-5 py-2 text-sm font-mono rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "run"}
              </button>
            </div>
          </section>
        )}

        {/* Error / info messages */}
        {error && (
          <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="text-xs font-mono text-red-400 hover:text-red-300">[dismiss]</button>
            </div>
          </div>
        )}

        {/* Active job progress */}
        {activeJob && (
          <section className="space-y-3">
            <h2 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
              job: {activeJob.id.slice(0, 8)}... ({activeJob.status})
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>{activeJob.action}</span>
                <span>{activeJob.processed} processed / {activeJob.failed} failed / {activeJob.total} total</span>
              </div>
              {activeJob.total > 0 && (
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${activeJob.status === "failed" ? "bg-red-500" : "bg-[var(--accent-primary)]"}`}
                    style={{ width: `${((activeJob.processed + activeJob.failed) / activeJob.total) * 100}%` }}
                  />
                </div>
              )}
              {isJobActive && (
                <p className="text-xs font-mono text-[var(--text-muted)] animate-pulse">
                  polling every 3s...
                </p>
              )}
            </div>

            {/* Error log */}
            {activeJob.error_log.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3">
                <p className="text-xs font-mono text-[var(--text-muted)] mb-2">error log ({activeJob.error_log.length})</p>
                {activeJob.error_log.map((err, i) => (
                  <p key={i} className="text-xs font-mono text-red-400 truncate">
                    {err.id}: {err.error}
                  </p>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
