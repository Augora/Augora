const path = require("path")
const withSourceMaps = require("@zeit/next-source-maps")
const webpack = require("webpack")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withSourceMaps(
  withBundleAnalyzer({
    images: {
      domains: ["static.augora.fr"],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, "src", "styles"), path.join(__dirname, "public")],
    },
    webpack(config, { isServer }) {
      // if (isServer && process.env.NEXT_PUBLIC_ENV === "production") {
      //   require("./src/scripts/generate-sitemap")
      // }

      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ["@svgr/webpack"],
      })

      // ignore locals for moment
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
      // load only fr local for moment
      config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/))

      return config
    },
  })
)
