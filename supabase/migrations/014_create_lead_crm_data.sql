-- =============================================================================
-- US-002: Create lead_crm_data table
-- Admin-only CRM fields hidden from portal users (who can see leads table).
-- Service-role key bypasses RLS — no policies = only service-role can R/W.
-- =============================================================================

CREATE TABLE public.lead_crm_data (
  lead_id             uuid PRIMARY KEY REFERENCES public.leads(id) ON DELETE CASCADE,
  type                text DEFAULT 'demand' CHECK (type IN ('demand', 'supply')),
  icp_score           int CHECK (icp_score BETWEEN 1 AND 10),
  last_touch_at       timestamptz,
  last_touch_by       text,
  thread_state        text DEFAULT 'cold' CHECK (thread_state IN (
                        'cold', 'warm', 'hot', 'negotiating', 'closed', 'dead'
                      )),
  smartlead_campaign_id bigint,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- RLS: enable with no policies — only service-role key can access
ALTER TABLE public.lead_crm_data ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.lead_crm_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
