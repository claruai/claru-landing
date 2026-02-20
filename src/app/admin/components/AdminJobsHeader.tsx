"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Admin header bar with breadcrumb navigation and logout button.
 *
 * Breadcrumb format: claru / admin / jobs
 * Logout posts to /api/admin/logout then redirects to the login page.
 */
export default function AdminJobsHeader() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }, [router]);

  return (
    <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-mono font-semibold tracking-tight">
        <a href="/admin/dashboard" className="hover:text-[var(--accent-primary)] transition-colors duration-150">
          claru
          <span className="text-[var(--accent-primary)]">/</span>
          admin
        </a>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="text-[var(--text-secondary)]">jobs</span>
      </h1>
      <div className="flex items-center gap-4">
        <a
          href="/admin/settings"
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
        >
          [settings]
        </a>
        <button
          onClick={handleLogout}
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200"
        >
          [logout]
        </button>
      </div>
    </header>
  );
}
