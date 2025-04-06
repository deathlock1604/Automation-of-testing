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
