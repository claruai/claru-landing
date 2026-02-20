"use client";

import { motion } from "framer-motion";
import FadeIn from "../effects/FadeIn";
import GlobeMap from "../ui/GlobeMap";

export default function GlobalReach() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-transparent">
      {/* Subtle top rule */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <motion.span
              className="inline-block text-sm font-mono text-[var(--accent-secondary)] mb-6 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {"// GLOBAL REACH"}
            </motion.span>

            <div className="space-y-4 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-snug">
                Data from everywhere your model will deploy.
              </h2>

              <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                Your model needs to generalize. Your data should too.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <GlobeMap />
          </FadeIn>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent" />
    </section>
  );
}
