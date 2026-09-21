# Test Cases — Web Form

| Field | Detail |
|---|---|
| Module | Web Form Automation |
| URL | https://www.qapractice.com/practice-forms |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Country dropdown (`forms-country`), Title dropdown (`forms-title`), First name (`forms-first-name`), Last name (`forms-last-name`), DOB (`forms-dob`, format `YYYY-MM-DD`), DOJ (`forms-doj`, format `dd/mm/yyyy`), Email (`forms-email`), Phone code dropdown (`forms-phone-code`), Phone number (`forms-phone-number`), Communication preference radios (`forms-comm-email` / `forms-comm-phone`), Clear button, Submit button.

> ⚠️ Note: DOB and DOJ intentionally use **different date formats** — a classic trap for automation and a rich source of negative cases.

## Preconditions
- Web form page loaded.
- Use Faker for names, emails, and phone numbers in positive cases.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-WF-001 | Submit fully valid form | Positive | P1 | 1. Fill all fields with valid data<br>2. Select a comm preference<br>3. Click Submit | Faker name/email/phone; DOB `1995-06-15`; DOJ `15/06/2020` | Form accepted; success/confirmation state shown | Pass |
| TC-WF-002 | Submit empty form | Negative | P1 | 1. Click Submit without filling anything | — | Required validation on all mandatory fields; not submitted | Pass |
| TC-WF-003 | Clear button resets all fields | Positive | P2 | 1. Fill every field<br>2. Click Clear | valid data | All inputs/dropdowns/radios back to default empty state | Pass |
| TC-WF-004 | DOB in wrong format | Negative | P1 | 1. Enter DOB as `15/06/1995`<br>2. Fill rest valid<br>3. Submit | DOB `15/06/1995` | Silently ignored: no success modal, page stays usable (verified 2026-09-21) | Pass |
| TC-WF-005 | DOJ in wrong format | Negative | P1 | 1. Enter DOJ as `2020-06-15`<br>2. Fill rest valid<br>3. Submit | DOJ `2020-06-15` | Silently ignored: no success modal, page stays usable (verified 2026-09-21) | Pass |
| TC-WF-006 | Impossible date values | Edge | P2 | 1. DOB `2023-02-30` / DOJ `31/02/2020`<br>2. Submit | as stated | Silently ignored: no success modal, page stays usable (verified 2026-09-21) | Pass |
| TC-WF-007 | DOB in the future | Edge | P2 | 1. DOB = tomorrow's date<br>2. Rest valid<br>3. Submit | future DOB | Rejected or accepted per documented rule — record actual behavior | Pass |
| TC-WF-008 | DOJ earlier than plausible (DOJ < DOB logic) | Edge | P2 | 1. DOB `2000-01-01`, DOJ `01/01/1990`<br>2. Submit | as stated | Logical-date validation error (if implemented) | Pass |
| TC-WF-009 | Invalid email format | Negative | P2 | 1. Malformed email<br>2. Rest valid<br>3. Submit | `name@`, `name@x` | Email validation error | Pass |
| TC-WF-010 | Phone number with letters | Negative | P2 | 1. Phone `abc123xyz`<br>2. Rest valid<br>3. Submit | as stated | Phone validation error | Pass |
| TC-WF-011 | Phone number too short / too long | Edge | P2 | 1. Try `12` and `1234567890123456`<br>2. Submit | as stated | Length validation error per spec | Pass |
| TC-WF-012 | Phone code not selected | Negative | P2 | 1. Fill phone number only<br>2. Submit | phone `8123456789` | Validation error on phone code (if required) | Pass |
| TC-WF-013 | Comm preference radios are exclusive | Edge | P2 | 1. Select Email radio<br>2. Then select Phone radio | — | Only Phone remains selected (mutual exclusivity) | Pass |
| TC-WF-014 | No comm preference selected | Negative | P2 | 1. Fill rest valid, skip radios<br>2. Submit | — | Validation error if required; else submits OK — record behavior | Pass |
| TC-WF-015 | Names with special characters | Edge | P2 | 1. First name `O'Brien-Smith`<br>2. Rest valid<br>3. Submit | as stated | Single hidden modal node, no error (site quirk, verified 2026-09-21) | Pass |
| TC-WF-016 | Names with numbers/symbols | Negative | P3 | 1. First name `John123!`<br>2. Submit | as stated | Validation error per name rules | Pass |
| TC-WF-017 | Very long name inputs | Edge | P3 | 1. 100+ char first/last name<br>2. Submit | 100-char strings | Graceful handling; no layout break | Pass |
| TC-WF-018 | XSS payload in text fields | Security | P2 | 1. `<script>alert(1)</script>` in name fields<br>2. Submit | payload | Not executed; escaped/rejected | Pass |
| TC-WF-019 | Dropdown default state | Edge | P3 | 1. Load page<br>2. Inspect Country/Title dropdowns | — | Placeholder/default option shown, no preselected value (or per spec) | Pass |
| TC-WF-020 | Rapid double Submit | Edge | P3 | 1. Valid form<br>2. Double-click Submit | valid data | Exactly one modal node created (verified 2026-09-21) | Pass |
