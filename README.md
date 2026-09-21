# Web Automation Tests

Playwright + TypeScript + playwright-bdd (Gherkin) end-to-end suite for the
[qapractice.com](https://www.qapractice.com) practice site.
170 test cases across 10 modules, all automated 1:1 from `test-case/*.md`.

## Stack

| Tool | Purpose |
|---|---|
| Playwright 1.63 | Browser automation (Chromium + Firefox) |
| playwright-bdd 9 | `.feature` → Playwright specs (via `bddgen`) |
| TypeScript 7 (strict) | Step definitions |
| Allure + HTML report | Test reporting |
| Faker | Random test data (emails, names, phones) |

## Project Structure

```
features/            Gherkin specs, one per module (@tags for filtering)
steps/               Step definitions + shared fixtures/helpers
  fixtures.ts        Per-scenario state (fresh object per test)
  helpers.ts         Shared detectors (disabled controls, email validation)
  common.steps.ts    Cross-module steps (navigation, clicks, XSS guards)
  *.steps.ts         One file per module
test-case/           Test-case documentation (TC-*-*, source of truth for coverage)
playwright.config.ts Timeouts, retries, reporters, ad/tracker blocking
scripts/             Probes (exploratory) + run-with-reports.js runner
```

## Setup

```bash
npm install
npx playwright install chromium firefox
```

Target site defaults to `https://www.qapractice.com`; override with `BASE_URL`:

```bash
BASE_URL=https://staging.example.com npm test
```

## Running Tests

```bash
npm test                                     # bddgen + full suite + Allure report
npm test -- --grep @smoke                    # critical paths only (P1)
npm test -- --grep @register                 # one module
npm test -- --grep @TC-LF-001                # one case
npm test -- --grep "@login and @negative"    # combined filter
npm run test:headed                          # watch the browser
npx tsc --noEmit                             # typecheck
```

> `npm test` always regenerates the Allure HTML report, even on failure
> (exit code still follows the test result, so CI stays correct).

Type tags mirror the docs: `@positive @negative @edge @security @usability @dynamic`.
Priority tags: `@smoke` (P1) / `@regression` (P2–P3).

## Conventions

- **Regenerate after editing steps**: `npx bddgen`. The generated specs pass
  fixtures per step from the definition signature — a signature change
  (`{ page }` → `{ page, state }`) silently drops the fixture until regen.
- **No fixed sleeps**: use `expect.poll` / auto-retrying assertions.
  (`waitForTimeout` remains only where it is functional: click-loop pacing,
  cap dwell.)
- **Magic numbers are named constants** (`FULL_CATALOG_COUNT`,
  `TOTAL_CHALLENGES`) with an "update if the site changes" note; counts that
  can be derived (last pagination page, filter badges) are read live.
- **No secrets**: only public demo accounts (see below).

## Demo Accounts

| Subsystem | Username / Email | Password |
|---|---|---|
| Login form, register, forgot password | `user@premiumbank.com` | `Bank@123` |
| REST API (`{ "username", "password" }`) | `testuser` | `Password123` |

The two subsystems use **different** credentials — the API rejects the
login-form account with 401.

## Known Issues (expected failures, not quarantined)

Several cases below are intentionally failed: they assert the documented ideal
behavior, which the live site violates. This keeps the passed-vs-failed
comparison visible in every report instead of a flat all-green board.

| Cases | Behavior |
|---|---|
| TC-API-006/007/010/011 | Protected endpoints return 401 via real HTTP even with a fresh token (token works only in-browser) |
| TC-RG-003/010 | Site accepts duplicate emails as "Registration Successful" |

## Reports

- Playwright HTML: `playwright-report/` (`npm run report`)
- Allure: `allure-report/` (`npm run report:allure`)
- Traces/screenshots/video on failure: `test-results/` (`npx playwright show-trace <file>`)
