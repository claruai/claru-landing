import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { SlideMediaAsset } from "@/types/deck-builder";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
 * GET /api/admin/deck-builder/[id]/media
 *
 * Returns all media assets for a template, ordered by created_at DESC.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: assets, error } = await supabase
    .from("slide_media_assets")
    .select("*")
    .eq("template_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/admin/deck-builder/[id]/media]", error);
    return NextResponse.json(
      { error: "Failed to fetch media assets" },
      { status: 500 }
    );
  }

  return NextResponse.json({ assets: (assets ?? []) as SlideMediaAsset[] });
}

/**
 * POST /api/admin/deck-builder/[id]/media
 *
 * Uploads an image file to S3 and saves metadata to the database.
 * Accepts multipart/form-data with a 'file' field.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // ---------- Parse multipart form data ----------
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  // ---------- Validate mime type ----------
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 }
    );
  }

  // ---------- Validate file size ----------
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 5MB limit" },
      { status: 400 }
    );
  }

  // ---------- Upload to S3 ----------
  const bucket = process.env.S3_BUCKET_NAME || "claru-data";
  const storagePath = `deck-builder/${id}/${crypto.randomUUID()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const s3 = getS3Client();

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: storagePath,
        Body: buffer,
        ContentType: file.type,
      })
    );
  } catch (error) {
    console.error("[POST /api/admin/deck-builder/[id]/media] S3 upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }

  // ---------- Generate accessible URL ----------
  // Use the existing presigner which prefers CloudFront when configured,
  // falling back to S3 presigned URLs.
  let url: string;
  const signedUrl = await getS3SignedUrl(storagePath);
  if (signedUrl) {
    url = signedUrl;
  } else {
    // Fallback to direct S3 URL
    const region = process.env.AWS_REGION || "us-east-1";
    url = `https://${bucket}.s3.${region}.amazonaws.com/${storagePath}`;
  }

  // ---------- Save metadata to database ----------
  const supabase = createSupabaseAdminClient();

  const { data: asset, error: dbError } = await supabase
    .from("slide_media_assets")
    .insert({
      template_id: id,
      filename: file.name,
      storage_path: storagePath,
      url,
      mime_type: file.type,
      file_size_bytes: file.size,
    })
    .select()
    .single();

  if (dbError) {
    console.error("[POST /api/admin/deck-builder/[id]/media] DB insert failed:", dbError);
    return NextResponse.json(
      { error: "Failed to save media asset metadata" },
      { status: 500 }
    );
  }

  return NextResponse.json({ asset: asset as SlideMediaAsset }, { status: 201 });
}
