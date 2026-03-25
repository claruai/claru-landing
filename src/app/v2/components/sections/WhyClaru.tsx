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
    feature: "Expert Annotation",
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
  {
    feature: "Commercial Licensing",
    values: [true, true, false, false],
    unique: false,
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
    <section id="why-claru" className="relative bg-[var(--bg-primary)] py-32 md:py-40">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="v2-section-label mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
              {"// WHY CLARU"}
            </span>
          </div>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-[42px]">
            One vendor for everything.{" "}
            <span className="text-white/40">No patchwork of providers.</span>
          </h2>
        </motion.div>

        {/* Desktop: table */}
        <motion.div
          className="hidden overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-[0_8px_40px_rgba(0,0,0,0.3)] md:block"
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th
                  className="px-7 py-6 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-white/30"
                  style={{ background: "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)" }}
                >
                  Feature
                </th>
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={`px-7 py-6 text-center text-[11px] font-medium uppercase tracking-[0.2em] ${
                      i === 0
                        ? "text-[var(--accent-primary)] border-x border-[var(--accent-primary)]/10"
                        : "text-white/30"
                    }`}
                    style={{
                      background: i === 0
                        ? "linear-gradient(180deg, rgba(146,176,144,0.06) 0%, rgba(146,176,144,0.02) 100%)"
                        : "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)",
                    }}
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
                  className="border-b border-white/[0.04] last:border-0 transition-colors duration-300 hover:bg-white/[0.015]"
                >
                  <td
                    className="px-7 py-5 text-sm text-white/60"
                    style={{ background: "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)" }}
                  >
                    {row.feature}
                    {row.unique && (
                      <span className="ml-2.5 inline-block rounded-full bg-[var(--accent-primary)]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--accent-primary)]">
                        Exclusive
                      </span>
                    )}
                  </td>
                  {row.values.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-7 py-5 text-center ${
                        colIdx === 0
                          ? "border-x border-[var(--accent-primary)]/10"
                          : ""
                      }`}
                      style={{
                        background: colIdx === 0
                          ? "linear-gradient(180deg, rgba(146,176,144,0.04) 0%, rgba(146,176,144,0.01) 100%)"
                          : "linear-gradient(165deg, #121110 0%, #0e0d0c 100%)",
                      }}
                    >
                      {val ? (
                        <div className="inline-flex items-center justify-center">
                          <AnimatedCheck
                            delay={rowIdx * 0.1 + colIdx * 0.05}
                            reducedMotion={reducedMotion}
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-white/10">---</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile: card stack */}
        <div className="space-y-4 md:hidden">
          {rows.map((row, rowIdx) => (
            <motion.div
              key={row.feature}
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: rowIdx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="v2-card !rounded-2xl !p-6"
            >
              <h4 className="mb-4 flex items-center gap-2 font-mono text-sm font-medium text-white/80">
                {row.feature}
                {row.unique && (
                  <span className="rounded-full bg-[var(--accent-primary)]/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--accent-primary)]">
                    Exclusive
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                {columns.map((col, colIdx) => (
                  <div key={col}>
                    <span className={`mb-2 block text-[10px] tracking-wider ${colIdx === 0 ? "font-medium text-[var(--accent-primary)]" : "text-white/25"}`}>
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
                      <span className="font-mono text-white/10">---</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-12 text-center text-sm text-white/30"
          initial={reducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          One vendor. Catalog, annotation, collection, and game data.
        </motion.p>
      </div>
    </section>
  );
}
