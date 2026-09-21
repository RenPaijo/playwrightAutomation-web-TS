# Test Cases — Registration

| Field | Detail |
|---|---|
| Module | Authentication — Registration |
| URL | https://www.qapractice.com/register |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Email input (`register-email`), Password input (`register-password`), Confirm password input (`register-confirm-password`), Register button, "Back To Login Page" link.

## Preconditions
- Registration page loaded.
- Use Faker-generated unique emails for positive cases to avoid duplicates.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-RG-001 | Register with valid data | Positive | P1 | 1. Enter unique valid email<br>2. Enter valid password<br>3. Re-enter same password<br>4. Click Register | Faker email; e.g. `Test@1234` | Registration success state shown | Pass |
| TC-RG-002 | Password and confirm password mismatch | Negative | P1 | 1. Valid email<br>2. Password `Test@1234`<br>3. Confirm `Test@9999`<br>4. Register | as stated | Mismatch error shown; registration blocked | Pass |
| TC-RG-003 | Register with already-registered email | Negative | P1 | 1. Use demo email<br>2. Valid password x2<br>3. Register | `user@premiumbank.com` / `Bank@123` | "Email already registered" style error | Fail |
| TC-RG-004 | All fields empty | Negative | P1 | 1. Click Register directly | — | "Email is required" shown; no success state (passwords show the live policy list instead of required errors, verified 2026-09-21) | Pass |
| TC-RG-005 | Invalid email format | Negative | P2 | 1. Enter malformed email<br>2. Valid passwords<br>3. Register | `abc@`, `abc.com`, `@x.com` | Email format validation error | Pass |
| TC-RG-006 | Weak password — too short | Negative | P2 | 1. Valid email<br>2. Short password x2<br>3. Register | `Ab@1` | Password policy error shown | Pass |
| TC-RG-007 | Weak password — missing complexity | Negative | P2 | 1. Valid email<br>2. Password without uppercase/number/symbol<br>3. Register | `password`, `alllowercase1` | Password policy error per documented rules | Pass |
| TC-RG-008 | Password fields are masked | Security | P2 | 1. Type in password & confirm fields | any | Both inputs `type=password`, chars masked | Pass |
| TC-RG-009 | Leading/trailing spaces in email | Edge | P2 | 1. Email with spaces around it<br>2. Valid passwords<br>3. Register | `" test@mail.com "` | Trimmed & accepted, or clear validation error | Pass |
| TC-RG-010 | Case variants of same email | Edge | P3 | 1. Register `User@PremiumBank.com` after `user@premiumbank.com` exists | as stated | Treated as duplicate (emails case-insensitive) or per spec | Fail |
| TC-RG-011 | Very long password | Edge | P3 | 1. 128+ char password x2<br>2. Register | 128-char valid-complexity string | Accepted or graceful length error; no crash | Pass |
| TC-RG-012 | XSS payload in email field | Security | P2 | 1. Script payload as email<br>2. Register | `<script>alert(1)</script>` | Payload not executed; plain validation error | Pass |
| TC-RG-013 | Back To Login Page link | Positive | P3 | 1. Click "Back To Login Page" | — | Navigated to `/practice-login-form` | Pass |
| TC-RG-014 | Submit with Enter key | Usability | P3 | 1. Fill all fields<br>2. Press Enter in confirm field | valid data | Same as clicking Register | Pass |
| TC-RG-015 | Double-click Register rapidly | Edge | P3 | 1. Valid data<br>2. Double-click Register fast | valid data | Single submission handled; no duplicate/error state | Pass |
