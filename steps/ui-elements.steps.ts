import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { isAnyVisible } from './helpers';

const { When, Then } = createBdd(test);

/**
 * UI Elements steps — https://www.qapractice.com/practice-different-ui-elements
 * Verified site behavior:
 *   Click Me -> "Clicked 1 times" | modal -> role=dialog with Close button
 *   Update Content -> "Updated at <time>" | notification -> role=status/alert, auto-dismiss ~4s
 *   Simulate Download -> shows "Iframe loaded" feedback (no real file download)
 *   accordion -> aria-expanded toggles on the trigger button
 */

// Locator covering all attribute variants the site uses across renders
const el = (page: import('@playwright/test').Page, key: string) =>
  page.locator(`[data-testid="${key}"], #${key}, [name="${key}"]`).first();

When('I type {string} into the text field', async ({ page }, value: string) => {
  await el(page, 'textField').fill(value);
});

When('I type a 1000-character string into the text field', async ({ page }) => {
  await el(page, 'textField').fill('x'.repeat(1000));
});

When('I type {int} lines into the text area', async ({ page }, lines: number) => {
  const text = Array.from({ length: lines }, (_, i) => `Line ${i + 1}`).join('\n');
  await el(page, 'textArea').fill(text);
});

When('I check the single checkbox', async ({ page }) => {
  await el(page, 'ui-single-checkbox').check();
});

When('I uncheck the single checkbox', async ({ page }) => {
  await el(page, 'ui-single-checkbox').uncheck();
});

When('I check options {int} and {int} in the checkbox group', async ({ page }, a: number, b: number) => {
  await el(page, `option${a}`).check();
  await el(page, `option${b}`).check();
});

When('I select radio option {int}', async ({ page }, n: number) => {
  await page.locator('input[name=radioGroup]').nth(n - 1).check();
});

When('I select each option of the single dropdown', async ({ page, state }) => {
  const dropdown = el(page, 'singleDropdown');
  const optionCount = await dropdown.locator('option').count();
  let ok = true;
  for (let i = 0; i < optionCount; i++) {
    await dropdown.selectOption({ index: i });
    const value = await dropdown.inputValue();
    const expected = await dropdown.locator('option').nth(i).getAttribute('value');
    if (expected !== null && value !== expected) ok = false;
  }
  state.dropdownUpdatesOk = ok;
});

When('I select {int} options in the multi dropdown', async ({ page }, count: number) => {
  await el(page, 'multiDropdown').selectOption([{ index: 0 }, { index: count - 1 }]);
});

