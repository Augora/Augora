const path = require('path')

module.exports = {
  siteMetadata: {
    title: `Augora`,
    description: ``,
    author: `@gatsbyjs`,
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
        icon: `src/images/Logos/Projet/augora-logo.png`,
      },
    },
    {
      resolve: "gatsby-source-graphql-universal",
      options: {
        typeName: "FaunaDB",
        fieldName: "faunadb",
        url: "https://graphql.fauna.com/graphql",
        headers: {
          Authorization: `bearer ${process.env.FAUNADB_TOKEN || 'fnADfAgsI8ACAjFeHAg7T_nVrlqW7QjG85fB_K6Q'}`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        fileName: `types/graphql-types.ts`,
        codegen: true,
        codegenDelay: 250,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        src: path.join(__dirname, 'src'),
        pages: path.join(__dirname, 'src/pages')
      }
    }
  ],
}
