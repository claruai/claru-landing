"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { usePostHog } from "posthog-js/react";
import {
  LogOut,
  FolderOpen,
  Home,
  Sun,
  Moon,
  Inbox,
  GitBranch,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";

function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const portalNavItems = [
  { href: "/portal", label: "Dashboard", icon: Home, exact: true },
  {
    href: "/portal/catalog",
    label: "Catalog",
    icon: FolderOpen,
    exact: false,
  },
];

interface PortalNavProps {
  isAdmin?: boolean;
  pendingCount?: number;
}

export function PortalNav({ isAdmin = false, pendingCount = 0 }: PortalNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const posthog = usePostHog();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Don't render the nav chrome on the login page
  if (pathname === "/portal/login") return null;

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    posthog?.reset();
    router.replace("/portal/login");
  }

  const isNavActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between px-[var(--container-padding)]">
        {/* Logo */}
        <Link
          href="/portal"
          className="text-lg font-mono font-semibold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
        >
          claru<span className="text-[var(--accent-primary)]">/</span>portal
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {/* Portal tabs */}
          {portalNavItems.map((item) => {
            const active = isNavActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono transition-colors duration-200 ${
                  active
                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}

          {/* Admin tabs — only rendered for admins */}
          {isAdmin && (
            <>
              <div className="mx-2 h-5 w-px bg-[var(--border-subtle)]" />

              {/* Queue */}
              <Link
                href="/admin/queue"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono transition-colors duration-200 ${
                  pathname.startsWith("/admin/queue")
                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <Inbox className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Queue</span>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#92B090] px-1 text-[10px] font-bold text-black">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </Link>

              {/* Pipeline */}
              <Link
                href="/admin/pipeline"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono transition-colors duration-200 ${
                  pathname.startsWith("/admin/pipeline")
                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <GitBranch className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Pipeline</span>
              </Link>

              {/* Prospects */}
              <Link
                href="/admin/prospects"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono transition-colors duration-200 ${
                  pathname.startsWith("/admin/prospects")
                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Prospects</span>
              </Link>
            </>
          )}

          {/* Divider */}
          <div className="mx-2 h-5 w-px bg-[var(--border-subtle)]" />

          {/* Theme Toggle */}
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex items-center justify-center p-2 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200"
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

          {/* Divider */}
          <div className="mx-2 h-5 w-px bg-[var(--border-subtle)]" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/5 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
