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
  build: {
    // Skip platform-specific optional deps (e.g. @rspack/binding-darwin-arm64)
    // that fail on the Linux x64 Docker build environment
    extensions: [{
      name: 'skip-optional-deps',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBuildStart(context: any) {
        context.addLayer({
          id: 'skip-optional-deps',
          image: { instructions: ['ENV NPM_CONFIG_OMIT=optional'] },
        });
      },
    }],
  },
});
