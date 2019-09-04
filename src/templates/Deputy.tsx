import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import GeneralInformation from "../Components/Deputy/GeneralInformation/GeneralInformation"
import {
  getGender,
  getGeneralInformation,
  // getCoworkers
} from "./Utils/Deputy.utils"
// import Coworkers from "../Components/Deputy/Coworkers/Coworkers";
import styled from "styled-components"

import { SingleDeputyQuery } from "../../types/graphql-types"

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
      }
    }
  }
`
