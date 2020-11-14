const path = require("path")

module.exports = {
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

    return config
  },
  onDemandEntries: {
    maxInactiveAge: 30 * 60 * 1000,
    pagesBufferLength: 100,
  },
}
