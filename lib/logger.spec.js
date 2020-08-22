const fs = require("fs")
const lodash = require("lodash")
const path = require("path")
const rimraf = require("rimraf")

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
  hugo: {
    "count-1": [mockResult]
  }
}

// --- Setup & Teardown --- //

let logger
beforeEach(() => (logger = new Logger()))

afterEach(() => {
  const tmpPath = path.resolve(__dirname, "tmp")
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath)
})

// --- Constructor --- //
//
// Includes all init...() functions.
//
describe("new Logger()", () => {
  it("has proper defaults", () => {
    const defaultFilePath = path.resolve(__dirname, "../../tmp/results.json")
    expect(logger.config).toEqual({ file: defaultFilePath, maxHistory: 3 })
  })
  it("will appropriately set properties based on args", () => {
    logger = new Logger(mockConfig)
    expect(logger.config).toEqual(mockConfig)
  })
  it("automatically creates a log file", () => {
    expect(fs.existsSync(mockConfig.file)).toEqual(false)
    logger = new Logger(mockConfig)
    expect(fs.readFileSync(mockConfig.file).toString()).toEqual("{}")
  })
  it("reads the results from file and stores them", () => {
    // Assumes file is empty and/or no test results have yet been stored against
    // the file specified in config (above).
    logger = new Logger(mockConfig)
    expect(logger.results).toEqual({})
    // Run again, but this time with a file that already exists.
    const cachedFile = mockConfig.file.replace(".json", "-02.json")

    fs.writeFileSync(cachedFile, JSON.stringify(mockResults))
    logger = new Logger({ file: cachedFile })
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
  it("nests them in a name and count key", () => {
    expect(logger.results).toEqual({})
    logger.storeResult(mockResult)
    const storedResult = logger.results.hugo["count-1"][0]
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
    expect(lodash.get(logger, "results.hugo.count-1")).toBeUndefined()
    logger.storeResult(mockResult)
    expect(logger.results.hugo["count-1"].length).toEqual(1)
    const firstResult = logger.results.hugo["count-1"][0]
    logger.storeResult(mockResult)
    expect(logger.results.hugo["count-1"].length).toEqual(2)
    expect(logger.results.hugo["count-1"].includes(firstResult)).toEqual(true)
    logger.storeResult(mockResult)
    expect(logger.results.hugo["count-1"].length).toEqual(3)
    expect(logger.results.hugo["count-1"].includes(firstResult)).toEqual(true)
    logger.storeResult(mockResult)
    expect(logger.results.hugo["count-1"].length).toEqual(3)
  })
  it("includes any passed key-value pairs", () => {
    logger.storeResult({ ...mockResult, foo: "bar" })
    expect(logger.results.hugo["count-1"][0].foo).toEqual("bar")
  })
})

// --- Write File --- //

describe("writeFile()", () => {
  it("writes the results to file", () => {
    logger = new Logger(mockConfig)
    expect(JSON.parse(fs.readFileSync(mockConfig.file))).toEqual({})
    logger.results = mockResults
    logger.writeFile()
    expect(JSON.parse(fs.readFileSync(mockConfig.file))).toEqual(mockResults)
  })
})
