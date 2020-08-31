import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import { sortBy } from "lodash"

import DeputiesList from "../components/deputies-list/DeputiesList"

const IndexPage = ({ data }) => {
  const groupesDetails = sortBy(
    data.faunadb.GroupesParlementairesDetailsActifs.data,
    ["Ordre"]
  )
  const deputies = sortBy(data.faunadb.DeputesEnMandat.data, ["Ordre"])
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
        <DeputiesList deputes={deputies} groupesDetails={groupesDetails} />
      </div>
    </>
  )
}

export default IndexPage

export const query = graphql`
  query DeputesQuery {
    faunadb {
      DeputesEnMandat(EstEnMandat: true, _size: 700) {
        data {
          LieuDeNaissance
          DebutDuMandat
          GroupeParlementaire {
            Couleur
            Sigle
            NomComplet
          }
          Nom
          NomCirconscription
          NomDeFamille
          NombreMandats
          NumeroCirconscription
          NumeroDepartement
          parti_ratt_financier
          PlaceEnHemicycle
          Prenom
          Profession
          Sexe
          Slug
          Twitter
          DateDeNaissance
          Age
          Collaborateurs
          Emails
          SitesWeb
          URLPhotoAugora
          Ordre
        }
      }
      GroupesParlementairesDetailsActifs(Actif: true) {
        data {
          Couleur
          Sigle
          Ordre
          NomComplet
        }
      }
    }
  }
`
