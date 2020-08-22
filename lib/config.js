const fs = require("fs")
const glob = require("glob")
const lodash = require("lodash")
const { LoremIpsum } = require("lorem-ipsum")
const path = require("path")

const config = require("../test.config")

/**
 * Takes the test config and returns an array of objects representing individual
 * tests to run.
 */
exports.getTests = (cfg = config) => {
  return lodash.flatMap(
    cfg.tests.map(testCfg => {
      return cfg.fileCount.map(count => {
        return {
          config: testCfg,
          count: count
        }
      })
    })
  )
}
