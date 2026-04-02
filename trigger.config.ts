import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID!,
  runtime: 'node',
  maxDuration: 600,
  retries: {
    enabledInDev: false,
    default: { maxAttempts: 2 },
  },
  dirs: ['src/trigger'],
  legacyDevProcessCwdBehaviour: false,
  additionalFiles: ['src/lib/blog-pipeline/skills/**/*.md'],
});
