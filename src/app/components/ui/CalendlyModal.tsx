"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCalendly } from "../providers/CalendlyProvider";
import { usePostHog } from "posthog-js/react";

const HEARD_ABOUT_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "word_of_mouth", label: "Word of mouth / Referral" },
  { value: "google", label: "Google / Search" },
  { value: "ai_assistant", label: "AI assistant (ChatGPT, Claude, Perplexity...)" },
  { value: "blog", label: "Blog or article" },
  { value: "conference", label: "Conference or event" },
  { value: "newsletter", label: "Newsletter" },
  { value: "other", label: "Other" },
] as const;

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Company is required"),
  projectDescription: z.string().min(10, "Please describe your project (at least 10 characters)"),
  heardAbout: z.string().min(1, "Please select an option"),
});

type FormData = z.infer<typeof formSchema>;

function TerminalHeader({
  submitted,
  onClose,
  closeRef,
}: {
  submitted: boolean;
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
          {submitted ? "// SUBMITTED" : "// INITIALIZE"}
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

function StepForm({ onSuccess }: { onSuccess: (data: FormData) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const posthog = usePostHog();
  const startedFiredRef = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleFormFocus = () => {
    if (startedFiredRef.current) return;
    startedFiredRef.current = true;
    posthog?.capture("contact_form_started", { source: "modal" });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    posthog?.capture("contact_form_submitted", {
      company: data.company,
      heard_about: data.heardAbout,
      source: "modal",
    });

    posthog?.identify(data.email, {
      name: data.name,
      email: data.email,
      company: data.company,
      heard_about: data.heardAbout,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          project_description: data.projectDescription,
          heard_about: data.heardAbout,
        }),
      });
      if (!response.ok) {
        posthog?.capture("contact_form_error", {
          source: "modal",
          status: response.status,
          stage: "api_response",
        });
      }
    } catch (err) {
      posthog?.capture("contact_form_error", {
        source: "modal",
        stage: "network",
        message: err instanceof Error ? err.message : String(err),
      });
      // Still advance to confirmation — server may have actually received it.
    }
    setIsSubmitting(false);
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFormFocus} className="flex flex-col h-full">
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
          <label className="block font-mono text-sm text-[var(--accent-primary)]">
            $ how_can_we_help <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register("projectDescription")}
            rows={3}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            placeholder="What are you building? What kind of data do you need?"
          />
          {errors.projectDescription && (
            <p className="font-mono text-xs text-red-400">ERROR: {errors.projectDescription.message}</p>
          )}
        </div>

        {/* Heard About */}
        <div className="space-y-1.5">
          <label className="block font-mono text-sm text-[var(--accent-primary)]">
            $ how_did_you_find_us <span className="text-red-400">*</span>
          </label>
          <select
            {...register("heardAbout")}
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors appearance-none"
          >
            <option value="">-- Select an option --</option>
            {HEARD_ABOUT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.heardAbout && (
            <p className="font-mono text-xs text-red-400">ERROR: {errors.heardAbout.message}</p>
          )}
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
              "Submit →"
            )}
          </span>
        </motion.button>
      </div>
    </form>
  );
}

function SuccessView({ name, email, onClose }: { name: string; email: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-4">
      <div className="font-mono text-sm text-[var(--accent-primary)]">
        &gt; Request received. We&apos;ll be in touch within 24 hours.
      </div>
      <h3 className="text-xl font-bold text-white">Thanks, {name}.</h3>
      <p className="text-sm text-[var(--text-muted)] font-mono">
        Our team will review your requirements and reach out at{" "}
        <span className="text-[var(--text-secondary)]">{email}</span>
      </p>
      <button
        onClick={onClose}
        className="mt-4 font-mono text-sm text-[var(--accent-primary)] border border-[var(--accent-primary)] px-6 py-2 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors"
      >
        Close
      </button>
    </div>
  );
}

export default function CalendlyModal() {
  const { isOpen, closeCalendly } = useCalendly();
  const [submitted, setSubmitted] = useState<FormData | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Reset submitted state: immediately on open (guarantees clean form), after animation on close
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitted(null);
    } else {
      setTimeout(() => setSubmitted(null), 300);
    }
  }, [isOpen]);

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
            style={{ height: "auto", maxHeight: "90vh" }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <TerminalHeader submitted={!!submitted} onClose={closeCalendly} closeRef={closeRef} />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="flex flex-col min-h-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SuccessView
                    name={submitted.name}
                    email={submitted.email}
                    onClose={closeCalendly}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="flex flex-col min-h-0 overflow-y-auto"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepForm onSuccess={(data) => setSubmitted(data)} />
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
