/**
 * Quick test: verify AWS SDK can generate presigned URLs from the app context.
 * Run: node scripts/test-s3-access.mjs
 */
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const value = trimmed.slice(eqIdx + 1);
  if (!process.env[key]) process.env[key] = value;
}

const BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

console.log("\n--- S3 Access Test ---\n");
console.log(`Bucket: ${BUCKET}`);
console.log(`Region: ${REGION}`);
console.log(`Access Key: ${process.env.AWS_ACCESS_KEY_ID?.slice(0, 8)}...`);

const client = new S3Client({ region: REGION });

// Test 1: HeadObject on video
const videoKey = "video_capture/completed/00356662-740a-4f4c-b543-b72a556cf807/7957bf96-8767-4dc8-ac0f-ab3f71e98f3b.mov";
console.log(`\n[Test 1] HeadObject: ${videoKey.slice(0, 60)}...`);
try {
  const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: videoKey }));
  console.log(`  OK - Size: ${(head.ContentLength / 1024 / 1024).toFixed(1)} MB, Type: ${head.ContentType}`);
} catch (err) {
  console.error(`  FAIL - ${err.message}`);
}

// Test 2: Presigned URL for video
console.log(`\n[Test 2] Presigned URL for video`);
try {
  const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: BUCKET, Key: videoKey }), { expiresIn: 3600 });
  console.log(`  OK - URL length: ${url.length} chars`);
  // Verify the URL actually works
  const resp = await fetch(url, { method: "HEAD" });
  console.log(`  HTTP ${resp.status} - ${resp.status === 200 ? "ACCESSIBLE" : "FAILED"}`);
} catch (err) {
  console.error(`  FAIL - ${err.message}`);
}

// Test 3: Fetch annotation JSON
const jsonKey = "video_capture/completed/0253c253-7078-497c-b45c-2f5d40b8fc22/annotation-data.json";
console.log(`\n[Test 3] Fetch annotation JSON: ${jsonKey.slice(0, 60)}...`);
try {
  const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: BUCKET, Key: jsonKey }), { expiresIn: 60 });
  const resp = await fetch(url);
  const json = await resp.json();
  console.log(`  OK - Annotation ID: ${json.id}`);
  console.log(`  generalData: ${JSON.stringify(json.generalData)}`);
  console.log(`  Status: ${json.status}`);
  console.log(`  Files: ${json.files?.length} file(s)`);
} catch (err) {
  console.error(`  FAIL - ${err.message}`);
}

// Test 4: Path with spaces
const spacesKey = "Samples Egocentric Videos/Workplaces /Barista.mov";
console.log(`\n[Test 4] HeadObject with spaces: "${spacesKey}"`);
try {
  const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: spacesKey }));
  console.log(`  OK - Size: ${(head.ContentLength / 1024 / 1024).toFixed(1)} MB, Type: ${head.ContentType}`);
} catch (err) {
  console.error(`  FAIL - ${err.message}`);
}

// Test 5: Video game capture path
const gameKey = "video-game-capture/completed/5b4decad-b774-4e6d-987f-3b0ece399d36/4e5f9206-37f1-4d65-a1bb-c79e96a0fe4e.mp4";
console.log(`\n[Test 5] HeadObject game capture: ${gameKey.slice(0, 60)}...`);
try {
  const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: gameKey }));
  console.log(`  OK - Size: ${(head.ContentLength / 1024 / 1024).toFixed(1)} MB, Type: ${head.ContentType}`);
} catch (err) {
  console.error(`  FAIL - ${err.message}`);
}

console.log("\n--- Test Complete ---\n");
