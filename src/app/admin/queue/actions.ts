"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function revalidateBoth() {
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/queue");
}

export async function approveItem(id: string): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  // Fetch the queue item to get lead_id — throw if missing
  const { data: item, error: fetchError } = await db
    .from("reply_queue")
    .select("lead_id")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!item) throw new Error("Queue item not found");

  // Approve the queue item
  const { error: approveError } = await db
    .from("reply_queue")
    .update({ draft_status: "approved", approved_at: new Date().toISOString() })
    .eq("id", id);

  if (approveError) throw new Error(approveError.message);

  // Update CRM data for the linked lead — moves lead to "Waiting on Them"
  if (item.lead_id) {
    const { error: crmError } = await db
      .from("lead_crm_data")
      .update({
        waiting_on: "them",
        last_touch_at: new Date().toISOString(),
      })
      .eq("lead_id", item.lead_id);

    if (crmError) throw new Error(crmError.message);
  }

  revalidateBoth();
}

export async function dismissItem(id: string): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  const { error } = await db
    .from("reply_queue")
    .update({ draft_status: "dismissed" })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateBoth();
}

export async function snoozeItem(id: string, until: Date): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  const { error } = await db
    .from("reply_queue")
    .update({
      draft_status: "snoozed",
      snoozed_until: until.toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateBoth();
}

export async function updateDraft(
  id: string,
  newDraft: string
): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  const { error } = await db
    .from("reply_queue")
    .update({ draft_response: newDraft })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateBoth();
}
