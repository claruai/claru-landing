// =============================================================================
// Agent Executors — callDesignAgent, callResearchAgent, callQAAgent
// US-005, US-006, US-007: Specialist agent callers (non-streaming)
// =============================================================================

import type { SupabaseClient } from "@supabase/supabase-js";
import type { SlideData } from "@/types/deck-builder";
import { getAnthropicClient } from "../ai-agent";
import { webSearch } from "../web-search";
import { getDesignAgentPrompt } from "./design-prompt";
import { getResearchAgentPrompt } from "./research-prompt";
import { getQAAgentPrompt } from "./qa-prompt";
import type { DesignBrief, QAVerdict } from "./types";

// ---------------------------------------------------------------------------
// US-005: Design Agent Caller
// ---------------------------------------------------------------------------

/**
 * Calls the Design Agent to produce custom HTML for a slide.
 * Uses Opus for complex briefs, Sonnet for simple ones.
 * Fresh call every time -- no conversation history.
 */
export async function callDesignAgent(
  brief: DesignBrief,
  slides: SlideData[],
): Promise<{ html: string; selfNote: string }> {
  try {
    const anthropic = getAnthropicClient();
    const model =
      brief.complexity === "complex"
        ? "claude-opus-4-6"
        : "claude-sonnet-4-20250514";

    const userMessage =
      brief.instruction +
      "\n\nCurrent slide data:\n" +
      JSON.stringify(slides[brief.slideIndex]);

    const response = await anthropic.messages.create({
      model,
      max_tokens: 8192,
      system: getDesignAgentPrompt(brief),
      messages: [{ role: "user", content: userMessage }],
    });

    // Extract text from response
    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    // Parse HTML -- strip markdown code fences if Claude wraps it
    const html = stripCodeFences(rawText);

    // selfNote is the first line of non-HTML text, or empty
    const selfNote = extractSelfNote(rawText, html);

    return { html, selfNote };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "unknown error";
    console.error("[callDesignAgent] Failed:", errorMsg);
    return { html: "", selfNote: `Design agent failed: ${errorMsg}` };
  }
}

// ---------------------------------------------------------------------------
// US-006: Research Agent Caller
// ---------------------------------------------------------------------------

/**
 * Calls the Research Agent with web_search and get_data_catalog tools.
 * Implements multi-turn tool loop (non-streaming).
 * Uses Haiku for speed and cost efficiency.
 */
