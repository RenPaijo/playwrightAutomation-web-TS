@api-playground
Feature: REST API Playground
  Verify the practice REST API end to end: authentication token flow,
  public vs protected endpoints, and error responses.
  API-level scenarios use Playwright's request fixture (no browser page);
  the last scenarios verify the playground UI itself.

  URL: https://www.qapractice.com/api-playground
  Test case reference: test-case/08-api-playground.md (TC-API-*)
  Demo credentials for the API (verified 2026-09-21): testuser / Password123
  (NOTE: the login-form account user@premiumbank.com / Bank@123 is rejected by the API with 401.)
  Run this module only:  npm test -- --grep @api-playground
  Run a single case:     npm test -- --grep @TC-API-001
  Run by type:           npm test -- --grep "@api-playground and @negative"
                         (types in this file: @positive @negative @edge)

  @TC-API-001 @smoke @positive
  Scenario: Login API returns a token
    When I POST to "/api/auth/login" with valid credentials
    Then the response status should be 200
    And the response should contain a token

  @TC-API-002 @smoke @negative
  Scenario: Login API with wrong password
    When I POST to "/api/auth/login" with a wrong password
    Then the response status should be 401
    And the response should not contain a token

  @TC-API-003 @regression @negative
  Scenario: Login API with missing fields
    When I POST to "/api/auth/login" with an empty body
    Then the response status should be 400

  @TC-API-004 @smoke @positive
  Scenario: Get products without a token
    When I GET "/api/products" without authentication
    Then the response status should be 200
    And the response should contain a product list

  @TC-API-005 @smoke @negative
  Scenario: Create product without a token is rejected
    When I POST to "/api/products" without authentication
    Then the response status should be 401 or 403

  @TC-API-006 @smoke @positive
  # KNOWN ISSUE (verified 2026-09-21): protected endpoints return 401 via real HTTP
  # even with a freshly issued token — token auth only works in the in-browser playground.
  Scenario: Create product with a valid token
    Given I have a valid API token
    When I POST to "/api/products" with the token and a valid product body
    Then the response status should be 200 or 201
    And the response should contain the created product

  @TC-API-007 @smoke @positive
  # KNOWN ISSUE: same root cause as TC-API-006 (token rejected via real HTTP).
  Scenario: Get user with a valid token
    Given I have a valid API token
    When I GET "/api/users/1" with the token
    Then the response status should be 200
    And the response should contain a user object

  @TC-API-008 @smoke @negative
  Scenario: Get user without a token is rejected
    When I GET "/api/users/1" without authentication
    Then the response status should be 401 or 403

  @TC-API-009 @regression @negative
  Scenario: Protected endpoint with a malformed token
    When I GET "/api/users/1" with token "Bearer abc123"
    Then the response status should be 401 or 403

  @TC-API-010 @smoke @positive
  # KNOWN ISSUE: same root cause as TC-API-006 (token rejected via real HTTP).
  Scenario: Create order with a valid token
    Given I have a valid API token
    When I POST to "/api/orders" with the token and a valid order body
    Then the response status should be 200 or 201

  @TC-API-011 @regression @negative
  # KNOWN ISSUE: same root cause as TC-API-006 — the token is rejected via real
  # HTTP (401) before body validation runs, so the expected 400 never occurs.
  Scenario: Create order with missing fields
    Given I have a valid API token
    When I POST to "/api/orders" with the token and an incomplete body
    Then the response status should be 400

  @TC-API-012 @regression @negative
  Scenario: Wrong HTTP method on login endpoint
    When I GET "/api/auth/login" without authentication
    Then the response status should be 404 or 405

  @TC-API-013 @regression @edge
  Scenario: Malformed JSON body
    When I POST to "/api/auth/login" with a malformed JSON body
    Then the response status should be 400

  @TC-API-014 @regression @positive
  Scenario: "Log in & use token" fills the token field in the UI
    Given I am on the "API playground" page
    When I click the "Log in & use token" button
    Then the token input should be populated

  @TC-API-015 @regression @positive
  Scenario: Send a public request from the playground UI
    Given I am on the "API playground" page
    When I select the "GET /api/products" endpoint in the playground
    And I click the "Send" button
    Then the response panel should show status 200

  @TC-API-016 @regression @negative
  Scenario: Send a protected request without token from the UI
    Given I am on the "API playground" page
    When I select the "POST /api/products" endpoint in the playground
    And I clear the playground token input
    And I click the "Send" button
    Then the response panel should show status 401 or 403
