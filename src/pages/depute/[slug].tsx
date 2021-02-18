import React, { useEffect, useRef, useState } from "react"
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
import ContactTooltip from "src/components/tooltip/ContactTooltip"
import IconMail from "images/ui-kit/icon-mail.svg"
import IconWebsite from "images/ui-kit/icon-web.svg"
import IconTwitter from "images/ui-kit/icon-twitter.svg"
import IconFacebook from "images/ui-kit/icon-facebook.svg"
import IconInstagram from "images/ui-kit/icon-instagram.svg"
import IconLinkedIn from "images/ui-kit/icon-linkedin.svg"
import SEO, { PageType } from "components/seo/seo"
import sortBy from "lodash/sortBy"

enum Button {
  Mail,
  Site,
}

interface IDeputy {
  depute: Deputy.Deputy
  activites: { [Activites: string]: { [data: string]: Deputy.Activite[] } }[]
}

export default function Deputy({ depute, activites }: IDeputy) {
  const [isSiteTooltipVisible, setIsSiteTooltipVisible] = useState(false)
  const [isMailTooltipVisible, setIsMailTooltipVisible] = useState(false)
  const node = useRef<HTMLDivElement>()

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])

  const deputy = depute
  const color = deputy.GroupeParlementaire.Couleur

  const medianeActivity = activites[0].Activites.data.map((data) => {
    const activitySorted = sortBy(
      activites.map((activite) => {
        const result = activite.Activites.data.find((d) => {
          return d.NumeroDeSemaine === data.NumeroDeSemaine
        })
        return result
      }),
      (o) => (!o ? undefined : o.PresenceEnHemicycle + o.PresencesEnCommission)
    )

    const positionMediane = (activitySorted.length + 1) / 2
    if (positionMediane % 2 == 0) return activitySorted[positionMediane]
    else {
      const valeurMediane = activitySorted[(Math.floor(positionMediane) + Math.ceil(positionMediane)) / 2]
      return valeurMediane
    }
  })

  const handleClick = (e) => {
    if (node?.current) {
      if (!node.current.contains(e.target)) {
        setIsSiteTooltipVisible(false)
        setIsMailTooltipVisible(false)
      }
    }
  }

  const handleBtnClick = (links: string[], button: Button) => {
    if (links.length) {
      switch (button) {
        case Button.Mail:
          return links.length > 1 ? () => setIsMailTooltipVisible(!isMailTooltipVisible) : `mailto:${deputy.Emails[0]}`
        case Button.Site:
          return links.length > 1 ? () => setIsSiteTooltipVisible(!isSiteTooltipVisible) : deputy.SitesWeb[0]
        default:
          return ""
      }
    } else return ""
  }

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
          <div className="deputy__contact" ref={node}>
            <ButtonIcon
              onClick={handleBtnClick(deputy.Emails, Button.Mail)}
              className="btn--mail"
              title={"Adresse(s) e-mail"}
              deactivated={deputy.Emails.length < 1}
              color={deputy.GroupeParlementaire.Couleur}
            >
              <div className="icon-wrapper">
                <IconMail style={{ fill: deputy.GroupeParlementaire.Couleur }} />
              </div>
              {isMailTooltipVisible && <ContactTooltip links={deputy.Emails} />}
            </ButtonIcon>
            <ButtonIcon
              onClick={handleBtnClick(deputy.SitesWeb, Button.Site)}
              className="btn--website"
              title={"Site(s) Web"}
              deactivated={deputy.SitesWeb.length < 1}
              target="_blank"
            >
              <div className="icon-wrapper" style={{ width: "30px" }}>
                <IconWebsite style={{ fill: deputy.GroupeParlementaire.Couleur }} />
              </div>
              {isSiteTooltipVisible && <ContactTooltip links={deputy.SitesWeb} title="Visiter le site" target="_blank" />}
            </ButtonIcon>
            <ButtonIcon
              onClick={deputy.URLTwitter && deputy.URLTwitter}
              className="btn--twitter"
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
              className="btn--facebook"
              title={"Facebook"}
              deactivated={!deputy.URLFacebook}
              target="_blank"
            >
              <div className="icon-wrapper" style={{ width: "30px" }}>
                <IconFacebook style={{ fill: deputy.GroupeParlementaire.Couleur }} />
              </div>
            </ButtonIcon>
            {deputy.URLInstagram && (
              <ButtonIcon onClick={deputy.URLInstagram} className="btn--instagram" title={"Instagram"} target="_blank">
                <div className="icon-wrapper" style={{ width: "30px" }}>
                  <IconInstagram style={{ fill: deputy.GroupeParlementaire.Couleur }} />
                </div>
              </ButtonIcon>
            )}
            {deputy.URLLinkedIn && (
              <ButtonIcon onClick={deputy.URLLinkedIn} className="btn--linkedin" title={"LinkedIn"} target="_blank">
                <div className="icon-wrapper" style={{ width: "30px" }}>
                  <IconLinkedIn style={{ fill: deputy.GroupeParlementaire.Couleur }} />
                </div>
              </ButtonIcon>
            )}
          </div>
        </div>
        <div className="deputy__content">
          <GeneralInformation {...getGeneralInformation(deputy)} color={color} size="medium" dateBegin={deputy.DateDeNaissance} />
          <Mandate {...getMandate(deputy)} color={color} size="small" />
          <Coworkers {...getCoworkers(deputy)} color={color} size="small" />
          <MapDistrict deputy={deputy} color={color} size="medium" />
          <Presence color={color} size="large" activite={deputy.Activites.data} mediane={medianeActivity} wip={true} />
          <Contact color={color} size="medium" adresses={deputy.AdressesDetails.data} />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ params: { slug } }) {
  const deputeAndActivites = await getDepute(slug)
  return {
    props: {
      depute: deputeAndActivites.Depute,
      activites: deputeAndActivites.DeputesEnMandat.data,
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
