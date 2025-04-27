Feature: Register User with Existing Email

  Scenario: Attempt to register with an already registered email
    Given I open the browser
    And I navigate to "https://automationexercise.com/"
    And I see the homepage
    When I click on "Signup / Login" link
    Then I should see "New User Signup!"
    When I enter name and already registered email address
    And I click on "Signup" button
    Then I should see error message "Email Address already exist!"
