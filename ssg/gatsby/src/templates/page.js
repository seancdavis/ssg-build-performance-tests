import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const PageTemplate = ({ data }) => {
  const { page } = data

  return (
    <Layout>
      <h1>{page.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </Layout>
  )
}

export const query = graphql`
  query PageTemplateQuery($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
      }
      html
      fileAbsolutePath
    }
  }
`

export default PageTemplate
