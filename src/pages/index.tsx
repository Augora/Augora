import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import Layout from "components/layout"

import DeputiesList from "../components/deputies-list/DeputiesList"

const IndexPage = ({ data }) => {
  const orderedGroupes = data.faunadb.GroupesParlementairesDetailsActifs.data.sort(
    (a, b) => a.Ordre - b.Ordre
  )
  return (
    <Layout>
      <Helmet>
        {process.env.GATSBY_TARGET_ENV !== "production" ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : null}
        <title>Liste des députés</title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <header className="header">
        <h1 style={{ textAlign: "center" }}>Liste des députés</h1>
      </header>
      <div>
        <DeputiesList
          deputes={data.faunadb.DeputesEnMandat.data}
          groupesDetails={orderedGroupes}
        />
      </div>
    </Layout>
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
        }
      }
      GroupesParlementairesDetailsActifs(Actif: true) {
        data {
          Couleur
          Sigle
          Ordre
        }
      }
    }
  }
`
