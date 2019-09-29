const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

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
      augora {
        Deputes {
          slug
        }
      }
    }
  `)
  result.data.augora.Deputes.forEach(deputy => {
    createPage({
      path: `/deputy/${deputy.slug}`,
      component: path.resolve(`./src/templates/Deputy.tsx`),
      context: {
        slug: deputy.slug,
      },
    })
  })
}