export async function callResearchAgent(
  question: string,
  maxWords: number = 200,
  supabase?: SupabaseClient,
): Promise<string> {
  try {
    const anthropic = getAnthropicClient();
    const model = "claude-haiku-4-5-20251001";
    const system = getResearchAgentPrompt(question, maxWords);

    // Define tools for the Research Agent
    const tools = [
      {
        name: "web_search" as const,
        description:
          "Search the web for current information about companies, industries, technologies, or any topic. Returns titles, URLs, and content snippets.",
        input_schema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description: "Search query string.",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_data_catalog" as const,
        description:
          "Get the list of published datasets in Claru's data catalog. Returns names, descriptions, types, sample counts, geographic coverage, and annotation types.",
        input_schema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "get_lead_info" as const,
        description:
          "Look up a lead by name, email, or company. Returns their profile, data needs, use case, status, and which datasets they have access to. Use this when building a deck for a specific prospect.",
        input_schema: {
          type: "object" as const,
          properties: {
            search: {
              type: "string",
              description: "Name, email, or company to search for.",
            },
          },
          required: ["search"],
        },
      },
      {
        name: "get_dataset_samples" as const,
        description:
          "Get actual sample files (videos, images) from a specific dataset in Claru's catalog. Returns media URLs (S3/CloudFront) that can be embedded directly in slides with <video> or <img> tags. Search by dataset name or type.",
        input_schema: {
          type: "object" as const,
          properties: {
            dataset_name: {
              type: "string",
              description: "Name or partial name of the dataset to get samples from (e.g. 'Egocentric', 'Video Quality').",
            },
            limit: {
              type: "number",
              description: "Max samples to return. Default 5.",
            },
          },
          required: ["dataset_name"],
        },
      },
      {
        name: "get_case_studies" as const,
        description:
          "Get Claru's case studies — real project examples with metrics, methodology, and results. Use for finding proof points and real data to include in slides.",
        input_schema: {
          type: "object" as const,
          properties: {
            search: {
              type: "string",
              description: "Optional keyword to filter (e.g. 'video', 'safety', 'robotics'). Leave empty for all.",
            },
          },
        },
      },
    ];

    // Multi-turn tool loop
    type MessageRole = "user" | "assistant";
    interface MessageParam {
      role: MessageRole;
      content: string | ContentBlock[];
    }
    interface TextBlock {
      type: "text";
      text: string;
    }
    interface ToolUseBlock {
      type: "tool_use";
      id: string;
      name: string;
      input: Record<string, unknown>;
    }
    interface ToolResultBlock {
      type: "tool_result";
      tool_use_id: string;
      content: string;
    }
    type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

    const messages: MessageParam[] = [
      { role: "user", content: question },
    ];

    let finalText = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 2048,
        system,
        messages: messages as Parameters<typeof anthropic.messages.create>[0]["messages"],
        tools,
      });

      // Collect text content from this response
      const textParts: string[] = [];
      for (const block of response.content) {
        if (block.type === "text") {
          textParts.push(block.text);
        }
      }
      finalText = textParts.join("");

      // If end_turn, we're done
      if (response.stop_reason === "end_turn") {
        break;
      }

      // If tool_use, execute the tools and send results back
      if (response.stop_reason === "tool_use") {
        // Append assistant message with all content blocks
        messages.push({
          role: "assistant",
          content: response.content as unknown as ContentBlock[],
        });

        // Find and execute tool_use blocks
        const toolResultBlocks: ToolResultBlock[] = [];

        for (const block of response.content) {
          if (block.type === "tool_use") {
            let toolResultContent: string;

            if (block.name === "web_search") {
              const query = (block.input as { query: string }).query;
              const searchResults = await webSearch(query);

              if (searchResults.error) {
                toolResultContent = `Search error: ${searchResults.error}`;
              } else if (searchResults.results.length === 0) {
                toolResultContent = `No results found for "${query}".`;
              } else {
                toolResultContent = searchResults.results
                  .map(
                    (r, i) =>
                      `${i + 1}. ${r.title}\n   ${r.url}\n   ${r.content}`,
                  )
                  .join("\n\n");
              }
            } else if (block.name === "get_data_catalog") {
              if (supabase) {
                const { data: datasets } = await supabase
                  .from("datasets")
                  .select(
                    "name, description, type, subcategory, tags, total_samples, total_duration_hours, geographic_coverage, annotation_types, is_published",
                  )
                  .eq("is_published", true)
                  .order("name");

                if (datasets && datasets.length > 0) {
                  toolResultContent = datasets
                    .map(
                      (d: Record<string, unknown>) =>
                        `${d.name} (${d.type}): ${d.description} | Samples: ${d.total_samples} | Duration: ${d.total_duration_hours}h | Coverage: ${d.geographic_coverage}`,
                    )
                    .join("\n");
                } else {
                  toolResultContent =
                    "No published datasets found in the catalog.";
                }
              } else {
                toolResultContent =
                  "Data catalog not available (no database connection).";
              }
            } else if (block.name === "get_lead_info") {
              if (supabase) {
                const search = (block.input as { search: string }).search;
                const { data: leads } = await supabase
                  .from("leads")
                  .select("id, name, email, company, role, data_needs, use_case, status, admin_notes, created_at")
                  .or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
                  .limit(5);

                if (leads && leads.length > 0) {
                  const results = [];
                  for (const lead of leads) {
                    // Also fetch their dataset access
                    const { data: access } = await supabase
                      .from("lead_dataset_access")
                      .select("dataset_id, granted_at, datasets(name, type)")
                      .eq("lead_id", lead.id);

                    const datasets = (access ?? []).map((a: Record<string, unknown>) => {
                      const ds = a.datasets as Record<string, unknown> | null;
                      return ds ? `${ds.name} (${ds.type})` : "unknown";
                    });

                    results.push(
                      `**${lead.name}** (${lead.email})\n  Company: ${lead.company} | Role: ${lead.role} | Status: ${lead.status}\n  Data needs: ${lead.data_needs || "not specified"}\n  Use case: ${lead.use_case || "not specified"}\n  Admin notes: ${lead.admin_notes || "none"}\n  Datasets granted: ${datasets.length > 0 ? datasets.join(", ") : "none"}\n  Created: ${lead.created_at}`
                    );
                  }
                  toolResultContent = `Found ${leads.length} lead(s) matching "${search}":\n\n${results.join("\n\n")}`;
                } else {
                  toolResultContent = `No leads found matching "${search}".`;
                }
              } else {
                toolResultContent = "Lead lookup not available (no database connection).";
              }
            } else if (block.name === "get_dataset_samples") {
              if (supabase) {
                const datasetName = (block.input as { dataset_name: string }).dataset_name;
                const limit = (block.input as { limit?: number }).limit ?? 5;

                // Find the dataset first
                const { data: datasets } = await supabase
                  .from("datasets")
                  .select("id, name, type")
                  .ilike("name", `%${datasetName}%`)
                  .limit(3);

                if (datasets && datasets.length > 0) {
                  const results = [];
                  for (const ds of datasets) {
                    const { data: samples } = await supabase
                      .from("dataset_samples")
                      .select("id, filename, media_url, s3_object_key, mime_type, duration_seconds, resolution_width, resolution_height")
                      .eq("dataset_id", ds.id)
                      .limit(limit);

                    if (samples && samples.length > 0) {
                      // Build proxy URLs for S3 media (never expire — proxy signs at request time)
                      const sampleList = samples.map((s: Record<string, unknown>) => {
                        let url: string;
                        if (s.s3_object_key) {
                          url = `/api/media/s3?key=${encodeURIComponent(s.s3_object_key as string)}`;
                        } else if (s.media_url) {
                          url = s.media_url as string;
                        } else {
                          url = "no URL available";
                        }
                        const isVideo = (s.mime_type as string)?.startsWith("video/");
                        const meta = [
                          s.mime_type,
                          s.duration_seconds ? `${s.duration_seconds}s` : null,
                          s.resolution_width ? `${s.resolution_width}x${s.resolution_height}` : null,
                        ].filter(Boolean).join(", ");
                        const embedHint = isVideo
                          ? `Embed: <video src="${url}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video>`
                          : `Embed: <img src="${url}" style="width:100%;height:100%;object-fit:cover" />`;
                        return `  - ${s.filename}: ${url} (${meta})\n    ${embedHint}`;
                      });
                      results.push(`**${ds.name}** (${ds.type}) — ${samples.length} samples:\n${sampleList.join("\n")}`);
                    } else {
                      results.push(`**${ds.name}** — no samples uploaded yet`);
                    }
                  }
                  toolResultContent = results.join("\n\n");
                } else {
                  toolResultContent = `No datasets found matching "${datasetName}".`;
                }
              } else {
                toolResultContent = "Dataset samples not available (no database connection).";
              }
            } else if (block.name === "get_case_studies") {
              // Load case study data from the JSON files
              try {
                const fs = await import("fs");
                const path = await import("path");
                const csDir = path.join(process.cwd(), "src/data/case-studies");
                if (fs.existsSync(csDir)) {
                  const files = fs.readdirSync(csDir).filter((f: string) => f.endsWith(".json"));
                  const search = ((block.input as { search?: string }).search ?? "").toLowerCase();
                  const studies = [];

                  for (const file of files) {
                    const content = JSON.parse(fs.readFileSync(path.join(csDir, file), "utf-8"));
                    const text = JSON.stringify(content).toLowerCase();
                    if (!search || text.includes(search)) {
                      const cs = Array.isArray(content) ? content[0] : content;
                      studies.push(
                        `**${cs.title ?? cs.name ?? file}**\n  ${cs.description ?? cs.summary ?? "No description"}\n  ${cs.metrics ? "Metrics: " + JSON.stringify(cs.metrics) : ""}`
                      );
                    }
                  }
                  toolResultContent = studies.length > 0
                    ? `Found ${studies.length} case study/studies:\n\n${studies.join("\n\n")}`
                    : `No case studies found${search ? ` matching "${search}"` : ""}.`;
                } else {
                  toolResultContent = "Case studies directory not found.";
                }
              } catch (err) {
                toolResultContent = `Case study lookup failed: ${err instanceof Error ? err.message : "error"}`;
              }
            } else {
              toolResultContent = `Unknown tool: ${block.name}`;
            }

            toolResultBlocks.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: toolResultContent,
            });
          }
        }

        // Append tool results as user message
        messages.push({
          role: "user",
          content: toolResultBlocks,
        });
      } else {
        // Unexpected stop reason -- break to avoid infinite loop
        break;
      }
    }

    return finalText || "Research completed but produced no text output.";
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "unknown error";
    console.error("[callResearchAgent] Failed:", errorMsg);
    return `Research failed: ${errorMsg}`;
  }
}

