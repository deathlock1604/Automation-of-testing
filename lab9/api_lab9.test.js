const pactum = require("pactum")

describe("Перевірка Currency API", () => {
  test("Список валют", async () => {
    await pactum.spec().get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json").expectStatus(200).expectJsonSchema({ type: "object" })
  })

  test("Курс євро до інших валют", async () => {
    await pactum
      .spec()
      .get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json")
      .expectStatus(200)
      .expectJsonSchema({
        type: "object",
        required: ["date", "eur"],
      })
  })

  test("Запит на неіснуючу валюту повертає 404", async () => {
    await pactum.spec().get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eurpian.json").expectStatus(404)
  })
})

describe("Перевірка Holidays API", () => {
  test("Перевірка святкових категорій", async () => {
    await pactum
      .spec()
      .get("https://www.gov.uk/bank-holidays.json")
      .expectStatus(200)
      .expectJsonSchema({
        required: ["england-and-wales", "scotland", "northern-ireland"],
      })
      .expectJsonLength("england-and-wales.events", 75)
      .expectJsonLength("scotland.events", 84)
      .expectJsonLength("northern-ireland.events", 93)
  })

  test("Наявність Великоднього понеділка", async () => {
    const spec = pactum.spec()
    await spec.get("https://www.gov.uk/bank-holidays.json").expectStatus(200)

    const body = spec._response.body // Без returns('body'), напряму через Pactum
    expect(body).toBeDefined()
    expect(body["england-and-wales"]).toBeDefined()

    const events = body["england-and-wales"].events
    const hasEasterMonday = events.some((event) => event.title.includes("Easter Monday"))

    expect(hasEasterMonday).toBe(true)
  })
})

describe("Перевірка Word API", () => {
  test('Слово "concurrency"', async () => {
    await pactum
      .spec()
      .get("https://api.dictionaryapi.dev/api/v2/entries/en/concurrency")
      .expectStatus(200)
      .expectJsonSchema({
        required: ["word", "phonetics", "meanings"],
      })
      .expectJsonLike([{ word: "concurrency" }])
  })
})
describe("Перевірка Dictionary API", () => {
  const words = ["example", "education", "success", "challenge", "future"]

  words.forEach((word) => {
    test(`Перевірка прикладів використання для слова "${word}"`, async () => {
      const spec = pactum.spec()
      await spec.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).expectStatus(200)

      const response = spec._response.body
      expect(response[0]).toBeDefined()
      expect(response[0].meanings.length).toBeGreaterThan(0)

      const definitions = response[0].meanings.flatMap((meaning) => meaning.definitions)
      expect(definitions.length).toBeGreaterThan(0)
    })
  })
})
