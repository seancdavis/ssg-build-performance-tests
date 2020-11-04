const lodash = require("lodash")

const { getLoggerConfig } = require("./config")

const Database = require("./database")
const {
  CREATE_DATASET_MUTATION,
  CREATE_GENERATOR_MUTATION,
  CREATE_RESULT_MUTATION,
  GET_DATASET_QUERY,
  GET_GENERATORS_QUERY,
  GET_SIMILAR_RESULTS,
  DELETE_RESULTS_BY_ID
} = require("./logger.queries")

module.exports = class Logger {
  /**
   * Initialize the class.
   *
   * @param {string} dataset The name of the dataset, which acts as the
   * top-level key under which to store the results.
   * @param {object} config Configuration object (see subsequent params).
   * @param {string} config.file Path to the file where the results should be
   * read and logged.
   * @param {number} config.maxHistory The number of runs to store for each
   * unique test (where SSG and count match).
   */
  constructor(dataset, config) {
    if (typeof dataset !== "string" || !dataset) throw new Error("dataset not specified.")
    this.dataset = dataset
    this.config = getLoggerConfig(config)
    this.db = new Database({
      hasura_secret: this.config.hasura_secret,
      hasura_url: this.config.hasura_url
    })
  }

  /**
   * Find or create the dataset object from the database, and store the ID in
   * memory.
   */
  async initDataset() {
    const { datasets } = await this.db.request(GET_DATASET_QUERY, { title: this.dataset })
    this.datasetId = lodash.get(datasets, "[0].id")
    // If the dataset doesn't exist, create it.
    if (!this.datasetId) {
      const { dataset } = await this.db.request(CREATE_DATASET_MUTATION, { title: this.dataset })
      this.datasetId = dataset.id
    }
  }

  /**
   * Find or create the generator objects in the database.
   */
  async initGenerators() {
    // Object generator names and IDs for the rest of the class to store, as: { name: ID }
    this.generators = {}
    // Retrieve existing generators from the db.
    const { generators } = await this.db.request(GET_GENERATORS_QUERY)
    // This is the function that runs inside the map of generator names from the
    // project config. It sets a generator name/ID in this.generators by either
    // pulling from the original db result, or by creating a new record when it
    // couldn't find an existing generator.
    const setOrCreateGenerator = async name => {
      // Find a match from the db result and extract the ID.
      const match = lodash.find(generators, g => g.title === name)
      let id = lodash.get(match, "id")
      // If the ID doesn't exist (i.e. there was no match), create a new record,
      // and store its ID.
      if (!id) {
        const { generator } = await this.db.request(CREATE_GENERATOR_MUTATION, { title: name })
        id = generator.id
      }
      // Set the appropriate key/value pair in this.generators.
      return (this.generators[name] = id)
    }
    // Run the map loop, waiting for all to finish before returning from this
    // function.
    let generatorMapFunctions = []
    this.config.generators.map(name => {
      generatorMapFunctions.push(setOrCreateGenerator(name))
    })
    await Promise.all(generatorMapFunctions)
    // Return the generators reference.
    return this.generators
  }

  /**
   * Add a new result to the results object.
   *
   * @param {object} result The result object to store.
   * @param {string} result.name The name of the test. Required.
   * @param {number} result.count The number of files tested. Required.
   */
  async storeResult({ name, ...data }) {
    // Require name and count.
    const count = lodash.get(data, "count")
    if (!name || (!count && count !== 0)) {
      throw "Name and count required to store result."
    }
    // Require an existing generator with an ID.
    const generatorId = this.generators[name]
    if (!generatorId) {
      throw "Could not find matching generator to store with result."
    }
    // Set the object to be sent to Hasura as a data object.
    data = {
      ...data,
      generator_id: generatorId,
      dataset_id: this.datasetId
    }

    // If there are more than the max similar results, delete the old ones
    const { results: similarResults } = await this.db.request(GET_SIMILAR_RESULTS, {
      count: data.count,
      generator_id: data.generator_id,
      dataset_id: data.dataset_id
    })
    const deleteIds = similarResults.slice(this.config.maxHistory - 1).map(r => r.id)
    if (deleteIds.length > 0) {
      await this.db.request(DELETE_RESULTS_BY_ID, { ids: deleteIds })
    }

    // Create the result in the database.
    const { result } = await this.db.request(CREATE_RESULT_MUTATION, data)
    return result
  }
}
