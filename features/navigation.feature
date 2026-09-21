@navigation
Feature: General Navigation and Static Pages
  Verify site-wide navigation: the practice selection page and its cards,
  header links, browser back/forward, direct URL access, 404 handling,
  plus the Contact and Interview Prep pages.

  Base URL: https://www.qapractice.com
  Test case reference: test-case/10-general-navigation.md (TC-NAV-*, TC-CT-*, TC-IV-*)
  Run this module only:  npm test -- --grep @navigation
  Run a single case:     npm test -- --grep @TC-NAV-001
  Run by type:           npm test -- --grep "@navigation and @negative"
                         (types in this file: @positive @negative @edge)

  @TC-NAV-001 @smoke @positive
  Scenario: Practice selection page loads with all cards
    Given I am on the "practice selection" page
    Then all 9 practice cards should be visible

  @TC-NAV-002 @smoke @positive
  Scenario Outline: Each practice card navigates to its page
    Given I am on the "practice selection" page
    When I open the practice card for "<page>"
    Then I should be on the "<path>" page

    Examples:
      | page           | path                             |
      | login form     | practice-login-form              |
      | web form       | practice-forms                   |
      | e-commerce     | practice-ecommerece-website      |
      | flight booking | flight-booking-scenarios         |
      | ui elements    | practice-different-ui-elements   |
      | xpath guide    | SeleniumXPathGuide               |
      | api playground | api-playground                   |

  @TC-NAV-003 @regression @positive
  Scenario Outline: Header navigation links work
    Given I am on the "home" page
    When I click the "<link>" navigation link
    Then I should be on the "<path>" page

    Examples:
      | link           | path                    |
      | Practice Sites | practice-page-selection |
      | Interview Prep | interview               |
      | About          | AboutPage               |
      | Contact        | contact                 |

  @TC-NAV-004 @regression @edge
  Scenario: Browser back returns to the selection page
    Given I am on the "practice selection" page
    When I open the practice card for "login form"
    And I navigate back in the browser
    Then I should be on the "practice selection" page

  @TC-NAV-005 @regression @positive
  Scenario Outline: Direct URL access to practice pages
    When I open the url "<path>" directly
    Then the page should load without an error

    Examples:
      | path                           |
      | practice-login-form            |
      | practice-forms                 |
      | practice-ecommerece-website    |
      | flight-booking-scenarios       |
      | practice-different-ui-elements |
      | register                       |
      | forget-password                |
      | api-playground                 |

  @TC-NAV-006 @regression @negative
  Scenario: Non-existent page shows a graceful 404
    When I open the url "this-does-not-exist" directly
    Then a graceful not-found page should be shown

  @TC-CT-001 @regression @positive
  Scenario: Contact form renders all fields
    Given I am on the "contact" page
    Then the contact form fields should be visible

  @TC-CT-002 @regression @positive
  Scenario: Filled contact form opens an email draft
    Given I am on the "contact" page
    When I fill the contact form with generated data
    And I click the "Open email draft" button
    Then an email draft should be triggered

  @TC-CT-003 @regression @negative
  Scenario: Contact form submitted empty
    Given I am on the "contact" page
    When I click the "Open email draft" button
    Then I record the actual "empty-contact-form" behavior

  @TC-CT-004 @regression @negative
  Scenario: Contact form with invalid email
    Given I am on the "contact" page
    When I fill the contact email with "abc@"
    And I click the "Open email draft" button
    Then I should see an email format validation on the contact form

  @TC-IV-001 @regression @positive
  Scenario: Interview library loads
    Given I am on the "interview" page
    Then the question list and filters should be visible

  @TC-IV-002 @regression @positive
  Scenario: Search interview questions
    Given I am on the "interview" page
    When I search questions for "auto-waiting"
    Then only matching questions should be listed

  @TC-IV-003 @regression @positive
  Scenario: Filter questions by technology
    Given I am on the "interview" page
    When I check the "tech-playwright" filter
    Then only Playwright-tagged questions should be listed

  @TC-IV-004 @regression @positive
  Scenario: Clear all question filters
    Given I am on the "interview" page
    When I check the "tech-playwright" filter
    And I click the "Clear all" button
    Then the full question list should be restored

  @TC-IV-005 @regression @edge
  Scenario: Favorite a question
    Given I am on the "interview" page
    When I favorite the first question
    Then the question star should be toggled on

  @TC-IV-006 @regression @edge
  Scenario: Interview pagination boundaries
    Given I am on the "interview" page
    Then the "Previous" questions button should be disabled
