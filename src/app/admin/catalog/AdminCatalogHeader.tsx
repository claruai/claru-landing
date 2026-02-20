"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";

/**
 * Admin header bar for the catalog page with breadcrumb navigation,
 * "Create Dataset" button, and logout.
 *
 * Breadcrumb format: claru / admin / catalog
 */
export default function AdminCatalogHeader() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }, [router]);

  return (
    <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-mono font-semibold tracking-tight">
        <Link
          href="/admin/dashboard"
          className="hover:text-[var(--accent-primary)] transition-colors duration-150"
        >
          claru
          <span className="text-[var(--accent-primary)]">/</span>
          admin
        </Link>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="text-[var(--text-secondary)]">catalog</span>
      </h1>

      <div className="flex items-center gap-4">
        <Link
          href="/admin/catalog/new"
          className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 transition-colors duration-150"
        >
          [+ create dataset]
        </Link>
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
