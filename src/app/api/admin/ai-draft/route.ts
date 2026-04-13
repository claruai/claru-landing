import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { readFile } from "fs/promises";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function mapAnthropicError(err: unknown): NextResponse {
  if (err instanceof Anthropic.APIError) {
    if (err.status === 429)
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    if (err.status === 529)
      return NextResponse.json({ error: "overloaded" }, { status: 503 });
    if (err.status === 401)
      return NextResponse.json({ error: "api_key_error" }, { status: 500 });
  }
  return NextResponse.json({ error: "unknown" }, { status: 500 });
}

// ─── Tools the drafting agent can call ───────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: "read_guideline",
    description:
      "Read a copy guideline before drafting. Always call 'voice' (hard rules) and 'strategy' (classification approach) before writing. Call 'company' to check what Claru offers.",
    input_schema: {
      type: "object",
      properties: {
        doc: {
          type: "string",
          enum: ["voice", "company", "strategy"],
          description: "Which guideline doc to read",
        },
      },
      required: ["doc"],
    },
  },
  {
    name: "search_catalog",
    description:
      "Search Claru's video clip catalog for relevant samples. Only call when the lead's use case is specific enough that mentioning concrete data we have would strengthen the reply (e.g. they need kitchen manipulation — search for it).",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "What to search for — e.g. 'kitchen manipulation', 'outdoor traffic', 'egocentric warehouse'",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 5)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_lead_history",
    description:
      "Get prior email thread history for this lead. Call this to see what has already been sent, what was promised, and what tone was established. Avoid repeating anything already covered.",
    input_schema: {
      type: "object",
      properties: {
        lead_id: {
          type: "string",
          description: "The lead's ID",
        },
      },
      required: ["lead_id"],
    },
  },
];

// ─── Tool execution ───────────────────────────────────────────────────────────

const CONTEXT_DIR = join(
  process.cwd(),
  "src/app/api/admin/ai-draft/context"
);

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  db: ReturnType<typeof createSupabaseAdminClient>
): Promise<string> {
  // ── read_guideline ──
  if (name === "read_guideline") {
    const doc = input.doc as string;
    const ALLOWED_DOCS = new Set(["voice", "company", "strategy"]);
    if (!ALLOWED_DOCS.has(doc)) {
      return `(Invalid guideline doc '${doc}' — must be one of: voice, company, strategy)`;
    }
    try {
      return await readFile(join(CONTEXT_DIR, `${doc}.md`), "utf-8");
    } catch {
      return `(Guideline '${doc}' not found — proceeding without it)`;
    }
  }

  // ── search_catalog ──
  if (name === "search_catalog") {
    const query = (input.query as string).trim();
    const limit = Math.min(Number(input.limit ?? 5), 10);

    // Keyword search on ai_caption
    const { data: kw } = await db
      .from("clips")
      .select("ai_caption")
      .not("ai_caption", "is", null)
      .ilike("ai_caption", `%${query}%`)
      .limit(limit);

    if (kw && kw.length > 0) {
      return kw
        .map((c, i) => `Clip ${i + 1}: ${c.ai_caption}`)
        .join("\n");
    }

    // Fallback: any captioned clips
    const { data: fallback } = await db
      .from("clips")
      .select("ai_caption")
      .not("ai_caption", "is", null)
      .limit(limit);

    if (!fallback?.length) return "No clips found in catalog for this query.";
    return (
      `(No exact match for "${query}" — sample clips from catalog)\n` +
      fallback.map((c, i) => `Clip ${i + 1}: ${c.ai_caption}`).join("\n")
    );
  }

  // ── get_lead_history ──
  if (name === "get_lead_history") {
    const leadId = input.lead_id as string;
    const { data } = await db
      .from("reply_queue")
      .select(
        "subject, body_snippet, classification, received_at, draft_response, approved_at, sent_at"
      )
      .eq("lead_id", leadId)
      .order("received_at", { ascending: true });

    if (!data?.length) return "No prior email history for this lead.";

    return data
      .map(
        (item, i) =>
          `Email ${i + 1} (${new Date(item.received_at).toLocaleDateString()}):
Subject: ${item.subject ?? "(no subject)"}
Classification: ${item.classification}
Snippet: ${item.body_snippet ?? "(empty)"}
${item.draft_response ? `Draft/sent: ${item.draft_response.slice(0, 300)}` : "No draft sent"}
Status: ${item.approved_at || item.sent_at ? "Actioned" : "Pending"}`
      )
      .join("\n\n---\n\n");
  }

  return "(Unknown tool)";
}

