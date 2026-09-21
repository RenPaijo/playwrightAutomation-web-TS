import type { Locator, Page } from '@playwright/test';

/**
 * Shared UI helpers for step definitions.
 *
 * The demo site signals control state and validation through several
 * conventions at once (native attributes, aria-*, CSS classes, custom
 * messages), so steps share these detectors instead of reimplementing them.
 */

/** True when the control is disabled via any convention the site uses. */
export async function isDisabled(el: Locator): Promise<boolean> {
  return (
    (await el.isDisabled().catch(() => false)) ||
    (await el.getAttribute('aria-disabled')) === 'true' ||
    /disabled/i.test((await el.getAttribute('class')) ?? '')
  );
}

/**
 * True when at least one matched element is visible. Some pages render the
 * same message 2-4× (SSR + client copies), which trips Playwright's strict
 * mode on plain visibility assertions — this checks each match instead.
 */
export async function isAnyVisible(el: Locator): Promise<boolean> {
  const n = await el.count().catch(() => 0);
  for (let i = 0; i < n; i++) {
    if (await el.nth(i).isVisible().catch(() => false)) return true;
  }
  return false;
}
/**
 * True when an email field reports a format problem — either natively
 * (type=email validity) or via a custom message on the page.
 */
export async function hasEmailFormatError(page: Page, selector: string): Promise<boolean> {
  const nativelyInvalid = await page
    .locator(selector)
    .first()
    .evaluate((e: HTMLInputElement) => !e.validity.valid);
  const customMessage = await page.getByText(/valid email|invalid email/i).count();
  return nativelyInvalid || customMessage > 0;
}
