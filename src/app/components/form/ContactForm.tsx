"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useCalendly } from "../providers/CalendlyProvider";
import { buildCalendlyEmbedUrl } from "../../lib/constants";
import { usePostHog } from "posthog-js/react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Company is required"),
  projectDescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function CalendlyStep({ name, email, bookingUrl }: { name: string; email: string; bookingUrl: string }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const calendlyUrl = buildCalendlyEmbedUrl(bookingUrl, { name, email });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden max-w-2xl mx-auto"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-[var(--text-tertiary)] ml-2 font-mono">
          claru@contact ~ SCHEDULE
        </span>
        <div className="flex-1" />
        <span className="text-xs text-[var(--accent-primary)] font-mono animate-pulse">
          CONNECTED
        </span>
      </div>

      {/* Calendly iframe */}
      <div className="relative" style={{ height: "620px" }}>
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
    </motion.div>
  );
}

export default function ContactForm() {
  const { bookingUrl } = useCalendly();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadData, setLeadData] = useState<FormData | null>(null);
  const posthog = usePostHog();

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

    posthog?.capture("contact_form_submitted", {
      company: data.company,
      has_project_description: !!data.projectDescription,
    });

    posthog?.identify(data.email, {
      name: data.name,
      email: data.email,
      company: data.company,
    });

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
    setLeadData(data);
  };

  if (leadData) {
    return <CalendlyStep name={leadData.name} email={leadData.email} bookingUrl={bookingUrl} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      {/* Terminal Window */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          <span className="text-xs text-[var(--text-tertiary)] ml-2 font-mono">
            claru@contact ~ READY
          </span>
          <div className="flex-1" />
          <span className="text-xs text-[var(--accent-primary)] font-mono animate-pulse">
            CONNECTED
          </span>
        </div>

        {/* Terminal content - Form Fields */}
        <div className="p-6 space-y-6">
          {/* Header prompt */}
          <div className="font-mono text-sm text-[var(--text-secondary)] mb-6">
            <span className="text-[var(--accent-primary)]">&gt;</span>{" "}
            Initialize consultation request...
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block font-mono text-sm text-[var(--accent-primary)]"
            >
              $ name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="font-mono text-xs text-red-400">
                ERROR: {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block font-mono text-sm text-[var(--accent-primary)]"
            >
              $ email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="font-mono text-xs text-red-400">
                ERROR: {errors.email.message}
              </p>
            )}
          </div>

          {/* Company Field */}
          <div className="space-y-2">
            <label
              htmlFor="company"
              className="block font-mono text-sm text-[var(--accent-primary)]"
            >
              $ company <span className="text-red-400">*</span>
            </label>
            <input
              id="company"
              type="text"
              {...register("company")}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              placeholder="Enter your company name"
            />
            {errors.company && (
              <p className="font-mono text-xs text-red-400">
                ERROR: {errors.company.message}
              </p>
            )}
          </div>

          {/* Project Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="projectDescription"
              className="flex flex-wrap gap-x-1.5 font-mono text-sm text-[var(--accent-primary)]"
            >
              <span>$ project_description</span>
              <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              id="projectDescription"
              {...register("projectDescription")}
              rows={4}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
              placeholder="Tell us about your project or requirements..."
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <motion.div className="mt-6 flex flex-col items-center gap-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary font-mono disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-8"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(0, 255, 136, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              PROCESSING...
            </>
          ) : (
            "Next: Choose a Time →"
          )}
        </motion.button>

        {/* Secondary contact option */}
        <p className="text-sm text-[var(--text-muted)] font-mono">
          Or email us directly at{" "}
          <a
            href="mailto:contact@claru.ai"
            className="text-[var(--accent-primary)] hover:underline transition-colors"
          >
            contact@claru.ai
          </a>
        </p>
      </motion.div>
    </form>
  );
}
