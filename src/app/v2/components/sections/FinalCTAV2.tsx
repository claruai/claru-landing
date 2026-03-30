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
        <footer className="mt-32 border-t border-white/[0.06] pt-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Solutions */}
            <div>
              <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                Solutions
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/solutions/egocentric-video-data" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Egocentric Video Data</Link></li>
                <li><Link href="/solutions/vla-training-data" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">VLA Training Data</Link></li>
                <li><Link href="/solutions/teleoperation-data" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Teleoperation Data</Link></li>
                <li><Link href="/solutions/manipulation-trajectory-data" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Manipulation Trajectories</Link></li>
              </ul>
            </div>

            {/* Compare */}
            <div>
              <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                Compare
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/compare/claru-vs-luel" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Claru vs Luel</Link></li>
                <li><Link href="/compare/scale-ai-alternatives" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Scale AI Alternatives</Link></li>
                <li><Link href="/compare/appen-alternatives" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Appen Alternatives</Link></li>
                <li><Link href="/compare/labelbox-alternatives" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Labelbox Alternatives</Link></li>
                <li><Link href="/compare/surge-ai-alternatives" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Surge AI Alternatives</Link></li>
                <li><Link href="/compare/encord-alternatives" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Encord Alternatives</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                Resources
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/training-data-for-robotics" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Training Data for Robotics</Link></li>
                <li><Link href="/physical-ai-training-data" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Physical AI Data</Link></li>
                <li><Link href="/egocentric-video-datasets" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Egocentric Datasets</Link></li>
                <li><Link href="/case-studies" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Case Studies</Link></li>
                <li><Link href="/data-catalog" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Data Catalog</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                Company
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/about" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">About</Link></li>
                <li><Link href="/jobs" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Jobs</Link></li>
                <li><Link href="/for-annotators" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">For Annotators</Link></li>
                <li><Link href="/#contact" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Contact</Link></li>
                <li><Link href="/legal" className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/50">Legal</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/[0.04] pt-8 sm:flex-row sm:justify-between">
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/20">
              &copy; 2026 Claru AI. All rights reserved.
            </span>
            <a
              href="mailto:contact@claru.ai"
              className="font-mono text-[11px] text-white/20 transition-colors duration-300 hover:text-[var(--accent-primary)]"
            >
              contact@claru.ai
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
