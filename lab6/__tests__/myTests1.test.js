const { Builder, By, until, Actions } = require("selenium-webdriver")

const path = require("path")

jest.setTimeout(30000)
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

describe("Automation Exercise - Головна сторінка", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://automationexercise.com/")
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("логотип сайту присутній (alt-текст перевірка)", async () => {
    const logo = await driver.wait(until.elementLocated(By.css('img[alt="Website for automation practice"]')), 10000)
    const altText = await logo.getAttribute("alt")
    expect(altText).toBe("Website for automation practice")
  })

  test("верхнє меню навігації присутнє (перевірка ul.nav)", async () => {
    const navMenu = await driver.findElement(By.css("ul.nav.navbar-nav"))
    expect(navMenu).toBeDefined()
  })

  test("кнопка 'Signup / Login' присутня (за текстом посилання)", async () => {
    const loginBtn = await driver.findElement(By.linkText("Signup / Login"))
    const btnText = await loginBtn.getText()
    expect(btnText).toContain("Signup")
  })
})

describe("Test Case 1: Register User", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  }, 30000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Launch browser and navigate to homepage", async () => {
    await driver.get("http://automationexercise.com")
    await driver.wait(until.titleContains("Automation Exercise"), 10000)
    const title = await driver.getTitle()
    expect(title).toBe("Automation Exercise")
  })

  test("Click on 'Signup / Login'", async () => {
    await driver.findElement(By.linkText("Signup / Login")).click()
    const signupHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'New User Signup!')]")), 10000)
    expect(await signupHeader.getText()).toBe("New User Signup!")
  })

  test("Enter user details and click Signup", async () => {
    await driver.findElement(By.name("name")).sendKeys(userData.name)
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)
    await driver.findElement(By.css('button[data-qa="signup-button"]')).click()

    const enterInfoHeader = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")), 10000)
    expect(await enterInfoHeader.getText()).toContain("ENTER ACCOUNT INFORMATION")
  })

  test("Fill account details", async () => {
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

  test("Create account and verify account created", async () => {
    await driver.findElement(By.css('button[data-qa="create-account"]')).click()

    const accountCreated = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000)
    expect(await accountCreated.getText()).toContain("ACCOUNT CREATED!")
  })

  test("Verify user logged in", async () => {
    jest.setTimeout(15000)

    await driver.findElement(By.css('a[data-qa="continue-button"]')).click()

    const loggedInElement = await driver.wait(until.elementLocated(By.xpath("//a[contains(., 'Logged in as')]")), 15000)

    const text = await loggedInElement.getText()
    expect(text).toMatch(/Logged in as/i)
  })

  test("Delete account", async () => {
    await driver.findElement(By.linkText("Delete Account")).click()

    const deletedMsg = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")), 10000)
    expect(await deletedMsg.getText()).toContain("ACCOUNT DELETED!")
  })
})

describe("Test Case 2: Login User with correct email and password", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://automationexercise.com/")

    // Реєстрація нового унікального користувача
    await driver.findElement(By.linkText("Signup / Login")).click()
    await driver.findElement(By.name("name")).sendKeys(userData.name)
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)
    await driver.findElement(By.css('button[data-qa="signup-button"]')).click()

    await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")), 10000)

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

    await driver.findElement(By.css('button[data-qa="create-account"]')).click()

    await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000)
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click()
    await driver.findElement(By.linkText("Logout")).click()
  }, 60000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Launch browser and navigate to homepage", async () => {
    await driver.get("https://automationexercise.com/")
    const logo = await driver.wait(until.elementLocated(By.css("img[alt='Website for automation practice']")), 10000)
    expect(await logo.isDisplayed()).toBe(true)
  })

  test("Click on 'Signup / Login'", async () => {
    const loginLink = await driver.findElement(By.linkText("Signup / Login"))
    await loginLink.click()

    const loginHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")), 10000)
    expect(await loginHeader.getText()).toBe("Login to your account")
  })

  test("Login with correct credentials", async () => {
    await driver.findElement(By.css('input[data-qa="login-email"]')).sendKeys(userData.email)
    await driver.findElement(By.css('input[data-qa="login-password"]')).sendKeys(userData.password)
    await driver.findElement(By.css('button[data-qa="login-button"]')).click()
  })

  test("Verify user logged in", async () => {
    const loggedInElement = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Logged in as')]")), 10000)
    const text = await loggedInElement.getText()
    expect(text).toContain(`Logged in as ${userData.name}`)
  })

  test("Delete account", async () => {
    await driver.findElement(By.linkText("Delete Account")).click()

    const deletedMsg = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")), 10000)
    expect(await deletedMsg.getText()).toContain("ACCOUNT DELETED!")

    await driver.findElement(By.css('a[data-qa="continue-button"]')).click()
  })
})
describe("Test Case 3: Login User with incorrect email and password", () => {
  let driver
  const userData = {
    email: "incorrectemail@mail.com",
    password: "IncorrectPassword",
  }

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("http://automationexercise.com/")
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Launch browser and navigate to homepage", async () => {
    const logo = await driver.wait(until.elementLocated(By.css("img[alt='Website for automation practice']")), 10000)
    expect(await logo.isDisplayed()).toBe(true)
  })

  test("Click on 'Signup / Login'", async () => {
    const loginLink = await driver.findElement(By.linkText("Signup / Login"))
    await loginLink.click()

    const loginHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")), 10000)
    expect(await loginHeader.getText()).toBe("Login to your account")
  })

  test("Enter incorrect email address and password", async () => {
    await driver.findElement(By.css('input[data-qa="login-email"]')).sendKeys(userData.email)
    await driver.findElement(By.css('input[data-qa="login-password"]')).sendKeys(userData.password)
  })

  test("Click 'login' button", async () => {
    await driver.findElement(By.css('button[data-qa="login-button"]')).click()
  })

  test("Verify error 'Your email or password is incorrect!' is visible", async () => {
    const errorMessage = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(),'Your email or password is incorrect!')]")), 10000)
    expect(await errorMessage.getText()).toBe("Your email or password is incorrect!")
  })
})

