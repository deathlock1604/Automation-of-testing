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
describe("Test Case 11: Verify Subscription in Cart page", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  test("should subscribe successfully from the Cart page", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 5000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const cartBtn = await driver.findElement(By.css("a[href='/view_cart']"))
    await cartBtn.click()

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

describe("Test Case 12: Add Products in Cart", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  }, 30000)

  afterAll(async () => {
    await driver.quit()
  })

  test("should add products to cart and verify", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 10000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const productsBtn = await driver.findElement(By.css('a[href="/products"]'))
    await productsBtn.click()

    await driver.wait(until.urlContains("/products"), 10000)

    const actions = driver.actions({ async: true })

    const firstProduct = await driver.findElement(By.css(".productinfo.text-center"))
    await actions.move({ origin: firstProduct }).perform()

    const firstAddToCart = await driver.findElement(By.css('a[data-product-id="1"]'))
    await driver.wait(until.elementIsVisible(firstAddToCart), 5000)
    await driver.wait(until.elementIsEnabled(firstAddToCart), 5000)
    await firstAddToCart.click()

    const continueShoppingBtn = await driver.wait(until.elementLocated(By.css('button[data-dismiss="modal"]')), 5000)
    await driver.wait(until.elementIsVisible(continueShoppingBtn), 5000)
    await continueShoppingBtn.click()

    const secondProduct = (await driver.findElements(By.css(".productinfo.text-center")))[1]
    await actions.move({ origin: secondProduct }).perform()

    const secondAddToCart = await driver.findElement(By.css('a[data-product-id="2"]'))
    await driver.wait(until.elementIsVisible(secondAddToCart), 5000)
    await driver.wait(until.elementIsEnabled(secondAddToCart), 5000)
    await secondAddToCart.click()

    await driver.wait(until.elementIsVisible(continueShoppingBtn), 5000)
    await continueShoppingBtn.click()

    const cartLink = await driver.wait(until.elementLocated(By.css('a[href="/view_cart"]')), 5000)
    await cartLink.click()

    const cartProducts = await driver.findElements(By.css(".cart_info tbody tr"))
    expect(cartProducts.length).toBeGreaterThanOrEqual(2)

    for (const productRow of cartProducts) {
      const priceText = await productRow.findElement(By.css(".cart_price p")).getText()
      const quantityText = await productRow.findElement(By.css(".cart_quantity button")).getText()
      const totalText = await productRow.findElement(By.css(".cart_total_price")).getText()

      const price = Number(priceText.replace(/[^0-9]/g, "").trim())
      const quantity = Number(quantityText.replace(/[^0-9]/g, "").trim())
      const total = Number(totalText.replace(/[^0-9]/g, "").trim())

      expect(price).toBeGreaterThan(0)
      expect(quantity).toBeGreaterThan(0)
      expect(total).toBe(price * quantity)
    }
  })
})

