import React from "react"
import Helmet from "react-helmet"

import {
  buildMetaTagsFromPageType,
  buildTitleFromPageType,
  PageType,
} from "./seo-utils"

interface ISEOProps {
  pageType: PageType
  depute?: any
}

function SEO(props: ISEOProps) {
  const meta = buildMetaTagsFromPageType(props.pageType, props.depute)
  const title = buildTitleFromPageType(props.pageType, props.depute)

  return (
    <Helmet
      htmlAttributes={{
        lang: "fr",
      }}
      title={title}
      titleTemplate={`%s | Augora`}
      meta={meta}
    />
  )
}

export default SEO
// Re-export PageType so other components can use it
export { PageType }
