import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const DEFAULT_EXPIRY_SECONDS = 3600; // 1 hour

/**
 * Lazily-initialised S3 client. Created on first call so that env vars
 * are read at runtime (important for edge/serverless cold starts).
 */
function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION,
  });
}

/**
 * Generate a presigned URL for reading a private object from S3.
 *
 * The AWS SDK handles URL-encoding of keys that contain spaces or special
 * characters, so callers should pass the raw object key as stored in S3.
 *
 * @param objectKey - The full S3 object key (e.g. "datasets/abc/video.mp4")
 * @param expiresIn - Expiry time in seconds (default: 3600 = 1 hour)
 * @returns The presigned URL string, or null if generation fails
 */
export async function getS3SignedUrl(
  objectKey: string,
  expiresIn: number = DEFAULT_EXPIRY_SECONDS
): Promise<string | null> {
  const bucket = process.env.S3_BUCKET_NAME;

  if (!bucket) {
    console.error("[s3] S3_BUCKET_NAME environment variable is not set");
    return null;
  }

  try {
    const client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    });

    const url = await getSignedUrl(client, command, { expiresIn });

    return url;
  } catch (error) {
    console.error(
      "[s3] Failed to generate presigned URL:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
