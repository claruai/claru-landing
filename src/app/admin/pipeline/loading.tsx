export default function PipelineLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--bg-secondary)]" />
        <div className="mt-1 h-4 w-48 animate-pulse rounded bg-[var(--bg-secondary)]" />
      </div>
      <div className="mb-4 flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-md bg-[var(--bg-secondary)]"
          />
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)]">
        <div className="h-10 animate-pulse bg-[var(--bg-secondary)]" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]"
          />
        ))}
      </div>
    </div>
  );
}
