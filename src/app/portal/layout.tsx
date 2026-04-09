import type { Metadata } from "next";
import { PortalNav } from "./PortalNav";
import { PortalThemeProvider } from "./PortalThemeProvider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Portal | Claru",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Portal layout — detects admin status server-side and passes to PortalNav.
 * Fetches pending queue count for the badge without blocking the page render.
 * Auth is enforced by middleware (src/middleware.ts) for portal users.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect admin status from the Supabase session
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminUser = user?.email ? isAdmin(user.email) : false;

  // Fetch pending queue count for the badge (only if admin)
  let pendingCount = 0;
  if (adminUser) {
    try {
      const admin = createSupabaseAdminClient();
      const { count } = await admin
        .from("reply_queue")
        .select("*", { count: "exact", head: true })
        .in("draft_status", ["pending", "needs_manual_draft"]);
      pendingCount = count ?? 0;
    } catch {
      // Non-fatal — badge just shows 0
    }
  }

  return (
    <PortalThemeProvider>
      <div className="portal-theme-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <PortalNav isAdmin={adminUser} pendingCount={pendingCount} />
        <main className="pt-16">{children}</main>
      </div>
    </PortalThemeProvider>
  );
}
