/**
 * US-020: Smartlead Sync Agent (hourly)
 *
 * Syncs each active lead's Smartlead campaign name and sequence step
 * into lead_crm_data. Runs every hour as a Remote Task.
 *
 * Auth: SMARTLEAD_API_KEY as ?api_key= query param (Smartlead's auth mechanism)
 * Rate limit: 200ms delay between each API call, abort on HTTP 429
 *
 * See: tasks/agent-schedule.md for schedule configuration
 *
 * IMPORTANT: Before implementing, verify the actual Smartlead API response
 * field name for sequence step by running:
 *   curl "https://server.smartlead.ai/api/v1/campaigns/lead?email=REAL_EMAIL&api_key=KEY"
 * Common field names: seq_number, sequence_number, email_step_seq_number
 */

export const SMARTLEAD_SYNC_AGENT_PROMPT = `
You are the Claru Smartlead sync agent. Your job is to update each active lead's
Smartlead campaign name and sequence step in lead_crm_data.

SMARTLEAD_API_KEY is available in your environment. Append it as ?api_key={key}
to all Smartlead API calls — this is Smartlead's auth mechanism.

STEPS:

1. FETCH ACTIVE LEADS
   Query Supabase (service-role):
   SELECT lcd.lead_id, lcd.smartlead_lead_id, l.email
   FROM lead_crm_data lcd
   JOIN leads l ON lcd.lead_id = l.id
   WHERE lcd.thread_state NOT IN ('cold', 'dead')
     AND lcd.smartlead_lead_id IS NOT NULL

2. FOR EACH LEAD:
   a) Call Smartlead API:
      GET https://server.smartlead.ai/api/v1/campaigns/lead?email={l.email}&api_key={SMARTLEAD_API_KEY}

   b) On HTTP 429 (rate limited):
      Log "Smartlead rate limit hit — aborting remaining leads for this run"
      STOP processing further leads (abort the run, not just skip one)

   c) On other non-2xx error:
      Log "Error syncing {email}: {error}" — SKIP this lead, continue with others

   d) On success:
      Parse response to get campaign name and sequence step.
      IMPORTANT: inspect the actual API response field names before assuming.
      Common field names for sequence step: seq_number, sequence_number,
      email_step_seq_number — use whichever field is actually present in the response.

      UPDATE lead_crm_data SET
        smartlead_campaign_name = [campaign name from response],
        smartlead_sequence_step = [sequence step from response]
      WHERE lead_id = [lead_id]

   e) Wait 200ms before next API call (rate limiting)

3. LOG SUMMARY
   "Smartlead sync complete: {N} leads synced, {M} errors, {K} rate-limited"
`;

export const SMARTLEAD_API_BASE =
  "https://server.smartlead.ai/api/v1";

/**
 * Fetch a lead's Smartlead campaign assignment by email.
 * Auth: ?api_key= query param
 */
export async function fetchSmartleadLead(
  email: string,
  apiKey: string
): Promise<{ campaignName: string | null; sequenceStep: number | null; status: "ok" | "rate_limited" | "error" }> {
  const url = `${SMARTLEAD_API_BASE}/campaigns/lead?email=${encodeURIComponent(email)}&api_key=${apiKey}`;

  try {
    const res = await fetch(url);

    if (res.status === 429) {
      return { campaignName: null, sequenceStep: null, status: "rate_limited" };
    }

    if (!res.ok) {
      return { campaignName: null, sequenceStep: null, status: "error" };
    }

    const data = await res.json();
    // Handle both array and object response shapes
    const entry = Array.isArray(data) ? data[0] : data;

    if (!entry) {
      return { campaignName: null, sequenceStep: null, status: "ok" };
    }

    // Extract campaign name — check common field names
    const campaignName: string | null =
      entry.campaign?.name ??
      entry.campaign_name ??
      null;

    // Extract sequence step — field name must be verified from actual API response
    // Common field names: seq_number, sequence_number, email_step_seq_number
    const sequenceStep: number | null =
      entry.seq_number ??
      entry.sequence_number ??
      entry.email_step_seq_number ??
      null;

    return { campaignName, sequenceStep, status: "ok" };
  } catch {
    return { campaignName: null, sequenceStep: null, status: "error" };
  }
}
