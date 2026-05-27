import type { SupabaseClient } from "@supabase/supabase-js";

export interface LeadRow {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  status: string;
  created_at: string;
}

export interface FindOrCreateLeadResult {
  lead: LeadRow;
  created: boolean;
}

export interface LeadPartial {
  name?: string;
  company?: string;
  /** Free-form attribution string written into admin_notes when a new lead is created. */
  source?: string;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export async function findOrCreateLeadByEmail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  rawEmail: string,
  partial: LeadPartial = {},
): Promise<FindOrCreateLeadResult> {
  const email = normalizeEmail(rawEmail);
  if (!email || !email.includes("@")) {
    throw new Error(`Invalid email: ${rawEmail}`);
  }

  const { data: existing, error: lookupErr } = await supabase
    .from("leads")
    .select("id, email, name, company, status, created_at")
    .eq("email", email)
    .maybeSingle();

  if (lookupErr) {
    throw new Error(`findOrCreateLeadByEmail lookup failed: ${lookupErr.message}`);
  }

  if (existing) {
    return { lead: existing as LeadRow, created: false };
  }

  const source = partial.source ?? "sample-pack";
  const { data: created, error: insertErr } = await supabase
    .from("leads")
    .insert({
      email,
      name: partial.name ?? null,
      company: partial.company ?? null,
      status: "pending",
      admin_notes: `Auto-created by ${source}`,
    })
    .select("id, email, name, company, status, created_at")
    .single();

  if (insertErr || !created) {
    throw new Error(`findOrCreateLeadByEmail insert failed: ${insertErr?.message ?? "unknown"}`);
  }

  return { lead: created as LeadRow, created: true };
}
