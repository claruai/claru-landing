import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Portal IDOR protection.
 *
 * The portal s3-* routes accept a raw S3 object key (or a clipId) from the
 * client. Authentication alone is NOT sufficient — any authed portal user
 * could fetch any key. These helpers verify that the requested clip/key
 * belongs to a dataset the calling user has access to via lead_dataset_access.
 *
 * Access chain:
 *   auth.uid() -> leads.supabase_user_id
 *   leads.id   -> lead_dataset_access.lead_id
 *   dataset_id -> dataset_clips.dataset_id -> clips.id
 *
 * The granted-datasets lookup MUST go through the user's authed Supabase
 * client (not service role) so that lead_dataset_access RLS policies still
 * apply. Looking up which datasets a clip belongs to uses the admin client
 * because dataset_clips and clips have service-role-only RLS.
 */

type Authed = SupabaseClient;

/**
 * Returns the set of dataset_ids the authed user has been granted access to,
 * or null if the user has no lead record at all.
 */
export async function getGrantedDatasetIds(
  authed: Authed,
  userId: string
): Promise<Set<string> | null> {
  // Resolve lead.id from supabase_user_id under RLS.
  const { data: lead, error: leadErr } = await authed
    .from("leads")
    .select("id")
    .eq("supabase_user_id", userId)
    .maybeSingle();

  if (leadErr || !lead) return null;

  const { data: grants, error: grantErr } = await authed
    .from("lead_dataset_access")
    .select("dataset_id")
    .eq("lead_id", lead.id);

  if (grantErr || !grants) return new Set();

  return new Set(grants.map((g: { dataset_id: string }) => g.dataset_id));
}

/**
 * Look up every dataset_id that contains a clip whose s3_key,
 * ann_annotation_key, ann_specs_key, or ann_metadata.files[].objectId
 * matches `objectKey`.
 *
 * Uses admin client because clips/dataset_clips have service-role-only RLS.
 *
 * SECURITY: each predicate is a separate query with the value passed as a
 * parameter to .eq() / .filter(). Do NOT collapse these into a single .or()
 * with template-string interpolation — PostgREST parses .or() filter strings
 * and a comma-or-paren in user input lets an attacker inject extra predicates
 * (e.g. matching clips they shouldn't) and bypass the overlap check.
 */
export async function getDatasetIdsForObjectKey(
  objectKey: string
): Promise<string[]> {
  const admin = createSupabaseAdminClient();

  const [s3KeyHits, annKeyHits, specsKeyHits, filesHits] = await Promise.all([
    admin.from("clips").select("id").eq("s3_key", objectKey),
    admin.from("clips").select("id").eq("ann_annotation_key", objectKey),
    admin.from("clips").select("id").eq("ann_specs_key", objectKey),
    // jsonb containment: ann_metadata->files contains an element with objectId = key
    admin
      .from("clips")
      .select("id")
      .filter("ann_metadata->files", "cs", JSON.stringify([{ objectId: objectKey }])),
  ]);

  const clipIds = new Set<string>();
  for (const result of [s3KeyHits, annKeyHits, specsKeyHits, filesHits]) {
    for (const row of result.data ?? []) {
      clipIds.add((row as { id: string }).id);
    }
  }

  if (clipIds.size === 0) return [];

  const { data: dcRows } = await admin
    .from("dataset_clips")
    .select("dataset_id")
    .in("clip_id", Array.from(clipIds));

  return Array.from(
    new Set((dcRows ?? []).map((r: { dataset_id: string }) => r.dataset_id))
  );
}

/**
 * Returns the set of object keys that are valid for a given clip:
 *   - clips.s3_key
 *   - clips.ann_annotation_key
 *   - clips.ann_specs_key
 *   - every ann_metadata.files[].objectId
 *
 * Used by routes that accept a (clipId, objectKey) pair to ensure the
 * objectKey actually belongs to the clip — without this, an attacker with a
 * grant on clip A can pass arbitrary objectKeys and have them signed/fetched.
 *
 * Returns null if the clip doesn't exist.
 */
export async function getAllowedKeysForClipId(
  clipId: string
): Promise<Set<string> | null> {
  const admin = createSupabaseAdminClient();

  const { data: clip, error } = await admin
    .from("clips")
    .select("s3_key, ann_annotation_key, ann_specs_key, ann_metadata")
    .eq("id", clipId)
    .maybeSingle();

  if (error || !clip) return null;

  const allowed = new Set<string>();
  if (clip.s3_key) allowed.add(clip.s3_key as string);
  if (clip.ann_annotation_key) allowed.add(clip.ann_annotation_key as string);
  if (clip.ann_specs_key) allowed.add(clip.ann_specs_key as string);

  const meta = (clip.ann_metadata ?? {}) as Record<string, unknown>;
  const files = Array.isArray(meta.files) ? meta.files : [];
  for (const f of files) {
    if (f && typeof f === "object" && typeof (f as { objectId?: unknown }).objectId === "string") {
      allowed.add((f as { objectId: string }).objectId);
    }
  }

  return allowed;
}

/**
 * Look up every dataset_id a single clip belongs to.
 */
export async function getDatasetIdsForClipId(
  clipId: string
): Promise<string[]> {
  const admin = createSupabaseAdminClient();
  const { data: dcRows } = await admin
    .from("dataset_clips")
    .select("dataset_id")
    .eq("clip_id", clipId);

  return Array.from(
    new Set((dcRows ?? []).map((r: { dataset_id: string }) => r.dataset_id))
  );
}

/**
 * Returns true if any dataset in `candidateDatasetIds` is in `grantedDatasetIds`.
 */
export function hasOverlap(
  candidateDatasetIds: string[],
  grantedDatasetIds: Set<string>
): boolean {
  for (const id of candidateDatasetIds) {
    if (grantedDatasetIds.has(id)) return true;
  }
  return false;
}
