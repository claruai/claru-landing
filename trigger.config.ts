import { defineConfig } from '@trigger.dev/sdk/v3';
import { ffmpeg } from '@trigger.dev/build/extensions/core';

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
    extensions: [
      ffmpeg({ version: '7' }),
      {
        name: 'skip-platform-deps',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onBuildStart(context: any) {
          context.addLayer({
            id: 'skip-platform-deps',
            image: {
              instructions: [
                'ENV npm_config_force=true',
                'RUN echo "force=true" > /home/node/.npmrc',
              ],
            },
          });
        },
      },
    ],
  },
});
