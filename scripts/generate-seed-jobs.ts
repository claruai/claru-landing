/**
 * Seed job content generator.
 *
 * Produces 50 varied JSON job listing files (one file per job) inside
 * `src/data/jobs/`.  Run with:
 *
 *   npx tsx scripts/generate-seed-jobs.ts
 *
 * The script deletes any existing JSON files in the target directory before
 * writing fresh output so that the data set is always deterministic.
 */

import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministic-ish seedable random (Mulberry32). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260217);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Return a random ISO date string within the last `days` days from today. */
function randomRecentDate(days: number): string {
  const now = new Date('2026-02-17');
  const offset = Math.floor(rng() * days);
  const d = new Date(now.getTime() - offset * 86_400_000);
  return d.toISOString().split('T')[0];
}

/** Add `months` calendar months to an ISO date string. */
function addMonths(isoDate: string, months: number): string {
  const d = new Date(isoDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

// Compensation round to nearest 5
function roundTo5(n: number): number {
  return Math.round(n / 5) * 5;
}

// ---------------------------------------------------------------------------
// Types (local mirror -- we only need shapes, not TS path aliases)
// ---------------------------------------------------------------------------

type JobCategory =
  | 'data-labeling'
  | 'quality-review'
  | 'video-capture'
  | 'gaming'
  | 'rlhf'
  | 'red-teaming'
  | 'coding-review'
  | 'vision-annotation';

interface Job {
  slug: string;
  title: string;
  category: JobCategory;
  description: string;
  skills: string[];
  compensationMin: number;
  compensationMax: number;
  employmentType: 'CONTRACTOR';
  locationType: 'TELECOMMUTE';
  locationRequirements?: string;
  datePosted: string;
  validThrough: string;
  featured: boolean;
  archived: boolean;
  faqs: { question: string; answer: string }[];
}

interface CompTier {
  min: number;
  max: number;
}

const TIERS: Record<string, CompTier> = {
  entry: { min: 20, max: 35 },
  standard: { min: 35, max: 55 },
  expert: { min: 55, max: 100 },
};

// ---------------------------------------------------------------------------
// Category templates
// ---------------------------------------------------------------------------

interface CategoryTemplate {
  category: JobCategory;
  titles: string[];
  descriptionParagraphs: string[][];
  skills: string[];
  tiers: (keyof typeof TIERS)[];
  faqs: { question: string; answer: string }[];
  locations: (string | undefined)[];
}

const CATEGORIES: CategoryTemplate[] = [
  // -----------------------------------------------------------------------
  // DATA LABELING
  // -----------------------------------------------------------------------
  {
    category: 'data-labeling',
    titles: [
      'Text Classification Annotator',
      'Data Labeling Specialist',
      'NLP Data Annotator',
      'Multimodal Data Labeler',
      'Content Categorization Specialist',
      'Semantic Annotation Analyst',
      'Structured Data Tagger',
      'Entity Recognition Annotator',
    ],
    descriptionParagraphs: [
      // P1 options (what you will do)
      [
        'You will classify and label text, image, and mixed-media data sets that go straight into training pipelines at major AI research labs. The work is detail-heavy: every annotation you submit gets checked against a rubric before it counts. Most tasks involve reading a piece of content, deciding which labels from a predefined taxonomy apply, and marking spans or bounding regions where relevant. Expect a steady mix of short-burst tasks (a few seconds each) and longer judgment calls that require reading full documents.',

        'This role puts you at the center of the data pipeline. You will apply annotation schemas to raw text and images so that downstream ML models can learn from clean, consistent labels. Day to day, that means opening a queue of tasks, reading the guidelines for the current project, and working through items one by one. Some projects focus on sentiment, others on entity extraction, and a few involve content moderation categories. Every project ships with examples and edge-case documentation, but you still need good instincts for ambiguity.',

        'We need people who can label data accurately at scale. You will work through queues of text snippets, images, or document-image pairs, tagging each item according to a detailed schema. The schemas change from project to project -- one week you might be marking named entities in news articles, the next you might be rating the relevance of search results. Consistency matters more than speed, though we do expect you to hit reasonable throughput targets after the ramp-up period.',

        'Your main job is to turn unstructured data into labeled training examples. Depending on the project, that might mean highlighting spans of text, drawing bounding boxes, assigning categorical labels, or ranking items by relevance. We provide annotation guidelines for every project, and you will go through a short calibration set before starting live work. The labels you produce feed directly into model training runs, so accuracy and consistency have a real impact.',
      ],
      // P2 options (skills and context)
      [
        'Strong reading comprehension is non-negotiable. You should be comfortable reading dense material -- legal text, scientific abstracts, user reviews -- and making quick, accurate decisions about what category or tag applies. Prior experience with tools like Label Studio, Prodigy, or Scale AI is a plus but not required; our platform is browser-based and we will train you on it during onboarding.',

        'We are looking for people who pay attention to the small stuff. The difference between a good annotator and a great one is usually consistency: can you apply the same judgment to item 500 that you applied to item 5? If you have worked in research, editing, QA, or any job that demanded sustained focus on detail, you will do well here. Familiarity with NLP concepts like tokenization, part-of-speech tagging, or named entity recognition helps but is not a hard requirement.',

        'Ideal candidates have a background in linguistics, library science, content moderation, or a related field, but we have also had strong results from career changers who simply care about getting things right. The work is repetitive by nature, so you need to be someone who finds satisfaction in precision rather than novelty. You should be comfortable working independently and hitting deadlines without constant supervision.',
      ],
      // P3 options (logistics / team)
      [
        'Most projects run on weekly cycles. You will receive a batch of tasks on Monday, and the team expects completed work by Friday. Weekly calibration meetings happen over Zoom to align on edge cases and guideline updates. Minimum commitment is 15 hours per week; top contributors regularly log 30+.',

        'Work is fully remote and asynchronous. You pick your own hours as long as you meet weekly volume targets. We pay per accepted annotation, with bonuses for accuracy above 95%. A dedicated project lead is always available on Slack for guideline questions and edge-case discussions.',

        'Schedule is flexible within project deadlines. Most annotators work 15-25 hours per week, though some projects offer surge periods at higher rates. You will communicate with project leads through Slack and attend a brief weekly sync call.',
      ],
    ],
    skills: [
      'Experience with data labeling or annotation platforms',
      'Strong reading comprehension and attention to detail',
      'Ability to maintain consistency across large task volumes',
      'Familiarity with NLP concepts (tokenization, NER, POS tagging)',
      'Comfortable working with ambiguous or edge-case data',
      'Reliable internet connection and quiet workspace',
      'Experience with Label Studio, Prodigy, or similar tools',
      'Background in linguistics, library science, or content moderation',
      'Ability to internalize complex annotation guidelines quickly',
      'Proficient in written English',
    ],
    tiers: ['entry', 'standard', 'expert'],
    faqs: [
      { question: 'What types of data will I be labeling?', answer: 'Projects vary and may include text classification, named entity recognition, image tagging, or multimodal alignment tasks. Detailed instructions and examples are provided for each project.' },
      { question: 'Is there a minimum weekly time commitment?', answer: 'Most projects require 10-15 hours per week minimum. Higher-volume contributors typically get priority access to new projects.' },
      { question: 'How is quality measured?', answer: 'We use inter-annotator agreement and gold-standard checks. You will receive regular feedback on your accuracy scores and can always ask project leads to clarify guidelines.' },
      { question: 'Do I need special software?', answer: 'No. Our annotation platform runs in any modern web browser. We will walk you through setup during onboarding.' },
      { question: 'What happens if I disagree with the guidelines?', answer: 'Flag it. We have a formal escalation process. If you think a guideline is ambiguous or wrong, the project lead reviews it and issues a clarification within 24 hours.' },
    ],
    locations: ['US', 'US', undefined, 'EU', undefined, 'US'],
  },

  // -----------------------------------------------------------------------
  // QUALITY REVIEW
  // -----------------------------------------------------------------------
  {
    category: 'quality-review',
    titles: [
      'Annotation Quality Reviewer',
      'QA Auditor — AI Training Data',
      'Data Quality Analyst',
      'Senior Quality Reviewer',
      'Quality Assurance Lead',
      'Annotation Audit Specialist',
    ],
    descriptionParagraphs: [
      [
        'You will audit completed annotations produced by other team members, checking each one against the project rubric and flagging errors. This is second-pass work: someone else has already labeled the data, and your job is to verify that the labels are correct, consistent, and complete. On a typical day you will review 200-400 items, writing short justifications for every rejection. The work requires sharp attention and the ability to hold a full annotation schema in your head while scanning at speed.',

        'Quality review sits between the annotation team and the client. You will sample completed batches, apply the scoring rubric, and produce accuracy reports that the project lead uses to give feedback to annotators. When you spot systematic errors -- a whole batch misapplying a label, for example -- you escalate to the team lead so the guidelines can be updated. The goal is to keep delivered data above a 95% accuracy threshold across all active projects.',

        'We need reviewers who can spot mistakes that annotators miss. You will work through completed task queues, comparing each annotation against the gold standard and the written guidelines. Some reviews are quick binary checks; others require you to re-read the source material and make a judgment call about whether the original label was defensible. You will also contribute to guideline refinement by documenting recurring error patterns.',

        'This position is about catching errors before labeled data ships to the client. You will open completed annotation batches in our review tool, compare labels against the rubric, and mark each item as accepted, rejected, or flagged for discussion. Rejected items go back to the original annotator with your notes explaining what went wrong. You will also generate weekly quality summary reports for project leads.',
      ],
      [
        'Prior experience in QA, editing, proofreading, or annotation review is strongly preferred. You need to be comfortable giving direct, constructive feedback -- annotators see your rejection notes, so clarity matters. Familiarity with inter-annotator agreement metrics (Cohen\'s kappa, Krippendorff\'s alpha) is a plus. Most important is an eye for detail and the patience to review item after item without letting accuracy slip.',

        'You should have a track record of careful, systematic work. Backgrounds in copy editing, test engineering, clinical data review, or research assistance translate well. We will train you on our specific tools and rubrics, but we cannot teach the underlying mindset: you either notice when something is slightly off, or you do not.',

        'Ideal reviewers combine speed with precision. You need to internalize annotation guidelines deeply enough to spot subtle deviations, not just obvious errors. Good written communication is essential because your rejection notes need to be clear enough that annotators can fix issues without a back-and-forth conversation.',
      ],
      [
        'Reviewers work on the same weekly cadence as annotators but with a one-day offset -- you start reviewing Monday batches on Tuesday. Expect 20-30 hours per week. Weekly calibration sessions keep the review team aligned, and you will have a dedicated Slack channel for real-time questions.',

        'This is remote, asynchronous work. You set your own schedule within project timelines. We pay hourly, with a performance bonus tied to your own review accuracy (audited by a third reviewer on a random sample). Typical reviewers work 15-25 hours per week.',

        'Shifts are flexible. Some reviewers prefer to batch their work into two or three longer sessions per week; others spread it out daily. We are agnostic about schedule as long as turnaround targets are met. A weekly 30-minute sync call with the quality team is the only fixed calendar item.',
      ],
    ],
    skills: [
      'Experience in QA, editing, or annotation review',
      'Strong attention to detail and pattern recognition',
      'Clear, constructive written feedback',
      'Familiarity with inter-annotator agreement metrics',
      'Ability to internalize complex rubrics quickly',
      'Experience with quality assurance tooling',
      'Comfortable providing direct feedback to peers',
      'Background in copy editing, research, or data analysis',
      'Systematic approach to error documentation',
      'Proficient in written English',
    ],
    tiers: ['standard', 'expert'],
    faqs: [
      { question: 'How many items will I review per shift?', answer: 'Volume varies by project complexity. Simple binary reviews might yield 300-400 items per shift; more complex multi-label reviews are closer to 100-150.' },
      { question: 'Will I review work from the same annotators repeatedly?', answer: 'Reviews are typically assigned randomly to avoid bias. Occasionally, targeted reviews are assigned when a specific annotator needs additional QA oversight.' },
      { question: 'How is my own accuracy evaluated?', answer: 'A random sample of your reviews is audited by a senior reviewer each week. Your review accuracy score is shared with you and factors into bonus calculations.' },
      { question: 'Do I interact with annotators directly?', answer: 'Generally no. Your rejection notes are the primary feedback channel. If a systemic issue arises, the project lead handles the conversation with the annotation team.' },
    ],
    locations: ['US', undefined, 'EU', 'US', undefined],
  },

  // -----------------------------------------------------------------------
  // VIDEO CAPTURE
  // -----------------------------------------------------------------------
  {
    category: 'video-capture',
    titles: [
      'Egocentric Video Capture Specialist',
      'First-Person Video Data Collector',
      'Wearable Camera Data Contributor',
      'Indoor Activity Video Recorder',
      'Video Data Collection Specialist',
      'Embodied AI Data Capture Associate',
    ],
    descriptionParagraphs: [
      [
        'You will record first-person video of everyday activities using wearable cameras that we ship to you. The footage trains embodied AI and computer vision models -- these systems need thousands of hours of people doing ordinary things like cooking, tidying, assembling furniture, and moving through rooms. Each recording session follows a detailed protocol that specifies the activity, camera angle, lighting requirements, and duration. Typical sessions last 1-2 hours.',

        'This role involves wearing a body-mounted camera and recording yourself performing scripted household or workspace activities. The footage is used to train robotic manipulation models and indoor navigation systems. You will receive a schedule of activities to record each week, along with setup instructions for camera placement and lighting. After recording, you upload the files through our portal and fill out a brief metadata form describing what happened in each clip.',

        'We are building large-scale first-person video data sets for embodied AI research. Your job is to follow recording protocols in your home or workspace, capturing activities like meal preparation, object manipulation, room navigation, and tool use. Every session has a checklist -- camera calibration, lighting check, activity script review -- that you run through before pressing record. The protocols are detailed but not complicated; the main requirement is consistency.',

        'Record high-quality egocentric video data that feeds directly into computer vision and robotics research. You will use provided wearable cameras to capture footage of daily activities in your own environment. Each recording follows a specific protocol covering what to do, how to position the camera, and what conditions need to be met for the footage to pass quality checks. Sessions are typically scheduled in 90-minute blocks.',
      ],
      [
        'You need a reliable indoor space where you can control lighting -- a kitchen, home office, or workshop works well. We provide all camera equipment and ship it to your address at no cost. Basic tech comfort is important: you should be able to charge a device, pair it via Bluetooth, and upload large files. No filmmaking experience is needed; we care about following the protocol, not cinematic quality.',

        'Comfort with wearable technology is essential. You will wear a small camera mounted on a head strap or chest harness for extended periods. If you have experience with action cameras like GoPro, that helps, but it is not required. What matters most is your ability to follow step-by-step instructions precisely and maintain consistent recording conditions across sessions.',

        'Physical comfort and patience are the key qualifications. Recording sessions require you to wear camera equipment while performing activities naturally -- stiffness or self-consciousness shows up in the data and reduces its value. You should also have access to at least two different indoor environments (e.g., kitchen and living room) to provide scene variety.',
      ],
      [
        'Equipment arrives within 5 business days of acceptance. Onboarding includes a 45-minute video call where a data collection lead walks you through the camera setup and your first recording session. After that, you work independently, uploading footage and receiving new session protocols via the portal.',

        'Most contributors record 3-5 sessions per week, each lasting 60-120 minutes. Payment is per accepted recording hour -- footage that does not meet quality standards may need to be re-captured. Expect to earn for 15-25 billable hours per week once you hit your stride.',

        'Scheduling is up to you within weekly targets. Some contributors record daily in short bursts; others batch sessions into two or three longer days. We ask for a minimum of 10 hours of accepted footage per week to stay active on the project.',
      ],
    ],
    skills: [
      'Comfort wearing and operating body-mounted cameras',
      'Ability to follow detailed recording protocols',
      'Reliable access to varied indoor environments',
      'Strong attention to detail and consistency',
      'Basic video file management skills (uploading, naming)',
      'Availability for at least 10-15 hours per week',
      'Patience for repetitive recording sessions',
      'Basic technical literacy (Bluetooth pairing, device charging)',
      'Access to a kitchen or workshop environment',
      'Good spatial awareness and natural movement on camera',
    ],
    tiers: ['entry', 'standard'],
    faqs: [
      { question: 'Do I need my own camera equipment?', answer: 'No. We ship all cameras and accessories to you at no charge. Equipment must be returned when the engagement ends.' },
      { question: 'Where do recordings take place?', answer: 'Mostly in your home or a similar everyday environment. You will need access to spaces like a kitchen, living room, or home office depending on the recording protocol for that session.' },
      { question: 'What happens if my footage does not pass quality checks?', answer: 'You will get specific feedback about what went wrong -- usually lighting, framing, or protocol deviations -- and can re-record the session. Re-captures are not penalized as long as they are completed within the project window.' },
      { question: 'Is my face visible in the recordings?', answer: 'Egocentric cameras face outward, so your face is generally not visible. Hands, arms, and torso may appear depending on the activity. All footage is used solely for model training and is not published.' },
      { question: 'How long does onboarding take?', answer: 'About one hour. A data collection lead will walk you through equipment setup and your first practice recording on a video call.' },
    ],
    locations: ['US', 'US', undefined, 'US', undefined, 'EU'],
  },

  // -----------------------------------------------------------------------
  // GAMING
  // -----------------------------------------------------------------------
  {
    category: 'gaming',
    titles: [
      'Game Testing Annotator',
      'Interactive Environment Data Collector',
      'Gaming AI Feedback Specialist',
      'Game Simulation Data Contributor',
      'Gameplay Annotation Specialist',
      'Virtual Environment Tester',
    ],
    descriptionParagraphs: [
      [
        'You will play through game environments and simulations while recording your actions, decisions, and outcomes. This data trains reinforcement learning agents and game-playing AI systems. The work is structured -- you follow a playbook that tells you which scenarios to run, what strategies to attempt, and what metadata to log after each session. Think of it as systematic playtesting rather than casual gaming.',

        'We are collecting human gameplay data to train AI agents that operate in interactive 3D environments. You will work through scripted scenarios in various game engines, logging your actions and annotating key decision points. Some sessions require you to play optimally; others ask you to intentionally explore suboptimal strategies so the AI can learn from a broader range of behaviors. Each session produces a replay file and a structured annotation log.',

        'Your job is to generate high-quality human demonstration data by playing games and simulations under controlled conditions. You will follow session protocols that specify the game, the scenario, the objectives, and the annotation requirements. After each session, you fill out a structured form documenting your strategies, mistakes, and key turning points. This data is used to train and evaluate game-playing AI agents.',
      ],
      [
        'You should be a competent gamer with experience across multiple genres -- FPS, strategy, puzzle, and open-world. We do not need esports-level skill, but you do need to be comfortable learning new game mechanics quickly and playing systematically rather than casually. Familiarity with game engines (Unity, Unreal) is helpful for debugging session issues but not required.',

        'Strong spatial reasoning and the ability to articulate your decision-making process are the core skills here. You will often need to explain why you chose a particular action, which means you need to be reflective about your gameplay rather than purely intuitive. Experience with strategy games, puzzle games, or any genre that requires deliberate thinking is particularly valuable.',

        'We are looking for people who can play systematically and document their reasoning. Gaming experience is important, but so is the ability to follow protocols and produce clean annotation logs. If you have done game QA, speedrunning, or competitive gaming, those backgrounds translate well.',
      ],
      [
        'Sessions run 2-4 hours and are scheduled in advance. Most contributors complete 3-4 sessions per week. You will need a PC that meets minimum specs for the game engines we use (we will provide these during onboarding). A stable internet connection is required for real-time data upload.',

        'Work is project-based with fixed session windows. You sign up for available session slots through our scheduling portal. Payment is per completed session, with bonuses for annotation quality. Typical commitment is 10-20 hours per week.',

        'Onboarding includes a practice session where you get familiar with the annotation tools and logging workflow. After that, you receive session assignments weekly. The time commitment is flexible within project deadlines, but we ask for at least 10 hours per week.',
      ],
    ],
    skills: [
      'Broad gaming experience across multiple genres',
      'Strong spatial reasoning and strategic thinking',
      'Ability to articulate decision-making processes clearly',
      'Experience with PC gaming and common game engines',
      'Comfortable following scripted playthrough protocols',
      'Attention to detail in logging and annotation',
      'Familiarity with Unity or Unreal Engine is a plus',
      'Reliable PC meeting minimum hardware requirements',
      'Patience for repetitive scenario replays',
      'Good written communication for annotation logs',
    ],
    tiers: ['entry', 'standard'],
    faqs: [
      { question: 'What kinds of games will I play?', answer: 'Projects span multiple genres including first-person exploration, strategy games, puzzle environments, and physics simulations. The specific games depend on what our AI lab partners are training.' },
      { question: 'Do I need a high-end gaming PC?', answer: 'You need a reasonably capable PC. We will provide minimum specs during onboarding, but generally a mid-range GPU from the last 3-4 years and 16GB of RAM will suffice.' },
      { question: 'Is this like casual game testing?', answer: 'Not quite. Sessions are structured with specific objectives, strategies to try, and annotations to complete. It is more systematic than typical QA playtesting.' },
      { question: 'How is compensation structured?', answer: 'Payment is per completed and accepted session, with quality bonuses. Rates vary by project complexity. Sessions that do not meet annotation standards may need to be repeated.' },
    ],
    locations: ['US', undefined, 'EU', 'US', undefined, 'US'],
  },

  // -----------------------------------------------------------------------
  // RLHF
  // -----------------------------------------------------------------------
  {
    category: 'rlhf',
    titles: [
      'RLHF Preference Annotator',
      'Senior RLHF Evaluator',
      'AI Response Ranking Specialist',
      'Language Model Feedback Analyst',
      'Human Feedback Annotator',
      'LLM Alignment Evaluator',
      'Conversational AI Rater',
    ],
    descriptionParagraphs: [
      [
        'You will evaluate pairs of AI-generated responses and decide which one is better, worse, or roughly equivalent. This preference data is the backbone of reinforcement learning from human feedback -- it teaches language models to produce outputs that humans actually find helpful, accurate, and safe. Each task shows you a prompt and two candidate responses. You read both carefully, apply the scoring rubric, select your preference, and write a short justification explaining your reasoning.',

        'This role is about making judgment calls on AI output quality. You will see prompts across a wide range of topics -- math, coding, creative writing, factual questions, safety scenarios -- and rate the corresponding model responses on dimensions like helpfulness, truthfulness, and harmlessness. Some comparisons are obvious; many are genuinely difficult and require you to weigh tradeoffs between competing virtues. Your ratings directly shape how the model behaves in production.',

        'We need evaluators who can read AI-generated text critically and make consistent quality judgments under detailed rubrics. On a given day you might compare two explanations of quantum mechanics, two pieces of marketing copy, and two responses to a sensitive personal question. The common thread is careful reading, rubric application, and clear written justifications. Speed matters, but not at the expense of thoughtfulness.',

        'You will sit at the intersection of AI training and human judgment. Each task presents a prompt-response pair (or set of pairs) that you evaluate against a detailed rubric covering accuracy, helpfulness, safety, and style. Your evaluations feed directly into the reward model that steers how the LLM is fine-tuned. This means your judgment literally changes the behavior of the model millions of people interact with.',
      ],
      [
        'Strong analytical writing is the single most important skill. You need to be able to read a complex response, identify what is good and what is wrong with it, and explain your assessment in 2-3 sentences. Backgrounds in philosophy, journalism, law, science, or education tend to produce strong RLHF annotators because those fields train exactly this kind of evaluative thinking.',

        'We look for people with sharp critical reading skills and the intellectual range to evaluate responses on topics they may not be experts in. You do not need to know everything -- but you do need to know how to spot when an AI is confidently wrong, subtly misleading, or superficially helpful without actually addressing the question. Prior experience with RLHF annotation pipelines (e.g., at Scale, Surge, or Invisible) is a strong plus.',

        'Ideal candidates have a graduate-level education or equivalent professional experience in a field that requires careful argumentation and evidence evaluation. We have had especially strong results from people with backgrounds in academic research, technical writing, legal analysis, and scientific peer review. Familiarity with LLM failure modes -- hallucination, sycophancy, refusal errors -- is valuable.',
      ],
      [
        'Annotators work in focused sessions of 3-6 hours at a time, scheduling their own shifts within project windows. Weekly volume targets are typically 20-30 hours but can scale up during surge periods. A weekly calibration meeting aligns the team on rubric updates and tricky edge cases.',

        'This is intellectually demanding work. We recommend working in focused blocks with breaks rather than marathon sessions. Most annotators settle into a rhythm of 4-5 hour focused sessions, 4-5 days per week. Compensation is hourly, with accuracy bonuses.',

        'Onboarding takes about one week and includes rubric training, practice tasks with feedback, and a calibration exam. After onboarding, you work asynchronously on your own schedule. A Slack workspace provides real-time access to project leads and fellow annotators for guideline questions.',
      ],
    ],
    skills: [
      'Strong analytical and critical thinking skills',
      'Excellent written English communication',
      'Experience with RLHF or preference labeling pipelines',
      'Familiarity with LLM capabilities and failure modes',
      'Ability to follow detailed annotation guidelines consistently',
      'Background in linguistics, philosophy, law, or STEM',
      'Graduate-level education or equivalent professional experience',
      'Comfort evaluating content across diverse subject areas',
      'Good judgment on safety and sensitivity issues',
      'Experience with AI evaluation rubrics',
    ],
    tiers: ['standard', 'expert'],
    faqs: [
      { question: 'What does a typical workday look like?', answer: 'You receive batches of prompt-response pairs to evaluate. Each batch includes a rubric. Most annotators work 4-6 hour focused sessions and choose their own schedules within project deadlines.' },
      { question: 'Do I need prior RLHF experience?', answer: 'It helps but is not required. Candidates with strong analytical writing backgrounds and familiarity with AI systems are encouraged to apply. We provide thorough onboarding and calibration training.' },
      { question: 'What tools are used?', answer: 'Our proprietary annotation platform runs in any modern browser. No special hardware or software needed beyond a stable internet connection and a keyboard.' },
      { question: 'How subjective are the judgments?', answer: 'The rubric constrains most subjectivity. You will find that roughly 70% of comparisons have a clear best answer. The remaining 30% involve genuine tradeoffs, and those are where your written justifications matter most.' },
      { question: 'Is there a calibration process?', answer: 'Yes. Onboarding includes a calibration exam where your ratings are compared against gold-standard responses. You receive detailed feedback and must reach a threshold accuracy before starting live work.' },
    ],
    locations: ['US', undefined, 'EU', 'US', undefined, 'US', undefined],
  },

  // -----------------------------------------------------------------------
  // RED TEAMING
  // -----------------------------------------------------------------------
  {
    category: 'red-teaming',
    titles: [
      'AI Red Team Specialist',
      'Adversarial Prompt Engineer',
      'Safety Evaluation Analyst',
      'LLM Vulnerability Tester',
      'AI Safety Red Teamer',
      'Prompt Attack Researcher',
    ],
    descriptionParagraphs: [
      [
        'You will try to break AI systems. Your job is to craft prompts that cause language models to produce harmful, inaccurate, biased, or policy-violating outputs. Each session focuses on a specific attack vector -- jailbreaking, prompt injection, social engineering, bias elicitation, or factual manipulation. You document every attempt, successful or not, in a structured report that the safety team uses to patch vulnerabilities before the model ships.',

        'This role is adversarial by design. You will probe language models for weaknesses by writing creative, unusual, and sometimes uncomfortable prompts designed to surface failure modes. Think of yourself as a security researcher, but for AI behavior instead of network infrastructure. Every vulnerability you find helps the model become safer for end users. The work requires creativity, persistence, and a willingness to explore dark corners of model behavior systematically.',

        'We need people who can think like attackers. You will methodically test AI models against a taxonomy of failure modes: harmful content generation, jailbreak susceptibility, PII leakage, bias amplification, and more. Each test is logged in a structured format that feeds into the safety team\'s tracking system. Successful exploits are prioritized for mitigation; unsuccessful attempts still provide valuable negative evidence.',
      ],
      [
        'A background in cybersecurity, penetration testing, or adversarial ML is ideal, but we have also had strong hires from journalism, law, and creative writing -- anyone who is good at finding holes in systems and articulating what they found. You need to be comfortable working with sensitive content categories (violence, hate speech, self-harm) in a clinical, analytical context. Emotional resilience is not optional.',

        'The strongest red teamers combine technical curiosity with lateral thinking. You should be the kind of person who reads a policy document and immediately starts thinking about edge cases and loopholes. Familiarity with prompt engineering techniques, model architectures, and AI safety research literature is valuable. You should also be comfortable writing clear, detailed vulnerability reports.',

        'You need strong written communication skills -- every finding must be documented well enough that someone who was not in the room can understand what you did, why it matters, and how to reproduce it. Comfort with structured reporting formats (similar to CVE reports or bug bounty submissions) is a plus.',
      ],
      [
        'Red team sessions are scheduled in 3-4 hour blocks. Most testers work 3-5 sessions per week. The work is mentally intense, so we encourage breaks between sessions. A weekly debrief with the safety team reviews top findings and updates attack priorities.',

        'This is project-based work with defined evaluation periods. You will be assigned specific models and attack categories for each evaluation cycle (typically 2-4 weeks). Compensation is hourly with significant bonuses for high-severity findings. Expect 15-25 hours per week.',

        'Onboarding includes a detailed walkthrough of our taxonomy of failure modes, the reporting template, and the specific model you will be testing. After onboarding, you work independently but can raise urgent findings through a priority Slack channel.',
      ],
    ],
    skills: [
      'Experience in cybersecurity, pen testing, or adversarial ML',
      'Creative and lateral thinking about system vulnerabilities',
      'Strong written communication for vulnerability reporting',
      'Comfort working with sensitive content categories',
      'Familiarity with prompt engineering techniques',
      'Understanding of AI safety concepts and failure modes',
      'Systematic approach to testing and documentation',
      'Emotional resilience when encountering disturbing content',
      'Background in security research, journalism, or law',
      'Ability to reproduce and clearly document exploits',
    ],
    tiers: ['standard', 'expert'],
    faqs: [
      { question: 'Will I be exposed to disturbing content?', answer: 'Yes. Red teaming by definition involves attempting to elicit harmful outputs. We provide content warnings, mental health resources, and encourage regular breaks. You should be confident in your ability to work with this material professionally.' },
      { question: 'What models will I be testing?', answer: 'We work with frontier language models from several major AI labs. Specific model details are shared under NDA during onboarding.' },
      { question: 'How are findings prioritized?', answer: 'We use a severity scale similar to CVSS. Critical findings (reliable jailbreaks, PII leakage) are escalated immediately. Lower-severity issues (mild bias, style inconsistencies) are batched for review.' },
      { question: 'Do I need a technical background?', answer: 'It helps but is not strictly required. We look for creative, methodical thinkers. Some of our most effective red teamers come from non-technical backgrounds like investigative journalism or legal analysis.' },
    ],
    locations: ['US', 'US', undefined, 'US', 'EU', undefined],
  },

  // -----------------------------------------------------------------------
  // CODING REVIEW
  // -----------------------------------------------------------------------
  {
    category: 'coding-review',
    titles: [
      'Code Review Annotator',
      'Software Output Evaluator',
      'AI Code Quality Reviewer',
      'Programming Task Evaluator',
      'Code Correctness Analyst',
      'Technical Code Assessor',
      'Developer Feedback Annotator',
    ],
    descriptionParagraphs: [
      [
        'You will evaluate code generated by AI models. Each task shows you a programming prompt and one or more candidate solutions. Your job is to assess correctness, efficiency, readability, and adherence to best practices, then rank the solutions and write a brief justification. Languages vary by project but commonly include Python, JavaScript/TypeScript, Java, C++, and SQL. Some tasks also ask you to identify bugs, suggest fixes, or rate the quality of inline comments and documentation.',

        'This role feeds directly into code-generation model training. You will review AI-written code across multiple languages and evaluate it on dimensions like functional correctness, runtime efficiency, code style, and security. Each review includes running the code (or mentally tracing it) to verify it produces the expected output, then scoring it against a rubric. You also write short explanations of any issues you find -- these justifications become part of the training signal.',

        'We need developers who can read code critically and fast. You will evaluate AI-generated solutions to programming problems, checking for correctness, edge-case handling, performance, and idiomatic style. The work is similar to doing code reviews at a software company, except you are reviewing AI output instead of a colleague\'s pull request. Each evaluation takes 5-15 minutes depending on complexity.',

        'Your job is to serve as the human quality bar for AI-generated code. You will review solutions to programming tasks ranging from simple algorithm problems to multi-file application scaffolding. For each solution, you verify correctness (does it actually work?), assess quality (is it well-structured and readable?), and identify issues (bugs, security holes, anti-patterns). Your evaluations train the next generation of coding assistants.',
      ],
      [
        'You should be a working or recently active software developer with at least 2 years of professional experience. We need you to be genuinely comfortable reading and understanding code in at least two of the following: Python, JavaScript/TypeScript, Java, C++, Go, Rust. A CS degree is not required, but you do need solid fundamentals -- data structures, algorithms, common design patterns, and an understanding of time/space complexity.',

        'Proficiency in at least two programming languages is required. You should be able to spot off-by-one errors, recognize when an algorithm has worse-than-necessary time complexity, and tell the difference between code that works and code that is actually good. Professional software development experience is strongly preferred. If you regularly do code reviews as part of your day job, this work will feel familiar.',

        'We look for developers who care about code quality -- not just whether it runs, but whether it is maintainable, efficient, and clear. Experience with code review tools (GitHub PRs, Gerrit, Crucible) is a plus. Strong knowledge of software testing principles helps because some evaluations require you to reason about edge cases and test coverage.',
      ],
      [
        'Evaluations are available around the clock and you can work whenever suits you. Most reviewers work 15-25 hours per week. Languages and task difficulty are tagged, so you can filter for tasks that match your strongest skills. Compensation is hourly, scaled by task complexity.',

        'Work is fully asynchronous. You choose which tasks to pick up based on language and difficulty filters. A weekly sync call with the project lead covers rubric updates and edge-case discussions. Minimum commitment is 10 hours per week.',

        'After a one-hour onboarding session covering the evaluation rubric and annotation tool, you start with a calibration set of 10 tasks. Once you pass calibration, live tasks are available immediately. Turnaround expectations are per-batch, typically 48-72 hours.',
      ],
    ],
    skills: [
      'Proficiency in Python, JavaScript/TypeScript, or Java',
      'At least 2 years professional software development experience',
      'Strong understanding of data structures and algorithms',
      'Experience with code review processes and tools',
      'Ability to identify bugs, anti-patterns, and security issues',
      'Knowledge of software testing principles',
      'Familiarity with multiple programming paradigms',
      'Clear written communication for evaluation justifications',
      'Understanding of time and space complexity analysis',
      'Experience with version control (Git)',
    ],
    tiers: ['standard', 'expert'],
    faqs: [
      { question: 'What programming languages will I review?', answer: 'Most tasks involve Python, JavaScript/TypeScript, Java, or C++. Less common tasks may involve Go, Rust, or SQL. You can filter for languages you are comfortable with.' },
      { question: 'Do I need to run the code?', answer: 'Some tasks provide test cases and expect you to verify output. Others rely on manual code tracing. We provide a sandboxed execution environment for tasks that require running code.' },
      { question: 'How long does each review take?', answer: 'Simple function-level tasks take 5-10 minutes. More complex multi-file evaluations can take 15-30 minutes. Compensation scales with task complexity.' },
      { question: 'Can I specialize in one language?', answer: 'Yes, though reviewers who cover multiple languages get access to more tasks and higher volume. We recommend being comfortable in at least two languages.' },
    ],
    locations: ['US', undefined, 'EU', undefined, 'US', 'US', undefined],
  },

  // -----------------------------------------------------------------------
  // VISION ANNOTATION
  // -----------------------------------------------------------------------
  {
    category: 'vision-annotation',
    titles: [
      'Image Annotation Specialist',
      'Computer Vision Data Labeler',
      'Bounding Box Annotation Expert',
      'Visual Data Annotator',
      'Semantic Segmentation Annotator',
      'Scene Understanding Labeler',
    ],
    descriptionParagraphs: [
      [
        'You will annotate images and video frames for computer vision model training. Tasks include drawing bounding boxes around objects, creating pixel-level segmentation masks, labeling object attributes, and classifying scenes. The data covers a range of domains -- autonomous driving, medical imaging, retail shelf analysis, and satellite imagery. Each project comes with a visual annotation guide showing exactly what to label and how to handle edge cases.',

        'This role is about precision marking. You will use our web-based annotation tool to identify and outline objects in images, classify their properties, and annotate spatial relationships. Some projects involve simple bounding boxes; others require polygon segmentation at near-pixel accuracy. The quality bar is high because the models trained on your annotations will make real-world decisions -- a mislabeled pedestrian in a driving data set is not a minor error.',

        'We need annotators who can mark visual data accurately and efficiently. You will work through image queues, applying labels, bounding boxes, keypoints, or segmentation masks according to project-specific guidelines. Some tasks involve single-frame annotation; others require tracking objects across video sequences. Attention to spatial detail is critical -- the difference between a good and bad annotation is often just a few pixels.',

        'Your work turns raw images into structured training data for vision models. On any given day you might label objects in street scenes, segment tumors in medical scans, or identify products on retail shelves. Every project has a detailed visual guide with annotated examples, edge-case documentation, and quality criteria. You will go through a calibration set before starting live work on each new project.',
      ],
      [
        'Prior experience with annotation tools like CVAT, Labelbox, V7, or Supervisely is preferred but not required -- our platform is intuitive and we train you during onboarding. What we cannot teach is visual acuity and spatial precision. You should have a good eye for detail and the patience to outline objects carefully rather than rushing through tasks. Familiarity with basic computer vision concepts (object detection, segmentation, keypoints) is a plus.',

        'You should be comfortable working with visual data for extended periods. The work requires sustained focus and steady hand-eye coordination, especially for segmentation tasks. A monitor with at least 1080p resolution is required; larger screens are better. If you have experience in graphic design, medical imaging, cartography, or GIS, those skills transfer directly.',

        'We look for annotators who balance speed and accuracy well. Some people are very precise but too slow; others are fast but sloppy. The sweet spot is consistent, efficient annotation that stays within quality thresholds. A background in any visually detailed field -- illustration, photography, radiology, geographic mapping -- is a strong signal.',
      ],
      [
        'Projects run in weekly sprints with clear volume targets. You will know at the start of each week how many images or frames to annotate. Most annotators work 15-25 hours per week. A brief weekly call with the project lead covers guideline updates and quality feedback.',

        'Work is fully remote and available around the clock. You can work in any time zone. Compensation is per accepted annotation with bonuses for high accuracy. We recommend working in focused 2-3 hour blocks to maintain annotation quality.',

        'After onboarding, you will complete a calibration set for each new project type. Once you pass calibration, live tasks become available. Volume scales with your accuracy -- high-quality annotators get priority access to new projects and premium tasks.',
      ],
    ],
    skills: [
      'Experience with image annotation tools (CVAT, Labelbox, V7)',
      'Strong visual acuity and spatial precision',
      'Attention to detail in bounding box and segmentation tasks',
      'Familiarity with computer vision concepts',
      'Patience for detailed, repetitive visual work',
      'Monitor with at least 1080p resolution',
      'Comfortable working with diverse image domains',
      'Background in graphic design, GIS, or medical imaging is a plus',
      'Good hand-eye coordination for precise polygon drawing',
      'Ability to follow visual annotation guidelines consistently',
    ],
    tiers: ['entry', 'standard', 'expert'],
    faqs: [
      { question: 'What types of images will I annotate?', answer: 'Projects cover autonomous driving scenes, medical imagery, satellite photos, retail product images, and more. You will be assigned projects based on your skills and clearances.' },
      { question: 'Do I need special hardware?', answer: 'A computer with a mouse (trackpad is not recommended for precision tasks) and a monitor of at least 1080p. A graphics tablet is optional but can improve segmentation speed.' },
      { question: 'How is annotation quality measured?', answer: 'We measure IoU (intersection over union) for bounding boxes and segmentation masks, and classification accuracy for label tasks. Your scores are visible in your dashboard.' },
      { question: 'Can I work on multiple project types?', answer: 'Yes. After completing calibration for a project type, you can take on tasks from that category. Most annotators qualify for 2-3 project types within their first month.' },
      { question: 'What is the turnaround time for feedback?', answer: 'Quality scores update daily. If an annotation is rejected, you receive specific feedback within 24 hours explaining what to correct.' },
    ],
    locations: ['US', undefined, 'EU', 'US', undefined, undefined],
  },
];

// ---------------------------------------------------------------------------
// Job generation
// ---------------------------------------------------------------------------

function generateJobs(): Job[] {
  const jobs: Job[] = [];
  const usedTitles = new Set<string>();
  const usedSlugs = new Set<string>();
  const usedDescriptions = new Set<string>();

  // Target distribution: 50 jobs across 8 categories, ~6-7 each
  const distribution: Record<JobCategory, number> = {
    'data-labeling': 7,
    'quality-review': 6,
    'video-capture': 6,
    'gaming': 6,
    'rlhf': 7,
    'red-teaming': 6,
    'coding-review': 6,
    'vision-annotation': 6,
  };

  for (const template of CATEGORIES) {
    const count = distribution[template.category];

    for (let i = 0; i < count; i++) {
      // Pick a unique title
      let title: string;
      let attempts = 0;
      do {
        title = pick(template.titles);
        // Add a suffix if we exhaust unique titles
        if (attempts > template.titles.length * 2) {
          const suffixes = ['(Remote)', '— Part Time', '— Full Time', '(Flexible Hours)', '— Senior', '— Contract'];
          title = `${pick(template.titles)} ${pick(suffixes)}`;
        }
        attempts++;
      } while (usedTitles.has(title) && attempts < 50);

      usedTitles.add(title);

      // Generate slug and ensure uniqueness
      let slug = toSlug(title);
      if (usedSlugs.has(slug)) {
        slug = `${slug}-${i + 1}`;
      }
      usedSlugs.add(slug);

      // Pick description paragraphs -- ensure unique combination per category
      let description: string;
      let descAttempts = 0;
      do {
        const p1 = pick(template.descriptionParagraphs[0]);
        const p2 = pick(template.descriptionParagraphs[1]);
        const p3 = pick(template.descriptionParagraphs[2]);
        description = `${p1}\n\n${p2}\n\n${p3}`;
        descAttempts++;
      } while (usedDescriptions.has(description) && descAttempts < 100);
      usedDescriptions.add(description);

      // Pick skills (5-7)
      const numSkills = randInt(5, 7);
      const skills = pickN(template.skills, numSkills);

      // Pick compensation tier
      const tierKey = pick(template.tiers);
      const tier = TIERS[tierKey];
      let compMin = roundTo5(tier.min + Math.floor(rng() * (tier.max - tier.min) * 0.4));
      let compMax = roundTo5(compMin + Math.floor(rng() * (tier.max - compMin) * 0.7) + 5);
      // Clamp
      compMin = Math.max(tier.min, Math.min(compMin, tier.max - 5));
      compMax = Math.max(compMin + 5, Math.min(compMax, tier.max));

      // Dates
      const datePosted = randomRecentDate(30);
      const validThrough = addMonths(datePosted, 3);

      // Featured: ~20% chance
      const featured = rng() < 0.2;

      // Archived: ~10% chance
      const archived = rng() < 0.1;

      // Location
      const locationRequirements = pick(template.locations);

      // FAQs: pick 2-3
      const numFaqs = randInt(2, 3);
      const faqs = pickN(template.faqs, numFaqs);

      const job: Job = {
        slug,
        title,
        category: template.category,
        description,
        skills,
        compensationMin: compMin,
        compensationMax: compMax,
        employmentType: 'CONTRACTOR',
        locationType: 'TELECOMMUTE',
        ...(locationRequirements ? { locationRequirements } : {}),
        datePosted,
        validThrough,
        featured,
        archived,
        faqs,
      };

      jobs.push(job);
    }
  }

  return jobs;
}

// ---------------------------------------------------------------------------
// Write to disk
// ---------------------------------------------------------------------------

const JOBS_DIR = path.join(process.cwd(), 'src', 'data', 'jobs');

function main() {
  // Delete existing JSON files
  if (fs.existsSync(JOBS_DIR)) {
    const existing = fs.readdirSync(JOBS_DIR).filter((f) => f.endsWith('.json'));
    for (const file of existing) {
      fs.unlinkSync(path.join(JOBS_DIR, file));
      console.log(`  deleted: ${file}`);
    }
  } else {
    fs.mkdirSync(JOBS_DIR, { recursive: true });
  }

  const jobs = generateJobs();

  // Validate no duplicate titles or slugs
  const titles = jobs.map((j) => j.title);
  const slugs = jobs.map((j) => j.slug);
  const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
  const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);

  if (dupTitles.length > 0) {
    console.error('DUPLICATE TITLES:', dupTitles);
    process.exit(1);
  }
  if (dupSlugs.length > 0) {
    console.error('DUPLICATE SLUGS:', dupSlugs);
    process.exit(1);
  }

  // Write each job as a separate JSON file
  for (const job of jobs) {
    const filePath = path.join(JOBS_DIR, `${job.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(job, null, 2) + '\n', 'utf-8');
  }

  // Summary
  const categoryCounts: Record<string, number> = {};
  for (const job of jobs) {
    categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
  }

  console.log(`\nGenerated ${jobs.length} jobs:\n`);
  for (const [cat, count] of Object.entries(categoryCounts).sort()) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log(`\nFiles written to: ${JOBS_DIR}`);

  // Print a few stats
  const featured = jobs.filter((j) => j.featured).length;
  const archived = jobs.filter((j) => j.archived).length;
  console.log(`  featured: ${featured}`);
  console.log(`  archived: ${archived}`);
}

main();
