"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  submitCustomRequest,
  type RequestFormState,
} from "./actions";
import { DEFAULT_BOOKING_URL } from "../../lib/constants";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODALITIES = [
  "Video",
  "Image",
  "Text",
  "Audio",
  "Multi-modal",
  "Other",
] as const;

const INITIAL_STATE: RequestFormState = {
  status: "idle",
  message: "",
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function PortalRequestPage() {
  const [state, formAction, isPending] = useActionState(
    submitCustomRequest,
    INITIAL_STATE
  );
  const [bookingUrl, setBookingUrl] = useState(DEFAULT_BOOKING_URL);

  useEffect(() => {
    fetch("/api/booking-url")
      .then((res) => res.json())
      .then((data: { url: string | null }) => {
        if (data.url) setBookingUrl(data.url);
      })
      .catch(() => {});
  }, []);

  // --- Success State --------------------------------------------------------

  if (state.status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="px-6 py-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg">
            <div className="text-[var(--accent-primary)] text-3xl mb-4 font-mono">
              {">>>"}
            </div>
            <h2 className="text-lg font-mono font-medium text-[var(--text-primary)] mb-2">
              Request submitted
            </h2>
            <p className="text-sm font-mono text-[var(--text-muted)] leading-relaxed mb-6">
              {state.message}
            </p>

            {/* CTAs */}
            <div className="space-y-3">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm font-medium rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                Or book a call
              </a>

              <Link
                href="/case-studies"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-sm rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
              >
                <BookOpen className="w-4 h-4" />
                Browse case studies
              </Link>

              <Link
                href="/portal/catalog"
                className="inline-flex items-center gap-1.5 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Form State -----------------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <Link
          href="/portal/catalog"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to catalog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-mono font-semibold tracking-tight text-[var(--text-primary)]">
            Can&apos;t find what you need?
          </h1>
          <p className="mt-3 text-sm font-mono text-[var(--text-muted)] leading-relaxed">
            We collect and label custom datasets using our global network.
            Tell us what you&apos;re looking for.
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-6">
          {/* Description (required) */}
          <div>
            <label
              htmlFor="request-description"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              describe the data you need{" "}
              <span className="text-[var(--error)]">*</span>
            </label>
            <textarea
              id="request-description"
              name="description"
              required
              rows={5}
              disabled={isPending}
              placeholder="e.g. 500 hours of egocentric kitchen video with object interaction labels..."
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50 resize-y min-h-[120px]"
            />
          </div>

          {/* Data Modality (dropdown) */}
          <div>
            <label
              htmlFor="request-modality"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              data modality
            </label>
            <select
              id="request-modality"
              name="modality"
              disabled={isPending}
              defaultValue=""
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50 appearance-none"
            >
              <option value="" disabled className="text-[var(--text-muted)]">
                Select a modality...
              </option>
              {MODALITIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes (optional) */}
          <div>
            <label
              htmlFor="request-notes"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              additional notes{" "}
              <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              id="request-notes"
              name="notes"
              rows={3}
              disabled={isPending}
              placeholder="Timeline, budget, specific requirements..."
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50 resize-y"
            />
          </div>

          {/* Error message */}
          {state.status === "error" && state.message && (
            <div className="px-4 py-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
              <p className="text-sm font-mono text-[var(--error)]">
                <span className="opacity-60">error: </span>
                {state.message}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm font-medium rounded-lg hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "submitting..." : "submit request"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-xs font-mono text-[var(--text-muted)]">or</span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        {/* Secondary CTAs */}
        <div className="space-y-3">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-sm rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Book a call with our team
          </a>

          <Link
            href="/case-studies"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-sm rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4" />
            Browse case studies
          </Link>
        </div>

        {/* Terminal footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)]">$</span> our team
            typically responds within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
