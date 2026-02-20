# Preserving Object Identity Across Video Time

## Slug
object-identity-persistence

## Category
video

## Teaser
Designed a scalable pipeline that pairs objects across time in video — teaching models to maintain identity despite viewpoint, motion, and lighting changes.

## Headline Stat
Scalable pipeline

## Summary
Designed a scalable identity-persistence dataset pipeline for video understanding. The system pairs a clearly defined object from one moment with a later clip from the same licensed source. It combines semantic segmentation, temporal sampling, and human validation to produce training data that teaches models to maintain object identity despite viewpoint, motion, and lighting changes.

## Key Metrics
- High-confidence identity pairs at scale
- Broad category coverage (products, people, animals)
- Licensed video data only

## What We Did
The pipeline works in four stages: (1) select two clips separated by a configurable time gap, (2) sample frames and segment candidate objects, (3) human validators confirm which objects are complete, unobstructed, and identifiable in the later clip, and (4) form identity pairs.

Optional similarity labeling provides finer-grained supervision. The hybrid automation and validation approach minimized annotator effort while maintaining high confidence in the resulting pairs.

## Why It Matters
Identity persistence is foundational for video understanding and generation. Through this work, temporal distance proved as critical as visual clarity — sampling farther apart in time increased identity robustness without adding cost. Models trained on these pairs learn to track and maintain identity across the kind of real-world variation that matters most.
