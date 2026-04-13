import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
const SMARTLEAD_API_BASE = "https://server.smartlead.ai/api/v1";

export type ActivityEvent = {
  type: "inbound" | "outbound" | "note";
  date: string;
  subject?: string;
  body?: string;
  classification?: string;
  draft_status?: string;
  draft_response?: string;
  step?: number;
  source: "reply_queue" | "smartlead" | "attio";
};

/**
 * GET /api/admin/lead-context/[leadId]
 *
 * Returns a unified activity timeline for a lead:
 * 1. All reply_queue entries (inbound emails, all statuses)
 * 2. Smartlead sequence emails sent (outbound)
 * 3. Attio notes (if ATTIO_API_KEY is configured)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { leadId } = await params;
  const db = createSupabaseAdminClient();

  // Fetch lead info (email + company for external lookups)
  const { data: lead, error: leadErr } = await db
    .from("leads")
    .select("email, company, name, data_needs, use_case")
    .eq("id", leadId)
    .single();

  if (leadErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Also get CRM data for Smartlead campaign ID
  const { data: crm } = await db
    .from("lead_crm_data")
    .select("smartlead_campaign_id, smartlead_lead_id, smartlead_campaign_name, smartlead_sequence_step")
    .eq("lead_id", leadId)
    .single();

  const events: ActivityEvent[] = [];

  // ── 1. All inbound reply_queue items (all statuses) ──────────────────────
  const { data: queueItems } = await db
    .from("reply_queue")
    .select(
      "id, subject, body_full, classification, draft_status, draft_response, received_at, gmail_thread_id"
    )
    .eq("lead_id", leadId)
    .order("received_at", { ascending: false });

  for (const item of queueItems ?? []) {
    events.push({
      type: "inbound",
      date: item.received_at,
      subject: item.subject ?? undefined,
      body: item.body_full ?? undefined,
      classification: item.classification,
      draft_status: item.draft_status,
      draft_response: item.draft_response ?? undefined,
      source: "reply_queue",
    });
  }

  // ── 2. Smartlead outbound sequence emails ────────────────────────────────
  const apiKey = process.env.SMARTLEAD_API_KEY;
  if (apiKey && crm?.smartlead_campaign_id && crm?.smartlead_lead_id) {
    try {
      // Try to get email message history for this lead
      const historyUrl = `${SMARTLEAD_API_BASE}/campaigns/${crm.smartlead_campaign_id}/lead-message-history?offset=0&limit=100&email=${encodeURIComponent(lead.email)}&api_key=${apiKey}`;
      const histRes = await fetch(historyUrl, { next: { revalidate: 60 } });

      if (histRes.ok) {
        const histData = await histRes.json();
        const messages = Array.isArray(histData)
          ? histData
          : (histData?.data ?? histData?.messages ?? []);

        for (const msg of messages) {
          events.push({
            type: "outbound",
            date: msg.sent_time ?? msg.created_at ?? msg.time ?? new Date().toISOString(),
            subject: msg.subject ?? msg.email_subject ?? undefined,
            body: msg.email_body ?? msg.body ?? undefined,
            step: msg.seq_number ?? msg.sequence_number ?? undefined,
            source: "smartlead",
          });
        }
      }
    } catch {
      // Graceful — Smartlead history is best-effort
    }
  } else if (apiKey && crm?.smartlead_campaign_name) {
    // Fallback: show campaign info as a single outbound event if no detailed history
    events.push({
      type: "outbound",
      date: crm ? new Date(Date.now() - 86_400_000 * 7).toISOString() : new Date().toISOString(),
      subject: `Campaign: ${crm.smartlead_campaign_name}`,
      body: crm.smartlead_sequence_step
        ? `Currently at sequence step ${crm.smartlead_sequence_step}`
        : "Sequence in progress",
      step: crm.smartlead_sequence_step ?? undefined,
      source: "smartlead",
    });
  }

  // ── 3. Attio notes (optional) ─────────────────────────────────────────────
  const attioKey = process.env.ATTIO_API_KEY;
  if (attioKey && lead.company) {
    try {
      // Search for the company in Attio
      const searchRes = await fetch(
        `https://api.attio.com/v2/objects/companies/records/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${attioKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: { name: { $str_contains: lead.company } },
            limit: 1,
          }),
          next: { revalidate: 300 },
        }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const record = searchData?.data?.[0];

        if (record?.id?.record_id) {
          const notesRes = await fetch(
            `https://api.attio.com/v2/notes?parent_object=companies&parent_record_id=${record.id.record_id}&limit=10`,
            {
              headers: { Authorization: `Bearer ${attioKey}` },
              next: { revalidate: 300 },
            }
          );

          if (notesRes.ok) {
            const notesData = await notesRes.json();
            for (const note of notesData?.data ?? []) {
              events.push({
                type: "note",
                date: note.created_at ?? new Date().toISOString(),
                body: note.content?.map((b: { text?: string }) => b.text).join("\n") ?? undefined,
                source: "attio",
              });
            }
          }
        }
      }
    } catch {
      // Graceful — Attio is best-effort
    }
  }

  // Sort all events newest first
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({
    events,
    lead: {
      name: lead.name,
      email: lead.email,
      company: lead.company,
      data_needs: lead.data_needs,
      use_case: lead.use_case,
    },
  });
}
