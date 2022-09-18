import React from "react"
import Head from "next/head"

import { buildMetaTagsFromPageType, buildTitleFromPageType, PageType } from "./seo-utils"

interface ISEOProps {
  pageType: PageType
  depute?: Deputy.Deputy
  title?: string
}

function SEO(props: ISEOProps) {
  const meta = buildMetaTagsFromPageType(props.pageType, props.depute)
  const title = props.title ? props.title : buildTitleFromPageType(props.pageType, props.depute)

  return (
    <Head>
      <title>{`${title} | Augora`}</title>
      {meta}
    </Head>
  )
}

export default SEO
// Re-export PageType so other components can use it
export { PageType }
