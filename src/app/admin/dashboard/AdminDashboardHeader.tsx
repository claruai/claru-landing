"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function AdminDashboardHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }, [router]);

  return (
    <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-[var(--accent-primary)]">
            claru
          </span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="font-mono text-sm text-[var(--text-secondary)]">
            admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
            aria-label={
              mounted && resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {!mounted ? (
              <div className="h-4 w-4" />
            ) : resolvedTheme === "dark" ? (
              <Moon className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Sun className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200"
          >
            [logout]
          </button>
        </div>
      </div>
    </div>
  );
}
