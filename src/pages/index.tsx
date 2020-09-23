import React from "react"
import Helmet from "react-helmet"

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
      <div className="page page__deputies">
        <h1>Liste des députés</h1>
        <DeputiesList />
      </div>
    </>
  )
}

export default IndexPage
