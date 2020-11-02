const { print } = require("graphql")
const fetch = require("node-fetch")
const gql = require("graphql-tag")

const query = gql`
  # mutation InsertGenerator($title: String!) {
  #   insert_generators_one(object: { title: $title }) {
  #     id
  #     title
  #   }
  # }
  query GetDataset($title: String) {
    datasets(where: { title: { _eq: $title } }) {
      id
    }
  }
`

async function go() {
  const response = await fetch("https://ssg-build-performance-tests.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_SECRET,
      Accept: "application/json"
    },
    body: JSON.stringify({
      query: print(query),
      variables: { title: Date.now().toString() }
    })
  })
  const { data } = await response.json()
  console.log(data)
}

go()
