# Test Cases — General, Navigation & Static Pages

| Field | Detail |
|---|---|
| Module | Site-wide navigation, Practice Selection, About, Contact, Interview Prep |
| URL | https://www.qapractice.com/ |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Header navigation (QA Practice logo, Practice Sites, Interview Prep, About, Contact), Practice Sites selection cards ("Start practising →"), Contact form (name, email, topic select, message, "Open email draft"), Interview library (search, tech checkboxes, favorites ☆, pagination).

## Preconditions
- Site reachable; home page loaded.

## Test Cases

### Navigation & selection page

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-NAV-001 | Selection page loads | Positive | P1 | 1. Open /practice-page-selection | — | Page loads; all practice cards visible | Pass |
| TC-NAV-002 | Every card navigates to correct page | Positive | P1 | 1. Click each "Start practising →" card | 9 cards | Each lands on its documented URL (login, forms, e-commerce, flight, UI elements, XPath, forgot password, register, API playground) | Pass |
| TC-NAV-003 | Header nav links work | Positive | P2 | 1. Click each header link | Home/Practice Sites/Interview/About/Contact | Correct page loads for each link | Pass |
| TC-NAV-004 | Browser back/forward consistency | Edge | P3 | 1. Navigate into a practice page<br>2. Press browser Back | — | Returns to selection page correctly | Pass |
| TC-NAV-005 | Direct URL access to practice pages | Positive | P2 | 1. Open each practice URL directly | all 9 URLs | All pages load without redirect/error | Pass |
| TC-NAV-006 | 404 handling | Negative | P3 | 1. Open a non-existent path | `/this-does-not-exist` | Graceful 404 page (no crash/raw error) | Pass |

### Contact page

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-CT-001 | Contact form renders | Positive | P3 | 1. Open /contact | — | Name, email, topic select, message fields visible | Pass |
| TC-CT-002 | Fill form and open email draft | Positive | P3 | 1. Fill all fields (Faker data)<br>2. Click "Open email draft" | Faker name/email/message | Email draft (mailto) triggered with filled content | Pass |
| TC-CT-003 | Contact form empty submit | Negative | P3 | 1. Click "Open email draft" empty | — | Validation or empty draft — record behavior | Pass |
| TC-CT-004 | Invalid email in contact form | Negative | P3 | 1. Malformed email<br>2. Submit | `abc@` | Email validation error | Pass |

### Interview Prep page

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-IV-001 | Interview library loads | Positive | P3 | 1. Open /interview | — | Question list and filters visible | Pass |
| TC-IV-002 | Search questions | Positive | P3 | 1. Type keyword in search box | `auto-waiting` | Matching questions filtered in | Pass |
| TC-IV-003 | Tech checkbox filters | Positive | P3 | 1. Check e.g. `tech-playwright` | — | Only Playwright-tagged questions shown | Pass |
| TC-IV-004 | Clear all filters | Positive | P3 | 1. Apply filters<br>2. Click "Clear all" | — | Full question list restored | Pass |
| TC-IV-005 | Favorite a question | Edge | P3 | 1. Click ☆ on a question | — | Star state toggles; persisted per spec | Pass |
| TC-IV-006 | Pagination previous/next | Edge | P3 | 1. Navigate pages | — | Question list changes; boundaries disabled correctly | Pass |
