const lodash = require("lodash")
const path = require("path")

const config = require("./config")

// --- Tests Config --- //

describe("getTestsConfig()", () => {
  it("builds an array of tests to run", () => {
    const testConfig = { fileCount: [1, 100], tests: [{ name: "hugo" }, { name: "jekyll" }] }
    expect(config.getTestsConfig(testConfig)).toEqual([
      { count: 1, name: "hugo" },
      { count: 100, name: "hugo" },
      { count: 1, name: "jekyll" },
      { count: 100, name: "jekyll" }
    ])
  })
})

// --- Logger Config --- //

describe("getLoggerConfig()", () => {
  it("has proper defaults", () => {
    const defaultFilePath = path.resolve(__dirname, "../tmp/results.json")
    expect(config.getLoggerConfig()).toEqual({ file: defaultFilePath, maxHistory: 3 })
  })
  it("will appropriately set properties based on args", () => {
    const mockConfig = {
      file: path.resolve(__dirname, `tmp/${new Date().getTime()}.json`),
      maxHistory: 5
    }
    expect(config.getLoggerConfig(mockConfig)).toEqual(mockConfig)
  })
})

// --- Builder Config --- //

describe("getBuilderConfig()", () => {
  const mockConfig = {
    name: "hugo",
    count: 1,
    paths: {
      build: path.join(__dirname, "tmp/__build__/public"),
      content: path.join(__dirname, "tmp/__build__/content"),
      root: path.join(__dirname, "tmp/__build__")
    },
    commands: {
      clean: "rm -rf public",
      build: "mkdir public && touch public/index.html && touch public/sitemap.xml"
    }
  }

  it("returns the config for valid config objects", () => {
    expect(() => {
      config.getBuilderConfig(mockConfig)
    }).not.toThrow()
  })
  it("throws an error if the config is invalid", () => {
    expect(() => config.getBuilderConfig()).toThrow()
    const requiredKeys = [
      "name",
      "count",
      "paths.root",
      "paths.build",
      "paths.content",
      "commands.clean",
      "commands.build"
    ]
    requiredKeys.map(key => {
      const cfg = { ...mockConfig }
      lodash.set(cfg, key, undefined)
      expect(() => config.getBuilderConfig(cfg)).toThrow()
    })
  })
})
