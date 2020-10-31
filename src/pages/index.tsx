import React from "react"
import SEO, { PageType } from "components/seo/seo"

import DeputiesList from "../components/deputies-list/DeputiesList"
import PageTitle from "../components/titles/PageTitle"

const IndexPage = () => {
  return (
    <>
      <SEO pageType={PageType.Accueil} />
      <div className="page page__deputies">
        <PageTitle title="Liste des Députés" />
        <DeputiesList />
      </div>
    </>
  )
}

export default IndexPage
