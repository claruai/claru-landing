-- Add media_url column
ALTER TABLE dataset_samples ADD COLUMN IF NOT EXISTS media_url text;

-- Make storage_path nullable (no longer required when using external URLs)
ALTER TABLE dataset_samples ALTER COLUMN storage_path DROP NOT NULL;

-- Copy existing storage_path values into media_url
UPDATE dataset_samples SET media_url = storage_path WHERE media_url IS NULL AND storage_path IS NOT NULL;
