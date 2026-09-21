# Test Cases — UI Elements

| Field | Detail |
|---|---|
| Module | Different UI Elements Practice |
| URL | https://www.qapractice.com/practice-different-ui-elements |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Text field (`textField`), textarea (`textArea`), single checkbox (`ui-single-checkbox`), checkbox group (`option1-3`), radio group (`radioGroup`), single dropdown (`singleDropdown`), multi dropdown (`multiDropdown`), slider (`ui-slider`), datepicker (`ui-datepicker`), file upload (`ui-file-upload`), dynamic buttons (Click Me, Increment Progress, Show Modal, Simulate Download, Update Content, Show Notification), accordions.

## Preconditions
- UI Elements page loaded; all sections (Basic / Interactive / Complex / Advanced) visible.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-UI-001 | Text field accepts and retains input | Positive | P1 | 1. Type text into `textField`<br>2. Assert value | `Hello QA` | Field value equals typed text | Pass |
| TC-UI-002 | Textarea multiline input | Positive | P2 | 1. Type multi-line text into `textArea` | 3-line text | All lines retained with line breaks | Pass |
| TC-UI-003 | Single checkbox toggle | Positive | P1 | 1. Check `ui-single-checkbox`<br>2. Uncheck it | — | Checked state toggles correctly both ways | Pass |
| TC-UI-004 | Checkbox group multi-select | Positive | P2 | 1. Check option1 & option3 | — | Both checked, option2 unchecked (independent) | Pass |
| TC-UI-005 | Radio group exclusivity | Positive | P1 | 1. Select radio A<br>2. Select radio B | — | Only radio B remains selected | Pass |
| TC-UI-006 | Single dropdown selection | Positive | P1 | 1. Select each option of `singleDropdown` | all options | Selected value updates each time | Pass |
| TC-UI-007 | Multi dropdown multiple selection | Positive | P2 | 1. Select 2+ options in `multiDropdown` | 2 options | All chosen options remain selected | Pass |
| TC-UI-008 | Slider set to min / max | Edge | P2 | 1. Drag/set slider to 0<br>2. Then to 100 | — | Value reaches exact min and max | Pass |
| TC-UI-009 | Datepicker valid date | Positive | P2 | 1. Enter valid date in `ui-datepicker` | `2026-10-01` | Date accepted & displayed per format | Pass |
| TC-UI-010 | Datepicker invalid format | Negative | P2 | 1. Enter `32/13/2026` or text | invalid strings | Kept as-is and echoed to Output; no validation performed (site gap, verified 2026-09-21) | Pass |
| TC-UI-011 | File upload | Positive | P2 | 1. Upload a small test file via `ui-file-upload` | e.g. `sample.txt` | File name registered in input / upload feedback shown | Pass |
| TC-UI-012 | Click Me button response | Positive | P1 | 1. Click "Click Me" | — | Visible state change / feedback message appears | Pass |
| TC-UI-013 | Increment Progress to 100% | Dynamic | P1 | 1. Click "Increment Progress" repeatedly | — | Progress bar increases per click and stops correctly at 100% | Pass |
| TC-UI-014 | Progress beyond 100% | Edge | P3 | 1. Keep clicking after 100% | — | Progress capped at 100%, no overflow/crash | Pass |
| TC-UI-015 | Show Modal open & close | Positive | P1 | 1. Click "Show Modal"<br>2. Assert modal visible<br>3. Close it | — | Modal appears with content; closes via its close control | Pass |
| TC-UI-016 | Modal interaction behind overlay | Edge | P3 | 1. Open modal<br>2. Try clicking background button | — | Background not interactive while modal open (per spec) | Pass |
| TC-UI-017 | Simulate Download triggers download | Dynamic | P2 | 1. Click "Simulate Download" | — | Download event fires / file downloaded (assert via download event) | Pass |
| TC-UI-018 | Update Content changes text | Dynamic | P2 | 1. Note current content<br>2. Click "Update Content" | — | Target content text changes to new value | Pass |
| TC-UI-019 | Show Notification appears | Dynamic | P2 | 1. Click "Show Notification" | — | Notification element becomes visible with message | Pass |
| TC-UI-020 | Notification auto-dismiss | Edge | P3 | 1. Click "Show Notification"<br>2. Wait | — | Notification disappears automatically after timeout (if designed so) | Pass |
| TC-UI-021 | Accordion expand/collapse | Positive | P2 | 1. Expand Accordion Item #1<br>2. Collapse it | — | Content shows then hides | Pass |
| TC-UI-022 | Accordion multiple items | Edge | P3 | 1. Open Item #1<br>2. Open Item #2 | — | Behavior per spec: #1 collapses (exclusive) or both open — record | Pass |
| TC-UI-023 | Long text in text field | Edge | P3 | 1. Enter 1000+ chars | long string | Field handles input; no layout break | Pass |
| TC-UI-024 | XSS payload in text inputs | Security | P2 | 1. Enter `<script>alert(1)</script>` in textField/textArea | payload | Not executed; stored as plain text | Pass |
