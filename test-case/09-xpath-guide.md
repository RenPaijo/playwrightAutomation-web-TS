# Test Cases — XPath Practice Guide

| Field | Detail |
|---|---|
| Module | Interactive XPath Practice (130 challenges) |
| URL | https://www.qapractice.com/SeleniumXPathGuide |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Difficulty filters (All / Easy 49 / Medium 53 / Hard 28), status filters (All / Unsolved / Solved), Saved filter, challenge search input, XPath answer input, challenge navigation, progress counters.

## Preconditions
- XPath practice page loaded; challenge list visible.

> Note: This module is mainly a training tool. A small smoke-level suite is enough;
> it is also a good playground for hardening locator strategies used in other suites.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-XP-001 | Page loads with challenge list | Positive | P2 | 1. Open page | — | Challenge list visible; counters show 0/130 initially | Pass |
| TC-XP-002 | Filter Easy challenges | Positive | P2 | 1. Click Easy filter | — | Only Easy challenges listed; count badge = 49 | Pass |
| TC-XP-003 | Filter Medium / Hard challenges | Positive | P3 | 1. Click Medium, then Hard | — | Counts match 53 and 28 respectively | Pass |
| TC-XP-004 | Filter counts sum to total | Edge | P3 | 1. Read Easy+Medium+Hard counts | — | 49 + 53 + 28 = 130 (matches "All") | Pass |
| TC-XP-005 | Search challenge by keyword | Positive | P3 | 1. Type keyword in search | e.g. `checkbox` | Matching challenges filtered in | Pass |
| TC-XP-006 | Search with no match | Negative | P3 | 1. Search gibberish | `zzzqqq` | Empty state shown gracefully | Pass |
| TC-XP-007 | Submit correct XPath answer | Positive | P2 | 1. Open challenge 1 (Select by ID)<br>2. Enter correct XPath<br>3. Submit | correct XPath for target | Challenge marked solved; solved counter increments | Pass |
| TC-XP-008 | Submit wrong XPath answer | Negative | P2 | 1. Enter invalid/wrong XPath<br>2. Submit | `//nonexistent` | Error feedback; challenge remains unsolved | Pass |
| TC-XP-009 | Submit empty answer | Negative | P3 | 1. Submit with empty input | — | Validation / no state change | Pass |
| TC-XP-010 | Solved filter shows progress | Edge | P3 | 1. Solve 1 challenge<br>2. Click Solved filter | — | Only solved challenge listed; Solved count = 1 | Pass |
| TC-XP-011 | Save/favorite a challenge | Positive | P3 | 1. Click ★ on a challenge<br>2. Open Saved filter | — | Challenge appears under Saved | Pass |
