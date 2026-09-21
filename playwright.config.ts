import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD: .feature files are converted to Playwright tests via `npx bddgen`
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
});

/**
 * Playwright configuration.
 * See https://playwright.dev/docs/test-configuration.
 *
 * Set the target app URL via the BASE_URL environment variable, e.g.:
 *   BASE_URL=https://example.com npx playwright test
 */
export default defineConfig({
  testDir,
  // The target site is ad-heavy and hydrates slowly — generous timeouts needed
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: true,
  // Fail the build on CI if test.only is left in the source code
  forbidOnly: !!process.env.CI,
  // 1 retry locally: the external demo site is occasionally slow to hydrate
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  // Two reports: default Playwright HTML report + Allure results
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.qapractice.com',
    actionTimeout: 30000,
    navigationTimeout: 60000,
    // Trace recorded for every test, in all conditions (open with `npx playwright show-trace`)
    trace: 'on',
    // Screenshot and video are captured when a test fails
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Uncomment to enable WebKit testing (requires `npx playwright install webkit`):
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  // Uncomment to start a local dev server before running tests:
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
