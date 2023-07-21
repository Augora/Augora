import React from "react"
import Link from "next/link"
import { NextRouter } from "next/router"
import Logo from "images/logos/projet/augora-logo.svg"
import LogoText from "images/logos/projet/augora-text.svg"
import LogoTextThin from "images/logos/projet/augora-text-thin.svg"
import IconBurger from "images/ui-kit/icon-burger.svg"
import { getHSLLightVariation } from "../utils/style/color"

interface IHeader {
  siteTitle?: string
  color?: Color.HSL
  onBurgerClick?(): void
  location: NextRouter
}

type Pages = {
  [key: string]: {
    path: string
    title: string
  }
}

const mainPages: Pages = {
  home: {
    path: "/",
    title: "Accueil",
  },
  deputes: {
    path: "/deputes",
    title: "Députés",
  },
  statistiques: {
    path: "/statistiques",
    title: "Statistiques",
  },
  map: {
    path: "/carte/france",
    title: "Carte",
  },
}

const secondaryPages: Pages = {
  // about: {
  //   path: "/about",
  //   title: "A propos de nous",
  // },
  faq: {
    path: "/faq",
    title: "FAQ",
  },
}

function HeaderLinks({ pageGroup, location, styles }: { pageGroup: Pages; location: NextRouter; styles? }) {
  return (
    <>
      {Object.keys(pageGroup).map((page, index) => {
        const isCurrent =
          pageGroup[page].path !== "/carte/france"
            ? location.pathname === pageGroup[page].path
            : location.pathname.startsWith("/map")
        const className = `menu__item ${isCurrent ? "menu__item--current" : ""}`

        return (
          <div className="menu__link" key={pageGroup[page].path}>
            <Link href={pageGroup[page].path} className={className}>
              <span>{pageGroup[page].title}</span>
              <div className="link__underline"></div>
            </Link>
            <Link href={pageGroup[page].path} className={className} style={styles?.link}>
              <span>{pageGroup[page].title}</span>
              <div className="link__underline" style={styles?.underline}></div>
            </Link>
          </div>
        )
      })}
    </>
  )
}

/**
 * Renvoie le header
 * @param {RouteProps} location Objet du react router contenant les infos de route
 * @param {Group.HSLDetail} [color] Couleur du header optionnelle
 */
const Header = ({ siteTitle = "", location, color, onBurgerClick }: IHeader) => {
  const decorationOpacity = 1

  const gradient = color && { start: getHSLLightVariation(color, -20), end: getHSLLightVariation(color, -30) }

  const styles = color && {
    link: { color: `hsla(${color.H}, ${color.S}%, ${color.L}%)` },
    svg: { fill: `hsla(${color.H}, ${color.S}%, ${color.L}%)` },
    underline: {
      background: `linear-gradient(to right, hsla(${color.H}, ${color.S}%, ${gradient.start}%, ${decorationOpacity}), hsla(${color.H}, ${color.S}%, ${gradient.end}%, ${decorationOpacity}))`,
    },
    separator: {
      background: `linear-gradient(to bottom, hsla(${color.H}, ${color.S}%, ${gradient.start}%, ${decorationOpacity}), hsla(${color.H}, ${color.S}%, ${gradient.end}%, ${decorationOpacity}))`,
    },
  }

  return (
    <header id="header" className="header">
      <div className="header__wrapper wrapper">
        <Link href="/" className="header__home-btn" aria-label="Logo page d'accueil">
          <div className="header__logo-wrapper">
            <div className="header__logo">
              <Logo className="logo" />
              <Logo className="logo" {...(styles && { style: styles.svg })} />
            </div>
            <div className="header__text">
              <LogoText className="text" />
              <LogoTextThin className="text" {...(styles && { style: styles.svg })} />
            </div>
          </div>
        </Link>
        <div className="header__menu menu">
          <HeaderLinks pageGroup={mainPages} location={location} styles={styles} />
          <div className="menu__separator-container">
            <span className="menu__separator" />
            <span className="menu__separator" {...(styles && { style: styles.separator })} />
          </div>
          <HeaderLinks pageGroup={secondaryPages} location={location} styles={styles} />
          <button className="menu__burger-btn" onClick={() => onBurgerClick()}>
            <div className="menu__burger-icon">
              <IconBurger className="icon" />
              <IconBurger className="icon" {...(styles && { style: styles.svg })} />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
