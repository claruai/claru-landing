import type { LeadStatus } from "@/types/data-catalog";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  pending:
    "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  approved:
    "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20",
  rejected:
    "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
};

export default function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
