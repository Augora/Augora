import React from "react"

import SEO, { PageType } from "../components/seo/seo"

export default function NotFoundPage() {
  return (
    <>
      <SEO pageType={PageType.NotFound} />
      <div className="page__404">
        <h1>404</h1>
        <p>Not found</p>
      </div>
    </>
  )
}
