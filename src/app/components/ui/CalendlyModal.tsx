"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCalendly, CALENDLY_URL } from "../providers/CalendlyProvider";

export default function CalendlyModal() {
  const { isOpen, closeCalendly } = useCalendly();
  const backdropRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCalendly();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCalendly]);

  // Click outside to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) closeCalendly();
    },
    [closeCalendly]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          role="dialog"
          aria-modal="true"
          aria-label="Schedule a call"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-full max-w-2xl h-[80vh] max-h-[700px] bg-[#0a0908] border border-[var(--border-medium)] rounded-lg overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Terminal-style header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[#0a0908]">
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                {"// SCHEDULE A CALL"}
              </span>
              <button
                onClick={closeCalendly}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={16} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Calendly iframe */}
            <div className="flex-1 min-h-0">
              <iframe
                src={CALENDLY_URL}
                title="Schedule a call with Claru"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
