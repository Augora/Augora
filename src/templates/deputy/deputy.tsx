import React from "react"
import Helmet from "react-helmet"
import { colors } from "utils/variables"
import { graphql } from "gatsby"

import styled from "styled-components"
import Layout from "components/layout"

import Coworkers from "components/deputy/coworkers/Coworkers"
import MapDistrict from "components/deputy/map-district/MapDistrict"
import { getGender } from "../../utils/augora-objects/deputy/gender"
import { getGeneralInformation } from "../../utils/augora-objects/deputy/information"
import { getMandate } from "../../utils/augora-objects/deputy/mandate"
import { getCoworkers } from "../../utils/augora-objects/deputy/coworker"
import GeneralInformation from "components/deputy/general-information/GeneralInformation"
import Mandate from "components/deputy/mandate/Mandate"
import Contact from "components/deputy/contact/Contact"
import Presence from "components/deputy/presence/Presence"

import IconMail from "images/ui-kit/icon-mail.svg"
import IconWebsite from "images/ui-kit/icon-web.svg"
// import IconFacebook from 'images/ui-kit/icon-facebook.svg'
import IconTwitter from "images/ui-kit/icon-twitter.svg"

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

const DeputyStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 500px;
  grid-gap: 30px;
  padding: 0px;
  min-height: 100vh;
`

function Deputy({ data }) {
  const deputy = data.faunadb.Depute
  const color = deputy.GroupeParlementaire.Couleur
  return (
    <Layout>
      <Helmet>
        {process.env.GATSBY_TARGET_ENV !== "production" ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : null}
        <title>
          {deputy.Prenom} {deputy.NomDeFamille} - {getGender(deputy.Sexe)}{" "}
          {deputy.GroupeParlementaire.Sigle}
        </title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800|https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap"
          rel="stylesheet"
        />
        <style>{`:root {\n${allColors.join("")}
      --groupe-color: ${color};}`}</style>
      </Helmet>
      <div className="deputy__header">
        <h1>
          {deputy.Prenom} {deputy.NomDeFamille}
        </h1>
        <div className="deputy__contact">
          <a href={`mailto:${deputy.Emails[0]}`} className="btn btn--mail">
            <div className="deputy__icon">
              <IconMail />
            </div>
          </a>
          <a
            href={deputy.SitesWeb[0]}
            className="btn btn--website"
            target="_blank"
          >
            <div className="deputy__icon">
              <IconWebsite />
            </div>
          </a>
          {/* <a href="" className="btn btn--facebook">
            <div className="deputy__icon">
              <IconFacebook />
            </div>
          </a> */}
          <a
            href={`https://twitter.com/${deputy.Twitter}`}
            className="btn btn--twitter"
            target="_blank"
          >
            <div className="deputy__icon">
              <IconTwitter />
            </div>
          </a>
        </div>
      </div>
      <DeputyStyles className="single-deputy">
        <GeneralInformation
          {...getGeneralInformation(deputy, 150)}
          color={color}
          size="medium"
          dateBegin={deputy.DateDeNaissance}
        />
        <Mandate {...getMandate(deputy)} color={color} size="small" />
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
        Emails
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
        SitesWeb
        Slug
        Twitter
        Collaborateurs
        DateDeNaissance
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
