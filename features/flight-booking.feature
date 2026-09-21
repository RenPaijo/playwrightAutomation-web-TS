@flight-booking
Feature: Flight Booking
  Verify the flight booking search: round trip and one-way flows,
  route and date validation, and passenger boundaries.

  URL: https://www.qapractice.com/flight-booking-scenarios
  Test case reference: test-case/06-flight-booking.md (TC-FB-*)
  Run this module only:  npm test -- --grep @flight-booking
  Run a single case:     npm test -- --grep @TC-FB-001
  Run by type:           npm test -- --grep "@flight-booking and @negative"
                         (types in this file: @positive @negative @edge)

  Background:
    Given I am on the "flight booking" page

  @TC-FB-001 @smoke @positive
  Scenario: Search a valid round-trip flight
    When I search a round-trip flight with valid data
    Then flight results matching the criteria should be shown

  @TC-FB-002 @smoke @positive
  Scenario: One-way disables the return date
    When I check the one-way option
    Then the return date field should be disabled or ignored

  @TC-FB-003 @regression @edge
  Scenario: Unchecking one-way re-enables the return date
    When I check the one-way option
    And I uncheck the one-way option
    Then the return date field should be editable

  @TC-FB-004 @smoke @negative
  Scenario: Same origin and destination
    When I search a flight with the same origin and destination
    Then I should see a route validation error

  @TC-FB-005 @smoke @negative
  Scenario: Return date before departure date
    When I search a round-trip flight with return before departure
    Then I should see a date validation error

  @TC-FB-006 @smoke @negative
  Scenario: Departure date in the past
    When I search a flight departing yesterday
    Then I should see a date validation error

  @TC-FB-007 @regression @edge
  Scenario: Departure date is today
    When I search a flight departing today
    Then I record the actual "same-day-departure" behavior

  @TC-FB-008 @smoke @negative
  Scenario: Missing origin and destination
    When I click the "Search Flights" button
    Then I should see required validations on the route fields

  @TC-FB-009 @regression @negative
  Scenario: Passengers set to zero
    When I search a valid flight with 0 passengers
    Then I should see a passenger validation error

  @TC-FB-010 @regression @negative
  Scenario: Negative passengers
    When I search a valid flight with -1 passengers
    Then I should see a passenger validation error

  @TC-FB-011 @regression @edge
  Scenario: Excessive passenger count
    When I search a valid flight with 9999 passengers
    Then the passenger count should be rejected or handled gracefully

  @TC-FB-012 @regression @positive
  Scenario Outline: Search per travel class
    When I search a valid flight with class "<travelClass>"
    Then flight results matching the criteria should be shown

    Examples:
      | travelClass |
      | Economy     |
      | Business    |

  @TC-FB-013 @regression @positive
  Scenario: Results match the search criteria
    When I search a round-trip flight with valid data
    Then the result route, dates, and class should match the search

  @TC-FB-014 @regression @negative
  Scenario: Search without dates
    When I select an origin and destination only
    And I click the "Search Flights" button
    Then I should see required validations on the date fields

  @TC-FB-015 @regression @edge
  Scenario: Swapped origin and destination
    When I search a valid flight with the route swapped
    Then flight results matching the criteria should be shown

  @TC-FB-016 @regression @positive
  Scenario: Back To Home Page link
    When I click the "Back To Home Page" link
    Then I should be on the home or practice selection page

  @TC-FB-017 @regression @edge
  Scenario: Rapid double click on Search Flights
    When I fill a valid flight search
    And I double click the "Search Flights" button rapidly
    Then a single search should be executed
