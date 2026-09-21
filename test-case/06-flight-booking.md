# Test Cases — Flight Booking

| Field | Detail |
|---|---|
| Module | Flight Booking Scenarios |
| URL | https://www.qapractice.com/flight-booking-scenarios |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
From dropdown (`flight-from`), To dropdown (`flight-to`), Departure date (`flight-departure-date`), Return date (`flight-return-date`), Passengers (`flight-passengers`), Class dropdown (`flight-class`), One-way checkbox (`flight-one-way`), Search Flights button, Back To Home Page link.

## Preconditions
- Flight booking page loaded.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-FB-001 | Search valid round-trip flight | Positive | P1 | 1. Select different From/To<br>2. Future departure<br>3. Later return date<br>4. 2 passengers<br>5. Select class<br>6. Search | e.g. New York→London, +7d/+14d, 2 pax, Economy | Search results shown matching criteria | Pass |
| TC-FB-002 | One-way disables return date | Positive | P1 | 1. Check one-way<br>2. Inspect return date field | — | Return date disabled/ignored; search works with departure only | Pass |
| TC-FB-003 | Unchecking one-way re-enables return | Edge | P2 | 1. Check one-way<br>2. Uncheck it | — | Return date field becomes editable again | Pass |
| TC-FB-004 | Same origin and destination | Negative | P1 | 1. From = To<br>2. Valid dates<br>3. Search | New York→New York | Validation error; search blocked | Pass |
| TC-FB-005 | Return date before departure | Negative | P1 | 1. Departure +14d<br>2. Return +7d<br>3. Search | as stated | Date validation error; search blocked | Pass |
| TC-FB-006 | Departure date in the past | Negative | P1 | 1. Departure yesterday<br>2. Search | past date | Validation error; search blocked | Pass |
| TC-FB-007 | Departure date = today | Edge | P2 | 1. Departure today<br>2. Search | today's date | Accepted or clear rule message — record behavior | Pass |
| TC-FB-008 | Missing From/To selection | Negative | P1 | 1. Leave dropdowns at default<br>2. Search | — | Required validation on both dropdowns | Pass |
| TC-FB-009 | Passengers = 0 | Negative | P2 | 1. Set passengers 0<br>2. Rest valid<br>3. Search | `0` | Validation error; search blocked | Pass |
| TC-FB-010 | Negative passengers | Negative | P2 | 1. Set passengers -1<br>2. Search | `-1` | Rejected/validation error | Pass |
| TC-FB-011 | Excessive passenger count | Edge | P2 | 1. Set passengers 9999<br>2. Search | `9999` | Rejected per max limit or handled gracefully | Pass |
| TC-FB-012 | Each travel class selectable | Positive | P3 | 1. Run valid search per class option | Economy/Business/First (as available) | Results shown for each class | Pass |
| TC-FB-013 | Results match search criteria | Positive | P2 | 1. Run valid search<br>2. Inspect result cards | valid round trip | Route, dates, class in results match the query | Pass |
| TC-FB-014 | Search with empty dates | Negative | P2 | 1. Select From/To only<br>2. Search | — | Required validation on date fields | Pass |
| TC-FB-015 | Swap From/To values | Edge | P3 | 1. Select New York→London<br>2. Swap to London→New York<br>3. Search | as stated | Search runs normally with swapped route | Pass |
| TC-FB-016 | Back To Home Page link | Positive | P3 | 1. Click "Back To Home Page" | — | Navigated back to home/selection page | Pass |
| TC-FB-017 | Rapid double Search click | Edge | P3 | 1. Valid data<br>2. Double-click Search Flights | valid data | Single search executed; no duplicate results/error | Pass |
