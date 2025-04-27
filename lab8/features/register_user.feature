Feature: Register New User

  Scenario: Successful registration of a new user
    Given I open the browser
    And I navigate to "https://automationexercise.com/"
    And I see the homepage
    When I click on "Signup / Login" link
    And I enter a unique name and email address
    And I click on the Signup button
    Then I should see "ENTER ACCOUNT INFORMATION"
    When I fill out the account information
    And I click on "Create Account" button
    Then I should see "ACCOUNT CREATED!"
    When I click on "Continue" button
    Then I should be logged in as the new user
    When I click on "Delete Account" button
    Then I should see "ACCOUNT DELETED!"
