const isProduction = process.env.NEXT_PUBLIC_ENV === "production"

module.exports = {
  siteUrl: isProduction ? "https://augora.fr" : "https://preprod.augora.fr",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      isProduction
        ? {
            userAgent: "*",
            allow: "/",
          }
        : {
            userAgent: "*",
            disallow: "/",
          },
    ],
  },
}
