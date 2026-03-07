import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL;
if (!baseURL) {
  throw new Error(
    'PLAYWRIGHT_BASE_URL is not set. Set it to a Vercel preview deployment URL. See e2e/CLAUDE.md.',
  );
}

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_SECRET ?? '',
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
