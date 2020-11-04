const fs = require("fs")
const path = require("path")
const gql = require("graphql-tag")
const lodash = require("lodash")

const Database = require("./database")
const { getLoggerConfig } = require("./config")

const config = getLoggerConfig()

const resultsFile = path.join(__dirname, "../src/results.json")

const db = new Database({
  hasura_secret: config.hasura_secret,
  hasura_url: config.hasura_url
})

const GET_RESULTS_QUERY = gql`
  query GetResultsQuery {
    results(where: { count: { _neq: 0 } }) {
      build_file_count
      build_html_file_count
      count
      created_at
      dataset {
        title
      }
      duration
      generator {
        title
      }
    }
  }
`

const run = async () => {
  // Retrieve data from the database.
  const data = await db.request(GET_RESULTS_QUERY)

  // Add a count key to each item, which will be used to group the items.
  let resultData = [...data.results].map(result => ({
    ...result,
    countKey: `count-${result.count}`
  }))

  // Group the results by the name of the dataset.
  let results = lodash.groupBy(resultData, "dataset.title")

  // Group results within each dataset, first by generator name.
  Object.entries(results).map(([dataset, values]) => {
    results[dataset] = lodash.groupBy(values, "generator.title")
    // Then by count key.
    Object.entries(results[dataset]).map(([generator, values]) => {
      results[dataset][generator] = lodash.groupBy(values, "countKey")
    })
  })

  // Write the results to src/results.json.
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2))
}

run()