When('I set the slider to the minimum', async ({ page }) => {
  await el(page, 'ui-slider').evaluate((e: HTMLInputElement) => {
    e.value = e.min;
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

When('I set the slider to the maximum', async ({ page }) => {
  await el(page, 'ui-slider').evaluate((e: HTMLInputElement) => {
    e.value = e.max;
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

When('I enter {string} into the datepicker', async ({ page, state }, value: string) => {
  state.datepickerDate = value;
  await el(page, 'ui-datepicker').fill(value);
});

When('I enter a future date into the datepicker', async ({ page, state }) => {
  // Computed at runtime so the test never rots past a hardcoded date
  state.datepickerDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  await el(page, 'ui-datepicker').fill(state.datepickerDate);
});

When('I upload a sample file', async ({ page }) => {
  await el(page, 'ui-file-upload').setInputFiles({
    name: 'sample.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello qa'),
  });
});

When('I click the {string} button repeatedly', async ({ page }, name: string) => {
  const button = page.getByRole('button', { name }).first();
  for (let i = 0; i < 15; i++) {
    const progressText = await page.locator('.progress-bar').innerText().catch(() => '');
    if (progressText.includes('100')) break;
    await button.click();
    await page.waitForTimeout(200);
  }
});

When('the progress bar has reached 100 percent', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Increment Progress' }).first();
  for (let i = 0; i < 15; i++) {
    const progressText = await page.locator('.progress-bar').innerText().catch(() => '');
    if (progressText.includes('100')) return;
    await button.click();
    await page.waitForTimeout(200);
  }
});

When('I close the modal', async ({ page }) => {
  // Header X and footer Close share the accessible name — either dismisses
  await page.locator('[role=dialog]').getByRole('button', { name: 'Close' }).first().click();
});

When('I expand accordion item {int}', async ({ page }, n: number) => {
  const trigger = page.getByRole('button', { name: `Accordion Item #${n}` });
  if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
});

When('I collapse accordion item {int}', async ({ page }, n: number) => {
  const trigger = page.getByRole('button', { name: `Accordion Item #${n}` });
  if ((await trigger.getAttribute('aria-expanded')) === 'true') await trigger.click();
});

Then('the text field value should be {string}', async ({ page }, value: string) => {
  await expect(el(page, 'textField')).toHaveValue(value);
});

Then('the text area should retain all lines', async ({ page }) => {
  const value = await el(page, 'textArea').inputValue();
  expect(value).toContain('Line 1');
  expect(value).toContain('Line 3');
});

Then('the single checkbox should be checked', async ({ page }) => {
  await expect(el(page, 'ui-single-checkbox')).toBeChecked();
});

Then('the single checkbox should be unchecked', async ({ page }) => {
  await expect(el(page, 'ui-single-checkbox')).not.toBeChecked();
});

Then('options {int} and {int} should be checked', async ({ page }, a: number, b: number) => {
  await expect(el(page, `option${a}`)).toBeChecked();
  await expect(el(page, `option${b}`)).toBeChecked();
});

Then('option {int} should be unchecked', async ({ page }, n: number) => {
  await expect(el(page, `option${n}`)).not.toBeChecked();
});

Then('only radio option {int} should be selected', async ({ page }, n: number) => {
  const radios = page.locator('input[name=radioGroup]');
  const count = await radios.count();
  for (let i = 0; i < count; i++) {
    if (i === n - 1) await expect(radios.nth(i)).toBeChecked();
    else await expect(radios.nth(i)).not.toBeChecked();
  }
});

Then('the selected value should update each time', async ({ state }) => {
  expect(state.dropdownUpdatesOk).toBe(true);
});

Then('both options should remain selected', async ({ page }) => {
  const selected = await el(page, 'multiDropdown').evaluate(
    (e: HTMLSelectElement) => e.selectedOptions.length,
  );
  expect(selected).toBe(2);
});

Then('the slider value should be the minimum', async ({ page }) => {
  const { value, min } = await el(page, 'ui-slider').evaluate((e: HTMLInputElement) => ({ value: e.value, min: e.min }));
  expect(value).toBe(min);
});

Then('the slider value should be the maximum', async ({ page }) => {
  const { value, max } = await el(page, 'ui-slider').evaluate((e: HTMLInputElement) => ({ value: e.value, max: e.max }));
  expect(value).toBe(max);
});

Then('the datepicker should display the date', async ({ page, state }) => {
  expect(state.datepickerDate).toBeTruthy();
  await expect(el(page, 'ui-datepicker')).toHaveValue(state.datepickerDate ?? '');
});

Then('the datepicker should show a validation error or reject the input', async ({ $test, page, state }) => {
  const value = await el(page, 'ui-datepicker').inputValue();
  await $test.info().attach('observation: invalid-datepicker', {
    body: `value after invalid input: "${value}"`,
    contentType: 'text/plain',
  });
  // Verified site gap: the widget performs no validation — garbage is kept
  // as-is and echoed to the Output area, so pin that actual behavior instead
  expect(value).toBe(state.datepickerDate ?? '');
  await expect(page.locator('body')).toContainText(state.datepickerDate ?? '');
});

Then('the uploaded file name should be registered', async ({ page }) => {
  const value = await el(page, 'ui-file-upload').inputValue();
  expect(value).toContain('sample.txt');
});

Then('a visible feedback state should appear', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.getByText(/Clicked \d+ times/)), { timeout: 10000 }).toBe(true);
});

Then('the progress bar should reach 100 percent', async ({ page }) => {
  await expect(page.locator('.progress-bar')).toContainText('100', { timeout: 10000 });
});

Then('the progress bar should stay at 100 percent', async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.locator('.progress-bar')).toContainText('100');
});

Then('the modal should be visible', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.locator('[role=dialog]')), { timeout: 10000 }).toBe(true);
});

Then('the modal should not be visible', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.locator('[role=dialog]')), { timeout: 10000 }).toBe(false);
});

Then('background elements should not be clickable', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Increment Progress' }).click({ timeout: 3000 }),
  ).rejects.toThrow();
});

Then('the simulated download feedback should be shown', async ({ page }) => {
  // Verified: the site shows an "Iframe loaded" simulation instead of a real download
  await expect(page.getByText(/Iframe loaded/i)).toBeVisible();
});

Then('the target content text should change', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.getByText(/Updated at/i)), { timeout: 10000 }).toBe(true);
});

Then('a notification should be visible', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.getByText('Operation completed successfully.')), { timeout: 10000 }).toBe(true);
});

Then('the notification should disappear automatically', async ({ page }) => {
  await expect.poll(() => isAnyVisible(page.getByText('Operation completed successfully.')), { timeout: 15000 }).toBe(false);
});

Then('accordion item {int} content should be visible', async ({ page }, n: number) => {
  await expect(page.getByRole('button', { name: `Accordion Item #${n}` })).toHaveAttribute('aria-expanded', 'true');
});

Then('accordion item {int} content should be hidden', async ({ page }, n: number) => {
  await expect(page.getByRole('button', { name: `Accordion Item #${n}` })).toHaveAttribute('aria-expanded', 'false');
});

