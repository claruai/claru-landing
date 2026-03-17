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
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setStatus("error");
        setErrorMessage("Invalid email or password. Please try again.");
        return;
      }

      // Redirect to portal on success — middleware handles the rest
      window.location.href = "/portal";
    },
    [email, password]
  );

  // If stale cookies exist (e.g. expired refresh token), clear them
  // silently so Supabase doesn't log AuthApiError to the console.
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

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Password field */}
          <div>
            <label
              htmlFor="portal-password"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              password
            </label>
            <input
              id="portal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={status === "loading"}
              placeholder="••••••••"
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
            {status === "loading" ? "signing in..." : "sign in"}
          </button>
        </form>

        {/* Terminal footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)]">$</span> credentials
            provided by your Claru contact
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
