@web-form
Feature: Web Form
  Verify the practice web form: full submission, per-field validation,
  the two different date formats (DOB: YYYY-MM-DD, DOJ: dd/mm/yyyy),
  radio exclusivity, and the Clear action.

  URL: https://www.qapractice.com/practice-forms
  Test case reference: test-case/04-web-form.md (TC-WF-*)
  Run this module only:  npm test -- --grep @web-form
  Run a single case:     npm test -- --grep @TC-WF-001
  Run by type:           npm test -- --grep "@web-form and @negative"
                         (types in this file: @positive @negative @edge @security)

  Background:
    Given I am on the "web form" page

  @TC-WF-001 @smoke @positive
  Scenario: Submit a fully valid form
    When I fill the web form with valid generated data
    And I select the "email" communication preference
    And I click the "Submit" button
    Then I should see the web form success state

  @TC-WF-002 @smoke @negative
  Scenario: Submit an empty form
    When I click the "Submit" button
    Then I should see required validations on the mandatory web form fields

  @TC-WF-003 @regression @positive
  Scenario: Clear button resets all fields
    When I fill the web form with valid generated data
    And I click the "Clear" button
    Then all web form fields should be back to their default state

  @TC-WF-004 @smoke @negative
  Scenario: Date of birth in wrong format
    When I fill the web form with valid generated data
    And I fill the date of birth with "15/06/1995"
    And I click the "Submit" button
    Then I should see a format validation on the date of birth field

  @TC-WF-005 @smoke @negative
  Scenario: Date of joining in wrong format
    When I fill the web form with valid generated data
    And I fill the date of joining with "2020-06-15"
    And I click the "Submit" button
    Then I should see a format validation on the date of joining field

  @TC-WF-006 @regression @edge
  Scenario: Impossible date values
    When I fill the web form with valid generated data
    And I fill the date of birth with "2023-02-30"
    And I fill the date of joining with "31/02/2020"
    And I click the "Submit" button
    Then I should see a validation error on the date fields

  @TC-WF-007 @regression @edge
  Scenario: Date of birth in the future
    When I fill the web form with valid generated data
    And I fill the date of birth with tomorrow's date
    And I click the "Submit" button
    Then I record the actual "future-date" behavior

  @TC-WF-008 @regression @edge
  Scenario: Date of joining earlier than date of birth
    When I fill the web form with valid generated data
    And I fill the date of birth with "2000-01-01"
    And I fill the date of joining with "01/01/1990"
    And I click the "Submit" button
    Then I record the actual "date-logic" behavior

  @TC-WF-009 @regression @negative
  Scenario: Invalid email format in web form
    When I fill the web form with valid generated data
    And I fill the web form email with "name@"
    And I click the "Submit" button
    Then I should see an email format validation on the web form

  @TC-WF-010 @regression @negative
  Scenario: Phone number containing letters
    When I fill the web form with valid generated data
    And I fill the phone number with "abc123xyz"
    And I click the "Submit" button
    Then I should see a phone validation error

  @TC-WF-011 @regression @edge
  Scenario Outline: Phone number length boundaries
    When I fill the web form with valid generated data
    And I fill the phone number with "<phone>"
    And I click the "Submit" button
    Then I should see a phone validation error

    Examples:
      | phone            |
      | 12               |
      | 1234567890123456 |

  @TC-WF-012 @regression @negative
  Scenario: Phone code not selected
    When I fill the web form with valid generated data
    And I leave the phone code unselected
    And I click the "Submit" button
    Then I should see a phone code validation error

  @TC-WF-013 @regression @edge
  Scenario: Communication preference radios are exclusive
    When I select the "email" communication preference
    And I select the "phone" communication preference
    Then only the "phone" communication preference should be selected

  @TC-WF-014 @regression @negative
  Scenario: No communication preference selected
    When I fill the web form with valid generated data
    And I click the "Submit" button
    Then I record the actual "missing-preference" behavior

  @TC-WF-015 @regression @edge
  Scenario: Names with special characters
    When I fill the web form with valid generated data
    And I fill the first name with "O'Brien-Smith"
    And I click the "Submit" button
    Then the name should be accepted or show a clear validation error

  @TC-WF-016 @regression @negative
  Scenario: Names containing numbers and symbols
    When I fill the web form with valid generated data
    And I fill the first name with "John123!"
    And I click the "Submit" button
    Then I should see a name validation error

  @TC-WF-017 @regression @edge
  Scenario: Very long name inputs
    When I fill the web form with valid generated data
    And I fill the first and last name with 100-character strings
    And I click the "Submit" button
    Then the page should not crash

  @TC-WF-018 @regression @security
  Scenario: XSS payload in web form text fields
    When I fill the web form with valid generated data
    And I fill the first name with "<script>alert(1)</script>"
    And I click the "Submit" button
    Then the payload should not be executed

  @TC-WF-019 @regression @edge
  Scenario: Dropdowns show default state on load
    Then the country and title dropdowns should show their default placeholder

  @TC-WF-020 @regression @edge
  Scenario: Rapid double Submit
    When I fill the web form with valid generated data
    And I double click the "Submit" button rapidly
    Then the web form should be handled as a single submission
