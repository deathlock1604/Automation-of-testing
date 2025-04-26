const { Builder, By, Key, until } = require("selenium-webdriver")

// <----------------------------Завдання 2-------------------------------->

describe("task2 - Wikipedia homepage test", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://www.wikipedia.org")
  }, 20000)
  afterAll(async () => {
    await driver.quit()
  })

  test("поле пошуку присутнє (за допомогою name)", async () => {
    const searchBox = await driver.findElement(By.name("search"))
    expect(searchBox).toBeDefined() // Перевірка наявності поля пошуку
  })

  test("логотип Wikipedia присутній (за тегом img)", async () => {
    const logo = await driver.wait(until.elementLocated(By.tagName("img")), 10000)
    expect(logo).toBeDefined() // Перевірка наявності логотипу
  })
})

// <----------------------------Завдання 3-------------------------------->

describe("task 3 - Wikipedia Search functionality tests", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://www.wikipedia.org")
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("виконання пошуку за допомогою sendKeys та Enter або кнопки пошуку", async () => {
    const searchBox = await driver.findElement(By.name("search"))
    await searchBox.sendKeys("Selenium (software)") // Тестуємо введення тексту у поле пошуку
    await searchBox.sendKeys(Key.ENTER) // Натискання клавіші Enter для запуску пошуку

    try {
      await driver.wait(until.titleContains("Selenium (software)"), 10000)
    } catch (error) {
      const searchButton = await driver.findElement(By.css("button[type='submit'], .search-button, .search-icon"))
      await searchButton.click() // Клік по кнопці пошуку, якщо Enter не спрацював
      await driver.wait(until.titleContains("Selenium (software)"), 10000)
    }

    const title = await driver.getTitle()
    expect(title).toContain("Selenium (software)") // Перевірка, що заголовок сторінки містить слово "Selenium (software)"
  })
})
// <----------------------------Завдання 4-------------------------------->

describe("task 4 - Wikipedia Article Test", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://en.wikipedia.org/wiki/Selenium_(software)")
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("перевірка заголовку статті", async () => {
    const articleTitle = await driver.findElement(By.xpath("//h1[@id='firstHeading']"))
    const titleText = await articleTitle.getText()
    expect(titleText).toBe("Selenium (software)") // Перевірка, що заголовок статті відповідає очікуваному
  })

  test("перевірка посилань у меню навігації", async () => {
    const navLinks = await driver.findElements(By.css(".vector-menu-content a"))
    let foundExternalLink = false
    for (let link of navLinks) {
      const linkHref = await link.getAttribute("href")
      if (linkHref && linkHref.startsWith("https://") && !linkHref.includes("en.wikipedia.org")) {
        foundExternalLink = true // Перевірка на наявність зовнішнього посилання
        break
      }
    }
    expect(foundExternalLink).toBe(true) // Тест перевіряє, чи є хоча б одне зовнішнє посилання
  })
})

// <----------------------------Завдання 5-------------------------------->

describe("task 5 - Wikipedia Interaction Test", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://en.wikipedia.org/wiki/Selenium_(software)") // Змінив посилання адже іноземна версія сайту вела на хімічний елемент
  }, 20000)

  afterAll(async () => {
    await driver.quit()
  })

  test("очікування завантаження елементів на сторінці", async () => {
    const heading = await driver.findElement(By.xpath("//h1[@id='firstHeading']"))
    await driver.wait(until.elementIsVisible(heading), 10000)
    const titleText = await heading.getText()
    expect(titleText).toBe("Selenium (software)") // Перевірка тексту заголовка після завантаження
  })

  test("клік по внутрішньому посиланню та перевірка зміни URL", async () => {
    const openSourceLink = await driver.findElement(By.linkText("open source"))
    await openSourceLink.click() // Клік по внутрішньому посиланню
    await driver.wait(until.urlContains("Open_source"), 10000) // Перевірка зміни URL після кліку
    const currentUrl = await driver.getCurrentUrl()
    expect(currentUrl).toContain("/wiki/Open_source") // Перевірка, чи містить URL "/wiki/Open_source"
  })

  test("перевірка CSS властивостей елемента", async () => {
    const articleTitle = await driver.findElement(By.xpath("//h1[@id='firstHeading']"))
    const color = await articleTitle.getCssValue("color")
    expect(color).toBe("rgba(16, 20, 24, 1)") // Очікується чорний колір для заголовка
  })
})

describe("Test Case 1: Register User", () => {
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

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://automationexercise.com/")
  }, 30000)

  afterAll(async () => {
    await driver.quit()
  })

  test("Register new user", async () => {
    // 3. Перевірка, що головна сторінка завантажена
    await driver.wait(until.titleContains("Automation Exercise"), 10000)

    // 4. Клік по 'Signup / Login'
    await driver.findElement(By.linkText("Signup / Login")).click()

    // 5. Перевірка 'New User Signup!'
    const signupHeader = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'New User Signup!')]")), 10000)
    expect(await signupHeader.getText()).toBe("New User Signup!")

    // 6. Введення імені та email
    await driver.findElement(By.name("name")).sendKeys(userData.name)
    await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(userData.email)

    // 7. Клік по кнопці Signup
    await driver.findElement(By.css('button[data-qa="signup-button"]')).click()

    // 8. Перевірка 'ENTER ACCOUNT INFORMATION'
    const enterInfoHeader = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")), 10000)
    expect(await enterInfoHeader.getText()).toContain("ENTER ACCOUNT INFORMATION")

    // 9. Заповнення: Title, Name, Email, Password, Date of birth
    await driver.findElement(By.id("id_gender1")).click()
    await driver.findElement(By.id("password")).sendKeys(userData.password)
    await driver.findElement(By.id("days")).sendKeys("10")
    await driver.findElement(By.id("months")).sendKeys("May")
    await driver.findElement(By.id("years")).sendKeys("1995")

    // 10–11. Чекбокси
    await driver.findElement(By.id("newsletter")).click()
    await driver.findElement(By.id("optin")).click()

    // 12. Заповнення адреси
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

    // 13. Створити акаунт
    await driver.findElement(By.css('button[data-qa="create-account"]')).click()

    // 14. Перевірка 'ACCOUNT CREATED!'
    const accountCreated = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000)
    expect(await accountCreated.getText()).toContain("ACCOUNT CREATED!")

    // 15. Натискання кнопки Continue
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click()

    // 16. Перевірка 'Logged in as username'
    await driver.wait(until.elementLocated(By.xpath(`//a[contains(text(),'Logged in as ${userData.name}')]`)), 10000)

    // 17. Видалення акаунту
    await driver.findElement(By.linkText("Delete Account")).click()

    // 18. Перевірка 'ACCOUNT DELETED!'
    const deletedMsg = await driver.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")), 10000)
    expect(await deletedMsg.getText()).toContain("ACCOUNT DELETED!")

    // Натискання кнопки Continue
    await driver.findElement(By.css('a[data-qa="continue-button"]')).click()
  }, 60000)
})
