"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  index: number;
}

export default function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-[var(--border-subtle)]"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-[var(--accent-primary)] transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronRight
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-5 text-[var(--text-secondary)] leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}
