@xpath-guide
Feature: XPath Practice Guide
  Verify the interactive XPath practice page: difficulty and status
  filters, challenge search, answer submission, and progress counters.
  This module doubles as a locator-strategy training ground.

  URL: https://www.qapractice.com/SeleniumXPathGuide
  Test case reference: test-case/09-xpath-guide.md (TC-XP-*)
  Run this module only:  npm test -- --grep @xpath-guide
  Run a single case:     npm test -- --grep @TC-XP-001
  Run by type:           npm test -- --grep "@xpath-guide and @negative"
                         (types in this file: @positive @negative @edge)

  Background:
    Given I am on the "XPath practice" page

  @TC-XP-001 @regression @positive
  Scenario: Challenge list loads with initial counters
    Then the challenge list should be visible
    And the progress counter should show 0 of 130 solved

  @TC-XP-002 @regression @positive
  Scenario: Filter Easy challenges
    When I filter challenges by difficulty "Easy"
    Then only "Easy" challenges should be listed
    And the "Easy" count badge should show 49

  @TC-XP-003 @regression @positive
  Scenario Outline: Filter Medium and Hard challenges
    When I filter challenges by difficulty "<difficulty>"
    Then the "<difficulty>" count badge should show <count>

    Examples:
      | difficulty | count |
      | Medium     | 53    |
      | Hard       | 28    |

  @TC-XP-004 @regression @edge
  Scenario: Difficulty counts sum to the total
    Then the difficulty counts should sum to 130

  @TC-XP-005 @regression @positive
  Scenario: Search challenges by keyword
    When I search challenges for "checkbox"
    Then only matching challenges should be listed

  @TC-XP-006 @regression @negative
  Scenario: Search challenges with no match
    When I search challenges for "zzzqqq"
    Then an empty challenge state should be shown

  @TC-XP-007 @regression @positive
  Scenario: Submit a correct XPath answer
    When I open challenge "Select by ID"
    And I submit the correct XPath for the challenge
    Then the challenge should be marked as solved
    And the solved counter should increase by 1

  @TC-XP-008 @regression @negative
  Scenario: Submit a wrong XPath answer
    When I open challenge "Select by ID"
    And I submit the XPath "//nonexistent"
    Then the challenge should remain unsolved

  @TC-XP-009 @regression @negative
  Scenario: Submit an empty XPath answer
    When I open challenge "Select by ID"
    And I submit an empty XPath answer
    Then the challenge should remain unsolved

  @TC-XP-010 @regression @edge
  Scenario: Solved filter shows progress
    When I open challenge "Select by ID"
    And I submit the correct XPath for the challenge
    And I filter challenges by status "Solved"
    Then only solved challenges should be listed

  @TC-XP-011 @regression @positive
  Scenario: Save a challenge as favorite
    When I save the first challenge
    And I filter challenges by status "Saved"
    Then the saved challenge should be listed
