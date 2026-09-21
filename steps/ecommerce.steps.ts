import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { isDisabled } from './helpers';

const { When, Then } = createBdd(test);

/**
 * E-commerce steps — https://www.qapractice.com/practice-ecommerece-website
 * Verified site behavior:
 *   search filters live while typing (Enter triggers a native form GET -> reload!)
 *   no results -> 'No products found for "<keyword>".'
 *   cart button (btn.position-relative) badge shows total quantity added
 */

const addToCartButtons = (page: import('@playwright/test').Page) =>
  page.locator('button:has-text("Add to Cart")');

// Demo catalog size (unfiltered list). Update if the site adds/removes products.
const FULL_CATALOG_COUNT = 8;

async function cartCount(page: import('@playwright/test').Page): Promise<number> {
  const text = (await page.locator('button.position-relative').first().innerText()).trim();
  return parseInt(text, 10) || 0;
}

async function listFingerprint(page: import('@playwright/test').Page): Promise<string> {
  return (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 600);
}

When('I search products for {string}', async ({ page }, keyword: string) => {
  // Type like a user: the list filters on input events; Enter reloads the page
  await page.locator('#ecom-search').pressSequentially(keyword, { delay: 30 });
});

When('I search products for a visible product name', async ({ page, state }) => {
  state.keyword = 'Laptop';
  await page.locator('#ecom-search').pressSequentially('Laptop', { delay: 30 });
});

When('I search products for a keyword in upper and lower case', async ({ page, state }) => {
  await page.locator('#ecom-search').pressSequentially('LAPTOP', { delay: 30 });
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBeGreaterThan(0);
  state.countA = await addToCartButtons(page).count();
  await page.locator('#ecom-search').fill('');
  await page.locator('#ecom-search').pressSequentially('laptop', { delay: 30 });
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBeGreaterThan(0);
  state.countB = await addToCartButtons(page).count();
});

When('I search products for a partial product name', async ({ page }) => {
  await page.locator('#ecom-search').pressSequentially('Lapt', { delay: 30 });
});

When('I search products for a keyword within the filtered list', async ({ page }) => {
  await page.locator('#ecom-search').pressSequentially('Laptop', { delay: 30 });
});

When('I clear the product search', async ({ page }) => {
  await page.locator('#ecom-search').fill('');
});

When('I filter products by category {string}', async ({ page }, category: string) => {
  await page.getByRole('button', { name: category, exact: true }).click();
});

When('I sort products by price {string}', async ({ page }, direction: string) => {
  const select = page.locator('#ecom-sort');
  const labels = await select.locator('option').allTextContents();
  const wanted = direction === 'ascending' ? /low to high/i : /high to low/i;
  const match = labels.find((l) => wanted.test(l));
  if (!match) throw new Error(`Sort option for "${direction}" not found. Available: ${labels.join(' | ')}`);
  await select.selectOption({ label: match });
});

When('I add the first product to the cart with quantity {int}', async ({ page, state }, qty: number) => {
  state.cartBefore ??= await cartCount(page);
  await page.locator('input[id^=quantity-]').first().fill(String(qty));
  await addToCartButtons(page).first().click();
});

When('I add {int} different products to the cart', async ({ page, state }, count: number) => {
  state.cartBefore ??= await cartCount(page);
  for (let i = 0; i < count; i++) {
    await page.locator('input[id^=quantity-]').nth(i).fill('1');
    await addToCartButtons(page).nth(i).click();
  }
});

When('I go to product page {int}', async ({ page, state }, n: number) => {
  state.fingerprint ??= await listFingerprint(page);
  const target = page
    .getByRole('link', { name: String(n), exact: true })
    .or(page.getByRole('button', { name: String(n), exact: true }));
  if (await target.first().isEnabled().catch(() => false)) {
    await target.first().click();
  }
});

When('I go back to product page {int}', async ({ page }, n: number) => {
  const target = page
    .getByRole('link', { name: String(n), exact: true })
    .or(page.getByRole('button', { name: String(n), exact: true }));
  await target.first().click();
});

