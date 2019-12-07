import React from "react"
import styled from "styled-components"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import Layout from "Components/layout"

import DeputiesList from "../Components/DeputiesList/DeputiesList"
import { DeputesQueryQuery } from "../../types/graphql-types"

type DeputesQueryQueryProps = {
  data: DeputesQueryQuery
}

const IndexPage = ({ data }: DeputesQueryQueryProps) => {
  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Liste des députés</title>
      </Helmet>
      <header className="header">
        <h1>Liste des députés</h1>
      </header>
      <div>
        <DeputiesList data={data.augora.Deputes} />
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query DeputesQuery {
    augora {
      Deputes {
        groupeSigle
        lieuNaissance
        mandatDebut
        nom
        nomCirco
        nomDeFamille
        nombreMandats
        numCirco
        numDepartement
        partiRattFinancier
        placeEnHemicyle
        prenom
        profession
        sexe
        slug
        twitter
        dateNaissance
        adresses
        collaborateurs
        emails
        sitesWeb
      }
    }
  }
`
