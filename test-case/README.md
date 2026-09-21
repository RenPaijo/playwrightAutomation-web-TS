# Test Case Documentation — qapractice.com

**Target site:** https://www.qapractice.com/practice-page-selection
**Document version:** 1.0
**Date:** 2026-09-21
**Author:** QA Team
**Test framework:** Playwright + TypeScript + playwright-bdd (BDD)

## Scope

Test cases for all practice pages reachable from the Practice Sites selection page.
Each module has its own file. All cases were designed from live exploration of the
site (DOM inspection + documented expected behaviors on each page).

## File Index

| File | Module | URL |
|---|---|---|
| [01-login-form.md](01-login-form.md) | Login Form | /practice-login-form |
| [02-register.md](02-register.md) | Registration | /register |
| [03-forgot-password.md](03-forgot-password.md) | Forgot Password | /forget-password |
| [04-web-form.md](04-web-form.md) | Web Form | /practice-forms |
| [05-ecommerce.md](05-ecommerce.md) | E-commerce | /practice-ecommerece-website |
| [06-flight-booking.md](06-flight-booking.md) | Flight Booking | /flight-booking-scenarios |
| [07-ui-elements.md](07-ui-elements.md) | UI Elements | /practice-different-ui-elements |
| [08-api-playground.md](08-api-playground.md) | REST API Playground | /api-playground |
| [09-xpath-guide.md](09-xpath-guide.md) | XPath Practice | /SeleniumXPathGuide |
| [10-general-navigation.md](10-general-navigation.md) | General, Navigation, About, Contact, Interview | / |

## Conventions

### Test Case ID
`TC-<MODULE>-<NUMBER>` — e.g. `TC-LF-001` = Login Form case #1.

### Priority
| Code | Meaning | Automation policy |
|---|---|---|
| P1 | Critical / core flow | Automated, tagged `@smoke` |
| P2 | Important / common variation | Automated, tagged `@regression` |
| P3 | Nice to have / cosmetic | Manual or automated if cheap |

### Type
- **Positive** — valid input, expected happy-path behavior
- **Negative** — invalid input/action, expected error handling
- **Edge** — boundary values, unusual but valid/invalid combinations
- **Security** — injection, masking, exposure checks
- **Usability** — keyboard, focus, UX behavior
- **Dynamic** — async UI behavior (progress, notifications, downloads)

Each type is mirrored as a Cucumber tag on the scenario (`@positive`, `@negative`,
`@edge`, `@security`, `@usability`, `@dynamic`), so tests can be filtered by type:
`npm test -- --grep @negative` or combined: `npm test -- --grep "@login and @negative"`.

### Status column values
`Not Run` / `Pass` / `Fail` / `Blocked` / `N/A`

### Demo credentials (documented on the site)
- Email: `user@premiumbank.com`
- Password: `Bank@123`
