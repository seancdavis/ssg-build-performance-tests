const fs = require("fs")
const lodash = require("lodash")
const path = require("path")

const { getLogConfig } = require("./config")

module.exports = class Logger {
  /**
   * Initialize the class.
   *
   * @param {object} config Configuration object (see subsequent params).
   * @param {string} config.file Path to the file where the results should be
   * read and logged.
   * @param {number} config.maxHistory The number of runs to store for each
   * unique test (where SSG and count match).
   */
  constructor(config = {}) {
    this.config = getLogConfig(config)
    this.initFile()
    this.initResults()
  }

  /**
   * Create log file with an empty JSON object if it doesn't already exist.
   */
  initFile() {
    if (fs.existsSync(this.config.file)) return
    fs.mkdirSync(path.dirname(this.config.file), { recursive: true })
    fs.writeFileSync(this.config.file, JSON.stringify({}))
  }

  /**
   * Reads the cached log file and sets the results object.
   */
  initResults() {
    const content = fs.readFileSync(this.config.file)
    this.results = JSON.parse(content.toString())
  }

  /**
   * Generates an integer timestamp to use as an ID for individual test results.
   */
  generateTimestamp() {
    return new Date().getTime()
  }

  /**
   * Add a new result to the results object.
   *
   * @param {object} result The result object to store.
   * @param {string} result.name The name of the test. Required.
   * @param {number} result.count The number of files tested. Required.
   */
  storeResult(result = {}) {
    // Require name and count.
    if (!lodash.get(result, "name") || !lodash.get(result, "count")) {
      throw "Name and count required."
    }
    // The key within the name.
    const storeKey = `${result.name}.count-${result.count}`
    // The number of results to store for this particular group.
    const keepCount = this.config.maxHistory - 1
    // Retrieve the most recent results for this group, leaving room for the new
    // result without exceeding the max.
    const resultsGroup = (lodash.get(this.results, storeKey) || []).slice(-keepCount)
    // Add the new result to the group.
    resultsGroup.push({ ...result, timestamp: this.generateTimestamp() })
    // Store it in the overall results object.
    lodash.set(this.results, storeKey, resultsGroup)
  }

  /**
   * Writes the results to file.
   */
  writeFile() {
    fs.writeFileSync(this.config.file, JSON.stringify(this.results, null, 2))
  }
}
