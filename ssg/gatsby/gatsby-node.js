const path = require("path")

exports.createPages = ({ graphql, actions }) => {
  return graphql(`
    {
      pages: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "//src/content//" } }
      ) {
        edges {
          node {
            id
            fileAbsolutePath
          }
        }
      }
    }
  `).then(results => {
    const template = path.resolve(__dirname, "./src/templates/page.js")

    results.data.pages.edges.map(({ node: page }) => {
      actions.createPage({
        path: `/pages/${path.basename(
          page.fileAbsolutePath,
          path.extname(page.fileAbsolutePath)
        )}`,
        component: template,
        context: {
          id: page.id,
        },
      })
    })
  })
}
