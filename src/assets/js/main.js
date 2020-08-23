import Chart from "chart.js"
import flatMap from "lodash/flatMap"
import get from "lodash/get"
import uniq from "lodash/uniq"
import mean from "lodash/mean"

import results from "../../../tmp/results.json"

var oneFileCtx = document.getElementById("with-one-file").getContext("2d")

const labels = Object.keys(results)
const withOneFile = labels.map(name => {
  const scores = get(results, `${name}.count-1`).map(({ duration }) => duration)
  return mean(scores)
})

// console.log(results)
// console.log(withOneFile)

const oneFileChart = new Chart(oneFileCtx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Seconds",
        data: withOneFile
        // backgroundColor: [
        //   "rgba(255, 99, 132, 0.2)",
        //   "rgba(54, 162, 235, 0.2)",
        //   "rgba(255, 206, 86, 0.2)",
        //   "rgba(75, 192, 192, 0.2)",
        //   "rgba(153, 102, 255, 0.2)",
        //   "rgba(255, 159, 64, 0.2)"
        // ],
        // borderColor: [
        //   "rgba(255, 99, 132, 1)",
        //   "rgba(54, 162, 235, 1)",
        //   "rgba(255, 206, 86, 1)",
        //   "rgba(75, 192, 192, 1)",
        //   "rgba(153, 102, 255, 1)",
        //   "rgba(255, 159, 64, 1)"
        // ],
        // borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
})

console.log(results)
const alllabels = uniq(
  flatMap(
    Object.values(results).map(tests =>
      Object.keys(tests).map(key => parseInt(key.replace("count-", "")))
    )
  )
)

const datasets = Object.entries(results).map(([name, tests]) => {
  const testResults = alllabels.map(count => {
    const countResults = tests[`count-${count}`]
    return countResults ? mean(countResults.map(({ duration }) => duration)) : [0]
  })
  return {
    label: name,
    fill: false,
    data: testResults
  }
})

console.log(datasets)

var allCtx = document.getElementById("multiple-builds").getContext("2d")

const allChart = new Chart(allCtx, {
  type: "line",
  data: {
    labels: alllabels,
    datasets: datasets
  }
})
