import React from "react"

import SEO, { PageType } from "components/seo/seo"
import { getDeputes, getGroupes } from "lib/deputes/Wrapper"
import DeputiesList from "components/deputies-list/DeputiesList"
import shuffle from "lodash/shuffle"

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
  const [deputes, groupes] = await Promise.all([getDeputes(), getGroupes()])

  return {
    props: {
      deputes: shuffle(deputes),
      groupes,
      title: "Liste des députés",
      PageType: PageType.Deputes,
    },
  }
}
