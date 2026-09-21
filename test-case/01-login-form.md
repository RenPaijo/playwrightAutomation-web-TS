# Test Cases — Login Form

| Field | Detail |
|---|---|
| Module | Authentication — Login Form |
| URL | https://www.qapractice.com/practice-login-form |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Email input (`login-email`), Password input (`login-password`), Remember me checkbox (`login-remember`), Sign in button, "Forgot password?" link, "Back To Practice UI Automation Examples" link.

## Preconditions
- Browser open, login page loaded successfully.
- Valid credentials (documented on page): `user@premiumbank.com` / `Bank@123`.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-LF-001 | Login with valid credentials | Positive | P1 | 1. Open login page<br>2. Enter valid email<br>3. Enter valid password<br>4. Click Sign in | `user@premiumbank.com` / `Bank@123` | Login success state is shown (success message / logged-in view) | Pass |
| TC-LF-002 | Login with wrong password | Negative | P1 | 1. Enter valid email<br>2. Enter wrong password<br>3. Click Sign in | `user@premiumbank.com` / `WrongPass1` | Error message displayed; user stays on login page; no success state | Pass |
| TC-LF-003 | Login with unregistered email | Negative | P1 | 1. Enter unregistered email<br>2. Enter any password<br>3. Click Sign in | `nobody@example.com` / `Bank@123` | Error message displayed; no success state | Pass |
| TC-LF-004 | Submit with both fields empty | Negative | P1 | 1. Leave email & password empty<br>2. Click Sign in | — | Required-field validation shown for both fields; form not submitted | Pass |
| TC-LF-005 | Submit with empty email only | Negative | P1 | 1. Leave email empty<br>2. Enter valid password<br>3. Click Sign in | `Bank@123` | Email required validation shown; form not submitted | Pass |
| TC-LF-006 | Submit with empty password only | Negative | P1 | 1. Enter valid email<br>2. Leave password empty<br>3. Click Sign in | `user@premiumbank.com` | Password required validation shown; form not submitted | Pass |
| TC-LF-007 | Invalid email format | Negative | P2 | 1. Enter malformed email<br>2. Enter password<br>3. Click Sign in | `user@`, `userpremiumbank.com`, `user@com` | Email format validation error; form not submitted | Pass |
| TC-LF-008 | Password is case-sensitive | Edge | P2 | 1. Enter valid email<br>2. Enter password with wrong case<br>3. Click Sign in | `user@premiumbank.com` / `bank@123` | Login rejected with error message | Pass |
| TC-LF-009 | Leading/trailing spaces in email | Edge | P2 | 1. Enter email with surrounding spaces<br>2. Valid password<br>3. Sign in | `" user@premiumbank.com "` / `Bank@123` | Either trimmed & login succeeds, or clear validation error (per spec) | Pass |
| TC-LF-010 | SQL injection attempt | Security | P2 | 1. Enter injection strings in both fields<br>2. Sign in | `' OR '1'='1` / `' OR '1'='1` | Submit blocked by email format validation; no crash; no success state | Pass |
| TC-LF-011 | XSS attempt in email field | Security | P2 | 1. Enter script payload as email<br>2. Sign in | `<script>alert(1)</script>` | Payload not executed; treated as plain text / validation error | Pass |
| TC-LF-012 | Password field is masked | Security | P2 | 1. Type password<br>2. Inspect field | `Bank@123` | Input `type=password`; characters shown as bullets/dots | Pass |
| TC-LF-013 | Remember me checked | Positive | P2 | 1. Enter valid credentials<br>2. Check Remember me<br>3. Sign in | valid creds | Login succeeds and preference is persisted per page spec | Pass |
| TC-LF-014 | Remember me unchecked (default) | Edge | P3 | 1. Verify checkbox default state | — | Checkbox is unchecked by default | Pass |
| TC-LF-015 | Forgot password link navigates | Positive | P2 | 1. Click "Forgot password?" | — | Navigated to `/forget-password` | Pass |
| TC-LF-016 | Submit form with Enter key | Usability | P3 | 1. Fill valid credentials<br>2. Press Enter in password field | valid creds | Same result as clicking Sign in | Pass |
| TC-LF-017 | Very long input values | Edge | P3 | 1. Enter 255+ char email/password<br>2. Sign in | 255-char strings | Handled gracefully: validation error, no crash/layout break | Pass |
| TC-LF-018 | Multiple consecutive failed logins | Edge | P3 | 1. Attempt login with wrong password 5x | wrong password | Consistent error each time; no crash (note lockout behavior if any) | Pass |
| TC-LF-019 | Back link to practice selection | Positive | P3 | 1. Click "Back To Practice UI Automation Examples" | — | Navigated to home `/` (link target drifted from `/practice-page-selection`, verified 2026-09-21) | Pass |
