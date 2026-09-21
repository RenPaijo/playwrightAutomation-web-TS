@ui-elements
Feature: UI Elements
  Verify every basic, interactive, complex, and advanced UI element:
  inputs, selections, dynamic buttons, modal, download, notification,
  and accordion behavior.

  URL: https://www.qapractice.com/practice-different-ui-elements
  Test case reference: test-case/07-ui-elements.md (TC-UI-*)
  Run this module only:  npm test -- --grep @ui-elements
  Run a single case:     npm test -- --grep @TC-UI-001
  Run by type:           npm test -- --grep "@ui-elements and @dynamic"
                         (types in this file: @positive @negative @edge @security @dynamic)

  Background:
    Given I am on the "UI elements" page

  @TC-UI-001 @smoke @positive
  Scenario: Text field accepts and retains input
    When I type "Hello QA" into the text field
    Then the text field value should be "Hello QA"

  @TC-UI-002 @regression @positive
  Scenario: Textarea retains multiline input
    When I type 3 lines into the text area
    Then the text area should retain all lines

  @TC-UI-003 @smoke @positive
  Scenario: Single checkbox toggles both ways
    When I check the single checkbox
    Then the single checkbox should be checked
    When I uncheck the single checkbox
    Then the single checkbox should be unchecked

  @TC-UI-004 @regression @positive
  Scenario: Checkbox group selects independently
    When I check options 1 and 3 in the checkbox group
    Then options 1 and 3 should be checked
    And option 2 should be unchecked

  @TC-UI-005 @smoke @positive
  Scenario: Radio group selection is exclusive
    When I select radio option 1
    And I select radio option 2
    Then only radio option 2 should be selected

  @TC-UI-006 @smoke @positive
  Scenario: Single dropdown selection
    When I select each option of the single dropdown
    Then the selected value should update each time

  @TC-UI-007 @regression @positive
  Scenario: Multi dropdown multiple selection
    When I select 2 options in the multi dropdown
    Then both options should remain selected

  @TC-UI-008 @regression @edge
  Scenario: Slider set to minimum and maximum
    When I set the slider to the minimum
    Then the slider value should be the minimum
    When I set the slider to the maximum
    Then the slider value should be the maximum

  @TC-UI-009 @regression @positive
  Scenario: Datepicker accepts a valid date
    When I enter a future date into the datepicker
    Then the datepicker should display the date

  @TC-UI-010 @regression @negative
  Scenario: Datepicker rejects invalid input
    When I enter "32/13/2026" into the datepicker
    Then the datepicker should show a validation error or reject the input

  @TC-UI-011 @regression @positive
  Scenario: File upload registers the file
    When I upload a sample file
    Then the uploaded file name should be registered

  @TC-UI-012 @smoke @positive
  Scenario: Click Me button shows feedback
    When I click the "Click Me" button
    Then a visible feedback state should appear

  @TC-UI-013 @smoke @dynamic
  Scenario: Increment Progress reaches 100 percent
    When I click the "Increment Progress" button repeatedly
    Then the progress bar should reach 100 percent

  @TC-UI-014 @regression @edge
  Scenario: Progress is capped at 100 percent
    When the progress bar has reached 100 percent
    And I click the "Increment Progress" button
    Then the progress bar should stay at 100 percent

  @TC-UI-015 @smoke @positive
  Scenario: Modal opens and closes
    When I click the "Show Modal" button
    Then the modal should be visible
    When I close the modal
    Then the modal should not be visible

  @TC-UI-016 @regression @edge
  Scenario: Background is not interactive while modal is open
    When I click the "Show Modal" button
    Then background elements should not be clickable

  @TC-UI-017 @regression @dynamic
  Scenario: Simulate Download shows simulated download feedback
    When I click the "Simulate Download" button
    Then the simulated download feedback should be shown

  @TC-UI-018 @regression @dynamic
  Scenario: Update Content changes the target text
    When I click the "Update Content" button
    Then the target content text should change

  @TC-UI-019 @regression @dynamic
  Scenario: Show Notification displays a message
    When I click the "Show Notification" button
    Then a notification should be visible

  @TC-UI-020 @regression @edge
  Scenario: Notification auto-dismisses
    When I click the "Show Notification" button
    Then the notification should disappear automatically

  @TC-UI-021 @regression @positive
  Scenario: Accordion expands and collapses
    When I expand accordion item 1
    Then accordion item 1 content should be visible
    When I collapse accordion item 1
    Then accordion item 1 content should be hidden

  @TC-UI-022 @regression @edge
  Scenario: Accordion behavior with multiple items
    When I expand accordion item 1
    And I expand accordion item 2
    Then I record the actual "accordion exclusivity" behavior

  @TC-UI-023 @regression @edge
  Scenario: Text field handles long input
    When I type a 1000-character string into the text field
    Then the page should not crash

  @TC-UI-024 @regression @security
  Scenario: XSS payload in text inputs
    When I type "<script>alert(1)</script>" into the text field
    Then the payload should not be executed