describe("Test Case 4: Logout User", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("http://automationexercise.com/")
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Launch browser and navigate to homepage", async () => {
    const logo = await driver.wait(until.elementLocated(By.css("img[alt='Website for automation practice']")), 10000)
    expect(await logo.isDisplayed()).toBe(true)
  })

  test("Click on 'Signup / Login'", async () => {
    const signupLink = await driver.findElement(By.linkText("Signup / Login"))
    await signupLink.click()

    const signupHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'New User Signup!')]")), 10000)
    expect(await signupHeader.getText()).toBe("New User Signup!")
  })

  test("Enter user details and click Signup", async () => {
    await driver.findElement(By.name("name")).sendKeys(userData.name)
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)
    await driver.findElement(By.css('button[data-qa="signup-button"]')).click()

    const enterInfoHeader = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")), 10000)
    expect(await enterInfoHeader.getText()).toContain("ENTER ACCOUNT INFORMATION")
  })

  test("Fill account details", async () => {
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

  test("Create account and verify account created", async () => {
    await driver.findElement(By.css('button[data-qa="create-account"]')).click()

    const accountCreated = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000)
    expect(await accountCreated.getText()).toContain("ACCOUNT CREATED!")
  })

  test("Verify user logged in", async () => {
    jest.setTimeout(15000)

    await driver.findElement(By.css('a[data-qa="continue-button"]')).click()

    const loggedInElement = await driver.wait(until.elementLocated(By.xpath("//a[contains(., 'Logged in as')]")), 15000)

    const text = await loggedInElement.getText()
    expect(text).toMatch(/Logged in as/i)
  })

  test("Click 'Logout' button", async () => {
    await driver.findElement(By.linkText("Logout")).click()
  })

  test("Verify that user is navigated to login page", async () => {
    const loginHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")), 10000)
    expect(await loginHeader.getText()).toBe("Login to your account")
  })
})

describe("Test Case 5: Register User with existing email", () => {
  let driver
  let userData

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("http://automationexercise.com/")
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Create a new user account first", async () => {
    const randomNum = Math.floor(Math.random() * 100000)
    userData = {
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

    await driver.findElement(By.linkText("Signup / Login")).click()
    await driver.wait(until.elementLocated(By.name("name")), 10000)

    await driver.findElement(By.name("name")).sendKeys(userData.name)
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)
    await driver.findElement(By.css('button[data-qa="signup-button"]')).click()

    await driver.wait(until.elementLocated(By.id("id_gender1")), 10000)
    await driver.findElement(By.id("id_gender1")).click()
    await driver.findElement(By.id("password")).sendKeys(userData.password)

    await driver.findElement(By.id("days")).sendKeys("1")
    await driver.findElement(By.id("months")).sendKeys("January")
    await driver.findElement(By.id("years")).sendKeys("2000")

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

    await driver.findElement(By.css('button[data-qa="create-account"]')).click()

    const success = await driver.wait(until.elementLocated(By.xpath("//b[text()='Account Created!']")), 10000)
    const successText = await success.getText()
    expect(successText).toBe("ACCOUNT CREATED!")

    const continueBtn = await driver.findElement(By.css('a[data-qa="continue-button"]'))
    await continueBtn.click()

    const logoutBtn = await driver.findElement(By.linkText("Logout"))
    await logoutBtn.click()
  })

  test("Attempt to register again with the same email", async () => {
    await driver.wait(until.elementLocated(By.linkText("Signup / Login")), 10000)
    await driver.findElement(By.linkText("Signup / Login")).click()

    const newUserSignupHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'New User Signup!')]")), 10000)
    expect(await newUserSignupHeader.getText()).toBe("New User Signup!")

    await driver.findElement(By.name("name")).sendKeys("AnotherName")
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)

    await driver.findElement(By.css('button[data-qa="signup-button"]')).click()

    const errorMessage = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(),'Email Address already exist!')]")), 10000)
    const errorText = await errorMessage.getText()
    expect(errorText).toBe("Email Address already exist!")
  })
})

