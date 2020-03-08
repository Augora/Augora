import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import "./Deputy.scss"

import styled from "styled-components"

import Layout from "Components/layout"

// import OldGeneralInformation from "Components/Deputy/GeneralInformation/OldGeneralInformation"
import GeneralInformation from "Components/Deputy/GeneralInformation/GeneralInformation"
import Coworkers from "Components/Deputy/Coworkers/Coworkers"
import MapCirco from "Components/Deputy/MapCirco/MapCirco"
import Mandate from "Components/Deputy/Mandate/Mandate"
// import CurrentMandate from "Components/Deputy/CurrentMandate/CurrentMandate"
// import OldMandates from "Components/Deputy/OldMandates/OldMandates"
// import OthersMandates from "Components/Deputy/OthersMandates/OthersMandates"
// import TotalMandates from "Components/Deputy/TotalMandates/TotalMandates"
import { SingleDeputyQuery } from "types/graphql-types"

import {
  getGender,
  getGeneralInformation,
  // getOldGeneralInformation,
  getCoworkers,
  getCirco,
  getMandate,
  // getGroupeColor,
} from "./Utils/Deputy.utils"

type SingleDeputyQueryProps = {
  data: SingleDeputyQuery
}

const DeputyStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 25vw;
  grid-gap: 20px;
  padding: 0px;
  min-height: 100vh;
`

function Deputy({ data }: SingleDeputyQueryProps) {
  const deputy = data.faunadb.Depute
  const color = deputy.GroupeParlementaire.Couleur
  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>
          {deputy.Prenom} {deputy.NomDeFamille} - {getGender(deputy)}{" "}
          {deputy.SigleGroupePolitique}
        </title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800|Playfair+Display:400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <h1>
        {deputy.Prenom} {deputy.NomDeFamille}
      </h1>
      <DeputyStyles className="single-deputy">
        {/* <OldGeneralInformation {...getOldGeneralInformation(deputy, 500)} /> */}
        <GeneralInformation
          {...getGeneralInformation(deputy, 150)}
          color={color}
          size="medium"
        />
        <Mandate
          {...getMandate(deputy)}
          // {...getOthersMandates(deputy)}
          // {...getTotalMandates(deputy)}
          color={color}
          size="small"
        />
        <Coworkers {...getCoworkers(deputy)} color={color} size="small" />
        <MapCirco {...getCirco(deputy)} color={color} size="medium" />
      </DeputyStyles>
    </Layout>
  )
}

export default Deputy

export const query = graphql`
  query SingleDeputy($slug: String!) {
    faunadb {
      Depute(Slug: $slug) {
        Age
        LieuDeNaissance
        DebutDuMandat
        GroupeParlementaire {
          Couleur
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
        SigleGroupePolitique
        SitesWeb
        Slug
        Twitter
        Collaborateurs
        AnciensMandats {
          data {
            DateDeDebut
            DateDeFin
            Intitule
          }
        }
        AutresMandats {
          data {
            Institution
            Localite
            Intitule
          }
        }
      }
    }
  }
`
