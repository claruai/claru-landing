import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteFile } from "@/lib/supabase/storage";

/**
 * DELETE /api/admin/catalog/[id]/samples/[sampleId]
 *
 * Deletes a sample record from the database.
 * - If the sample has a storage_path, also removes the file from Supabase Storage.
 * - If the sample only has a media_url (no storage_path), just deletes the DB record.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sampleId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: datasetId, sampleId } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch the sample to check whether it has a storage_path
  const { data: sample, error: fetchError } = await supabase
    .from("dataset_samples")
    .select("storage_path")
    .eq("id", sampleId)
    .eq("dataset_id", datasetId)
    .single();

  if (fetchError || !sample) {
    return NextResponse.json({ error: "Sample not found" }, { status: 404 });
  }

  // Only attempt storage deletion when the sample has a storage_path
  if (sample.storage_path) {
    const storageDeleted = await deleteFile(sample.storage_path);
    if (!storageDeleted) {
      console.warn(
        `[DELETE sample] Storage delete failed for path: ${sample.storage_path} -- proceeding with DB delete`
      );
    }
  }

  // Delete the DB record
  const { error: deleteError } = await supabase
    .from("dataset_samples")
    .delete()
    .eq("id", sampleId)
    .eq("dataset_id", datasetId);

  if (deleteError) {
    console.error("[DELETE /api/admin/catalog/[id]/samples/[sampleId]]", deleteError);
    return NextResponse.json(
      { error: "Failed to delete sample" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
