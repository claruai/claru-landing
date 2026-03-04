// =============================================================================
// Skill Loader — Loads relevant skills as on-demand references for agents
// Follows the progressive disclosure pattern from skill-creator
// =============================================================================

import * as fs from "fs";
import * as path from "path";

const SKILLS_DIR = "/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claude-config/skills";

/**
 * Available skill references relevant to the deck builder agents.
 * Maps a short ID to the skill directory name.
 */
const SKILL_MAP: Record<string, { dir: string; description: string }> = {
  "frontend-slides": {
    dir: "frontend-slides",
    description: "Complete HTML presentation system — style presets, viewport-fitting, animations, navigation",
  },
  "positioning-angles": {
    dir: "positioning-angles",
    description: "8 angle frameworks for finding the hook that sells: Contrarian, Unique Mechanism, Transformation, Enemy, etc.",
  },
  "brand-voice": {
    dir: "brand-voice",
    description: "Extract or build consistent brand voice — personality, tone spectrum, vocabulary guide",
  },
  "direct-response-copy": {
    dir: "direct-response-copy",
    description: "Write copy that converts — headlines, CTAs, persuasion principles from Schwartz, Hopkins, Ogilvy",
  },
  "message-architecture": {
    dir: "message-architecture",
    description: "Structure messaging hierarchy — hook banks, CTA playbooks, proof libraries",
  },
  "ai-image-generation": {
    dir: "ai-image-generation",
    description: "AI image generation best practices — prompt construction, aspect ratios, iteration workflow",
  },
  "ai-creative-strategist": {
    dir: "ai-creative-strategist",
    description: "Research-powered creative strategy — competitor analysis, visual direction previews, briefs",
  },
  "frontend-design": {
    dir: "frontend-design",
    description: "Distinctive UI design principles — bold aesthetics, typography, spatial composition, avoiding generic AI look",
  },
};

/**
 * List available skill references.
 */
export function listSkills(): string {
  const lines = Object.entries(SKILL_MAP).map(
    ([id, { description }]) => `- **${id}**: ${description}`,
  );
  return `Available skill references:\n${lines.join("\n")}\n\nCall load_skill with an ID to load the full skill knowledge.`;
}

/**
 * Load a skill's SKILL.md content (the body, not frontmatter).
 * Returns null if not found.
 */
export function loadSkill(id: string): string | null {
  const entry = SKILL_MAP[id];
  if (!entry) return null;

  const skillPath = path.join(SKILLS_DIR, entry.dir, "SKILL.md");
  if (!fs.existsSync(skillPath)) return null;

  try {
    const content = fs.readFileSync(skillPath, "utf-8");
    // Strip YAML frontmatter (between --- delimiters)
    const bodyMatch = content.match(/^---[\s\S]*?---\s*\n([\s\S]*)$/);
    return bodyMatch ? bodyMatch[1].trim() : content;
  } catch {
    return null;
  }
}

/**
 * Load a specific reference file from within a skill.
 * e.g. loadSkillReference("positioning-angles", "unique-mechanism")
 */
export function loadSkillReference(skillId: string, refName: string): string | null {
  const entry = SKILL_MAP[skillId];
  if (!entry) return null;

  // Check references/ directory
  const refDir = path.join(SKILLS_DIR, entry.dir, "references");
  if (!fs.existsSync(refDir)) return null;

  // Try exact match, then with .md extension
  for (const candidate of [refName, `${refName}.md`, `${refName}.txt`]) {
    const refPath = path.join(refDir, candidate);
    if (fs.existsSync(refPath)) {
      try {
        return fs.readFileSync(refPath, "utf-8");
      } catch {
        return null;
      }
    }
  }

  // List available references if not found
  try {
    const files = fs.readdirSync(refDir);
    return `Reference "${refName}" not found. Available: ${files.join(", ")}`;
  } catch {
    return null;
  }
}
