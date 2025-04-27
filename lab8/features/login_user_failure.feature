Feature: Login User with Incorrect Credentials

  Scenario: Unsuccessful login with incorrect email and password
    Given I open the browser
    And I navigate to "https://automationexercise.com/"
    And I see the homepage
    When I click on "Signup / Login" link
    Then I should see "Login to your account"
    When I enter incorrect email and password
    And I click on "login" button
    Then I should see error message "Your email or password is incorrect!"
