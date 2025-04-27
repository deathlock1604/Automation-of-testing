Feature: Login User with Correct Credentials

  Scenario: Successful login with correct email and password
    Given I open the browser
    And I navigate to "https://automationexercise.com/"
    And I see the homepage
    When I click on "Signup / Login" link
    Then I should see "Login to your account"
    When I enter correct email and password
    And I click on "login" button
    Then I should see "Logged in as" with username
    When I click on "Delete Account" button
    Then I should see "ACCOUNT DELETED!"
