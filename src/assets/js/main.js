import Chart from "chart.js"

import resultsData from "../../_data/results"

const results = resultsData()

// ---------------------------------------- | Main Chart

const resultsCtx = document.getElementById("results-chart").getContext("2d")

const resultsChart = new Chart(resultsCtx, {
  type: "line",
  data: {
    labels: results.labels,
    datasets: results.data.map(result => ({
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
    labels: results.data.map(({ label }) => label),
    datasets: [
      {
        label: "Build Time (s)",
        data: results.data.map(result => result.data[0]),
        backgroundColor: results.data.map(({ color }) => color)
      }
    ]
  }
})
