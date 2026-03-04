"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Sparkles, Loader2, Check, RotateCcw } from "lucide-react";
import type { SlideData } from "@/types/deck-builder";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GenerateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (slides: SlideData[]) => void;
  templateId: string;
}

interface AudienceForm {
  company_type: string;
  stage: string;
  pain_point: string;
  modalities: string[];
}

type WizardStep = 1 | 2 | 3;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COMPANY_TYPES = [
  "AI Lab",
  "Robotics Company",
  "Video Platform",
  "Autonomous Vehicles",
  "Other",
];

const STAGES = ["Early Stage", "Growth", "Enterprise"] as const;

const MODALITIES = ["Video", "Robotics", "Multimodal", "Vision", "Text"] as const;

const STATUS_MESSAGES = [
  "Finding the best angle...",
  "Structuring the narrative...",
  "Writing compelling copy...",
  "Building your presentation...",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GenerateWizard({
  isOpen,
  onClose,
  onGenerated,
  templateId,
}: GenerateWizardProps) {
  // -- State ---------------------------------------------------------------
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<AudienceForm>({
    company_type: "",
    stage: "",
    pain_point: "",
    modalities: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AudienceForm, string>>>({});
  const [generatedSlides, setGeneratedSlides] = useState<SlideData[]>([]);
  const [statusIndex, setStatusIndex] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // -- Escape key dismiss --------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleCancel();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step]);

  // -- Reset on close/open -------------------------------------------------
  useEffect(() => {
    if (!isOpen) {
      // Clean up on close
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    }
  }, [isOpen]);

  // -- Rotating status messages in step 2 ----------------------------------
  useEffect(() => {
    if (step !== 2) {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      return;
    }

    setStatusIndex(0);
    statusIntervalRef.current = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 3000);

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
    };
  }, [step]);

  // -- Form validation -----------------------------------------------------
  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof AudienceForm, string>> = {};

    if (!form.company_type) {
      newErrors.company_type = "Select a company type";
    }
    if (!form.stage) {
      newErrors.stage = "Select a company stage";
    }
    if (!form.pain_point || form.pain_point.trim().length < 10) {
      newErrors.pain_point = "Describe the pain point (at least 10 characters)";
    }
    if (form.modalities.length === 0) {
      newErrors.modalities = "Select at least one modality";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const isFormValid =
    form.company_type !== "" &&
    form.stage !== "" &&
    form.pain_point.trim().length >= 10 &&
    form.modalities.length > 0;

  // -- Modality checkbox toggle --------------------------------------------
  function toggleModality(modality: string) {
    setForm((prev) => ({
      ...prev,
      modalities: prev.modalities.includes(modality)
        ? prev.modalities.filter((m) => m !== modality)
        : [...prev.modalities, modality],
    }));
    // Clear modalities error when user selects one
    if (errors.modalities) {
      setErrors((prev) => ({ ...prev, modalities: undefined }));
    }
  }

  // -- Generate API call ---------------------------------------------------
  const generate = useCallback(async () => {
    setStep(2);
    setApiError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_type: form.company_type,
            stage: form.stage,
            pain_point: form.pain_point.trim(),
            modalities: form.modalities,
          }),
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      if (!data.slides || !Array.isArray(data.slides)) {
        throw new Error("Invalid response format");
      }

      setGeneratedSlides(data.slides);
      setStep(3);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // User cancelled — go back to step 1
        setStep(1);
        return;
      }
      console.error("[GenerateWizard] Generation failed:", err);
      setApiError((err as Error).message);
      setStep(1);
    } finally {
      abortRef.current = null;
    }
  }, [form, templateId]);

  // -- Handlers ------------------------------------------------------------
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    generate();
  }

  function handleCancel() {
    if (step === 2 && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setStep(1);
      setGeneratedSlides([]);
      setApiError(null);
      setErrors({});
    }, 200);
  }

  function handleAccept() {
    onGenerated(generatedSlides);
    onClose();
    setTimeout(() => {
      setStep(1);
      setGeneratedSlides([]);
      setErrors({});
    }, 200);
  }

  function handleRegenerate() {
    generate();
  }

  // -- Render guard --------------------------------------------------------
  if (!isOpen) return null;

  // -- Step renderers ------------------------------------------------------

  function renderStep1() {
    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* API error banner */}
        {apiError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        {/* Company type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Company Type
          </label>
          <select
            value={form.company_type}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, company_type: e.target.value }));
              if (errors.company_type) {
                setErrors((prev) => ({ ...prev, company_type: undefined }));
              }
            }}
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-primary)]"
          >
            <option value="">Select company type...</option>
            {COMPANY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.company_type && (
            <p className="mt-1 text-xs text-red-400">{errors.company_type}</p>
          )}
        </div>

        {/* Company stage */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Company Stage
          </label>
          <div className="flex gap-3">
            {STAGES.map((s) => (
              <label
                key={s}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  form.stage === s
                    ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <input
                  type="radio"
                  name="stage"
                  value={s}
                  checked={form.stage === s}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, stage: e.target.value }));
                    if (errors.stage) {
                      setErrors((prev) => ({ ...prev, stage: undefined }));
                    }
                  }}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
          {errors.stage && (
            <p className="mt-1 text-xs text-red-400">{errors.stage}</p>
          )}
        </div>

        {/* Pain point */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Primary Pain Point
          </label>
          <textarea
            value={form.pain_point}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, pain_point: e.target.value }));
              if (errors.pain_point && e.target.value.trim().length >= 10) {
                setErrors((prev) => ({ ...prev, pain_point: undefined }));
              }
            }}
            placeholder="What problem are they trying to solve with training data?"
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent-primary)]"
          />
          {errors.pain_point && (
            <p className="mt-1 text-xs text-red-400">{errors.pain_point}</p>
          )}
        </div>

        {/* Modalities */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Data Modalities
          </label>
          <div className="flex flex-wrap gap-2">
            {MODALITIES.map((mod) => {
              const selected = form.modalities.includes(mod);
              return (
                <button
                  key={mod}
                  type="button"
                  onClick={() => toggleModality(mod)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                      : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
                  }`}
                >
                  {selected && <Check className="mr-1 inline-block h-3 w-3" />}
                  {mod}
                </button>
              );
            })}
          </div>
          {errors.modalities && (
            <p className="mt-1 text-xs text-red-400">{errors.modalities}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Sparkles className="h-4 w-4" />
          Generate Deck
        </button>
      </form>
    );
  }

  function renderStep2() {
    return (
      <div className="flex flex-col items-center py-12">
        {/* Animated spinner */}
        <div className="relative mb-8">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--accent-primary)]" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-[var(--accent-primary)]/10" />
        </div>

        {/* Rotating status message */}
        <div className="h-6 text-center">
          <p
            key={statusIndex}
            className="animate-fade-in font-mono text-sm text-[var(--accent-primary)]"
          >
            {STATUS_MESSAGES[statusIndex]}
          </p>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex gap-2">
          {STATUS_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                i <= statusIndex
                  ? "bg-[var(--accent-primary)]"
                  : "bg-[var(--border-subtle)]"
              }`}
            />
          ))}
        </div>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className="mt-8 rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Cancel
        </button>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-[var(--accent-primary)]" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Generated {generatedSlides.length} slides
          </h3>
        </div>

        {/* Slide list */}
        <div className="max-h-[320px] space-y-1 overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2">
          {generatedSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="rounded-md px-3 py-2 transition-colors hover:bg-[var(--bg-secondary)]"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--text-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {slide.title || "(untitled)"}
                  </p>
                  {slide.body && (
                    <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                      {slide.body.split("\n")[0]}
                    </p>
                  )}
                </div>
                <span className="ml-auto shrink-0 rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                  {slide.layout}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90"
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <RotateCcw className="h-4 w-4" />
            Regenerate
          </button>
          <button
            onClick={handleCancel}
            className="rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // -- Main render ---------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20">
      {/* Modal card */}
      <div className="relative mx-4 w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {step === 1 && "Generate with AI"}
            {step === 2 && "Generating Deck"}
            {step === 3 && "Deck Preview"}
          </h2>
          {step === 1 && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Describe your target audience and we&apos;ll create a tailored
              sales deck.
            </p>
          )}
        </div>

        {/* Step content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Step indicator */}
        <div className="mt-5 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-6 bg-[var(--accent-primary)]"
                  : s < step
                    ? "w-3 bg-[var(--accent-primary)]/40"
                    : "w-3 bg-[var(--border-subtle)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