// ─── Main handler ─────────────────────────────────────────────────────────────

/**
 * POST /api/admin/ai-draft
 *
 * Runs an agentic drafting loop: the agent reads guidelines, searches the clip
 * catalog, and pulls lead history via tools before writing the reply.
 *
 * Body: { leadId: string, queueItemId: string }
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    leadId?: string;
    queueItemId?: string;
    previousDraft?: string;
    feedback?: string;
  };
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

  const [leadResult, queueResult] = await Promise.all([
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
  ]);

  if (leadResult.error || !leadResult.data) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  if (queueResult.error || !queueResult.data) {
    return NextResponse.json({ error: "Queue item not found" }, { status: 404 });
  }

  const lead = leadResult.data;
  const queueItem = queueResult.data;
  const inboxDisplay =
    queueItem.inbox === "moonvalley" ? "moonvalley.com" : "claru.ai";

  // Minimal system prompt — agent gathers the rest via tools
  const systemPrompt = `You are John Thomas, founder of Claru AI, writing from john@${inboxDisplay}.

Your job: draft a reply to the email below.

Before drafting, use your tools to gather context:
1. read_guideline("voice") — hard rules you must not violate
2. read_guideline("strategy") — how to handle this classification
3. get_lead_history({"lead_id": "${leadId}"}) — see what has already been said
4. If their use case is specific enough, search_catalog() for relevant data we have

Lead context:
Name: ${lead.name ?? "Unknown"}
Company: ${lead.company ?? "Unknown"}
Email: ${lead.email}
Data needs: ${lead.data_needs ?? "not specified"}
Use case: ${lead.use_case ?? "not specified"}

Incoming email:
Subject: ${queueItem.subject ?? "(no subject)"}
Classification: ${queueItem.classification}
Snippet: ${queueItem.body_snippet ?? "(no body)"}

After reading guidelines and context, output the email body only — no subject line, no metadata, no preamble.`;

  try {
    const isRefinement = !!(body.previousDraft && body.feedback);
    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: isRefinement
          ? `Previous draft:\n---\n${body.previousDraft}\n---\n\nThe user wants: ${body.feedback}\n\nRevise the draft accordingly. Apply the same voice and strategy guidelines.`
          : "Draft the reply email.",
      },
    ];

    let draft = "";
    const MAX_TURNS = 8;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        tools: TOOLS,
        messages,
      });

      if (response.stop_reason === "end_turn") {
        const textBlock = response.content.find((b) => b.type === "text");
        draft = textBlock?.type === "text" ? textBlock.text.trim() : "";
        break;
      }

      if (response.stop_reason === "tool_use") {
        // Execute all tool calls in this turn in parallel
        const toolUseBlocks = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
        );

        const toolResults = await Promise.all(
          toolUseBlocks.map(async (block) => {
            const result = await executeTool(
              block.name,
              block.input as Record<string, unknown>,
              db
            );
            return {
              type: "tool_result" as const,
              tool_use_id: block.id,
              content: result,
            };
          })
        );

        messages.push({ role: "assistant", content: response.content });
        messages.push({ role: "user", content: toolResults });
      } else {
        // Unexpected stop reason — bail
        break;
      }
    }

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
    }

    revalidatePath("/admin/pipeline");
    revalidatePath("/admin/queue");

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("[POST /api/admin/ai-draft]", err);
    return mapAnthropicError(err);
  }
}
