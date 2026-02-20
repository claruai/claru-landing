/**
 * Claru Job Board Curator Agent
 *
 * Uses the Anthropic SDK's tool_use feature to scrape micro1.ai/jobs,
 * adapt listings into Claru annotation positions, deduplicate, and save.
 *
 * Run with:
 *   npx tsx scripts/job-agent.ts
 *
 * Requires:
 *   - ANTHROPIC_API_KEY environment variable
 *   - Playwright browsers installed (`npx playwright install chromium`)
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  MessageParam,
  ContentBlockParam,
  ToolUseBlock,
  ToolResultBlockParam,
} from '@anthropic-ai/sdk/resources/messages';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const JOBS_DIR = path.join(process.cwd(), 'src/data/jobs');
const MAX_TOKENS = 100_000;
const MODEL = 'claude-sonnet-4-6';

const JOB_CATEGORIES = {
  'data-labeling': 'Data Labeling',
  'quality-review': 'Quality Review',
  'video-capture': 'Video Capture',
  gaming: 'Gaming',
  rlhf: 'RLHF',
  'red-teaming': 'Red Teaming',
  'coding-review': 'Coding Review',
  'vision-annotation': 'Vision Annotation',
} as const;

const COMPENSATION_TIERS = {
  entry: { min: 20, max: 35, label: 'Entry' },
  standard: { min: 35, max: 55, label: 'Standard' },
  expert: { min: 55, max: 100, label: 'Expert' },
} as const;

type JobCategory = keyof typeof JOB_CATEGORIES;

interface ExistingJob {
  slug: string;
  title: string;
  category: string;
}

interface ScrapedJob {
  title: string;
  description: string;
  skills: string[];
  compensation: string;
  type: string;
  location: string;
}

// ---------------------------------------------------------------------------
// Tool definitions for Claude
// ---------------------------------------------------------------------------

const tools: Anthropic.Tool[] = [
  {
    name: 'scrape_job_board',
    description:
      'Scrape micro1.ai/jobs to get current AI job listings. Uses Playwright to load the page, scroll through infinite scroll, and extract job data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        max_jobs: {
          type: 'number',
          description: 'Max jobs to scrape (default 20)',
        },
      },
    },
  },
  {
    name: 'list_existing_jobs',
    description:
      'List all existing Claru job slugs and titles to check for duplicates.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'check_duplicate',
    description:
      'Check if a job title is too similar to existing jobs (fuzzy match).',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        category: { type: 'string' },
      },
      required: ['title', 'category'],
    },
  },
  {
    name: 'save_job',
    description: 'Save a new Claru job listing as a JSON file.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string' },
        title: { type: 'string' },
        category: {
          type: 'string',
          enum: [
            'data-labeling',
            'quality-review',
            'video-capture',
            'gaming',
            'rlhf',
            'red-teaming',
            'coding-review',
            'vision-annotation',
          ],
        },
        description: { type: 'string' },
        skills: { type: 'array', items: { type: 'string' } },
        compensationMin: { type: 'number' },
        compensationMax: { type: 'number' },
        locationRequirements: {
          type: 'string',
          description: 'Optional geographic restriction (e.g. "US", "EU")',
        },
        faqs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer: { type: 'string' },
            },
            required: ['question', 'answer'],
          },
        },
      },
      required: [
        'slug',
        'title',
        'category',
        'description',
        'skills',
        'compensationMin',
        'compensationMax',
        'faqs',
      ],
    },
  },
  {
    name: 'get_claru_categories',
    description: 'Get valid Claru job categories and compensation tiers.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

/**
 * Launch a headless browser, navigate to micro1.ai/jobs, scroll to load
 * listings, and extract job data from the page DOM.
 */
