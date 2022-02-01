const path = require("path")
const webpack = require("webpack")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer({
  images: {
    domains: ["static.augora.fr"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src", "styles"), path.join(__dirname, "public")],
  },
  staticPageGenerationTimeout: 120,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
        },
      ],
      type: "javascript/auto",
      issuer: {
        and: [/\.(ts|tsx|js)$/],
      },
    }),
      config.module.rules.push({
        test: /\.geojson$/,
        use: [
          {
            loader: "json-loader",
          },
        ],
      })
    return config
  },
  onDemandEntries: {
    maxInactiveAge: 30 * 60 * 1000,
    pagesBufferLength: 100,
  },
  async rewrites() {
    return [
      {
        source: "/carte",
        destination: "/map",
      },
    ]
  },
})
