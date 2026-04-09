-- =============================================================================
-- US-019: Create prospect_signals table
-- Stores flagged opportunities from the daily signal scanner agent.
-- DO UPDATE (not DO NOTHING) so re-scanning refreshes updated_at and
-- allows a future 'reset to new' admin action.
-- =============================================================================

CREATE TABLE public.prospect_signals (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name       text NOT NULL,
  contact_name       text,
  contact_email      text,
  signal_type        text NOT NULL CHECK (signal_type IN (
                       'hiring', 'funding', 'product_launch', 'gtm_file', 'news'
                     )),
  signal_description text NOT NULL,
  source_url         text,
  status             text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'queued', 'skipped')),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Unique: one signal entry per (company, signal type)
ALTER TABLE public.prospect_signals
  ADD CONSTRAINT prospect_signals_company_signal_unique
  UNIQUE (company_name, signal_type);

-- RLS: enable with no policies — only service-role key can access
ALTER TABLE public.prospect_signals ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.prospect_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
