const path = require("path")

module.exports = {
  siteMetadata: {
    title: `Augora`,
    description: ``,
    author: `@Augora`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Augora`,
        short_name: `Augora`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logos/projet/augora-logo.png`,
      },
    },
    {
      resolve: "gatsby-source-graphql-universal",
      options: {
        typeName: "FaunaDB",
        fieldName: "faunadb",
        url: "https://graphql.fauna.com/graphql",
        headers: {
          Authorization: `Bearer ${
            process.env.FAUNADB_TOKEN ||
            "fnADnUGjaLACC37ZGjw9dwMr7cY2AFZn312KFOdW"
          }`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        fileName: `src/types/graphql-types.ts`,
        documentPaths: [
          `./src/**/*.{ts,tsx}`,
          `./node_modules/gatsby-*/**/*.js`,
        ],
        codegen: false,
        codegenDelay: 250,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        src: path.join(__dirname, "src"),
        pages: path.join(__dirname, "src/pages"),
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-svg`,
  ],
}
