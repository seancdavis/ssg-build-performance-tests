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
exports.getTestsConfig = (name, config = projectConfig) => {
  const fileCount = lodash.get(config, `datasets.${name}`)

  if (!name || !fileCount) {
    return []
  }

  return lodash.flatMap(
    config.tests.map(testCfg => {
      return fileCount.map(count => {
        return {
          ...testCfg,
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
exports.getLoggerConfig = (config = projectConfig.log) => {
  // Start with an empty object.
  const output = {}
  // Define default values.
  const defaults = {
    file: path.resolve(__dirname, "../src/results.json"),
    maxHistory: 3
  }
  // Set the appropriate key-value pairs
  Object.entries(defaults).map(([name, value]) => {
    output[name] = lodash.get(config, name) || value
  })
  // Return the output object.
  return output
}

/**
 * Validate builder config.
 *
 * @param {object} config Configuration for one specific build (i.e. Builder instance).
 */
exports.getBuilderConfig = (config = {}) => {
  // Validate config type.
  if (typeof config !== "object") throw "Config must be an object."
  // Validate required keys.
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
    if (!lodash.get(config, key)) throw `Missing required config key: ${key}`
  })
  // Return valid config object.
  return config
}
