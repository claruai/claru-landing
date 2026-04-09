export default function QueueLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="h-7 w-40 animate-pulse rounded bg-[var(--bg-secondary)]" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-[var(--bg-secondary)]" />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5"
          >
            {/* Header */}
            <div className="mb-3 flex justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-48 animate-pulse rounded bg-[var(--bg-primary)]" />
                <div className="h-3 w-32 animate-pulse rounded bg-[var(--bg-primary)]" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-20 animate-pulse rounded-full bg-[var(--bg-primary)]" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--bg-primary)]" />
              </div>
            </div>
            {/* Subject */}
            <div className="mb-2 h-4 w-64 animate-pulse rounded bg-[var(--bg-primary)]" />
            {/* Snippet */}
            <div className="mb-4 space-y-1.5">
              <div className="h-3 w-full animate-pulse rounded bg-[var(--bg-primary)]" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--bg-primary)]" />
              <div className="h-3 w-4/6 animate-pulse rounded bg-[var(--bg-primary)]" />
            </div>
            {/* Draft textarea */}
            <div className="mb-4 h-20 animate-pulse rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)]" />
            {/* Buttons */}
            <div className="flex gap-2">
              <div className="h-7 w-28 animate-pulse rounded-md bg-[var(--bg-primary)]" />
              <div className="h-7 w-20 animate-pulse rounded-md bg-[var(--bg-primary)]" />
              <div className="h-7 w-24 animate-pulse rounded-md bg-[var(--bg-primary)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
