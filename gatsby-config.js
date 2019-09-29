var targetEnv = process.env.TARGET_ENV || 'sandbox';
var targetAPIUrl = targetEnv === 'sandbox' ? 'sandbox.augora.fr' : 'api.augora.fr';

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
        icon: `src/images/Logos/Projet/lbp-logo.png`,
      },
    },
    {
      resolve: "gatsby-source-graphql-universal",
      options: {
        typeName: "DeputesEnMandat",
        fieldName: "augora",
        url: "https://" + targetAPIUrl + "/Handler/graphql.go",
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
  ],
}
