// =============================================================================
// Model Router — Route messages to the appropriate Claude model tier
// Uses heuristics to send simple edits to Haiku and complex tasks to Sonnet.
// =============================================================================

export type ModelTier = 'fast' | 'standard';

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const SONNET_MODEL = 'claude-sonnet-4-20250514';

const SIMPLE_PATTERNS = [
  /^(change|update|set|fix|edit|make|replace|rename)\s+(the\s+)?(title|heading|body|text|background|image)/i,
  /^(add|put|insert)\s+(a\s+)?(title|heading|subtitle)/i,
];

const COMPLEX_SIGNALS = [
  /custom\s*html/i, /redesign/i, /restructur/i, /rebuild/i,
  /all\s+slides/i, /every\s+slide/i, /entire\s+deck/i,
  /research/i, /search\s+(for|about)/i, /look\s+up/i,
  /generat/i, /creat.*section/i, /variation/i,
  /video\s+grid/i, /animation/i, /gsap/i, /mosaic/i,
];

export function routeModel(message: string): { model: string; tier: ModelTier } {
  if (COMPLEX_SIGNALS.some(p => p.test(message))) {
    return { model: SONNET_MODEL, tier: 'standard' };
  }
  if (message.length < 150 && SIMPLE_PATTERNS.some(p => p.test(message))) {
    return { model: HAIKU_MODEL, tier: 'fast' };
  }
  return { model: SONNET_MODEL, tier: 'standard' };
}

const COMPLEX_TOOLS = new Set([
  'set_slide_html', 'generate_section', 'restructure_deck',
  'apply_to_all_slides', 'web_search', 'get_data_catalog',
  'generate_variations', 'verify_slide',
]);

export function shouldEscalate(toolName: string, tier: ModelTier): boolean {
  return tier === 'fast' && COMPLEX_TOOLS.has(toolName);
}
