"use client";

import { motion } from "framer-motion";

interface SectionBridgeProps {
  text: string;
}

export default function SectionBridge({ text }: SectionBridgeProps) {
  return (
    <motion.div
      className="py-6 md:py-8 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-mono text-sm text-[var(--text-tertiary)] tracking-wide">
        {text}
      </p>
    </motion.div>
  );
}
