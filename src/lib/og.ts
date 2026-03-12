/**
 * Generates a dynamic OG image URL for the /api/og route handler.
 */
export function ogImageUrl(
  title: string,
  options?: { subtitle?: string; category?: string },
): string {
  const params = new URLSearchParams({ title });
  if (options?.subtitle) params.set("subtitle", options.subtitle);
  if (options?.category) params.set("category", options.category);
  return `https://claru.ai/api/og?${params.toString()}`;
}
