import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/app.scss"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="page__404">
      <h1>404</h1>
      <p>Not found</p>
    </div>
  </Layout>
)

export default NotFoundPage