async function handleScrapeJobBoard(input: {
  max_jobs?: number;
}): Promise<string> {
  const maxJobs = input.max_jobs ?? 20;
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    console.log('[scrape] Navigating to micro1.ai/jobs...');
    await page.goto('https://www.micro1.ai/jobs', {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });

    // Scroll to load more content (infinite scroll pattern)
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      console.log(`[scrape] Scroll pass ${i + 1}/5`);
    }

    // Extract job listings from the page. The selectors below attempt common
    // patterns; the agent can still work with whatever structure we find.
    const jobs = await page.evaluate((limit: number) => {
      const results: Array<{
        title: string;
        description: string;
        skills: string[];
        compensation: string;
        type: string;
        location: string;
      }> = [];

      // Try multiple selector strategies to find job cards
      const selectors = [
        '[class*="job-card"]',
        '[class*="JobCard"]',
        '[class*="listing"]',
        'article',
        '[data-testid*="job"]',
        '.card',
        '[class*="position"]',
      ];

      let cards: Element[] = [];
      for (const sel of selectors) {
        const found = document.querySelectorAll(sel);
        if (found.length > 2) {
          cards = Array.from(found);
          break;
        }
      }

      // Fallback: grab all links that look like job detail pages
      if (cards.length === 0) {
        const links = document.querySelectorAll('a[href*="/job"]');
        cards = Array.from(links).map(
          (link) => link.closest('div, li, article') ?? link
        );
      }

      // If still nothing, try to get text blocks that look like listings
      if (cards.length === 0) {
        // Get all visible div children of main content area
        const main =
          document.querySelector('main') ??
          document.querySelector('[class*="content"]') ??
          document.body;
        const children = main.querySelectorAll(':scope > div > div');
        cards = Array.from(children).filter(
          (el) =>
            el.textContent && el.textContent.length > 50 && el.children.length > 1
        );
      }

      for (const card of cards.slice(0, limit)) {
        const titleEl =
          card.querySelector('h2, h3, h4, [class*="title"]') ?? card;
        const title = titleEl?.textContent?.trim() ?? '';
        if (!title || title.length < 5) continue;

        // Try to find a description
        const descEl = card.querySelector(
          'p, [class*="description"], [class*="summary"]'
        );
        const description = descEl?.textContent?.trim() ?? '';

        // Try to find skills/tags
        const tagEls = card.querySelectorAll(
          '[class*="tag"], [class*="skill"], [class*="badge"], [class*="chip"]'
        );
        const skills = Array.from(tagEls)
          .map((t) => t.textContent?.trim() ?? '')
          .filter(Boolean);

        // Try to find compensation
        const allText = card.textContent ?? '';
        const compMatch = allText.match(
          /\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*\/\s*(?:hr|hour|mo|month|yr|year))?/i
        );
        const compensation = compMatch ? compMatch[0] : '';

        // Location info
        const locMatch = allText.match(
          /remote|on-?site|hybrid|worldwide|global/i
        );
        const location = locMatch ? locMatch[0] : '';

        // Employment type
        const typeMatch = allText.match(
          /full[- ]?time|part[- ]?time|contract|freelance/i
        );
        const type = typeMatch ? typeMatch[0] : '';

        results.push({ title, description, skills, compensation, type, location });
      }

      return results;
    }, maxJobs);

    await browser.close();
    console.log(`[scrape] Extracted ${jobs.length} job listings`);
    return JSON.stringify({ success: true, count: jobs.length, jobs });
  } catch (error) {
    if (browser) await browser.close();
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[scrape] Error: ${message}`);
    return JSON.stringify({ success: false, error: message, jobs: [] });
  }
}

/**
 * Read every JSON file in the jobs directory and return basic metadata.
 */
function handleListExistingJobs(): string {
  if (!fs.existsSync(JOBS_DIR)) {
    return JSON.stringify({ jobs: [], count: 0 });
  }

  const files = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith('.json'));
  const jobs: ExistingJob[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(JOBS_DIR, file), 'utf-8');
      const data = JSON.parse(raw);
      jobs.push({
        slug: data.slug ?? file.replace('.json', ''),
        title: data.title ?? '',
        category: data.category ?? '',
      });
    } catch {
      // Skip malformed files
    }
  }

  return JSON.stringify({ jobs, count: jobs.length });
}

/**
 * Fuzzy-match a candidate title against existing jobs. Returns true when
 * more than 70% of the significant words in the candidate overlap with
 * an existing title in the same category.
 */
function handleCheckDuplicate(input: {
  title: string;
  category: string;
}): string {
  const existing = JSON.parse(handleListExistingJobs()) as {
    jobs: ExistingJob[];
  };

  const stopWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'for',
    'in',
    'of',
    'to',
    'with',
    'at',
    'by',
    'on',
    'is',
    'ai',
  ]);

  function significantWords(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 1 && !stopWords.has(w))
    );
  }

  const candidateWords = significantWords(input.title);
  if (candidateWords.size === 0) {
    return JSON.stringify({ isDuplicate: false, reason: 'Empty title' });
  }

  for (const job of existing.jobs) {
    const jobWords = significantWords(job.title);
    if (jobWords.size === 0) continue;

    // Count overlapping words
    let overlap = 0;
    for (const word of candidateWords) {
      if (jobWords.has(word)) overlap++;
    }

    const overlapRatio = overlap / Math.min(candidateWords.size, jobWords.size);

    if (overlapRatio > 0.7) {
      return JSON.stringify({
        isDuplicate: true,
        matchedSlug: job.slug,
        matchedTitle: job.title,
        overlapRatio: Math.round(overlapRatio * 100) + '%',
      });
    }
  }

  return JSON.stringify({ isDuplicate: false });
}

/**
 * Persist a fully formed job listing as JSON to the jobs directory.
 */
function handleSaveJob(input: {
  slug: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  compensationMin: number;
  compensationMax: number;
  locationRequirements?: string;
  faqs: Array<{ question: string; answer: string }>;
}): string {
  // Validate category
  const validCategories = Object.keys(JOB_CATEGORIES);
  if (!validCategories.includes(input.category)) {
    return JSON.stringify({
      success: false,
      error: `Invalid category "${input.category}". Valid: ${validCategories.join(', ')}`,
    });
  }

  // Validate compensation range
  if (input.compensationMin < 15 || input.compensationMax > 120) {
    return JSON.stringify({
      success: false,
      error: `Compensation out of range. Min >= 15, Max <= 120. Got: ${input.compensationMin}-${input.compensationMax}`,
    });
  }

  if (input.compensationMin >= input.compensationMax) {
    return JSON.stringify({
      success: false,
      error: 'compensationMin must be less than compensationMax.',
    });
  }

  // Validate slug format
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(input.slug)) {
    return JSON.stringify({
      success: false,
      error: `Invalid slug "${input.slug}". Must be lowercase alphanumeric with hyphens.`,
    });
  }

  // Build the full Job object
  const today = new Date().toISOString().split('T')[0];
  const validThrough = new Date(Date.now() + 90 * 86_400_000)
    .toISOString()
    .split('T')[0];

  const job = {
    slug: input.slug,
    title: input.title,
    category: input.category as JobCategory,
    description: input.description,
    skills: input.skills,
    compensationMin: input.compensationMin,
    compensationMax: input.compensationMax,
    employmentType: 'CONTRACTOR' as const,
    locationType: 'TELECOMMUTE' as const,
    ...(input.locationRequirements
      ? { locationRequirements: input.locationRequirements }
      : {}),
    datePosted: today,
    validThrough,
    featured: false,
    archived: false,
    faqs: input.faqs,
  };

  // Ensure the directory exists
  if (!fs.existsSync(JOBS_DIR)) {
    fs.mkdirSync(JOBS_DIR, { recursive: true });
  }

  const filePath = path.join(JOBS_DIR, `${input.slug}.json`);

  // Refuse to overwrite existing files
  if (fs.existsSync(filePath)) {
    return JSON.stringify({
      success: false,
      error: `File already exists: ${input.slug}.json. Choose a different slug.`,
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(job, null, 2) + '\n', 'utf-8');
  console.log(`[save] Wrote ${filePath}`);

  return JSON.stringify({ success: true, slug: input.slug, filePath });
}

/**
 * Return the valid categories and compensation tiers for reference.
 */
function handleGetClaruCategories(): string {
  return JSON.stringify(
    { categories: JOB_CATEGORIES, compensationTiers: COMPENSATION_TIERS },
    null,
    2
  );
}

// ---------------------------------------------------------------------------
// Tool dispatch
// ---------------------------------------------------------------------------

async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'scrape_job_board':
      return handleScrapeJobBoard(input as { max_jobs?: number });
    case 'list_existing_jobs':
      return handleListExistingJobs();
    case 'check_duplicate':
      return handleCheckDuplicate(input as { title: string; category: string });
    case 'save_job':
      return handleSaveJob(
        input as Parameters<typeof handleSaveJob>[0]
      );
    case 'get_claru_categories':
      return handleGetClaruCategories();
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// ---------------------------------------------------------------------------
// Agent loop
// ---------------------------------------------------------------------------

async function runAgent(): Promise<void> {
  // Preflight check
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      'Error: ANTHROPIC_API_KEY environment variable is not set.\n' +
        'Set it with: export ANTHROPIC_API_KEY="sk-ant-..."'
    );
    process.exit(1);
  }

  const client = new Anthropic();
  let totalTokens = 0;
  let turnCount = 0;

  const systemPrompt = [
    'You are Claru\'s job board curator agent. Your job is to find AI job postings',
    'on micro1.ai, adapt them into Claru annotation positions, and save them.',
    '',
    'Rules:',
    '1) Start by calling get_claru_categories and list_existing_jobs to understand context.',
    '2) Then call scrape_job_board to get fresh listings from micro1.ai/jobs.',
    '3) For each scraped job that maps to a Claru category:',
    '   a) Rewrite the title as a Claru annotation position (clear, specific).',
    '   b) Call check_duplicate to see if it already exists.',
    '   c) If not a duplicate, adapt the job:',
    '      - Write an answer-first description (3 paragraphs). No generic AI-ish buzzwords.',
    '      - Map to the closest Claru category.',
    '      - Normalize compensation to Claru tiers (Entry $20-35/hr, Standard $35-55/hr, Expert $55-100/hr).',
    '      - Pick 4-6 concrete skills.',
    '      - Generate 2-3 relevant FAQs with specific, helpful answers.',
    '      - Create a URL-safe slug from the title.',
    '   d) Call save_job to persist it.',
    '4) After processing all jobs, provide a summary of what was added and skipped.',
    '',
    'Style guidelines for descriptions:',
    '- Lead with what the person will actually do day-to-day.',
    '- Be specific about tools, data types, and workflows.',
    '- No fluffy language like "exciting opportunity" or "revolutionize AI".',
    '- Write as if talking to a skilled professional, not a fresh graduate.',
  ].join('\n');

  const messages: MessageParam[] = [
    {
      role: 'user',
      content:
        'Start the job curation workflow. List existing jobs and categories first, then scrape micro1.ai/jobs, and process each relevant listing.',
    },
  ];

  console.log('='.repeat(60));
  console.log('  Claru Job Board Curator Agent');
  console.log('='.repeat(60));
  console.log(`Model: ${MODEL}`);
  console.log(`Token budget: ${MAX_TOKENS.toLocaleString()}`);
  console.log(`Jobs directory: ${JOBS_DIR}`);
  console.log('');

  while (totalTokens < MAX_TOKENS) {
    turnCount++;
    console.log(`--- Turn ${turnCount} (${totalTokens.toLocaleString()} tokens used) ---`);

    let response;
    try {
      response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        tools,
        messages,
        system: systemPrompt,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`API Error: ${message}`);
      break;
    }

    totalTokens += response.usage.input_tokens + response.usage.output_tokens;
    console.log(
      `  Tokens this turn: +${response.usage.input_tokens + response.usage.output_tokens} (input: ${response.usage.input_tokens}, output: ${response.usage.output_tokens})`
    );

    // Process response content blocks
    const assistantContent: ContentBlockParam[] = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        console.log(`\n[Agent] ${block.text}\n`);
        assistantContent.push({ type: 'text', text: block.text });
      } else if (block.type === 'tool_use') {
        console.log(`[Tool Call] ${block.name}(${JSON.stringify(block.input).slice(0, 120)}...)`);
        assistantContent.push({
          type: 'tool_use',
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>,
        });
      }
    }

    // Append the full assistant message
    messages.push({ role: 'assistant', content: assistantContent });

    // If the agent decided to stop, we are done
    if (response.stop_reason === 'end_turn') {
      console.log('\n[Agent finished]');
      break;
    }

    // Handle tool calls
    if (response.stop_reason === 'tool_use') {
      const toolResults: ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;
        const toolBlock = block as ToolUseBlock;

        try {
          const result = await executeTool(
            toolBlock.name,
            toolBlock.input as Record<string, unknown>
          );
          console.log(
            `  [Result] ${toolBlock.name}: ${result.slice(0, 200)}${result.length > 200 ? '...' : ''}`
          );
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolBlock.id,
            content: result,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          console.error(`  [Error] ${toolBlock.name}: ${message}`);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolBlock.id,
            content: JSON.stringify({ error: message }),
            is_error: true,
          });
        }
      }

      messages.push({ role: 'user', content: toolResults });
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('  Agent Run Complete');
  console.log('='.repeat(60));
  console.log(`Total tokens used: ${totalTokens.toLocaleString()} / ${MAX_TOKENS.toLocaleString()}`);
  console.log(`Turns: ${turnCount}`);

  // Count current jobs
  if (fs.existsSync(JOBS_DIR)) {
    const jobCount = fs
      .readdirSync(JOBS_DIR)
      .filter((f) => f.endsWith('.json')).length;
    console.log(`Total jobs on disk: ${jobCount}`);
  }

  console.log('');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

// Handle --help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Claru Job Board Curator Agent
==============================

Scrapes micro1.ai/jobs for AI annotation job postings, adapts each one
into a Claru position, checks for duplicates, and saves new ones.

Usage:
  npx tsx scripts/job-agent.ts

Environment variables:
  ANTHROPIC_API_KEY   Required. Your Anthropic API key.

The agent will:
  1. List existing Claru jobs to avoid duplicates
  2. Scrape micro1.ai/jobs for current AI listings
  3. For each relevant listing:
     - Rewrite as a Claru annotation position
     - Check for duplicates (fuzzy title matching)
     - Normalize compensation to Claru tiers
     - Generate FAQs
     - Save as JSON to src/data/jobs/
  4. Print a summary of additions and skips

Output:
  New job files are written to src/data/jobs/<slug>.json
`);
  process.exit(0);
}

runAgent().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
