@auth @register
Feature: Registration
  Verify account registration: happy path, password rules, duplicate
  handling, and validation of all fields.

  URL: https://www.qapractice.com/register
  Test case reference: test-case/02-register.md (TC-RG-*)
  Run this module only:  npm test -- --grep @register
  Run a single case:     npm test -- --grep @TC-RG-001
  Run by type:           npm test -- --grep "@register and @negative"
                         (types in this file: @positive @negative @edge @security @usability)

  Background:
    Given I am on the "registration" page

  @TC-RG-001 @smoke @positive
  Scenario: Register with valid data
    When I register with a unique email and password "Test@1234"
    Then I should see the registration success state

  @TC-RG-002 @smoke @negative
  Scenario: Password and confirm password mismatch
    When I fill the registration form with a unique email
    And I fill the registration password with "Test@1234"
    And I fill the registration confirm password with "Test@9999"
    And I click the "Register" button
    Then I should see a password mismatch error

  @TC-RG-003 @smoke @negative
  # KNOWN ISSUE (verified 2026-09-21): site accepts an already-registered email and
  # shows "Registration Successful" — no duplicate check on the client-side demo.
  Scenario: Register with an already-registered email
    When I register with email "user@premiumbank.com" and password "Bank@123"
    Then I should see an already-registered email error

  @TC-RG-004 @smoke @negative
  Scenario: Submit registration with all fields empty
    When I click the "Register" button
    Then I should see a required validation on all registration fields

  @TC-RG-005 @regression @negative
  Scenario Outline: Register with invalid email format
    When I register with email "<email>" and password "Test@1234"
    Then I should see an email format validation on the registration form

    Examples:
      | email   |
      | abc@    |
      | abc.com |
      | @x.com  |

  @TC-RG-006 @regression @negative
  Scenario: Weak password - too short
    When I register with a unique email and password "Ab@1"
    Then I should see a password policy error

  @TC-RG-007 @regression @negative
  Scenario Outline: Weak password - missing complexity
    When I register with a unique email and password "<password>"
    Then I should see a password policy error

    Examples:
      | password      |
      | password      |
      | alllowercase1 |

  @TC-RG-008 @regression @security
  Scenario: Registration password fields are masked
    Then the registration password field should be of type "password"
    And the registration confirm password field should be of type "password"

  @TC-RG-009 @regression @edge
  Scenario: Registration email with leading and trailing spaces
    When I register with a unique email wrapped in spaces and password "Test@1234"
    Then the registration should be trimmed and accepted or show a validation error

  @TC-RG-010 @regression @edge
  # KNOWN ISSUE: same root cause as TC-RG-003 (no duplicate validation at all).
  Scenario: Case variants of an existing email
    When I register with email "User@PremiumBank.com" and password "Bank@123"
    Then I should see an already-registered email error or a validation error

  @TC-RG-011 @regression @edge
  Scenario: Register with a very long password
    When I register with a unique email and a 128-character password
    Then the registration should be accepted or show a graceful length error

  @TC-RG-012 @regression @security
  Scenario: XSS payload in registration email field
    When I fill the registration email with "<script>alert(1)</script>"
    And I fill the registration password with "Test@1234"
    And I fill the registration confirm password with "Test@1234"
    And I click the "Register" button
    Then the payload should not be executed

  @TC-RG-013 @regression @positive
  Scenario: Back To Login Page link
    When I click the "Back To Login Page" link
    Then I should be on the "login" page

  @TC-RG-014 @regression @usability
  Scenario: Submit registration with Enter key
    When I fill the registration form with a unique email
    And I fill the registration password with "Test@1234"
    And I fill the registration confirm password with "Test@1234"
    And I press "Enter" in the "registration confirm password" field
    Then I should see the registration success state

  @TC-RG-015 @regression @edge
  Scenario: Rapid double click on Register
    When I fill the registration form with a unique email
    And I fill the registration password with "Test@1234"
    And I fill the registration confirm password with "Test@1234"
    And I double click the "Register" button rapidly
    Then the registration should be handled as a single submission
