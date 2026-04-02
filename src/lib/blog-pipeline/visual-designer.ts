import Anthropic from '@anthropic-ai/sdk';
import { BLOG_VISUAL_COMPOSITION_IDS } from '../../remotion/blog-visuals/index';
import type { VisualDesignerOutput } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CLOUDFRONT_BASE = 'https://d301h7ygdmxuux.cloudfront.net';
const OUTPUT_BUCKET = 'moonvalley-annotation-platform';
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 90; // 270s timeout

export async function runVisualDesigner(
  bodyMdx: string,
  slug: string,
  postType: string
): Promise<VisualDesignerOutput> {
  // Guard: skip Remotion if env var set (local testing)
  if (process.env.SKIP_REMOTION === 'true') {
    return {
      videoUrl: null,
      compositionId: null,
      inputProps: null,
      visualConcept: 'skipped',
    };
  }

  // Phase 1: Claude selects composition + extracts typed inputProps
  let compositionId: string | null = null;
  let inputProps: Record<string, unknown> | null = null;
  let visualConcept = 'unselected';

  try {
    const selectionResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a visual designer for a technical blog. Select the best Remotion composition and extract the data to render it.

Available compositions:
- BlogStatCallout: best for a single striking statistic. Props: { stat: string, label: string, context: string }
- BlogDataComparison: best for comparing two approaches side-by-side. Props: { title: string, rows: [{label, a, b}] (max 5) }
- BlogTimeline: best for showing evolution over time. Props: { events: [{date, label}] (max 5) }
- BlogMetricReveal: best for showing before/after improvement. Props: { before: string, after: string, metric: string }
- BlogProcessSteps: best for explaining a process. Props: { steps: string[] (max 5) }

Post type: ${postType}

Blog post body (excerpt):
${bodyMdx.slice(0, 3000)}

Select ONE composition that best visualizes the core insight of this post. Extract real data/numbers from the post body — do NOT fabricate.

Return JSON only:
{
  "compositionId": "BlogStatCallout",
  "inputProps": { "stat": "78%", "label": "policy success rate", "context": "Source: UT Austin study" },
  "visualConcept": "One sentence describing what this visual communicates and why it's the right choice"
}`,
      }],
    });

    const text = selectionResponse.content[0].type === 'text' ? selectionResponse.content[0].text : '';
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      const parsed = JSON.parse(m[0]) as { compositionId: string; inputProps: Record<string, unknown>; visualConcept: string };
      // Validate compositionId is one we know about
      if ((BLOG_VISUAL_COMPOSITION_IDS as readonly string[]).includes(parsed.compositionId)) {
        compositionId = parsed.compositionId;
        inputProps = parsed.inputProps;
        visualConcept = parsed.visualConcept ?? 'auto-selected';
      }
    }
  } catch (err) {
    console.error('[visual-designer] Selection error:', err);
  }

  if (!compositionId || !inputProps) {
    return { videoUrl: null, compositionId, inputProps, visualConcept: 'composition selection failed' };
  }

  // Phase 2: Render via Remotion Lambda
  try {
    const { renderMediaOnLambda, getRenderProgress } = await import('@remotion/lambda/client');

    const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME;
    const serveUrl = process.env.REMOTION_SERVE_URL;

    if (!functionName || !serveUrl) {
      console.warn('[visual-designer] REMOTION_LAMBDA_FUNCTION_NAME or REMOTION_SERVE_URL not set');
      return { videoUrl: null, compositionId, inputProps, visualConcept };
    }

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: 'us-east-1',
      functionName,
      serveUrl,
      composition: compositionId,
      inputProps,
      codec: 'h264',
      outName: {
        key: `blog-visuals/${slug}.mp4`,
        bucketName: OUTPUT_BUCKET,
      },
    });

    // Poll for completion
    let attempts = 0;
    while (attempts < MAX_POLL_ATTEMPTS) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
      attempts++;

      const progress = await getRenderProgress({ renderId, bucketName, functionName, region: 'us-east-1' });

      if (progress.fatalErrorEncountered) {
        throw new Error(`Lambda render fatal error: ${progress.errors?.map(e => e.message).join(', ')}`);
      }

      if (progress.done) {
        const videoUrl = `${CLOUDFRONT_BASE}/blog-visuals/${slug}.mp4`;
        return { videoUrl, compositionId, inputProps, visualConcept };
      }
    }

    throw new Error(`Render timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`);
  } catch (err) {
    console.error('[visual-designer] Lambda render error:', err);
    return { videoUrl: null, compositionId, inputProps, visualConcept };
  }
}
