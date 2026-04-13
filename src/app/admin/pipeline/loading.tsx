export default function PipelineLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-24 animate-pulse rounded bg-[var(--bg-secondary)]" />
        <div className="mt-1.5 h-4 w-40 animate-pulse rounded bg-[var(--bg-secondary)]" />
      </div>

      {/* ProspectsBar skeleton */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-7 w-16 animate-pulse rounded-md bg-[var(--bg-secondary)]" />
        <div className="h-7 w-20 animate-pulse rounded-md bg-[var(--bg-secondary)]" />
        <div className="h-7 w-16 animate-pulse rounded-md bg-[var(--bg-secondary)]" />
        <div className="ml-auto h-5 w-24 animate-pulse rounded bg-[var(--bg-secondary)]" />
      </div>

      {/* Kanban columns — desktop */}
      <div className="hidden gap-3 md:flex">
        {["Respond Now", "Waiting on Them", "Nurturing", "Cold"].map((title, colIdx) => (
          <div
            key={title}
            className="flex flex-1 flex-col gap-2 rounded-lg border border-[var(--border-subtle)] p-3"
          >
            {/* Column header */}
            <div className="flex items-center justify-between pb-1">
              <div className="h-3.5 w-24 animate-pulse rounded bg-[var(--bg-secondary)]" />
              <div className="h-4 w-5 animate-pulse rounded bg-[var(--bg-secondary)]" />
            </div>
            {/* Cards — first column gets more cards */}
            {Array.from({ length: colIdx === 0 ? 5 : colIdx === 1 ? 3 : 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3"
                style={{ animationDelay: `${(colIdx * 5 + i) * 60}ms` }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-[var(--bg-secondary)]" />
                  <div className="h-3 w-12 animate-pulse rounded bg-[var(--bg-secondary)]" />
                </div>
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-secondary)]" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[var(--bg-secondary)]" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile tab pills skeleton */}
      <div className="md:hidden">
        <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-24 shrink-0 animate-pulse rounded-full bg-[var(--bg-secondary)]" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3">
              <div className="mb-2 h-3.5 w-28 animate-pulse rounded bg-[var(--bg-secondary)]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-secondary)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
