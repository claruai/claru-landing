# Clip Enrichment Status

> Last updated: 2026-04-16 — ALL PHASES COMPLETE

## Scope: Egocentric Activity Capture (dataset `eb07cf5b`)
- **Total clips**: 231,380
- **S3 bucket**: `moonvalley-annotation-platform`

## Data Layers Per Clip

| Layer | Column(s) | Populated | Gap | Source |
|---|---|---|---|---|
| **Video file** | `s3_key` | 231,380 (100%) | 0 | S3 |
| **AI caption** | `ai_caption` | 231,380 (100%) | 0 | rebuild-clip-captions.py |
| **Search text** | `caption_text` | 231,380 (100%) | 0 | rebuild-clip-captions.py |
| **Embedding** | `embedding` (768-dim) | 231,380 (100%) | 0 | text-embedding-3-small |
| **Enrichment source** | `ai_enrichment_source` | 231,115 (99.9%) | 265 | various enrichment scripts |
| **Annotation key** | `ann_annotation_key` | 231,380 (100%) | 0 | capture app loader + SQL backfill |
| **Annotation metadata** | `ann_metadata` (jsonb) | ~230,905 (99.8%) | ~475 | parsed from annotation JSON |
| **Enrichment JSON** | `ai_enrichment_json` (jsonb) | **230,905 (99.8%)** | 475 | S3 annotation JSON backfill |
| **Tech: duration** | `tech_duration_seconds` | 229,551 (99.2%) | 1,829 | parsed from caption text |
| **Tech: resolution** | `tech_resolution_width/height` | **231,375 (99.998%)** | **5** | ffprobe backfill |
| **Tech: fps** | `tech_fps` | **231,375 (99.998%)** | **5** | ffprobe backfill |
| **Tech: codec** | `tech_codec` | **231,375 (99.998%)** | **5** | ffprobe backfill |
| **Tech: file size** | `tech_file_size_bytes` | **231,375 (99.998%)** | **5** | ffprobe backfill |

## Residual Gaps

- **475 clips** missing `ai_enrichment_json` + `ann_metadata` — S3 annotation JSONs are malformed or missing (Henri Footage files, etc.)
- **5 clips** missing `tech_*` columns — video files likely corrupted or unreadable by ffprobe
- **265 clips** missing `ai_enrichment_source` — never ran through any enrichment pipeline
- **1,829 clips** missing `tech_duration_seconds` — caption text didn't contain parseable duration

## Completed Fixes

### Phase 1: ann_annotation_key backfill (SQL only) — DONE 2026-04-15
- Derive annotation key from s3_key for all clips
- **Result: 77,486 clips fixed. 0 missing across all prefixes.**

### Phase 2: ai_enrichment_json from S3 annotation JSONs (EC2) — DONE 2026-04-16
- `backfill-annotation-json.py` on EC2 (us-east-1, t3.medium)
- Read S3 annotation JSONs → `ai_enrichment_json` + `ann_metadata` columns
- 3 passes with auto-restart on HTTP/2 deadlock
- **Result: 230,905 / 231,380 enriched (99.8%)**
- Rate: ~50 clips/sec with 8 workers, ~1.5 hours total

### Phase 3: tech_* via ffprobe (EC2) — DONE 2026-04-16
- `backfill-tech-metadata.py` on EC2 (us-east-1, t3.medium)
- Presigned URL → ffprobe → width, height, fps, codec, file_size, duration
- 7 passes with auto-restart on HTTP/2 + Cloudflare 400 errors
- **Result: 231,375 / 231,380 enriched (99.998%)**
- Rate: ~6.5 clips/sec with 8 workers, ~11 hours total

## EC2 Cleanup

- **Instance `i-00a86c99588436887`**: TERMINATE
- **Security group `sg-06cbec899f3a87e99`** (claru-enrichment-sg): DELETE
- **Key pair `john-claru-enrichment`**: DELETE
