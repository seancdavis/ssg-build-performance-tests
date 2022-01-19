const { print } = require("graphql")
const fetch = require("node-fetch")

module.exports = class Database {
  constructor({ hasura_secret, hasura_url }) {
    this.hasura_secret = hasura_secret
    this.hasura_url = hasura_url
  }

  /**
   * Makes a request to the remote database through Hasura.
   *
   * @param {object} query GraphQL query object from graphql-tag lib.
   * @param {object} variables An object of variables to pass alongside the query.
   */
  async request(query, variables = {}) {
    const response = await fetch(this.hasura_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": this.hasura_secret,
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: print(query),
        variables: variables
      })
    })
    const { data } = await response.json()
    return data
  }
}
