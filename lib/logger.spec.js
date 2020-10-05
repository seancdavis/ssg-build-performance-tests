const fs = require("fs")
const lodash = require("lodash")
const path = require("path")
const rimraf = require("rimraf")

const testConfig = require("../test.config")
const Logger = require("./logger")

// --- Mocks --- //

let mockConfig = {
  file: path.resolve(__dirname, `tmp/${new Date().getTime()}.json`),
  maxHistory: 5
}

let mockResult = {
  name: "hugo",
  count: 1,
  duration: 0.044,
  buildFileCount: 4,
  buildHtmlFileCount: 0
}

let mockResults = {
  base: {
    hugo: {
      "count-1": [mockResult]
    }
  }
}

// --- Setup & Teardown --- //

let logger
beforeEach(() => (logger = new Logger("base")))

afterEach(() => {
  const tmpPath = path.resolve(__dirname, "tmp")
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath)
})

// --- Constructor --- //
//
// Includes all init...() functions.
//
describe("new Logger()", () => {
  it("throws an error when no dataset is specified", () => {
    expect(() => {
      logger = new Logger({})
    }).toThrow()
  })
  it("has proper defaults", () => {
    logger = new Logger("base", {})
    const defaultFilePath = path.resolve(__dirname, "../src/results.json")
    expect(logger.config).toEqual({ file: defaultFilePath, maxHistory: 3 })
  })
  it("loads the test config if nothing is passed in", () => {
    expect(logger.config).toEqual(testConfig.log)
  })
  it("will appropriately set properties based on args", () => {
    logger = new Logger("base", mockConfig)
    expect(logger.config).toEqual(mockConfig)
  })
  it("automatically creates a log file", () => {
    expect(fs.existsSync(mockConfig.file)).toEqual(false)
    logger = new Logger("base", mockConfig)
    expect(fs.readFileSync(mockConfig.file).toString()).toEqual("{}")
  })
  it("reads the results from file and stores them", () => {
    // Assumes file is empty and/or no test results have yet been stored against
    // the file specified in config (above).
    logger = new Logger("base", mockConfig)
    expect(logger.results).toEqual({})
    // Run again, but this time with a file that already exists.
    const cachedFile = mockConfig.file.replace(".json", "-02.json")

    fs.writeFileSync(cachedFile, JSON.stringify(mockResults))
    logger = new Logger("base", { file: cachedFile })
    expect(logger.results).toEqual(mockResults)
  })
})

// --- Generate Timestamp --- //

describe("generateTimestamp()", () => {
  it("returns an integer of the current time", () => {
    const result = logger.generateTimestamp()
    expect(typeof result).toEqual("number")
    expect(result.toString().length).toEqual(13)
  })
})

// --- Store New Result --- //

describe("storeResult()", () => {
  beforeEach(() => (logger = new Logger("base", { file: mockConfig.file })))

  it("nests them in a dataset, name, and count key", () => {
    expect(logger.results).toEqual({})
    logger.storeResult(mockResult)
    const storedResult = logger.results.base.hugo["count-1"][0]
    expect(storedResult.name).toEqual(mockResult.name)
    expect(storedResult.count).toEqual(mockResult.count)
    expect(storedResult.timestamp).not.toBeUndefined()
  })
  it("requires name and count to be included", () => {
    expect(() => {
      logger.storeResult({ foo: "bar" })
    }).toThrow()
  })
  it("only stores the three most recent", () => {
    expect(lodash.get(logger, "base.results.hugo.count-1")).toBeUndefined()
    logger.storeResult(mockResult)
    expect(logger.results.base.hugo["count-1"].length).toEqual(1)
    const firstResult = logger.results.base.hugo["count-1"][0]
    logger.storeResult(mockResult)
    expect(logger.results.base.hugo["count-1"].length).toEqual(2)
    expect(logger.results.base.hugo["count-1"].includes(firstResult)).toEqual(true)
    logger.storeResult(mockResult)
    expect(logger.results.base.hugo["count-1"].length).toEqual(3)
    expect(logger.results.base.hugo["count-1"].includes(firstResult)).toEqual(true)
    logger.storeResult(mockResult)
    expect(logger.results.base.hugo["count-1"].length).toEqual(3)
  })
  it("includes any passed key-value pairs", () => {
    logger.storeResult({ ...mockResult, foo: "bar" })
    expect(logger.results.base.hugo["count-1"][0].foo).toEqual("bar")
  })
})

// --- Write File --- //

describe("writeFile()", () => {
  it("writes the results to file", () => {
    logger = new Logger("base", mockConfig)
    expect(JSON.parse(fs.readFileSync(mockConfig.file))).toEqual({})
    logger.results = mockResults
    logger.writeFile()
    expect(JSON.parse(fs.readFileSync(mockConfig.file))).toEqual(mockResults)
  })
})
