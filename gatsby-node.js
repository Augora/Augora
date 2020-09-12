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

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    FaunaDB_Depute: {
      Ordre: {
        type: "Int",
        resolve: (source, args, context) => {
          return Math.floor(Math.random() * 5000)
        },
      },
    },
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query DeputesQuery {
      faunadb {
        DeputesEnMandat(EstEnMandat: true, _size: 700) {
          data {
            Slug
          }
        }
      }
    }
  `)
  result.data.faunadb.DeputesEnMandat.data.forEach((deputy) => {
    createPage({
      path: `/depute/${deputy.Slug}`,
      component: path.resolve(`./src/templates/deputy/deputy.tsx`),
      context: {
        slug: deputy.Slug,
      },
    })
  })
}
