// import { Link } from "gatsby"
import React from "react"
import IconMail from "../../src/images/ui-kit/icon-mail.svg"
import IconTwitter from "../../src/images/ui-kit/icon-twitter.svg"

const Menu = (title, items) => {
  return (
    <div
      className={`menu footer__menu ${items.length > 0 ? "" : "menu--empty"}`}
    >
      {items.length > 0 ? (
        <>
          <h2>{title}</h2>
          {items.map((item) => (
            <a href={item.link} target={item.target ? "_blank" : ""}>
              {item.icon ? (
                <div className="icon-wrapper">{item.icon}</div>
              ) : null}
              {item.label}
            </a>
          ))}
        </>
      ) : null}
    </div>
  )
}

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
          {Menu("Ressources", [
            {
              label: "Gatsby",
              link: "https://www.gatsbyjs.org/",
              target: true,
            },
            {
              label: "React",
              link: "https://reactjs.org/",
              target: true,
            },
            {
              label: "GraphQL",
              link: "https://graphql.org/",
              target: true,
            },
            {
              label: "Fauna",
              link: "https://fauna.com/",
              target: true,
            },
            {
              label: "Mapbox",
              link: "https://www.mapbox.com/",
              target: true,
            },
          ])}
          {Menu("Liens utiles", [
            {
              label: "Nosdéputés.fr",
              link: "https://www.nosdeputes.fr/",
              target: true,
            },
            {
              label: "Regards Citoyens",
              link: "https://www.regardscitoyens.org/",
              target: true,
            },
            {
              label: "Accropolis",
              link: "http://accropolis.fr/",
              target: true,
            },
            {
              label: "Mentions légales",
              link: "/mention-legales",
            },
          ])}
          {Menu("Contact", [
            {
              label: "contact@augora.fr",
              link: "mailto:contact@augora.fr",
              icon: <IconMail />,
            },
            {
              label: "@AugoraFR",
              link: "https://twitter.com/AugoraFR",
              target: true,
              icon: <IconTwitter />,
            },
          ])}
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
