"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function PipelineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-800/40 bg-red-950/20 py-16 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-red-400" strokeWidth={1.5} />
        <p className="mb-1 font-mono text-sm text-[var(--text-primary)]">
          Failed to load pipeline
        </p>
        <p className="mb-6 font-mono text-xs text-[var(--text-tertiary)]">
          {error.message}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-4 py-2 font-mono text-sm text-[var(--text-tertiary)] hover:border-[#92B090] hover:text-[#92B090] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            Try again
          </button>
          <Link
            href="/admin"
            className="font-mono text-sm text-[var(--text-muted)] hover:text-[var(--text-tertiary)] transition-colors"
          >
            ← Back to admin
          </Link>
        </div>
      </div>
    </div>
  );
}
