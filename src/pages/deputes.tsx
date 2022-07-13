import React from "react"

import SEO, { PageType } from "../components/seo/seo"
import { getDeputes } from "../lib/deputes/Wrapper"
import DeputiesList from "../components/deputies-list/DeputiesList"

export default function DeputesPage() {
  return (
    <>
      <SEO pageType={PageType.Deputes} />
      <div className="page page__deputies">
        <DeputiesList />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const deputes = await getDeputes()

  return {
    props: {
      deputes,
      title: "Liste des députés",
      PageType: PageType.Deputes,
    },
  }
}
