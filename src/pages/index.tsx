import React from "react"
import styled from "styled-components"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import DeputiesList from "../components/DeputiesList/DeputiesList"
import { DeputesQueryQuery } from "../../types/graphql-types"

type DeputesQueryQueryProps = {
  data: DeputesQueryQuery
}

const DeputiesStyles = styled.section`
  margin-top: 120px;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  padding: 100px 10px 10px 10px;
`

const IndexPage = ({ data }: DeputesQueryQueryProps) => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Liste des députés</title>
      </Helmet>
      <header className="header">
        <h1>Liste des députés</h1>
        <a href="/">Retour à l'accueil</a>
      </header>
      <DeputiesStyles>
        <DeputiesList data={data.augora.Deputes} />
      </DeputiesStyles>
    </>
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
