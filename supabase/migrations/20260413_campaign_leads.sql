-- =============================================================================
-- Campaign Leads — Shared blackboard for agent swarm orchestration
-- Atomic claim pattern: UPDATE campaign_leads SET claimed_by = $1, claimed_at = now()
--   WHERE id = (SELECT id FROM campaign_leads WHERE status = 'pending'
--   AND claimed_by IS NULL ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1)
--   RETURNING *;
-- =============================================================================

CREATE TABLE IF NOT EXISTS campaign_leads (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id           text NOT NULL,
  lead_email            text NOT NULL,
  attio_record_id       text,
  channel               text NOT NULL CHECK (channel IN ('demand', 'supply')),
  status                text NOT NULL DEFAULT 'pending',
  claimed_by            text,
  claimed_at            timestamptz,
  research_output       jsonb,
  draft_output          jsonb,
  qa_score              numeric,
  qa_failures           jsonb DEFAULT '[]',
  smartlead_campaign_id text,
  smartlead_lead_id     text,
  error_log             jsonb DEFAULT '[]',
  retry_count           int DEFAULT 0,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now(),
  UNIQUE (campaign_id, lead_email)
);
