-- Migration: 002_storage_bucket
-- Description: Create the dataset-samples private storage bucket and RLS policies
-- User Story: US-003 — Set up Supabase Storage bucket with access policies
--
-- Bucket structure (per design doc Section 8.1):
--   dataset-samples/
--     {dataset_id}/
--       thumbnail.jpg                  (dataset thumbnail)
--       samples/
--         {sample_id}/
--           video.mp4                  (main sample file)
--           metadata.json              (structured metadata)
--           thumbnail.jpg              (auto-generated or uploaded)

-- 1. Create the private storage bucket
-- No file size limit; allowed MIME types cover video, image, and JSON files.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dataset-samples',
  'dataset-samples',
  false,
  null,
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'image/png', 'image/jpeg', 'image/webp', 'application/json']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS policies

-- Authenticated leads can read files they have been granted access to via lead_dataset_access.
-- The storage_path on dataset_samples matches the object name in the bucket.
CREATE POLICY "Leads can view granted dataset samples"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'dataset-samples'
  AND EXISTS (
    SELECT 1 FROM public.lead_dataset_access lda
    JOIN public.leads l ON l.id = lda.lead_id
    JOIN public.dataset_samples ds ON ds.dataset_id = lda.dataset_id
    WHERE l.supabase_user_id = auth.uid()
    AND ds.storage_path = name
  )
);

-- Admin uploads, deletes, and all other mutations are handled via the service_role key,
-- which bypasses RLS entirely. No additional INSERT/UPDATE/DELETE policies are needed.
