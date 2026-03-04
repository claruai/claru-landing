// =============================================================================
// Agent Logger — Structured logging for deck builder agent interactions
// Captures: mode, model, prompt size, tool calls, timing, errors
// Logs to console (structured JSON) + optional Supabase table
// =============================================================================

import type { SupabaseClient } from "@supabase/supabase-js";

export interface AgentLogEntry {
  template_id: string;
  mode: string;
  model: string;
  // Request
  user_message: string;
  slide_index: number | null;
  system_prompt_tokens: number; // approximate
  history_messages_count: number;
  // Response
  tool_calls: { name: string; duration_ms: number; result_preview: string }[];
  assistant_text: string;
  total_duration_ms: number;
  // Diagnostics
  intercepted: boolean; // confirm/retry shortcut
  force_stopped: boolean; // QA mid-range stop
  error: string | null;
}

/**
 * Create a logger instance for one chat request.
 * Call methods as the stream progresses, then flush() at the end.
 */
export function createAgentLogger(templateId: string) {
  const startTime = Date.now();
  const entry: AgentLogEntry = {
    template_id: templateId,
    mode: "art-director",
    model: "",
    user_message: "",
    slide_index: null,
    system_prompt_tokens: 0,
    history_messages_count: 0,
    tool_calls: [],
    assistant_text: "",
    total_duration_ms: 0,
    intercepted: false,
    force_stopped: false,
    error: null,
  };

  // Track tool call timing
  let currentToolStart = 0;
  let currentToolName = "";

  return {
    setMode(mode: string) { entry.mode = mode; },
    setModel(model: string) { entry.model = model; },
    setMessage(msg: string) { entry.user_message = msg.slice(0, 500); },
    setSlideIndex(idx: number | null) { entry.slide_index = idx; },
    setPromptTokens(approx: number) { entry.system_prompt_tokens = approx; },
    setHistoryCount(count: number) { entry.history_messages_count = count; },
    setIntercepted(v: boolean) { entry.intercepted = v; },
    setForceStopped(v: boolean) { entry.force_stopped = v; },
    setError(err: string) { entry.error = err; },

    appendText(text: string) {
      entry.assistant_text += text;
      // Keep only first 1000 chars for logging
      if (entry.assistant_text.length > 1000) {
        entry.assistant_text = entry.assistant_text.slice(0, 997) + "...";
      }
    },

    toolStart(name: string) {
      currentToolName = name;
      currentToolStart = Date.now();
    },

    toolEnd(result: string) {
      const duration = Date.now() - currentToolStart;
      entry.tool_calls.push({
        name: currentToolName,
        duration_ms: duration,
        result_preview: result.slice(0, 200),
      });
    },

    /**
     * Flush the log entry — prints to console and optionally saves to Supabase.
     */
    async flush(supabase?: SupabaseClient) {
      entry.total_duration_ms = Date.now() - startTime;

      // Console log — structured JSON for easy parsing
      const summary = {
        mode: entry.mode,
        model: entry.model,
        duration: `${entry.total_duration_ms}ms`,
        tools: entry.tool_calls.map(t => `${t.name}(${t.duration_ms}ms)`).join(", ") || "(none)",
        message: entry.user_message.slice(0, 80),
        slide: entry.slide_index,
        history: entry.history_messages_count,
        prompt_tokens: `~${entry.system_prompt_tokens}`,
        intercepted: entry.intercepted,
        error: entry.error,
      };

      if (entry.error) {
        console.error("[agent-log]", JSON.stringify(summary));
      } else {
        console.log("[agent-log]", JSON.stringify(summary));
      }

      // Optional: persist to Supabase for analytics
      if (supabase) {
        try {
          await supabase.from("agent_logs").insert({
            template_id: entry.template_id,
            mode: entry.mode,
            model: entry.model,
            user_message: entry.user_message,
            slide_index: entry.slide_index,
            system_prompt_tokens: entry.system_prompt_tokens,
            history_messages_count: entry.history_messages_count,
            tool_calls: entry.tool_calls,
            assistant_text: entry.assistant_text.slice(0, 2000),
            total_duration_ms: entry.total_duration_ms,
            intercepted: entry.intercepted,
            force_stopped: entry.force_stopped,
            error: entry.error,
          });
        } catch {
          // Don't fail the request if logging fails — table may not exist yet
        }
      }

      return entry;
    },
  };
}

export type AgentLogger = ReturnType<typeof createAgentLogger>;
