"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { trackContact } from "@/lib/meta/pixel";

const BUSINESS_TYPES = [
  { value: "cafe_restaurant", label: "Cafe / restaurant" },
  { value: "retail_store", label: "Retail store" },
  { value: "manufacturing_factory", label: "Manufacturing / factory" },
  { value: "mechanic_auto", label: "Mechanic / auto shop" },
  { value: "agriculture_farm", label: "Agriculture / farm" },
  { value: "packaging_fulfillment", label: "Packaging / fulfillment" },
  { value: "cleaning_service", label: "Cleaning service" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "fleet_logistics", label: "Fleet / logistics" },
  { value: "other", label: "Other" },
] as const;

const PARTNERSHIPS_LEAD_FIRED_KEY = "claru_gads_partnerships_lead_fired";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  business: z
    .string()
    .min(3, "Tell us your business name and city"),
  business_type: z.string().min(1, "Please pick a category"),
  description: z
    .string()
    .min(20, "A sentence or two — what does your team do? How many people?")
    .max(500, "Keep it under 500 characters"),
  sample_link: z
    .string()
    .url("Please enter a valid URL (include https://)")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

export default function PartnershipsForm() {
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

  const handleFormFocus = () => {
    if (startedFiredRef.current) return;
    startedFiredRef.current = true;
    posthog?.capture("partnerships_form_started", { source: "inline" });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    posthog?.capture("partnerships_form_submitted", {
      business_type: data.business_type,
      source: "inline",
    });

    posthog?.identify(data.email, {
      name: data.name,
      email: data.email,
      business: data.business,
      business_type: data.business_type,
      channel: "supply",
    });

    try {
      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          business: data.business,
          business_type: data.business_type,
          description: data.description,
          sample_link: data.sample_link || null,
        }),
      });

      if (!response.ok) {
        posthog?.capture("partnerships_form_error", {
          source: "inline",
          status: response.status,
          stage: "api_response",
        });
      }

      if (response.ok) {
        const responseBody = await response.json().catch(() => ({}));
        // Reuse Meta Contact event — it's the closest standard event for "lead intake".
        // The CAPI route receives our channel:supply tagging server-side.
        trackContact(responseBody?.meta_event_id);

        if (!localStorage.getItem(PARTNERSHIPS_LEAD_FIRED_KEY)) {
          window.gtag?.("event", "generate_lead", {
            form_name: "partnerships",
            page_location:
              typeof window !== "undefined" ? window.location.href : undefined,
          });
          try {
            localStorage.setItem(PARTNERSHIPS_LEAD_FIRED_KEY, "1");
          } catch {
            // localStorage may be unavailable (Safari private mode) — non-fatal
          }
        }
      }
    } catch (err) {
      posthog?.capture("partnerships_form_error", {
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
              claru@partnerships ~ SUBMITTED
            </span>
          </div>

          <div className="p-8 text-center space-y-4">
            <div className="font-mono text-sm text-[var(--accent-primary)]">
              &gt; Got it. We reply to every submission within 5 business days.
            </div>
            <h3 className="text-xl font-bold text-white">
              Thanks, {submitted.name}.
            </h3>
            <p className="text-sm text-[var(--text-muted)] font-mono">
              If your operation is a fit, we&apos;ll reach out at{" "}
              <span className="text-[var(--text-secondary)]">{submitted.email}</span>{" "}
              to set up a quick call.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={handleFormFocus}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          <span className="text-xs text-[var(--text-tertiary)] ml-2 font-mono">
            claru@partnerships ~ READY
          </span>
          <div className="flex-1" />
          <span className="text-xs text-[var(--accent-primary)] font-mono animate-pulse">
            CONNECTED
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 space-y-6">
          <div className="font-mono text-sm text-[var(--text-secondary)]">
            <span className="text-[var(--accent-primary)]">&gt;</span> Tell us about your business...
          </div>

          <FormField label="name" required error={errors.name?.message}>
            <input
              type="text"
              {...register("name")}
              className={inputCls}
              placeholder="Your name"
            />
          </FormField>

          <FormField label="email" required error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className={inputCls}
              placeholder="you@yourbusiness.com"
            />
          </FormField>

          <FormField
            label="business_and_city"
            required
            hint="What's your business called and where are you?"
            error={errors.business?.message}
          >
            <input
              type="text"
              {...register("business")}
              className={inputCls}
              placeholder="e.g., Joe's Cafe in Austin, TX"
            />
          </FormField>

          <FormField
            label="business_type"
            required
            hint="What kind of business is it?"
            error={errors.business_type?.message}
          >
            <select
              {...register("business_type")}
              className={`${inputCls} appearance-none`}
              defaultValue=""
            >
              <option value="" className="text-[var(--text-muted)]">
                -- Select --
              </option>
              {BUSINESS_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="what_you_do"
            required
            hint="2–3 sentences: what does your team do, and how many workers?"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              rows={4}
              maxLength={500}
              className={`${inputCls} resize-none`}
              placeholder="e.g., We run a small cafe in Austin with 4 baristas. We're open 7 days a week and would love to capture POV footage of our espresso work."
            />
          </FormField>

          <FormField
            label="sample_link"
            hint="Optional — Drive / Dropbox / YouTube link of any existing footage."
            error={errors.sample_link?.message}
          >
            <input
              type="url"
              {...register("sample_link")}
              className={inputCls}
              placeholder="https://"
            />
          </FormField>
        </div>
      </div>

      {/* Submit button */}
      <motion.div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-xs text-[var(--text-muted)] font-mono text-center">
          60 seconds. We reply in 5 business days.
        </p>
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
              SENDING...
            </>
          ) : (
            "Send →"
          )}
        </motion.button>

        <p className="text-sm text-[var(--text-muted)] font-mono text-center">
          Or email us directly at{" "}
          <a
            href="mailto:partners@claru.ai"
            className="text-[var(--accent-primary)] hover:underline transition-colors"
          >
            partners@claru.ai
          </a>
        </p>
      </motion.div>
    </form>
  );
}

const inputCls =
  "w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors";

function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-sm text-[var(--accent-primary)]">
        $ {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {hint && (
        <p className="font-mono text-[11px] text-[var(--text-muted)]">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="font-mono text-xs text-red-400">ERROR: {error}</p>
      )}
    </div>
  );
}
