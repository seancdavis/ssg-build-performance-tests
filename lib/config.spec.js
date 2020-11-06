const lodash = require("lodash")
const path = require("path")

const config = require("./config")

// --- Tests Config --- //

describe("getTestsConfig()", () => {
  it("returns an empty array when no name", () => {
    const testConfig = {
      datasets: { default: [1, 100] },
      tests: [{ name: "hugo" }, { name: "jekyll" }]
    }
    expect(config.getTestsConfig(null, testConfig)).toEqual([])
  })
  it("returns an empty array when no name match", () => {
    const testConfig = {
      datasets: { default: [1, 100] },
      tests: [{ name: "hugo" }, { name: "jekyll" }]
    }
    expect(config.getTestsConfig("wrong", testConfig)).toEqual([])
  })
  it("builds an array of tests to run", () => {
    const testConfig = {
      datasets: { default: [1, 100] },
      tests: [{ name: "hugo" }, { name: "jekyll" }]
    }
    expect(config.getTestsConfig("default", testConfig)).toEqual([
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
    const expResult = {
      generators: [],
      hasura_secret: null,
      hasura_url: null,
      maxHistory: 3
    }
    expect(config.getLoggerConfig({})).toEqual(expResult)
  })
  it("will appropriately set properties based on args", () => {
    const input = {
      log: {
        hasura_secret: "SECRET",
        hasura_url: "URL",
        maxHistory: 10
      },
      tests: [
        {
          name: "eleventy"
        }
      ]
    }
    expect(config.getLoggerConfig(input)).toEqual({
      generators: ["eleventy"],
      hasura_secret: "SECRET",
      hasura_url: "URL",
      maxHistory: 10
    })
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
