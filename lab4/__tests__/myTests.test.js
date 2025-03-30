const { UserService } = require("../labAssignment-lab4.js")
const { computeValue } = require("../labAssignment-lab4.js")
const { asyncError } = require("../labAssignment-lab4.js")
const { ApiClient } = require("../labAssignment-lab4.js")
const { ApiHelper } = require("../labAssignment-lab4.js")
const { calculateFinalPrice } = require("../labAssignment-lab4.js")
const { OrderProcessor } = require("../labAssignment-lab4.js")

// <----------------------------Завдання 1-------------------------------->
describe("task1 - UserService - greet() method", () => {
  test('greet() should call getFullName with "John" and "Doe"', () => {
    const getFullName = jest.fn().mockReturnValue("John Doe")
    const userService = new UserService(getFullName)

    // Викликаємо метод greet()
    userService.greet()

    // Перевіряємо, що getFullName була викликана з правильними аргументами
    expect(getFullName).toHaveBeenCalledWith("John", "Doe")
  })

  test('greet() should return "HELLO, JOHN DOE!"', () => {
    const getFullName = jest.fn().mockReturnValue("John Doe")
    const userService = new UserService(getFullName)

    // Перевіряємо, що метод greet() повертає правильне значення
    const result = userService.greet()
    expect(result).toBe("HELLO, JOHN DOE!") // Очікуємо привітання у верхньому регістрі
  })
})

// <----------------------------Завдання 2-------------------------------->

describe("task 2 - asyncHello function", () => {
  const asyncHello = () => {
    return Promise.resolve("hello world")
  }

  test('asyncHello should resolve with "hello world"', () => {
    return expect(asyncHello()).resolves.toBe("hello world")
  })
})

// <----------------------------Завдання 3-------------------------------->

describe("task 3 - computeValue function", () => {
  test("computeValue should return 94", async () => {
    const result = await computeValue()
    expect(result).toBe(94) // Перевірка, чи повертається правильне значення
  })
})

// <----------------------------Завдання 4-------------------------------->

describe("task 4 - asyncError function", () => {
  test('should reject with "Something went wrong"', () => {
    return expect(asyncError()).rejects.toThrow("Something went wrong")
  })
})

// <----------------------------Завдання 5-------------------------------->

