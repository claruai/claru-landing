"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SMARTLEAD_API_BASE } from "@/lib/agent/smartlead-sync";

export async function skipSignal(signalId: string): Promise<void> {
  await assertAdmin();

  const db = createSupabaseAdminClient();
  await db
    .from("prospect_signals")
    .update({ status: "skipped" })
    .eq("id", signalId);

  revalidatePath("/admin/prospects");
}

/**
 * Queue a prospect signal into Smartlead and mark it queued.
 *
 * Uses DO UPDATE (not DO NOTHING) on the leads INSERT so we always
 * get the lead_id back — whether the row was just inserted or already existed.
 */
export async function queueInSmartlead(
  signalId: string,
  campaignId: number
): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();

  const db = createSupabaseAdminClient();

  // 1. Fetch signal
  const { data: signal, error: signalErr } = await db
    .from("prospect_signals")
    .select("*")
    .eq("id", signalId)
    .single();

  if (signalErr || !signal) {
    return { ok: false, error: "Signal not found" };
  }

  if (!signal.contact_email) {
    return { ok: false, error: "No contact email on this signal" };
  }

  const apiKey = process.env.SMARTLEAD_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "SMARTLEAD_API_KEY not configured" };
  }

  // 2. Upsert lead in leads table
  //    DO UPDATE SET email=EXCLUDED.email RETURNING id — always returns the row
  const { data: leadRows, error: leadErr } = await db
    .from("leads")
    .upsert(
      {
        email: signal.contact_email,
        name: signal.contact_name,
        company: signal.company_name,
      },
      { onConflict: "email" }
    )
    .select("id");

  if (leadErr || !leadRows?.length) {
    return { ok: false, error: "Failed to upsert lead record" };
  }

  const leadId = leadRows[0].id as string;

  // 3. Add lead to Smartlead campaign
  const smartleadRes = await fetch(
    `${SMARTLEAD_API_BASE}/campaigns/${campaignId}/leads?api_key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_list: [
          {
            email: signal.contact_email,
            first_name: signal.contact_name?.split(" ")[0] ?? "",
            last_name: signal.contact_name?.split(" ").slice(1).join(" ") ?? "",
            company_name: signal.company_name,
          },
        ],
      }),
    }
  );

  if (!smartleadRes.ok) {
    const errBody = await smartleadRes.text().catch(() => "");
    return {
      ok: false,
      error: `Smartlead API error ${smartleadRes.status}: ${errBody.slice(0, 200)}`,
    };
  }

  // 4. Mark signal as queued
  await db
    .from("prospect_signals")
    .update({ status: "queued" })
    .eq("id", signalId);

  revalidatePath("/admin/prospects");
  return { ok: true };
}
