const { Builder, By, until } = require("selenium-webdriver")

jest.setTimeout(60000)

describe("Тести Rozetka", () => {
  let driver

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build()
    await driver.get("https://rozetka.com.ua/")
  })

  afterAll(async () => {
    await driver.quit()
  })

  describe("Головна сторінка", () => {
    test("Перевірити завантаження головної сторінки без помилок", async () => {
      const title = await driver.getTitle()
      expect(title).toContain("ROZETKA")
    })

    test("Перевірити відображення головного банера", async () => {
      const bannerImage = await driver.wait(until.elementLocated(By.css('img[alt="Rozetka Logo"]')), 15000)
      expect(await bannerImage.isDisplayed()).toBe(true)
    })

    test("Перевірити наявність головного меню категорій", async () => {
      const categoriesMenu = await driver.wait(until.elementLocated(By.css("rz-main-page-sidebar")), 15000)
      expect(await categoriesMenu.isDisplayed()).toBe(true)

      const categories = await driver.findElements(By.css("rz-main-page-sidebar li a"))
      expect(categories.length).toBeGreaterThan(0)

      const firstCategoryText = await categories[0].getText()
      expect(firstCategoryText.length).toBeGreaterThan(0)
    })
  })

  describe("Пошук товарів", () => {
    test('Перевірити пошук за ключовим словом "ноутбук"', async () => {
      const searchInput = await driver.findElement(By.name("search"))
      await searchInput.clear()
      await searchInput.sendKeys("ноутбук")

      const searchBtn = await driver.findElement(By.css("button.button_color_green.button_size_medium.search-form__submit"))
      await searchBtn.click()

      await driver.wait(until.elementLocated(By.css("rz-category-goods")), 15000)

      await driver.wait(until.elementLocated(By.css("rz-product-tile")), 15000)

      const products = await driver.findElements(By.css("rz-product-tile"))
      expect(products.length).toBeGreaterThan(0)
    })

    test("Перевірити пошук за неіснуючим словом", async () => {
      const searchInput = await driver.findElement(By.name("search"))
      await searchInput.clear()
      await searchInput.sendKeys("qwertyuiopasdfgh")

      const searchBtn = await driver.findElement(By.css("button.search-form__submit"))
      await searchBtn.click()

      await driver.wait(until.elementLocated(By.css(".search-nothing")), 15000)
      const noResultsMessage = await driver.findElement(By.css(".search-nothing h1"))
      const text = await noResultsMessage.getText()
      expect(text.toLowerCase()).toContain("нічого не знайдено")
    })

    test('Перевірити пошук за ключовим словом "ноутбук"', async () => {
      const searchInput = await driver.findElement(By.name("search"))
      await searchInput.clear()
      await searchInput.sendKeys("ноутбук")

      const searchBtn = await driver.findElement(By.css("button.button_color_green.button_size_medium.search-form__submit"))
      await searchBtn.click()

      // Чекаємо появу контейнера товарів
      await driver.wait(until.elementLocated(By.css("rz-category-goods")), 15000)

      // Чекаємо появу першого товару (rz-product-tile)
      await driver.wait(until.elementLocated(By.css("rz-product-tile")), 10000)

      const results = await driver.findElements(By.css("rz-product-tile"))
      expect(results.length).toBeGreaterThan(0)
    })
  })
})
