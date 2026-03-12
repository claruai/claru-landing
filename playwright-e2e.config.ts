import { defineConfig, devices } from '@playwright/test';

/**
 * Temporary Playwright config for running E2E tests against
 * an already-running dev server on port 3001.
 * No webServer block — assumes the server is already up.
 * Uses Firefox due to Chromium mach port crashes on macOS.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        },
      },
    },
  ],
});
