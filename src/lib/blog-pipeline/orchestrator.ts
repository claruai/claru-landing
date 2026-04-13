import { createClient } from '@supabase/supabase-js';
import { runAnalyst } from './analyst';
import { runResearchTeam } from './research';
import { runWriter } from './writer';
import { runEditor } from './editor';
import { runSeoOptimizer } from './seo-optimizer';
import { runVisualDesigner } from './visual-designer';
import { runAssembler } from './assembler';
import { notifySlack } from './notify';
import type { CrawledItem, PipelineResult, AnalystResult, EditorOutput, SeoOutput, VisualDesignerOutput } from './types';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface PipelineContext {
  crawledItems?: CrawledItem[];
}

async function updateRun(runId: string, updates: Record<string, unknown>): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from('blog_pipeline_runs')
    .update(updates)
    .eq('id', runId);
}

export async function runPipeline(
  postType: 'keyword' | 'timely' | 'case_study',
  context?: PipelineContext
): Promise<PipelineResult> {
  const supabase = getSupabase();

  // Create pipeline run record
  const { data: runData, error: runError } = await supabase
    .from('blog_pipeline_runs')
    .insert({ post_type: postType, status: 'running', phase: 'analyst' })
    .select('id')
    .single();

  if (runError || !runData) {
    console.error('[orchestrator] Failed to create run record:', runError?.message);
    return { success: false, error: 'failed to create run record' };
  }

  const runId = runData.id as string;

  try {
    // ── Phase 1: Analyst ────────────────────────────────────────────────────
    await updateRun(runId, { phase: 'analyst' });
    const analystResult: AnalystResult | null = await runAnalyst(postType, { crawledItems: context?.crawledItems });

    if (!analystResult) {
      await updateRun(runId, { status: 'failed', error: 'analyst returned null — no eligible content' });
      return { success: false, error: 'analyst returned null', runId };
    }

    // Idempotency: if a completed run exists for the same backlog_id, skip
    if (analystResult.backlogId) {
      const { data: existing } = await supabase
        .from('blog_pipeline_runs')
        .select('id, blog_post_id')
        .eq('backlog_id', analystResult.backlogId)
        .eq('status', 'complete')
        .neq('id', runId)
        .limit(1)
        .single();

      if (existing) {
        await updateRun(runId, { status: 'complete', blog_post_id: existing.blog_post_id, completed_at: new Date().toISOString() });
        return { success: true, postId: existing.blog_post_id as string, runId };
      }

      // Update run with backlog_id
      await updateRun(runId, { backlog_id: analystResult.backlogId });
    }

    // ── Phase 2: Research ───────────────────────────────────────────────────
    await updateRun(runId, { phase: 'research' });
    const brief = await runResearchTeam(analystResult);

    // ── Phase 3: Writer ─────────────────────────────────────────────────────
    await updateRun(runId, { phase: 'writer' });
    const draft = await runWriter(analystResult, brief);

    if (!draft) {
      await updateRun(runId, { status: 'failed', error: 'writer returned null' });
      return { success: false, error: 'writer returned null', runId };
    }

    // ── Phase 4: Editor (4A) + SEO (4B) sequential; Visual (4C) parallel ───
    await updateRun(runId, { phase: 'editor' });

    let editorOutput: EditorOutput = { revisedBodyMdx: draft.body_mdx, editorialNotes: [], slopScore: 5 };
    let seoOutput: SeoOutput = { revisedBodyMdx: draft.body_mdx, revisedExcerpt: draft.excerpt, seoNotes: [], geoScore: 50, citabilityScore: 50 };
    let visualOutput: VisualDesignerOutput = { videoUrl: null, compositionId: null, inputProps: null, compositionCode: null, visualConcept: 'not started' };

    // Run 4C (visual) concurrently alongside 4A→4B chain
    const [editorSeoResult, visualResult] = await Promise.allSettled([
      // 4A → 4B chain
      (async () => {
        const editor = await runEditor(draft.body_mdx);
        await updateRun(runId, { phase: 'seo' });
        const seo = await runSeoOptimizer(editor.revisedBodyMdx, draft.excerpt, analystResult);
        return { editor, seo };
      })(),
      // 4C visual
      runVisualDesigner(draft.body_mdx, draft.slug, postType, draft.title),
    ]);

    if (editorSeoResult.status === 'fulfilled') {
      editorOutput = editorSeoResult.value.editor;
      seoOutput = editorSeoResult.value.seo;
    } else {
      console.error('[orchestrator] Editor/SEO chain failed:', editorSeoResult.reason);
    }

    if (visualResult.status === 'fulfilled') {
      visualOutput = visualResult.value;
    } else {
      console.error('[orchestrator] Visual designer failed:', visualResult.reason);
    }

    // ── Phase 5: Assembly ───────────────────────────────────────────────────
    await updateRun(runId, { phase: 'assembly' });
    const assemblyResult = await runAssembler({
      analystResult,
      draft,
      editorOutput,
      seoOutput,
      visualOutput,
      brief,
    });

    if (!assemblyResult) {
      await updateRun(runId, { status: 'failed', error: 'assembler returned null' });
      return { success: false, error: 'assembler returned null', runId };
    }

    // Mark complete
    await updateRun(runId, {
      status: 'complete',
      phase: 'complete',
      blog_post_id: assemblyResult.postId,
      completed_at: new Date().toISOString(),
    });

    // Notify Slack
    try {
      await notifySlack(draft, assemblyResult.postId, postType, undefined, {
        slopScore: editorOutput.slopScore,
        geoScore: seoOutput.geoScore,
        citabilityScore: seoOutput.citabilityScore,
        videoUrl: visualOutput.videoUrl,
        editorialNotes: editorOutput.editorialNotes,
      });
    } catch (notifyErr) {
      console.error('[orchestrator] Slack notification failed:', notifyErr);
    }

    return { success: true, postId: assemblyResult.postId, runId };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[orchestrator] Unexpected error:', errMsg);
    await updateRun(runId, { status: 'failed', error: errMsg });
    return { success: false, error: errMsg, runId };
  }
}
