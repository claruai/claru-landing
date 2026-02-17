"use client";

import { motion } from "framer-motion";
import ContactForm from "../form/ContactForm";
import TextScramble from "../effects/TextScramble";
import { MorphingBlob } from "../effects/FloatingShapes";

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="section relative overflow-hidden bg-transparent"
    >
      {/* Morphing blob accents */}
      <MorphingBlob
        className="absolute -top-40 -left-40"
        size={600}
        color="rgba(146, 176, 144, 0.08)"
      />
      <MorphingBlob
        className="absolute -bottom-40 -right-40"
        size={500}
        color="rgba(146, 176, 144, 0.06)"
      />

      {/* ASCII corner decorations */}
      <div className="absolute top-8 left-8 font-mono text-xs text-[var(--accent-primary)] opacity-20 hidden lg:block">
        <pre>{`╔════════════════════╗
║  INITIATE CONTACT  ║
║  ▶ CONNECT NOW     ║
╚════════════════════╝`}</pre>
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs text-[var(--accent-primary)] opacity-20 hidden lg:block text-right">
        <pre>{`┌────────────────┐
│ STATUS: READY  │
│ AWAITING INPUT │
└────────────────┘`}</pre>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-sm font-mono text-[var(--accent-primary)] mb-4 uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {"// INITIATE"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your next hire isn&apos;t a vendor. <br className="hidden sm:block" />
            <TextScramble
              text=" It's a data team."
              className="italic text-[var(--accent-primary)]"
              scrambleOnHover={true}
              autoPlay={true}
              delay={400}
            />
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Tell us what you&apos;re training. We&apos;ll scope the dataset.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ContactForm />
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-4 opacity-30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[var(--accent-primary)]" />
          <span className="font-mono text-xs text-[var(--accent-primary)]">
            {"</>"}
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[var(--accent-primary)]" />
        </motion.div>
      </div>
    </section>
  );
}
