"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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

// localStorage keys for conversion idempotency — "fire only once per user" per the Google Ads brief.
// Firing on submit (incl. failures) or on refresh would poison Smart Bidding.
// Separate keys per Ads account so each tag fires independently if added/removed.
const LEAD_CONVERSION_FIRED_KEY = "claru_gads_lead_conversion_fired";
const DEMAND_ENQUIRY_CONVERSION_FIRED_KEY = "claru_gads_demand_enquiry_conversion_fired";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Company is required"),
  projectDescription: z.string().min(10, "Please describe your project (at least 10 characters)"),
  heardAbout: z.string().min(1, "Please select an option"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<FormData | null>(null);
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

  // Fire `contact_form_started` once per mount when any field first receives focus.
  // Captured at the form element so a single handler covers all fields.
  const handleFormFocus = () => {
    if (startedFiredRef.current) return;
    startedFiredRef.current = true;
    posthog?.capture("contact_form_started", { source: "inline" });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    posthog?.capture("contact_form_submitted", {
      company: data.company,
      heard_about: data.heardAbout,
      source: "inline",
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
          source: "inline",
          status: response.status,
          stage: "api_response",
        });
      }

      // Fire analytics only on confirmed server success AND only once per browser per tag.
      if (response.ok) {
        if (!localStorage.getItem(LEAD_CONVERSION_FIRED_KEY)) {
          window.gtag?.("event", "conversion", {
            send_to: "AW-16922029729/kmelCJ6Ss6EcEKHdhoU_",
            value: 1.0,
            currency: "USD",
          });
          window.gtag?.("event", "generate_lead", {
            form_name: "contact",
            page_location: typeof window !== "undefined" ? window.location.href : undefined,
          });
          try {
            localStorage.setItem(LEAD_CONVERSION_FIRED_KEY, String(Date.now()));
          } catch {
            // localStorage may be unavailable (Safari private mode) — non-fatal
          }
        }
        // [Demand] Enquiry Submitted — Google Ads conversion for AW-18127763802
        if (!localStorage.getItem(DEMAND_ENQUIRY_CONVERSION_FIRED_KEY)) {
          window.gtag?.("event", "conversion", {
            send_to: "AW-18127763802/jUQCCISU56QcENry_sND",
            value: 1.0,
            currency: "USD",
          });
          try {
            localStorage.setItem(DEMAND_ENQUIRY_CONVERSION_FIRED_KEY, String(Date.now()));
          } catch {
            // non-fatal
          }
        }
      }
    } catch (err) {
      posthog?.capture("contact_form_error", {
        source: "inline",
        stage: "network",
        message: err instanceof Error ? err.message : String(err),
      });
      // Still advance to confirmation — server may have actually received it.
    }

    setIsSubmitting(false);
    setSubmitted(data);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-[var(--text-tertiary)] ml-2 font-mono">
              claru@contact ~ SUBMITTED
            </span>
          </div>

          <div className="p-8 text-center space-y-4">
            <div className="font-mono text-sm text-[var(--accent-primary)]">
              &gt; Request received. We&apos;ll be in touch within 24 hours.
            </div>
            <h3 className="text-xl font-bold text-white">Thanks, {submitted.name}.</h3>
            <p className="text-sm text-[var(--text-muted)] font-mono">
              Our team will review your requirements and reach out at{" "}
              <span className="text-[var(--text-secondary)]">{submitted.email}</span>
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFormFocus} className="max-w-2xl mx-auto">
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
              className="block font-mono text-sm text-[var(--accent-primary)]"
            >
              $ how_can_we_help <span className="text-red-400">*</span>
            </label>
            <textarea
              id="projectDescription"
              {...register("projectDescription")}
              rows={4}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
              placeholder="What are you building? What kind of data do you need?"
            />
            {errors.projectDescription && (
              <p className="font-mono text-xs text-red-400">
                ERROR: {errors.projectDescription.message}
              </p>
            )}
          </div>

          {/* Heard About Field */}
          <div className="space-y-2">
            <label
              htmlFor="heardAbout"
              className="block font-mono text-sm text-[var(--accent-primary)]"
            >
              $ how_did_you_find_us <span className="text-red-400">*</span>
            </label>
            <select
              id="heardAbout"
              {...register("heardAbout")}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors appearance-none"
            >
              <option value="" className="text-[var(--text-muted)]">
                -- Select an option --
              </option>
              {HEARD_ABOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.heardAbout && (
              <p className="font-mono text-xs text-red-400">
                ERROR: {errors.heardAbout.message}
              </p>
            )}
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
            "Submit →"
          )}
        </motion.button>

        {/* Secondary contact option */}
        <p className="text-sm text-[var(--text-muted)] font-mono text-center">
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
