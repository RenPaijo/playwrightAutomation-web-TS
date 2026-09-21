@ecommerce
Feature: E-commerce
  Verify the dummy e-commerce page: product search, category filters,
  sorting, add-to-cart quantities, and pagination behavior.

  URL: https://www.qapractice.com/practice-ecommerece-website
  Test case reference: test-case/05-ecommerce.md (TC-EC-*)
  Run this module only:  npm test -- --grep @ecommerce
  Run a single case:     npm test -- --grep @TC-EC-001
  Run by type:           npm test -- --grep "@ecommerce and @edge"
                         (types in this file: @positive @negative @edge @security)

  Background:
    Given I am on the "e-commerce" page

  @TC-EC-001 @smoke @positive
  Scenario: Search for an existing product keyword
    When I search products for a visible product name
    Then only matching products should be shown

  @TC-EC-002 @smoke @negative
  Scenario: Search with no results
    When I search products for "zzzqqq123"
    Then an empty search state should be shown

  @TC-EC-003 @regression @edge
  Scenario: Search is case-insensitive
    When I search products for a keyword in upper and lower case
    Then both searches should return the same result set

  @TC-EC-004 @regression @edge
  Scenario: Partial keyword search
    When I search products for a partial product name
    Then products containing the fragment should be shown

  @TC-EC-005 @regression @security
  Scenario: Search with injection payloads
    When I search products for "<script>alert(1)</script>"
    Then the payload should not be executed
    And the page should not crash

  @TC-EC-006 @regression @edge
  Scenario: Clearing the search restores the full list
    When I search products for a visible product name
    And I clear the product search
    Then the full product list should be restored

  @TC-EC-007 @smoke @positive
  Scenario Outline: Filter products by category
    When I filter products by category "<category>"
    Then every visible product should belong to "<category>"

    Examples:
      | category    |
      | Electronics |
      | Fashion     |
      | Beauty      |
      | Beverages   |

  @TC-EC-008 @regression @positive
  Scenario: "All" filter restores the full list
    When I filter products by category "Electronics"
    And I filter products by category "All"
    Then the full product list should be restored

  @TC-EC-009 @regression @edge
  Scenario: Combined search and category filter
    When I filter products by category "Electronics"
    And I search products for a keyword within the filtered list
    Then only products matching both filters should be shown

  @TC-EC-010 @regression @positive
  Scenario: Sort products by price ascending
    When I sort products by price "ascending"
    Then product prices should be in non-decreasing order

  @TC-EC-011 @regression @positive
  Scenario: Sort products by price descending
    When I sort products by price "descending"
    Then product prices should be in non-increasing order

  @TC-EC-012 @smoke @positive
  Scenario: Add a single product to the cart
    When I add the first product to the cart with quantity 1
    Then the cart count should increase by 1

  @TC-EC-013 @regression @positive
  Scenario: Add a product with quantity greater than one
    When I add the first product to the cart with quantity 3
    Then the cart count should increase by 3

  @TC-EC-014 @regression @edge
  Scenario: Add to cart with quantity zero
    When I add the first product to the cart with quantity 0
    Then the product should not be added to the cart

  @TC-EC-015 @regression @negative
  Scenario: Add to cart with negative quantity
    When I add the first product to the cart with quantity -1
    Then the product should not be added to the cart

  @TC-EC-016 @regression @edge
  Scenario: Add the same product twice
    When I add the first product to the cart with quantity 1
    And I add the first product to the cart with quantity 1
    Then the cart count should increase by 2

  @TC-EC-017 @regression @positive
  Scenario: Add multiple different products
    When I add 3 different products to the cart
    Then the cart count should increase by 3

  @TC-EC-018 @regression @positive
  Scenario: Pagination navigation
    When I go to product page 2
    Then different products should be shown
    When I go back to product page 1
    Then the first page products should be shown

  @TC-EC-019 @regression @edge
  Scenario: Pagination boundaries
    Then the "Previous" pagination button should be disabled
    When I go to the last product page
    Then the "Next" pagination button should be disabled

  @TC-EC-020 @regression @edge
  Scenario: Category filter persists across pages
    When I filter products by category "Electronics"
    And I go to product page 2
    Then every visible product should belong to "Electronics"

  @TC-EC-021 @regression @edge
  Scenario: Add to cart from page 2
    When I go to product page 2
    And I add the first product to the cart with quantity 1
    Then the cart count should increase by 1
