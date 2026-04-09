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
  await db
    .from("lead_crm_data")
    .update({
      thread_state: threadState,
      last_touch_at: new Date().toISOString(),
    })
    .eq("lead_id", leadId);

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
  await db
    .from("lead_crm_data")
    .update({ waiting_on: waitingOn })
    .eq("lead_id", leadId);

  revalidatePath("/admin/pipeline");
}
