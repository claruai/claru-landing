"use client";

import { useState, useCallback, type FormEvent } from "react";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PasswordGateProps {
  /** The correct password to validate against (from share_settings.gate_value) */
  gateValue: string;
  /** Called after successful password validation */
  onUnlock: () => void;
  /** Optional deck name to display */
  deckName?: string;
}

interface EmailGateProps {
  /** The template ID for creating a share token */
  templateId: string;
  /** The slug for this shared deck */
  slug: string;
  /** Called after successful email submission with the generated token */
  onUnlock: (token: string) => void;
  /** Optional deck name to display */
  deckName?: string;
}

/* ------------------------------------------------------------------ */
/*  PasswordGate                                                       */
/* ------------------------------------------------------------------ */

export function PasswordGate({
  gateValue,
  onUnlock,
  deckName,
}: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!password.trim()) {
        setError("Password is required");
        return;
      }

      if (password === gateValue) {
        onUnlock();
      } else {
        setAttempts((prev) => prev + 1);
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    },
    [password, gateValue, onUnlock],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0908] p-6">
      <div className="w-full max-w-md">
        {/* Terminal-style card */}
        <div className="border border-[rgba(255,255,255,0.08)] rounded-lg bg-[#121110] p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#92B090]/10 border border-[#92B090]/20">
              <Lock className="w-5 h-5 text-[#92B090]" />
            </div>
            <div>
              <h1 className="font-mono text-sm font-semibold text-white">
                Password Required
              </h1>
              {deckName && (
                <p className="font-mono text-xs text-[rgba(255,255,255,0.4)] mt-0.5">
                  {deckName}
                </p>
              )}
            </div>
          </div>

          {/* Terminal prompt */}
          <div className="font-mono text-xs text-[rgba(255,255,255,0.4)] mb-4">
            <span className="text-[#92B090]">$</span> This presentation is
            password protected. Enter the password to continue.
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="gate-password"
                className="block font-mono text-xs text-[rgba(255,255,255,0.4)] mb-1.5"
              >
                password
              </label>
              <input
                id="gate-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter password..."
                autoFocus
                className="w-full px-3 py-2.5 font-mono text-sm text-white bg-[#0a0908] border border-[rgba(255,255,255,0.08)] rounded-md focus:outline-none focus:border-[#92B090]/50 focus:ring-1 focus:ring-[#92B090]/20 placeholder:text-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 font-mono text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Too many attempts warning */}
            {attempts >= 3 && (
              <div className="font-mono text-[10px] text-[rgba(255,255,255,0.3)]">
                Hint: Contact the sender if you don&apos;t have the password.
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 font-mono text-xs text-[#0a0908] bg-[#92B090] rounded-md hover:opacity-90 transition-opacity"
            >
              <Lock className="w-3.5 h-3.5" />
              [unlock]
            </button>
          </form>
        </div>

        {/* Branding */}
        <div className="mt-4 text-center">
          <span className="font-mono text-[10px] text-[rgba(255,255,255,0.2)]">
            Powered by Claru
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EmailGate                                                          */
/* ------------------------------------------------------------------ */

export function EmailGate({
  templateId,
  slug,
  onUnlock,
  deckName,
}: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = useCallback((value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validate
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (!isValidEmail(email.trim())) {
        setError("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);

      try {
        const res = await fetch(`/api/deck/${slug}/gate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim() || undefined,
            template_id: templateId,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Something went wrong. Please try again.");
          return;
        }

        const data = await res.json();
        onUnlock(data.token);
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, name, templateId, slug, onUnlock, isValidEmail],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0908] p-6">
      <div className="w-full max-w-md">
        {/* Terminal-style card */}
        <div className="border border-[rgba(255,255,255,0.08)] rounded-lg bg-[#121110] p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#92B090]/10 border border-[#92B090]/20">
              <Mail className="w-5 h-5 text-[#92B090]" />
            </div>
            <div>
              <h1 className="font-mono text-sm font-semibold text-white">
                Enter Your Email
              </h1>
              {deckName && (
                <p className="font-mono text-xs text-[rgba(255,255,255,0.4)] mt-0.5">
                  {deckName}
                </p>
              )}
            </div>
          </div>

          {/* Terminal prompt */}
          <div className="font-mono text-xs text-[rgba(255,255,255,0.4)] mb-4">
            <span className="text-[#92B090]">$</span> Enter your email to view
            this presentation. Your information helps us provide a personalized
            experience.
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="gate-name"
                className="block font-mono text-xs text-[rgba(255,255,255,0.4)] mb-1.5"
              >
                name{" "}
                <span className="text-[rgba(255,255,255,0.2)]">(optional)</span>
              </label>
              <input
                id="gate-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="w-full px-3 py-2.5 font-mono text-sm text-white bg-[#0a0908] border border-[rgba(255,255,255,0.08)] rounded-md focus:outline-none focus:border-[#92B090]/50 focus:ring-1 focus:ring-[#92B090]/20 placeholder:text-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="gate-email"
                className="block font-mono text-xs text-[rgba(255,255,255,0.4)] mb-1.5"
              >
                email <span className="text-red-400">*</span>
              </label>
              <input
                id="gate-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="you@company.com"
                autoFocus
                className="w-full px-3 py-2.5 font-mono text-sm text-white bg-[#0a0908] border border-[rgba(255,255,255,0.08)] rounded-md focus:outline-none focus:border-[#92B090]/50 focus:ring-1 focus:ring-[#92B090]/20 placeholder:text-[rgba(255,255,255,0.2)] transition-colors"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 font-mono text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Privacy notice */}
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.25)] leading-relaxed">
              By continuing, you agree that your email may be used to provide
              you with relevant follow-up information.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 font-mono text-xs text-[#0a0908] bg-[#92B090] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  [verifying...]
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  [continue]
                </>
              )}
            </button>
          </form>
        </div>

        {/* Branding */}
        <div className="mt-4 text-center">
          <span className="font-mono text-[10px] text-[rgba(255,255,255,0.2)]">
            Powered by Claru
          </span>
        </div>
      </div>
    </div>
  );
}
