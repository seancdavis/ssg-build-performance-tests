const find = require("lodash/find")
const flatMap = require("lodash/flatMap")
const mean = require("lodash/mean")
const uniq = require("lodash/uniq")
const startsWith = require("lodash/startsWith")

const testConfig = require("../../test.config")
const results = require("../results.json")

/**
 * Extract the appropriate color for the given test result from test.config.js
 *
 * @param {string} name Name of the test specified in config file.
 */
const getColor = name => {
  const cfg = find(testConfig.tests, test => test.name === name)
  return typeof cfg === "object" ? cfg.color : null
}

/**
 * Extract the labels from the results array as the count of the run. This will
 * pick up any unique count for a given type of build found among all results.
 *
 * @param {string} prefix The prefix for the logged result objects.
 */
const extractCounts = (prefix = "count") => {
  return uniq(
    flatMap(
      Object.values(results).map(tests =>
        Object.keys(tests)
          .filter(key => startsWith(key, prefix))
          .map(key => parseInt(key.replace(`${prefix}-`, "")))
      )
    )
  )
}

/**
 * Extract averages of test results to line up with a set of extracted labels.
 * If results are missing for a given test and count, the average is sent as
 * zero.
 *
 * @param {string} prefix The prefix for the logged result objects.
 */
const extractResults = (labels, prefix = "count") => {
  return Object.entries(results).map(([name, tests]) => {
    const testResults = labels.map(count => {
      const countResults = tests[`${prefix}-${count}`]
      if (!countResults || !countResults.length) return 0
      const avgResult = mean(countResults.map(({ duration }) => duration))
      return parseFloat(avgResult).toFixed(2)
    })
    return {
      label: name,
      color: getColor(name),
      data: testResults
    }
  })
}

module.exports = () => {
  const defaultLabels = extractCounts()
  const defaultDatasets = extractResults(defaultLabels)

  const incrementalLabels = extractCounts("incremental")
  const incrementalDatasets = extractResults(incrementalLabels, "incremental")

  return {
    default: {
      data: defaultDatasets,
      labels: defaultLabels
    },
    incremental: {
      data: incrementalDatasets,
      labels: incrementalLabels
    }
  }
}
