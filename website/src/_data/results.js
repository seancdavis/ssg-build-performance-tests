const find = require("lodash/find")
const flatMap = require("lodash/flatMap")
const mean = require("lodash/mean")
const uniq = require("lodash/uniq")

const testConfig = require("../../../test.config")
const results = require("../results.json")

/**
 * Extract the appropriate details for the given test result from test.config.js
 *
 * @param {string} name Name of the test specified in config file.
 */
const getDetails = name => {
  const cfg = find(testConfig.tests, test => test.name === name)

  if (typeof cfg !== "object") return {}

  return {
    color: cfg.color,
    framework: cfg.framework,
    version: cfg.version
  }
}

module.exports = () => {
  // Object that will be returned.
  let output = {}

  // Loop through each dataset and extract labels and data.
  Object.entries(results).map(([name, dataset]) => {
    // Extract the labels from the results array as the count of the run. This
    // will pick up any unique count found among all results.
    const labels = uniq(
      flatMap(
        Object.values(dataset).map(tests =>
          Object.keys(tests).map(key => parseInt(key.replace("count-", "")))
        )
      )
    )

    // Extract averages of test results to line up with the labels from above. If
    // results are missing for a given test and count, the average is sent as
    // zero.
    const data = Object.entries(dataset).map(([name, tests]) => {
      const testResults = labels.map(count => {
        const countResults = tests[`count-${count}`]
        if (!countResults || !countResults.length) return 0
        const avgResult = mean(countResults.map(({ duration }) => duration))
        return parseFloat(avgResult).toFixed(2)
      })
      return {
        ...getDetails(name),
        label: name,
        data: testResults
      }
    })

    output[name] = {
      data: data,
      labels: labels
    }
  })

  return output
}
