"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ContactForm from "@/app/components/form/ContactForm";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function FinalCTAV2() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[var(--bg-primary)] py-36 md:py-48">
      <div className="container mx-auto px-6">
        {/* Headline */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-8 inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
            {"// GET STARTED"}
          </span>

          <h2
            className="font-bold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Tell us what you&apos;re training.
            <br />
            <span className="text-white/40">
              We&apos;ll scope the dataset.
            </span>
          </h2>
          <p className="mt-6 text-base text-white/40 md:text-lg">
            From brief to first delivery in days, not months.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--accent-primary)] px-10 py-4 text-[15px] font-semibold text-[#0a0908] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--accent-glow-strong)]"
            >
              <span className="relative z-10">Talk to Our Team</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          id="contact"
          className="mx-auto mt-28 max-w-2xl"
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ContactForm />
        </motion.div>

        {/* Footer */}
        <div className="mx-auto mt-24 flex max-w-lg flex-col items-center gap-4 border-t border-white/[0.04] pt-10">
          <span className="font-mono text-[11px] tracking-[0.2em] text-white/20">
            CLARU
          </span>
          <div className="flex gap-6 font-mono text-[11px] text-white/20">
            <Link href="/legal" className="transition-colors duration-300 hover:text-white/40">Legal</Link>
            <a href="mailto:contact@claru.ai" className="transition-colors duration-300 hover:text-[var(--accent-primary)]">contact@claru.ai</a>
          </div>
        </div>
      </div>
    </section>
  );
}
