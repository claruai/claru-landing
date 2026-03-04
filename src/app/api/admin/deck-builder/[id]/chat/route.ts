import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAnthropicClient } from "@/lib/deck-builder/ai-agent";
import {
  ORCHESTRATOR_TOOLS,
  processOrchestratorTool,
  NEEDS_DELEGATION,
} from "@/lib/deck-builder/agents/orchestrator-tools";
import { getOrchestratorPrompt } from "@/lib/deck-builder/agents/orchestrator-prompt";
import { getStrategistPrompt } from "@/lib/deck-builder/agents/strategist-prompt";
import { getPageBuilderPrompt } from "@/lib/deck-builder/agents/page-builder-prompt";
import { getTheme } from "@/lib/deck-builder/slide-themes";
import { createAgentLogger } from "@/lib/deck-builder/agent-logger";
import type { AgentMode } from "@/lib/deck-builder/agent-modes";
import { AGENT_MODES, getModeTools } from "@/lib/deck-builder/agent-modes";
import {
  callDesignAgent,
  callResearchAgent,
  callQAAgent,
} from "@/lib/deck-builder/agents/executor";
import type { DesignBrief } from "@/lib/deck-builder/agents/types";
import {
  handleServerTool,
  autoVerifySlide,
  analyzeSlideLayout,
} from "@/lib/deck-builder/server-tool-handlers";
import { createUndoManager, snapshotChangedSlides } from "@/lib/deck-builder/slide-undo";
import { extractMediaRefs } from "@/lib/deck-builder/rewrite-s3-urls";
import { routeModel, shouldEscalate } from "@/lib/deck-builder/model-router";
import type {
  SlideData,
  SlideMediaAsset,
  SlideThemeCustom,
} from "@/types/deck-builder";
import type {
  MessageParam,
  ContentBlockParam,
  ToolResultBlockParam,
  RawMessageStreamEvent,
} from "@anthropic-ai/sdk/resources/messages";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_TOKENS = 16384;
const MAX_HISTORY_MESSAGES = 10;

// ---------------------------------------------------------------------------
// Types for NDJSON stream events
// ---------------------------------------------------------------------------

type StreamEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; name: string; input: Record<string, unknown> }
  | {
      type: "tool_result";
      name: string;
      result: string;
      updated_slides: SlideData[];
      theme_change?: string;
      custom_theme_change?: SlideThemeCustom;
    }
  | { type: "status"; message: string }
  | { type: "model_info"; model: string }
  | { type: "mode_info"; mode: string }
  | {
      type: "variations";
      slide_index: number;
      variations: { label: string; html: string | null }[];
    }
  | { type: "done" }
  | { type: "error"; message: string };

