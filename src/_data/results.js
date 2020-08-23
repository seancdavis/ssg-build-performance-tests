const flatMap = require("lodash/flatMap")
const mean = require("lodash/mean")
const uniq = require("lodash/uniq")

const results = require("../../tmp/results.json")

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
      data: testResults
    }
  })

  return {
    data: datasets,
    labels: labels
  }
}
