# Test Cases — E-commerce

| Field | Detail |
|---|---|
| Module | Dummy E-commerce |
| URL | https://www.qapractice.com/practice-ecommerece-website |
| Version | 1.0 — 2026-09-21 |

## Elements Under Test
Search input (`ecom-search`), Category filters (All / Electronics / Fashion / Beauty / Beverages), Sort dropdown (`ecom-sort`), Quantity inputs per product (`quantity-N`), Add to Cart buttons, Pagination (Previous / page numbers).

## Preconditions
- E-commerce page loaded; default product list visible.

## Test Cases

| TC ID | Title | Type | Priority | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC-EC-001 | Search existing product keyword | Positive | P1 | 1. Type keyword of a visible product<br>2. Submit search | e.g. product name from list | Only matching products shown | Pass |
| TC-EC-002 | Search with no results | Negative | P1 | 1. Search gibberish keyword | `zzzqqq123` | Empty state / "no products" message shown gracefully | Pass |
| TC-EC-003 | Search is case-insensitive | Edge | P2 | 1. Search same keyword in UPPER and lower case | `PHONE` vs `phone` | Same result set both times | Pass |
| TC-EC-004 | Partial keyword search | Edge | P2 | 1. Search partial product name | first 3-4 chars | Products containing the fragment are shown | Pass |
| TC-EC-005 | Search with special characters | Security | P2 | 1. Search `<script>alert(1)</script>` or `' OR 1=1` | payloads | Not executed; treated as plain text; no crash | Pass |
| TC-EC-006 | Empty search resets list | Edge | P2 | 1. Search keyword<br>2. Clear search & submit | — | Full product list restored | Pass |
| TC-EC-007 | Filter by each category | Positive | P1 | 1. Click each category tab | Electronics/Fashion/Beauty/Beverages | Every visible product belongs to selected category | Pass |
| TC-EC-008 | "All" filter shows everything | Positive | P2 | 1. Select a category<br>2. Click All | — | Unfiltered product list restored | Pass |
| TC-EC-009 | Combined search + category filter | Edge | P2 | 1. Select category<br>2. Search keyword within it | matching keyword | Intersection of both filters shown | Pass |
| TC-EC-010 | Sort by price ascending | Positive | P2 | 1. Select sort asc<br>2. Read prices top→bottom | sort option | Prices in non-decreasing order | Pass |
| TC-EC-011 | Sort by price descending | Positive | P2 | 1. Select sort desc<br>2. Read prices top→bottom | sort option | Prices in non-increasing order | Pass |
| TC-EC-012 | Add single product to cart | Positive | P1 | 1. Set qty 1<br>2. Click Add to Cart | qty `1` | Cart counter/state increases by 1; feedback shown | Pass |
| TC-EC-013 | Add product with quantity > 1 | Positive | P2 | 1. Set qty 3<br>2. Add to Cart | qty `3` | Cart increases by 3 | Pass |
| TC-EC-014 | Add to cart with qty 0 | Edge | P2 | 1. Set qty 0<br>2. Add to Cart | qty `0` | Rejected with validation, or nothing added | Pass |
| TC-EC-015 | Add to cart with negative qty | Negative | P2 | 1. Set qty -1<br>2. Add to Cart | qty `-1` | Rejected; no negative cart state | Pass |
| TC-EC-016 | Add same product twice | Edge | P2 | 1. Add product qty 1<br>2. Add same product qty 1 again | — | Cart accumulates (qty 2) per spec | Pass |
| TC-EC-017 | Add multiple different products | Positive | P2 | 1. Add 3 different products | qty 1 each | Cart reflects total of 3 items | Pass |
| TC-EC-018 | Pagination navigation | Positive | P2 | 1. Go to page 2<br>2. Back to page 1 | — | Different products per page; page state indicated | Pass |
| TC-EC-019 | Pagination boundary | Edge | P3 | 1. On first page click Previous<br>2. On last page click Next | — | Previous disabled on page 1; Next disabled on last page | Pass |
| TC-EC-020 | Filter persists across pagination | Edge | P3 | 1. Apply category filter<br>2. Go to page 2 | — | Page 2 still shows only filtered category | Pass |
| TC-EC-021 | Add to cart from page 2 | Edge | P3 | 1. Go to page 2<br>2. Add a product | qty 1 | Cart updates correctly from non-first page | Pass |
