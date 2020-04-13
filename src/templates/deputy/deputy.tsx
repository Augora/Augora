import React from "react"
import Helmet from "react-helmet"
import { colors } from "utils/variables"
import { graphql } from "gatsby"
import "./deputy.scss"

import styled from "styled-components"
import Layout from "components/layout"

import Coworkers from "components/deputy/coworkers/Coworkers"
import MapDistrict from "components/deputy/map-district/MapDistrict"
import { SingleDeputyQuery } from "types/graphql-types"
import { getGender } from "../../utils/augora-objects/deputy/gender"
import { getGeneralInformation } from "../../utils/augora-objects/deputy/information"
import { getMandate } from "../../utils/augora-objects/deputy/mandate"
import { getCoworkers } from "../../utils/augora-objects/deputy/coworker"
import GeneralInformation from "components/deputy/general-information/GeneralInformation"
import Mandate from "components/deputy/mandate/Mandate"
import Contact from "components/deputy/contact/Contact"
import Presence from "components/deputy/presence/Presence"

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

type SingleDeputyQueryProps = {
  data: SingleDeputyQuery
}

const DeputyStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 500px;
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
        {process.env.TARGET_ENV !== "production" ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : null}
        <title>
          {deputy.Prenom} {deputy.NomDeFamille} - {getGender(deputy.Sexe)}{" "}
          {deputy.SigleGroupePolitique}
        </title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800|Playfair+Display:400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
        <style>{`:root {\n${allColors.join("")}
      --groupe-color: ${color};}`}</style>
      </Helmet>
      <h1>
        {deputy.Prenom} {deputy.NomDeFamille}
      </h1>
      <DeputyStyles className="single-deputy">
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
        <MapDistrict
          nom={deputy.NomCirconscription}
          num={deputy.NumeroCirconscription}
          color={color}
          size="medium"
        />
        <Presence color={color} size="large" wip={true} />
        <Contact
          color={color}
          size="medium"
          adresses={deputy.AdressesDetails.data}
        />
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
        AdressesDetails {
          data {
            Adresse
            CodePostal
            Telephone
          }
        }
      }
    }
  }
`
