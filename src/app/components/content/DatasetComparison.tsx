// ---------------------------------------------------------------------------
// DatasetComparison — Server Component
// ---------------------------------------------------------------------------
// Renders a comparison table of open/public datasets vs Claru's offering.
// Responsive: table on desktop (>=768px), stacked cards on mobile.
// Claru rows get accent border and subtle highlight background.
// ---------------------------------------------------------------------------

import type { DatasetComparisonRow } from "@/data/content-pages/types";

interface DatasetComparisonProps {
  /** Question-form H2 heading */
  title: string;
  /** Section intro paragraph */
  description: string;
  /** Comparison rows */
  rows: DatasetComparisonRow[];
}

export default function DatasetComparison({
  title,
  description,
  rows,
}: DatasetComparisonProps) {
  if (rows.length === 0) return null;

  return (
    <section id="landscape" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2
          className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h2>
        <p
          className="mt-4 text-base leading-relaxed md:text-lg"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          {description}
        </p>

        {/* Desktop: table */}
        <div className="mt-10 hidden md:block overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                  Scale
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                  Tasks
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                  Environments
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                  Limitations
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: row.isClaru
                      ? "rgba(146, 176, 144, 0.08)"
                      : "#121210",
                    borderLeft: row.isClaru ? "2px solid #92B090" : "2px solid transparent",
                  }}
                >
                  <td
                    className="px-4 py-4 font-medium"
                    style={{
                      color: row.isClaru ? "#92B090" : "#FFFFFF",
                      fontFamily: row.isClaru
                        ? "var(--font-mono, 'JetBrains Mono', monospace)"
                        : undefined,
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    className="px-4 py-4"
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    {row.scale}
                  </td>
                  <td className="px-4 py-4" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {row.tasks}
                  </td>
                  <td className="px-4 py-4" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {row.environments}
                  </td>
                  <td className="px-4 py-4" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {row.limitations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-8 flex flex-col gap-4 md:hidden">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="rounded-lg p-5"
              style={{
                backgroundColor: row.isClaru
                  ? "rgba(146, 176, 144, 0.08)"
                  : "#121210",
                border: row.isClaru
                  ? "1px solid #92B090"
                  : "1px solid #2a2a28",
              }}
            >
              <h3
                className="text-base font-medium mb-3"
                style={{
                  color: row.isClaru ? "#92B090" : "#FFFFFF",
                  fontFamily: row.isClaru
                    ? "var(--font-mono, 'JetBrains Mono', monospace)"
                    : undefined,
                }}
              >
                {row.name}
              </h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span
                    className="block text-xs uppercase tracking-wider mb-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    Scale
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>{row.scale}</span>
                </div>
                <div>
                  <span
                    className="block text-xs uppercase tracking-wider mb-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    Tasks
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{row.tasks}</span>
                </div>
                <div>
                  <span
                    className="block text-xs uppercase tracking-wider mb-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    Environments
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{row.environments}</span>
                </div>
                <div className="col-span-2">
                  <span
                    className="block text-xs uppercase tracking-wider mb-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    Limitations
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>{row.limitations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
