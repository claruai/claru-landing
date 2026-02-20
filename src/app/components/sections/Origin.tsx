"use client";

import { motion } from "framer-motion";
import FadeIn from "../effects/FadeIn";

export default function Origin() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-transparent">
      {/* Subtle top/bottom rules */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <motion.span
              className="inline-block text-sm font-mono text-[var(--accent-secondary)] mb-6 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {"// WHY WE EXIST"}
            </motion.span>

            <div className="space-y-5">
              <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-snug">
                We built Claru from inside the labs.
              </p>

              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                Before this, we were on the other side — hunting for training
                data our models needed, filing tickets to annotation vendors,
                waiting for batch cycles, fixing labels that missed the context
                of what we were building. Then spending weeks building the
                pipelines to clean, deduplicate, align, and format everything
                into something actually training-ready.
              </p>

              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                The next generation of models won&apos;t differentiate on
                architecture. They&apos;ll differentiate on data. Not volume
                —{" "}
                <span className="text-[var(--text-primary)] font-medium">
                  quality, specificity, and the end-to-end pipeline from raw
                  capture to golden dataset.
                </span>{" "}
                Most vendors handle a single piece — collection or labeling. We&apos;ve
                helped train frontier models end to end.
              </p>

              <p className="text-base md:text-lg text-[var(--accent-primary)] font-mono">
                A labor marketplace can&apos;t build that. A team that&apos;s shipped production datasets for frontier labs can.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent" />
    </section>
  );
}
