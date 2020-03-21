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
  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
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
          groupes={data.faunadb.GroupesParlementaires}
          groupesDetails={data.faunadb.GroupesParlementairesDetails}
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
        }
      }
      GroupesParlementaires
      GroupesParlementairesDetails {
        data {
          Couleur
          Sigle
        }
      }
    }
  }
`
