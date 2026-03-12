/**
 * Build-time constants for SEO and structured data.
 *
 * BUILD_DATE is evaluated once at build time (static generation) and embedded
 * into server-rendered JSON-LD schemas as a freshness signal.
 */
export const BUILD_DATE = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
