import React from "react"
import fs from "fs"
import Head from "next/head"
import { colors } from "utils/variables"
import { getDepute, getDeputesSlugs } from "../../lib/deputes/Wrapper"

import Coworkers from "components/deputy/coworkers/Coworkers"
import MapDistrict from "components/deputy/map-district/MapDistrict"
import { getGender } from "utils/augora-objects/deputy/gender"
import { getGeneralInformation } from "utils/augora-objects/deputy/information"
import { getMandate } from "utils/augora-objects/deputy/mandate"
import { getCoworkers } from "utils/augora-objects/deputy/coworker"
import GeneralInformation from "components/deputy/general-information/GeneralInformation"
import Mandate from "components/deputy/mandate/Mandate"
import Contact from "components/deputy/contact/Contact"
import Presence from "components/deputy/presence/Presence"

import isEmpty from "lodash/isEmpty"

import ButtonIcon from "components/buttons/ButtonIcon"
import IconMail from "images/ui-kit/icon-mail.svg"
import IconWebsite from "images/ui-kit/icon-web.svg"
import IconTwitter from "images/ui-kit/icon-twitter.svg"
import SEO, { PageType } from "components/seo/seo"

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

export default function Deputy({ depute }) {
  const deputy = depute
  const color = deputy.GroupeParlementaire.Couleur
  return (
    <>
      <SEO pageType={PageType.Depute} depute={deputy} />
      <Head>
        <style>{`:root { --groupe-color: ${color}; }`}</style>
      </Head>
      <div className="page page__deputy">
        <div className="deputy__header">
          <h1>
            {deputy.Prenom} {deputy.NomDeFamille}
          </h1>
          <div className="deputy__contact">
            <ButtonIcon
              onClick={deputy.Emails.length > 0 ? `mailto:${deputy.Emails[0]}` : ""}
              className={`btn--mail ${deputy.Emails.length < 1 ? "btn--deactivated" : ""}`}
              title={"Adresse e-mail"}
              deactivated={deputy.Emails.length < 1}
              color={deputy.GroupeParlementaire.Couleur}
            >
              <div className="icon-wrapper">
                <svg className="icon-mail" viewBox="0 0 250 199.24">
                  <title>icon-mail</title>
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M114.93,121.8a14.29,14.29,0,0,0,20.15,0l86.51-86.51c5.54-5.54,3.66-10.08-4.17-10.08H32.59c-7.84,0-9.71,4.54-4.17,10.08Z"
                    transform="translate(0 -25.21)"
                  />
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M71.2,114.7,10.08,53.58C4.53,48,0,49.91,0,57.75V191.8c0,7.84,4.53,9.71,10.08,4.17L71.2,134.85A14.29,14.29,0,0,0,71.2,114.7Z"
                    transform="translate(0 -25.21)"
                  />
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M160.48,153.18a14.29,14.29,0,0,0-20.15,0l-5.25,5.25a14.38,14.38,0,0,1-20.22-.07l-5.2-5.19a14.29,14.29,0,0,0-20.15,0L28.3,214.38c-5.54,5.54-3.66,10.07,4.17,10.07h185c7.84,0,9.72-4.53,4.18-10.07Z"
                    transform="translate(0 -25.21)"
                  />
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M239.92,53.59,178.8,114.72a14.27,14.27,0,0,0,0,20.15L239.92,196c5.55,5.54,10.08,3.66,10.08-4.18V57.76C250,49.92,245.47,48.05,239.92,53.59Z"
                    transform="translate(0 -25.21)"
                  />
                </svg>
              </div>
            </ButtonIcon>
            <ButtonIcon
              onClick={deputy.SitesWeb.length > 0 ? deputy.SitesWeb[0] : ""}
              className={`btn--website ${deputy.Emails.length < 1 ? "btn--deactivated" : ""}`}
              title={"Site Web"}
              deactivated={deputy.SitesWeb.length < 1}
              target="_blank"
            >
              <div className="icon-wrapper" style={{ width: "30px" }}>
                <svg className="icon-web" viewBox="0 0 247.6 246.2">
                  <title>icon-web</title>
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M230.4,22.1L230.4,22.1c-21.4-21.4-56.2-21.4-77.6,0l-31.6,31.6c-1.7,1.7-0.7,4.7,1.8,4.9
                    c7.3,0.7,14.5,2.6,21.4,5.7c1.1,0.5,2.4,0.3,3.3-0.6l19.7-19.7c11.4-11.4,29.8-11.4,41.2,0l0,0c11.4,11.4,11.4,29.8,0,41.2
                    L161,132.7c-11.4,11.4-29.8,11.4-41.2,0l0,0c-18.6-16.3-34.5,3.3-26.8,16.6c0,0,3.1,3.7,4.8,5.5l0,0c21.4,21.4,56.2,21.4,77.6,0
                    l55-55C251.9,78.2,251.9,43.5,230.4,22.1z"
                  />
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M17.2,224.2L17.2,224.2c21.4,21.4,56.2,21.4,77.6,0l31.6-31.6c1.7-1.7,0.7-4.7-1.8-4.9
                    c-7.3-0.7-14.5-2.6-21.4-5.7c-1.1-0.5-2.4-0.3-3.3,0.6l-19.7,19.7c-11.4,11.4-29.8,11.4-41.2,0l0,0c-11.4-11.4-11.4-29.8,0-41.2
                    l47.4-47.4c11.4-11.4,29.8-11.4,41.2,0l0,0c18.6,16.3,34.5-3.3,26.8-16.6c0,0-3.1-3.7-4.8-5.5l0,0c-21.4-21.4-56.2-21.4-77.6,0
                    l-55,55C-4.3,168-4.3,202.7,17.2,224.2z"
                  />
                </svg>
              </div>
            </ButtonIcon>
            <ButtonIcon
              onClick={!isEmpty(deputy.Twitter) ? `https://twitter.com/${deputy.Twitter}` : ""}
              className={`btn--twitter ${isEmpty(deputy.Twitter) ? "btn--deactivated" : ""}`}
              title={"Twitter"}
              deactivated={isEmpty(deputy.Twitter)}
              target="_blank"
            >
              <div className="icon-wrapper" style={{ width: "30px" }}>
                <svg className="icon-twitter" viewBox="0 0 512 512">
                  <title>icon-twitter</title>
                  <path
                    style={{ fill: deputy.GroupeParlementaire.Couleur }}
                    d="M512,97.2c-19,8.4-39.3,13.9-60.5,16.6c21.8-13,38.4-33.4,46.2-58c-20.3,12.1-42.7,20.6-66.6,25.4
                    C411.9,60.7,384.4,48,354.5,48c-58.1,0-104.9,47.2-104.9,105c0,8.3,0.7,16.3,2.4,23.9c-87.3-4.3-164.5-46.1-216.4-109.8
                    c-9.1,15.7-14.4,33.7-14.4,53.1c0,36.4,18.7,68.6,46.6,87.2c-16.9-0.3-33.4-5.2-47.4-12.9c0,0.3,0,0.7,0,1.2
                    c0,51,36.4,93.4,84.1,103.1c-8.5,2.3-17.9,3.5-27.5,3.5c-6.7,0-13.5-0.4-19.9-1.8c13.6,41.6,52.2,72.1,98.1,73.1
                    c-35.7,27.9-81.1,44.8-130.1,44.8c-8.6,0-16.9-0.4-25.1-1.4c46.5,30,101.6,47.1,161,47.1c193.2,0,298.8-160,298.8-298.7
                    c0-4.6-0.2-9.1-0.4-13.6C480.2,137,497.7,118.5,512,97.2z"
                  />
                </svg>
              </div>
            </ButtonIcon>
          </div>
        </div>
        <div className="deputy__content">
          <GeneralInformation {...getGeneralInformation(deputy)} color={color} size="medium" dateBegin={deputy.DateDeNaissance} />
          <Mandate {...getMandate(deputy)} color={color} size="small" />
          <Coworkers {...getCoworkers(deputy)} color={color} size="small" />
          <MapDistrict deputy={deputy} color={color} size="medium" />
          <Presence color={color} size="large" wip={true} />
          <Contact color={color} size="medium" adresses={deputy.AdressesDetails.data} />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ params: { slug } }) {
  const depute = await getDepute(slug)

  return {
    props: {
      depute,
    },
  }
}

export async function getStaticPaths() {
  if (!fs.existsSync(".cache/")) {
    fs.mkdirSync(".cache")
  }
  var paths = null
  if (process.env.USE_CACHE) {
    if (fs.existsSync(".cache/DeputesSlugs.json")) {
      paths = JSON.parse(fs.readFileSync(".cache/DeputesSlugs.json").toString())
    }
  }

  if (!paths) {
    const deputes = await getDeputesSlugs()
    paths = deputes.data.DeputesEnMandat.data.map((d) => ({
      params: {
        slug: d.Slug,
      },
    }))
    if (process.env.USE_CACHE) {
      fs.writeFileSync(".cache/DeputesSlugs.json", JSON.stringify(paths))
    }
  }

  return {
    paths,
    fallback: false,
  }
}