describe("task 5 - ApiClient - fetchData() method", () => {
  // Замокаємо глобальну функцію fetch
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({ data: "test data" }),
  })

  test("fetchData should return JSON object with fetchedAt field", async () => {
    const apiClient = new ApiClient()

    // Викликаємо метод fetchData
    const result = await apiClient.fetchData()
    // Перевіряємо, що результат містить поле fetchedAt
    expect(result).toHaveProperty("fetchedAt")
    expect(typeof result.fetchedAt).toBe("number")
    // Перевіряємо, що метод fetchData повертає правильний JSON
    expect(result).toEqual({
      data: "test data",
      fetchedAt: expect.any(Number),
    })
    // Перевіряємо, що fetch був викликаний
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

// <----------------------------Завдання 6-------------------------------->

describe("task 6 - ApiHelper - fetchViaHelper() method", () => {
  test("fetchViaHelper should return expected result with valid data", async () => {
    // Створюємо замокану функцію apiCallFunction, яка повертає фіксований JSON
    const apiCallFunction = jest.fn().mockResolvedValue({ data: "test data" })
    const apiHelper = new ApiHelper()
    // Викликаємо метод fetchViaHelper
    const result = await apiHelper.fetchViaHelper(apiCallFunction)
    expect(result).toEqual({ data: "test data" })

    // Перевіряємо, що apiCallFunction була викликана
    expect(apiCallFunction).toHaveBeenCalledTimes(1)
  })

  test("fetchViaHelper should throw error if invalid data is returned", async () => {
    // Створюємо замокану функцію apiCallFunction, яка повертає невалідні дані
    const apiCallFunction = jest.fn().mockResolvedValue(null)
    const apiHelper = new ApiHelper()
    await expect(apiHelper.fetchViaHelper(apiCallFunction)).rejects.toThrow("Invalid data")

    expect(apiCallFunction).toHaveBeenCalledTimes(1)
  })
})

// <----------------------------Завдання 7-------------------------------->
// <----------------------------Завдання 7-------------------------------->

describe("task 7 - calculateFinalPrice function", () => {
  test("should calculate the final price correctly with discount and tax", () => {
    const order = {
      items: [
        { price: 100, quantity: 2 }, // 200
        { price: 50, quantity: 1 }, // 50
      ],
      taxRate: 0.2, // 20% податок
    }
    const discountService = {
      getDiscount: (subtotal) => 0.1, // 10% знижка
    }

    const result = calculateFinalPrice(order, discountService)
    // Очікуваний результат:
    // subtotal = 200 + 50 = 250
    // discount = 10% з 250 = 25
    // totalAfterDiscount = 250 - 25 = 225
    // totalWithTax = 225 * (1 + 0.2) = 270 - має бути така сума
    expect(result).toBe(270)
  })

  // Перевіряємо знижку
  test("should limit discount to 50%", () => {
    const order = {
      items: [
        { price: 200, quantity: 1 }, // 200
        { price: 150, quantity: 1 }, // 150
      ],
      taxRate: 0.2, // 20% податок
    }
    const discountService = {
      getDiscount: (subtotal) => 0.6, // 60% знижка (максимально має бути 50%, тому має бути обмежено)
    }

    const result = calculateFinalPrice(order, discountService)
    // Очікуваний результат:
    // subtotal = 200+150 = 350
    // discount = 50% з 350 = 175 (максимальна знижка 50%)
    // totalAfterDiscount = 350-175 = 175
    // totalWithTax = 175 * (1 + 0.2) = 210 - має бути така сума
    expect(result).toBe(210)
  })

  test("should throw error for order with no items", () => {
    const order = {
      items: [],
      taxRate: 0.2,
    }
    const discountService = {
      getDiscount: (subtotal) => 0.1,
    }

    expect(() => calculateFinalPrice(order, discountService)).toThrowError("Invalid order")
  })

  test("should throw error for order with negative item price or quantity", () => {
    const order = {
      items: [
        { price: -100, quantity: 2 }, // негативна ціна
        { price: 50, quantity: 1 },
      ],
      taxRate: 0.2,
    }
    const discountService = {
      getDiscount: (subtotal) => 0.1,
    }

    expect(() => calculateFinalPrice(order, discountService)).toThrowError("Invalid item data")
  })
})

// <----------------------------Завдання 8-------------------------------->

describe("task 8 - OrderProcessor - processOrder() method", () => {
  test("should correctly process order and convert currency", async () => {
    const mockConverter = jest.fn().mockResolvedValue(500) // Замоканий конвертер повертає 500
    const orderProcessor = new OrderProcessor(mockConverter)

    const order = {
      items: [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ],
      taxRate: 0.2,
      currency: "USD",
      discountService: {
        getDiscount: () => 0.1,
      },
    }

    const result = await orderProcessor.processOrder(order, "EUR")

    expect(mockConverter).toHaveBeenCalledWith(270, "USD", "EUR")
    expect(result).toBe(500)
  })

  test("should return original price if currency conversion fails", async () => {
    const mockConverter = jest.fn().mockRejectedValue(new Error("Conversion failed"))
    const orderProcessor = new OrderProcessor(mockConverter)

    const order = {
      items: [
        { price: 100, quantity: 2 }, // 200
        { price: 50, quantity: 1 }, // 50
      ],
      taxRate: 0.2, // 20% податок
      currency: "USD",
      discountService: {
        getDiscount: () => 0.1, // 10% знижка
      },
    }

    const result = await orderProcessor.processOrder(order, "EUR")

    expect(result).toBe(270) // Очікуємо, що функція поверне не конвертовану ціну (270)
  })
})