describe("Test Case 6: Contact Us Form", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  test("should submit Contact Us form successfully", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 5000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const contactUsBtn = await driver.findElement(By.css('a[href="/contact_us"]'))
    await contactUsBtn.click()

    const getInTouchHeader = await driver.wait(until.elementLocated(By.css("h2.title.text-center")), 5000)
    expect(await getInTouchHeader.getText()).toBe("CONTACT US")

    await driver.findElement(By.name("name")).sendKeys("Test User")
    await driver.findElement(By.name("email")).sendKeys("testuser@example.com")
    await driver.findElement(By.name("subject")).sendKeys("Test Subject")
    await driver.findElement(By.id("message")).sendKeys("This is a test message.")

    const fileInput = await driver.findElement(By.name("upload_file"))
    const filePath = path.resolve(__dirname, "testfile.txt")
    await fileInput.sendKeys(filePath)

    const submitBtn = await driver.findElement(By.name("submit"))
    await submitBtn.click()

    await driver.switchTo().alert().accept()

    const successMsg = await driver.wait(until.elementLocated(By.css(".status.alert.alert-success")), 5000)
    expect(await successMsg.getText()).toBe("Success! Your details have been submitted successfully.")

    const homeBtn = await driver.findElement(By.css("a.btn.btn-success"))
    await homeBtn.click()

    await driver.wait(until.titleContains("Automation"), 5000)
    const homeLogo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await homeLogo.isDisplayed()).toBe(true)
  })
})

describe("Test Case 7: Verify Test Cases Page", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  test("should navigate to test cases page successfully", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 5000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const testCasesBtn = await driver.findElement(By.css('a[href="/test_cases"]'))
    await testCasesBtn.click()

    await driver.wait(until.urlContains("/test_cases"), 5000)

    const testCasesHeader = await driver.wait(until.elementLocated(By.css("h2.title.text-center")), 5000)
    const headerText = await testCasesHeader.getText()
    expect(headerText.toUpperCase()).toContain("TEST CASES")
  })
})

describe("Test Case 8: Verify All Products and product detail page", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  test("should display product details correctly", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 5000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const productsBtn = await driver.findElement(By.css('a[href="/products"]'))
    await productsBtn.click()

    await driver.wait(until.titleContains("All Products"), 5000)

    const productList = await driver.wait(until.elementLocated(By.css(".features_items")), 5000)
    expect(await productList.isDisplayed()).toBe(true)

    const viewProduct = await driver.findElement(By.css('a[href="/product_details/1"]'))
    await viewProduct.click()

    await driver.wait(until.urlContains("/product_details/1"), 5000)

    const productName = await driver.findElement(By.css(".product-information h2"))
    const category = await driver.findElement(By.xpath("//p[contains(text(),'Category')]"))
    const price = await driver.findElement(By.css(".product-information span span"))
    const availability = await driver.findElement(By.xpath("//b[contains(text(),'Availability')]"))
    const condition = await driver.findElement(By.xpath("//b[contains(text(),'Condition')]"))
    const brand = await driver.findElement(By.xpath("//b[contains(text(),'Brand')]"))

    expect(await productName.isDisplayed()).toBe(true)
    expect(await category.isDisplayed()).toBe(true)
    expect(await price.isDisplayed()).toBe(true)
    expect(await availability.isDisplayed()).toBe(true)
    expect(await condition.isDisplayed()).toBe(true)
    expect(await brand.isDisplayed()).toBe(true)
  })
})

describe("Test Case 9: Search Product", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  test("should search for a product and display results", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 5000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const productsBtn = await driver.findElement(By.css('a[href="/products"]'))
    await productsBtn.click()

    await driver.wait(until.titleContains("All Products"), 5000)
    const allProductsSection = await driver.findElement(By.css(".features_items"))
    expect(await allProductsSection.isDisplayed()).toBe(true)

    const searchInput = await driver.findElement(By.id("search_product"))
    await searchInput.sendKeys("Dress")

    const searchBtn = await driver.findElement(By.id("submit_search"))
    await searchBtn.click()

    const searchedHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Searched Products')]")), 5000)
    expect(await searchedHeader.isDisplayed()).toBe(true)

    const searchResults = await driver.findElements(By.css(".features_items .product-image-wrapper"))
    expect(searchResults.length).toBeGreaterThan(0)

    for (const product of searchResults) {
      expect(await product.isDisplayed()).toBe(true)
    }
  })
})

describe("Test Case 10: Verify Subscription in home page", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  test("should subscribe successfully from the home page", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 5000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)")

    const subscriptionText = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Subscription')]")), 5000)
    expect(await subscriptionText.isDisplayed()).toBe(true)

    const emailInput = await driver.findElement(By.id("susbscribe_email"))
    await emailInput.sendKeys(userData.email)

    const subscribeBtn = await driver.findElement(By.id("subscribe"))
    await subscribeBtn.click()

    const successMsg = await driver.wait(until.elementLocated(By.css(".alert-success.alert")), 10000)

    const successText = await successMsg.getText()
    expect(successText).toBe("You have been successfully subscribed!")

    expect(successText).not.toBeNull()
  })
})
