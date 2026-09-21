import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

/**
 * REST API Playground steps — https://www.qapractice.com/api-playground
 * Verified (2026-09-21):
 *   POST /api/auth/login {username: "testuser", password: "Password123"} -> 200 + token
 *   wrong creds -> 401 | missing fields -> 400 | malformed JSON -> 400
 *   GET /api/products -> 200 public | protected routes without token -> 401
 *   GET /api/auth/login (wrong method) -> 404
 */

const API_BASE = 'https://www.qapractice.com';

async function storeResponse(state: { response?: unknown; body?: unknown }, response: import('@playwright/test').APIResponse) {
  state.response = response;
  state.body = await response.json().catch(() => null);
}

Given('I have a valid API token', async ({ request, state }) => {
  const res = await request.post(`${API_BASE}/api/auth/login`, {
    data: { username: 'testuser', password: 'Password123' },
  });
  const body = await res.json();
  state.token = body.token;
});

When('I POST to {string} with valid credentials', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: { username: 'testuser', password: 'Password123' },
  }));
});

When('I POST to {string} with a wrong password', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: { username: 'testuser', password: 'wrong-password' },
  }));
});

When('I POST to {string} with an empty body', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, { data: {} }));
});

When('I POST to {string} with a malformed JSON body', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: '{invalid',
    headers: { 'Content-Type': 'application/json' },
  }));
});

When('I POST to {string} without authentication', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: { name: 'QA Probe', price: 9 },
  }));
});

When('I POST to {string} with the token and a valid product body', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: { name: 'QA Probe Product', price: 9 },
    headers: { Authorization: `Bearer ${state.token}` },
  }));
});

When('I POST to {string} with the token and a valid order body', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: { productId: 1, quantity: 2 },
    headers: { Authorization: `Bearer ${state.token}` },
  }));
});

When('I POST to {string} with the token and an incomplete body', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.post(`${API_BASE}${path}`, {
    data: {},
    headers: { Authorization: `Bearer ${state.token}` },
  }));
});

When('I GET {string} without authentication', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.get(`${API_BASE}${path}`));
});

When('I GET {string} with the token', async ({ request, state }, path: string) => {
  await storeResponse(state, await request.get(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${state.token}` },
  }));
});

When('I GET {string} with token {string}', async ({ request, state }, path: string, token: string) => {
  await storeResponse(state, await request.get(`${API_BASE}${path}`, {
    headers: { Authorization: token },
  }));
});

Then('the response status should be {int}', async ({ state }, status: number) => {
  expect(state.response?.status()).toBe(status);
});

Then('the response status should be {int} or {int}', async ({ state }, a: number, b: number) => {
  expect([a, b]).toContain(state.response?.status());
});

Then('the response should contain a token', async ({ state }) => {
  expect(state.body?.token ?? state.body?.accessToken).toBeTruthy();
});

Then('the response should not contain a token', async ({ state }) => {
  expect(state.body?.token ?? state.body?.accessToken).toBeFalsy();
});

Then('the response should contain a product list', async ({ state }) => {
  expect(Array.isArray(state.body?.products)).toBeTruthy();
  expect(state.body.products.length).toBeGreaterThan(0);
});

Then('the response should contain the created product', async ({ state }) => {
  expect(JSON.stringify(state.body)).toContain('QA Probe Product');
});

Then('the response should contain a user object', async ({ state }) => {
  expect(JSON.stringify(state.body)).toMatch(/"?(id|username|email)"?/);
});

// --- Playground UI steps ---

Then('the token input should be populated', async ({ page }) => {
  const tokenInput = page.locator('input[placeholder*="Bearer"]');
  await expect(tokenInput).not.toHaveValue('', { timeout: 10000 });
});

When('I select the {string} endpoint in the playground', async ({ page }, endpoint: string) => {
  const [method, path] = endpoint.split(' ');
  const btn = page.locator(`button:has-text("${path}")`).filter({ hasText: method }).first();
  await btn.click();
  // The detail panel + Send act on the selected endpoint — wait for the switch
  // (list highlights "active") AND for the detail panel to render for this
  // endpoint (path input visible), otherwise Send may fire while unwired
  await expect(btn).toHaveClass(/active/, { timeout: 10000 });
  // Best-effort: endpoint forms (e.g. POST) render an editable path input —
  // wait for it only when it exists (plain GET panels have none)
  const pathInput = page.locator(`input[value="${path}"]`).first();
  if (await pathInput.count()) await expect(pathInput).toBeVisible({ timeout: 10000 });
});

When('I clear the playground token input', async ({ page }) => {
  await page.locator('input[placeholder*="Bearer"]').fill('');
});

Then('the response panel should show status {int}', async ({ page }, status: number) => {
  await expect(page.locator('body')).toContainText(new RegExp(`\\b${status}\\b`), { timeout: 10000 });
});

Then('the response panel should show status {int} or {int}', async ({ page }, a: number, b: number) => {
  // Scoped to the "Response…" panel: the status badge renders without whitespace
  // ("Response401Headers"), so \b word boundaries never match here. The documented
  // responses table cannot false-positive — it has no "Response" prefix.
  await expect(page.locator('body')).toContainText(new RegExp(`Response\\s*(${a}|${b})`), { timeout: 10000 });
});
