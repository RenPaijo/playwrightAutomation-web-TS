@auth @forgot-password
Feature: Forgot Password
  Verify the password recovery flow: registered/unregistered emails,
  validation, and navigation back to login and the practice selection.

  URL: https://www.qapractice.com/forget-password
  Test case reference: test-case/03-forgot-password.md (TC-FP-*)
  Registered email on this demo site: user@premiumbank.com
  Run this module only:  npm test -- --grep @forgot-password
  Run a single case:     npm test -- --grep @TC-FP-001
  Run by type:           npm test -- --grep "@forgot-password and @negative"
                         (types in this file: @positive @negative @edge @security @usability)

  Background:
    Given I am on the "forgot password" page

  @TC-FP-001 @smoke @positive
  Scenario: Submit a registered email
    When I submit the forgot password form with email "user@premiumbank.com"
    Then I should see the recovery confirmation state

  @TC-FP-002 @smoke @negative
  Scenario: Submit an unregistered email
    When I submit the forgot password form with email "ghost@nowhere.com"
    Then I should see an error or a neutral confirmation message

  @TC-FP-003 @smoke @negative
  Scenario: Submit forgot password with empty email
    When I click the "Continue" button
    Then I should see a required validation for the forgot email field

  @TC-FP-004 @regression @negative
  Scenario Outline: Forgot password with invalid email format
    When I submit the forgot password form with email "<email>"
    Then I should see an email format validation on the forgot password form

    Examples:
      | email |
      | abc@  |
      | abc   |

  @TC-FP-005 @regression @edge
  Scenario: Email with leading and trailing spaces
    When I submit the forgot password form with email " user@premiumbank.com "
    Then the recovery should be trimmed and accepted or show a validation error

  @TC-FP-006 @regression @edge
  Scenario: Very long email string
    When I submit the forgot password form with a 255-character email
    Then the page should not crash
    And I should see a validation error on the forgot password form

  @TC-FP-007 @regression @security
  Scenario: XSS payload in forgot password email
    When I submit the forgot password form with email "<img src=x onerror=alert(1)>"
    Then the payload should not be executed

  @TC-FP-008 @regression @edge
  Scenario: Submit forgot password twice rapidly
    When I submit the forgot password form with email "user@premiumbank.com" twice rapidly
    Then the recovery should be handled as a single submission

  @TC-FP-009 @regression @positive
  Scenario: Back to Login link
    When I click the "Back to Login" link
    Then I should be on the "login" page

  @TC-FP-010 @regression @positive
  Scenario: Back to all practice sites link
    When I click the "Back to all practice sites" link
    Then I should be on the "practice selection" page

  @TC-FP-011 @regression @usability
  Scenario: Submit forgot password with Enter key
    When I fill the forgot password email with "user@premiumbank.com"
    And I press "Enter" in the "forgot password email" field
    Then I should see the recovery confirmation state
