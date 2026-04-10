-- RPC: get_pipeline_leads
-- Replaces the double round-trip (lead_crm_data + leads join) with a single
-- server-side function. Eliminates ~5s of extra latency on the pipeline page.
-- Deployed: 2026-04-10

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
  smartlead_sequence_step integer
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
    lcd.smartlead_sequence_step
  FROM lead_crm_data lcd
  LEFT JOIN leads l ON l.id = lcd.lead_id
  ORDER BY lcd.last_touch_at ASC NULLS FIRST;
$$;
