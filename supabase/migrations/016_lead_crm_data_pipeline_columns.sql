-- =============================================================================
-- US-018: Add Active Pipeline columns to lead_crm_data
--
-- No smartlead_next_touch_at — Smartlead API does not expose per-lead
-- next scheduled send date. Use campaign_name + sequence_step instead.
-- All columns nullable — existing rows from Attio backfill start with NULLs.
-- =============================================================================

ALTER TABLE public.lead_crm_data
  ADD COLUMN IF NOT EXISTS smartlead_lead_id    bigint,
  ADD COLUMN IF NOT EXISTS waiting_on           text DEFAULT 'unknown'
                                                  CHECK (waiting_on IN ('us', 'them', 'unknown')),
  ADD COLUMN IF NOT EXISTS smartlead_campaign_name text,
  ADD COLUMN IF NOT EXISTS smartlead_sequence_step int;
