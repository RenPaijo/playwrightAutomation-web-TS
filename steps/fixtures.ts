import { test as base } from 'playwright-bdd';
import type { APIResponse } from '@playwright/test';

/**
 * Per-scenario shared state. A fresh object is created for every test,
 * so When/Then steps of the same scenario can share captured values
 * (baselines, responses, tokens) without leaking across tests.
 */
export type ScenarioState = {
  dialogs: string[];
  attempts?: number;
  errorCount?: number;
  cartBefore?: number;
  countA?: number;
  countB?: number;
  fingerprint?: string;
  keyword?: string;
  token?: string;
  response?: APIResponse;
  navStatus?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  starBefore?: string;
  baselineQuestions?: number;
  dropdownUpdatesOk?: boolean;
  datepickerDate?: string;
  savedChallenge?: string;
};

export const test = base.extend<{ state: ScenarioState }>({
  state: async ({}, use) => {
    await use({ dialogs: [] });
  },
});
