import Chart from "chart.js"
import get from "lodash/get"

import resultsData from "../../_data/results"

const results = resultsData()

// ---------------------------------------- | Build Scaling Charts

const smallChartCtx = document.getElementById("results-small-chart").getContext("2d")
const largeChartCtx = document.getElementById("results-large-chart").getContext("2d")

const scalingChartOptions = {
  type: "line",
  options: {
    legend: {
      display: true
    },
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

let smallSitesChart = new Chart(smallChartCtx, {
  ...scalingChartOptions,
  data: {
    labels: get(results, "small.labels") || [],
    datasets: (get(results, "small.data") || []).map(result => ({
      ...result,
      fill: false,
      backgroundColor: result.color,
      borderColor: result.color
    }))
  }
})

let largeSitesChart = new Chart(largeChartCtx, {
  ...scalingChartOptions,
  data: {
    labels: get(results, "large.labels") || [],
    datasets: (get(results, "large.data") || []).map(result => ({
      ...result,
      fill: false,
      backgroundColor: result.color,
      borderColor: result.color
    }))
  }
})

// ---------------------------------------- | Base Bar Chart

var baseChartCtx = document.getElementById("results-base-chart").getContext("2d")

let baseScalingChart = new Chart(baseChartCtx, {
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
    labels: (get(results, "base.data") || []).map(({ label }) => label),
    datasets: [
      {
        label: "Build Time (s)",
        data: (get(results, "base.data") || []).map(result => result.data[0]),
        backgroundColor: (get(results, "base.data") || []).map(({ color }) => color)
      }
    ]
  }
})

// ---------------------------------------- | Chart Controls

// const getAll

const filterDatasets = filter => {
  let baseData, smallData, largeData

  switch (filter) {
    case "all":
      baseData = get(results, "base.data") || []
      smallData = get(results, "small.data") || []
      largeData = get(results, "large.data") || []
      break
    case "framework":
      baseData = (get(results, "base.data") || []).filter(({ framework }) => framework)
      smallData = (get(results, "small.data") || []).filter(({ framework }) => framework)
      largeData = (get(results, "large.data") || []).filter(({ framework }) => framework)
      break
    case "non-framework":
      baseData = (get(results, "base.data") || []).filter(({ framework }) => !framework)
      smallData = (get(results, "small.data") || []).filter(({ framework }) => !framework)
      largeData = (get(results, "large.data") || []).filter(({ framework }) => !framework)
      break
  }

  // Update base chart.
  baseScalingChart.data.labels = baseData.map(({ label }) => label)
  baseScalingChart.data.datasets[0] = {
    label: "Build Time (s)",
    data: baseData.map(result => result.data[0]),
    backgroundColor: baseData.map(({ color }) => color)
  }
  baseScalingChart.update()

  // Update small chart.
  smallSitesChart.data.datasets = smallData.map(result => ({
    ...result,
    fill: false,
    backgroundColor: result.color,
    borderColor: result.color
  }))
  smallSitesChart.update()

  // Update large chart.
  largeSitesChart.data.datasets = largeData.map(result => ({
    ...result,
    fill: false,
    backgroundColor: result.color,
    borderColor: result.color
  }))
  largeSitesChart.update()
}

// ---------------------------------------- | Exports

export { filterDatasets }
