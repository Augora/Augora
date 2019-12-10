const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mapbox-gl/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query DeputesQuery {
      faunadb {
        Deputes(_size: 700) {
          data {
            Slug
          }
        }
      }
    }
  `)
  result.data.faunadb.Deputes.data.forEach(deputy => {
    createPage({
      path: `/deputy/${deputy.Slug}`,
      component: path.resolve(`./src/templates/Deputy.tsx`),
      context: {
        slug: deputy.Slug,
      },
    })
  })
}
