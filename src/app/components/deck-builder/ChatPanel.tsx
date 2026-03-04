"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type {
  SlideData,
  TemplateChatMessage,
  SlideThemeCustom,
} from "@/types/deck-builder";
import { Send, AlertCircle } from "lucide-react";
import { VariationPicker } from "./VariationPicker";
import type { AgentMode } from "@/lib/deck-builder/agent-modes-client";
import { AGENT_MODES, detectModeIntent } from "@/lib/deck-builder/agent-modes-client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SelectedElement {
  tag: string;
  text: string;
  html: string;
}

interface ChatPanelProps {
  templateId: string;
  slides: SlideData[];
  selectedSlideIndex: number;
  selectedElement?: SelectedElement | null;
  onSelectedElementConsumed?: () => void;
  selectorMode?: boolean;
  onToggleSelector?: () => void;
  /** Skip loading chat history from API (for "new chat" reset) */
  skipHistory?: boolean;
  onSlidesUpdate: (slides: SlideData[]) => void;
  onThemeChange?: (themeId: string) => void;
  onCustomThemeChange?: (customTheme: SlideThemeCustom) => void;
  initialMessages?: TemplateChatMessage[];
}

interface ToolCall {
  name: string;
  result?: string;
  screenshot?: string;
  pending: boolean;
}

interface ChatMessage {
  role: "user" | "assistant" | "divider";
  content: string;
  toolCalls: ToolCall[];
  isStreaming?: boolean;
  isError?: boolean;
  variations?: { label: string; html: string }[];
  variationSlideIndex?: number;
  qaActions?: { type: "pass" | "needs_work"; slideIndex: number };
}

/* ------------------------------------------------------------------ */
/*  Mode tab bar configuration                                         */
/* ------------------------------------------------------------------ */

const MODE_TABS: { mode: AgentMode; label: string; icon: string }[] = [
  { mode: "strategist", label: "Strategy", icon: "\u{1F4CB}" },
  { mode: "art-director", label: "Design", icon: "\u{1F3A8}" },
  { mode: "page-builder", label: "Build", icon: "\u{26A1}" },
];

/* ------------------------------------------------------------------ */
/*  Mode-specific suggestion chips (US-008)                            */
/* ------------------------------------------------------------------ */

