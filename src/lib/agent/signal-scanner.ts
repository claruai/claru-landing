/**
 * US-021: Signal Scanner Agent (daily at 8am ET)
 *
 * Scans gtm/knowledge-graph/companies/ for high-ICP companies
 * not yet in the leads table and writes them to prospect_signals.
 *
 * icp_score scale: 0-100 (knowledge graph files) — NOT 1-10 (lead_crm_data)
 * Threshold: >= 80 (high-confidence ICP targets)
 *
 * Contact info is in the "## Key People" markdown table body — NOT in frontmatter.
 * Use LLM extraction, not frontmatter parsing.
 *
 * Schedule: 0 13 * * * (8am ET = 1pm UTC)
 * See: tasks/agent-schedule.md
 */

export const SIGNAL_SCANNER_AGENT_PROMPT = `
You are the Claru prospect signal scanner. Your job is to scan the GTM knowledge
graph for high-ICP companies that aren't yet in our leads table, and write
them to the prospect_signals table for admin review.

IMPORTANT SCALE NOTE: icp_score in knowledge graph files uses 0-100 scale
(e.g., Sama=95, iMerit=92). Threshold is >= 80, not >= 8. The lead_crm_data.icp_score
column uses 1-10 scale — these are DIFFERENT scales, do not confuse them.

STEPS:

1. LIST COMPANY FILES
   Read all .md files in gtm/knowledge-graph/companies/
   (Use Glob pattern: gtm/knowledge-graph/companies/*.md)

2. FOR EACH FILE:
   a) Parse frontmatter to get:
      - icp_score (0-100 scale)
      - name (company name)
      - domain (or derive from company name)

   b) SKIP if icp_score < 80 (not a high-confidence ICP target)

   c) CHECK IF ALREADY IN LEADS
      Query Supabase (service-role):
      SELECT id FROM leads WHERE email ILIKE '%@{domain}%' LIMIT 1
      If found: SKIP (already in pipeline)

   d) EXTRACT CONTACT INFO — use LLM to read the "## Key People" section
      from the file body (NOT frontmatter — contact info is in the markdown table).
      Find the first row that appears to be the primary contact (highest confidence).
      Extract: contact_name (full name) and contact_email (if available).
      Both are nullable — if extraction fails, set both to NULL.

   e) EXTRACT SIGNAL DESCRIPTION
      Summarize in 1-2 sentences why this company is a target.
      Draw from the file overview, recent activity, or ICP signals.

   f) INSERT INTO prospect_signals:
      INSERT INTO prospect_signals
        (company_name, contact_name, contact_email, signal_type,
         signal_description, source_url, status)
      VALUES
        ({name}, {contact_name}, {contact_email}, 'gtm_file',
         {signal_description}, NULL, 'new')
      ON CONFLICT ON CONSTRAINT prospect_signals_company_signal_unique
      DO UPDATE SET updated_at = now()
      -- DO UPDATE (not DO NOTHING) to refresh updated_at on re-scan

3. LOG SUMMARY
   "Signal scanner complete: {N} files scanned, {M} new signals written, {K} skipped"
`;

/**
 * Parse icp_score from frontmatter.
 * Returns null if not found or not a valid number.
 */
export function parseIcpScore(frontmatter: string): number | null {
  const match = frontmatter.match(/^icp_score:\s*(\d+)/m);
  if (!match) return null;
  const score = parseInt(match[1], 10);
  return isNaN(score) ? null : score;
}

/**
 * Extract domain from a knowledge graph company file's frontmatter.
 */
export function parseDomain(frontmatter: string): string | null {
  const match = frontmatter.match(/^domain:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}
