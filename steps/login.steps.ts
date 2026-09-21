import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { hasEmailFormatError, isAnyVisible } from './helpers';

const { When, Then } = createBdd(test);

/**
 * Login Form steps — https://www.qapractice.com/practice-login-form
 * Verified site messages:
 *   success: "Login Successful! Welcome to Premium Banking."
 *   wrong credentials: "Invalid email id and password"
 *   empty submit: "Email and Password are required"
 */

When('I sign in with email {string} and password {string}', async ({ page }, email: string, password: string) => {
  await page.fill('#login-email', email);
  await page.fill('#login-password', password);
  await page.getByRole('button', { name: 'Sign in' }).click();
});

When('I fill the login email with {string}', async ({ page }, email: string) => {
  await page.fill('#login-email', email);
});

When('I fill the login password with {string}', async ({ page }, password: string) => {
  await page.fill('#login-password', password);
});

When('I sign in with a 255-character email and password', async ({ page }) => {
  await page.fill('#login-email', `${'a'.repeat(245)}@mail.com`);
  await page.fill('#login-password', 'P'.repeat(255));
  await page.getByRole('button', { name: 'Sign in' }).click();
});

When('I attempt to sign in with a wrong password {int} times', async ({ page, state }, times: number) => {
  state.attempts = times;
  for (let i = 0; i < times; i++) {
    await page.fill('#login-email', 'user@premiumbank.com');
    await page.fill('#login-password', 'WrongPass1');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Auto-retrying assertion: a slow render must not be miscounted as a missing error
    await expect
      .poll(() => isAnyVisible(page.getByText('Invalid email id and password')), { timeout: 10000 })
      .toBe(true);
  }
  state.errorCount = times;
});

When('I check the {string} checkbox', async ({ page }, name: string) => {
  if (name !== 'Remember me') throw new Error(`Unknown checkbox: "${name}"`);
  await page.locator('#login-remember').check();
});

Then('I should see the login success state', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.getByText('Login Successful!')), { timeout: 15000 }).toBe(true);
});

Then('I should see a login error message', async ({ page }) => {
  await expect
    .poll(() => isAnyVisible(page.getByText('Invalid email id and password')), { timeout: 15000 })
    .toBe(true);
});

Then('I should see a login error message on every attempt', async ({ state }) => {
  expect(state.errorCount).toBe(state.attempts);
});

Then('I should remain on the login page', async ({ page }) => {
  await expect(page).toHaveURL(/practice-login-form/);
  await expect(page.locator('#login-email')).toBeVisible();
});

Then('I should see a required validation for the email field', async ({ page }) => {
  // The site shows one combined message: "Email and Password are required"
  await expect.poll(() => isAnyVisible(page.getByText(/Email.*required/i)), { timeout: 15000 }).toBe(true);
});

Then('I should see a required validation for the password field', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.getByText(/Password.*required/i)), { timeout: 15000 }).toBe(true);
});

Then('I should see an email format validation on the login form', async ({ page }) => {
  // type=email native validity OR a custom message — accept either
  expect(await hasEmailFormatError(page, '#login-email')).toBeTruthy();
});

Then('the login should be trimmed and accepted or show a validation error', async ({ $test, page }) => {
  const success = await isAnyVisible(page.getByText('Login Successful!'));
  const error = await isAnyVisible(page.getByText(/Invalid|required/i));
  await $test.info().attach('observation: spaces-in-email', {
    body: `success=${success}, error=${error}`,
    contentType: 'text/plain',
  });
  expect(success || error).toBeTruthy();
});

Then('the login password field should be of type {string}', async ({ page }, type: string) => {
  await expect(page.locator('#login-password')).toHaveAttribute('type', type);
});

Then('the {string} checkbox should be unchecked', async ({ page }, name: string) => {
  if (name !== 'Remember me') throw new Error(`Unknown checkbox: "${name}"`);
  await expect(page.locator('#login-remember')).not.toBeChecked();
});
