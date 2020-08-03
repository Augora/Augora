const path = require("path")
console.log(require.resolve(`./src/components/layout.js`))

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
        url: "https://graphql.fauna.com/graphql",
        batch: true,
        headers: {
          Authorization: `Bearer ${
            process.env.FAUNADB_TOKEN ||
            "fnADtFRXPrACB6WCFPNkcNwEOSCfXW574OOspy5t"
          }`,
        },
      },
    },
    `gatsby-plugin-styled-components`,
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
