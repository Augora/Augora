import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import styled from "styled-components"

import GeneralInformation from "../Components/Deputy/GeneralInformation/GeneralInformation"
import Coworkers from "../Components/Deputy/Coworkers/Coworkers"
import CurrentMandate from "../Components/Deputy/CurrentMandate/CurrentMandate"

import {
  getGender,
  getGeneralInformation,
  getCoworkers,
  getCirco,
  getCurrentMandate
} from "./Utils/Deputy.utils"

import { SingleDeputyQuery } from "types/graphql-types"
import MapCirco from "Components/Deputy/MapCirco/MapCirco"

type SingleDeputyQueryProps = {
  data: SingleDeputyQuery
}

const DeputyStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 25vw;
  grid-gap: 20px;
  padding: 20px;
  min-height: 100vh;
`

function Deputy({ data }: SingleDeputyQueryProps) {
  const deputy = data.augora.Depute
  // console.log(deputy)
  return (
    <DeputyStyles className="single-deputy">
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>
          {deputy.prenom} {deputy.nomDeFamille} - {getGender(deputy)}{" "}
          {deputy.groupeSigle}
        </title>
      </Helmet>
      <GeneralInformation {...getGeneralInformation(deputy, 500)} />
      <Coworkers {...getCoworkers(deputy)} />
      <MapCirco {...getCirco(deputy)} />
      <CurrentMandate {...getCurrentMandate(deputy)} />
    </DeputyStyles>
  )
}

export default Deputy

export const query = graphql`
  query SingleDeputy($slug: DeputesEnMandat_string!) {
    augora {
      Depute(slug: $slug) {
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
        collaborateurs
        estEnMandat
      }
    }
  }
`
