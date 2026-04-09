"use client";

import { useState, useTransition } from "react";
import { Building2, Mail, CheckCircle2, X } from "lucide-react";
import type { ProspectSignal } from "./page";
import { skipSignal, queueInSmartlead } from "./actions";

const SIGNAL_TYPE_COLORS: Record<string, string> = {
  gtm_file: "bg-blue-900/40 text-blue-300 border-blue-800/40",
  hiring: "bg-green-900/40 text-green-300 border-green-800/40",
  funding: "bg-purple-900/40 text-purple-300 border-purple-800/40",
  product_launch: "bg-orange-900/40 text-orange-300 border-orange-800/40",
  news: "bg-zinc-800/60 text-zinc-400 border-zinc-700/40",
};

interface ProspectCardProps {
  signal: ProspectSignal;
  readonly?: boolean;
}

type Campaign = { id: number; name: string };

export function ProspectCard({ signal, readonly }: ProspectCardProps) {
  const [isPending, startTransition] = useTransition();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signalColor =
    SIGNAL_TYPE_COLORS[signal.signal_type] ?? SIGNAL_TYPE_COLORS.news;

  const handleSkip = () => {
    startTransition(() => skipSignal(signal.id));
  };

  const handleShowCampaigns = async () => {
    if (campaigns !== null) return; // already loaded
    setLoadingCampaigns(true);
    try {
      const res = await fetch("/api/admin/smartlead-campaigns");
      const json = await res.json();
      setCampaigns(json.campaigns ?? []);
    } catch {
      setError("Could not load campaigns");
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleQueue = () => {
    if (!selectedCampaignId) {
      setError("Select a campaign first");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await queueInSmartlead(signal.id, selectedCampaignId);
      if (!result.ok) {
        setError(result.error ?? "Unknown error");
      }
    });
  };

  return (
    <div
      className={`rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 transition-opacity ${
        isPending ? "opacity-50" : ""
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-sm font-medium text-[var(--text-primary)]">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            {signal.company_name}
          </div>

          {signal.contact_name && (
            <div className="mt-1 flex items-center gap-1.5 pl-5 text-xs font-mono text-[var(--text-tertiary)]">
              <Mail className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              {signal.contact_name}
              {signal.contact_email && (
                <span className="text-[var(--text-muted)]">
                  &lt;{signal.contact_email}&gt;
                </span>
              )}
            </div>
          )}

          {!signal.contact_email && (
            <p className="mt-1 pl-5 text-xs font-mono text-orange-400">
              No contact email — manual outreach needed
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-mono ${signalColor}`}
          >
            {signal.signal_type.replace(/_/g, " ")}
          </span>

          {signal.status === "queued" && (
            <CheckCircle2 className="h-4 w-4 text-[#92B090]" strokeWidth={1.5} />
          )}
        </div>
      </div>

      {/* Signal description */}
      <p className="mb-4 pl-5 text-sm font-mono text-[var(--text-tertiary)] leading-relaxed">
        {signal.signal_description}
      </p>

      {/* Actions */}
      {!readonly && signal.status === "new" && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Campaign selector */}
          {campaigns === null ? (
            <button
              onClick={handleShowCampaigns}
              disabled={loadingCampaigns || isPending}
              className="flex items-center gap-1.5 rounded-md bg-[#92B090]/20 px-3 py-1.5 text-xs font-mono text-[#92B090] hover:bg-[#92B090]/30 disabled:opacity-50 transition-colors"
            >
              {loadingCampaigns ? "Loading..." : "Queue to Smartlead"}
            </button>
          ) : (
            <>
              <select
                value={selectedCampaignId ?? ""}
                onChange={(e) =>
                  setSelectedCampaignId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] focus:border-[#92B090] focus:outline-none"
              >
                <option value="">Select campaign...</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleQueue}
                disabled={isPending || !selectedCampaignId}
                className="flex items-center gap-1.5 rounded-md bg-[#92B090]/20 px-3 py-1.5 text-xs font-mono text-[#92B090] hover:bg-[#92B090]/30 disabled:opacity-50 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                Add to campaign
              </button>
            </>
          )}

          <button
            onClick={handleSkip}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-tertiary)] hover:border-red-800/60 hover:text-red-400 disabled:opacity-50 transition-colors"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
            Skip
          </button>

          {error && (
            <p className="text-xs font-mono text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
