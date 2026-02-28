"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Suspense } from "react";

// ---------------------------------------------------------------------------
// Supabase browser client (singleton-ish for this page)
// ---------------------------------------------------------------------------

function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------------------------------------------------------------------------
// Inner component that uses useSearchParams (needs Suspense boundary)
// ---------------------------------------------------------------------------

function PortalLoginForm() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/portal/auth/callback`,
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage("Unable to send sign-in link. Please try again.");
        return;
      }

      // Always show success regardless of whether the email exists in the
      // system. This prevents information leakage about which emails are
      // registered.
      setStatus("success");
    },
    [email]
  );

  // If stale cookies exist (e.g. expired refresh token), clear them
  // silently so Supabase doesn't log AuthApiError to the console.
  // NOTE: We intentionally do NOT redirect to /portal when a valid
  // session is detected client-side. The middleware already handles
  // authenticated users hitting /portal/login. Redirecting here caused
  // a loop when the browser client could refresh tokens but the
  // server-side middleware disagreed about session validity.
  const clearStaleCookies = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user && error) {
      await supabase.auth.signOut();
    }
  }, []);

  // Check on mount
  useState(() => {
    clearStaleCookies();
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-mono font-semibold tracking-tight text-[var(--text-primary)]">
            claru<span className="text-[var(--accent-primary)]">/</span>portal
          </h1>
          <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
            authenticated access required
          </p>
        </div>

        {/* Session expiry banner */}
        {reason === "expired" && (
          <div className="mb-6 px-4 py-3 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 rounded-lg">
            <p className="text-sm font-mono text-[var(--accent-primary)]">
              <span className="opacity-60">notice: </span>
              Your session has expired. Sign in again to continue.
            </p>
          </div>
        )}

        {status === "success" ? (
          /* Success state */
          <div className="text-center space-y-4">
            <div className="px-4 py-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg">
              <div className="text-[var(--accent-primary)] text-3xl mb-3 font-mono">
                {">>>"}
              </div>
              <h2 className="text-lg font-mono font-medium text-[var(--text-primary)] mb-2">
                Check your email
              </h2>
              <p className="text-sm font-mono text-[var(--text-muted)] leading-relaxed">
                We sent a sign-in link to{" "}
                <span className="text-[var(--text-secondary)]">{email}</span>.
                <br />
                Click the link in the email to access your portal.
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              use a different email
            </button>
          </div>
        ) : (
          /* Login form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label
                htmlFor="portal-email"
                className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
              >
                email
              </label>
              <input
                id="portal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                disabled={status === "loading"}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50"
              />
            </div>

            {/* Error message */}
            {status === "error" && errorMessage && (
              <div className="px-4 py-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
                <p className="text-sm font-mono text-[var(--error)]">
                  <span className="opacity-60">error: </span>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm font-medium rounded-lg hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? "sending link..."
                : "sign in with magic link"}
            </button>
          </form>
        )}

        {/* Terminal footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)]">$</span> passwordless
            authentication via email
            <span className="cursor ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page wrapper with Suspense boundary for useSearchParams
// ---------------------------------------------------------------------------

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm font-mono text-[var(--text-muted)]">
            loading...
          </p>
        </div>
      }
    >
      <PortalLoginForm />
    </Suspense>
  );
}
