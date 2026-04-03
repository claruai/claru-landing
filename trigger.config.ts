import { defineConfig } from '@trigger.dev/sdk/v3';
import type { BuildExtension } from '@trigger.dev/sdk/v3/build';

// Skip platform-specific optional deps (e.g. @rspack/binding-darwin-arm64)
// that fail on the Linux x64 Docker build environment
const skipOptionalDeps: BuildExtension = {
  name: 'skip-optional-deps',
  onBuildStart(context) {
    context.addLayer({
      id: 'skip-optional-deps',
      image: {
        instructions: ['ENV NPM_CONFIG_OMIT=optional'],
      },
    });
  },
};

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
    extensions: [skipOptionalDeps],
  },
});
