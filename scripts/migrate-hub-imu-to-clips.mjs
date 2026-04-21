// Migrate legacy dataset_samples rows for hub-egocentric-imu-v1 into unified
// clips + dataset_clips tables, AND build IMU stream artifacts modeled on the
// gaming keystroke pattern (gzipped NDJSON + annotation wrapper JSON).
//
// Run from repo root:
//   set -a && source .env.local && set +a
//   node scripts/migrate-hub-imu-to-clips.mjs

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline';
import crypto from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const BUCKET = 'moonvalley-annotation-platform';
const DATASET_ID = '9f280738-4358-466c-b1ea-a85a9ee18a3d';
const LOCAL_FACTORY = `${process.env.HOME}/Downloads/factory_imu_samples-clean`;
const LOCAL_ARCHIVE = `${process.env.HOME}/Downloads/imu-samples-clean`;

function parseSrt(text) {
  if (!text) return [];
  const segs = [];
  const blocks = text.trim().split(/\n\s*\n/);
  for (const b of blocks) {
    const lines = b.trim().split('\n');
    if (lines.length < 3) continue;
    const [, timing, ...rest] = lines;
    const m = timing.match(/(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)/);
    if (!m) continue;
    const toSec = (h, mi, s, ms) => +h * 3600 + +mi * 60 + +s + +ms / 1000;
    segs.push({
      start_sec: toSec(m[1], m[2], m[3], m[4]),
      end_sec: toSec(m[5], m[6], m[7], m[8]),
      label: rest.join(' ').replace(/^\[[^\]]+\]\s*/, ''),
    });
  }
  return segs;
}

async function imuToStream(localPath) {
  const rl = readline.createInterface({ input: fs.createReadStream(localPath) });
  const lines = [];
  let i = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    const r = JSON.parse(line);
    const timeUs = r.t_us_abs ?? r.t_us ?? (r.t_s != null ? Math.round(r.t_s * 1e6) : i * 33333);
    const accStr = r.acc.map((v) => v.toFixed(4)).join(',');
    const gyroStr = r.gyro.map((v) => v.toFixed(4)).join(',');
    lines.push(JSON.stringify({
      timeUs,
      event: 'imu_sample',
      value: `acc=[${accStr}] gyro=[${gyroStr}]`,
      device: 'head-mounted-imu-6dof',
    }));
    i++;
  }
  return { ndjson: lines.join('\n'), count: i };
}

async function upload(key, body, contentType) {
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }));
}

const { data: samples, error } = await supabase
  .from('dataset_samples')
  .select('*')
  .eq('dataset_id', DATASET_ID);
if (error) { console.error(error); process.exit(1); }
console.log(`Migrating ${samples.length} samples`);

let done = 0, errors = 0, skipped = 0;
const CONCURRENCY = 8;

async function processOne(s) {
  try {
    const meta = s.metadata_json || {};
    const isFactory = meta.group === 'factory';
    const base = path.basename(s.s3_object_key).replace(/\.mp4$/, '');
    const localDir = isFactory ? LOCAL_FACTORY : path.join(LOCAL_ARCHIVE, meta.category);
    const imuLocal = isFactory ? path.join(localDir, `${base}_imu.jsonl`) : path.join(localDir, `${base}-imu.jsonl`);
    if (!fs.existsSync(imuLocal)) { skipped++; return; }

    const { ndjson, count } = await imuToStream(imuLocal);
    const streamKey = s.s3_object_key.replace(/\.mp4$/, '.imu-stream.jsonl.gz');
    await upload(streamKey, zlib.gzipSync(ndjson), 'application/gzip');

    let activitySegments = [];
    if (isFactory) {
      const srtPath = path.join(localDir, `${base}.srt`);
      if (fs.existsSync(srtPath)) activitySegments = parseSrt(fs.readFileSync(srtPath, 'utf8'));
    }

    const annJson = {
      clip_type: 'egocentric_video_with_imu',
      imu: {
        format: '6-DOF (3-axis accel + 3-axis gyro)',
        sample_rate_hz: meta.imu_rate_hz || 30,
        sample_count: count,
        acc_units: 'm/s^2',
        gyro_units: 'rad/s',
      },
      activity_segments: activitySegments,
      category: meta.category ?? 'factory',
      scenario: meta.scenario,
      files: [{
        objectId: streamKey,
        kind: 'imu_stream_ndjson_gz',
        description: '6-DOF IMU as NDJSON events. Each line: {timeUs,event:"imu_sample",value:"acc=[x,y,z] gyro=[x,y,z]",device:"head-mounted-imu-6dof"}',
      }],
    };
    const annKey = s.s3_object_key.replace(/\.mp4$/, '.annotation.json');
    await upload(annKey, JSON.stringify(annJson, null, 2), 'application/json');

    const clipId = crypto.randomUUID();
    const techCodec = meta.codec === 'h264' ? 'h264' : 'hevc';
    const duration = isFactory ? 45 : 180;

    const prettyScenario = (meta.scenario || base).replace(/^\d+[_-]/, '').replace(/_/g, ' ');
    const caption = isFactory
      ? `Head-mounted POV factory scenario: ${prettyScenario}. Synchronized 6-DOF IMU + activity-segmented SRT labels.`
      : `Head-mounted POV (${meta.category}): ${prettyScenario}. Synchronized 6-DOF IMU stream.`;

    const { error: cErr } = await supabase.from('clips').insert({
      id: clipId,
      s3_bucket: BUCKET,
      s3_key: s.s3_object_key,
      mime_type: 'video/mp4',
      filename: s.filename ?? path.basename(s.s3_object_key),
      ann_metadata: {
        group: meta.group,
        category: meta.category ?? 'factory',
        scenario: meta.scenario,
        imu_format: '6-DOF (3-axis accel + 3-axis gyro)',
        imu_sample_rate_hz: meta.imu_rate_hz || 30,
        imu_sample_count: count,
        activity_segments: activitySegments,
      },
      ann_annotation_key: annKey,
      ann_specs_key: s.s3_specs_key,
      tech_duration_seconds: duration,
      tech_resolution_width: 1920,
      tech_resolution_height: 1080,
      tech_fps: 30,
      tech_codec: techCodec,
      ai_caption: caption,
    });
    if (cErr) throw new Error(`clips insert: ${cErr.message}`);

    const { error: dcErr } = await supabase.from('dataset_clips').insert({
      dataset_id: DATASET_ID,
      clip_id: clipId,
    });
    if (dcErr) throw new Error(`dataset_clips insert: ${dcErr.message}`);

    done++;
    if (done % 25 === 0) console.log(`  progress: ${done}/${samples.length}`);
  } catch (e) {
    errors++;
    console.error(`  ERR ${s.s3_object_key}: ${e.message}`);
  }
}

for (let i = 0; i < samples.length; i += CONCURRENCY) {
  await Promise.all(samples.slice(i, i + CONCURRENCY).map(processOne));
}

console.log(`\nDone: ${done} succeeded, ${skipped} skipped (no local IMU yet), ${errors} errors`);
