@auth @login
Feature: Login Form
  Verify the practice login form end to end: happy path, error handling,
  input validation, and basic security behavior.

  URL: https://www.qapractice.com/practice-login-form
  Test case reference: test-case/01-login-form.md (TC-LF-*)
  Demo credentials: user@premiumbank.com / Bank@123
  Run this module only:  npm test -- --grep @login
  Run a single case:     npm test -- --grep @TC-LF-001
  Run by type:           npm test -- --grep "@login and @negative"
                         (types in this file: @positive @negative @edge @security @usability)

  Background:
    Given I am on the "login" page

  @TC-LF-001 @smoke @positive
  Scenario: Login with valid credentials
    When I sign in with email "user@premiumbank.com" and password "Bank@123"
    Then I should see the login success state

  @TC-LF-002 @smoke @negative
  Scenario: Login with wrong password
    When I sign in with email "user@premiumbank.com" and password "WrongPass1"
    Then I should see a login error message
    And I should remain on the login page

  @TC-LF-003 @smoke @negative
  Scenario: Login with unregistered email
    When I sign in with email "nobody@example.com" and password "Bank@123"
    Then I should see a login error message

  @TC-LF-004 @smoke @negative
  Scenario: Submit login form with both fields empty
    When I click the "Sign in" button
    Then I should see a required validation for the email field
    And I should see a required validation for the password field

  @TC-LF-005 @smoke @negative
  Scenario: Submit login form with empty email
    When I fill the login password with "Bank@123"
    And I click the "Sign in" button
    Then I should see a required validation for the email field

  @TC-LF-006 @smoke @negative
  Scenario: Submit login form with empty password
    When I fill the login email with "user@premiumbank.com"
    And I click the "Sign in" button
    Then I should see a required validation for the password field

  @TC-LF-007 @regression @negative
  Scenario Outline: Login with invalid email format
    When I sign in with email "<email>" and password "Bank@123"
    Then I should see an email format validation on the login form

    Examples:
      | email               |
      | user@               |
      | userpremiumbank.com |
      | user@com            |

  @TC-LF-008 @regression @edge
  Scenario: Password is case sensitive
    When I sign in with email "user@premiumbank.com" and password "bank@123"
    Then I should see a login error message

  @TC-LF-009 @regression @edge
  Scenario: Email with leading and trailing spaces
    When I sign in with email " user@premiumbank.com " and password "Bank@123"
    Then the login should be trimmed and accepted or show a validation error

  @TC-LF-010 @regression @security
  Scenario: SQL injection attempt in login fields
    When I sign in with email "' OR '1'='1" and password "' OR '1'='1"
    Then I should see an email format validation on the login form
    And the page should not crash

  @TC-LF-011 @regression @security
  Scenario: XSS attempt in email field
    When I sign in with email "<script>alert(1)</script>" and password "Bank@123"
    Then the payload should not be executed

  @TC-LF-012 @regression @security
  Scenario: Password field is masked
    Then the login password field should be of type "password"

  @TC-LF-013 @regression @positive
  Scenario: Login with Remember me checked
    When I fill the login email with "user@premiumbank.com"
    And I fill the login password with "Bank@123"
    And I check the "Remember me" checkbox
    And I click the "Sign in" button
    Then I should see the login success state

  @TC-LF-014 @regression @edge
  Scenario: Remember me is unchecked by default
    Then the "Remember me" checkbox should be unchecked

  @TC-LF-015 @regression @positive
  Scenario: Forgot password link navigates to recovery page
    When I click the "Forgot password?" link
    Then I should be on the "forgot password" page

  @TC-LF-016 @regression @usability
  Scenario: Submit login form with Enter key
    When I fill the login email with "user@premiumbank.com"
    And I fill the login password with "Bank@123"
    And I press "Enter" in the "login password" field
    Then I should see the login success state

  @TC-LF-017 @regression @edge
  Scenario: Login with very long input values
    When I sign in with a 255-character email and password
    Then the page should not crash
    And I should see a login error message

  @TC-LF-018 @regression @edge
  Scenario: Multiple consecutive failed logins
    When I attempt to sign in with a wrong password 5 times
    Then I should see a login error message on every attempt
    And the page should not crash

  @TC-LF-019 @regression @positive
  Scenario: Back link returns to practice selection
    When I click the "Back To Practice UI Automation Examples" link
    Then I should be on the "home" page
