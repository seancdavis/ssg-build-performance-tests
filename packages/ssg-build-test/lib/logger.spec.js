const Logger = require("./logger")

require("./database")
jest.mock("./database")

// --- Setup & Teardown --- //

let logger
beforeEach(() => (logger = new Logger("base")))

// --- Constructor --- //

describe("new Logger()", () => {
  it("throws an error when no dataset is specified", () => {
    expect(() => {
      logger = new Logger({})
    }).toThrow()
  })
  it("stores an instance of Database", () => {
    logger = new Logger("base", {})
    expect(typeof logger.db.request).toEqual("function")
  })
})
