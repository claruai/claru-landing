"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const VALID_THREAD_STATES = [
  "cold",
  "warm",
  "hot",
  "negotiating",
  "closed",
  "dead",
] as const;

const VALID_WAITING_ON = ["us", "them", "unknown"] as const;

export async function updateThreadState(
  leadId: string,
  threadState: string
): Promise<void> {
  await assertAdmin();

  if (!VALID_THREAD_STATES.includes(threadState as never)) {
    throw new Error(`Invalid thread_state: ${threadState}`);
  }

  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("lead_crm_data")
    .update({
      thread_state: threadState,
      last_touch_at: new Date().toISOString(),
    })
    .eq("lead_id", leadId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/pipeline");
}

/**
 * Move a lead to a Kanban column — sets both thread_state and waiting_on atomically.
 */
export async function moveLeadToColumn(
  leadId: string,
  column: "respond" | "their-court" | "nurturing" | "cold"
): Promise<void> {
  await assertAdmin();

  const db = createSupabaseAdminClient();

  const updates: Record<string, string> = {};
  if (column === "respond") {
    updates.waiting_on = "us";
    // Promote cold/dead to warm so they show up as active
    updates.thread_state_if_cold = "warm"; // handled below
  } else if (column === "their-court") {
    updates.waiting_on = "them";
  } else if (column === "nurturing") {
    updates.waiting_on = "unknown";
    updates.thread_state = "warm";
  } else if (column === "cold") {
    updates.waiting_on = "unknown";
    updates.thread_state = "cold";
  }

  // Build the actual DB update (handle respond column's conditional thread_state)
  if (column === "respond") {
    // First check current thread_state
    const { data, error: fetchError } = await db
      .from("lead_crm_data")
      .select("thread_state")
      .eq("lead_id", leadId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const isInactive = data?.thread_state === "cold" || data?.thread_state === "dead";
    const { error: updateError } = await db
      .from("lead_crm_data")
      .update({
        waiting_on: "us",
        ...(isInactive ? { thread_state: "warm" } : {}),
        last_touch_at: new Date().toISOString(),
      })
      .eq("lead_id", leadId);

    if (updateError) throw new Error(updateError.message);
  } else {
    const dbUpdate: Record<string, string> = { waiting_on: updates.waiting_on };
    if (updates.thread_state) dbUpdate.thread_state = updates.thread_state;
    const { error } = await db.from("lead_crm_data").update(dbUpdate).eq("lead_id", leadId);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/queue");
}

const VALID_DEAL_STAGES = [
  "outreach",
  "engaged",
  "qualified",
  "sample_pack",
  "proposal",
  "nda",
  "contract",
  "closed",
] as const;

const VALID_SAMPLE_PACK_STATUSES = [
  "none",
  "requested",
  "preparing",
  "sent",
] as const;

export async function updateDealStage(
  leadId: string,
  stage: string
): Promise<void> {
  await assertAdmin();
  if (!VALID_DEAL_STAGES.includes(stage as never)) {
    throw new Error(`Invalid deal_stage: ${stage}`);
  }
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("lead_crm_data")
    .update({ deal_stage: stage })
    .eq("lead_id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pipeline");
}

export async function updateSamplePackStatus(
  leadId: string,
  status: string,
  clipIds?: string[]
): Promise<void> {
  await assertAdmin();
  if (!VALID_SAMPLE_PACK_STATUSES.includes(status as never)) {
    throw new Error(`Invalid sample_pack_status: ${status}`);
  }
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("lead_crm_data")
    .update({
      sample_pack_status: status,
      ...(clipIds !== undefined ? { sample_pack_clips: clipIds } : {}),
    })
    .eq("lead_id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pipeline");
}

export async function setFollowUpDate(
  leadId: string,
  date: Date | null
): Promise<void> {
  await assertAdmin();
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("lead_crm_data")
    .update({ follow_up_at: date?.toISOString() ?? null })
    .eq("lead_id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pipeline");
}

export async function updateWaitingOn(
  leadId: string,
  waitingOn: string
): Promise<void> {
  await assertAdmin();

  if (!VALID_WAITING_ON.includes(waitingOn as never)) {
    throw new Error(`Invalid waiting_on: ${waitingOn}`);
  }

  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("lead_crm_data")
    .update({ waiting_on: waitingOn })
    .eq("lead_id", leadId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/pipeline");
}
