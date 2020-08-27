import Chart from "chart.js"

import resultsData from "../../_data/results"

const results = resultsData()

// ---------------------------------------- | Main Chart

const resultsCtx = document.getElementById("results-chart").getContext("2d")

const resultsChart = new Chart(resultsCtx, {
  type: "line",
  data: {
    labels: results.default.labels,
    datasets: results.default.data.map(result => ({
      ...result,
      fill: false,
      backgroundColor: result.color,
      borderColor: result.color
    }))
  }
})

// ---------------------------------------- | Incremental Chart

const incrementalCtx = document.getElementById("incremental-chart").getContext("2d")

const incrementalChart = new Chart(incrementalCtx, {
  type: "line",
  data: {
    labels: results.incremental.labels,
    datasets: results.incremental.data.map(result => ({
      ...result,
      fill: false,
      backgroundColor: result.color,
      borderColor: result.color
    }))
  }
})

// ---------------------------------------- | Runs with 1 File

var resultsSingleFile = document.getElementById("results-single-file").getContext("2d")

const resultsSingleFileChart = new Chart(resultsSingleFile, {
  type: "bar",
  options: {
    legend: {
      display: false
    }
  },
  data: {
    labels: results.default.data.map(({ label }) => label),
    datasets: [
      {
        label: "Build Time (s)",
        data: results.default.data.map(result => result.data[0]),
        backgroundColor: results.default.data.map(({ color }) => color)
      }
    ]
  }
})
