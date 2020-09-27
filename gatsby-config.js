const path = require("path")

const { ApolloLink } = require("apollo-link")
const { HttpLink } = require("apollo-link-http")
const { RetryLink } = require("apollo-link-retry")
const fetch = require("node-fetch")

module.exports = {
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Augora`,
        short_name: `Augora`,
        start_url: `/`,
        background_color: `#11999e`,
        theme_color: `#30e3ca`,
        display: `minimal-ui`,
        icon: `src/images/logos/projet/augora-logo.png`,
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "FaunaDB",
        fieldName: "faunadb",
        batch: true,
        createLink: (pluginOptions) => {
          return ApolloLink.from([
            new RetryLink({
              attempts: (count, operation, error) => {
                console.log("retrying", count, error)
                return !!error && count < 3
              },
            }),
            new ApolloLink((operation, forward) => {
              return forward(operation).map((data) => {
                if (data && data.errors && data.errors.length > 0) {
                  throw new Error("GraphQL Operational Error")
                }
                return data
              })
            }),
            new HttpLink({
              uri: "https://graphql.fauna.com/graphql",
              headers: {
                Authorization: `Bearer ${
                  process.env.FAUNADB_TOKEN ||
                  "fnADtFRXPrACB6WCFPNkcNwEOSCfXW574OOspy5t"
                }`,
              },
              fetch,
            }),
          ])
        },
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        src: path.join(__dirname, "src"),
        pages: path.join(__dirname, "src/pages"),
        utils: path.join(__dirname, "src/utils"),
        images: path.join(__dirname, "src/images"),
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-svg`,
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        google: {
          families: [
            "Open Sans:100,200,300,400,500,600,700,800,900",
            "Roboto Slab:100,200,300,400,500,600,700,800,900",
          ],
        },
        custom: {
          families: ["Augora"],
          urls: ["./font.css"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/layout.js`),
      },
    },
  ],
}
