import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * DELETE /api/admin/deck-builder/[id]/media/[assetId]
 *
 * Deletes a media asset from S3 and removes the database record.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, assetId } = await params;
  const supabase = createSupabaseAdminClient();

  // ---------- Fetch asset record to get storage_path ----------
  const { data: asset, error: fetchError } = await supabase
    .from("slide_media_assets")
    .select("*")
    .eq("id", assetId)
    .eq("template_id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json(
      { error: "Media asset not found" },
      { status: 404 }
    );
  }

  // ---------- Delete from S3 ----------
  const bucket = process.env.S3_BUCKET_NAME || "claru-data";

  try {
    const s3 = getS3Client();

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: asset.storage_path,
      })
    );
  } catch (error) {
    console.error(
      "[DELETE /api/admin/deck-builder/[id]/media/[assetId]] S3 delete failed:",
      error
    );
    return NextResponse.json(
      { error: "Failed to delete file from storage" },
      { status: 500 }
    );
  }

  // ---------- Delete from database ----------
  const { error: deleteError } = await supabase
    .from("slide_media_assets")
    .delete()
    .eq("id", assetId)
    .eq("template_id", id);

  if (deleteError) {
    console.error(
      "[DELETE /api/admin/deck-builder/[id]/media/[assetId]] DB delete failed:",
      deleteError
    );
    return NextResponse.json(
      { error: "Failed to delete media asset record" },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
