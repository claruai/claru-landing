'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  submitAccessRequest,
  type AccessRequestInput,
} from './actions';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const USE_CASE_OPTIONS = [
  'Video Generation',
  'Robotics/Manipulation',
  'Vision-Language Models',
  'Embodied AI',
  'Safety/Red Teaming',
  'Other',
] as const;

const TOTAL_STEPS = 3;

// ---------------------------------------------------------------------------
// Validation Schemas (per-step + full)
// ---------------------------------------------------------------------------

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string(),
  role: z.string(),
});

const step2Schema = z.object({
  data_needs: z.string(),
  use_case: z.string().min(1, 'Please select a use case'),
});

const fullSchema = step1Schema.merge(step2Schema);

type FormValues = z.infer<typeof fullSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RequestFormClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      data_needs: '',
      use_case: '',
    },
  });

  // Validate current step fields before advancing
  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(['name', 'email', 'company', 'role']);
    } else if (currentStep === 2) {
      isValid = await trigger(['data_needs', 'use_case']);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    const payload: AccessRequestInput = {
      name: data.name,
      email: data.email,
      company: data.company ?? '',
      role: data.role ?? '',
      data_needs: data.data_needs ?? '',
      use_case: data.use_case,
    };

    const result = await submitAccessRequest(payload);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitResult({ success: true, message: result.message });
    } else {
      setSubmitResult({ success: false, message: result.error });
    }
  };

  // ---------------------------------------------------------------------------
  // Success State
  // ---------------------------------------------------------------------------

  if (submitResult?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 font-mono max-w-2xl mx-auto"
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-[var(--text-tertiary)] ml-2">
            claru@catalog ~ SUCCESS
          </span>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-16 h-16 mx-auto mb-6 bg-[var(--accent-primary)] flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-[var(--bg-primary)]" />
        </motion.div>

        <div className="text-center space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[var(--accent-primary)]"
          >
            &gt; Request received.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[var(--accent-primary)]"
          >
            &gt; Queued for review...
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[var(--text-secondary)] text-center mt-6 text-sm"
        >
          {submitResult.message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <Link
            href="/data-catalog"
            className="text-[var(--accent-primary)] hover:underline font-mono text-sm"
          >
            &larr; Return to Data Catalog
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form Render
  // ---------------------------------------------------------------------------

  const values = getValues();

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
            claru@catalog/request ~ STEP {currentStep}/{TOTAL_STEPS}
          </span>
          <div className="flex-1" />
          <span className="text-xs text-[var(--accent-primary)] font-mono animate-pulse">
            READY
          </span>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 transition-colors duration-300 ${
                  i + 1 <= currentStep
                    ? 'bg-[var(--accent-primary)]'
                    : 'bg-[var(--border-subtle)]'
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
            {currentStep === 1 && 'Step 1: About You'}
            {currentStep === 2 && 'Step 2: Data Needs'}
            {currentStep === 3 && 'Step 3: Review + Submit'}
          </p>
        </div>

        {/* Terminal content */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* ----- Step 1: About You ----- */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="font-mono text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--accent-primary)]">&gt;</span>{' '}
                  Tell us about yourself...
                </div>

                {/* Name */}
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
                    {...register('name')}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="font-mono text-xs text-red-400">
                      ERROR: {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                    {...register('email')}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="font-mono text-xs text-red-400">
                      ERROR: {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="block font-mono text-sm text-[var(--accent-primary)]"
                  >
                    $ company{' '}
                    <span className="text-[var(--text-muted)]">(optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    {...register('company')}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="Your company name"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block font-mono text-sm text-[var(--accent-primary)]"
                  >
                    $ role{' '}
                    <span className="text-[var(--text-muted)]">(optional)</span>
                  </label>
                  <input
                    id="role"
                    type="text"
                    {...register('role')}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="e.g. ML Engineer, Head of Data"
                  />
                </div>
              </motion.div>
            )}

            {/* ----- Step 2: Data Needs ----- */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="font-mono text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--accent-primary)]">&gt;</span>{' '}
                  Tell us about your data requirements...
                </div>

                {/* Data needs textarea */}
                <div className="space-y-2">
                  <label
                    htmlFor="data_needs"
                    className="block font-mono text-sm text-[var(--accent-primary)]"
                  >
                    $ data_needs{' '}
                    <span className="text-[var(--text-muted)]">(optional)</span>
                  </label>
                  <textarea
                    id="data_needs"
                    {...register('data_needs')}
                    rows={4}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
                    placeholder="What kind of data are you looking for? Describe your ideal dataset..."
                  />
                </div>

                {/* Use case dropdown */}
                <div className="space-y-2">
                  <label
                    htmlFor="use_case"
                    className="block font-mono text-sm text-[var(--accent-primary)]"
                  >
                    $ intended_use_case <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="use_case"
                    {...register('use_case')}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled className="text-[var(--text-muted)]">
                      Select a use case...
                    </option>
                    {USE_CASE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.use_case && (
                    <p className="font-mono text-xs text-red-400">
                      ERROR: {errors.use_case.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ----- Step 3: Review + Submit ----- */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="font-mono text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--accent-primary)]">&gt;</span>{' '}
                  Review your request before submitting...
                </div>

                <div className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] p-4 space-y-3 font-mono text-sm">
                  <ReviewField label="name" value={values.name} />
                  <ReviewField label="email" value={values.email} />
                  {values.company && (
                    <ReviewField label="company" value={values.company} />
                  )}
                  {values.role && (
                    <ReviewField label="role" value={values.role} />
                  )}
                  {values.data_needs && (
                    <ReviewField label="data_needs" value={values.data_needs} />
                  )}
                  <ReviewField label="use_case" value={values.use_case} />
                </div>

                {/* Server-side error */}
                {submitResult && !submitResult.success && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-400">
                    ERROR: {submitResult.message}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < TOTAL_STEPS ? (
          <motion.button
            type="button"
            onClick={handleNext}
            className="btn-primary font-mono flex items-center gap-2 px-6"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 30px rgba(146, 176, 144, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-6"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 30px rgba(146, 176, 144, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                PROCESSING...
              </>
            ) : (
              'Submit Request'
            )}
          </motion.button>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--accent-primary)]">$ {label}:</span>{' '}
      <span className="text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
