import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

/**
 * Shared steps used by multiple modules: page navigation, generic clicks,
 * XSS/crash safety assertions, and behavior-recording steps.
 */

// The site loads heavy ad/tracking scripts that slow hydration massively.
// Blocking them keeps tests stable and fast without affecting page behavior.
const AD_HOSTS = /googleads|doubleclick|googlesyndication|adtrafficquality|adservice|google-analytics|recaptcha/;

const PAGES: Record<string, { path: string; ready: string }> = {
  login: { path: '/practice-login-form', ready: '#login-email' },
  registration: { path: '/register', ready: '#register-email' },
  'forgot password': { path: '/forget-password', ready: '#forgot-email' },
  'web form': { path: '/practice-forms', ready: '#forms-first-name' },
  'e-commerce': { path: '/practice-ecommerece-website', ready: '#ecom-search' },
  'flight booking': { path: '/flight-booking-scenarios', ready: '#flight-from' },
  'UI elements': { path: '/practice-different-ui-elements', ready: 'button:has-text("Show Modal")' },
  'API playground': { path: '/api-playground', ready: 'text=API Automation Playground' },
  'XPath practice': { path: '/SeleniumXPathGuide', ready: 'input[placeholder*="tag"]' },
  'practice selection': { path: '/practice-page-selection', ready: 'text=Practice Sites' },
  home: { path: '/', ready: 'text=Automation Playground' },
  contact: { path: '/contact', ready: 'text=Send us a message' },
  interview: { path: '/interview', ready: 'input[placeholder*="Search questions"]' },
};

async function setupPage(page: import('@playwright/test').Page, state: { dialogs: string[] }) {
  await page.context().route(AD_HOSTS, (route) => route.abort());
  state.dialogs = [];
  page.on('dialog', (dialog) => {
    state.dialogs.push(dialog.message());
    void dialog.dismiss();
  });
}

Given('I am on the {string} page', async ({ page, state }, name: string) => {
  const target = PAGES[name];
  if (!target) throw new Error(`Unknown page name: "${name}" (known: ${Object.keys(PAGES).join(', ')})`);
  await setupPage(page, state);
  await page.goto(target.path);
  // The SPA hydrates slowly — wait for a module-specific ready marker
  await page.locator(target.ready).first().waitFor({ timeout: 45000 });
});

Then('I should be on the {string} page', async ({ page }, name: string) => {
  const expected = (PAGES[name]?.path ?? name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(expected), { timeout: 15000 });
});

Then('I should be on the home or practice selection page', async ({ page }) => {
  await expect(page).toHaveURL(/practice-page-selection|qapractice\.com\/?$/, { timeout: 15000 });
});

When('I click the {string} button', async ({ page }, name: string) => {
  await page.getByRole('button', { name }).first().click();
});

When('I double click the {string} button rapidly', async ({ page }, name: string) => {
  await page.getByRole('button', { name }).first().dblclick();
});

When('I click the {string} link', async ({ page }, name: string) => {
  await page.getByRole('link', { name }).first().click();
});

const PRESSABLE_FIELDS: Record<string, string> = {
  'login password': '#login-password',
  'registration confirm password': '#register-confirm-password',
  'forgot password email': '#forgot-email',
};

When('I press {string} in the {string} field', async ({ page }, key: string, field: string) => {
  const selector = PRESSABLE_FIELDS[field];
  if (!selector) throw new Error(`Unknown field: "${field}"`);
  await page.locator(selector).press(key);
});

Then('the payload should not be executed', async ({ state }) => {
  expect(state.dialogs, `XSS payload triggered a browser dialog: ${state.dialogs.join(', ')}`).toEqual([]);
});

Then('the page should not crash', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
  expect(page.url()).not.toBe('about:blank');
});

// Observation step for cases whose expected behavior is not documented:
// records what the site actually did into the report instead of hard-asserting.
Then('I record the actual {string} behavior', async ({ $test, page }, what: string) => {
  const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 500);
  await $test.info().attach(`observation: ${what}`, {
    body: `URL: ${page.url()}\nPage excerpt: ${bodyText}`,
    contentType: 'text/plain',
  });
});