describe("Test Case 13: Verify Product quantity in Cart", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
  }, 30000)

  afterAll(async () => {
    await driver.quit()
  })

  test("should verify product quantity in cart", async () => {
    await driver.get("http://automationexercise.com")

    await driver.wait(until.titleContains("Automation"), 10000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)

    const firstProductViewBtn = await driver.findElement(By.css('a[href="/product_details/1"]'))
    await firstProductViewBtn.click()

    await driver.wait(until.urlContains("/product_details/1"), 10000)
    const productDetail = await driver.findElement(By.css(".product-information h2"))
    expect(await productDetail.isDisplayed()).toBe(true)

    const quantityInput = await driver.findElement(By.css('input[name="quantity"]'))
    await quantityInput.clear()
    await quantityInput.sendKeys("4")

    const addToCartBtn = await driver.findElement(By.css('button[type="button"][class*="cart"]'))
    await addToCartBtn.click()
    const modal = await driver.wait(until.elementLocated(By.css(".modal-content")), 5000)
    await driver.wait(until.elementIsVisible(modal), 5000)

    const viewCartLinkInModal = await driver.wait(until.elementLocated(By.css('.modal-body a[href="/view_cart"]')), 5000)
    await driver.wait(until.elementIsVisible(viewCartLinkInModal), 5000)
    await driver.wait(until.elementIsEnabled(viewCartLinkInModal), 5000)
    await viewCartLinkInModal.click()

    const quantityButton = await driver.wait(until.elementLocated(By.css(".cart_quantity button")), 5000)
    const quantityText = await quantityButton.getText()

    expect(quantityText).toBe("4")
  })
})
describe("Test Case 14: Place Order: Register while Checkout", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("http://automationexercise.com")
  }, 60000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Launch browser and verify home page is visible", async () => {
    await driver.wait(until.titleContains("Automation"), 10000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)
  })

  test("Add product to cart", async () => {
    const productsBtn = await driver.findElement(By.css('a[href="/products"]'))
    await productsBtn.click()

    await driver.wait(until.urlContains("/products"), 10000)

    const firstProduct = await driver.findElement(By.css(".productinfo.text-center"))
    const actions = driver.actions({ async: true })
    await actions.move({ origin: firstProduct }).perform()

    const firstAddToCart = await driver.findElement(By.css('a[data-product-id="1"]'))
    await driver.wait(until.elementIsVisible(firstAddToCart), 5000)
    await driver.wait(until.elementIsEnabled(firstAddToCart), 5000)
    await firstAddToCart.click()

    const viewCartLinkInModal = await driver.wait(until.elementLocated(By.css('.modal-body a[href="/view_cart"]')), 5000)
    await driver.wait(until.elementIsVisible(viewCartLinkInModal), 5000)
    await viewCartLinkInModal.click()
  })

  test("Verify cart page is displayed and proceed to checkout", async () => {
    const cartHeader = await driver.wait(until.elementLocated(By.css(".cart_info")), 5000)
    expect(await cartHeader.isDisplayed()).toBe(true)

    const proceedToCheckoutBtn = await driver.findElement(By.css(".btn.btn-default.check_out"))
    await proceedToCheckoutBtn.click()
  })

  test("Click Register/Login button and create new account", async () => {
    const registerLoginBtn = await driver.wait(until.elementLocated(By.css("u")), 5000)
    await registerLoginBtn.click()

    await driver.wait(until.elementLocated(By.name("name")), 5000)
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
  })

  test("Verify 'ACCOUNT CREATED!' and continue", async () => {
    const accountCreated = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000)
    expect(await accountCreated.getText()).toContain("ACCOUNT CREATED!")

    const continueBtn = await driver.findElement(By.css('a[data-qa="continue-button"]'))
    await continueBtn.click()
  })

  test("Verify user is logged in", async () => {
    const loggedInAs = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Logged in as')]")), 10000)
    const loggedInText = await loggedInAs.getText()
    expect(loggedInText).toContain(userData.name)
  })

  test("Proceed to checkout again", async () => {
    const cartBtn = await driver.findElement(By.css('a[href="/view_cart"]'))
    await cartBtn.click()

    const checkoutBtn = await driver.findElement(By.css(".btn.btn-default.check_out"))
    await checkoutBtn.click()
  })

  test("Verify Address Details and Review Your Order", async () => {
    const addressDetails = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Address Details')]")), 10000)
    expect(await addressDetails.isDisplayed()).toBe(true)

    const reviewOrder = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Review Your Order')]")), 10000)
    expect(await reviewOrder.isDisplayed()).toBe(true)
  })

  test("Place order with comment", async () => {
    const commentArea = await driver.findElement(By.name("message"))
    await commentArea.sendKeys("Please deliver between 9AM-5PM.")

    const placeOrderBtn = await driver.findElement(By.css('a[href="/payment"]'))
    await placeOrderBtn.click()
  })

  test("Enter payment details and confirm order", async () => {
    await driver.wait(until.elementLocated(By.name("name_on_card")), 5000)
    await driver.findElement(By.name("name_on_card")).sendKeys("John Doe")
    await driver.findElement(By.name("card_number")).sendKeys("4111111111111111")
    await driver.findElement(By.name("cvc")).sendKeys("123")
    await driver.findElement(By.name("expiry_month")).sendKeys("12")
    await driver.findElement(By.name("expiry_year")).sendKeys("2027")

    const payAndConfirmBtn = await driver.findElement(By.id("submit"))
    await payAndConfirmBtn.click()
  })

  test("Verify order success message", async () => {
    const orderPlacedHeader = await driver.wait(until.elementLocated(By.css('h2[data-qa="order-placed"]')), 10000)
    await driver.wait(until.elementIsVisible(orderPlacedHeader), 5000)

    const headerText = await orderPlacedHeader.getText()
    console.log("Order placed header text:", headerText)

    expect(headerText).toContain("ORDER PLACED!")
  })

  test("Delete account and verify", async () => {
    const deleteAccountBtn = await driver.findElement(By.linkText("Delete Account"))
    await deleteAccountBtn.click()

    const accountDeleted = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")), 10000)
    expect(await accountDeleted.getText()).toContain("ACCOUNT DELETED!")

    const continueAfterDeleteBtn = await driver.findElement(By.css('a[data-qa="continue-button"]'))
    await continueAfterDeleteBtn.click()
  })
})