const SUGGESTION_CHIPS_BY_MODE: Record<AgentMode, string[]> = {
  strategist: [
    "Build a sales deck",
    "Restructure the flow",
    "Add a closing slide",
    "Improve the narrative",
  ],
  "art-director": [
    "Redesign this slide",
    "Make it more impactful",
    "Add data visualization",
    "Show me 3 options",
  ],
  "page-builder": [
    "Make heading bigger",
    "Add video grid",
    "Change background color",
    "Fix the spacing",
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Map tool names to compact human-readable labels + icons */
const TOOL_LABELS: Record<string, { label: string; icon: string }> = {
  edit_slide: { label: "Edited slide", icon: "✏️" },
  add_slide: { label: "Added slide", icon: "➕" },
  delete_slide: { label: "Removed slide", icon: "🗑" },
  reorder_slides: { label: "Reordered slides", icon: "↕️" },
  set_slide_layout: { label: "Changed layout", icon: "📐" },
  set_slide_background: { label: "Changed background", icon: "🎨" },
  set_slide_image: { label: "Set image", icon: "🖼" },
  set_slide_html: { label: "Custom HTML", icon: "⚡" },
  get_all_slides: { label: "Reading slides", icon: "👁" },
  get_slide_html: { label: "Inspecting slide HTML", icon: "🔍" },
  get_media_assets: { label: "Checking media", icon: "📎" },
  get_site_media: { label: "Browsing media library", icon: "🎬" },
  get_landing_page_content: { label: "Reading landing page", icon: "🌐" },
  get_data_catalog: { label: "Querying data catalog", icon: "🗃" },
  set_template_theme: { label: "Changed theme", icon: "🎨" },
  customize_theme: { label: "Customized theme", icon: "🎨" },
  verify_slide: { label: "Verifying slide", icon: "📸" },
  get_gsap_reference: { label: "Loading animation reference", icon: "🎞" },
  get_design_reference: { label: "Loading design principles", icon: "📐" },
  web_search: { label: "Searching", icon: "🔍" },
  undo_slide: { label: "Undid slide change", icon: "↩️" },
  apply_to_all_slides: { label: "Applied to all slides", icon: "🔄" },
  restructure_deck: { label: "Restructured deck", icon: "📋" },
  generate_section: { label: "Generated section", icon: "📑" },
  generate_variations: { label: "Generating variations", icon: "🎨" },
  get_deck_approach: { label: "Loading deck approach", icon: "📚" },
  load_skill: { label: "Loading skill knowledge", icon: "🧠" },
  generate_image: { label: "Generating image", icon: "🖼" },
  generate_video: { label: "Generating video", icon: "🎬" },
  delegate_design: { label: "Designing slide", icon: "🎨" },
  delegate_research: { label: "Researching", icon: "🔍" },
  delegate_qa: { label: "Quality check", icon: "📋" },
  think: { label: "Planning", icon: "💭" },
};

function getToolDisplay(name: string): { label: string; icon: string } {
  return TOOL_LABELS[name] ?? { label: name.replace(/_/g, " "), icon: "⚙️" };
}

/** Truncate long tool results to a short summary */
function summarizeResult(name: string, result: string): string | null {
  if (!result) return null;

  // Read-only tools: don't show the full dump
  const readOnlyTools = ["get_all_slides", "get_media_assets", "get_site_media", "get_landing_page_content", "get_data_catalog", "get_gsap_reference", "get_design_reference", "get_slide_html", "web_search"];
  if (readOnlyTools.includes(name)) {
    // Count items or just confirm
    const lineCount = result.split("\n").length;
    if (lineCount > 5) return `Loaded ${lineCount} items`;
    return null; // don't show anything for small reads
  }

  // Mutation tools: show the first line (usually a good summary)
  const firstLine = result.split("\n")[0] ?? "";
  if (firstLine.length > 80) return firstLine.slice(0, 77) + "...";
  return firstLine;
}

/** Convert TemplateChatMessage[] into the internal ChatMessage format. */
function hydrateChatHistory(messages: TemplateChatMessage[]): ChatMessage[] {
  const result: ChatMessage[] = [];
  let lastMode: string | undefined;

  for (const m of messages) {
    if (m.role !== "user" && m.role !== "assistant") continue;

    const meta = m.metadata_json as Record<string, unknown> | null;
    const mode = meta?.mode as string | undefined;

    // Insert mode-switch divider if mode changed
    if (mode && lastMode && mode !== lastMode) {
      const modeLabel = AGENT_MODES[mode as AgentMode]?.label ?? mode;
      result.push({
        role: "divider",
        content: `switched to ${modeLabel} mode`,
        toolCalls: [],
      });
    }
    if (mode) lastMode = mode;

    // Reconstruct tool calls from metadata
    const toolCalls: ToolCall[] = [];
    const lastAction = meta?.last_action as { type: string; result?: string } | undefined;
    if (lastAction && m.role === "assistant") {
      toolCalls.push({
        name: lastAction.type,
        result: typeof lastAction.result === "string" ? lastAction.result : undefined,
        pending: false,
      });
    }

    result.push({
      role: m.role as "user" | "assistant",
      content: m.content,
      toolCalls,
    });
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Bounce-dot loading animation                                       */
/* ------------------------------------------------------------------ */

function BounceDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"
          style={{
            animation: "chat-bounce 1.2s infinite ease-in-out",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes chat-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Tool call card                                                     */
/* ------------------------------------------------------------------ */

function ToolCallCard({ tool }: { tool: ToolCall }) {
  const display = getToolDisplay(tool.name);
  const summary = tool.result ? summarizeResult(tool.name, tool.result) : null;

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2 py-1 px-2 rounded bg-[var(--bg-tertiary)]/60">
        <span className="text-xs shrink-0">{display.icon}</span>
        <span className="font-mono text-[11px] text-[var(--accent-primary)]">
          {display.label}
        </span>
        {tool.pending && <BounceDots />}
        {summary && (
          <span className="font-mono text-[10px] text-[var(--text-muted)] truncate ml-auto">
            {summary}
          </span>
        )}
        {!tool.pending && !summary && tool.result && (
          <span className="font-mono text-[10px] text-[var(--text-muted)] ml-auto">✓</span>
        )}
      </div>
      {/* Screenshot + quality status */}
      {tool.screenshot && (
        <div className="mt-1.5 rounded overflow-hidden border border-[var(--border-subtle)]">
          <img
            src={tool.screenshot}
            alt="Slide verification screenshot"
            className="w-full h-auto"
          />
          <div className="px-2 py-1.5 bg-[var(--bg-tertiary)]/60 flex items-center gap-2">
            {tool.result?.includes('🔴') ? (
              <span className="font-mono text-[10px] text-[var(--error)]">
                Issues found — agent fixing
              </span>
            ) : tool.result?.includes('🟢') ? (
              <span className="font-mono text-[10px] text-[var(--accent-primary)]">
                Quality check passed
              </span>
            ) : (
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                Slide preview
              </span>
            )}
          </div>
        </div>
      )}
      {/* QA verdict for delegate_design results */}
      {tool.name === 'delegate_design' && tool.result && (
        <div className="mt-1.5">
          {tool.result.includes('PASS') ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
              ✓ {tool.result.match(/QA:.*$/)?.[0] ?? 'QA Passed'}
            </span>
          ) : tool.result.includes('QA:') ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
              ⚠ {tool.result.match(/QA:.*$/)?.[0] ?? 'QA Issues'}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatPanel component                                                */
/* ------------------------------------------------------------------ */

export function ChatPanel({
  templateId,
  slides,
  selectedSlideIndex,
  selectedElement,
  onSelectedElementConsumed,
  selectorMode,
  onToggleSelector,
  skipHistory,
  onSlidesUpdate,
  onThemeChange,
  onCustomThemeChange,
  initialMessages,
}: ChatPanelProps) {
  /* ---- State ---- */
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessages ? hydrateChatHistory(initialMessages) : []
  );
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachedImages, setAttachedImages] = useState<{ name: string; url: string }[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Mode state (US-007) ---- */
  const [mode, setMode] = useState<AgentMode>("art-director");
  /** Pending mode switch suggestion from intent detection (US-010) */
  const [suggestedMode, setSuggestedMode] = useState<{ mode: AgentMode; message: string } | null>(null);

  const [historyLoaded, setHistoryLoaded] = useState(!!initialMessages || !!skipHistory);

  /* ---- Refs ---- */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const slidesRef = useRef(slides);
  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  /* ---- Load chat history on mount ---- */
  useEffect(() => {
    if (historyLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/deck-builder/${templateId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.chat_messages && data.chat_messages.length > 0) {
          setMessages(hydrateChatHistory(data.chat_messages));
        }
      } catch {} finally {
        if (!cancelled) setHistoryLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [templateId, historyLoaded]);

  /* ---- Auto-scroll to bottom ---- */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ---- Auto-resize textarea ---- */
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, []);

  /* ---- Mode switching helper (US-007) ---- */
  const switchMode = useCallback((newMode: AgentMode) => {
    if (newMode === mode) return;
    const divider: ChatMessage = {
      role: "divider",
      content: `switched to ${AGENT_MODES[newMode].label} mode`,
      toolCalls: [],
    };
    setMessages((prev) => [...prev, divider]);
    setMode(newMode);
  }, [mode]);

  /* ---- Send message & stream response ---- */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      // Append user message
      const userMsg: ChatMessage = {
        role: "user",
        content: trimmed,
        toolCalls: [],
      };

      // Placeholder for the assistant response
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "",
        toolCalls: [],
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setAttachedImages([]);
      onSelectedElementConsumed?.();
      setIsStreaming(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `/api/admin/deck-builder/${templateId}/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: trimmed,
              mode,
              slides_json: slidesRef.current,
              selected_slide_index: selectedSlideIndex,
              attached_images: attachedImages.length > 0 ? attachedImages : undefined,
              selected_element: selectedElement ? { tag: selectedElement.tag, text: selectedElement.text, html: selectedElement.html } : undefined,
            }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const errText =
            errorBody?.error ?? `Request failed (${response.status})`;
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: errText,
                isStreaming: false,
                isError: true,
              };
            }
            return updated;
          });
          setIsStreaming(false);
          return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            let event: {
              type: string;
              content?: string;
              name?: string;
              input?: Record<string, unknown>;
              result?: string;
              updated_slides?: SlideData[];
              theme_change?: string;
              custom_theme_change?: SlideThemeCustom;
              screenshot?: string;
              message?: string;
              status?: string;
              variations?: { label: string; html: string }[];
              slide_index?: number;
              model?: string;
            };

            try {
              event = JSON.parse(line);
            } catch {
              continue; // skip malformed lines
            }

            switch (event.type) {
              /* ---- Streaming text delta ---- */
              case "text": {
                setStatusMessage('');
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + (event.content ?? ""),
                    };
                  }
                  return updated;
                });
                break;
              }

              /* ---- Tool invocation started ---- */
              case "tool_call": {
                setStatusMessage('');
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      toolCalls: [
                        ...last.toolCalls,
                        {
                          name: event.name ?? "unknown",
                          pending: true,
                        },
                      ],
                    };
                  }
                  return updated;
                });
                break;
              }

              /* ---- Tool finished ---- */
              case "tool_result": {
                setStatusMessage('');
                // Update the most recent pending tool card with the result
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    const toolCalls = [...last.toolCalls];
                    // Find the last pending tool with a matching name
                    const idx = toolCalls.findLastIndex(
                      (t) => t.name === event.name && t.pending
                    );
                    if (idx !== -1) {
                      toolCalls[idx] = {
                        ...toolCalls[idx],
                        result: event.result ?? "Done",
                        screenshot: event.screenshot ?? undefined,
                        pending: false,
                      };
                    }
                    // Add QA action buttons for delegate_design results with QA scores
                    let qaActions = last.qaActions;
                    if (event.name === "delegate_design" && event.result) {
                      const scoreMatch = event.result.match(/QA:.*?(\d+)\/10/);
                      if (scoreMatch) {
                        const score = parseInt(scoreMatch[1], 10);
                        const slideIdxMatch = event.result.match(/Slide (\d+)/);
                        const slideIdx = slideIdxMatch ? parseInt(slideIdxMatch[1], 10) - 1 : 0;
                        qaActions = {
                          type: score >= 7 ? "pass" : "needs_work",
                          slideIndex: slideIdx,
                        };
                      }
                    }
                    updated[updated.length - 1] = { ...last, toolCalls, qaActions };
                  }
                  return updated;
                });

                // Propagate slide updates to parent
                if (event.updated_slides) {
                  onSlidesUpdate(event.updated_slides);
                }

                // Propagate theme changes to parent
                if (event.theme_change && onThemeChange) {
                  onThemeChange(event.theme_change);
                }
                if (event.custom_theme_change && onCustomThemeChange) {
                  onCustomThemeChange(event.custom_theme_change);
                }

                break;
              }

              /* ---- Stream complete ---- */
              case "done": {
                setStatusMessage('');
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      isStreaming: false,
                    };
                  }
                  return updated;
                });
                break;
              }

              /* ---- Error from server ---- */
              case "error": {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content:
                        last.content +
                        (last.content ? "\n\n" : "") +
                        (event.message ?? "An error occurred"),
                      isStreaming: false,
                      isError: true,
                    };
                  }
                  return updated;
                });
                break;
              }

              /* ---- Variation designs received ---- */
              case "variations": {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      variations: event.variations,
                      variationSlideIndex: event.slide_index,
                    };
                  }
                  return updated;
                });
                break;
              }

              /* ---- Status from agent team ---- */
              case "status": {
                setStatusMessage(event.message ?? event.status ?? '');
                break;
              }

              /* ---- Model info (informational, no UI action needed) ---- */
              case "model_info": {
                // Could log or display which model is being used
                break;
              }
            }
          }
        }

        // Ensure streaming flag is cleared even if "done" event was missed
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant" && last.isStreaming) {
            updated[updated.length - 1] = { ...last, isStreaming: false };
          }
          return updated;
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: (err as Error).message ?? "Network error",
              isStreaming: false,
              isError: true,
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [
      isStreaming,
      templateId,
      mode,
      selectedSlideIndex,
      attachedImages,
      selectedElement,
      onSlidesUpdate,
      onThemeChange,
      onCustomThemeChange,
    ]
  );

  /* ---- Intent-aware send wrapper (US-010) ---- */
  const trySend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const detected = detectModeIntent(trimmed, mode);
      if (detected) {
        // Show suggestion chip instead of sending immediately
        setSuggestedMode({ mode: detected, message: trimmed });
        return;
      }

      setSuggestedMode(null);
      sendMessage(trimmed);
    },
    [isStreaming, mode, sendMessage]
  );

  /* ---- Keyboard handler for textarea ---- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        trySend(input);
      }
    },
    [input, trySend]
  );

  /* ---- Determine whether to show suggestion chips ---- */
  const showChips =
    messages.length === 0 ||
    (messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      !messages[messages.length - 1].isStreaming);

  /* ---- Render ---- */
  return (
    <div className="flex flex-col h-full">
      {/* ---- Mode tab bar (US-007) ---- */}
      <div className="flex items-center border-b border-[var(--border-subtle)] shrink-0">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.mode}
            onClick={() => switchMode(tab.mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 font-mono text-[11px] py-1.5 transition-colors duration-150 cursor-pointer ${
              mode === tab.mode
                ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-b-2 border-transparent"
            }`}
          >
            <span className="text-[12px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ---- Message list ---- */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-2">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              ai chat
            </span>
            <p className="text-sm text-[var(--text-tertiary)] max-w-[240px] leading-relaxed">
              Ask the AI to edit your slides, restructure your deck, or improve
              your content.
            </p>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "divider" ? (
            <div key={i} className="flex items-center gap-2 py-1">
              <div className="flex-1 border-t border-[var(--border-subtle)]" />
              <span className="font-mono text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                {msg.content}
              </span>
              <div className="flex-1 border-t border-[var(--border-subtle)]" />
            </div>
          ) : (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              } ${msg.isError ? "border border-[var(--error)]/40" : ""}`}
            >
              {/* Text content */}
              {msg.content && (
                <div
                  className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.isError ? "text-[var(--error)]" : ""
                  }`}
                >
                  {msg.isError && (
                    <AlertCircle className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-[var(--error)]" />
                  )}
                  {msg.content}
                </div>
              )}

              {/* Tool call cards */}
              {msg.toolCalls.length > 0 && (
                <div className="space-y-1.5">
                  {msg.toolCalls.map((tool, j) => (
                    <ToolCallCard key={j} tool={tool} />
                  ))}
                </div>
              )}

              {/* QA action buttons — accept / improve / redo */}
              {msg.qaActions && !msg.isStreaming && !isStreaming && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border-subtle)] flex-wrap">
                  {msg.qaActions.type === "pass" ? (
                    <>
                      <span className="font-mono text-[10px] text-[var(--accent-primary)]">Looks good?</span>
                      <button
                        onClick={() => sendMessage("looks good")}
                        className="px-2.5 py-1 rounded text-[11px] font-mono bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/25 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => sendMessage("improve this")}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-colors"
                      >
                        Improve
                      </button>
                      <button
                        onClick={() => sendMessage("redo this completely")}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-colors"
                      >
                        Redo
                      </button>
                      {/* Fine-tune button (US-009) */}
                      <button
                        onClick={() => {
                          switchMode("page-builder");
                          textareaRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-colors"
                      >
                        <span className="text-[12px]">{"\u26A1"}</span> Fine-tune
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-[10px] text-[var(--warning)]">QA found issues</span>
                      <button
                        onClick={() => sendMessage("fix the QA issues")}
                        className="px-2.5 py-1 rounded text-[11px] font-mono bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30 hover:bg-[var(--warning)]/25 transition-colors"
                      >
                        Fix Issues
                      </button>
                      <button
                        onClick={() => sendMessage("looks fine, keep it")}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-colors"
                      >
                        Accept Anyway
                      </button>
                      <button
                        onClick={() => sendMessage("redo this completely")}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-colors"
                      >
                        Redo
                      </button>
                      {/* Fine-tune button (US-009) */}
                      <button
                        onClick={() => {
                          switchMode("page-builder");
                          textareaRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-colors"
                      >
                        <span className="text-[12px]">{"\u26A1"}</span> Fine-tune
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Variation picker */}
              {msg.variations && msg.variations.length > 0 && (
                <VariationPicker
                  variations={msg.variations}
                  slideIndex={msg.variationSlideIndex ?? 0}
                  theme="terminal-green"
                  onSelect={(html) => {
                    const idx = msg.variationSlideIndex ?? 0;
                    const updated = [...slidesRef.current];
                    if (updated[idx]) {
                      updated[idx] = { ...updated[idx], html };
                      onSlidesUpdate(updated);
                    }
                  }}
                />
              )}

              {/* Streaming indicator (when content is still empty) */}
              {msg.isStreaming &&
                !msg.content &&
                msg.toolCalls.length === 0 && (
                  <div className="py-1">
                    <BounceDots />
                  </div>
                )}
            </div>
          </div>
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Status indicator from agent team */}
      {statusMessage && (
        <div className="px-3 py-1.5">
          <span className="font-mono text-xs text-[var(--accent-primary)] animate-pulse">
            {statusMessage}
          </span>
        </div>
      )}

      {/* ---- Suggestion chips (mode-aware, US-008) ---- */}
      {showChips && !isStreaming && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTION_CHIPS_BY_MODE[mode].map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-xs font-mono bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded-full px-3 py-1 cursor-pointer transition-colors duration-150 border border-[var(--border-subtle)]"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* ---- Mode switch suggestion (US-010) ---- */}
      {suggestedMode && (
        <div className="mx-3 mb-1 rounded-md border border-[var(--accent-primary)]/20 bg-[var(--bg-tertiary)] px-3 py-1.5 flex items-center gap-2">
          <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
            This sounds like a <span className="text-[var(--accent-primary)]">{AGENT_MODES[suggestedMode.mode].label}</span> task. Switch?
          </span>
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <button
              onClick={() => {
                const msg = suggestedMode.message;
                switchMode(suggestedMode.mode);
                setSuggestedMode(null);
                sendMessage(msg);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/25 transition-colors"
            >
              Switch
            </button>
            <button
              onClick={() => {
                const msg = suggestedMode.message;
                setSuggestedMode(null);
                sendMessage(msg);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)] transition-colors"
            >
              Keep
            </button>
          </div>
        </div>
      )}

      {/* ---- Selected element context ---- */}
      {selectedElement && (
        <div className="mx-3 mt-2 rounded-md border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-wider">
              Selected element
            </span>
            <button
              onClick={() => onSelectedElementConsumed?.()}
              className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
            >
              ×
            </button>
          </div>
          <div className="font-mono text-[11px] text-[var(--text-secondary)] truncate">
            &lt;{selectedElement.tag}&gt; {selectedElement.text ? `"${selectedElement.text.slice(0, 40)}${selectedElement.text.length > 40 ? "..." : ""}"` : ""}
          </div>
        </div>
      )}

      {/* ---- Attached images preview ---- */}
      {attachedImages.length > 0 && (
        <div className="px-3 pt-2 flex gap-2 flex-wrap">
          {attachedImages.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img.url} alt={img.name} className="w-12 h-12 rounded object-cover border border-[var(--border-subtle)]" />
              <button
                onClick={() => setAttachedImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--error)] text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white font-mono px-1 truncate rounded-b">
                {img.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ---- Input area ---- */}
      <div className="border-t border-[var(--border-subtle)] px-3 py-2">
        {/* Slide context indicator */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            Editing slide {selectedSlideIndex + 1}: {slides[selectedSlideIndex]?.title || "(untitled)"}
          </span>
        </div>
        <div className="flex items-end gap-2">
          {/* Element picker button */}
          <button
            onClick={() => onToggleSelector?.()}
            disabled={isStreaming}
            className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-md border transition-colors disabled:opacity-30 ${
              selectorMode
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40"
            }`}
            title={selectorMode ? "Cancel element picker" : "Pick an element from the slide to discuss"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
          </button>
          {/* Image upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files) return;
              for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await fetch(`/api/admin/deck-builder/${templateId}/media`, {
                    method: "POST",
                    body: formData,
                  });
                  if (res.ok) {
                    const { asset } = await res.json();
                    setAttachedImages((prev) => [...prev, { name: asset.filename, url: asset.url }]);
                  }
                } catch {}
              }
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 transition-colors disabled:opacity-30"
            title="Attach image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder={AGENT_MODES[mode].placeholder}
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-md px-3 py-2 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors duration-150 font-mono disabled:opacity-50"
            style={{ minHeight: "36px", maxHeight: "120px" }}
          />
          {isStreaming ? (
            <button
              onClick={() => {
                abortRef.current?.abort();
                setIsStreaming(false);
                // Mark last assistant message as done
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.role === "assistant" && last.isStreaming) {
                    updated[updated.length - 1] = {
                      ...last,
                      isStreaming: false,
                      content: last.content + "\n\n*[stopped by user]*",
                    };
                  }
                  return updated;
                });
              }}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md bg-[var(--error)]/20 text-[var(--error)] hover:bg-[var(--error)]/30 transition-colors duration-150 border border-[var(--error)]/30"
              aria-label="Stop agent"
              title="Stop the agent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
            </button>
          ) : (
            <button
              onClick={() => trySend(input)}
              disabled={!input.trim()}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
