import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { VisualDesignerOutput } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DYNAMIC_VISUAL_PATH = join(process.cwd(), 'src/remotion/blog-visuals/DynamicVisual.tsx');
const REMOTION_ENTRY = join(process.cwd(), 'src/remotion/index.ts');
const OUTPUT_BUCKET = 'moonvalley-annotation-platform';
const CLOUDFRONT_BASE = 'https://d301h7ygdmxuux.cloudfront.net';
const DURATION_FRAMES = 240;
const FPS = 30;

// ---------------------------------------------------------------------------
// System prompt for composition code generation
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are a creative motion designer who writes bespoke Remotion React compositions.
Each composition you write is unique and tailored precisely to the data it visualizes.

Hard rules:
- Import ONLY from 'react' and 'remotion' — no other packages
- No external assets (no Image, Video, Audio, fetch, XMLHttpRequest, require)
- All data is hardcoded inside the component — no props
- Export: export default function DynamicVisual() { ... }
- MUST use <AbsoluteFill> as the root element (required by Remotion)
- MUST call useCurrentFrame() for animation
- Valid TypeScript — no 'any' casts, no ts-ignore
- No canvas, WebGL, or DOM manipulation

Design rules:
- Background: #0a0908 (near-black)
- Accent: #92B090 (sage green)
- Text: #FFFFFF, Muted: #888884, Border: #2a2a28
- fontFamily: 'JetBrains Mono, monospace' for labels/numbers; system-ui or sans-serif for body
- Exactly ${DURATION_FRAMES} frames at ${FPS}fps (${DURATION_FRAMES / FPS} seconds total)
- Final 40 frames: hold at full reveal — no fade-out, clean static frame for screenshots
- Small "CLARU.AI" label bottom-right, 10px, #888884, letterSpacing 0.15em

Make it genuinely share-worthy:
- Key stat/number: 100–160px, fontWeight 700, with textShadow glow
- spring() for all entries: { damping: 12, stiffness: 80 } — slight overshoot looks alive
- Background depth: pick ONE of — CSS radial-gradient bloom OR horizontal scan lines (NOT a loop generating hundreds of divs)
- 2-3 content layers max: background gradient, main content block, accent lines
- Accent bar or line that animates in to frame the content
- Think: "would a robotics ML engineer retweet this?"
- Keep total code under 250 lines — tight and punchy, not sprawling`;

// ---------------------------------------------------------------------------
// Generate composition TSX code via Claude Opus
// ---------------------------------------------------------------------------
async function generateCode(bodyMdx: string, title: string, postType: string): Promise<string | null> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Write a Remotion composition for this blog post.

Post type: ${postType}
Title: ${title}

Body excerpt (use the real data and numbers from this):
${bodyMdx.slice(0, 3000)}

Return ONLY the TypeScript component code. No markdown. No explanation. Start with the import lines.`,
      }],
    });

    if (response.stop_reason === 'max_tokens') {
      console.error('[visual-designer] Response truncated at max_tokens — composition code incomplete');
      return null;
    }

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Strip markdown fences if Claude adds them
    const code = text
      .replace(/^```(?:tsx?|javascript|jsx)?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    // Validate: must export default function and use remotion hooks
    if (!code.includes('export default') || !code.includes('useCurrentFrame')) {
      console.error('[visual-designer] Generated code missing required elements');
      console.error('[visual-designer] Code preview:', code.slice(0, 300));
      return null;
    }

    // Block any forbidden imports — only allow react and remotion
    const importLines = code.match(/^import .+$/gm) ?? [];
    const forbidden = importLines.filter(line => {
      if (line.includes("from 'react'") || line.includes('from "react"')) return false;
      if (line.includes("from 'remotion'") || line.includes('from "remotion"')) return false;
      return true;
    });
    if (forbidden.length > 0) {
      console.error('[visual-designer] Generated code uses forbidden imports:', forbidden);
      return null;
    }

    return code;
  } catch (err) {
    console.error('[visual-designer] Code generation error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write generated code to DynamicVisual.tsx and bundle+render+upload
// ---------------------------------------------------------------------------
async function renderToVideo(slug: string): Promise<string | null> {
  try {
    // Lazy-load heavy modules to avoid pulling them into Next.js bundle
    const [
      { bundle },
      { renderMedia, selectComposition, ensureBrowser },
      { S3Client, PutObjectCommand },
      { readFileSync },
      os,
      path,
    ] = await Promise.all([
      import('@remotion/bundler'),
      import('@remotion/renderer'),
      import('@aws-sdk/client-s3'),
      import('fs'),
      import('os'),
      import('path'),
    ]);

    const outputPath = path.join(os.tmpdir(), `blog-visual-${slug}.mp4`);

    // Ensure a browser binary is available
    await ensureBrowser();

    console.log('[visual-designer] Bundling Remotion project...');
    const serveUrl = await bundle({ entryPoint: REMOTION_ENTRY });

    console.log('[visual-designer] Selecting DynamicVisual composition...');
    const composition = await selectComposition({
      serveUrl,
      id: 'DynamicVisual',
      inputProps: {},
    });

    console.log('[visual-designer] Rendering to mp4...');
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {},
      chromiumOptions: { disableWebSecurity: false },
    });

    console.log('[visual-designer] Uploading to S3...');
    const s3 = new S3Client({
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const s3Key = `blog-visuals/${slug}.mp4`;
    await s3.send(new PutObjectCommand({
      Bucket: OUTPUT_BUCKET,
      Key: s3Key,
      Body: readFileSync(outputPath),
      ContentType: 'video/mp4',
    }));

    const videoUrl = `${CLOUDFRONT_BASE}/${s3Key}`;
    console.log('[visual-designer] Done:', videoUrl);
    return videoUrl;
  } catch (err) {
    console.error('[visual-designer] Render/upload error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export async function runVisualDesigner(
  bodyMdx: string,
  slug: string,
  postType: string,
  postTitle?: string,
): Promise<VisualDesignerOutput> {
  const title = postTitle ?? slug.replace(/-/g, ' ');

  // Phase 1: Generate bespoke composition code via Claude
  console.log('[visual-designer] Generating composition code...');
  const code = await generateCode(bodyMdx, title, postType);

  if (!code) {
    return {
      videoUrl: null,
      compositionId: null,
      inputProps: null,
      compositionCode: null,
      visualConcept: 'code generation failed',
    };
  }

  // Write to the well-known DynamicVisual.tsx file
  try {
    writeFileSync(DYNAMIC_VISUAL_PATH, code, 'utf-8');
    console.log('[visual-designer] Wrote DynamicVisual.tsx');
  } catch (err) {
    console.error('[visual-designer] Failed to write DynamicVisual.tsx:', err);
    return {
      videoUrl: null,
      compositionId: null,
      inputProps: null,
      compositionCode: code,
      visualConcept: 'file write failed',
    };
  }

  // Phase 2: Skip Lambda render (SKIP_REMOTION=true) — Player will render in browser
  if (process.env.SKIP_REMOTION === 'true') {
    return {
      videoUrl: null,
      compositionId: 'DynamicVisual',
      inputProps: null,
      compositionCode: code,
      visualConcept: 'generated (render skipped — use Remotion Player for preview)',
    };
  }

  // Phase 3: Bundle → render → upload → return video URL
  const videoUrl = await renderToVideo(slug);

  return {
    videoUrl,
    compositionId: 'DynamicVisual',
    inputProps: null,
    compositionCode: code,
    visualConcept: videoUrl ? 'rendered and uploaded' : 'render failed — code stored for Player fallback',
  };
}
