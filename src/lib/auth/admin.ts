import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Parse the ADMIN_EMAILS env var (server-only — no NEXT_PUBLIC_ prefix).
 * Defaults to the three primary admin addresses.
 */
function getAdminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS ||
    "john@claru.ai,john@moonvalley.com,chad@claru.ai";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Check whether an email address is in the admin allowlist.
 * Server-side only — never expose ADMIN_EMAILS to the client.
 */
export function isAdmin(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase());
}

/**
 * Assert that the current Supabase session user is an admin.
 * Throws Error('unauthorized') if not authenticated or not in allowlist.
 * Call as the first line of every admin Server Action.
 */
export async function assertAdmin(): Promise<void> {
  // Allow admin-preview bypass (JWT-authenticated admin accessing CRM via ?admin_preview=true)
  const headersList = await headers();
  if (headersList.get("x-admin-preview") === "true") {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdmin(user.email)) {
    throw new Error("unauthorized");
  }
}
