const HIDDEN_KEYS = new Set([
  "userId", "reviewerId", "payoutId", "amount", "paymentStatus",
  "paymentDate", "cost", "browserMetadata", "rejectionReason",
  "rejectionCount", "rejectedAt", "isTestTemplate", "annotationIndex",
  "source_bucket", "source_storage_key", "source_url", "delivery", "tranche",
  "annotationCost", "reviewCost", "projectGuideLink", "slackChannel",
  "ai_enrichment_source", "project_tag", "project_type",
]);

export function stripHiddenKeys(value: unknown, key?: string): unknown {
  if (key && HIDDEN_KEYS.has(key)) return undefined;
  if (Array.isArray(value)) return value.map((v) => stripHiddenKeys(v));
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const stripped = stripHiddenKeys(v, k);
      if (stripped !== undefined) result[k] = stripped;
    }
    return result;
  }
  return value;
}
