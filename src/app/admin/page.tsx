"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin login page with terminal/ASCII aesthetic.
 * Posts credentials to /api/admin/login and redirects on success.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          router.push("/admin/jobs");
        } else {
          const data = await response.json();
          setError(data.error || "Invalid credentials");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router]
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Logout button -- top-right corner */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200"
      >
        [logout]
      </button>

      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-mono font-semibold tracking-tight text-[var(--text-primary)]">
            claru<span className="text-[var(--accent-primary)]">/</span>admin
          </h1>
          <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
            authenticated access required
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              placeholder="team@claru.ai"
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50"
            />
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2"
            >
              password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
              placeholder="********"
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="px-4 py-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
              <p className="text-sm font-mono text-[var(--error)]">
                <span className="opacity-60">error: </span>
                {error}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-sm font-medium rounded-lg hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "authenticating..." : "authenticate"}
          </button>
        </form>

        {/* Terminal footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)]">$</span> session
            expires after 24h
            <span className="cursor ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
}
