import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { ProspectList } from "./ProspectList";

export const dynamic = "force-dynamic";

export type ProspectSignal = {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  signal_type: string;
  signal_description: string;
  source_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export default async function ProspectsPage() {
  // Auth check
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdmin(user.email)) {
    notFound();
  }

  const db = createSupabaseAdminClient();

  // Fetch new and queued signals (not skipped)
  const { data: signals } = await db
    .from("prospect_signals")
    .select("*")
    .in("status", ["new", "queued"])
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
          Prospects
        </h1>
        <p className="mt-1 text-sm font-mono text-[var(--text-tertiary)]">
          Signals from the daily scanner — review and queue to Smartlead
        </p>
      </div>

      <ProspectList signals={(signals as ProspectSignal[]) ?? []} />
    </div>
  );
}
