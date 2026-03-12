/**
 * Canonical entity profile for Claru.
 *
 * Single source of truth for company identity across JSON-LD schemas,
 * llms.txt, OG metadata, and external platform descriptions.
 *
 * When updating any field here, also update the corresponding external
 * profiles listed in tasks/docs/entity-consistency-checklist.md.
 */
export const entityProfile = {
  name: "Claru",
  legalName: "Reka AI Inc.",
  description:
    "Purpose-built human annotation data for frontier AI labs, specializing in text, vision, video, and robotics modalities.",
  tagline: "Expert Human Intelligence for AI Labs",
  url: "https://claru.ai",
  email: "team@claru.ai",
  github: "https://github.com/claruai",
  linkedin: "https://www.linkedin.com/company/claruai",
} as const;

export type EntityProfile = typeof entityProfile;
