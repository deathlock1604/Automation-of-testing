Feature: Logout User

  Scenario: Successful logout after login
    Given I open the browser
    And I navigate to "https://automationexercise.com/"
    And I see the homepage
    When I click on "Signup / Login" link
    Then I should see "Login to your account"
    When I enter correct email and password
    And I click on "login" button
    Then I should see "Logged in as"
    When I click on "Logout" button
    Then I should see "Login to your account" again
