// Rewrite annotation.json for the Hub egocentric IMU share catalog so the
// `files[]` array lists the ACTUAL attached files (IMU JSONL, CSV, SRT) —
// consumable by a DataFilesPanel-style component. No more synthetic gz stream.
//
// Also deletes the orphan .imu-stream.jsonl.gz files from S3.
//
// Run from repo root:
//   set -a && source .env.local && set +a
//   node scripts/rebuild-hub-imu-annotations.mjs

import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = 'moonvalley-annotation-platform';
const DATASET_ID = '9f280738-4358-466c-b1ea-a85a9ee18a3d';

async function head(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function put(key, body, ct) {
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: ct }));
}

async function del(key) {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch {}
}

const { data: rows, error } = await sb
  .from('dataset_clips')
  .select('clips(id, s3_key, ann_metadata, ann_annotation_key, ann_specs_key)')
  .eq('dataset_id', DATASET_ID);
if (error) { console.error(error); process.exit(1); }

const clips = rows.map((r) => r.clips).filter(Boolean);
console.log(`Rewriting annotations for ${clips.length} clips`);

let done = 0, errors = 0;
const CONC = 8;

async function processOne(clip) {
  try {
    const meta = clip.ann_metadata || {};
    const isFactory = meta.group === 'factory';
    const base = path.basename(clip.s3_key).replace(/\.mp4$/, '');
    const dir = path.dirname(clip.s3_key);

    const jsonlKey = isFactory ? `${dir}/${base}_imu.jsonl` : `${dir}/${base}-imu.jsonl`;
    const csvKey = isFactory ? `${dir}/${base}_imu.csv` : null;
    const srtKey = isFactory ? `${dir}/${base}.srt` : null;
    const gzKey = `${dir}/${base}.imu-stream.jsonl.gz`;

    const files = [];
    if (await head(jsonlKey)) {
      files.push({
        objectId: jsonlKey,
        filename: path.basename(jsonlKey),
        kind: 'imu_jsonl',
        label: 'IMU Stream (JSONL)',
        description: '6-DOF IMU samples (3-axis accel + 3-axis gyro), one sample per line',
      });
    }
    if (csvKey && (await head(csvKey))) {
      files.push({
        objectId: csvKey,
        filename: path.basename(csvKey),
        kind: 'imu_csv',
        label: 'IMU Stream (CSV)',
        description: '6-DOF IMU samples in CSV form (t_s,t_us_abs,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z)',
      });
    }
    if (srtKey && (await head(srtKey))) {
      files.push({
        objectId: srtKey,
        filename: path.basename(srtKey),
        kind: 'activity_srt',
        label: 'Activity Labels (SRT)',
        description: 'Time-segmented activity labels (e.g. operate_lathe_spindle, walk_between_stations)',
      });
    }

    const annJson = {
      clip_type: 'egocentric_video_with_imu',
      imu: {
        format: '6-DOF (3-axis accel + 3-axis gyro)',
        sample_rate_hz: meta.imu_sample_rate_hz ?? 30,
        sample_count: meta.imu_sample_count ?? null,
        acc_units: 'm/s^2',
        gyro_units: 'rad/s',
      },
      activity_segments: meta.activity_segments ?? [],
      category: meta.category ?? 'factory',
      scenario: meta.scenario,
      files,
    };

    await put(clip.ann_annotation_key, JSON.stringify(annJson, null, 2), 'application/json');

    // Delete the synthetic gz (orphan from v1 migration)
    await del(gzKey);

    done++;
    if (done % 10 === 0) console.log(`  progress: ${done}/${clips.length}`);
  } catch (e) {
    errors++;
    console.error(`  ERR ${clip.s3_key}: ${e.message}`);
  }
}

for (let i = 0; i < clips.length; i += CONC) {
  await Promise.all(clips.slice(i, i + CONC).map(processOne));
}
console.log(`\nDone: ${done} rewritten, ${errors} errors`);
