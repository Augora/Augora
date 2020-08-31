import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import _ from "lodash"

import DeputiesList from "../components/deputies-list/DeputiesList"

const IndexPage = () => {
  return (
    <>
      <Helmet>
        {process.env.GATSBY_TARGET_ENV !== "production" ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : null}
        <title>Liste des députés | Augora</title>
      </Helmet>
      <header className="header">
        <h1 style={{ textAlign: "center" }}>Liste des députés</h1>
      </header>
      <div>
        <DeputiesList />
      </div>
    </>
  )
}

export default IndexPage
