"use client";

import { useTransition } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PipelineLead } from "./page";
import { updateThreadState, updateWaitingOn } from "./actions";

const THREAD_STATE_COLORS: Record<string, string> = {
  warm: "text-yellow-400",
  hot: "text-orange-400",
  negotiating: "text-[#92B090]",
  closed: "text-green-400",
  dead: "text-zinc-500",
  cold: "text-zinc-600",
};

const THREAD_STATES = ["cold", "warm", "hot", "negotiating", "closed", "dead"];
const WAITING_ON_OPTIONS = ["us", "them", "unknown"];

interface PipelineRowProps {
  lead: PipelineLead;
  expanded: boolean;
  onToggle: () => void;
}

export function PipelineRow({ lead, expanded, onToggle }: PipelineRowProps) {
  const [isPending, startTransition] = useTransition();

  const stateColor =
    THREAD_STATE_COLORS[lead.thread_state] ?? "text-[var(--text-tertiary)]";

  const daysSilentColor =
    lead.days_silent > 14
      ? "text-red-400"
      : lead.days_silent > 7
        ? "text-yellow-400"
        : "text-[var(--text-primary)]";

  const handleThreadState = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    startTransition(() => updateThreadState(lead.lead_id, value));
  };

  const handleWaitingOn = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    startTransition(() => updateWaitingOn(lead.lead_id, value));
  };

  return (
    <>
      <tr
        className={`transition-colors hover:bg-[var(--bg-secondary)] ${
          isPending ? "opacity-50" : ""
        } ${expanded ? "bg-[var(--bg-secondary)]" : ""}`}
      >
        {/* Company / contact */}
        <td className="px-4 py-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-left"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            )}
            <div>
              <p className="font-medium text-[var(--text-primary)]">
                {lead.company ?? lead.lead_email}
              </p>
              {lead.lead_name && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  {lead.lead_name}
                </p>
              )}
            </div>
          </button>
        </td>

        {/* Thread state */}
        <td className="px-4 py-3">
          <select
            value={lead.thread_state}
            onChange={handleThreadState}
            disabled={isPending}
            className={`cursor-pointer border-0 bg-transparent text-sm capitalize focus:outline-none ${stateColor}`}
          >
            {THREAD_STATES.map((s) => (
              <option key={s} value={s} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
                {s}
              </option>
            ))}
          </select>
        </td>

        {/* Waiting on */}
        <td className="px-4 py-3">
          <select
            value={lead.waiting_on}
            onChange={handleWaitingOn}
            disabled={isPending}
            className="cursor-pointer border-0 bg-transparent text-sm text-[var(--text-tertiary)] focus:outline-none"
          >
            {WAITING_ON_OPTIONS.map((w) => (
              <option key={w} value={w} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
                {w}
              </option>
            ))}
          </select>
        </td>

        {/* Days silent */}
        <td className={`px-4 py-3 text-sm ${daysSilentColor}`}>
          {lead.days_silent === 999 ? "—" : `${lead.days_silent}d`}
        </td>

        {/* ICP score */}
        <td className="px-4 py-3 text-sm text-[var(--text-tertiary)]">
          {lead.icp_score ?? "—"}
        </td>

        {/* Campaign */}
        <td className="px-4 py-3 max-w-[200px]">
          {lead.smartlead_campaign_name ? (
            <div>
              <p className="truncate text-xs text-[var(--text-tertiary)]">
                {lead.smartlead_campaign_name}
              </p>
              {lead.smartlead_sequence_step != null && (
                <p className="text-xs text-[var(--text-muted)]">
                  Step {lead.smartlead_sequence_step}
                </p>
              )}
            </div>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">—</span>
          )}
        </td>

        {/* Actions placeholder */}
        <td className="px-4 py-3">
          <span className="text-xs text-[var(--text-muted)]">
            {lead.lead_email}
          </span>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr>
          <td colSpan={7} className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-8 py-4">
            <div className="grid grid-cols-2 gap-4 font-mono text-xs text-[var(--text-tertiary)] sm:grid-cols-4">
              <div>
                <p className="text-[var(--text-muted)]">Email</p>
                <p className="mt-0.5 text-[var(--text-primary)]">
                  {lead.lead_email}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Type</p>
                <p className="mt-0.5 capitalize text-[var(--text-primary)]">
                  {lead.type}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Last touch</p>
                <p className="mt-0.5 text-[var(--text-primary)]">
                  {lead.last_touch_at
                    ? new Date(lead.last_touch_at).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Smartlead step</p>
                <p className="mt-0.5 text-[var(--text-primary)]">
                  {lead.smartlead_sequence_step ?? "—"}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
