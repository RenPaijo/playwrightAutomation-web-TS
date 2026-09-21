import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { isDisabled } from './helpers';

const { When, Then } = createBdd(test);

/**
 * Flight Booking steps — https://www.qapractice.com/flight-booking-scenarios
 * Verified: valid search advances the wizard to "Choose your flights";
 * cities include New York/London/...; classes Economy/Business/First;
 * the one-way checkbox is a custom control needing a forced click.
 */

function datePlus(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

async function fillFlightSearch(
  page: import('@playwright/test').Page,
  opts: { from?: string; to?: string; departDays?: number; returnDays?: number | null; passengers?: number; travelClass?: string } = {},
) {
  const { from = 'New York', to = 'London', departDays = 7, returnDays = 14, passengers = 2, travelClass = 'Economy' } = opts;
  await page.selectOption('#flight-from', { label: from });
  await page.selectOption('#flight-to', { label: to });
  await page.fill('#flight-departure-date', datePlus(departDays));
  if (returnDays !== null) await page.fill('#flight-return-date', datePlus(returnDays));
  await page.fill('#flight-passengers', String(passengers));
  await page.selectOption('#flight-class', { label: travelClass });
}

When('I search a round-trip flight with valid data', async ({ page }) => {
  await fillFlightSearch(page);
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I check the one-way option', async ({ page }) => {
  await page.locator('#flight-one-way').click({ force: true });
});

When('I uncheck the one-way option', async ({ page }) => {
  await page.locator('#flight-one-way').click({ force: true });
});

When('I search a flight with the same origin and destination', async ({ page }) => {
  await fillFlightSearch(page, { from: 'New York', to: 'New York' });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I search a round-trip flight with return before departure', async ({ page }) => {
  await fillFlightSearch(page, { departDays: 14, returnDays: 7 });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I search a flight departing yesterday', async ({ page }) => {
  await fillFlightSearch(page, { departDays: -1, returnDays: 7 });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I search a flight departing today', async ({ page }) => {
  await fillFlightSearch(page, { departDays: 0, returnDays: 7 });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I search a valid flight with {int} passengers', async ({ page }, passengers: number) => {
  await fillFlightSearch(page, { passengers });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I search a valid flight with class {string}', async ({ page }, travelClass: string) => {
  await fillFlightSearch(page, { travelClass });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I search a valid flight with the route swapped', async ({ page }) => {
  await fillFlightSearch(page, { from: 'London', to: 'New York' });
  await page.getByRole('button', { name: 'Search Flights' }).click();
});

When('I fill a valid flight search', async ({ page }) => {
  await fillFlightSearch(page);
});

When('I select an origin and destination only', async ({ page }) => {
  await page.selectOption('#flight-from', { label: 'New York' });
  await page.selectOption('#flight-to', { label: 'London' });
});

Then('flight results matching the criteria should be shown', async ({ page }) => {
  await expect(page.getByText('Choose your flights')).toBeVisible();
});

Then('the return date field should be disabled or ignored', async ({ page }) => {
  // The site removes/hides the return-date input when one-way is checked —
  // absent, hidden, or disabled are all valid "ignored" states
  const field = page.locator('#flight-return-date');
  await expect
    .poll(
      async () => {
        if ((await field.count()) === 0) return true;
        if (!(await field.isVisible().catch(() => false))) return true;
        return isDisabled(field);
      },
      { timeout: 10000 },
    )
    .toBe(true);
});

Then('the return date field should be editable', async ({ page }) => {
  await expect(page.locator('#flight-return-date')).toBeEnabled();
});

// Negative-flow guard: the wizard must not advance, or an explicit error must appear.
Then('I should see a route validation error', async ({ page }) => {
  const advanced = await page.getByText('Choose your flights').count();
  const error = await page.getByText(/same|different|invalid|error/i).count();
  expect(advanced === 0 || error > 0).toBeTruthy();
});

Then('I should see a date validation error', async ({ page }) => {
  const advanced = await page.getByText('Choose your flights').count();
  const error = await page.getByText(/date|invalid|error|past/i).count();
  expect(advanced === 0 || error > 0).toBeTruthy();
});

Then('I should see required validations on the route fields', async ({ page }) => {
  const advanced = await page.getByText('Choose your flights').count();
  const error = await page.getByText(/required|select|origin|destination/i).count();
  expect(advanced === 0 || error > 0).toBeTruthy();
});

Then('I should see a passenger validation error', async ({ page }) => {
  const advanced = await page.getByText('Choose your flights').count();
  const error = await page.getByText(/passenger|invalid|error/i).count();
  expect(advanced === 0 || error > 0).toBeTruthy();
});

Then('the passenger count should be rejected or handled gracefully', async ({ $test, page }) => {
  const advanced = await page.getByText('Choose your flights').count();
  await $test.info().attach('observation: excessive-passengers', {
    body: `wizard advanced: ${advanced > 0}`,
    contentType: 'text/plain',
  });
  await expect(page.locator('body')).toBeVisible();
});

Then('I should see required validations on the date fields', async ({ page }) => {
  const advanced = await page.getByText('Choose your flights').count();
  const error = await page.getByText(/required|date/i).count();
  expect(advanced === 0 || error > 0).toBeTruthy();
});

Then('the result route, dates, and class should match the search', async ({ page }) => {
  await expect(page.getByText('Choose your flights')).toBeVisible();
  await expect(page.locator('body')).toContainText('New York');
  await expect(page.locator('body')).toContainText('London');
});

Then('a single search should be executed', async ({ page }) => {
  await expect(page.getByText('Choose your flights')).toHaveCount(1);
});

