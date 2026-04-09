"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

export default function QueueError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-800/40 bg-red-950/20 py-16 text-center">
        <AlertCircle
          className="mb-3 h-8 w-8 text-red-400"
          strokeWidth={1.5}
        />
        <p className="mb-1 font-mono text-sm text-[var(--text-primary)]">
          Failed to load queue
        </p>
        <p className="mb-6 font-mono text-xs text-[var(--text-tertiary)]">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-4 py-2 font-mono text-sm text-[var(--text-tertiary)] hover:border-[#92B090] hover:text-[#92B090] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Retry
        </button>
      </div>
    </div>
  );
}
