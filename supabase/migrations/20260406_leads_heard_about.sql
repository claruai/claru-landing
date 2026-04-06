-- Add heard_about column to leads for tracking acquisition source
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS heard_about text;