// ---------------------------------------------------------------------------
// US-007: QA Agent Caller
// ---------------------------------------------------------------------------

/**
 * Calls the QA Agent to evaluate a slide's HTML quality.
 * Receives HTML + optional screenshot + layout analysis.
 * Returns a structured QAVerdict.
 */
export async function callQAAgent(
  html: string,
  screenshot: string | null,
  layoutAnalysis: string,
  context?: { userRequest?: string; slidePosition?: string; deckType?: string },
): Promise<QAVerdict> {
  try {
    const anthropic = getAnthropicClient();
    const model = "claude-sonnet-4-20250514";
    const system = getQAAgentPrompt(context);

    // Build multimodal user message content
    const userContent: Array<
      | { type: "text"; text: string }
      | {
          type: "image";
          source: { type: "base64"; media_type: "image/png"; data: string };
        }
    > = [
      {
        type: "text",
        text:
          "HTML:\n" + html + "\n\nLayout Analysis:\n" + layoutAnalysis,
      },
    ];

    if (screenshot) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: screenshot,
        },
      });
    }

    const response = await anthropic.messages.create({
      model,
      max_tokens: 2048,
      system,
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    // Extract text from response
    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    // Parse JSON verdict from response -- strip markdown fences if wrapped
    const verdict = parseQAVerdict(rawText);
    return verdict;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "unknown error";
    console.error("[callQAAgent] Failed:", errorMsg);
    return {
      pass: false,
      score: 0,
      issues: [`QA agent failed: ${errorMsg}`],
      fixes: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip markdown code fences (```html...``` or ```...```) from AI response.
 * Returns the inner content.
 */
function stripCodeFences(text: string): string {
  let cleaned = text.trim();

  // Remove ```html or ``` prefix
  const fenceStart = /^```(?:html)?\s*\n?/;
  if (fenceStart.test(cleaned)) {
    cleaned = cleaned.replace(fenceStart, "");
  }

  // Remove trailing ```
  const fenceEnd = /\n?```\s*$/;
  if (fenceEnd.test(cleaned)) {
    cleaned = cleaned.replace(fenceEnd, "");
  }

  return cleaned.trim();
}

/**
 * Extract a self-note from the AI response -- the first line of text
 * that appears before the HTML, if any.
 */
function extractSelfNote(rawText: string, html: string): string {
  const trimmed = rawText.trim();
  const htmlStart = trimmed.indexOf("<");
  const fenceStart = trimmed.indexOf("```");

  // Find the earliest marker
  const start = Math.min(
    htmlStart >= 0 ? htmlStart : Infinity,
    fenceStart >= 0 ? fenceStart : Infinity,
  );

  if (start > 0 && start !== Infinity) {
    const preText = trimmed.slice(0, start).trim();
    // Return the first line only
    const firstLine = preText.split("\n")[0]?.trim() ?? "";
    return firstLine;
  }

  return "";
}

/**
 * Parse a QAVerdict from AI response text.
 * Strips markdown fences and finds the JSON object.
 */
function parseQAVerdict(text: string): QAVerdict {
  try {
    // Strip markdown code fences
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "");
    cleaned = cleaned.replace(/\n?```\s*$/, "");

    // Find the JSON object
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return {
        pass: false,
        score: 0,
        issues: ["Failed to parse QA response: no JSON object found"],
        fixes: [],
      };
    }

    const jsonStr = cleaned.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);

    // Validate and coerce the parsed object
    return {
      pass: Boolean(parsed.pass),
      score: typeof parsed.score === "number" ? parsed.score : 0,
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      fixes: Array.isArray(parsed.fixes) ? parsed.fixes : [],
    };
  } catch {
    return {
      pass: false,
      score: 0,
      issues: ["Failed to parse QA response"],
      fixes: [],
    };
  }
}
