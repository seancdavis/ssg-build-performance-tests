const lodash = require("lodash")
const path = require("path")

const projectConfig = require("../test.config")

/**
 * Takes the test config and returns an array of objects representing individual
 * tests to run.
 *
 * @param {object} config Configuration object. Defaults to test.config.js at the
 * root of the project, but can be overridden directly.
 */
exports.getTestsConfig = (config = projectConfig) => {
  return lodash.flatMap(
    config.tests.map(testCfg => {
      return config.fileCount.map(count => {
        return {
          config: testCfg,
          count: count
        }
      })
    })
  )
}

/**
 * Resolves the logger config, setting sensible defaults.
 *
 * @param {object} config Configuration object. Defaults to test.config.js at the
 * root of the project, but can be overridden directly.
 */
exports.getLogConfig = (config = projectConfig.log) => {
  // Start with an empty object.
  const output = {}
  // Define default values.
  const defaults = {
    file: path.resolve(__dirname, "../tmp/results.json"),
    maxHistory: 3
  }
  // Set the appropriate key-value pairs
  Object.entries(defaults).map(([name, value]) => {
    output[name] = lodash.get(config, name) || value
  })
  // Return the output object.
  return output
}
