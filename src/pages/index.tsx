import React from "react"
import shuffle from "lodash/shuffle"

import SEO, { PageType } from "../components/seo/seo"
import { getDeputes, getGroupes } from "../lib/deputes/Wrapper"
import DeputiesList from "../components/deputies-list/DeputiesList"

export default function IndexPage() {
  return (
    <>
      <SEO pageType={PageType.Accueil} />
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
    },
  }
}
