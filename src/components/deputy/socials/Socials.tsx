import React, { useEffect, useState, useRef } from "react"
import ButtonIcon from "components/buttons/ButtonIcon"
import ContactTooltip from "src/components/tooltip/ContactTooltip"
import IconMail from "images/ui-kit/icon-mail.svg"
import IconWebsite from "images/ui-kit/icon-web.svg"
import IconTwitter from "images/ui-kit/icon-twitter.svg"
import IconFacebook from "images/ui-kit/icon-facebook.svg"
import IconInstagram from "images/ui-kit/icon-instagram.svg"
import IconLinkedIn from "images/ui-kit/icon-linkedin.svg"
import IconAssemblee from "images/ui-kit/icon-palace.svg"
import IconEuro from "images/ui-kit/icon-euro.svg"
import { slugify } from "src/utils/utils"

enum Button {
  Mail,
  Site,
}

export default function Socials({ deputy }: { deputy: Deputy.Deputy }) {
  const [isSiteTooltipVisible, setIsSiteTooltipVisible] = useState(false)
  const [isMailTooltipVisible, setIsMailTooltipVisible] = useState(false)

  const node = useRef<HTMLDivElement>()

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])

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
  const particule = deputy.NomDeFamille.includes("(")
  const slugifyNom = particule ? slugify(deputy.NomDeFamille).split("-") : ""
  const slugDeclaration =
    (particule ? slugifyNom[1] + "-" + slugifyNom[0] : slugify(deputy.NomDeFamille)) + "-" + slugify(deputy.Prenom)

  return (
    <div className="deputy__socials" ref={node}>
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
        onClick={deputy.URLAssembleeNationale && deputy.URLAssembleeNationale}
        className="btn--assemblee"
        title={"Assemblée Nationale"}
        deactivated={!deputy.URLAssembleeNationale}
        target="_blank"
      >
        <div className="icon-wrapper" style={{ width: "30px" }}>
          <IconAssemblee style={{ fill: deputy.GroupeParlementaire.Couleur }} />
        </div>
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
      <ButtonIcon
        onClick={`https://www.hatvp.fr/fiche-nominative/?declarant=${slugDeclaration}`}
        className="btn--declaration"
        title={"Declarations"}
        target="_blank"
      >
        <div className="icon-wrapper" style={{ width: "30px" }}>
          <div className="icon-wrapper" style={{ width: "30px" }}>
            <IconEuro style={{ fill: deputy.GroupeParlementaire.Couleur }} />
          </div>
        </div>
      </ButtonIcon>
    </div>
  )
}
