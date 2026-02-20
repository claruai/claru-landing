"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Job, JobCategory } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AdminJobFormProps {
  job: Job;
}

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  skills?: string;
  compensationMin?: string;
  compensationMax?: string;
  locationRequirements?: string;
  validThrough?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Format an ISO date string as YYYY-MM-DD for date inputs. */
function toDateInputValue(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Client-side form for editing an existing job listing.
 *
 * Pre-populated with the current job data. Validates inline and submits
 * via PUT to /api/admin/jobs/[slug]. Redirects to /admin/jobs on success.
 *
 * Terminal aesthetic: monospace inputs, green focus borders, dark bg.
 */
export default function AdminJobForm({ job }: AdminJobFormProps) {
  const router = useRouter();

  /* ----- form state ------------------------------------------------- */
  const [title, setTitle] = useState(job.title);
  const [category, setCategory] = useState<JobCategory>(job.category);
  const [description, setDescription] = useState(job.description);
  const [skills, setSkills] = useState<string[]>(job.skills);
  const [skillInput, setSkillInput] = useState("");
  const [compensationMin, setCompensationMin] = useState(
    String(job.compensationMin)
  );
  const [compensationMax, setCompensationMax] = useState(
    String(job.compensationMax)
  );
  const [locationRequirements, setLocationRequirements] = useState(
    job.locationRequirements ?? ""
  );
  const [validThrough, setValidThrough] = useState(
    toDateInputValue(job.validThrough)
  );

  /* ----- ui state --------------------------------------------------- */
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  /* ----- validation ------------------------------------------------- */
  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    if (!title.trim()) {
      errs.title = "Title is required";
    }

    if (skills.length < 1) {
      errs.skills = "At least 1 skill is required";
    } else if (skills.length > 5) {
      errs.skills = "Maximum 5 skills allowed";
    }

    const minVal = Number(compensationMin);
    const maxVal = Number(compensationMax);

    if (isNaN(minVal) || minVal < 0) {
      errs.compensationMin = "Enter a valid minimum";
    }
    if (isNaN(maxVal) || maxVal < 0) {
      errs.compensationMax = "Enter a valid maximum";
    }
    if (!errs.compensationMin && !errs.compensationMax && minVal >= maxVal) {
      errs.compensationMin = "Minimum must be less than maximum";
    }

    return errs;
  }, [title, skills, compensationMin, compensationMax]);

  /* ----- skill tag management --------------------------------------- */
  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.length >= 5) return;
    if (skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
    // Clear skills error when adding
    setErrors((prev) => {
      if (prev.skills) {
        const { skills: _, ...rest } = prev;
        void _;
        return rest;
      }
      return prev;
    });
  }, [skillInput, skills]);

  const removeSkill = useCallback((index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSkillKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    },
    [addSkill]
  );

  /* ----- submit ----------------------------------------------------- */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(`/api/admin/jobs/${job.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            category,
            description,
            skills,
            compensationMin: Number(compensationMin),
            compensationMax: Number(compensationMax),
            locationRequirements: locationRequirements.trim() || undefined,
            validThrough,
          }),
        });

        if (response.ok) {
          setToast("Job updated successfully");
          // Short delay so the user sees the toast before redirect
          setTimeout(() => {
            router.push("/admin/jobs");
          }, 800);
        } else {
          const data = await response.json();
          if (data.errors) {
            setErrors(data.errors as FormErrors);
          } else {
            setToast(data.error || "Failed to update job");
          }
        }
      } catch {
        setToast("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validate,
      job.slug,
      title,
      category,
      description,
      skills,
      compensationMin,
      compensationMax,
      locationRequirements,
      validThrough,
      router,
    ]
  );

  /* ----- shared input class ----------------------------------------- */
  const inputClass =
    "w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50";

  const errorInputClass =
    "w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--error)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--error)] focus:ring-1 focus:ring-[var(--error)] transition-colors duration-200 disabled:opacity-50";

  /* ----- render ----------------------------------------------------- */
  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      {/* Toast notification */}
      {toast && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg font-mono text-sm border ${
            toast.includes("success")
              ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
              : "bg-[var(--error)]/10 border-[var(--error)]/30 text-[var(--error)]"
          }`}
        >
          <span className="opacity-60">
            {toast.includes("success") ? "ok: " : "error: "}
          </span>
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Read-only fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              slug (read-only)
            </label>
            <div className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-muted)]">
              {job.slug}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              date posted (read-only)
            </label>
            <div className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-muted)]">
              {toDateInputValue(job.datePosted)}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="job-title"
            className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
          >
            title <span className="text-[var(--error)]">*</span>
          </label>
          <input
            id="job-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Data Labeling Specialist"
            className={errors.title ? errorInputClass : inputClass}
          />
          {errors.title && (
            <p className="mt-1 text-xs font-mono text-[var(--error)]">
              {errors.title}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="job-category"
            className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
          >
            category
          </label>
          <select
            id="job-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as JobCategory)}
            disabled={isSubmitting}
            className={inputClass}
          >
            {(
              Object.entries(JOB_CATEGORIES) as [JobCategory, string][]
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs font-mono text-[var(--error)]">
              {errors.category}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="job-description"
            className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
          >
            description
          </label>
          <textarea
            id="job-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={8}
            placeholder="Full job description..."
            className={errors.description ? errorInputClass : inputClass}
            style={{ resize: "vertical", minHeight: "200px" }}
          />
          {errors.description && (
            <p className="mt-1 text-xs font-mono text-[var(--error)]">
              {errors.description}
            </p>
          )}
        </div>

        {/* Skills (tag input) */}
        <div>
          <label className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
            skills <span className="text-[var(--error)]">*</span>
            <span className="ml-2 text-[var(--text-muted)] normal-case tracking-normal">
              ({skills.length}/5)
            </span>
          </label>

          {/* Existing skill tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 rounded-md font-mono text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    disabled={isSubmitting}
                    className="hover:text-[var(--error)] transition-colors duration-150 disabled:opacity-50"
                    aria-label={`Remove skill: ${skill}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add skill input */}
          {skills.length < 5 && (
            <div className="flex gap-2">
              <input
                ref={skillInputRef}
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                disabled={isSubmitting}
                placeholder="Type a skill and press Enter"
                className={errors.skills ? errorInputClass : inputClass}
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={isSubmitting || !skillInput.trim()}
                className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                + add
              </button>
            </div>
          )}

          {errors.skills && (
            <p className="mt-1 text-xs font-mono text-[var(--error)]">
              {errors.skills}
            </p>
          )}
        </div>

        {/* Compensation range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="job-comp-min"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              compensation min ($/hr)
            </label>
            <input
              id="job-comp-min"
              type="number"
              min={0}
              step={1}
              value={compensationMin}
              onChange={(e) => setCompensationMin(e.target.value)}
              disabled={isSubmitting}
              placeholder="20"
              className={
                errors.compensationMin ? errorInputClass : inputClass
              }
            />
            {errors.compensationMin && (
              <p className="mt-1 text-xs font-mono text-[var(--error)]">
                {errors.compensationMin}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="job-comp-max"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              compensation max ($/hr)
            </label>
            <input
              id="job-comp-max"
              type="number"
              min={0}
              step={1}
              value={compensationMax}
              onChange={(e) => setCompensationMax(e.target.value)}
              disabled={isSubmitting}
              placeholder="35"
              className={
                errors.compensationMax ? errorInputClass : inputClass
              }
            />
            {errors.compensationMax && (
              <p className="mt-1 text-xs font-mono text-[var(--error)]">
                {errors.compensationMax}
              </p>
            )}
          </div>
        </div>

        {/* Location requirements */}
        <div>
          <label
            htmlFor="job-location"
            className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
          >
            location requirements
            <span className="ml-2 text-[var(--text-muted)] normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <input
            id="job-location"
            type="text"
            value={locationRequirements}
            onChange={(e) => setLocationRequirements(e.target.value)}
            disabled={isSubmitting}
            placeholder='e.g. "US", "EU", or leave empty for worldwide'
            className={inputClass}
          />
        </div>

        {/* Valid through */}
        <div>
          <label
            htmlFor="job-valid-through"
            className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
          >
            valid through
          </label>
          <input
            id="job-valid-through"
            type="date"
            value={validThrough}
            onChange={(e) => setValidThrough(e.target.value)}
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm font-medium rounded-lg hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "saving..." : "save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/jobs")}
            disabled={isSubmitting}
            className="px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-sm rounded-lg hover:border-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none transition-colors duration-200 disabled:opacity-50"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
}
