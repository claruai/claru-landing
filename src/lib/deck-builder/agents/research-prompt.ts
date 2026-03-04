// =============================================================================
// Research Agent System Prompt — Minimal, the model is smart
// =============================================================================

export function getResearchAgentPrompt(
  question: string,
  maxWords: number = 200,
): string {
  return `Research this and return a concise brief under ${maxWords} words.

QUESTION: ${question}

Use your tools to find information. Return structured markdown with key facts, metrics, and source URLs. Prioritize specifics over generalities. If you can't find reliable info, say so.`;
}
