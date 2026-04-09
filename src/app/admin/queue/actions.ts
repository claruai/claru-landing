"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function approveItem(id: string): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  // Fetch the queue item to get lead_id
  const { data: item } = await db
    .from("reply_queue")
    .select("lead_id")
    .eq("id", id)
    .single();

  // Approve the queue item
  await db
    .from("reply_queue")
    .update({ draft_status: "approved", approved_at: new Date().toISOString() })
    .eq("id", id);

  // Update CRM data for the linked lead (if matched)
  if (item?.lead_id) {
    await db
      .from("lead_crm_data")
      .update({
        waiting_on: "them",
        last_touch_at: new Date().toISOString(),
      })
      .eq("lead_id", item.lead_id);
  }

  revalidatePath("/admin/queue");
}

export async function dismissItem(id: string): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  await db
    .from("reply_queue")
    .update({ draft_status: "dismissed" })
    .eq("id", id);

  revalidatePath("/admin/queue");
}

export async function snoozeItem(id: string, until: Date): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  await db
    .from("reply_queue")
    .update({
      draft_status: "snoozed",
      snoozed_until: until.toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/queue");
}

export async function updateDraft(
  id: string,
  newDraft: string
): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();

  await db
    .from("reply_queue")
    .update({ draft_response: newDraft })
    .eq("id", id);

  revalidatePath("/admin/queue");
}
