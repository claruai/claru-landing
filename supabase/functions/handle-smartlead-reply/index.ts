import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VALID_CLASSIFICATIONS = [
  "interested",
  "question",
  "objection",
  "ooo",
  "unsubscribe",
  "referral",
  "not_interested",
] as const;

type Classification = (typeof VALID_CLASSIFICATIONS)[number];

const CLASSIFICATION_PROMPT = `You are an email reply classifier for a B2B sales pipeline.
Classify the reply into exactly ONE of these categories:
- interested: wants to learn more, asks for samples, shares requirements
- question: asks about pricing, methodology, capabilities, timelines
- objection: pushes back on fit, timing, or relevance
- ooo: out of office / auto-reply
- unsubscribe: asks to be removed, not interested ever
- referral: forwards to someone else or suggests another contact
- not_interested: polite decline, not right now, no need

Respond with ONLY a JSON object: {"classification": "<category>", "confidence": <0.0-1.0>}
Do NOT generate any reply content. Classify and return JSON only.`;

async function classifyReply(
  replyBody: string,
  apiKey: string,
): Promise<{ classification: Classification; confidence: number }> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `${CLASSIFICATION_PROMPT}\n\nReply to classify:\n${replyBody.slice(0, 1000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text ?? "";
  const parsed = JSON.parse(text);

  if (!VALID_CLASSIFICATIONS.includes(parsed.classification)) {
    return { classification: "question", confidence: 0.5 };
  }

  return {
    classification: parsed.classification,
    confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.5)),
  };
}

async function createAttioNote(
  recordId: string,
  classification: string,
  replySnippet: string,
  apiKey: string,
): Promise<boolean> {
  const noteContent = `[${classification.toUpperCase()}] reply: ${replySnippet.slice(0, 200)}`;

  const response = await fetch(
    `https://api.attio.com/v2/notes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          parent_object: "people",
          parent_record_id: recordId,
          title: `Smartlead Reply — ${classification}`,
          format: "plaintext",
          content: noteContent,
        },
      }),
    },
  );

  return response.ok;
}

async function sendSlackNotification(
  webhookUrl: string,
  leadEmail: string,
  campaignId: string,
  classification: string,
  replySnippet: string,
): Promise<boolean> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `📬 *New ${classification} reply* from ${leadEmail}\nCampaign: ${campaignId}\n>${replySnippet.slice(0, 200)}`,
    }),
  });

  return response.ok;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const attioKey = Deno.env.get("ATTIO_API_KEY");
  const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");

  if (!anthropicKey) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messageId = String(payload.message_id ?? payload.smartlead_message_id ?? "");
  const campaignId = String(payload.campaign_id ?? "");
  const leadEmail = String(payload.lead_email ?? payload.to_email ?? "");
  const replyBody = String(payload.reply_body ?? payload.email_body ?? payload.body ?? "");

  if (!messageId || !campaignId || !leadEmail) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: message_id, campaign_id, lead_email" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Step 1: Idempotent upsert into reply_events
  const { error: upsertError } = await supabase
    .from("reply_events")
    .upsert(
      {
        smartlead_message_id: messageId,
        campaign_id: campaignId,
        lead_email: leadEmail,
        reply_body: replyBody,
        created_at: new Date().toISOString(),
      },
      { onConflict: "smartlead_message_id" },
    );

  if (upsertError) {
    console.error("Upsert error:", upsertError.message);
    return new Response(
      JSON.stringify({ error: "Failed to persist reply event" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Step 2: Classify
  let classification: Classification = "question";
  let confidence = 0.5;
  try {
    const result = await classifyReply(replyBody, anthropicKey);
    classification = result.classification;
    confidence = result.confidence;
  } catch (err) {
    console.error("Classification error:", err);
  }

  // Step 3: Update reply_events with classification
  await supabase
    .from("reply_events")
    .update({
      classification,
      confidence,
      processed_at: new Date().toISOString(),
    })
    .eq("smartlead_message_id", messageId);

  // Look up attio_record_id from campaign_leads if not in payload
  let attioRecordId = String(payload.attio_record_id ?? "");
  if (!attioRecordId) {
    const { data: leadRow } = await supabase
      .from("campaign_leads")
      .select("attio_record_id")
      .eq("lead_email", leadEmail)
      .not("attio_record_id", "is", null)
      .limit(1)
      .single();

    if (leadRow?.attio_record_id) {
      attioRecordId = leadRow.attio_record_id;
    }
  }

  // Step 4: Attio note
  let attioSynced = false;
  if (attioRecordId && attioKey) {
    try {
      attioSynced = await createAttioNote(
        attioRecordId,
        classification,
        replyBody,
        attioKey,
      );
    } catch (err) {
      console.error("Attio sync error:", err);
    }
  }

  // Step 5: Slack notification for interested or question
  let slackNotified = false;
  if (slackWebhookUrl && (classification === "interested" || classification === "question")) {
    try {
      slackNotified = await sendSlackNotification(
        slackWebhookUrl,
        leadEmail,
        campaignId,
        classification,
        replyBody,
      );
    } catch (err) {
      console.error("Slack notification error:", err);
    }
  }

  // Step 6: Update sync flags
  await supabase
    .from("reply_events")
    .update({
      attio_record_id: attioRecordId || null,
      attio_synced: attioSynced,
      slack_notified: slackNotified,
    })
    .eq("smartlead_message_id", messageId);

  return new Response(
    JSON.stringify({
      status: "ok",
      message_id: messageId,
      classification,
      confidence,
      attio_synced: attioSynced,
      slack_notified: slackNotified,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});
