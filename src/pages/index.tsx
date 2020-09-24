import React from "react"
import Helmet from "react-helmet"

import DeputiesList from "../components/deputies-list/DeputiesList"
import PageTitle from "../components/titles/PageTitle"

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
        <PageTitle title="Liste des Députés" />
        <DeputiesList />
      </div>
    </>
  )
}

export default IndexPage
