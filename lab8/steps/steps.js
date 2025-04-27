const { Given, When, Then } = require("@cucumber/cucumber")
const { Builder, By, until } = require("selenium-webdriver")
const assert = require("assert")

let driver
const randomNum = Math.floor(Math.random() * 100000)
const userData = {
  name: "TestUser",
  email: `testuser${randomNum}@mail.com`,
  password: "Test1234",
  firstName: "John",
  lastName: "Doe",
  company: "TestCorp",
  address1: "123 Test Street",
  address2: "Apt 4B",
  country: "Canada",
  state: "Ontario",
  city: "Toronto",
  zipcode: "M5H 2N2",
  mobileNumber: "1234567890",
}

Given("I open the browser", async () => {
  driver = await new Builder().forBrowser("chrome").build()
})

Given("I navigate to {string}", async (url) => {
  await driver.get(url)
})

Given("I see the homepage", async () => {
  const logo = await driver.wait(until.elementLocated(By.css('img[alt="Website for automation practice"]')), 10000)
  const displayed = await logo.isDisplayed()
  assert.strictEqual(displayed, true)
})

When("I click on {string} link", async (linkText) => {
  const link = await driver.findElement(By.linkText(linkText))
  await link.click()
})

When("I enter a unique name and email address", async () => {
  await driver.findElement(By.name("name")).sendKeys(userData.name)
  await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)
})

When("I click on the Signup button", async () => {
  const signupBtn = await driver.findElement(By.css('button[data-qa="signup-button"]'))
  await signupBtn.click()
})

Then("I should see {string}", async (expectedText) => {
  const element = await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),'${expectedText}')]`)), 10000)
  const text = await element.getText()
  assert.ok(text.includes(expectedText))
})

When("I fill out the account information", async () => {
  await driver.findElement(By.id("id_gender1")).click()
  await driver.findElement(By.id("password")).sendKeys(userData.password)
  await driver.findElement(By.id("days")).sendKeys("10")
  await driver.findElement(By.id("months")).sendKeys("May")
  await driver.findElement(By.id("years")).sendKeys("1995")

  await driver.findElement(By.id("newsletter")).click()
  await driver.findElement(By.id("optin")).click()

  await driver.findElement(By.id("first_name")).sendKeys(userData.firstName)
  await driver.findElement(By.id("last_name")).sendKeys(userData.lastName)
  await driver.findElement(By.id("company")).sendKeys(userData.company)
  await driver.findElement(By.id("address1")).sendKeys(userData.address1)
  await driver.findElement(By.id("address2")).sendKeys(userData.address2)
  await driver.findElement(By.id("country")).sendKeys(userData.country)
  await driver.findElement(By.id("state")).sendKeys(userData.state)
  await driver.findElement(By.id("city")).sendKeys(userData.city)
  await driver.findElement(By.id("zipcode")).sendKeys(userData.zipcode)
  await driver.findElement(By.id("mobile_number")).sendKeys(userData.mobileNumber)
})

When("I click on {string} button", async (buttonName) => {
  let button
  if (buttonName.toLowerCase() === "create account") {
    button = await driver.findElement(By.css('button[data-qa="create-account"]'))
  } else if (buttonName.toLowerCase() === "continue") {
    button = await driver.findElement(By.css('a[data-qa="continue-button"]'))
  } else if (buttonName.toLowerCase() === "delete account") {
    button = await driver.findElement(By.linkText("Delete Account"))
  }
  await button.click()
})

Then("I should be logged in as the new user", async () => {
  const loggedInText = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Logged in as')]")), 10000)
  const text = await loggedInText.getText()
  assert.ok(text.includes("Logged in as"))
})

When('I click on "login" button', async () => {
  await driver.findElement(By.css('button[data-qa="login-button"]')).click()
})

Then('I should see "Logged in as" with username', async () => {
  const loggedInElement = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Logged in as')]")), 10000)
  const text = await loggedInElement.getText()
  assert.ok(text.includes(`Logged in as ${userData.name}`))
})
When("I enter incorrect email and password", async () => {
  await driver.findElement(By.css('input[data-qa="login-email"]')).sendKeys("wrongemail@mail.com")
  await driver.findElement(By.css('input[data-qa="login-password"]')).sendKeys("WrongPassword123")
})

Then('I should see error message "Your email or password is incorrect!"', async () => {
  const errorElement = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(),'Your email or password is incorrect!')]")), 10000)
  const errorText = await errorElement.getText()
  assert.strictEqual(errorText.trim(), "Your email or password is incorrect!")
})
When("I enter correct email and password", async () => {
  await driver.findElement(By.css('input[data-qa="login-email"]')).sendKeys(userData.email)
  await driver.findElement(By.css('input[data-qa="login-password"]')).sendKeys(userData.password)
})

When('I click on "Logout" button', async () => {
  const logoutButton = await driver.findElement(By.linkText("Logout"))
  await logoutButton.click()
})

Then('I should see "Login to your account" again', async () => {
  const loginHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")), 10000)
  const text = await loginHeader.getText()
  assert.strictEqual(text.trim(), "Login to your account")
})
When("I enter name and already registered email address", async () => {
  await driver.findElement(By.name("name")).sendKeys(userData.name)
  await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)
})

When('I click on "Signup" button', async () => {
  await driver.findElement(By.css('button[data-qa="signup-button"]')).click()
})

Then('I should see error message "Email Address already exist!"', async () => {
  const errorMsg = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(),'Email Address already exist!')]")), 10000)
  const text = await errorMsg.getText()
  assert.strictEqual(text.trim(), "Email Address already exist!")
})
