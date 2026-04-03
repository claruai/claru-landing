process.env.SKIP_REMOTION = 'true';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { runVisualDesigner } from '../src/lib/blog-pipeline/visual-designer';
import { readFileSync } from 'fs';
import { join } from 'path';

const SAMPLE_BODY = `
China's UBTECH, Fourier Intelligence, and Agibot are each targeting 10,000+ humanoid robots per year by late 2026.
The Toyota Research Institute's Diffusion Policy work showed a single dexterous task requires 1,000+ demos.
Open X-Embodiment has ~2M trajectories — orders of magnitude short of what 10K humanoids will consume.
The bottleneck: curated, task-specific physical AI training data — egocentric video, force-torque trajectories, multimodal demos.
`;

async function main() {
  console.log('Testing visual designer code generation...\n');
  const result = await runVisualDesigner(SAMPLE_BODY, 'china-humanoid-test', 'timely', 'China 10K Humanoid Robot Production Line');

  console.log('compositionId:', result.compositionId);
  console.log('visualConcept:', result.visualConcept);
  console.log('compositionCode length:', result.compositionCode?.length ?? 0);

  if (result.compositionCode) {
    console.log('\n─── Generated DynamicVisual.tsx ───\n');
    console.log(result.compositionCode);
  }

  // Also show what's on disk
  const onDisk = readFileSync(join(process.cwd(), 'src/remotion/blog-visuals/DynamicVisual.tsx'), 'utf-8');
  console.log('\n─── DynamicVisual.tsx on disk ───');
  console.log('Length:', onDisk.length, 'chars');
  console.log('Has AbsoluteFill:', onDisk.includes('AbsoluteFill'));
  console.log('Has useCurrentFrame:', onDisk.includes('useCurrentFrame'));
  console.log('Has export default:', onDisk.includes('export default'));
}

main().catch(err => { console.error(err); process.exit(1); });
