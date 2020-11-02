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
