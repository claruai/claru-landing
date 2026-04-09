"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { ProspectSignal } from "./page";
import { ProspectCard } from "./ProspectCard";

interface ProspectListProps {
  signals: ProspectSignal[];
}

export function ProspectList({ signals }: ProspectListProps) {
  const router = useRouter();

  // Auto-refresh every 5 min (scanner runs daily, but surface any admin changes)
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 300_000);
    return () => clearInterval(interval);
  }, [router]);

  const newSignals = signals.filter((s) => s.status === "new");
  const queuedSignals = signals.filter((s) => s.status === "queued");

  return (
    <div className="space-y-8">
      {/* New signals */}
      <section>
        <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-[var(--text-tertiary)]">
          New — {newSignals.length}
        </h2>

        {newSignals.length === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-10 font-mono text-sm text-[var(--text-tertiary)]">
            <Search className="h-4 w-4" strokeWidth={1.5} />
            No new signals — scanner runs daily at 8am ET
          </div>
        ) : (
          <div className="space-y-3">
            {newSignals.map((s) => (
              <ProspectCard key={s.id} signal={s} />
            ))}
          </div>
        )}
      </section>

      {/* Queued signals */}
      {queuedSignals.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-[var(--text-tertiary)]">
            Queued to Smartlead — {queuedSignals.length}
          </h2>
          <div className="space-y-3 opacity-60">
            {queuedSignals.map((s) => (
              <ProspectCard key={s.id} signal={s} readonly />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
