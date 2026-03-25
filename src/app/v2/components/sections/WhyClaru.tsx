"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const columns = ["Claru", "Scale", "Cortex", "Open Datasets"];

const rows = [
  {
    feature: "Pre-built Catalog",
    values: [true, false, false, true],
    unique: false,
  },
  {
    feature: "Enrichment Pipeline",
    values: [true, true, true, false],
    unique: false,
  },
  {
    feature: "Custom Collection",
    values: [true, true, true, false],
    unique: false,
  },
  {
    feature: "Game Environment Data",
    values: [true, false, false, false],
    unique: true,
  },
];

function AnimatedCheck({ delay, reducedMotion }: { delay: number; reducedMotion: boolean }) {
  if (reducedMotion) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--accent-primary)]">
        <path
          d="M5 12l5 5L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[var(--accent-primary)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path
        d="M5 12l5 5L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { delay, duration: 0.4, ease: "easeOut" },
          },
        }}
      />
    </motion.svg>
  );
}

export default function WhyClaru() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="why-claru" className="relative bg-[var(--bg-primary)] py-24">
      <div className="container mx-auto px-6">
        <span className="mb-8 block font-mono text-sm text-[var(--accent-primary)]">
          {"// WHY CLARU"}
        </span>

        {/* Desktop: table */}
        <div className="hidden overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] md:block">
          <div className="v2-dot-grid">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="px-6 py-4 text-left font-medium text-white/60">
                    Feature
                  </th>
                  {columns.map((col, i) => (
                    <th
                      key={col}
                      className={`px-6 py-4 text-center font-medium ${
                        i === 0
                          ? "text-[var(--accent-primary)]"
                          : "text-white/60"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr
                    key={row.feature}
                    className="border-b border-[var(--border-subtle)] last:border-0"
                  >
                    <td className="px-6 py-4 text-white/80">
                      {row.feature}
                    </td>
                    {row.values.map((val, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 text-center">
                        {val ? (
                          <div
                            className={`inline-flex items-center justify-center ${
                              row.unique && colIdx === 0
                                ? "rounded-full bg-[var(--accent-primary)]/10 px-3 py-1 shadow-[0_0_12px_var(--accent-glow)]"
                                : ""
                            }`}
                          >
                            <AnimatedCheck
                              delay={rowIdx * 0.1 + colIdx * 0.05}
                              reducedMotion={reducedMotion}
                            />
                            {row.unique && colIdx === 0 && (
                              <span className="ml-1.5 text-xs text-[var(--accent-primary)]">
                                Unique
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: card stack */}
        <div className="space-y-4 md:hidden">
          {rows.map((row, rowIdx) => (
            <div
              key={row.feature}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4"
            >
              <h4 className="mb-3 font-mono text-sm font-medium text-white/80">
                {row.feature}
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                {columns.map((col, colIdx) => (
                  <div key={col}>
                    <span className="mb-1 block text-[10px] text-white/40">
                      {col}
                    </span>
                    {row.values[colIdx] ? (
                      <div className="flex justify-center">
                        <AnimatedCheck
                          delay={rowIdx * 0.1 + colIdx * 0.05}
                          reducedMotion={reducedMotion}
                        />
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-base text-white/80">
          One vendor. Catalog, enrichment, collection, and game data.
        </p>
      </div>
    </section>
  );
}
