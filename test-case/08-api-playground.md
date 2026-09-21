# Test Cases — REST API Playground

| Field | Detail |
|---|---|
| Module | API Automation Playground |
| URL | https://www.qapractice.com/api-playground |
| Version | 1.0 — 2026-09-21 |

## Endpoints Under Test
| Endpoint | Auth | Method |
|---|---|---|
| `/api/auth/login` | No | POST |
| `/api/products` | No | GET |
| `/api/products` | 🔒 Bearer token | POST |
| `/api/users/1` | 🔒 Bearer token | GET |
| `/api/orders` | 🔒 Bearer token | POST |

> Recommended approach: automate with Playwright's `request` fixture (API-level, no browser) plus a few UI-level cases for the playground page itself.

## Preconditions
- API playground reachable.
- Demo credentials for the **API** (verified 2026-09-21): `testuser` / `Password123`,
  sent as `{ "username": ..., "password": ... }`. NOTE: these differ from the
  login-form demo account (`user@premiumbank.com` / `Bank@123`), which the API rejects with 401.

## Test Cases

### API level (via `request` fixture)

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-API-001 | Login returns token | Positive | P1 | 1. POST /api/auth/login with valid creds | `testuser` / `Password123` | HTTP 200; response body contains a token | Pass |
| TC-API-002 | Login with wrong password | Negative | P1 | 1. POST /api/auth/login wrong password | `testuser` / `wrong-password` | HTTP 401; no token in response | Pass |
| TC-API-003 | Login with missing fields | Negative | P2 | 1. POST login with empty body / missing password | `{}` | HTTP 400; error message present | Pass |
| TC-API-004 | GET products without token | Positive | P1 | 1. GET /api/products | — | HTTP 200; product list returned (public endpoint) | Pass |
| TC-API-005 | POST products without token | Negative | P1 | 1. POST /api/products, no Authorization header | valid product body | HTTP 401/403; nothing created | Pass |
| TC-API-006 | POST products with valid token | Positive | P1 | 1. Login → token<br>2. POST /api/products with Bearer token | `{"name":..., "price":...}` | HTTP 200/201; product created & returned — KNOWN ISSUE: site returns 401 via real HTTP (token only works in-browser) | Fail |
| TC-API-007 | GET /api/users/1 with token | Positive | P1 | 1. Login → token<br>2. GET /api/users/1 with token | — | HTTP 200; user object returned — KNOWN ISSUE: same as TC-API-006 | Fail |
| TC-API-008 | GET /api/users/1 without token | Negative | P1 | 1. GET /api/users/1 unauthenticated | — | HTTP 401/403 | Pass |
| TC-API-009 | Invalid/malformed token | Negative | P2 | 1. Call protected endpoint with `Bearer abc123` | fake token | HTTP 401/403 | Pass |
| TC-API-010 | POST /api/orders with token | Positive | P1 | 1. Login → token<br>2. POST /api/orders valid body | valid order payload | HTTP 200/201; order created — KNOWN ISSUE: same as TC-API-006 | Fail |
| TC-API-011 | POST /api/orders missing fields | Negative | P2 | 1. Login → token<br>2. POST /api/orders with incomplete body + token | `{}` / partial | HTTP 400 with validation message — KNOWN ISSUE: site returns 401 (token rejected before validation), same root cause as TC-API-006 | Fail |
| TC-API-012 | Wrong HTTP method | Negative | P3 | 1. GET /api/auth/login (should be POST) | — | HTTP 404/405 | Pass |
| TC-API-013 | Malformed JSON body | Edge | P3 | 1. POST with broken JSON string | `{invalid` | HTTP 400; server does not crash | Pass |

### UI level (playground page)

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-API-014 | "Log in & use token" fills token field | Positive | P2 | 1. Click 🔑 Log in & use token | demo creds | Token input is populated automatically | Pass |
| TC-API-015 | Send request from UI | Positive | P2 | 1. Select GET /api/products<br>2. Click Send | — | Response panel shows 200 + JSON body | Pass |
| TC-API-016 | Send protected request without token via UI | Negative | P2 | 1. Select POST /api/products<br>2. Clear token field<br>3. Send | — | Response panel shows 401/403 | Pass |
