import Link from "next/link"
import React from "react"
import IconMail from "images/ui-kit/icon-mail.svg"
import IconTwitter from "images/ui-kit/icon-twitter.svg"

type IFooterLink = {
  label: string
  link: string
  target?: boolean
  /** Si le lien est une page d'augora, il est interne */
  internal: boolean
  children?: React.ReactNode
}

/**
 * Renvoie un lien du footer, peut recevoir un child
 * @param label Texte affiché pour cliquer
 * @param link L'URL
 * @param target blank ou rien
 * @param internal Si le lien est une page d'augora, il est interne
 */
const FooterLink = (props: IFooterLink) => {
  return !props.internal ? (
    <a key={props.link} href={props.link} target={props.target ? "_blank" : ""} rel={props.target ? "noopener noreferrer" : ""}>
      {props.children && props.children}
      {props.label}
    </a>
  ) : (
    <Link key={props.link} href={props.link}>
      {props.children && props.children}
      {props.label}
    </Link>
  )
}

/**
 * Renvoie un paragraphe / container de liens du footer
 * @param title Le titre du paragraphe
 */
const FooterMenu = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <div className={`menu footer__menu ${children ? "" : "menu--empty"}`}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

/**
 * Renvoie le footer, pas d'arguments
 */
const Footer = () => {
  return (
    <footer
      style={{
        padding: `20px 40px`,
        backgroundColor: `#262626`,
        color: `white`,
      }}
      className="footer"
    >
      <div className="wrapper footer__wrapper">
        <div className="footer__menus">
          <FooterMenu title="Ressources">
            <FooterLink label="NextJS" link="https://nextjs.org/" target={true} internal={false} />
            <FooterLink label="React" link="https://reactjs.org/" target={true} internal={false} />
            <FooterLink label="GraphQL" link="https://graphql.org/" target={true} internal={false} />
            <FooterLink label="Supabase" link="https://supabase.com/" target={true} internal={false} />
            <FooterLink label="Mapbox" link="https://www.mapbox.com/" target={true} internal={false} />
          </FooterMenu>
          <FooterMenu title="Liens Utiles">
            <FooterLink label="Nosdéputés.fr" link="https://www.nosdeputes.fr/" target={true} internal={false} />
            <FooterLink label="Regards Citoyens" link="https://www.regardscitoyens.org/" target={true} internal={false} />
            <FooterLink label="Accropolis.fr" link="http://accropolis.fr/" target={true} internal={false} />
            <FooterLink label="Mentions légales" link="/mention-legales" target={false} internal={true} />
            <FooterLink label="Nous soutenir" link="https://utip.io/augora" target={true} internal={false} />
          </FooterMenu>
          <FooterMenu title="Nous Contacter">
            <FooterLink label="contact@augora.fr" link="mailto:contact@augora.fr" target={true} internal={false}>
              <div className="icon-wrapper">
                <IconMail />
              </div>
            </FooterLink>
            <FooterLink label="@AugoraFR" link="https://twitter.com/AugoraFR" target={true} internal={false}>
              <div className="icon-wrapper">
                <IconTwitter />
              </div>
            </FooterLink>
          </FooterMenu>
        </div>
        <div className="footer__credentials">
          <div>
            Copyright &copy; {new Date().getFullYear()} <strong>Augora</strong>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
