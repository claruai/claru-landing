import { createSupabaseAdminClient } from "./admin";
import { createSupabaseServerClient } from "./server";

const BUCKET = "dataset-samples";
const DEFAULT_EXPIRY_SECONDS = 3600; // 1 hour

/**
 * Generate a signed URL for reading a private file from the dataset-samples bucket.
 * Uses the server client (anon key) so RLS applies — the caller must have access
 * to the file via lead_dataset_access. Falls back to admin client when called from
 * contexts where RLS is not desired (e.g., admin pages).
 *
 * @param storagePath - The path within the bucket (e.g., "{dataset_id}/samples/{sample_id}/video.mp4")
 * @param expiresIn  - Expiry time in seconds (default: 3600 = 1 hour)
 */
export async function getSignedUrl(
  storagePath: string,
  expiresIn: number = DEFAULT_EXPIRY_SECONDS
): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    console.error("[storage] Failed to generate signed URL:", error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Upload a file to the dataset-samples bucket.
 * Uses the admin (service_role) client to bypass RLS — intended for admin uploads only.
 *
 * @param file - The File object to upload
 * @param path - The destination path within the bucket (e.g., "{dataset_id}/samples/{sample_id}/video.mp4")
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<{ path: string } | null> {
  const supabaseAdmin = createSupabaseAdminClient();

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, {
      upsert: false,
    });

  if (error) {
    console.error("[storage] Failed to upload file:", error.message);
    return null;
  }

  return { path: data.path };
}

/**
 * Delete a file from the dataset-samples bucket.
 * Uses the admin (service_role) client to bypass RLS — intended for admin operations only.
 *
 * @param path - The path of the file to delete within the bucket
 */
export async function deleteFile(path: string): Promise<boolean> {
  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error("[storage] Failed to delete file:", error.message);
    return false;
  }

  return true;
}

/**
 * Generate a signed upload URL for direct client-side uploads.
 * Uses the admin (service_role) client — the resulting URL allows a single upload
 * without authentication headers.
 *
 * @param storagePath - The destination path within the bucket
 */
export async function generateSignedUploadUrl(
  storagePath: string
): Promise<{ signedUrl: string; path: string; token: string } | null> {
  const supabaseAdmin = createSupabaseAdminClient();

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error) {
    console.error(
      "[storage] Failed to generate signed upload URL:",
      error.message
    );
    return null;
  }

  return {
    signedUrl: data.signedUrl,
    path: data.path,
    token: data.token,
  };
}
