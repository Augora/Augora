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
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ["@svgr/webpack"],
      })
      config.module.rules.push({
        test: /\.geojson$/,
        loader: "json-loader",
      })

      return config
    },
    onDemandEntries: {
      maxInactiveAge: 30 * 60 * 1000,
      pagesBufferLength: 100,
    },
  })
)
