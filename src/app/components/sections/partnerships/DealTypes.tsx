"use client";

import { motion } from "framer-motion";

const DEALS = [
  {
    code: "01",
    title: "License what you already have.",
    headline: "You have footage. We pay for the right to train on it.",
    body: "Non-exclusive. You keep your reels, channels, and security recordings. Pays on signature, net-15.",
  },
  {
    code: "02",
    title: "Get paid to capture.",
    headline: "We send the spec. You shoot. We pay weekly.",
    body: "Per-hour rates by modality. No editing required. We handle review and rejection. We can ship cameras if you don't have them.",
  },
  {
    code: "03",
    title: "Bring your workforce. We bring everything else.",
    headline: "You have people doing real work. We have AI labs buying it.",
    body: "We supply the cameras, the spec, the QC, and the payout rail. You supply the workforce. Revenue share or per-hour.",
  },
];

export default function DealTypes() {
  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)]">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent-primary)] mb-4">
              {"// 02"}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Three ways we pay you. Pick the one that fits.
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Typical first deal: <span className="text-[var(--accent-primary)] font-mono">$5K–$50K</span> archive license,
              or <span className="text-[var(--accent-primary)] font-mono">$40–$120/hr</span> capture rate by modality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {DEALS.map((deal, i) => (
              <motion.div
                key={deal.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card group hover:border-[var(--accent-primary)]/40 transition-colors flex flex-col"
              >
                <div className="font-mono text-xs text-[var(--accent-primary)] mb-3">
                  {`// ${deal.code}`}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {deal.title}
                </h3>
                <p className="text-base font-mono text-[var(--accent-primary)]/80 mb-4">
                  {deal.headline}
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed flex-1">
                  {deal.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
