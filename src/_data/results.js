const find = require("lodash/find")
const flatMap = require("lodash/flatMap")
const mean = require("lodash/mean")
const uniq = require("lodash/uniq")

const testConfig = require("../../test.config")
const results = require("../../tmp/results.json")

/**
 * Extract the appropriate color for the given test result from test.config.js
 *
 * @param {string} name Name of the test specified in config file.
 */
const getColor = name => {
  const cfg = find(testConfig.tests, test => test.name === name)
  return typeof cfg === "object" ? cfg.color : null
}

module.exports = () => {
  // Extract the labels from the results array as the count of the run. This
  // will pick up any unique count found among all results.
  const labels = uniq(
    flatMap(
      Object.values(results).map(tests =>
        Object.keys(tests).map(key => parseInt(key.replace("count-", "")))
      )
    )
  )

  // Extract averages of test results to line up with the labels from above. If
  // results are missing for a given test and count, the average is sent as
  // zero.
  const datasets = Object.entries(results).map(([name, tests]) => {
    const testResults = labels.map(count => {
      const countResults = tests[`count-${count}`]
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

  return {
    data: datasets,
    labels: labels
  }
}
