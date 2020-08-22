const fs = require("fs")
const glob = require("glob")
const lodash = require("lodash")
const { LoremIpsum } = require("lorem-ipsum")
const path = require("path")

const config = require("./config")

describe("config", () => {
  it("builds an array of tests to run", () => {
    const testConfig = { fileCount: [1, 100], tests: [{ name: "hugo" }, { name: "jekyll" }] }
    expect(config.getTests(testConfig)).toEqual([
      { count: 1, config: { name: "hugo" } },
      { count: 100, config: { name: "hugo" } },
      { count: 1, config: { name: "jekyll" } },
      { count: 100, config: { name: "jekyll" } }
    ])
  })
})
