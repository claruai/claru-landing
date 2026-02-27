"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut, FolderOpen, MessageSquarePlus } from "lucide-react";

function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const navItems = [
  { href: "/portal/catalog", label: "Catalog", icon: FolderOpen },
  { href: "/portal/request", label: "Request", icon: MessageSquarePlus },
];

export function PortalNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/portal/login";

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/portal/login");
  }

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
          {!isLoginPage && navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}

          {!isLoginPage && (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
