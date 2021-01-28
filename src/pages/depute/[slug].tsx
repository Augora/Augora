import React from "react"
import fs from "fs"
import Head from "next/head"
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
import ButtonIcon from "components/buttons/ButtonIcon"
import IconMail from "images/ui-kit/icon-mail.svg"
import IconWebsite from "images/ui-kit/icon-web.svg"
import IconTwitter from "images/ui-kit/icon-twitter.svg"
import IconFacebook from "images/ui-kit/icon-facebook.svg"
import SEO, { PageType } from "components/seo/seo"

interface IDeputy {
  depute: Deputy.Deputy
}

// const allColors = colors.map((color) => {
//   return "--" + color.name + "-color :" + color.hex + ";\n"
// })

export default function Deputy({ depute }: IDeputy) {
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
                <IconMail style={{ fill: deputy.GroupeParlementaire.Couleur }} />
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
                <IconWebsite style={{ fill: deputy.GroupeParlementaire.Couleur }} />
              </div>
            </ButtonIcon>
            <ButtonIcon
              onClick={deputy.URLTwitter && deputy.URLTwitter}
              className={`btn--twitter ${!deputy.URLTwitter ? "btn--deactivated" : ""}`}
              title={"Twitter"}
              deactivated={!deputy.URLTwitter}
              target="_blank"
            >
              <div className="icon-wrapper" style={{ width: "30px" }}>
                <IconTwitter style={{ fill: deputy.GroupeParlementaire.Couleur }} />
              </div>
            </ButtonIcon>
            <ButtonIcon
              onClick={deputy.URLFacebook && deputy.URLFacebook}
              className={`btn--facebook ${!deputy.URLFacebook ? "btn--deactivated" : ""}`}
              title={"Facebook"}
              deactivated={!deputy.URLFacebook}
              target="_blank"
            >
              <div className="icon-wrapper" style={{ width: "30px" }}>
                <IconFacebook style={{ fill: deputy.GroupeParlementaire.Couleur }} />
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