describe("Test Case 15: Place Order: Register before Checkout", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("http://automationexercise.com")
  }, 60000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Launch browser and verify home page is visible", async () => {
    await driver.wait(until.titleContains("Automation"), 10000)
    const logo = await driver.findElement(By.css('img[alt="Website for automation practice"]'))
    expect(await logo.isDisplayed()).toBe(true)
  })

  test("Click Signup/Login and register a new account", async () => {
    const signupLoginBtn = await driver.findElement(By.linkText("Signup / Login"))
    await signupLoginBtn.click()

    await driver.wait(until.elementLocated(By.name("name")), 5000)
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
  })

  test("Verify 'ACCOUNT CREATED!' and continue", async () => {
    const accountCreated = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000)
    expect(await accountCreated.getText()).toContain("ACCOUNT CREATED!")

    const continueBtn = await driver.findElement(By.css('a[data-qa="continue-button"]'))
    await continueBtn.click()
  })

  test("Verify user is logged in", async () => {
    const loggedInAs = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Logged in as')]")), 10000)
    const loggedInText = await loggedInAs.getText()
    expect(loggedInText).toContain(userData.name)
  })

  test("Add product to cart", async () => {
    const productsBtn = await driver.findElement(By.css('a[href="/products"]'))
    await productsBtn.click()

    await driver.wait(until.urlContains("/products"), 10000)

    const firstProduct = await driver.findElement(By.css(".productinfo.text-center"))
    const actions = driver.actions({ async: true })
    await actions.move({ origin: firstProduct }).perform()

    const firstAddToCart = await driver.findElement(By.css('a[data-product-id="1"]'))
    await driver.wait(until.elementIsVisible(firstAddToCart), 5000)
    await driver.wait(until.elementIsEnabled(firstAddToCart), 5000)
    await firstAddToCart.click()

    const viewCartLinkInModal = await driver.wait(until.elementLocated(By.css('.modal-body a[href="/view_cart"]')), 5000)
    await driver.wait(until.elementIsVisible(viewCartLinkInModal), 5000)
    await viewCartLinkInModal.click()
  })

  test("Verify cart page is displayed and proceed to checkout", async () => {
    const cartHeader = await driver.wait(until.elementLocated(By.css(".cart_info")), 5000)
    expect(await cartHeader.isDisplayed()).toBe(true)

    const proceedToCheckoutBtn = await driver.findElement(By.css(".btn.btn-default.check_out"))
    await proceedToCheckoutBtn.click()
  })

  test("Verify Address Details and Review Your Order", async () => {
    const addressDetails = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Address Details')]")), 10000)
    expect(await addressDetails.isDisplayed()).toBe(true)

    const reviewOrder = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Review Your Order')]")), 10000)
    expect(await reviewOrder.isDisplayed()).toBe(true)
  })

  test("Place order with comment", async () => {
    const commentArea = await driver.findElement(By.name("message"))
    await commentArea.sendKeys("Please deliver after 5PM.")

    const placeOrderBtn = await driver.findElement(By.css('a[href="/payment"]'))
    await placeOrderBtn.click()
  })

  test("Enter payment details and confirm order", async () => {
    await driver.wait(until.elementLocated(By.name("name_on_card")), 5000)
    await driver.findElement(By.name("name_on_card")).sendKeys("John Doe")
    await driver.findElement(By.name("card_number")).sendKeys("4111111111111111")
    await driver.findElement(By.name("cvc")).sendKeys("123")
    await driver.findElement(By.name("expiry_month")).sendKeys("12")
    await driver.findElement(By.name("expiry_year")).sendKeys("2027")

    const payAndConfirmBtn = await driver.findElement(By.id("submit"))
    await payAndConfirmBtn.click()
  })

  test("Verify order success message", async () => {
    const orderPlacedHeader = await driver.wait(until.elementLocated(By.css('h2[data-qa="order-placed"]')), 10000)
    await driver.wait(until.elementIsVisible(orderPlacedHeader), 5000)

    const headerText = await orderPlacedHeader.getText()
    expect(headerText).toContain("ORDER PLACED!")
  })

  test("Delete account and verify", async () => {
    const deleteAccountBtn = await driver.findElement(By.linkText("Delete Account"))
    await deleteAccountBtn.click()

    const accountDeleted = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")), 10000)
    expect(await accountDeleted.getText()).toContain("ACCOUNT DELETED!")

    const continueAfterDeleteBtn = await driver.findElement(By.css('a[data-qa="continue-button"]'))
    await continueAfterDeleteBtn.click()
  })
})
