import Link from "next/link"
import React from "react"
import IconMail from "images/ui-kit/icon-mail.svg"
import IconTwitter from "images/ui-kit/icon-twitter.svg"

const Menu = (title, items) => {
  return (
    <div className={`menu footer__menu ${items.length > 0 ? "" : "menu--empty"}`}>
      {items.length > 0 ? (
        <>
          <h2>{title}</h2>
          {items.map((item) =>
            !item.internal ? (
              <a key={item.link} href={item.link} target={item.target ? "_blank" : ""}>
                {item.icon ? <div className="icon-wrapper">{item.icon}</div> : null}
                {item.label}
              </a>
            ) : (
              <Link key={item.link} href={item.link}>
                {item.icon ? <div className="icon-wrapper">{item.icon}</div> : null}
                {item.label}
              </Link>
            )
          )}
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
              label: "NextJS",
              link: "https://nextjs.org/",
              target: true,
              internal: false,
            },
            {
              label: "React",
              link: "https://reactjs.org/",
              target: true,
              internal: false,
            },
            {
              label: "GraphQL",
              link: "https://graphql.org/",
              target: true,
              internal: false,
            },
            {
              label: "Fauna",
              link: "https://fauna.com/",
              target: true,
              internal: false,
            },
            {
              label: "Mapbox",
              link: "https://www.mapbox.com/",
              target: true,
              internal: false,
            },
            {
              label: "Visx",
              link: "https://airbnb.io/visx/",
              target: true,
              internal: false,
            },
          ])}
          {Menu("Liens utiles", [
            {
              label: "Nosdéputés.fr",
              link: "https://www.nosdeputes.fr/",
              target: true,
              internal: false,
            },
            {
              label: "Regards Citoyens",
              link: "https://www.regardscitoyens.org/",
              target: true,
              internal: false,
            },
            {
              label: "Accropolis",
              link: "http://accropolis.fr/",
              target: true,
              internal: false,
            },
            {
              label: "Mentions légales",
              link: "/mention-legales",
              target: false,
              internal: false,
            },
          ])}
          {Menu("Nous contacter", [
            {
              label: "contact@augora.fr",
              link: "mailto:contact@augora.fr",
              target: true,
              internal: false,
              icon: <IconMail />,
            },
            {
              label: "@AugoraFR",
              link: "https://twitter.com/AugoraFR",
              target: true,
              internal: false,
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
