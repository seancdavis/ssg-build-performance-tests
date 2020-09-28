import Chart from "chart.js"

import resultsData from "../../_data/results"

const results = resultsData()

// ---------------------------------------- | Build Scaling Charts

const smallChartCtx = document.getElementById("results-small-chart").getContext("2d")

const scalingChartOptions = {
  type: "line",
  options: {
    tooltips: {
      enabled: false
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Number of Files"
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Build Time"
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  }
}

const smallSitesChart = new Chart(smallChartCtx, {
  ...scalingChartOptions,
  data: {
    labels: results.small.labels,
    datasets: results.small.data.map(result => ({
      ...result,
      fill: false,
      backgroundColor: result.color,
      borderColor: result.color
    }))
  }
})

// ---------------------------------------- | Base Bar Chart

var resultsSingleFile = document.getElementById("results-base-chart").getContext("2d")

const resultsSingleFileChart = new Chart(resultsSingleFile, {
  type: "bar",
  options: {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Static Site Generator"
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Build Time"
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  },
  data: {
    labels: results.base.data.map(({ label }) => label),
    datasets: [
      {
        label: "Build Time (s)",
        data: results.base.data.map(result => result.data[0]),
        backgroundColor: results.base.data.map(({ color }) => color)
      }
    ]
  }
})
