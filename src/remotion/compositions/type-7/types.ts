// ---------------------------------------------------------------------------
// Type 7: Safety Shield — annotation data interfaces
// ---------------------------------------------------------------------------

/** EU AI Act article reference */
export interface PolicyReference {
  /** Article identifier (e.g. "Art. 52") */
  article: string;
  /** Short description (e.g. "Transparency") */
  label: string;
}

/** Top-level annotation structure for Safety Shield compositions */
export interface Type7Annotation {
  /** The generation prompt being reviewed */
  prompt: string;
  /** Whether the text channel violates policy */
  textPolicyViolation: boolean;
  /** Whether the video channel violates policy */
  videoPolicyViolation: boolean;
  /** Optional EU AI Act or other policy article references */
  policyRefs?: PolicyReference[];
  /** Review pipeline type — single pass or dual-channel (text then video) */
  reviewType: "single" | "dual-channel";
}
