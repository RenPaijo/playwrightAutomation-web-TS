# Test Cases — Forgot Password

| Field | Detail |
|---|---|
| Module | Authentication — Forgot Password |
| URL | https://www.qapractice.com/forget-password |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Email input (`forgot-email`), Continue button, "Back to Login" link, "Back to all practice sites" link.

## Preconditions
- Forgot password page loaded (direct URL or via "Forgot password?" link on login page).
- Registered email on this demo site: `user@premiumbank.com`.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-FP-001 | Submit registered email | Positive | P1 | 1. Enter registered email<br>2. Click Continue | `user@premiumbank.com` | Confirmation/recovery success state shown | Pass |
| TC-FP-002 | Submit unregistered email | Negative | P1 | 1. Enter unregistered email<br>2. Click Continue | `ghost@nowhere.com` | Error or neutral message per spec (no account enumeration ideally) | Pass |
| TC-FP-003 | Submit empty email | Negative | P1 | 1. Click Continue with empty field | — | Required validation shown; not submitted | Pass |
| TC-FP-004 | Invalid email format | Negative | P2 | 1. Enter malformed email<br>2. Continue | `abc@`, `abc` | Email format validation error | Pass |
| TC-FP-005 | Email with leading/trailing spaces | Edge | P2 | 1. Email with spaces<br>2. Continue | `" user@premiumbank.com "` | Trimmed & accepted, or clear validation error | Pass |
| TC-FP-006 | Very long email string | Edge | P3 | 1. 255+ char email<br>2. Continue | 255-char string | Graceful validation error; no crash | Pass |
| TC-FP-007 | XSS payload in email | Security | P2 | 1. Script payload<br>2. Continue | `<img src=x onerror=alert(1)>` | Payload not executed; plain validation error | Pass |
| TC-FP-008 | Submit twice rapidly | Edge | P3 | 1. Valid email<br>2. Click Continue 2x fast | registered email | Handled once; no duplicate state/error | Pass |
| TC-FP-009 | Back to Login link | Positive | P2 | 1. Click "Back to Login" | — | Navigated to `/practice-login-form` | Pass |
| TC-FP-010 | Back to all practice sites link | Positive | P3 | 1. Click "Back to all practice sites" | — | Navigated to `/practice-page-selection` | Pass |
| TC-FP-011 | Submit with Enter key | Usability | P3 | 1. Enter valid email<br>2. Press Enter | registered email | Same as clicking Continue | Pass |