// ---------------------------------------------------------------------------
// POST /api/admin/deck-builder/[id]/chat
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth ----
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id: templateId } = await params;
  const log = createAgentLogger(templateId);

  // ---- Parse body ----
  let body: {
    message: string;
    slides_json: SlideData[];
    selected_slide_index?: number;
    attached_images?: { name: string; url: string }[];
    selected_element?: { tag: string; text: string; html: string };
    mode?: AgentMode;
  };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { message, slides_json, selected_slide_index, attached_images, selected_element } = body;

  // ---- Resolve agent mode (default: art-director) ----
  const activeMode: AgentMode = body.mode && AGENT_MODES[body.mode] ? body.mode : "art-director";
  const modeConfig = AGENT_MODES[activeMode];
  const modeTools = getModeTools(activeMode);

  log.setMode(activeMode);
  log.setMessage(message);
  log.setSlideIndex(selected_slide_index ?? null);

  // Build context-enriched message for Claude
  let enrichedMessage = message;

  // Add current slide context
  if (typeof selected_slide_index === "number" && slides_json[selected_slide_index]) {
    const s = slides_json[selected_slide_index];
    enrichedMessage = `[User is viewing slide_index=${selected_slide_index} (slide ${selected_slide_index + 1} of ${slides_json.length}): "${s.title || "(untitled)"}" — ${s.html ? "custom HTML" : `layout: ${s.layout}`}. When the user says "this slide", use slide_index ${selected_slide_index}.]\n\n${message}`;
  }

  // Add attached image references
  if (attached_images && attached_images.length > 0) {
    const imgList = attached_images.map((img) => `- ${img.name}: ${img.url}`).join("\n");
    enrichedMessage += `\n\n[User attached ${attached_images.length} image(s) — use these URLs in slides:\n${imgList}]`;
  }

  // Add selected element context
  if (selected_element) {
    enrichedMessage += `\n\n[User selected this element from the slide preview — they want to discuss/modify it:\nElement: <${selected_element.tag}>\nText: "${selected_element.text}"\nHTML: ${selected_element.html}]`;
  }
  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!Array.isArray(slides_json)) {
    return new Response(
      JSON.stringify({ error: "slides_json must be an array" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ---- Load template metadata (for system prompt context) ----
  const supabase = createSupabaseAdminClient();

  const { data: template, error: templateErr } = await supabase
    .from("slide_templates")
    .select("name, description, theme")
    .eq("id", templateId)
    .single();

  if (templateErr || !template) {
    return new Response(JSON.stringify({ error: "Template not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ---- Load chat history (last N messages) ----
  const { data: chatHistory } = await supabase
    .from("template_chat_messages")
    .select("role, content, metadata_json")
    .eq("template_id", templateId)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY_MESSAGES);

  // ---- Load media assets ----
  const { data: rawAssets } = await supabase
    .from("slide_media_assets")
    .select("*")
    .eq("template_id", templateId)
    .order("created_at", { ascending: false });

  const mediaAssets: SlideMediaAsset[] = (rawAssets ?? []) as SlideMediaAsset[];

  // ---- Build Anthropic messages from history (enriched with action metadata) ----
  // For Page Builder mode: only carry forward messages from the same mode (or last 3),
  // to prevent strategic commentary from Design mode bleeding into the Page Builder context.
  // Research: "Carry only the output artifact, not the instructions of the previous mode."
  let filteredHistory = chatHistory ?? [];
  if (activeMode === 'page-builder') {
    // Find the last mode-switch point and only include messages after it
    let cutoff = 0;
    for (let i = filteredHistory.length - 1; i >= 0; i--) {
      const meta = (filteredHistory[i] as { metadata_json?: Record<string, unknown> }).metadata_json;
      const msgMode = meta?.mode as string | undefined;
      if (msgMode && msgMode !== 'page-builder') {
        cutoff = i + 1;
        break;
      }
    }
    filteredHistory = filteredHistory.slice(cutoff);
    // Keep at least last 2 messages for continuity
    if (filteredHistory.length < 2 && (chatHistory ?? []).length >= 2) {
      filteredHistory = (chatHistory ?? []).slice(-2);
    }
  }

  const historyMessages: MessageParam[] = filteredHistory.map(
    (msg: { role: string; content: string; metadata_json?: Record<string, unknown> }) => {
      let content = msg.content;
      if (msg.role === 'assistant' && msg.metadata_json) {
        const meta = msg.metadata_json;
        if (meta.last_action) {
          const a = meta.last_action as { type: string; params: Record<string, unknown>; result: string };
          const slideRef = a.params?.slide_index !== undefined ? `slide ${a.params.slide_index}` : '?';
          content += `\n[ACTION: ${a.type}(${slideRef}) → ${typeof a.result === 'string' ? a.result.slice(0, 150) : a.result}]`;
        }
        if ((meta.slide_context as Record<string, unknown>)?.index !== undefined) {
          content += `\n[Was viewing slide ${(meta.slide_context as Record<string, unknown>).index}]`;
        }
      }
      return { role: msg.role as "user" | "assistant", content };
    }
  );

  // ---- Build recent actions from chat history for structured state ----
  const recentActions: { slide: number; action: string; turnsAgo: number }[] = [];
  const assistantHistory = (chatHistory ?? []).filter(
    (m: { role: string }) => m.role === "assistant"
  );
  for (let i = assistantHistory.length - 1; i >= 0 && recentActions.length < 5; i--) {
    const meta = (assistantHistory[i] as { metadata_json?: Record<string, unknown> }).metadata_json;
    if (meta?.last_action) {
      const a = meta.last_action as { type: string; params: Record<string, unknown>; result: string };
      recentActions.push({
        slide: (a.params?.slide_index as number) ?? -1,
        action: a.type,
        turnsAgo: assistantHistory.length - i,
      });
    }
  }

  // ---- Build system prompt (mode-aware) ----
  const orchestratorPrompt = getOrchestratorPrompt({
    name: template.name ?? "",
    description: template.description ?? "",
    slideCount: slides_json.length,
    currentSlideIndex: selected_slide_index,
    slides: slides_json,
    recentActions,
  });

  let systemPrompt: string;

  if (activeMode === "page-builder") {
    const slideCtx = typeof selected_slide_index === "number" ? slides_json[selected_slide_index] : null;
    const themeData = getTheme(template.theme as string ?? "terminal-green");
    systemPrompt = getPageBuilderPrompt({
      name: template.name ?? "",
      slideIndex: selected_slide_index ?? 0,
      slideHtml: slideCtx?.html ?? "",
      theme: {
        colors: themeData.colors,
        fonts: themeData.fonts,
      },
      mediaRefs: (slideCtx?.media_refs as string[]) ?? [],
    });
  } else if (activeMode === "strategist") {
    const slideOutline = slides_json.map((s: SlideData, i: number) => ({ index: i, title: s.title || "(untitled)" }));
    systemPrompt = getStrategistPrompt({
      name: template.name ?? "",
      description: template.description ?? "",
      slides: slideOutline,
      slideCount: slides_json.length,
    });
  } else {
    // Art Director: use the orchestrator prompt unchanged
    systemPrompt = orchestratorPrompt;
  }

  // ---- Save user message (include mode in metadata) ----
  await supabase.from("template_chat_messages").insert({
    template_id: templateId,
    role: "user",
    content: message,
    metadata_json: { mode: activeMode },
  });

  // ---- Create streaming response ----
  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const emit = (event: StreamEvent) => {
        if (cancelled) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // Controller may be closed if client disconnected
          cancelled = true;
        }
      };

      // Track the last action taken for confirmation/retry interception
      let lastAction: { type: string; params: Record<string, unknown>; result: string } | null = null;

      try {
        let currentSlides = [...slides_json];
        const undoManager = createUndoManager();

        // ---- Emit mode info ----
        emit({ type: "mode_info", mode: activeMode });

        // ---- Route model based on mode + message content ----
        // Mode config specifies a default model; routeModel provides message-based routing.
        // For non-art-director modes, use the mode's model. For art-director, use message-based routing.
        const { model: routedModel, tier: modelTier } = routeModel(message);
        const selectedModel = activeMode === "art-director" ? routedModel : modeConfig.model;
        emit({ type: "model_info", model: selectedModel });
        log.setModel(selectedModel);
        log.setHistoryCount(historyMessages.length);
        log.setPromptTokens(Math.round(systemPrompt.length / 4)); // rough estimate

        // Build conversation messages: history + current user message
        const conversationMessages: MessageParam[] = [
          ...historyMessages,
          { role: "user", content: enrichedMessage },
        ];

        // We may need multiple turns if Claude makes tool calls
        let continueConversation = true;
        let fullAssistantText = "";
        let intercepted = false;
        let forceStopped = false; // set true when QA 4-6 stops the loop for human input

        // ---- Pre-LLM intent classification (regex — deterministic, 0ms) ----
        const { data: lastMsg } = await supabase
          .from("template_chat_messages")
          .select("metadata_json")
          .eq("template_id", templateId)
          .eq("role", "assistant")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const storedLastAction = (lastMsg?.metadata_json as Record<string, unknown> | null)?.last_action as { type: string; params: Record<string, unknown>; result: string } | null;

        // Classify intent with regex — no LLM call needed
        let classifiedIntent: 'confirm' | 'retry' | 'action' | 'conversation' = 'conversation';
        if (storedLastAction) {
          const m = message.trim();
          // Confirm patterns: short affirmatives or "improve/fix this"
          if (/^(yes|ok|do it|go ahead|go|proceed|sure|yep|yeah|yea|looks good|perfect|great|improve this|fix this|fix that|fix these|improve it|make it better)$/i.test(m)) {
            classifiedIntent = 'confirm';
          }
          // Retry patterns: negative or redo-intent
          else if (/^(no|nope|redo|try again|different|undo|revert|not what i|wrong|start over|too)/i.test(m)) {
            classifiedIntent = 'retry';
          }
          // Everything else: let the orchestrator handle it as a new action/conversation
        }

        if (classifiedIntent === 'confirm' && storedLastAction) {
          intercepted = true;
          log.setIntercepted(true);
          emit({ type: "text", content: "On it." });
          fullAssistantText = "On it.";

          // Replay the last action — if QA had issues, use those as fix instructions
          if (storedLastAction.type === 'delegate_design') {
            const p = storedLastAction.params;
            const replayIdx = (p.slide_index as number) ?? selected_slide_index ?? 0;
            const qaIssues = p.qa_issues as string[] | undefined;
            const qaFixes = p.qa_fixes as string[] | undefined;

            emit({ type: "status", message: `${qaFixes ? 'Fixing' : 'Designing'} slide ${replayIdx + 1}...` });

            // If there were QA suggestions, the "confirm" means "fix those issues"
            const instruction = qaFixes && qaFixes.length > 0
              ? `Fix these QA issues on the current slide:\n${qaFixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nKeep the overall design — just fix the listed problems.`
              : (p.instruction as string) ?? '';

            const replayBrief: DesignBrief = {
              slideIndex: replayIdx,
              currentSlideData: currentSlides[replayIdx],
              instruction,
              complexity: (p.complexity as 'simple' | 'complex') ?? 'complex',
              useAnimations: false,
              mediaContext: (p.mediaContext as string) ?? '',
            };
            const designResult = await callDesignAgent(replayBrief, currentSlides);
            if (designResult.html) {
              snapshotChangedSlides(currentSlides, currentSlides, undoManager);
              currentSlides[replayIdx] = { ...currentSlides[replayIdx], html: designResult.html, media_refs: extractMediaRefs(designResult.html) };
              emit({ type: "tool_result", name: "delegate_design", result: `Slide ${replayIdx + 1} updated.`, updated_slides: currentSlides });
              lastAction = { type: 'delegate_design', params: p, result: `Slide ${replayIdx + 1} updated (confirmed).` };
            }
          } else if (storedLastAction.type === 'delegate_research') {
            emit({ type: "status", message: "Researching..." });
            const result = await callResearchAgent((storedLastAction.params.question as string) ?? '', 200, supabase);
            emit({ type: "text", content: "\n\n" + result });
            fullAssistantText += "\n\n" + result;
            lastAction = { type: 'delegate_research', params: storedLastAction.params, result: result.slice(0, 200) };
          }

          // Save and emit done for intercepted messages
          if (fullAssistantText.trim()) {
            await supabase.from("template_chat_messages").insert({
              template_id: templateId,
              role: "assistant",
              content: fullAssistantText.trim(),
              metadata_json: {
                mode: activeMode,
                last_action: lastAction,
                slide_context: typeof selected_slide_index === 'number' ? { index: selected_slide_index } : null,
              },
            });
          }
          emit({ type: "done" });
        }

        if (classifiedIntent === 'retry' && storedLastAction) {
          // For retry, enrich the message with context about the failed action
          enrichedMessage = `[SYSTEM: The user is unhappy with the last action: ${storedLastAction.type}(${JSON.stringify(storedLastAction.params)}) which resulted in: "${storedLastAction.result}". They want a DIFFERENT approach. Ask what they'd like changed, or try something notably different.]\n\n${enrichedMessage}`;
          // Update the conversation messages with the enriched version
          conversationMessages[conversationMessages.length - 1] = { role: "user", content: enrichedMessage };
        }

        while (continueConversation && !cancelled && !intercepted) {
          continueConversation = false;

          // ---- Call Anthropic with streaming (mode-aware tool set) ----
          const anthropic = getAnthropicClient();
          const anthropicStream = await anthropic.messages.create({
            model: selectedModel,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            messages: conversationMessages,
            tools: modeTools,
            stream: true,
          });

          // ---- Process stream events ----
          // Collect content blocks as they arrive
          let currentTextContent = "";
          let currentToolUseId = "";
          let currentToolName = "";
          let currentToolInputJson = "";
          let currentBlockType: "text" | "tool_use" | null = null;

          // Collect all content blocks for the assistant message
          const assistantContentBlocks: ContentBlockParam[] = [];
          // Map tool_use_id -> result string for building tool_result messages
          const toolResultsMap = new Map<string, string>();

          for await (const event of anthropicStream as AsyncIterable<RawMessageStreamEvent>) {
            switch (event.type) {
              case "content_block_start": {
                if (event.content_block.type === "text") {
                  currentBlockType = "text";
                  currentTextContent = "";
                } else if (event.content_block.type === "tool_use") {
                  currentBlockType = "tool_use";
                  currentToolUseId = event.content_block.id;
                  currentToolName = event.content_block.name;
                  currentToolInputJson = "";
                  log.toolStart(event.content_block.name);
                  // Skip emitting tool_call for invisible "think" tool
                  if (event.content_block.name !== "think") {
                    emit({
                      type: "tool_call",
                      name: event.content_block.name,
                      input: {},
                    });
                  }
                }
                break;
              }

              case "content_block_delta": {
                if (
                  event.delta.type === "text_delta" &&
                  currentBlockType === "text"
                ) {
                  currentTextContent += event.delta.text;
                  emit({ type: "text", content: event.delta.text });
                } else if (
                  event.delta.type === "input_json_delta" &&
                  currentBlockType === "tool_use"
                ) {
                  currentToolInputJson += event.delta.partial_json;
                  // Fine-grained streaming: show partial design brief as status
                  if (currentToolName === "delegate_design" && currentToolInputJson.length > 60) {
                    try {
                      // Try to extract partial instruction for progressive status
                      const instrMatch = currentToolInputJson.match(/"instruction"\s*:\s*"([^"]{20,80})/);
                      if (instrMatch) {
                        emit({ type: "status", message: `Planning: ${instrMatch[1]}...` });
                      }
                    } catch { /* partial JSON, ignore */ }
                  }
                }
                break;
              }

              case "content_block_stop": {
                if (currentBlockType === "text" && currentTextContent) {
                  assistantContentBlocks.push({
                    type: "text",
                    text: currentTextContent,
                  });
                  fullAssistantText += currentTextContent;
                  log.appendText(currentTextContent);
                } else if (currentBlockType === "tool_use") {
                  let parsedInput: Record<string, unknown> = {};
                  try {
                    parsedInput = JSON.parse(
                      currentToolInputJson || "{}"
                    ) as Record<string, unknown>;
                  } catch {
                    parsedInput = {};
                  }

                  assistantContentBlocks.push({
                    type: "tool_use",
                    id: currentToolUseId,
                    name: currentToolName,
                    input: parsedInput,
                  });

                  // Check if fast model attempted a complex tool
                  if (shouldEscalate(currentToolName, modelTier)) {
                    console.warn(`[model-router] Escalation needed: ${currentToolName} called by ${selectedModel}`);
                  }

                  // Skip tool execution if we've been force-stopped (QA waiting for human)
                  if (cancelled) {
                    toolResultsMap.set(currentToolUseId, 'Skipped — waiting for user input.');
                    currentBlockType = null;
                    break;
                  }

                  // Execute the tool via orchestrator dispatcher
                  let toolResult = processOrchestratorTool(
                    currentToolName,
                    parsedInput,
                    currentSlides,
                    mediaAssets
                  );

                  let verifyScreenshot: string | null = null;
                  let forceStopAfterResult = false;

                  // Handle server-side tools (undo_slide needs the undo manager)
                  if (toolResult.result === '__NEEDS_SERVER_HANDLER__') {
                    const anthropic = getAnthropicClient();
                    const serverResult = await handleServerTool(
                      currentToolName,
                      parsedInput,
                      { slides: currentSlides, template, supabase, anthropic, undoManager },
                    );
                    toolResult = serverResult.toolResult;
                    verifyScreenshot = serverResult.screenshot;
                  }

                  // ----------------------------------------------------------
                  // Handle delegation to specialist agents
                  // ----------------------------------------------------------
                  if (toolResult.result === NEEDS_DELEGATION) {
                    // Strategist mode: block design delegation
                    if (activeMode === 'strategist' && currentToolName === 'delegate_design') {
                      toolResult = {
                        updatedSlides: currentSlides,
                        result: 'ERROR: Design delegation is not available in Strategist mode. Use edit_slide for text changes, or suggest the user switch to Art Director mode for visual redesigns.',
                      };
                    } else if (currentToolName === 'delegate_design') {
                      if (cancelled) { toolResult = { updatedSlides: currentSlides, result: 'Cancelled by user.' }; }
                      else {
                      // 1. Emit status
                      emit({ type: 'status', message: `Designing slide ${(parsedInput.slide_index as number) + 1}...` });

                      // 2. Build brief (auto-detect complexity if not specified)
                      const slideIdx = parsedInput.slide_index as number;
                      const instruction = parsedInput.instruction as string;
                      const autoComplexity: 'simple' | 'complex' =
                        currentSlides[slideIdx]?.html ? 'complex' :
                        instruction.length > 200 ? 'complex' : 'simple';
                      const brief: DesignBrief = {
                        slideIndex: slideIdx,
                        currentSlideData: currentSlides[slideIdx],
                        instruction,
                        complexity: (parsedInput.complexity as 'simple' | 'complex') ?? autoComplexity,
                        useAnimations: (parsedInput.use_animations as boolean) ?? false,
                        mediaContext: '',
                      };

                      // 3. Call Design Agent
                      const designResult = await callDesignAgent(brief, currentSlides);

                      if (designResult.html) {
                        // 4. Apply HTML (proxy URLs used — no signing needed)
                        const updated = [...currentSlides];
                        updated[slideIdx] = { ...updated[slideIdx], html: designResult.html, media_refs: extractMediaRefs(designResult.html) };

                        // 5. QA check (skip if cancelled)
                        if (cancelled) { snapshotChangedSlides(currentSlides, updated, undoManager); currentSlides = updated; toolResult = { updatedSlides: updated, result: 'Slide updated. QA skipped (cancelled).' }; lastAction = { type: 'delegate_design', params: { slide_index: slideIdx, instruction: brief.instruction }, result: 'Slide updated (QA skipped)' }; } else {
                        emit({ type: 'status', message: 'Running quality check...' });
                        const layoutAnalysis = analyzeSlideLayout(designResult.html);
                        const verifyResult = await autoVerifySlide(slideIdx, updated, template?.theme ?? 'terminal-green', templateId, supabase);
                        const qaContext = {
                          userRequest: brief.instruction,
                          slidePosition: `Slide ${slideIdx + 1} of ${currentSlides.length}`,
                          deckType: template?.description ?? '',
                        };
                        const qaVerdict = await callQAAgent(designResult.html, verifyResult.screenshot, layoutAnalysis, qaContext);

                        // 6. Auto-retry ONLY if critically broken (score < 4). Otherwise deliver and let user decide.
                        let finalHtml = designResult.html;
                        let finalVerdict = qaVerdict;

                        if (finalVerdict.score < 4) {
                          // Critically broken — auto-retry once
                          emit({ type: 'status', message: `QA: ${finalVerdict.score}/10 — critically broken, auto-fixing...` });
                          const retryBrief: DesignBrief = {
                            ...brief,
                            currentSlideData: { ...updated[slideIdx] },
                            instruction: `The previous HTML had critical issues (score ${finalVerdict.score}/10):\n${finalVerdict.issues.map((iss, i) => `${i + 1}. ${iss}`).join('\n')}\n\nFixes needed:\n${finalVerdict.fixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}\n\nCurrent HTML:\n${finalHtml}\n\nFix the issues. Keep the overall structure.`,
                          };
                          const retryResult = await callDesignAgent(retryBrief, updated);
                          if (retryResult.html) {
                            finalHtml = retryResult.html;
                            updated[slideIdx] = { ...updated[slideIdx], html: finalHtml, media_refs: extractMediaRefs(finalHtml) };
                            const retryAnalysis = analyzeSlideLayout(finalHtml);
                            const retryVerify = await autoVerifySlide(slideIdx, updated, template?.theme ?? 'terminal-green', templateId, supabase);
                            finalVerdict = await callQAAgent(finalHtml, retryVerify.screenshot, retryAnalysis, qaContext);
                          }
                        }

                        // 7. Result — deliver with QA score, let user decide if they want improvements
                        snapshotChangedSlides(currentSlides, updated, undoManager);
                        currentSlides = updated;

                        let verdictSummary: string;
                        if (finalVerdict.score >= 7) {
                          verdictSummary = `QA: PASS (${finalVerdict.score}/10)`;
                        } else if (finalVerdict.score >= 4) {
                          // Delivered with suggestions — STOP and wait for human
                          verdictSummary = `QA: ${finalVerdict.score}/10. Suggestions: ${finalVerdict.issues.slice(0, 2).join('; ')}. Say "improve this" to have me fix these.`;
                          forceStopAfterResult = true;
                        } else {
                          verdictSummary = `QA: ${finalVerdict.score}/10 (auto-fixed). Remaining: ${finalVerdict.issues.join(', ')}`;
                        }
                        toolResult = { updatedSlides: updated, result: `Slide ${slideIdx + 1} redesigned. ${verdictSummary}` };
                        lastAction = { type: 'delegate_design', params: { slide_index: slideIdx, instruction: brief.instruction, qa_issues: finalVerdict.issues, qa_fixes: finalVerdict.fixes }, result: verdictSummary };

                        // Capture screenshot for frontend
                        const finalVerify = await autoVerifySlide(slideIdx, updated, template?.theme ?? 'terminal-green', templateId, supabase);
                        if (finalVerify.screenshot) verifyScreenshot = finalVerify.screenshot;
                      } // end QA else block
                      } else {
                        toolResult = { updatedSlides: currentSlides, result: `Design failed: ${designResult.selfNote}` };
                        lastAction = { type: 'delegate_design', params: { slide_index: slideIdx, instruction: brief.instruction }, result: `Design failed: ${designResult.selfNote}` };
                      }
                      } // end delegate_design cancelled else block

                    } else if (currentToolName === 'delegate_research') {
                      emit({ type: 'status', message: 'Researching...' });
                      const researchResult = await callResearchAgent(
                        parsedInput.question as string,
                        (parsedInput.max_words as number) ?? 200,
                        supabase
                      );

                      // AUTO-CHAIN: If user message implies "add to slide", chain research into design
                      const impliesDesign = /\b(add|put|embed|include|use|show|integrate)\b.*\b(slide|this|here|deck)\b/i.test(message);
                      const targetSlide = selected_slide_index ?? 0;

                      if (impliesDesign && !cancelled) {
                        emit({ type: 'status', message: `Designing slide ${targetSlide + 1} with research results...` });
                        const designBrief: DesignBrief = {
                          slideIndex: targetSlide,
                          currentSlideData: currentSlides[targetSlide],
                          instruction: `Incorporate this researched content into the slide. Use ONLY the real data/URLs below, do not fabricate.\n\nResearch results:\n${researchResult}\n\nOriginal user request: ${message}`,
                          complexity: 'complex',
                          useAnimations: false,
                          mediaContext: '',
                        };
                        const designResult = await callDesignAgent(designBrief, currentSlides);
                        if (designResult.html) {
                          const updated = [...currentSlides];
                          updated[targetSlide] = { ...updated[targetSlide], html: designResult.html, media_refs: extractMediaRefs(designResult.html) };
                          snapshotChangedSlides(currentSlides, updated, undoManager);
                          currentSlides = updated;

                          // QA
                          if (!cancelled) {
                            emit({ type: 'status', message: 'Running quality check...' });
                            const layoutAnalysis = analyzeSlideLayout(designResult.html);
                            const verifyResult = await autoVerifySlide(targetSlide, updated, template?.theme ?? 'terminal-green', templateId, supabase);
                            const qaVerdict = await callQAAgent(designResult.html, verifyResult.screenshot, layoutAnalysis, { userRequest: message });
                            const verdictText = qaVerdict.pass ? `QA: PASS (${qaVerdict.score}/10)` : `QA: ${qaVerdict.score}/10`;
                            toolResult = { updatedSlides: updated, result: `Slide ${targetSlide + 1} updated with real data. ${verdictText}` };
                            if (verifyResult.screenshot) verifyScreenshot = verifyResult.screenshot;
                          } else {
                            toolResult = { updatedSlides: updated, result: `Slide ${targetSlide + 1} updated.` };
                          }
                        } else {
                          toolResult = { updatedSlides: currentSlides, result: researchResult };
                        }
                      } else {
                        toolResult = { updatedSlides: currentSlides, result: researchResult };
                      }

                      lastAction = { type: 'delegate_research', params: { question: parsedInput.question }, result: researchResult.slice(0, 200) };

                    } else if (currentToolName === 'delegate_qa') {
                      emit({ type: 'status', message: 'Running QA check...' });
                      const slideIdx = parsedInput.slide_index as number;
                      const slide = currentSlides[slideIdx];
                      const html = slide?.html ?? '';
                      const layoutAnalysis = html ? analyzeSlideLayout(html) : 'No custom HTML on this slide.';
                      const verifyResult = await autoVerifySlide(slideIdx, currentSlides, template?.theme ?? 'terminal-green', templateId, supabase);
                      const verdict = await callQAAgent(html, verifyResult.screenshot, layoutAnalysis, {
                        slidePosition: `Slide ${slideIdx + 1} of ${currentSlides.length}`,
                        deckType: template?.description ?? '',
                      });
                      if (verifyResult.screenshot) verifyScreenshot = verifyResult.screenshot;
                      const verdictText = verdict.pass
                        ? `QA PASS (${verdict.score}/10)`
                        : `QA FAIL (${verdict.score}/10): ${verdict.issues.join(', ')}. Fixes: ${verdict.fixes.join(', ')}`;
                      toolResult = { updatedSlides: currentSlides, result: verdictText };
                      lastAction = { type: 'delegate_qa', params: { slide_index: slideIdx }, result: verdictText.slice(0, 200) };

                    } else if (currentToolName === 'generate_variations') {
                      emit({ type: 'status', message: 'Generating variations...' });
                      const slideIdx = parsedInput.slide_index as number;
                      const direction = (parsedInput.direction as string) ?? '';
                      // Call Design Agent 3 times with different directions
                      const directions = direction
                        ? [direction, `${direction} — more minimal`, `${direction} — more bold`]
                        : ['clean and minimal', 'bold and dramatic', 'data-focused with large stats'];
                      const variations = await Promise.all(
                        directions.map(async (dir) => {
                          const brief: DesignBrief = {
                            slideIndex: slideIdx,
                            currentSlideData: currentSlides[slideIdx],
                            instruction: `Create a variation: ${dir}`,
                            complexity: 'complex',
                            useAnimations: false,
                            mediaContext: '',
                          };
                          const result = await callDesignAgent(brief, currentSlides);
                          return { label: dir, html: result.html };
                        })
                      );
                      // Emit variations event for frontend
                      emit({ type: 'variations', slide_index: slideIdx, variations });
                      toolResult = { updatedSlides: currentSlides, result: `Generated ${variations.length} variations for slide ${slideIdx + 1}.` };
                      lastAction = { type: 'generate_variations', params: { slide_index: slideIdx, direction }, result: `Generated ${variations.length} variations` };

                    } else if (currentToolName === 'generate_image') {
                      emit({ type: 'status', message: 'Generating image with Nano Banana...' });
                      try {
                        const { generateImage } = await import('@/lib/deck-builder/media-generation');
                        const image = await generateImage(
                          parsedInput.prompt as string,
                          {
                            aspectRatio: (parsedInput.aspect_ratio as string) ?? '16:9',
                          }
                        );
                        toolResult = {
                          updatedSlides: currentSlides,
                          result: `Image generated: ${image.url} (${image.filename}). Use this URL in slides with <img> tags or pass it to the Design Agent in the mediaContext.`,
                        };
                        lastAction = { type: 'generate_image', params: { prompt: parsedInput.prompt }, result: `Image generated: ${image.url}` };
                      } catch (err) {
                        toolResult = {
                          updatedSlides: currentSlides,
                          result: `Image generation failed: ${err instanceof Error ? err.message : 'unknown error'}`,
                        };
                        lastAction = { type: 'generate_image', params: { prompt: parsedInput.prompt }, result: toolResult.result };
                      }

                    } else if (currentToolName === 'generate_video') {
                      emit({ type: 'status', message: 'Generating video with Veo 3 (this may take 1-2 minutes)...' });
                      try {
                        const { generateVideo } = await import('@/lib/deck-builder/media-generation');
                        const video = await generateVideo(
                          parsedInput.prompt as string,
                          {
                            aspectRatio: (parsedInput.aspect_ratio as string) ?? '16:9',
                            duration: (parsedInput.duration as string) ?? '6',
                          }
                        );
                        toolResult = {
                          updatedSlides: currentSlides,
                          result: `Video generated: ${video.url} (${video.filename}). Use in slides with <video src="${video.url}" autoplay muted loop playsinline>.`,
                        };
                        lastAction = { type: 'generate_video', params: { prompt: parsedInput.prompt }, result: `Video generated: ${video.url}` };
                      } catch (err) {
                        toolResult = {
                          updatedSlides: currentSlides,
                          result: `Video generation failed: ${err instanceof Error ? err.message : 'unknown error'}`,
                        };
                        lastAction = { type: 'generate_video', params: { prompt: parsedInput.prompt }, result: toolResult.result };
                      }
                    }
                  }

                  // Set lastAction for direct (non-delegation) tools
                  if (toolResult.result !== NEEDS_DELEGATION && !lastAction) {
                    lastAction = { type: currentToolName, params: parsedInput, result: toolResult.result.slice(0, 200) };
                  }

                  // Snapshot changed slides for undo before overwriting currentSlides
                  // (skip if already snapshotted in delegate_design flow above)
                  if (toolResult.result !== NEEDS_DELEGATION) {
                    snapshotChangedSlides(currentSlides, toolResult.updatedSlides, undoManager);
                    currentSlides = toolResult.updatedSlides;
                  }

                  // Store result for building Anthropic tool_result messages
                  toolResultsMap.set(currentToolUseId, toolResult.result);
                  log.toolEnd(toolResult.result);
                  // If we captured a screenshot, store it keyed by tool_use_id
                  if (verifyScreenshot) {
                    toolResultsMap.set(currentToolUseId + '__screenshot', verifyScreenshot);
                  }

                  // Emit tool_result event to the client (skip for invisible "think" tool)
                  if (currentToolName !== "think") {
                    emit({
                      type: "tool_result",
                      name: currentToolName,
                      result: toolResult.result,
                      updated_slides: toolResult.updatedSlides,
                      ...(toolResult.themeChange
                        ? { theme_change: toolResult.themeChange }
                        : {}),
                      ...(toolResult.customThemeChange
                        ? { custom_theme_change: toolResult.customThemeChange }
                        : {}),
                      ...(verifyScreenshot
                        ? { screenshot: `data:image/png;base64,${verifyScreenshot}` }
                        : {}),
                    });
                  }

                  // Force-stop after mid-range QA — wait for human to decide
                  if (forceStopAfterResult) {
                    continueConversation = false;
                    forceStopped = true;
                    cancelled = true; // Stop processing ALL remaining stream events
                  }
                }

                currentBlockType = null;
                break;
              }

              case "message_delta": {
                // Check if Claude wants to continue with tool results
                if (event.delta.stop_reason === "tool_use") {
                  continueConversation = true;
                }
                break;
              }
            }
          }

          // Append the assistant message to conversation
          conversationMessages.push({
            role: "assistant",
            content: assistantContentBlocks,
          });

          // If Claude made tool calls, append tool results and continue
          if (continueConversation) {
            const toolResultBlocks: ToolResultBlockParam[] = [];

            for (const block of assistantContentBlocks) {
              if (block.type === "tool_use") {
                const resultStr =
                  toolResultsMap.get(block.id) ?? "Tool executed successfully.";
                const screenshot = toolResultsMap.get(block.id + '__screenshot');

                if (screenshot) {
                  // Send screenshot as multimodal tool result (text + image)
                  toolResultBlocks.push({
                    type: "tool_result",
                    tool_use_id: block.id,
                    content: [
                      { type: "text", text: resultStr },
                      {
                        type: "image",
                        source: {
                          type: "base64",
                          media_type: "image/png",
                          data: screenshot,
                        },
                      },
                    ],
                  } as ToolResultBlockParam);
                } else {
                  toolResultBlocks.push({
                    type: "tool_result",
                    tool_use_id: block.id,
                    content: resultStr,
                  });
                }
              }
            }

            if (toolResultBlocks.length > 0) {
              conversationMessages.push({
                role: "user",
                content: toolResultBlocks,
              });
            }
          }
        }

        // (Hallucination detection removed — the "think" tool + action-first prompt rules
        //  prevent the agent from describing actions instead of executing them.)

        // ---- Save assistant response (include mode in metadata) ----
        if (fullAssistantText.trim() && !intercepted) {
          await supabase.from("template_chat_messages").insert({
            template_id: templateId,
            role: "assistant",
            content: fullAssistantText.trim(),
            metadata_json: {
              mode: activeMode,
              last_action: lastAction,
              slide_context: typeof selected_slide_index === 'number' ? { index: selected_slide_index } : null,
            },
          });
        }

        if (!intercepted) {
          // If force-stopped (QA waiting for human), temporarily un-cancel to emit done
          if (forceStopped) cancelled = false;
          emit({ type: "done" });
          if (forceStopped) cancelled = true;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("[chat/route] Stream error:", errorMessage);
        log.setError(errorMessage);
        emit({ type: "error", message: errorMessage });
      } finally {
        log.flush(supabase).catch(() => {}); // fire-and-forget
        controller.close();
      }
    },
    cancel() {
      cancelled = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
