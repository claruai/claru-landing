import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function mapAnthropicError(err: unknown): NextResponse {
  if (err instanceof Anthropic.APIError) {
    if (err.status === 429) {
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429 }
      );
    }
    if (err.status === 529) {
      return NextResponse.json(
        { error: "overloaded" },
        { status: 503 }
      );
    }
    if (err.status === 401) {
      return NextResponse.json(
        { error: "api_key_error" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: "unknown" }, { status: 500 });
}

/**
 * POST /api/admin/ai-draft
 *
 * Generates an AI draft reply for a queue item using lead + clip catalog context.
 * Writes the draft to reply_queue.draft_response and returns { draft: string }.
 *
 * Body: { leadId: string, queueItemId: string }
 */
export async function POST(request: NextRequest) {
  // Auth: inline JWT check — NOT assertAdmin() (which trusts spoofable headers)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { leadId?: string; queueItemId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { leadId, queueItemId } = body;
  if (!leadId || !queueItemId) {
    return NextResponse.json(
      { error: "leadId and queueItemId are required" },
      { status: 400 }
    );
  }

  const db = createSupabaseAdminClient();

  // Parallel fetch: lead context + queue item + sample clips
  const [leadResult, queueResult, clipsResult] = await Promise.all([
    db
      .from("leads")
      .select("name, email, company, data_needs, use_case")
      .eq("id", leadId)
      .single(),
    db
      .from("reply_queue")
      .select(
        "id, inbox, sender_name, sender_email, subject, body_snippet, classification"
      )
      .eq("id", queueItemId)
      .single(),
    // Pull clips with ai captions via dataset_clips join (ensures catalogued clips only)
    db
      .from("clips")
      .select(
        "id, ai_caption, caption_text, dataset_clips!inner(datasets!inner(type))"
      )
      .not("ai_caption", "is", null)
      .limit(5),
  ]);

  if (leadResult.error || !leadResult.data) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  if (queueResult.error || !queueResult.data) {
    return NextResponse.json(
      { error: "Queue item not found" },
      { status: 404 }
    );
  }

  const lead = leadResult.data;
  const queueItem = queueResult.data;

  // Build clip catalog context snippet (graceful if no clips)
  const clips = (clipsResult.data ?? []) as Array<{
    id: string;
    ai_caption: string | null;
    caption_text: string | null;
  }>;
  const clipContext =
    clips.length > 0
      ? clips
          .map(
            (c, i) =>
              `Clip ${i + 1}: ${c.ai_caption ?? c.caption_text ?? "(no caption)"}`
          )
          .join("\n")
      : "No clip catalog context available.";

  const inboxDisplay =
    queueItem.inbox === "moonvalley" ? "moonvalley.com" : "claru.ai";

  const systemPrompt = `You are John, writing from john@${inboxDisplay} for Claru AI — a field video collection and annotation company that builds physical AI training data (robotics, embodied AI, egocentric video, world models). We spun out of Moonvalley (backed by GC, Khosla, YC).

Write a short, personalized email reply in John's voice. Rules:
- Under 80 words
- No em-dashes (—), no "I'd love to", no "impressive", no filler phrases
- Direct, confident, startup founder tone
- Greet by first name ("Hey [name],")
- Sign off: "John"
- If they asked a specific question, answer it concisely
- If they expressed interest, move toward a concrete next step (call, sample pack, pricing)
- Do not invent facts not in the context below

Lead context:
- Name: ${lead.name ?? "Unknown"}
- Email: ${lead.email}
- Company: ${lead.company ?? "Unknown"}
- Data needs: ${lead.data_needs ?? "Not specified"}
- Use case: ${lead.use_case ?? "Not specified"}

Incoming message:
- Subject: ${queueItem.subject ?? "(no subject)"}
- Classification: ${queueItem.classification}
- Snippet: ${queueItem.body_snippet ?? "(no body)"}

Sample clips from our catalog (for reference if relevant):
${clipContext}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: "Write the reply email body only — no subject line, no metadata.",
        },
      ],
      system: systemPrompt,
    });

    const draft =
      message.content[0]?.type === "text" ? message.content[0].text.trim() : "";

    if (!draft) {
      return NextResponse.json(
        { error: "Empty response from Claude" },
        { status: 500 }
      );
    }

    // Persist draft to reply_queue
    const { error: updateError } = await db
      .from("reply_queue")
      .update({ draft_response: draft })
      .eq("id", queueItemId);

    if (updateError) {
      console.error("[ai-draft] failed to persist draft:", updateError);
      // Return the draft even if DB write fails — client can still use it
    }

    revalidatePath("/admin/pipeline");
    revalidatePath("/admin/queue");

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("[POST /api/admin/ai-draft]", err);
    return mapAnthropicError(err);
  }
}
