-- Migration 019: Add deal stage, sample pack tracking, and follow-up date to lead_crm_data

ALTER TABLE public.lead_crm_data
  ADD COLUMN IF NOT EXISTS deal_stage text
    DEFAULT 'outreach'
    CHECK (deal_stage IN (
      'outreach', 'engaged', 'qualified',
      'sample_pack', 'proposal', 'nda', 'contract', 'closed'
    )),
  ADD COLUMN IF NOT EXISTS sample_pack_status text
    DEFAULT 'none'
    CHECK (sample_pack_status IN ('none', 'requested', 'preparing', 'sent')),
  ADD COLUMN IF NOT EXISTS sample_pack_clips jsonb
    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz;

COMMENT ON COLUMN public.lead_crm_data.deal_stage IS 'Current deal stage in the sales process';
COMMENT ON COLUMN public.lead_crm_data.sample_pack_status IS 'Status of sample data pack request for this lead';
COMMENT ON COLUMN public.lead_crm_data.sample_pack_clips IS 'Array of clip IDs selected for this lead sample pack';
COMMENT ON COLUMN public.lead_crm_data.follow_up_at IS 'Scheduled follow-up date; shown as overdue indicator if in the past';

-- Update get_pipeline_leads RPC to expose new columns
CREATE OR REPLACE FUNCTION public.get_pipeline_leads()
RETURNS TABLE (
  lead_id uuid,
  lead_name text,
  lead_email text,
  company text,
  type text,
  icp_score integer,
  thread_state text,
  waiting_on text,
  last_touch_at timestamptz,
  days_silent integer,
  smartlead_campaign_name text,
  smartlead_sequence_step integer,
  deal_stage text,
  sample_pack_status text,
  follow_up_at timestamptz,
  data_needs text,
  use_case text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    lcd.lead_id,
    l.name              AS lead_name,
    l.email             AS lead_email,
    l.company,
    lcd.type,
    lcd.icp_score,
    lcd.thread_state,
    lcd.waiting_on,
    lcd.last_touch_at,
    CASE
      WHEN lcd.last_touch_at IS NULL THEN 999
      ELSE EXTRACT(DAY FROM now() - lcd.last_touch_at)::integer
    END                 AS days_silent,
    lcd.smartlead_campaign_name,
    lcd.smartlead_sequence_step,
    lcd.deal_stage,
    lcd.sample_pack_status,
    lcd.follow_up_at,
    l.data_needs,
    l.use_case
  FROM lead_crm_data lcd
  LEFT JOIN leads l ON l.id = lcd.lead_id
  ORDER BY lcd.last_touch_at ASC NULLS FIRST;
$$;
