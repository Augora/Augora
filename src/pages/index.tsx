import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import Layout from "components/layout"

import DeputiesList from "../components/deputies-list/DeputiesList"
import { DeputesQueryQuery } from "../types/graphql-types"

type DeputesQueryQueryProps = {
  data: DeputesQueryQuery
}

const IndexPage = ({ data }: DeputesQueryQueryProps) => {
  const orderedGroupes = data.faunadb.GroupesParlementairesDetails.data.sort(
    (a, b) => a.Ordre - b.Ordre
  )
  return (
    <Layout>
      <Helmet>
        {process.env.TARGET_ENV !== "production" ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : null}
        <title>Liste des députés</title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <header className="header">
        <h1>Liste des députés</h1>
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
          SigleGroupePolitique
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
          Adresses
          Collaborateurs
          Emails
          SitesWeb
          URLPhotoAugora
        }
      }
      GroupesParlementairesDetails {
        data {
          Couleur
          Sigle
          Ordre
        }
      }
    }
  }
`
