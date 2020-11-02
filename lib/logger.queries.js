const gql = require("graphql-tag")

exports.GET_DATASET_QUERY = gql`
  query GetDataset($title: String) {
    datasets(where: { title: { _eq: $title } }) {
      id
    }
  }
`

exports.CREATE_DATASET_MUTATION = gql`
  mutation CreateDataset($title: String) {
    dataset: insert_datasets_one(object: { title: $title }) {
      id
    }
  }
`

exports.GET_GENERATORS_QUERY = gql`
  query GetGenerators {
    generators {
      id
      title
    }
  }
`

exports.CREATE_GENERATOR_MUTATION = gql`
  mutation CreateGenerator($title: String) {
    generator: insert_generators_one(object: { title: $title }) {
      id
    }
  }
`

exports.GET_SIMILAR_RESULTS = gql`
  query GetSimilarResults($count: Int!, $generator_id: Int!, $dataset_id: Int!) {
    results(
      where: {
        _and: [
          { count: { _eq: $count } }
          { generator_id: { _eq: $generator_id } }
          { dataset_id: { _eq: $dataset_id } }
        ]
      }
      order_by: { created_at: desc_nulls_last }
    ) {
      id
    }
  }
`

exports.DELETE_RESULTS_BY_ID = gql`
  mutation DeleteResults($ids: [Int!]) {
    delete_results(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`

exports.CREATE_RESULT_MUTATION = gql`
  mutation CreateResult(
    $count: Int!
    $duration: numeric!
    $build_file_count: Int!
    $build_html_file_count: Int!
    $generator_id: Int!
    $dataset_id: Int!
  ) {
    result: insert_results_one(
      object: {
        count: $count
        duration: $duration
        build_file_count: $build_file_count
        build_html_file_count: $build_html_file_count
        generator_id: $generator_id
        dataset_id: $dataset_id
      }
    ) {
      id
    }
  }
`
