"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCalendly, type LeadData } from "../providers/CalendlyProvider";
import { buildCalendlyEmbedUrl } from "../../lib/constants";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Company is required"),
  projectDescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function TerminalHeader({
  step,
  onClose,
  closeRef,
}: {
  step: 1 | 2;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[#0f0e0d] shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          {step === 1 ? "// STEP 1/2 — INITIALIZE" : "// STEP 2/2 — SCHEDULE"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[var(--accent-primary)] animate-pulse">
          CONNECTED
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={16} className="text-[var(--text-secondary)]" />
        </button>
      </div>
    </div>
  );
}

function StepForm({ onSuccess }: { onSuccess: (data: LeadData) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Silently handle — still advance to booking
    }
    setIsSubmitting(false);
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="font-mono text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--accent-primary)]">&gt;</span>{" "}
          Initialize consultation request...
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="block font-mono text-sm text-[var(--accent-primary)]">
            $ name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            placeholder="Your name"
            autoFocus
          />
          {errors.name && (
            <p className="font-mono text-xs text-red-400">ERROR: {errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block font-mono text-sm text-[var(--accent-primary)]">
            $ email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="font-mono text-xs text-red-400">ERROR: {errors.email.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-1.5">
          <label className="block font-mono text-sm text-[var(--accent-primary)]">
            $ company <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("company")}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            placeholder="Your company"
          />
          {errors.company && (
            <p className="font-mono text-xs text-red-400">ERROR: {errors.company.message}</p>
          )}
        </div>

        {/* Project Description */}
        <div className="space-y-1.5">
          <label className="flex flex-wrap gap-x-1.5 font-mono text-sm text-[var(--accent-primary)]">
            <span>$ project_description</span>
            <span className="text-[var(--text-muted)]">(optional)</span>
          </label>
          <textarea
            {...register("projectDescription")}
            rows={3}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            placeholder="Tell us about your project or requirements..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-6 pb-6 pt-4 border-t border-[var(--border-subtle)]">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="btn-cta-glitch w-full !py-3 !text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                PROCESSING...
              </>
            ) : (
              "Next: Choose a Time →"
            )}
          </span>
        </motion.button>
      </div>
    </form>
  );
}

function StepCalendly({ leadData, bookingUrl }: { leadData: LeadData; bookingUrl: string }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const calendlyUrl = buildCalendlyEmbedUrl(bookingUrl, { name: leadData.name, email: leadData.email });

  return (
    <div className="flex-1 min-h-0 relative">
      {!iframeLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-[var(--accent-primary)] animate-spin" />
          <span className="font-mono text-xs text-[var(--text-muted)] animate-pulse">
            // LOADING...
          </span>
        </div>
      )}
      <iframe
        src={calendlyUrl}
        title="Schedule a call with Claru"
        className={`w-full h-full border-0 transition-opacity duration-300 ${
          iframeLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIframeLoaded(true)}
      />
    </div>
  );
}

export default function CalendlyModal() {
  const { isOpen, step, leadData, bookingUrl, closeCalendly, advanceToCalendly } =
    useCalendly();
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  useEffect(() => setMounted(true), []);

  // Autofocus close button on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Lock body scroll
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCalendly();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCalendly]);

  // Backdrop click — track mousedown to prevent drag-release misfires
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = e.target;
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        e.target === backdropRef.current &&
        mouseDownTarget.current === backdropRef.current
      ) {
        closeCalendly();
      }
    },
    [closeCalendly]
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          role="dialog"
          aria-modal="true"
          aria-label="Book a consultation"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleMouseDown}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-full max-w-lg bg-[#0a0908] border border-[var(--border-medium)] rounded-lg overflow-hidden flex flex-col"
            style={{ height: step === 1 ? "auto" : "85vh", maxHeight: "700px" }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <TerminalHeader step={step} onClose={closeCalendly} closeRef={closeRef} />

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="form"
                  className="flex flex-col min-h-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepForm onSuccess={advanceToCalendly} />
                </motion.div>
              ) : (
                <motion.div
                  key="calendly"
                  className="flex-1 min-h-0 flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepCalendly leadData={leadData!} bookingUrl={bookingUrl} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
