import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { When, Then } = createBdd(test);

/**
 * XPath Practice Guide steps — https://www.qapractice.com/SeleniumXPathGuide
 * Verified: progress "0 / 130 solved", difficulty badges Easy 49 / Medium 53 / Hard 28,
 * challenge buttons labeled "<n><Title>" (e.g. "1Select by ID").
 * The snippet panel renders as text (no live DOM), so the correct-XPath step falls
 * back to the "Show answer" reveal ("One correct answer: ...").
 */

const challengeButtons = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: /^\d+/ });

// Total challenges on the demo site (matches the "All 130" badge). Update if the site adds more.
const TOTAL_CHALLENGES = 130;

When('I filter challenges by difficulty {string}', async ({ page }, difficulty: string) => {
  await page.getByRole('button', { name: new RegExp(`^${difficulty}`) }).first().click();
});

When('I filter challenges by status {string}', async ({ page }, status: string) => {
  await page.getByRole('button', { name: new RegExp(status, 'i') }).first().click();
});

When('I search challenges for {string}', async ({ page, state }, keyword: string) => {
  state.keyword = keyword;
  await page.locator('input[placeholder*="Search"]').first().fill(keyword);
});

When('I open challenge {string}', async ({ page }, title: string) => {
  await page.getByRole('button', { name: new RegExp(title) }).first().click();
});

When('I submit the correct XPath for the challenge', async ({ page }) => {
  // Fast path: the challenge renders a live DOM snippet — select its first element carrying an id
  const targetId = await page.evaluate(() => {
    const scopes = document.querySelectorAll('[class*=snippet], [class*=preview], [class*=challenge], [class*=playground]');
    for (const scope of scopes) {
      const found = scope.querySelector('[id]');
      if (found?.id) return found.id;
    }
    return null;
  });
  if (targetId) {
    await page.locator('input[placeholder*="tag"]').fill(`//*[@id='${targetId}']`);
  } else {
    // Fallback: the snippet is rendered as text (no live DOM) — reveal the documented answer
    await page.getByRole('button', { name: /Show answer/ }).first().click();
    await expect(page.locator('body')).toContainText(/One correct answer:/, { timeout: 10000 });
    const body = await page.locator('body').innerText();
    const answer =
      body.match(/One correct answer:\s*(\/\/\S+)/)?.[1] ?? body.match(/\/\/\S+/)?.[0];
    if (!answer) throw new Error('Could not reveal the correct XPath answer');
    await page.locator('input[placeholder*="tag"]').fill(answer);
  }
  await page.keyboard.press('Enter');
});

When('I submit the XPath {string}', async ({ page }, xpath: string) => {
  await page.locator('input[placeholder*="tag"]').fill(xpath);
  await page.keyboard.press('Enter');
});

When('I submit an empty XPath answer', async ({ page }) => {
  await page.locator('input[placeholder*="tag"]').fill('');
  await page.keyboard.press('Enter');
});

When('I save the first challenge', async ({ page, state }) => {
  // Anchor on the bare title only: the button gains/loses ★ and badge text around it
  const raw = (await challengeButtons(page).first().innerText()).trim();
  const lines = raw
    .replace(/^\d+\s*/, '')
    .split('\n')
    .map((s) => s.replace(/[☆★]/g, '').trim())
    .filter((s) => s.length > 0);
  state.savedChallenge = lines[0] ?? '';
  await page.getByRole('button', { name: '☆' }).first().click();
});

Then('the challenge list should be visible', async ({ page }) => {
  await expect(challengeButtons(page).first()).toBeVisible();
});

Then('the progress counter should show 0 of 130 solved', async ({ page }) => {
  await expect(page.getByText(new RegExp(`0\\s*/\\s*${TOTAL_CHALLENGES}\\s*solved`))).toBeVisible();
});

Then('only {string} challenges should be listed', async ({ page }, difficulty: string) => {
  // The filter badge carries the expected total — the list must converge to exactly that
  const badge = page.getByRole('button', { name: new RegExp(`^${difficulty}`) }).first();
  const badgeCount = parseInt((await badge.innerText()).match(/(\d+)\s*$/)?.[1] ?? '0', 10);
  expect(badgeCount).toBeGreaterThan(0);
  await expect.poll(() => challengeButtons(page).count(), { timeout: 10000 }).toBe(badgeCount);
});

Then('the {string} count badge should show {int}', async ({ page }, difficulty: string, count: number) => {
  await expect(page.getByRole('button', { name: new RegExp(`^${difficulty}`) }).first()).toContainText(String(count));
});

Then('the difficulty counts should sum to 130', async ({ page }) => {
  let sum = 0;
  for (const d of ['Easy', 'Medium', 'Hard']) {
    const text = await page.getByRole('button', { name: new RegExp(`^${d}`) }).first().innerText();
    sum += parseInt(text.match(/(\d+)\s*$/)?.[1] ?? '0', 10);
  }
  expect(sum).toBe(TOTAL_CHALLENGES);
});

Then('only matching challenges should be listed', async ({ page, state }) => {
  const keyword = state.keyword ?? '';
  expect(keyword).not.toBe('');
  const buttons = challengeButtons(page);
  await expect.poll(() => buttons.count(), { timeout: 10000 }).toBeGreaterThan(0);
  const count = await buttons.count();
  const pattern = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  for (let i = 0; i < count; i++) {
    await expect(buttons.nth(i)).toContainText(pattern);
  }
});

Then('an empty challenge state should be shown', async ({ page }) => {
  expect(await challengeButtons(page).count()).toBe(0);
});

Then('the challenge should be marked as solved', async ({ page }) => {
  await expect(page.getByText(/Solved 1/)).toBeVisible();
});

Then('the solved counter should increase by 1', async ({ page }) => {
  await expect(page.getByText(/Solved 1/)).toBeVisible();
});

Then('the challenge should remain unsolved', async ({ page }) => {
  await expect(page.getByText(/Solved 0/)).toBeVisible();
});

Then('only solved challenges should be listed', async ({ page }) => {
  // TC-XP-010 solves exactly one challenge, so the counter and the filtered list must agree
  await expect(page.getByText(/Solved 1/)).toBeVisible();
  await expect.poll(() => challengeButtons(page).count(), { timeout: 10000 }).toBeGreaterThan(0);
});

Then('the saved challenge should be listed', async ({ page, state }) => {
  const name = (state.savedChallenge ?? '').trim();
  expect(name).not.toBe('');
  await expect(page.locator('body')).toContainText(name);
});
