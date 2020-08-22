const path = require("path")

const config = require("./config")

describe("getTestsConfig()", () => {
  it("builds an array of tests to run", () => {
    const testConfig = { fileCount: [1, 100], tests: [{ name: "hugo" }, { name: "jekyll" }] }
    expect(config.getTestsConfig(testConfig)).toEqual([
      { count: 1, config: { name: "hugo" } },
      { count: 100, config: { name: "hugo" } },
      { count: 1, config: { name: "jekyll" } },
      { count: 100, config: { name: "jekyll" } }
    ])
  })
})

describe("getLogConfig()", () => {
  it("has proper defaults", () => {
    const defaultFilePath = path.resolve(__dirname, "../tmp/results.json")
    expect(config.getLogConfig()).toEqual({ file: defaultFilePath, maxHistory: 3 })
  })
  it("will appropriately set properties based on args", () => {
    const mockConfig = {
      file: path.resolve(__dirname, `tmp/${new Date().getTime()}.json`),
      maxHistory: 5
    }
    expect(config.getLogConfig(mockConfig)).toEqual(mockConfig)
  })
})