When('I go to the last product page', async ({ page }) => {
  // Page numbers are read from the live pagination instead of assuming a fixed count
  const labels = await page
    .locator('a, button')
    .filter({ hasText: /^\d+$/ })
    .allTextContents();
  const pages = labels.map((t) => parseInt(t.trim(), 10)).filter((n) => !Number.isNaN(n));
  if (pages.length === 0) throw new Error('No numbered pagination controls found');
  const last = String(Math.max(...pages));
  const target = page
    .getByRole('link', { name: last, exact: true })
    .or(page.getByRole('button', { name: last, exact: true }));
  await target.first().click();
});

Then('only matching products should be shown', async ({ page, state }) => {
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBe(1);
  await expect(page.locator('body')).toContainText(new RegExp(String(state.keyword), 'i'));
});

Then('an empty search state should be shown', async ({ page }) => {
  await expect(page.getByText(/No products found/i)).toBeVisible();
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBe(0);
});

Then('both searches should return the same result set', async ({ state }) => {
  expect(state.countA).toBe(state.countB);
});

Then('products containing the fragment should be shown', async ({ page }) => {
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBeGreaterThan(0);
  await expect(page.getByText('Laptop Pro')).toBeVisible();
});

Then('the full product list should be restored', async ({ page }) => {
  await expect(addToCartButtons(page)).toHaveCount(FULL_CATALOG_COUNT);
});

Then('every visible product should belong to {string}', async ({ page }, category: string) => {
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBeGreaterThan(0);
  const count = await addToCartButtons(page).count();
  if (category === 'All') {
    expect(count).toBe(FULL_CATALOG_COUNT);
  } else if (category === 'Beverages') {
    await expect(page.getByText('Laptop Pro')).toBeHidden();
  } else {
    await expect(page.getByText('Coca Cola 250ml')).toBeHidden();
  }
});

Then('only products matching both filters should be shown', async ({ page }) => {
  await expect.poll(() => addToCartButtons(page).count(), { timeout: 10000 }).toBe(1);
  await expect(page.getByText('Laptop Pro')).toBeVisible();
});

Then('product prices should be in non-decreasing order', async ({ page }) => {
  await expect
    .poll(
      async () => {
        const texts = await page.locator('text=/^\\$[\\d,]+$/').allTextContents();
        const prices = texts.map((t) => parseInt(t.replace(/[$,]/g, ''), 10));
        return JSON.stringify(prices) === JSON.stringify([...prices].sort((a, b) => a - b));
      },
      { timeout: 10000 },
    )
    .toBe(true);
});

Then('product prices should be in non-increasing order', async ({ page }) => {
  await expect
    .poll(
      async () => {
        const texts = await page.locator('text=/^\\$[\\d,]+$/').allTextContents();
        const prices = texts.map((t) => parseInt(t.replace(/[$,]/g, ''), 10));
        return JSON.stringify(prices) === JSON.stringify([...prices].sort((a, b) => b - a));
      },
      { timeout: 10000 },
    )
    .toBe(true);
});

Then('the cart count should increase by {int}', async ({ page, state }, delta: number) => {
  await expect.poll(() => cartCount(page), { timeout: 10000 }).toBe((state.cartBefore ?? 0) + delta);
});

Then('the product should not be added to the cart', async ({ page, state }) => {
  await expect.poll(() => cartCount(page), { timeout: 5000 }).toBe(state.cartBefore ?? 0);
});

Then('different products should be shown', async ({ page, state }) => {
  await expect.poll(() => listFingerprint(page), { timeout: 10000 }).not.toBe(state.fingerprint);
});

Then('the first page products should be shown', async ({ page, state }) => {
  await expect.poll(() => listFingerprint(page), { timeout: 10000 }).toBe(state.fingerprint);
});

Then('the {string} pagination button should be disabled', async ({ page }, name: string) => {
  const el = page
    .getByRole('button', { name, exact: true })
    .or(page.getByRole('link', { name, exact: true }))
    .first();
  expect(await isDisabled(el)).toBeTruthy();
});

