/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Helmet from "react-helmet"

function SEO({ description, lang, meta, title }) {
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | Augora`}
      meta={[
        {
          name: `description`,
          content: "Augora - Clearer every day",
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: "Augora - Clearer every day",
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: "Augora",
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: "Augora - Clearer every day",
        },
      ].concat(meta)}
    />
  )
}

export default SEO
