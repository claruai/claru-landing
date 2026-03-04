// =============================================================================
// Multi-Agent System — Type Definitions
// US-001: Agent types and interfaces
// =============================================================================

import type { SlideData } from "@/types/deck-builder";

// ---------------------------------------------------------------------------
// Agent Roles
// ---------------------------------------------------------------------------

export type AgentRole = "orchestrator" | "design" | "research" | "qa";

// ---------------------------------------------------------------------------
// Design Brief — passed to the Design Agent
// ---------------------------------------------------------------------------

export interface DesignBrief {
  slideIndex: number;
  currentSlideData: SlideData;
  instruction: string;
  complexity: "simple" | "complex";
  useAnimations: boolean;
  mediaContext: string;
}

// ---------------------------------------------------------------------------
// Research Brief — passed to the Research Agent
// ---------------------------------------------------------------------------

export interface ResearchBrief {
  question: string;
  maxWords: number;
}

// ---------------------------------------------------------------------------
// QA Verdict — returned by the QA Agent
// ---------------------------------------------------------------------------

export interface QAVerdict {
  pass: boolean;
  score: number;
  issues: string[];
  fixes: string[];
}

// ---------------------------------------------------------------------------
// Agent Result — unified return type from any agent call
// ---------------------------------------------------------------------------

export interface AgentResult {
  role: AgentRole;
  result: string;
  slidesUpdated: SlideData[] | null;
  verdict: QAVerdict | null;
  html: string | null;
}
