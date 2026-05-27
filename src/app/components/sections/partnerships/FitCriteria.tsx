"use client";

import { motion } from "framer-motion";

const CRITERIA = [
  {
    code: "01",
    title: "You operate a workforce that does visible work",
    body: "Cafes, packaging, manufacturing, farms, retail, trades, fleets. We license what your cameras have already captured — or send cameras and capture with you.",
  },
  {
    code: "02",
    title: "You own footage we can't get from public datasets",
    body: "Specific environments, regions, demographics, or tasks. Niche beats volume.",
  },
  {
    code: "03",
    title: "You can ship capture on a schedule",
    body: "Active creators, capture teams, regional collection partners. You hit the spec, you get paid weekly.",
  },
  {
    code: "04",
    title: "You already sell data to AI labs — and need to expand supply",
    body: "Dataset vendors, BPOs, regional collection partners with existing lab customers. Your buyers are asking for modalities, regions, or volumes you can't fill alone. Plug into our workforce, corpus, and annotation infra — you keep the relationship, we white-label.",
  },
];

export default function FitCriteria() {
  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)]">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
              {"// 03"}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Who we say yes to.
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)]">
              The clearer you are about which one you are, the faster we can
              write you a check.
            </p>
          </motion.div>

          <div className="space-y-6">
            {CRITERIA.map((c, i) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 md:gap-8 p-6 md:p-8 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors"
              >
                <div className="font-mono text-3xl md:text-5xl font-bold text-[var(--accent-primary)]/30 flex-shrink-0 leading-none">
                  {c.code}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {c.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
