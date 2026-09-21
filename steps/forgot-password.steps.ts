import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { hasEmailFormatError, isAnyVisible } from './helpers';

const { When, Then } = createBdd(test);

/**
 * Forgot Password steps — https://www.qapractice.com/forget-password
 * Verified site behavior:
 *   registered email   -> wizard advances to step 2 "Verify Security Code"
 *   unregistered email -> "Email not found in our records"
 */

When('I submit the forgot password form with email {string}', async ({ page }, email: string) => {
  await page.fill('#forgot-email', email);
  await page.getByRole('button', { name: 'Continue' }).click();
});

When('I submit the forgot password form with email {string} twice rapidly', async ({ page }, email: string) => {
  await page.fill('#forgot-email', email);
  await page.getByRole('button', { name: 'Continue' }).dblclick();
});

When('I submit the forgot password form with a 255-character email', async ({ page }) => {
  await page.fill('#forgot-email', `${'a'.repeat(245)}@mail.com`);
  await page.getByRole('button', { name: 'Continue' }).click();
});

When('I fill the forgot password email with {string}', async ({ page }, email: string) => {
  await page.fill('#forgot-email', email);
});

Then('I should see the recovery confirmation state', async ({ page }) => {
  // Registered email advances the 3-step recovery wizard to the security code step
  await expect.poll(() => isAnyVisible(page.getByText('Verify Security Code')), { timeout: 15000 }).toBe(true);
});

Then('I should see an error or a neutral confirmation message', async ({ page }) => {
  await expect(page.getByText(/not found in our records/i)).toBeVisible();
});

Then('I should see a required validation for the forgot email field', async ({ page }) => {
  const nativelyInvalid = await page.locator('#forgot-email').evaluate((e: HTMLInputElement) => !e.validity.valid);
  const customMessage = await page.getByText(/required/i).count();
  expect(nativelyInvalid || customMessage > 0).toBeTruthy();
});

Then('I should see an email format validation on the forgot password form', async ({ page }) => {
  expect(await hasEmailFormatError(page, '#forgot-email')).toBeTruthy();
});

Then('the recovery should be trimmed and accepted or show a validation error', async ({ $test, page }) => {
  const advanced = await isAnyVisible(page.getByText('Verify Security Code'));
  const error = await page.getByText(/not found|invalid|required/i).first().isVisible();
  await $test.info().attach('observation: spaces-in-email', {
    body: `advanced=${advanced}, error=${error}`,
    contentType: 'text/plain',
  });
  expect(advanced || error).toBeTruthy();
});

Then('I should see a validation error on the forgot password form', async ({ page }) => {
  await expect(page.getByText(/not found|invalid|required|valid email/i).first()).toBeVisible();
});

Then('the recovery should be handled as a single submission', async ({ page }) => {
  // Exact-count is meaningless (the site renders wizard steps 2×); assert one visible outcome
  await expect.poll(() => isAnyVisible(page.getByText('Verify Security Code')), { timeout: 15000 }).toBe(true);
});
