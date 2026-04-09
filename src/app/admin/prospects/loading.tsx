export default function ProspectsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--bg-secondary)]" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-[var(--bg-secondary)]" />
      </div>
      <div className="mb-3 h-4 w-20 animate-pulse rounded bg-[var(--bg-secondary)]" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
          />
        ))}
      </div>
    </div>
  );
}
