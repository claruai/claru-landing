"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ContactForm from "@/app/components/form/ContactForm";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function FinalCTAV2() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[var(--bg-primary)] py-24">
      <div className="container mx-auto px-6">
        {/* Headline */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            3.7M annotations. 25 datasets.
            <br />
            Depth, pose, segmentation on every clip.
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Browse now or tell us what&apos;s missing.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-md bg-[var(--accent-primary)] px-8 py-3.5 font-medium text-[#0a0908] transition-all hover:brightness-110 hover:shadow-[0_0_20px_var(--accent-glow-strong)]"
            >
              Browse Catalog
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-8 py-3.5 font-medium text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              Request Custom
            </a>
          </div>
        </motion.div>

        {/* Contact form */}
        <div id="contact" className="mx-auto mt-20 max-w-2xl">
          <ContactForm />
        </div>

        {/* Enrichment CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            Already have raw data?{" "}
            <a
              href="#enrichment"
              className="text-[var(--accent-primary)] underline underline-offset-4 transition-colors hover:text-[var(--accent-secondary)]"
            >
              See our enrichment pipeline
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
